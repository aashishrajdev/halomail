// Thin ConnectRPC-over-JSON client. Connect speaks plain JSON over POST, so the
// browser can call the gateway directly. The generated TS SDK (packages/sdk-js)
// can replace this later for full type-safety.

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export class ApiError extends Error {
  code: string;
  status: number;
  constructor(message: string, code: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

/**
 * rpc calls /halolink.<service>.v1.<Service>/<Method>.
 * @param procedure e.g. "halolink.identity.v1.AuthService/Login"
 */
export async function rpc<T = unknown>(
  procedure: string,
  body: unknown = {},
  token?: string | null,
): Promise<T> {
  const res = await fetch(`${API_URL}/${procedure}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body ?? {}),
  });

  if (!res.ok) {
    let message = res.statusText;
    let code = "unknown";
    try {
      const j = await res.json();
      message = j.message || message;
      code = j.code || code;
    } catch {
      /* non-JSON error */
    }
    throw new ApiError(message, code, res.status);
  }
  return (await res.json()) as T;
}
