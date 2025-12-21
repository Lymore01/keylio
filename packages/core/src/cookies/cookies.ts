import type { SessionOptions } from "@keylio/auth/config";
import { SESSION_KEY } from "@keylio/shared/constants";
import { withDefaults } from "@keylio/auth/utils";

/**
 * Creates and stores a JWT session cookie in either the browser or server environment
 *
 * @param {string} token - The JWT access token to store in the cookie.
 * @param {SessionOptions} [cookieOptions] - Optional session configuration defining
 * cookie behavior (name, maxAge, path, secure flags, etc.).
 * @param {Function} [cookies] - Optional cookie API function for server-side cookie management
 * (e.g., Next.js `cookies()` or a custom implementation).
 */
export async function createJwtSessionCookie(
  token: string,
  cookieOptions?: SessionOptions["cookie"],
  cookies?: any
) {
  const cookieConfig = withDefaults(cookieOptions!);
  const cookieStore = await cookies();

  cookieStore.set(cookieConfig.name!, token, {
    httpOnly: cookieConfig.httpOnly,
    secure: cookieConfig.secure,
    sameSite: cookieConfig.sameSite,
    path: cookieConfig.path,
    maxAge: cookieConfig.maxAge,
  });

  return token;
}

/**
 * Deletes a JWT session cookie both in browser and server environments.
 * Automatically detects runtime environment.
 *
 * @param sessionOptions - Optional session options (to resolve cookie config).
 * @param cookies - Optional cookie API function (used in server context like Next.js).
 * @returns The deleted cookie's value (token) if available.
 */
export async function deleteJwtSessionCookie({
  sessionOptions,
  cookies,
}: {
  sessionOptions?: SessionOptions;
  cookies?: unknown;
} = {}): Promise<string | null> {
  const cookieConfig = withDefaults(sessionOptions?.cookie!);
  const cookieName = cookieConfig.name || SESSION_KEY;

  if (typeof window !== "undefined") {
    const existingCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${cookieName}=`));
    const token = existingCookie ? existingCookie.split("=")[1] : null;

    document.cookie = `${cookieName}=; Max-Age=0; path=${
      cookieConfig.path || "/"
    };`;

    return token;
  }

  if (cookies && typeof cookies === "function") {
    try {
      const { cookieStore, cookieToken } = await getJWTSessionCookie(
        cookieName,
        cookies
      );

      cookieStore.delete(cookieName);
      return cookieToken;
    } catch (error) {
      console.warn("Cookie deletion failed in server context:", error);
    }
  }

  return null;
}

export async function getJWTSessionCookie(cookieName?: string, cookies?: any) {
  const cookieStore = await cookies();
  const cookie = cookieName || SESSION_KEY;
  const cookieToken = cookieStore.get(cookie)?.value || null;
  return { cookieToken, cookieStore };
}
