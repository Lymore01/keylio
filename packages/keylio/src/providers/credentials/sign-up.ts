import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import type { DBAdapter } from "@keylio/core/adapters";
import { AuthError } from "@keylio/core/errors";
import { jwtSign } from "@keylio/core/jwt";
import type { AuthDataMap, Cookie, SessionOptions } from "../../config";
import type { SessionType, UserType } from "../../types/auth";
import { createJwtSessionCookie } from "@keylio/core/cookies";

const SALT_ROUNDS = 10;

export async function signUpUsingCredentials(
  data: AuthDataMap["credentials"],
  sessionOptions: SessionOptions,
  adapter: DBAdapter,
  cookies?: any
) {
  const { email, password } = data;
  const { strategy, maxAge } = sessionOptions;

  if (!email || !password) {
    throw new AuthError({
      message: "Email and password are required.",
      code: "MISSING_CREDENTIALS",
    });
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await adapter.findOne<UserType>("user", [
    { field: "email", operator: "eq", value: normalizedEmail },
  ]);

  if (existingUser) {
    throw new AuthError({
      message: "User already exists!",
      code: "USER_EXISTS",
    });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser: UserType = await adapter.create<UserType>("user", {
    id: uuidv4(),
    email: normalizedEmail,
    passwordHash,
    role: "user",
    createdAt: new Date(),
  });
  const now = Math.floor(Date.now() / 1000);

  const tokenPayload = {
    sub: newUser.id,
    email: newUser.email,
    role: newUser.role,
    iat: Math.floor(Date.now() / 1000),
    exp: now + maxAge!,
  };

  const token = await jwtSign(tokenPayload, sessionOptions);
  const expiryDate = new Date(Date.now() + maxAge!);

  switch (strategy) {
    case "jwt":
      await createJwtSessionCookie(token, sessionOptions, cookies);
      break;

    case "database": {
      const existingSession = await adapter.findOne<SessionType>("session", [
        { field: "userId", operator: "eq", value: newUser.id },
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
          // return {
          //   user: { id: newUser.id, email: newUser.email, role: newUser.role },
          //   token: existingSession.sessionToken,
          // };
        }
      }

      const newSessionToken = uuidv4();

      await adapter.create<SessionType>("session", {
        id: undefined,
        sessionToken: newSessionToken,
        userId: newUser.id,
        expires: new Date(Date.now() + maxAge!*1000),
      });

      await createJwtSessionCookie(newSessionToken, sessionOptions, cookies);
      break;
    }

    default:
      throw new AuthError({
        message: `Invalid session strategy: ${strategy}`,
        code: "INVALID_STRATEGY",
      });
  }

  return {
    user: {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    },
  };
}
