import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock modules before imports
vi.mock("./db", () => ({
  hasUserPurchased: vi.fn(),
  getProductById: vi.fn(),
  getProductAssets: vi.fn(),
  getCompanyProfile: vi.fn(),
  logActivity: vi.fn(),
}));

vi.mock("./storage", () => ({
  storageGetSignedUrl: vi.fn(),
  storagePut: vi.fn(),
  storageGet: vi.fn(),
}));

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

import { hasUserPurchased, getProductById, getProductAssets, getCompanyProfile, logActivity } from "./db";
import { storageGetSignedUrl } from "./storage";

describe("assets.bulkBrandedDownload", () => {
  const mockCtx: TrpcContext = {
    user: { id: 1, email: "test@example.com", name: "Test User", role: "user" as const },
    req: { headers: { origin: "http://localhost:3000" } } as any,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns branded HTML files for purchased products", async () => {
    const caller = appRouter.createCaller(mockCtx);
    (hasUserPurchased as any).mockResolvedValue(true);
    (getProductById as any).mockResolvedValue({ id: 100, name: "Test Product", pricing: "one-time" });
    (getProductAssets as any).mockResolvedValue([
      { id: 1, name: "Test Tool", fileUrl: "/manus-storage/test_abc123.html", fileKey: "test_abc123.html", fileType: "html" },
    ]);
    (getCompanyProfile as any).mockResolvedValue({
      companyName: "Acme Corp",
      tagline: "We do things",
      email: "info@acme.com",
      website: "acme.com",
      phone: "555-1234",
      logoUrl: "https://example.com/logo.png",
    });
    (storageGetSignedUrl as any).mockResolvedValue("https://s3.example.com/signed-url");
    mockFetch.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve("<html><body>{{COMPANY_NAME}} - {{TAGLINE}} - {{EMAIL}}</body></html>"),
    });

    const result = await caller.assets.bulkBrandedDownload({ productIds: [100] });

    expect(result.totalFiles).toBe(1);
    expect(result.files[0].type).toBe("html");
    expect(result.files[0].content).toContain("Acme Corp");
    expect(result.files[0].content).toContain("We do things");
    expect(result.files[0].content).toContain("info@acme.com");
    expect(result.files[0].content).not.toContain("{{COMPANY_NAME}}");
  });

  it("skips products the user has not purchased", async () => {
    const caller = appRouter.createCaller(mockCtx);
    (hasUserPurchased as any).mockResolvedValue(false);
    (getProductById as any).mockResolvedValue({ id: 200, name: "Paid Product", pricing: "one-time" });
    (getCompanyProfile as any).mockResolvedValue(null);

    const result = await caller.assets.bulkBrandedDownload({ productIds: [200] });

    expect(result.totalFiles).toBe(0);
    expect(result.files).toHaveLength(0);
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0].reason).toBe("Not purchased");
    expect(result.failures[0].productName).toBe("Paid Product");
  });

  it("includes free products without purchase check", async () => {
    const caller = appRouter.createCaller(mockCtx);
    (hasUserPurchased as any).mockResolvedValue(false);
    (getProductById as any).mockResolvedValue({ id: 300, name: "Free Tool", pricing: "free" });
    (getProductAssets as any).mockResolvedValue([
      { id: 5, name: "Free Asset", fileUrl: "/manus-storage/free_xyz.html", fileKey: "free_xyz.html", fileType: "html" },
    ]);
    (getCompanyProfile as any).mockResolvedValue(null);
    (storageGetSignedUrl as any).mockResolvedValue("https://s3.example.com/free-signed");
    mockFetch.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve("<html>{{COMPANY_NAME}}</html>"),
    });

    const result = await caller.assets.bulkBrandedDownload({ productIds: [300] });

    expect(result.totalFiles).toBe(1);
    expect(result.files[0].content).toContain("GAGE Strategies"); // default fallback
  });

  it("handles multiple products in one call", async () => {
    const caller = appRouter.createCaller(mockCtx);
    (hasUserPurchased as any).mockResolvedValue(true);
    (getProductById as any)
      .mockResolvedValueOnce({ id: 1, name: "Product A", pricing: "one-time" })
      .mockResolvedValueOnce({ id: 2, name: "Product B", pricing: "one-time" });
    (getProductAssets as any)
      .mockResolvedValueOnce([{ id: 10, name: "Asset A", fileUrl: "/manus-storage/a.html", fileKey: "a.html", fileType: "html" }])
      .mockResolvedValueOnce([{ id: 20, name: "Asset B", fileUrl: "/manus-storage/b.html", fileKey: "b.html", fileType: "html" }]);
    (getCompanyProfile as any).mockResolvedValue({ companyName: "Multi Corp" });
    (storageGetSignedUrl as any).mockResolvedValue("https://s3.example.com/signed");
    mockFetch.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve("<html>{{COMPANY_NAME}}</html>"),
    });

    const result = await caller.assets.bulkBrandedDownload({ productIds: [1, 2] });

    expect(result.totalFiles).toBe(2);
    expect(result.files).toHaveLength(2);
    expect(logActivity).toHaveBeenCalledWith(expect.objectContaining({
      action: "download",
      metadata: expect.stringContaining("2 files"),
    }));
  });

  it("returns redirect type for non-HTML assets", async () => {
    const caller = appRouter.createCaller(mockCtx);
    (hasUserPurchased as any).mockResolvedValue(true);
    (getProductById as any).mockResolvedValue({ id: 400, name: "ZIP Product", pricing: "one-time" });
    (getProductAssets as any).mockResolvedValue([
      { id: 30, name: "Archive", fileUrl: "/manus-storage/archive.zip", fileKey: "archive.zip", fileType: "zip" },
    ]);
    (getCompanyProfile as any).mockResolvedValue(null);

    const result = await caller.assets.bulkBrandedDownload({ productIds: [400] });

    expect(result.totalFiles).toBe(1);
    expect(result.files[0].type).toBe("redirect");
    expect(result.files[0].content).toBe("/manus-storage/archive.zip");
  });
});
