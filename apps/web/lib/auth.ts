// Minimal client-side session: token + user in localStorage. Good enough for
// the dashboard demo; swap for httpOnly cookies in production.
"use client";

const TOKEN_KEY = "halomail_token";
const USER_KEY = "halomail_user";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  handle: string;
  timezone?: string;
}

export function saveSession(token: string, user: SessionUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as SessionUser) : null;
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
