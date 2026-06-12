-- +goose Up
-- +goose StatementBegin
CREATE TABLE event_types (
    id                    TEXT PRIMARY KEY,
    owner_id              TEXT NOT NULL,
    slug                  TEXT NOT NULL,
    title                 TEXT NOT NULL,
    description           TEXT NOT NULL DEFAULT '',
    duration_minutes      INT  NOT NULL DEFAULT 30,
    location_kind         TEXT NOT NULL DEFAULT 'custom',
    location_detail       TEXT NOT NULL DEFAULT '',
    buffer_before_minutes INT  NOT NULL DEFAULT 0,
    buffer_after_minutes  INT  NOT NULL DEFAULT 0,
    color                 TEXT NOT NULL DEFAULT '',
    active                BOOLEAN NOT NULL DEFAULT true,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (owner_id, slug)
);

CREATE TABLE availabilities (
    owner_id   TEXT PRIMARY KEY,
    timezone   TEXT NOT NULL DEFAULT 'UTC',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE availability_rules (
    id           TEXT PRIMARY KEY,
    owner_id     TEXT NOT NULL,
    weekday      INT  NOT NULL,  -- 0=Sunday .. 6=Saturday
    start_minute INT  NOT NULL,  -- minutes from midnight (owner tz)
    end_minute   INT  NOT NULL
);
CREATE INDEX availability_rules_owner_idx ON availability_rules (owner_id);

CREATE TABLE date_overrides (
    id           TEXT PRIMARY KEY,
    owner_id     TEXT NOT NULL,
    on_date      DATE NOT NULL,
    unavailable  BOOLEAN NOT NULL DEFAULT false,
    start_minute INT NOT NULL DEFAULT 0,
    end_minute   INT NOT NULL DEFAULT 0
);
CREATE INDEX date_overrides_owner_idx ON date_overrides (owner_id);

CREATE TABLE bookings (
    id               TEXT PRIMARY KEY,
    event_type_id    TEXT NOT NULL,
    owner_id         TEXT NOT NULL,
    invitee_name     TEXT NOT NULL,
    invitee_email    TEXT NOT NULL,
    invitee_timezone TEXT NOT NULL DEFAULT 'UTC',
    start_at         TIMESTAMPTZ NOT NULL,
    end_at           TIMESTAMPTZ NOT NULL,
    status           TEXT NOT NULL DEFAULT 'confirmed',
    location         TEXT NOT NULL DEFAULT '',
    notes            TEXT NOT NULL DEFAULT '',
    reschedule_token TEXT NOT NULL UNIQUE,
    cancel_token     TEXT NOT NULL UNIQUE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX bookings_owner_start_idx ON bookings (owner_id, start_at);

CREATE TABLE calendar_connections (
    id            TEXT PRIMARY KEY,
    owner_id      TEXT NOT NULL,
    provider      TEXT NOT NULL,  -- google | outlook
    email         TEXT NOT NULL DEFAULT '',
    access_token  TEXT NOT NULL DEFAULT '',
    refresh_token TEXT NOT NULL DEFAULT '',
    expiry        TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX calendar_connections_owner_idx ON calendar_connections (owner_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS calendar_connections;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS date_overrides;
DROP TABLE IF EXISTS availability_rules;
DROP TABLE IF EXISTS availabilities;
DROP TABLE IF EXISTS event_types;
-- +goose StatementEnd
