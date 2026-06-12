# log — structured logging

The logging standard for every HaloLink service. Built on the standard library
`log/slog`, with three guarantees:

1. **Trace-correlated** — every line emitted with a context carrying an active
   span includes `trace_id` and `span_id`, so logs link to traces.
2. **Secret-redacting** — attribute keys containing `password`, `secret`,
   `token`, `authorization`, `api_key`, `jwt`, `cookie`, or `credential` have
   their values replaced with `[REDACTED]`.
3. **Context-scoped** — loggers can be carried on `context.Context` and enriched
   per request without threading a logger through every signature.

## Create a logger

```go
logger := log.New(log.Options{
    Level:   "info",   // debug|info|warn|error
    Format:  "json",   // json (prod) | text (dev)
    Service: "identity",
    Version: buildVersion,
    Env:     "production",
})
log.SetDefault(logger)   // optional: route slog.Info(...) through it too
```

## Per-request context

```go
ctx = log.With(ctx, "request_id", reqID, "owner_id", ownerID)
log.From(ctx).InfoContext(ctx, "booking created", "booking_id", id)
// → {"level":"INFO","service":"scheduling","request_id":"…",
//    "trace_id":"…","span_id":"…","booking_id":"…","msg":"booking created"}
```

## Rules

- Always use the `…Context` methods (`InfoContext`, `ErrorContext`) so trace
  correlation works.
- Log **errors with cause**, not messages: `logger.ErrorContext(ctx, "msg", "error", err)`.
- Never log secrets, full tokens, or request bodies. Redaction is a safety net,
  not a license to log sensitive data.
- One event per line; prefer structured fields over string interpolation.
