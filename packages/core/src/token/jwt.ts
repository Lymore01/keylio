import jwt, { JwtPayload } from "jsonwebtoken";
import type { SessionOptions } from "@keylio/keylio/config";

export async function jwtSign(
  payload: any,
  jwtOptions: SessionOptions
): Promise<string> {
  const token = jwt.sign(payload, jwtOptions.secret, {
    expiresIn: Number(jwtOptions.maxAge),
  });

  return token;
}

export function verifyJwtToken(
  token: string,
  secret: string
): JwtPayload | string | null {
  try {
    if (!token || typeof token !== "string") {
      throw new Error("Invalid token format.");
    }
    if (!secret || typeof secret !== "string") {
      throw new Error("Invalid secret key.");
    }

    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    console.error("JWT verification failed:", (error as Error).message);
    return null;
  }
}
