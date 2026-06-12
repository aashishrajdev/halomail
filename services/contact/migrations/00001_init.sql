-- +goose Up
-- +goose StatementBegin
CREATE TABLE forms (
    id              TEXT PRIMARY KEY,
    owner_id        TEXT NOT NULL,
    name            TEXT NOT NULL,
    slug            TEXT NOT NULL UNIQUE,
    target_email    TEXT NOT NULL DEFAULT '',
    spam_protection TEXT NOT NULL DEFAULT 'honeypot',
    redirect_url    TEXT NOT NULL DEFAULT '',
    fields          JSONB NOT NULL DEFAULT '[]',
    active          BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX forms_owner_idx ON forms (owner_id);

CREATE TABLE messages (
    id           TEXT PRIMARY KEY,
    form_id      TEXT NOT NULL,
    owner_id     TEXT NOT NULL,
    sender_name  TEXT NOT NULL DEFAULT '',
    sender_email TEXT NOT NULL DEFAULT '',
    data         JSONB NOT NULL DEFAULT '{}',
    ip           TEXT NOT NULL DEFAULT '',
    user_agent   TEXT NOT NULL DEFAULT '',
    spam_score   DOUBLE PRECISION NOT NULL DEFAULT 0,
    is_spam      BOOLEAN NOT NULL DEFAULT false,
    read         BOOLEAN NOT NULL DEFAULT false,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX messages_owner_created_idx ON messages (owner_id, created_at DESC);
CREATE INDEX messages_form_created_idx ON messages (form_id, created_at DESC);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS forms;
-- +goose StatementEnd
