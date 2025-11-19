import bcrypt from "bcrypt";
import { DBAdapter } from "@keylio/core/adapters";
import { AuthError } from "@keylio/core/errors";
import { jwtSign } from "@keylio/core/jwt";
import { createJwtSessionCookie } from "@keylio/core/cookies";
import type { AuthDataMap, Cookie, SessionOptions } from "../../config";
import type { SessionType, UserType } from "../../types/auth";
import { v4 as uuidv4 } from "uuid";

export async function signInUsingCredentials(
  data: AuthDataMap["credentials"],
  sessionOptions: SessionOptions,
  adapter: DBAdapter,
  cookies?: any
) {
  const { email, password } = data;
  const { maxAge, strategy } = sessionOptions;

  if (!email || !password) {
    throw new AuthError({
      message: "Email and password are required.",
      code: "MISSING_CREDENTIALS",
    });
  }

  const normalizedEmail = email.toLowerCase().trim();

  const user = await adapter.findOne<UserType>("user", [
    { field: "email", operator: "eq", value: normalizedEmail },
  ]);

  if (!user) {
    throw new AuthError({
      message: "Invalid email or password.",
      code: "INVALID_CREDENTIALS",
    });
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    throw new AuthError({
      message: "Invalid email or password.",
      code: "INVALID_CREDENTIALS",
    });
  }

  const now = Math.floor(Date.now() / 1000);

  const tokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: now,
    exp: now + maxAge!,
  };



  const token = await jwtSign(tokenPayload, sessionOptions);

  switch (strategy) {
    case "jwt":
      await createJwtSessionCookie(token, sessionOptions, cookies);
      break;

    case "database":
      const existingSession = await adapter.findOne<SessionType>("session", [
        { field: "userId", operator: "eq", value: user.id },
      ]);

      if (existingSession) {
        const expired = existingSession.expires.getTime() < Date.now();
        if (expired) {
          await adapter.delete("session", [
            {
              field: "userId",
              operator: "eq",
              value: existingSession.id!,
            },
          ]);
        } else {
          await createJwtSessionCookie(
            existingSession.sessionToken,
            sessionOptions,
            cookies
          );
          return {
            user: { id: user.id, email: user.email, role: user.role },
            token: existingSession.sessionToken,
          };
        }
      }

      const newSessionToken = uuidv4();

      await adapter.create<SessionType>("session", {
        id: undefined,
        sessionToken: newSessionToken,
        userId: user.id,
        expires: new Date(Date.now() + maxAge!*1000),
      });

      await createJwtSessionCookie(newSessionToken, sessionOptions, cookies);

      break;

    default:
      throw new AuthError({
        message: `Unsupported session strategy: ${strategy}`,
        code: "INVALID_STRATEGY",
      });
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
}
