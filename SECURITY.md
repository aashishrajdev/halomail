# Security Policy

## Reporting a vulnerability

**Please do not open a public issue for security vulnerabilities.**

Email **rajaashish.dev@gmail.com** with:

- a description of the issue and its impact,
- steps to reproduce (proof-of-concept if possible),
- affected component(s) and version/commit.

You'll get an acknowledgement within 72 hours and a remediation timeline after
triage. Responsible disclosure is appreciated — we'll credit you once a fix ships
(unless you prefer to stay anonymous).

## Supported versions

HaloLink is in active alpha development; security fixes target the `main` branch.

## Handling of secrets

- Never commit secrets. `.env` is git-ignored; use `.env.example` as the template.
- Passwords are hashed with argon2id; API-key and webhook secrets are stored
  hashed and shown in plaintext only once.
- The logging layer redacts sensitive fields, but do not rely on it — never log
  secrets, tokens, or full request bodies.
