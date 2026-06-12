# gateway — public edge & monolith host

The gateway is the public entrypoint. In **monolith mode** (default) it hosts
every HaloLink service in one process on one port — the single binary/container
used for cheap and free-tier deployment. It also provides CORS, health probes,
and a root info endpoint.

- **Port:** `8080`
- **Module:** `github.com/aashishrajdev/halomail/services/gateway`
- **Binary:** builds to one static binary embedding identity, scheduling,
  contact, template, and notification.

## What it mounts

```
/                                         info { service, mode, status }
/healthz  /readyz                         liveness / readiness (pings Postgres)
/widget.js                                contact embeddable widget
/halolink.identity.v1.*/*                 identity (auth, users, api keys, audit)
/halolink.scheduling.v1.*/*               scheduling (event types, availability, bookings, calendars)
/halolink.contact.v1.*/*                  contact (forms, messages)
/halolink.template.v1.*/*                 template (themes, render)
/halolink.notification.v1.*/*             notification (email, webhooks)
```

Each service authenticates its own requests (Bearer JWT via `shared/authn`), so
the secret is shared across the in-process services. CORS is permissive so the
booking page, contact widget, and SDK can call cross-origin.

## Run

```bash
# from repo root, with infra up (task up) and migrations applied (task migrate)
cd services/gateway && go run ./cmd/server      # :8080
```

All five services answer on `:8080`. This is exactly what `task api:run` and the
deploy image run.

## Build the deploy image

```bash
docker build -f deploy/Dockerfile --build-arg SERVICE=gateway -t halolink .
docker run -p 8080:8080 --env-file .env halolink
```

## Distributed mode (later)

To scale a service independently, run it from its own `cmd/server` on its own
port and have the gateway forward to it (forwarding is not yet implemented; the
monolith covers the common case). See
[../../docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md#deployment-modes).
