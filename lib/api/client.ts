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

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
