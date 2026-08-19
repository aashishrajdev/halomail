// Command server boots the scheduling service: event types, availability,
// bookings, and calendar OAuth over ConnectRPC.
package main

import (
	"context"
	"net/http"
	"os"

	"connectrpc.com/connect"

	"github.com/aashishrajdev/halomail/services/shared/authn"
	"github.com/aashishrajdev/halomail/services/shared/config"
	"github.com/aashishrajdev/halomail/services/shared/connectutil"
	schedulingv1connect "github.com/aashishrajdev/halomail/services/shared/gen/halomail/scheduling/v1/schedulingv1connect"
	"github.com/aashishrajdev/halomail/services/shared/health"
	"github.com/aashishrajdev/halomail/services/shared/log"
	"github.com/aashishrajdev/halomail/services/shared/observability"
	pg "github.com/aashishrajdev/halomail/services/shared/postgres"
	"github.com/aashishrajdev/halomail/services/shared/server"

	schedpg "github.com/aashishrajdev/halomail/services/scheduling/internal/adapters/postgres"
	"github.com/aashishrajdev/halomail/services/scheduling/internal/adapters/rpc"
	"github.com/aashishrajdev/halomail/services/scheduling/internal/app"
)

const serviceName = "scheduling"

func main() {
	ctx := context.Background()

	cfg, err := config.Load()
	if err != nil {
		log.New(log.Options{Service: serviceName}).Error("load config", "error", err.Error())
		os.Exit(1)
	}

	logger := log.New(log.Options{
		Level:   cfg.App.LogLevel,
		Format:  cfg.App.LogFormat,
		Service: serviceName,
		Env:     cfg.App.Env,
	})
	log.SetDefault(logger)
	logger.Info("boot", "addr", cfg.HTTP.Addr())

	shutdown, err := observability.Setup(ctx, observability.Config{
		Enabled:     cfg.OTel.Enabled,
		Endpoint:    cfg.OTel.Endpoint,
		ServiceName: serviceName,
		SampleRatio: cfg.OTel.SampleRatio,
	})
	if err != nil {
		logger.Warn("otel setup failed; continuing without tracing", "error", err.Error())
	} else {
		defer func() { _ = shutdown(ctx) }()
	}

	pool, err := pg.New(ctx, cfg.Postgres.URL)
	if err != nil {
		logger.Error("connect postgres", "error", err.Error())
		os.Exit(1)
	}
	defer pool.Close()

	svc := app.New(app.Repos{
		EventTypes:   schedpg.NewEventTypes(pool),
		Availability: schedpg.NewAvailability(pool),
		Bookings:     schedpg.NewBookings(pool),
		Calendars:    schedpg.NewCalendars(pool),
	}, app.Config{
		Google:    cfg.Google,
		Microsoft: cfg.Microsoft,
	})
	handlers := rpc.NewHandlers(svc, authn.NewVerifier(cfg.Auth.JWTSecret))

	interceptors, err := connectutil.Default(logger)
	if err != nil {
		logger.Error("build interceptors", "error", err.Error())
		os.Exit(1)
	}
	opts := connect.WithInterceptors(interceptors...)

	hc := health.New()
	hc.Register("postgres", func(ctx context.Context) error { return pool.Ping(ctx) })

	mux := http.NewServeMux()
	mux.Handle("/healthz", hc.Liveness())
	mux.Handle("/readyz", hc.Readiness())
	mux.Handle(schedulingv1connect.NewEventTypeServiceHandler(handlers, opts))
	mux.Handle(schedulingv1connect.NewAvailabilityServiceHandler(handlers, opts))
	mux.Handle(schedulingv1connect.NewBookingServiceHandler(handlers, opts))
	mux.Handle(schedulingv1connect.NewCalendarServiceHandler(handlers, opts))

	if err := server.Run(ctx, cfg.HTTP.Addr(), mux, logger); err != nil {
		logger.Error("server stopped with error", "error", err.Error())
		os.Exit(1)
	}
}
