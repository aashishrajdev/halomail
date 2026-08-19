// Package identity exposes Mount so the monolith (gateway) can host the
// identity service in-process. Standalone deployment uses cmd/server.
package identity

import (
	"net/http"
	"time"

	"connectrpc.com/connect"
	"github.com/jackc/pgx/v5/pgxpool"

	identityv1connect "github.com/aashishrajdev/halomail/services/shared/gen/halomail/identity/v1/identityv1connect"

	"github.com/aashishrajdev/halomail/services/identity/internal/adapters/postgres"
	"github.com/aashishrajdev/halomail/services/identity/internal/adapters/rpc"
	"github.com/aashishrajdev/halomail/services/identity/internal/app"
)

type Deps struct {
	Pool         *pgxpool.Pool
	JWTSecret    string
	SessionTTL   time.Duration
	APIKeyPrefix string
	Interceptors []connect.Interceptor
}

// Mount registers the identity ConnectRPC handlers on mux.
func Mount(mux *http.ServeMux, d Deps) {
	svc := app.New(app.Repos{
		Users:    postgres.NewUsers(d.Pool),
		Sessions: postgres.NewSessions(d.Pool),
		APIKeys:  postgres.NewAPIKeys(d.Pool),
		Audit:    postgres.NewAudit(d.Pool),
	}, app.Config{
		JWTSecret:    d.JWTSecret,
		RefreshTTL:   d.SessionTTL,
		APIKeyPrefix: d.APIKeyPrefix,
	})
	h := rpc.NewHandlers(svc)
	opts := connect.WithInterceptors(d.Interceptors...)
	mux.Handle(identityv1connect.NewAuthServiceHandler(h, opts))
	mux.Handle(identityv1connect.NewUserServiceHandler(h, opts))
	mux.Handle(identityv1connect.NewApiKeyServiceHandler(h, opts))
	mux.Handle(identityv1connect.NewAuditServiceHandler(h, opts))
}
