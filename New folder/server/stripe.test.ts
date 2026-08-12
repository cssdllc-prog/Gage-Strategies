import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the stripe module
vi.mock("./stripe", () => ({
  createOneTimeCheckout: vi.fn().mockResolvedValue({
    url: "https://checkout.stripe.com/test_session",
    id: "cs_test_123",
  }),
  createSubscriptionCheckout: vi.fn().mockResolvedValue({
    url: "https://checkout.stripe.com/test_sub_session",
    id: "cs_test_sub_456",
  }),
  stripe: {},
  registerStripeWebhook: vi.fn(),
}));

// Mock the db module for purchase-related functions
vi.mock("./db", async (importOriginal) => {
  const original = await importOriginal() as any;
  return {
    ...original,
    hasUserPurchased: vi.fn().mockResolvedValue(false),
    getUserPurchases: vi.fn().mockResolvedValue([]),
    getAllPurchases: vi.fn().mockResolvedValue([]),
    getProductById: vi.fn().mockResolvedValue({
      id: 10,
      name: "Client Communication Templates",
      slug: "client-communication-templates",
      description: "Professional email templates",
      categoryId: 1,
      pricing: "one-time",
      basePrice: "19.00",
      monthlyPrice: null,
      isPopular: false,
    }),
    createPurchase: vi.fn().mockResolvedValue(undefined),
  };
});

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-123",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {
        origin: "https://gagesaas-6h3amb7j.manus.space",
      },
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user-123",
    email: "admin@gage-strategies.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {
        origin: "https://gagesaas-6h3amb7j.manus.space",
      },
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("purchases.check", () => {
  it("returns purchased: false for a product the user has not bought", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.purchases.check({ productId: 10 });
    expect(result).toEqual({ purchased: false });
  });
});

describe("purchases.myPurchases", () => {
  it("returns an empty array when user has no purchases", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.purchases.myPurchases();
    expect(result).toEqual([]);
  });
});

describe("purchases.createCheckout", () => {
  it("creates a checkout session for a one-time product", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.purchases.createCheckout({ productId: 10 });
    expect(result).toHaveProperty("checkoutUrl");
    expect(result).toHaveProperty("sessionId");
    expect(result.checkoutUrl).toContain("stripe.com");
  });

  it("throws error for free products", async () => {
    const { getProductById } = await import("./db");
    (getProductById as any).mockResolvedValueOnce({
      id: 1,
      name: "Free Tool",
      pricing: "free",
      basePrice: null,
      monthlyPrice: null,
    });

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.purchases.createCheckout({ productId: 1 })).rejects.toThrow(
      "This product is free and does not require purchase"
    );
  });
});

describe("admin.purchases.list", () => {
  it("returns purchases list for admin users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.purchases.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("purchases.cancelSubscription", () => {
  it("throws error when purchase is not found", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.purchases.cancelSubscription({ purchaseId: 999 })
    ).rejects.toThrow("Purchase not found");
  });
});

describe("purchases.resumeSubscription", () => {
  it("throws error when purchase is not found", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.purchases.resumeSubscription({ purchaseId: 999 })
    ).rejects.toThrow("Purchase not found");
  });

  it("throws error when purchase is not a subscription", async () => {
    const { getUserPurchases } = await import("./db");
    (getUserPurchases as any).mockResolvedValueOnce([
      { id: 1, userId: 1, productId: 5, type: "one_time", status: "active", stripeSubscriptionId: null },
    ]);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.purchases.resumeSubscription({ purchaseId: 1 })
    ).rejects.toThrow("This purchase is not a subscription");
  });

  it("throws error when subscription is not pending cancellation", async () => {
    const { getUserPurchases } = await import("./db");
    (getUserPurchases as any).mockResolvedValueOnce([
      { id: 2, userId: 1, productId: 5, type: "subscription", status: "active", stripeSubscriptionId: "sub_123" },
    ]);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.purchases.resumeSubscription({ purchaseId: 2 })
    ).rejects.toThrow("This subscription is not pending cancellation");
  });
});

describe("purchases.billingHistory", () => {
  it("returns empty array when user has no purchases with stripe customer IDs", async () => {
    const { getUserPurchases } = await import("./db");
    (getUserPurchases as any).mockResolvedValueOnce([]);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.purchases.billingHistory();
    expect(result).toEqual([]);
  });
});

describe("purchases.createBillingPortalSession", () => {
  it("throws error when no Stripe customer is found", async () => {
    const { getUserPurchases } = await import("./db");
    (getUserPurchases as any).mockResolvedValueOnce([
      { id: 1, userId: 1, productId: 5, type: "one_time", status: "active", stripeCustomerId: null },
    ]);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.purchases.createBillingPortalSession()
    ).rejects.toThrow("No Stripe customer found");
  });

  it("throws error when user has no purchases at all", async () => {
    const { getUserPurchases } = await import("./db");
    (getUserPurchases as any).mockResolvedValueOnce([]);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.purchases.createBillingPortalSession()
    ).rejects.toThrow("No Stripe customer found");
  });
});
