import { describe, expect, it, vi } from "vitest";
import * as prismaUtils from "./prisma-adapter";
import { AuthError } from "../errors";

describe("Adapter Tests", async () => {
  describe("prismaAdapter", () => {
    const prismaMock = {
      user: {
        create: vi.fn().mockResolvedValue({ id: 1, email: "test@example.com" }),
        findFirst: vi
          .fn()
          .mockResolvedValue({ id: 1, email: "test@example.com" }),
        findMany: vi.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
        update: vi
          .fn()
          .mockResolvedValue({ id: 1, email: "updated@example.com" }),
        updateMany: vi.fn().mockResolvedValue({ count: 2 }),
        delete: vi.fn().mockResolvedValue({ id: 1 }),
        deleteMany: vi.fn().mockResolvedValue({ count: 3 }),
        count: vi.fn().mockResolvedValue(5),
      },
    };

    const adapter = prismaUtils.prismaAdapter(prismaMock as any);

    it("should create a record", async () => {
      const result = await adapter.create(
        "user",
        { email: "test@example.com" },
        ["id", "email"]
      );
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: { email: "test@example.com" },
        select: { id: true, email: true },
      });
      expect(result.email).toBe("test@example.com");
    });

    it("should throw AuthError if model not found on create", async () => {
      await expect(adapter.create("nonexistent", {}, [])).rejects.toThrow(
        AuthError
      );
    });

    it("should find one record", async () => {
      const result = await adapter.findOne(
        "user",
        [{ field: "email", value: "test@example.com" }],
        ["id"]
      );
      expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
        where: { AND: [{ email: "test@example.com" }] },
        select: { id: true },
      });
      expect((result as any).email).toBe("test@example.com");
    });

    it("should find many records with limit and offset", async () => {
      const result = await adapter.findMany("user", [], {
        limit: 2,
        offset: 1,
      });
      expect(prismaMock.user.findMany).toHaveBeenCalledWith({
        where: {},
        take: 2,
        skip: 1,
      });
      expect(result.length).toBe(2);
    });

    it("should update a record", async () => {
      const result = await adapter.update("user", [{ field: "id", value: 1 }], {
        email: "updated@example.com",
      });
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { AND: [{ id: 1 }] },
        data: { email: "updated@example.com" },
      });
      expect(result?.email).toBe("updated@example.com");
    });

    it("should update many records", async () => {
      const result = await adapter.updateMany(
        "user",
        [{ field: "active", value: true }],
        { active: false }
      );
      expect(prismaMock.user.updateMany).toHaveBeenCalledWith({
        where: { AND: [{ active: true }] },
        data: { active: false },
      });
      expect(result).toBe(2);
    });

    it("should delete a record", async () => {
      const result = await adapter.delete("user", [{ field: "id", value: 1 }]);
      expect(prismaMock.user.delete).toHaveBeenCalledWith({
        where: { AND: [{ id: 1 }] },
      });
      expect(result).toBeUndefined();
    });

    it("should delete many records", async () => {
      const result = await adapter.deleteMany("user", [
        { field: "active", value: false },
      ]);
      expect(prismaMock.user.deleteMany).toHaveBeenCalledWith({
        where: { AND: [{ active: false }] },
      });
      expect(result).toBe(3);
    });

    it("should count records", async () => {
      const result = await adapter.count("user", [
        { field: "role", value: "admin" },
      ]);
      expect(prismaMock.user.count).toHaveBeenCalledWith({
        where: { AND: [{ role: "admin" }] },
      });
      expect(result).toBe(5);
    });
  });
});
