// Package scheduling exposes Mount so the monolith can host it in-process.
package scheduling

import (
	"net/http"

	"connectrpc.com/connect"
	"github.com/jackc/pgx/v5/pgxpool"

	schedulingv1connect "github.com/aashishrajdev/halomail/services/shared/gen/halomail/scheduling/v1/schedulingv1connect"
	"github.com/aashishrajdev/halomail/services/shared/authn"
	"github.com/aashishrajdev/halomail/services/shared/config"

	"github.com/aashishrajdev/halomail/services/scheduling/internal/adapters/postgres"
	"github.com/aashishrajdev/halomail/services/scheduling/internal/adapters/rpc"
	"github.com/aashishrajdev/halomail/services/scheduling/internal/app"
)

type Deps struct {
	Pool         *pgxpool.Pool
	JWTSecret    string
	Google       config.OAuth
	Microsoft    config.Microsoft
	Interceptors []connect.Interceptor
}

func Mount(mux *http.ServeMux, d Deps) {
	svc := app.New(app.Repos{
		EventTypes:   postgres.NewEventTypes(d.Pool),
		Availability: postgres.NewAvailability(d.Pool),
		Bookings:     postgres.NewBookings(d.Pool),
		Calendars:    postgres.NewCalendars(d.Pool),
	}, app.Config{Google: d.Google, Microsoft: d.Microsoft})
	h := rpc.NewHandlers(svc, authn.NewVerifier(d.JWTSecret))
	opts := connect.WithInterceptors(d.Interceptors...)
	mux.Handle(schedulingv1connect.NewEventTypeServiceHandler(h, opts))
	mux.Handle(schedulingv1connect.NewAvailabilityServiceHandler(h, opts))
	mux.Handle(schedulingv1connect.NewBookingServiceHandler(h, opts))
	mux.Handle(schedulingv1connect.NewCalendarServiceHandler(h, opts))
}
