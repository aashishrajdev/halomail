// Package template exposes Mount so the monolith can host it in-process.
package template

import (
	"net/http"

	"connectrpc.com/connect"
	"github.com/jackc/pgx/v5/pgxpool"

	templatev1connect "github.com/aashishrajdev/halomail/services/shared/gen/halolink/template/v1/templatev1connect"
	"github.com/aashishrajdev/halomail/services/shared/authn"

	"github.com/aashishrajdev/halomail/services/template/internal/adapters/postgres"
	"github.com/aashishrajdev/halomail/services/template/internal/adapters/rpc"
	"github.com/aashishrajdev/halomail/services/template/internal/app"
)

type Deps struct {
	Pool         *pgxpool.Pool
	JWTSecret    string
	Interceptors []connect.Interceptor
}

func Mount(mux *http.ServeMux, d Deps) {
	svc := app.New(app.Repos{Templates: postgres.NewTemplates(d.Pool)})
	h := rpc.NewHandlers(svc, authn.NewVerifier(d.JWTSecret))
	mux.Handle(templatev1connect.NewTemplateServiceHandler(h, connect.WithInterceptors(d.Interceptors...)))
}
