# Architecture

HaloLink is a **monorepo** of **modular Go microservices** behind a single public
**gateway**, with a Next.js frontend and an in-house documentation site. This document explains
the boundaries, data flow, and the design decisions that keep it cheap to run.

## Principles

- **Domain-driven, clean architecture.** Each service isolates `domain` (pure
  business rules), `app` (use cases), and `adapters` (Postgres, RPC, external
  APIs). Dependencies point inward.
- **Contract-first.** `proto/` is the single source of truth; Go servers and the
  TS SDK are generated from it. No drift between client and server.
- **Modular & replaceable.** Services share only the `shared` library and the
  proto contracts — never each other's internals.
- **Cheap by default.** Optional dependencies degrade gracefully (e.g. no Redis →
  in-memory limiter) so a full deployment fits free tiers.

## C4 — Context

```
   ┌──────────┐      ┌──────────┐      ┌─────────────┐
   │ Invitee  │      │  Owner   │      │  Developer  │
   │ (public) │      │(dashboard)│     │ (API/SDK)   │
   └────┬─────┘      └────┬─────┘      └──────┬──────┘
        │ book / submit   │ manage           │ REST + SDK + webhooks
        └────────────────┬┴──────────────────┘
                         ▼
                   ┌───────────┐
                   │  HaloLink │
                   └───────────┘
                         │
        ┌────────────────┼─────────────────┐
        ▼                ▼                  ▼
   Google/Outlook     Resend           Postgres/Redis
   Calendar APIs      (email)
```

## C4 — Containers

```
                         ┌──────────────────────────┐
  browser / SDK  ─────▶  │        gateway           │  :8080  public ingress
                         │  authn · rate limit ·    │
                         │  REST/OpenAPI · BFF      │
                         └───────────┬──────────────┘
                      ConnectRPC (gRPC/HTTP2, in-proc or network)
        ┌───────────┬───────────┬────┴──────┬───────────┬──────────────┐
        ▼           ▼           ▼           ▼           ▼              ▼
   ┌─────────┐ ┌──────────┐ ┌────────┐ ┌──────────┐ ┌──────────────┐
   │identity │ │scheduling│ │contact │ │ template │ │ notification │
   │  :8081  │ │  :8082   │ │ :8083  │ │  :8084   │ │    :8085     │
   └────┬────┘ └────┬─────┘ └───┬────┘ └────┬─────┘ └──────┬───────┘
        │           │           │           │              │
        └─────── PostgreSQL ────┴── Redis ───┘         Resend / SMTP
        (schema-per-service)   (cache, limits)
```

## Service responsibilities

| Service        | Owns                                                            | Talks to |
| -------------- | -------------------------------------------------------------- | -------- |
| `gateway`      | Public edge, authn (token + API key), rate limiting, REST/OpenAPI translation, request aggregation for the dashboard | all services |
| `identity`     | Users, orgs, password auth, JWT sessions, API keys, audit log  | — |
| `scheduling`   | Event types, availability, slot computation, bookings, calendar OAuth + sync | identity (owner lookup), notification (emails), template (render) |
| `contact`      | Forms, submissions, spam scoring, rate limits, forwarding      | notification (forward + webhooks) |
| `template`     | Built-in email themes, custom templates, render/preview        | — |
| `notification` | Email delivery (Resend/SMTP), webhook subscriptions + dispatch | template (render) |

Each service owns its tables and never reaches into another service's schema;
cross-service reads go through ConnectRPC.

## Authentication flow

```
client ──(Bearer JWT  | Authorization: ApiKey hl_…)──▶ gateway
gateway ──VerifyToken / VerifyApiKey──▶ identity
gateway  attaches {user_id, org_id, scopes} to the request context
gateway ──forwards──▶ owning service (trusted internal call)
```

The gateway is the only component that authenticates external callers. Internal
service-to-service calls are trusted within the deployment boundary (network
policy in distributed mode; in-process in monolith mode).

## Data flow — booking a meeting

```
1. GET  /book/{handle}                → identity.GetUserByHandle + scheduling.ListEventTypes
2. GET  slots for event type + range  → scheduling.ListSlots (reads availability, calendar busy)
3. POST booking                       → scheduling.CreateBooking
        ├─ writes booking row, generates reschedule/cancel tokens
        ├─ pushes event to owner's Google/Outlook calendar
        ├─ template.RenderPreview(theme, vars) → HTML
        ├─ notification.SendEmail(invitee + owner)
        └─ notification.Dispatch(BOOKING_CREATED) → webhooks
```

## Data flow — contact submission

```
1. widget/SDK POST → gateway (public, rate-limited per IP + per form)
2. contact.SubmitMessage
        ├─ honeypot + heuristic spam score; drop or flag
        ├─ store message
        ├─ notification.SendEmail(forward to form.target_email)
        └─ notification.Dispatch(MESSAGE_RECEIVED) → webhooks
```

## Deployment modes

Same binaries, two topologies — chosen at deploy time, not baked into the code.

### Monolith mode (default · cheapest)

One process imports every service's handler and mounts them on a single port.
Service-to-service calls are in-process. This is what `task api:run` does and what
the free-tier Dockerfile ships. **One container, one Postgres, optional Redis.**

```
┌─────────────────────────────┐
│      halolink (one binary)   │  :8080
│  gateway + identity + ...    │
└─────────────────────────────┘
```

### Distributed mode (scale-out)

Each service runs as its own container with its own port and scaling policy. The
gateway reaches peers over the network via their ConnectRPC URLs (config:
`<SERVICE>_URL`). Adopt this only when a component needs independent scaling.

## Observability

- **Traces:** OpenTelemetry from every RPC (otelconnect interceptor) → OTLP →
  Jaeger (local) or Grafana/Honeycomb (prod).
- **Logs:** structured slog, JSON in prod, auto-tagged with `trace_id`/`span_id`
  and service metadata, secrets redacted.
- **Health:** every service exposes `/healthz` (liveness) and `/readyz`
  (readiness — pings db/redis).

## Why this is cheap to run

- Monolith mode → **one** compute instance instead of six.
- Redis is optional; rate limiting falls back to in-memory per instance.
- A single Postgres with a schema per service → **one** free database.
- Stateless services → scale-to-zero friendly (Render/Fly).
- Email via Resend free tier; local dev captures mail in Mailpit (no sending).

See [DEPLOYMENT.md](DEPLOYMENT.md) for the concrete free-tier recipe.
