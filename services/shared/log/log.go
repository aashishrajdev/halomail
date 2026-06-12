// Package log builds the structured slog logger used across every HaloLink
// service. Output is JSON in production and human-readable text in dev; every
// line carries service metadata, is auto-correlated with the active
// OpenTelemetry trace (trace_id/span_id), and has sensitive fields redacted.
//
// Conventions: see services/shared/log/README.md.
package log

import (
	"log/slog"
	"os"
	"strings"
)

// Options configures the logger. Service/Version/Env are attached to every line.
type Options struct {
	Level     string // debug | info | warn | error
	Format    string // text | json
	Service   string // e.g. "identity"
	Version   string // build/commit version
	Env       string // development | staging | production
	AddSource bool   // include caller file:line (costly; enable in dev)
}

// sensitiveKeys are redacted from output (case-insensitive substring match).
var sensitiveKeys = []string{
	"password", "passwd", "secret", "token", "authorization",
	"api_key", "apikey", "jwt", "cookie", "credential",
}

// New builds a logger from Options. It never returns nil.
func New(opts Options) *slog.Logger {
	handlerOpts := &slog.HandlerOptions{
		Level:       parseLevel(opts.Level),
		AddSource:   opts.AddSource,
		ReplaceAttr: redact,
	}

	var base slog.Handler
	if strings.EqualFold(opts.Format, "text") {
		base = slog.NewTextHandler(os.Stdout, handlerOpts)
	} else {
		base = slog.NewJSONHandler(os.Stdout, handlerOpts)
	}

	// Wrap so every record is correlated with the active trace.
	logger := slog.New(&traceHandler{Handler: base})

	attrs := make([]any, 0, 6)
	if opts.Service != "" {
		attrs = append(attrs, slog.String("service", opts.Service))
	}
	if opts.Version != "" {
		attrs = append(attrs, slog.String("version", opts.Version))
	}
	if opts.Env != "" {
		attrs = append(attrs, slog.String("env", opts.Env))
	}
	if len(attrs) > 0 {
		logger = logger.With(attrs...)
	}
	return logger
}

// SetDefault installs logger as slog's package-global default, so libraries
// that call slog.Info participate in the same pipeline.
func SetDefault(logger *slog.Logger) { slog.SetDefault(logger) }

func parseLevel(level string) slog.Level {
	switch strings.ToLower(strings.TrimSpace(level)) {
	case "debug":
		return slog.LevelDebug
	case "warn", "warning":
		return slog.LevelWarn
	case "error":
		return slog.LevelError
	default:
		return slog.LevelInfo
	}
}

// redact masks the values of sensitive keys anywhere in the attribute tree.
func redact(_ []string, a slog.Attr) slog.Attr {
	key := strings.ToLower(a.Key)
	for _, s := range sensitiveKeys {
		if strings.Contains(key, s) {
			return slog.String(a.Key, "[REDACTED]")
		}
	}
	return a
}
