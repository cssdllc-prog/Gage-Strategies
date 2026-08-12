import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

function createAdminContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@example.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
  return { ctx };
}

function createPublicContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
  return { ctx };
}

function createRegularUserContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: {
      id: 2,
      openId: "regular-user",
      email: "user@example.com",
      name: "Regular User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
  return { ctx };
}

describe("blog routes", () => {
  describe("public blog.list", () => {
    it("returns an array (empty or with posts)", async () => {
      const { ctx } = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.blog.list({ limit: 10, offset: 0 });
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("public blog.getBySlug", () => {
    it("returns null for non-existent slug", async () => {
      const { ctx } = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.blog.getBySlug({ slug: "non-existent-post-xyz" });
      expect(result).toBeNull();
    });
  });

  describe("admin blog.list", () => {
    it("requires admin role", async () => {
      const { ctx } = createRegularUserContext();
      const caller = appRouter.createCaller(ctx);
      await expect(caller.admin.blog.list()).rejects.toThrow();
    });

    it("returns posts for admin", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.admin.blog.list();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("admin blog.create", () => {
    it("requires admin role", async () => {
      const { ctx } = createRegularUserContext();
      const caller = appRouter.createCaller(ctx);
      await expect(
        caller.admin.blog.create({
          title: "Test Post",
          slug: "test-post",
          content: "Hello world",
          contentType: "original",
          status: "draft",
        })
      ).rejects.toThrow();
    });

    it("validates required fields", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);
      await expect(
        caller.admin.blog.create({
          title: "",
          slug: "empty-title",
          content: "Some content",
          contentType: "original",
          status: "draft",
        })
      ).rejects.toThrow();
    });

    it("validates content type enum", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);
      await expect(
        caller.admin.blog.create({
          title: "Test",
          slug: "test",
          content: "Content",
          contentType: "invalid" as any,
          status: "draft",
        })
      ).rejects.toThrow();
    });
  });

  describe("admin blog.delete", () => {
    it("requires admin role", async () => {
      const { ctx } = createRegularUserContext();
      const caller = appRouter.createCaller(ctx);
      await expect(caller.admin.blog.delete({ id: 999 })).rejects.toThrow();
    });
  });
});
