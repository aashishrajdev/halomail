# syntax=docker/dockerfile:1
#
# Builds any HaloLink Go service (or the monolith) from the monorepo into a
# tiny distroless image.
#
#   docker build -f deploy/Dockerfile --build-arg SERVICE=gateway -t halolink-api .
#
# Requires generated code to be present (run `task proto` and commit, or
# generate in CI before building).

ARG GO_VERSION=1.24

# ---- build ----
FROM golang:${GO_VERSION}-alpine AS build
WORKDIR /src
RUN apk add --no-cache git ca-certificates

# Which service under services/<SERVICE> to build. Each exposes cmd/server.
ARG SERVICE=gateway

# Build via each module's go.mod + replace directives, independent of the
# workspace (matches CI; avoids go.work listing not-yet-present modules).
ENV GOWORK=off

# All modules: the target service imports the shared module locally.
COPY go.work ./
COPY services ./services

WORKDIR /src/services/${SERVICE}
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" \
    -o /out/app ./cmd/server

# ---- runtime ----
FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /out/app /app
EXPOSE 8080
USER nonroot:nonroot
ENTRYPOINT ["/app"]
