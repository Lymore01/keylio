import { describe, expect, it, vi } from "vitest";
import * as jwtUtils from "./jwt";
import { SessionOptions } from "@keylio/keylio/config";

describe("jwtSign", async () => {
  const secret = "secret";
  it("should return a valid JWT string", async () => {
    const payload = { userId: 123 };
    const options: SessionOptions = { secret, maxAge: 60 };

    const token = await jwtUtils.jwtSign(payload, options);

    expect(typeof token).toBe("string");

    const decoded = jwtUtils.verifyJwtToken(token, secret) as any;
    expect(decoded.userId).toBe(123);
  });

  it("should set expiration based on maxAge", async () => {
    const payload = { foo: "bar" };
    const options: SessionOptions = { secret, maxAge: 120 };

    const token = await jwtUtils.jwtSign(payload, options);
    const decoded = jwtUtils.verifyJwtToken(token, secret) as any;

    const now = Math.floor(Date.now() / 1000);
    expect(decoded.exp).toBeGreaterThanOrEqual(now + 119);
    expect(decoded.exp).toBeLessThanOrEqual(now + 121);
  });

  it("should throw if secret is missing", async () => {
    const payload = { test: true };
    const options: SessionOptions = { secret: "", maxAge: 60 };

    await expect(jwtUtils.jwtSign(payload, options)).rejects.toThrow();
  });
});
