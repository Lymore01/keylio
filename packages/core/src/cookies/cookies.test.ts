import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as cookieUtils from "./cookies";

vi.mock("@keylio/shared/constants", () => ({
  SESSION_KEY: "default_session_key",
}));

describe("createJwtSessionCookie", async () => {
  const set = vi.fn();
  const mockCookies = () => ({ set });
  const token = "abc123";

  it("Should set cookies with default options", async () => {
    await cookieUtils.createJwtSessionCookie(
      token,
      {
        name: "session",
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 3600,
      },
      mockCookies
    );

    expect(set).toHaveBeenCalledWith(
      "session",
      token,
      expect.objectContaining({
        httpOnly: true,
        path: "/",
      })
    );
  });

  it("Should set cookie with default name if not provided", async () => {
    await cookieUtils.createJwtSessionCookie(
      token,
      {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 3600,
      },
      mockCookies
    );

    expect(set).toHaveBeenCalledWith(
      "default_session_key",
      token,
      expect.objectContaining({
        httpOnly: true,
        path: "/",
      })
    );
  });
});

describe("getJWTSessionCookie", async () => {
  it("Should get a cookie", async () => {
    const mockCookies = () => ({
      get: vi.fn().mockReturnValue({
        value: "abc123",
      }),
    });
    const { cookieStore, cookieToken } = await cookieUtils.getJWTSessionCookie(
      "user_token",
      mockCookies
    );

    expect(cookieStore.get).toHaveBeenCalledWith("user_token");
    expect(cookieToken).toBe("abc123");
  });

  it("should use default SESSION_KEY if cookieName is not provided", async () => {
    const mockCookies = () => ({
      get: vi.fn().mockReturnValue({ value: "xyz789" }),
    });

    const { cookieToken } = await cookieUtils.getJWTSessionCookie(
      undefined,
      mockCookies
    );

    expect(cookieToken).toBe("xyz789");
  });

  it("should return null if cookie does not exist", async () => {
    const mockCookies = () => ({
      get: vi.fn().mockReturnValue(undefined),
    });

    const { cookieToken } = await cookieUtils.getJWTSessionCookie(
      "nonexistent_cookie",
      mockCookies
    );

    expect(cookieToken).toBe(null);
  });

  it("should still return cookieStore even if no cookie found", async () => {
    const mockCookies = () => ({
      get: vi.fn().mockReturnValue(undefined),
    });

    const { cookieStore } = await cookieUtils.getJWTSessionCookie(
      "test_cookie",
      mockCookies
    );

    expect(cookieStore).toBeDefined();
    expect(typeof cookieStore.get).toBe("function");
  });
});

describe("deleteJwtSessionCookie", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  describe("Browser context", () => {
    beforeEach(() => {
      Object.defineProperty(global, "window", {
        value: {},
        writable: true,
        configurable: true,
      });
      Object.defineProperty(global, "document", {
        value: { cookie: "" },
        writable: true,
        configurable: true,
      });
    });

    afterEach(() => {
      delete (global as unknown as any).window;
      delete (global as unknown as any).document;
    });

    it("should delete cookie and return token if cookie exists", async () => {
      // Setup document.cookie mock
      document.cookie = "default_session_key=test_token";

      const result = await cookieUtils.deleteJwtSessionCookie();

      // The cookie should now be expired
      expect(document.cookie).toContain("Max-Age=0");
      expect(result).toBe("test_token");
    });

    it("should return null if cookie does not exist", async () => {
      document.cookie = "";
      const result = await cookieUtils.deleteJwtSessionCookie();
      expect(result).toBeNull();
    });
  });

  describe("Server context", () => {
    beforeEach(() => {
      delete (global as unknown as any).window;
      delete (global as unknown as any).document;
    });

    it("should delete cookie and return token if server cookie exists", async () => {
      const mockCookieStore = {
        delete: vi.fn(),
        get: vi.fn().mockReturnValue({ value: "server_token" }),
      };

      const mockCookies = vi.fn().mockReturnValue(mockCookieStore);

      const token = await cookieUtils.deleteJwtSessionCookie({
        sessionOptions: undefined,
        cookies: mockCookies,
      });

      expect(mockCookieStore.delete).toHaveBeenCalledWith(
        "default_session_key"
      );
      expect(token).toBe("server_token");
    });

    it("should handle cookie deletion failure gracefully", async () => {
      vi.spyOn(cookieUtils, "getJWTSessionCookie").mockRejectedValueOnce(
        new Error("Failure")
      );
      const mockCookies = vi
        .fn()
        .mockReturnValue({ delete: vi.fn(), get: vi.fn() });
      const result = await cookieUtils.deleteJwtSessionCookie({
        sessionOptions: undefined,
        cookies: mockCookies,
      });

      expect(result).toBeNull();
    });

    it("should return null if cookies function is not provided", async () => {
      const result = await cookieUtils.deleteJwtSessionCookie();
      expect(result).toBeNull();
    });
  });
});
