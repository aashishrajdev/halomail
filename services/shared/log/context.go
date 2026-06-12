package log

import (
	"context"
	"log/slog"
)

type ctxKey struct{}

// Into returns a context carrying logger, retrievable with From.
func Into(ctx context.Context, logger *slog.Logger) context.Context {
	return context.WithValue(ctx, ctxKey{}, logger)
}

// From returns the logger attached to ctx, or slog's default if none is set.
func From(ctx context.Context) *slog.Logger {
	if l, ok := ctx.Value(ctxKey{}).(*slog.Logger); ok && l != nil {
		return l
	}
	return slog.Default()
}

// With derives a logger with extra fields and stores it back on the context,
// so downstream calls inherit the added context.
func With(ctx context.Context, args ...any) context.Context {
	return Into(ctx, From(ctx).With(args...))
}

// WithRequestID tags the context logger with a correlation id.
func WithRequestID(ctx context.Context, id string) context.Context {
	return With(ctx, "request_id", id)
}
