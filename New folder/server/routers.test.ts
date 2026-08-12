import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("products router", () => {
  it("products.list returns an array", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("products.listCategories returns an array", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.listCategories();
    expect(Array.isArray(result)).toBe(true);
  });

  it("products.getById returns a product or null", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.getById({ id: 1 });
    // Should return either a product object or undefined
    if (result) {
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("name");
      expect(result).toHaveProperty("description");
    }
  });

  it("products.getBySlug returns a product or undefined", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.getBySlug({ slug: "project-proposal-template" });
    if (result) {
      expect(result).toHaveProperty("slug", "project-proposal-template");
    }
  });
});

describe("pricing router", () => {
  it("pricing.list returns an array", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.pricing.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("leads router", () => {
  it("leads.submit validates email format", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Invalid email should throw
    await expect(
      caller.leads.submit({
        name: "Test User",
        email: "not-an-email",
      })
    ).rejects.toThrow();
  });

  it("leads.submit validates required name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Empty name should throw
    await expect(
      caller.leads.submit({
        name: "",
        email: "test@example.com",
      })
    ).rejects.toThrow();
  });
});
