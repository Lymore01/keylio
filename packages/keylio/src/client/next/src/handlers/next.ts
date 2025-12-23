import { cookies } from "next/headers.js";
import { type NextRequest, NextResponse } from "next/server.js";
import type { Keylio } from "../../../../auth/Keylio.js";
import { KeylioHandler } from "../../../../auth/handlers/handler.js";
/**
 * Adapts Keylio's handler for Next.js routes.
 *
 * Provides `GET` and `POST` methods that forward Next.js requests
 * to Keylio's core `handleRequest` and return a `NextResponse`.
 *
 * @param keylio - Initialized Keylio instance
 * @returns Object with `GET` and `POST` handlers
 */

export function KeylioNextHandler(keylio: Keylio) {
  const { handleRequest } = KeylioHandler(keylio);

  return {
    async GET(req: NextRequest) {
      const response = await handleRequest({
        method: req.method,
        url: req.url,
        headers: Object.fromEntries(req.headers),
        cookies: cookies,
      });

      return NextResponse.json(response.body, { status: response.status });
    },
    async POST(req: NextRequest) {
      let body: any;
      if (req.url.includes("signin") || req.url.includes("signup")) {
        body = await req.json();
      }

      const response = await handleRequest({
        method: req.method,
        url: req.url,
        headers: Object.fromEntries(req.headers),
        body,
        cookies,
      });

      return NextResponse.json(response.body, { status: response.status });
    },
  };
}
