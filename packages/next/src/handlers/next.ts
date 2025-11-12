import { type NextRequest, NextResponse } from "next/server";
import { KeylioHandler } from "../../../keylio/src/auth/handlers/handler";
import { Keylio } from "../../../keylio/src/auth/Keylio";

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
        cookies: req.cookies,
      });

      return NextResponse.json(response.body, { status: response.status });
    },
    async POST(req: NextRequest) {
      const body = await req.json();
      const response = await handleRequest({
        method: req.method,
        url: req.url,
        headers: Object.fromEntries(req.headers),
        body,
        cookies: Object.fromEntries(req.cookies),
      });

      return NextResponse.json(response.body, { status: response.status });
    },
  };
}
