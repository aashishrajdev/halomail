// Package email sends transactional mail via Resend (HTTP API) or SMTP
// (Mailpit locally). The Sender interface lets callers stay provider-agnostic.
package email

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/mail"
	"net/smtp"
	"strings"
	"time"

	"github.com/aashishrajdev/halomail/services/shared/idgen"
)

// Message is a transactional email.
type Message struct {
	To      []string
	From    string
	ReplyTo string
	Subject string
	HTML    string
	Text    string
}

// Sender delivers a Message, returning a provider message id and the provider name.
type Sender interface {
	Send(ctx context.Context, msg Message) (id, provider string, err error)
}

// ---- Resend --------------------------------------------------------------

type ResendSender struct {
	apiKey      string
	defaultFrom string
	client      *http.Client
}

func NewResend(apiKey, defaultFrom string) *ResendSender {
	return &ResendSender{apiKey: apiKey, defaultFrom: defaultFrom, client: &http.Client{Timeout: 15 * time.Second}}
}

func (s *ResendSender) Send(ctx context.Context, msg Message) (string, string, error) {
	from := firstNonEmpty(msg.From, s.defaultFrom)
	payload := map[string]any{"from": from, "to": msg.To, "subject": msg.Subject}
	if msg.HTML != "" {
		payload["html"] = msg.HTML
	}
	if msg.Text != "" {
		payload["text"] = msg.Text
	}
	if msg.ReplyTo != "" {
		payload["reply_to"] = msg.ReplyTo
	}
	body, _ := json.Marshal(payload)

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, "https://api.resend.com/emails", bytes.NewReader(body))
	if err != nil {
		return "", "resend", err
	}
	req.Header.Set("Authorization", "Bearer "+s.apiKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := s.client.Do(req)
	if err != nil {
		return "", "resend", err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 300 {
		b, _ := io.ReadAll(io.LimitReader(resp.Body, 1024))
		return "", "resend", fmt.Errorf("resend: %s: %s", resp.Status, string(b))
	}
	var out struct {
		ID string `json:"id"`
	}
	_ = json.NewDecoder(resp.Body).Decode(&out)
	return out.ID, "resend", nil
}

// ---- SMTP (Mailpit / any relay) -----------------------------------------

type SMTPSender struct {
	addr        string
	defaultFrom string
}

func NewSMTP(host string, port int, defaultFrom string) *SMTPSender {
	return &SMTPSender{addr: fmt.Sprintf("%s:%d", host, port), defaultFrom: defaultFrom}
}

func (s *SMTPSender) Send(_ context.Context, msg Message) (string, string, error) {
	from := firstNonEmpty(msg.From, s.defaultFrom)
	fromAddr := addressOnly(from)

	var b strings.Builder
	fmt.Fprintf(&b, "From: %s\r\n", from)
	fmt.Fprintf(&b, "To: %s\r\n", strings.Join(msg.To, ", "))
	if msg.ReplyTo != "" {
		fmt.Fprintf(&b, "Reply-To: %s\r\n", msg.ReplyTo)
	}
	fmt.Fprintf(&b, "Subject: %s\r\n", msg.Subject)
	b.WriteString("MIME-Version: 1.0\r\n")
	b.WriteString("Content-Type: text/html; charset=UTF-8\r\n\r\n")
	if msg.HTML != "" {
		b.WriteString(msg.HTML)
	} else {
		b.WriteString(msg.Text)
	}

	if err := smtp.SendMail(s.addr, nil, fromAddr, msg.To, []byte(b.String())); err != nil {
		return "", "smtp", err
	}
	return idgen.Prefixed("eml_"), "smtp", nil
}

func addressOnly(from string) string {
	if a, err := mail.ParseAddress(from); err == nil {
		return a.Address
	}
	return from
}

func firstNonEmpty(ss ...string) string {
	for _, s := range ss {
		if strings.TrimSpace(s) != "" {
			return s
		}
	}
	return ""
}
