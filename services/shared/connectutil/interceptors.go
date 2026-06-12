// Package connectutil holds shared ConnectRPC middleware: tracing, panic
// recovery, request logging, and domain→wire error mapping.
package connectutil

import (
	"context"
	"fmt"
	"log/slog"
	"runtime/debug"
	"time"

	"connectrpc.com/connect"
	"connectrpc.com/otelconnect"
)

// Default returns the standard interceptor chain in outer→inner order:
// OTel tracing, panic recovery, then request logging.
func Default(logger *slog.Logger) ([]connect.Interceptor, error) {
	otelIc, err := otelconnect.NewInterceptor()
	if err != nil {
		return nil, fmt.Errorf("connectutil: otel interceptor: %w", err)
	}
	return []connect.Interceptor{
		otelIc,
		Recovery(logger),
		Logging(logger),
	}, nil
}

// Logging records the procedure, peer, duration, and resulting code per RPC.
func Logging(logger *slog.Logger) connect.UnaryInterceptorFunc {
	return func(next connect.UnaryFunc) connect.UnaryFunc {
		return func(ctx context.Context, req connect.AnyRequest) (connect.AnyResponse, error) {
			start := time.Now()
			res, err := next(ctx, req)
			l := logger.With(
				"procedure", req.Spec().Procedure,
				"peer", req.Peer().Addr,
				"took_ms", time.Since(start).Milliseconds(),
			)
			if err != nil {
				l.ErrorContext(ctx, "rpc failed",
					"code", connect.CodeOf(err).String(),
					"error", err.Error(),
				)
			} else {
				l.InfoContext(ctx, "rpc ok")
			}
			return res, err
		}
	}
}

// Recovery converts a panic in a handler into a CodeInternal error and logs
// the stack, keeping the server alive.
func Recovery(logger *slog.Logger) connect.UnaryInterceptorFunc {
	return func(next connect.UnaryFunc) connect.UnaryFunc {
		return func(ctx context.Context, req connect.AnyRequest) (resp connect.AnyResponse, err error) {
			defer func() {
				if r := recover(); r != nil {
					logger.ErrorContext(ctx, "panic recovered",
						"procedure", req.Spec().Procedure,
						"panic", fmt.Sprint(r),
						"stack", string(debug.Stack()),
					)
					err = connect.NewError(connect.CodeInternal, fmt.Errorf("internal error"))
				}
			}()
			return next(ctx, req)
		}
	}
}
