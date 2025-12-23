import { beforeEach, describe, expect, it, vi } from "vitest";
import { signIn, signOut, signUp } from "./index.js";

describe("Auth API functions", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("signIn", () => {
    it("should call fetch with correct arguments and return data", async () => {
      const mockResponse = { user: { id: 1, email: "test@example.com" } };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const input = {
        type: "credentials",
        data: { email: "test@example.com", password: "123" },
      };
      const result = await signIn(input as unknown as any);

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/auth/signin",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw error if response not ok", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({ error: "Invalid credentials" }),
      });

      const input = {
        type: "credentials",
        data: { email: "bad@example.com", password: "wrong" },
      };

      await expect(signIn(input as unknown as any)).rejects.toThrow(
        "Invalid credentials"
      );
    });
  });

  describe("signUp", () => {
    it("should call fetch with correct arguments and return data", async () => {
      const mockResponse = { user: { id: 2, email: "new@example.com" } };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const input = {
        type: "credentials",
        data: { email: "new@example.com", password: "123" },
      };
      const result = await signUp(input as unknown as any);

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/auth/signup",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw error if response not ok", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({ error: "Email already exists" }),
      });

      const input = {
        type: "credentials",
        data: { email: "duplicate@example.com", password: "123" },
      };

      await expect(signUp(input as unknown as any)).rejects.toThrow(
        "Email already exists"
      );
    });
  });

  describe("signOut", () => {
    it("should call fetch with correct arguments and return data", async () => {
      const mockResponse = { success: true };
      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await signOut();

      expect(global.fetch).toHaveBeenCalledWith("/api/auth/signout", {
        method: "POST",
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
