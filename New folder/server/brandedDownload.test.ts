import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", async () => {
  const actual = await vi.importActual("./db");
  return {
    ...actual,
    hasUserPurchased: vi.fn(),
    getProductById: vi.fn(),
    getProductAssets: vi.fn(),
    getCompanyProfile: vi.fn(),
    logActivity: vi.fn(),
  };
});

// Mock storage
vi.mock("./storage", () => ({
  storageGetSignedUrl: vi.fn(),
  storagePut: vi.fn(),
  storageGet: vi.fn(),
}));

import { hasUserPurchased, getProductById, getProductAssets, getCompanyProfile, logActivity } from "./db";
import { storageGetSignedUrl } from "./storage";

const mockedHasUserPurchased = vi.mocked(hasUserPurchased);
const mockedGetProductById = vi.mocked(getProductById);
const mockedGetProductAssets = vi.mocked(getProductAssets);
const mockedGetCompanyProfile = vi.mocked(getCompanyProfile);
const mockedLogActivity = vi.mocked(logActivity);
const mockedStorageGetSignedUrl = vi.mocked(storageGetSignedUrl);

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 42,
      openId: "test-user-42",
      email: "client@example.com",
      name: "Test Client",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: { origin: "https://example.com" },
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("assets.brandedDownload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("replaces branding tokens in HTML files with user's company profile", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Setup mocks
    mockedHasUserPurchased.mockResolvedValue(true);
    mockedGetProductById.mockResolvedValue({
      id: 90001,
      name: "Project Lifecycle Planner",
      slug: "project-lifecycle",
      description: "A tool",
      categoryId: 1,
      image: null,
      icon: null,
      features: null,
      pricing: "one-time",
      basePrice: "49.00",
      monthlyPrice: null,
      isPopular: false,
      downloadUrl: null,
      demoUrl: null,
      longDescription: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockedGetProductAssets.mockResolvedValue([
      {
        id: 200,
        productId: 90001,
        name: "Project Lifecycle Planner (Branded HTML)",
        description: "Interactive HTML tool",
        fileUrl: "/manus-storage/project-lifecycle-enhanced_f5a0034e.html",
        fileKey: "project-lifecycle-enhanced_f5a0034e.html",
        fileType: "html",
        fileSize: 89041,
        order: 1,
        createdAt: new Date(),
      },
    ]);
    mockedGetCompanyProfile.mockResolvedValue({
      id: 1,
      userId: 42,
      companyName: "Acme Corp",
      tagline: "Building the Future",
      logoUrl: "https://example.com/logo.png",
      website: "acme.com",
      email: "hello@acme.com",
      phone: "(555) 987-6543",
      address: "123 Main St",
      primaryColor: "#ff0000",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Mock the fetch of the HTML file
    const mockHtml = `<html><head><title>{{COMPANY_NAME}}</title></head><body>
      <div>{{COMPANY_NAME}}</div>
      <div>{{TAGLINE}}</div>
      <div>{{EMAIL}}</div>
      <div>{{WEBSITE}}</div>
      <div>{{PHONE}}</div>
      <img src="{{LOGO_URL}}">
    </body></html>`;

    mockedStorageGetSignedUrl.mockResolvedValue("https://s3.example.com/signed-url");
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockHtml),
    }) as any;

    const result = await caller.assets.brandedDownload({
      productId: 90001,
      assetId: 200,
    });

    expect(result.type).toBe("html");
    if (result.type === "html") {
      expect(result.content).toContain("Acme Corp");
      expect(result.content).toContain("Building the Future");
      expect(result.content).toContain("hello@acme.com");
      expect(result.content).toContain("acme.com");
      expect(result.content).toContain("(555) 987-6543");
      expect(result.content).toContain("https://example.com/logo.png");
      expect(result.content).not.toContain("{{COMPANY_NAME}}");
      expect(result.content).not.toContain("{{TAGLINE}}");
      expect(result.fileName).toContain("Acme Corp");
    }

    // Verify activity was logged
    expect(mockedLogActivity).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 42,
        action: "download",
        productId: 90001,
      })
    );
  });

  it("uses GAGE defaults when user has no company profile", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    mockedHasUserPurchased.mockResolvedValue(true);
    mockedGetProductById.mockResolvedValue({
      id: 90001,
      name: "Project Lifecycle Planner",
      slug: "project-lifecycle",
      description: "A tool",
      categoryId: 1,
      image: null,
      icon: null,
      features: null,
      pricing: "one-time",
      basePrice: "49.00",
      monthlyPrice: null,
      isPopular: false,
      downloadUrl: null,
      demoUrl: null,
      longDescription: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockedGetProductAssets.mockResolvedValue([
      {
        id: 200,
        productId: 90001,
        name: "Project Lifecycle Planner (Branded HTML)",
        description: "Interactive HTML tool",
        fileUrl: "/manus-storage/project-lifecycle-enhanced_f5a0034e.html",
        fileKey: "project-lifecycle-enhanced_f5a0034e.html",
        fileType: "html",
        fileSize: 89041,
        order: 1,
        createdAt: new Date(),
      },
    ]);
    mockedGetCompanyProfile.mockResolvedValue(null);

    const mockHtml = `<html><title>{{COMPANY_NAME}}</title><body>{{EMAIL}} {{WEBSITE}}</body></html>`;
    mockedStorageGetSignedUrl.mockResolvedValue("https://s3.example.com/signed-url");
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockHtml),
    }) as any;

    const result = await caller.assets.brandedDownload({
      productId: 90001,
      assetId: 200,
    });

    expect(result.type).toBe("html");
    if (result.type === "html") {
      expect(result.content).toContain("GAGE Strategies");
      expect(result.content).toContain("hello@gage-strategies.com");
      expect(result.content).toContain("gage-strategies.com");
    }
  });

  it("returns redirect for non-HTML files", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    mockedHasUserPurchased.mockResolvedValue(true);
    mockedGetProductById.mockResolvedValue({
      id: 90001,
      name: "Project Lifecycle Planner",
      slug: "project-lifecycle",
      description: "A tool",
      categoryId: 1,
      image: null,
      icon: null,
      features: null,
      pricing: "one-time",
      basePrice: "49.00",
      monthlyPrice: null,
      isPopular: false,
      downloadUrl: null,
      demoUrl: null,
      longDescription: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockedGetProductAssets.mockResolvedValue([
      {
        id: 100,
        productId: 90001,
        name: "Project Lifecycle Planner v2 (Enhanced)",
        description: "ZIP download",
        fileUrl: "/manus-storage/project-lifecycle-planner-v2_1b6c3d38.zip",
        fileKey: "project-lifecycle-planner-v2_1b6c3d38.zip",
        fileType: "zip",
        fileSize: 21828,
        order: 0,
        createdAt: new Date(),
      },
    ]);
    mockedGetCompanyProfile.mockResolvedValue(null);

    const result = await caller.assets.brandedDownload({
      productId: 90001,
      assetId: 100,
    });

    expect(result.type).toBe("redirect");
    if (result.type === "redirect") {
      expect(result.url).toBe("/manus-storage/project-lifecycle-planner-v2_1b6c3d38.zip");
    }
  });

  it("throws error when user has not purchased a paid product", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    mockedHasUserPurchased.mockResolvedValue(false);
    mockedGetProductById.mockResolvedValue({
      id: 90001,
      name: "Project Lifecycle Planner",
      slug: "project-lifecycle",
      description: "A tool",
      categoryId: 1,
      image: null,
      icon: null,
      features: null,
      pricing: "one-time",
      basePrice: "49.00",
      monthlyPrice: null,
      isPopular: false,
      downloadUrl: null,
      demoUrl: null,
      longDescription: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      caller.assets.brandedDownload({ productId: 90001, assetId: 200 })
    ).rejects.toThrow("You must purchase this product to download.");
  });

  it("allows download for free products without purchase", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    mockedHasUserPurchased.mockResolvedValue(false);
    mockedGetProductById.mockResolvedValue({
      id: 90002,
      name: "Free Tool",
      slug: "free-tool",
      description: "A free tool",
      categoryId: 1,
      image: null,
      icon: null,
      features: null,
      pricing: "free",
      basePrice: null,
      monthlyPrice: null,
      isPopular: false,
      downloadUrl: null,
      demoUrl: null,
      longDescription: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockedGetProductAssets.mockResolvedValue([
      {
        id: 300,
        productId: 90002,
        name: "Free Template (HTML)",
        description: "Free branded template",
        fileUrl: "/manus-storage/free-template.html",
        fileKey: "free-template.html",
        fileType: "html",
        fileSize: 5000,
        order: 0,
        createdAt: new Date(),
      },
    ]);
    mockedGetCompanyProfile.mockResolvedValue({
      id: 1,
      userId: 42,
      companyName: "My Free Co",
      tagline: "Free is great",
      logoUrl: "",
      website: "free.co",
      email: "hi@free.co",
      phone: "",
      address: null,
      primaryColor: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const mockHtml = `<html>{{COMPANY_NAME}} - {{EMAIL}}</html>`;
    mockedStorageGetSignedUrl.mockResolvedValue("https://s3.example.com/free");
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockHtml),
    }) as any;

    const result = await caller.assets.brandedDownload({
      productId: 90002,
      assetId: 300,
    });

    expect(result.type).toBe("html");
    if (result.type === "html") {
      expect(result.content).toContain("My Free Co");
      expect(result.content).toContain("hi@free.co");
    }
  });
});
