-- +goose Up
-- +goose StatementBegin
CREATE TABLE templates (
    id          TEXT PRIMARY KEY,
    owner_id    TEXT NOT NULL,
    name        TEXT NOT NULL,
    theme       TEXT NOT NULL DEFAULT 'minimal',
    subject     TEXT NOT NULL DEFAULT '',
    custom_html TEXT NOT NULL DEFAULT '',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX templates_owner_idx ON templates (owner_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS templates;
-- +goose StatementEnd
