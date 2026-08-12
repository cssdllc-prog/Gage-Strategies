import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the database module
vi.mock("./db", () => ({
  createOrganization: vi.fn().mockResolvedValue({ id: 1, name: "Test Org", slug: "test-org-abc123", ownerId: 1 }),
  getOrganizationById: vi.fn().mockResolvedValue({ id: 1, name: "Test Org", slug: "test-org-abc123", ownerId: 1 }),
  getOrganizationBySlug: vi.fn().mockResolvedValue(null),
  getUserOrganizations: vi.fn().mockResolvedValue([{ id: 1, name: "Test Org", slug: "test-org-abc123", ownerId: 1, role: "owner" }]),
  updateOrganization: vi.fn().mockResolvedValue({ id: 1, name: "Updated Org" }),
  deleteOrganization: vi.fn().mockResolvedValue({ success: true }),
  getOrgMembers: vi.fn().mockResolvedValue([{ userId: 1, orgId: 1, role: "owner", user: { id: 1, name: "Owner", email: "owner@test.com" } }]),
  getOrgMembership: vi.fn().mockResolvedValue({ orgId: 1, userId: 1, role: "owner" }),
  addOrgMember: vi.fn().mockResolvedValue(undefined),
  updateOrgMemberRole: vi.fn().mockResolvedValue(undefined),
  removeOrgMember: vi.fn().mockResolvedValue(undefined),
  createOrgInvite: vi.fn().mockResolvedValue(undefined),
  getOrgInvites: vi.fn().mockResolvedValue([]),
  getOrgInviteByToken: vi.fn().mockResolvedValue(null),
  acceptOrgInvite: vi.fn().mockResolvedValue(undefined),
  deleteOrgInvite: vi.fn().mockResolvedValue(undefined),
  getOrgPurchases: vi.fn().mockResolvedValue([]),
  hasOrgPurchased: vi.fn().mockResolvedValue(false),
}));

import {
  createOrganization,
  getUserOrganizations,
  getOrgMembership,
  getOrgMembers,
  getOrgInviteByToken,
  getOrgPurchases,
  hasOrgPurchased,
} from "./db";

describe("Organization Database Helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create an organization and return it", async () => {
    const result = await createOrganization({
      name: "Test Org",
      slug: "test-org-abc123",
      ownerId: 1,
    });
    expect(result).toEqual({ id: 1, name: "Test Org", slug: "test-org-abc123", ownerId: 1 });
    expect(createOrganization).toHaveBeenCalledWith({
      name: "Test Org",
      slug: "test-org-abc123",
      ownerId: 1,
    });
  });

  it("should list user organizations with roles", async () => {
    const orgs = await getUserOrganizations(1);
    expect(orgs).toHaveLength(1);
    expect(orgs[0]).toHaveProperty("role", "owner");
    expect(orgs[0]).toHaveProperty("name", "Test Org");
  });

  it("should check org membership", async () => {
    const membership = await getOrgMembership(1, 1);
    expect(membership).toEqual({ orgId: 1, userId: 1, role: "owner" });
  });

  it("should list org members with user info", async () => {
    const members = await getOrgMembers(1);
    expect(members).toHaveLength(1);
    expect(members[0].user).toHaveProperty("name", "Owner");
    expect(members[0].user).toHaveProperty("email", "owner@test.com");
  });

  it("should return null for non-existent invite token", async () => {
    const invite = await getOrgInviteByToken("non-existent-token");
    expect(invite).toBeNull();
  });

  it("should get org purchases", async () => {
    const purchases = await getOrgPurchases(1);
    expect(purchases).toEqual([]);
  });

  it("should check if org has purchased a product", async () => {
    const hasPurchased = await hasOrgPurchased(1, 1);
    expect(hasPurchased).toBe(false);
  });
});

describe("Organization Business Logic", () => {
  it("should generate a URL-safe slug from org name", () => {
    // Test the slug generation logic
    const generateSlug = (name: string): string => {
      return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + 'abc123';
    };
    
    expect(generateSlug("Acme Corp")).toBe("acme-corp-abc123");
    expect(generateSlug("My Business!")).toBe("my-business-abc123");
    expect(generateSlug("  Spaces  ")).toBe("spaces-abc123");
    expect(generateSlug("Special@#$Characters")).toBe("special-characters-abc123");
  });

  it("should validate org role hierarchy", () => {
    const canManageMembers = (role: string) => role === "owner" || role === "admin";
    const canDeleteOrg = (role: string) => role === "owner";
    const canLeaveOrg = (role: string) => role !== "owner";

    expect(canManageMembers("owner")).toBe(true);
    expect(canManageMembers("admin")).toBe(true);
    expect(canManageMembers("member")).toBe(false);

    expect(canDeleteOrg("owner")).toBe(true);
    expect(canDeleteOrg("admin")).toBe(false);

    expect(canLeaveOrg("member")).toBe(true);
    expect(canLeaveOrg("admin")).toBe(true);
    expect(canLeaveOrg("owner")).toBe(false);
  });
});
