-- +goose Up
-- +goose StatementBegin
CREATE TABLE webhooks (
    id         TEXT PRIMARY KEY,
    owner_id   TEXT NOT NULL,
    url        TEXT NOT NULL,
    events     TEXT[] NOT NULL DEFAULT '{}',
    -- Signing secret. Should be encrypted at rest in production (KMS); stored
    -- raw here so the dispatcher can HMAC-sign deliveries.
    secret     TEXT NOT NULL,
    active     BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX webhooks_owner_idx ON webhooks (owner_id);

CREATE TABLE webhook_deliveries (
    id            TEXT PRIMARY KEY,
    webhook_id    TEXT NOT NULL,
    owner_id      TEXT NOT NULL,
    event         TEXT NOT NULL,
    status        TEXT NOT NULL DEFAULT 'pending',
    response_code INT NOT NULL DEFAULT 0,
    attempts      INT NOT NULL DEFAULT 0,
    payload       TEXT NOT NULL DEFAULT '',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX webhook_deliveries_status_idx ON webhook_deliveries (status);
CREATE INDEX webhook_deliveries_webhook_idx ON webhook_deliveries (webhook_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS webhook_deliveries;
DROP TABLE IF EXISTS webhooks;
-- +goose StatementEnd
