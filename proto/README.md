# proto — API contracts

The **single source of truth** for the HaloLink API. Go servers and the
TypeScript SDK are generated from these `.proto` files — never the other way
around.

## Layout

```
proto/halolink/
├─ common/v1/common.proto          # pagination, shared enums
├─ identity/v1/identity.proto      # auth, users, api keys, audit
├─ scheduling/v1/scheduling.proto  # event types, availability, bookings, calendars
├─ contact/v1/contact.proto        # forms, messages
├─ template/v1/template.proto      # email themes, render
└─ notification/v1/notification.proto  # email, webhooks
```

## Generate code

From the repo root:

```bash
task proto        # buf generate
task proto:lint   # buf lint
task proto:fmt    # buf format -w
```

Outputs (configured in [`buf.gen.yaml`](../buf.gen.yaml)):

| Target | Location                       | Plugins                         |
| ------ | ------------------------------ | ------------------------------- |
| Go     | `services/shared/gen/`         | protocolbuffers/go, connectrpc/go |
| TS SDK | `packages/sdk-js/src/gen/`     | bufbuild/es, connectrpc/es      |

## Conventions (buf STANDARD)

- Package: `halolink.<domain>.v1`; file path mirrors the package.
- Every RPC `Foo` has a unique `FooRequest` / `FooResponse`.
- Enums: zero value is `<ENUM>_UNSPECIFIED`; values are prefixed with the enum name.
- Fields: `lower_snake_case`.
- Additive changes only on `v1`; breaking changes bump the version suffix.

## Adding an RPC

1. Edit the relevant `.proto`.
2. `task proto:lint && task proto`.
3. Implement the handler in the owning service.
4. Expose it via the gateway; regenerate the SDK for clients.
