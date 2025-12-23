import type { HttpRequest, HttpResponse } from "../../types/http.js";
import type { Keylio } from "../Keylio.js";
import { handleGET, handlePOST } from "../routes/index.js";

export function KeylioHandler(keylio: Keylio) {
  async function handleRequest(req: HttpRequest): Promise<HttpResponse> {
    switch (req.method) {
      case "GET":
        return await handleGET(req, keylio);
      case "POST":
        return await handlePOST(req, keylio);
      default:
        return { status: 405, body: { error: "Method Not Allowed" } };
    }
  }

  return { handleRequest };
}
