import type { SessionOptions } from "@keylio/auth/config";
import { describe, expect, it } from "vitest";
import * as jwtUtils from "./jwt";

describe("jwtSign", async () => {
  const secret = "secret";
  it("should return a valid JWT string", async () => {
    const payload = { userId: 123 };
    const options: SessionOptions = { secret, maxAge: 60 };

    const token = await jwtUtils.jwtSign(payload, options);

    expect(typeof token).toBe("string");

    const decoded = jwtUtils.verifyJwtToken(token, secret) as unknown as any;
    expect(decoded.userId).toBe(123);
  });

  it("should set expiration based on maxAge", async () => {
    const now = Math.floor(Date.now() / 1000);
    const options: SessionOptions = { secret, maxAge: 120 };

    const payload = { foo: "bar", exp: now + options.maxAge! };

    const token = await jwtUtils.jwtSign(payload, options);
    const decoded = jwtUtils.verifyJwtToken(token, secret) as unknown as any;

    expect(decoded.exp).toBeGreaterThanOrEqual(now + 119);
    expect(decoded.exp).toBeLessThanOrEqual(now + 121);
  });

  it("should throw if secret is missing", async () => {
    const payload = { test: true };
    const options: SessionOptions = { secret: "", maxAge: 60 };

    await expect(jwtUtils.jwtSign(payload, options)).rejects.toThrow();
  });
});
