import { config } from "@/config/config";
import { APIError } from "@/lib/error-handler/api-error";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${config.API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    let errorBody;

    try {
      errorBody = await response.json();
    } catch {
      errorBody = await response.text();
    }

    throw new APIError(
      response.status,
      errorBody?.detail ?? response.statusText,
      errorBody,
    );
  }

  return response.json();
}

/** `Authorization: Bearer <token>` when a token is given, nothing otherwise. */
function authHeaders(token?: string | null): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const apiClient = {
  get: <T>(path: string, token?: string | null) =>
    request<T>(path, { method: "GET", headers: authHeaders(token) }),
  post: <T>(path: string, body: unknown, token?: string | null) =>
    request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
      headers: authHeaders(token),
    }),
  put: <T>(path: string, body: unknown, token?: string | null) =>
    request<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: authHeaders(token),
    }),
};
