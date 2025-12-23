import type { HttpRequest, HttpResponse } from "../../types/http.js";
import type { Keylio } from "../Keylio.js";
import { jsonResponse } from "../utils/http.js";

export async function handleGET(
  req: HttpRequest,
  keylio: Keylio
): Promise<HttpResponse> {
  const url = new URL(req.url);
  const path = url.pathname;

  if (path.includes("session")) {
    const session = await keylio.getSession(req);

    if (!session) {
      return jsonResponse(
        { session: null, error: "No active session or session expired!" },
        401
      );
    } else {
      return jsonResponse({ session }, 200);
    }
  }

  if (path.endsWith("/test") || path.endsWith("/")) {
    return jsonResponse({ message: "Keylio API is running..." }, 200);
  }

  return jsonResponse({ error: "Not Found" }, 404);
}

export async function handlePOST(
  req: HttpRequest,
  keylio: Keylio
): Promise<HttpResponse> {
  const url = new URL(req.url);
  const path = url.pathname;
  const body = req.body || {};
  const cookies = req.cookies || undefined;

  try {
    if (path.includes("signin")) {
      const user = await keylio.signIn(body, cookies);
      return jsonResponse(user, 200);
    }

    if (path.includes("signup")) {
      const user = await keylio.signUp(body, cookies);
      return jsonResponse(user, 201);
    }

    if (path.includes("signout")) {
      await keylio.signOut(cookies);
      return jsonResponse({ message: "Signed out" }, 200);
    }

    return jsonResponse({ error: "Unknown route" }, 404);
  } catch (err: any) {
    console.error("POST error:", err);
    return jsonResponse({ error: err.message || "Internal Server Error" }, 500);
  }
}
