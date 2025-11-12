import type { HttpResponse } from "../../types/http";

export function jsonResponse(
  body: Record<string, any>,
  status = 200,
  headers: Record<string, string> = {}
): HttpResponse {
  return {
    status,
    body,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };
}
