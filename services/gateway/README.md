# gateway — public edge

The only component exposed to the internet. It authenticates callers, enforces
rate limits, translates REST/OpenAPI ⇄ ConnectRPC, and fans requests out to the
internal services. In **monolith mode** it also hosts every service in-process —
making it the single binary for free-tier deploys.

- **Dev port:** `8080`
- **Module:** `github.com/aashishrajdev/halomail/services/gateway`

## Responsibilities

- **AuthN** — validates `Authorization: Bearer <jwt>` (dashboard) or
  `Authorization: ApiKey hl_…` (developers) by calling `identity.VerifyToken` /
  `identity.VerifyApiKey`, then injects `{user_id, org_id, scopes}` into context.
- **Rate limiting** — per-IP and per-API-key via `shared/ratelimit`
  (Redis or in-memory).
- **REST + OpenAPI** — JSON endpoints for public surfaces (booking widget,
  contact submit) and a generated OpenAPI spec.
- **BFF aggregation** — composes multi-service responses for dashboard pages.

## Configuration

| Env                | Purpose                                          |
| ------------------ | ------------------------------------------------ |
| `HTTP_PORT`        | listen port (default 8080)                       |
| `RATELIMIT_*`      | public rate-limit defaults                       |
| `IDENTITY_URL` …   | upstream URLs (distributed mode only)            |

In monolith mode the upstreams are in-process, so no `*_URL` is needed.

## Run

```bash
cd services/gateway && go run ./cmd/server          # :8080
```

## Routing

```
/halolink.<svc>.v1.<Service>/<Method>   ConnectRPC (gRPC / gRPC-Web / JSON)
/v1/*                                   REST mappings (public)
/healthz /readyz                        probes
/openapi.json                           OpenAPI document
```
