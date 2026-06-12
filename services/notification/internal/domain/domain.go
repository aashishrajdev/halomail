// Package domain holds notification entities. Pure: no I/O.
package domain

import "time"

// Webhook event names (also used as the wire string).
const (
	EventBookingCreated     = "booking.created"
	EventBookingCancelled   = "booking.cancelled"
	EventBookingRescheduled = "booking.rescheduled"
	EventMessageReceived    = "message.received"
)

// Delivery statuses.
const (
	DeliveryPending   = "pending"
	DeliverySucceeded = "succeeded"
	DeliveryFailed    = "failed"
)

// MaxAttempts is the delivery retry ceiling.
const MaxAttempts = 5

// Webhook is a subscriber endpoint.
type Webhook struct {
	ID        string
	OwnerID   string
	URL       string
	Secret    string
	Events    []string
	Active    bool
	CreatedAt time.Time
}

// SecretLastFour returns the last four chars of the signing secret.
func (w Webhook) SecretLastFour() string {
	if len(w.Secret) <= 4 {
		return w.Secret
	}
	return w.Secret[len(w.Secret)-4:]
}

// Subscribes reports whether the webhook listens for event.
func (w Webhook) Subscribes(event string) bool {
	for _, e := range w.Events {
		if e == event {
			return true
		}
	}
	return false
}

// Delivery is one attempt record for an event → webhook.
type Delivery struct {
	ID           string
	WebhookID    string
	OwnerID      string
	Event        string
	Status       string
	ResponseCode int
	Attempts     int
	Payload      string
	CreatedAt    time.Time
}
