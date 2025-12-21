import type { AuthOptions, SignInInput } from "@keylio/auth/config";

/**
 * Signs in a user using the provided authentication input.
 *
 * @typeParam T - The authentication option type (e.g. "credentials", "oAuth", "phoneOTP").
 * @param input - The sign-in payload matching the chosen {@link AuthOptions}.
 * @returns A JSON response containing session/user data.
 * @throws Error if the request fails or the server returns an error.
 *
 * @example
 * ```ts
 * await signIn({
 *   type: "credentials",
 *   data: { email: "user@example.com", password: "secret" }
 * });
 * ```
 */
export async function signIn<T extends AuthOptions>(input: SignInInput<T>) {
  const res = await fetch("/api/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to sign in");
  return data;
}

/**
 * Registers a new user using the provided authentication input.
 *
 * @typeParam T - The authentication option type (e.g. "credentials", "oAuth", "phoneOTP").
 * @param input - The sign-up payload matching the chosen {@link AuthOptions}.
 * @returns A JSON response containing created user/session data.
 * @throws Error if the request fails or the server returns an error.
 *
 * @example
 * ```ts
 * await signUp({
 *   type: "credentials",
 *   data: { email: "new@example.com", password: "secret" }
 * });
 * ```
 */
export async function signUp<T extends AuthOptions>(input: SignInInput<T>) {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to sign up");
  return data;
}

/**
 * Signs out the current user by invalidating their session.
 *
 * @returns A JSON response from the server confirming sign-out.
 * @remarks
 * - Sends a POST request to `/api/auth/signout`.
 * - Clears the current session on the server.
 *
 * @example
 * ```ts
 * await signOut();
 * ```
 */
export async function signOut() {
  const res = await fetch("/api/auth/signout", { method: "POST" });
  console.log("[DEBUG]: User signed out successfully");
  return res.json();
}
