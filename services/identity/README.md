# identity — auth, users, API keys, audit

Owns who the user is and how callers prove it.

- **Dev port:** `8081`
- **Proto:** [`proto/halomail/identity/v1`](../../proto/halomail/identity/v1/identity.proto)
- **Module:** `github.com/aashishrajdev/halomail/services/identity`

## Services / RPCs

| Service          | RPCs                                                            |
| ---------------- | -------------------------------------------------------------- |
| `AuthService`    | Register, Login, Logout, RefreshSession, GetCurrentUser, VerifyToken (internal) |
| `UserService`    | GetUser, GetUserByHandle (public profile), UpdateUser          |
| `ApiKeyService`  | CreateApiKey, ListApiKeys, RevokeApiKey, VerifyApiKey (internal)|
| `AuditService`   | ListAuditLogs, RecordAuditLog (internal)                       |

## Data model

| Table          | Notes                                                         |
| -------------- | ------------------------------------------------------------ |
| `orgs`         | tenant; a user belongs to one org                            |
| `users`        | email (unique), password hash (argon2id), handle, timezone  |
| `sessions`     | refresh tokens (hashed), expiry, revoked                    |
| `api_keys`     | hashed secret, prefix, last_four, scopes, last_used_at      |
| `audit_logs`   | actor, action, target, metadata (jsonb), ip, created_at     |

## Security notes

- Passwords hashed with **argon2id**; never logged (redacted by `shared/log`).
- API key secrets and refresh tokens are stored **hashed**; the plaintext is
  returned exactly once at creation.
- JWT access tokens are short-lived; refresh tokens rotate on use.

## Configuration

| Env          | Purpose                          |
| ------------ | -------------------------------- |
| `JWT_SECRET` | HMAC signing key (32+ bytes)     |
| `SESSION_TTL`| refresh token lifetime           |
| `API_KEY_PREFIX` | key prefix, e.g. `hl_`       |

## Run

```bash
cd services/identity && HTTP_PORT=8081 go run ./cmd/server
```
