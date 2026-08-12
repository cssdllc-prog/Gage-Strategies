import { eq } from "drizzle-orm";
import { desc, sql, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { companyProfiles, InsertUser, users, categories, products, pricingTiers, subscriptions, leads, bundles, productAssets, activityLog, InsertLead, purchases, InsertPurchase, productScreenshots, blogPosts } from "../drizzle/schema";
import { organizations, orgMembers, orgInvites } from "../drizzle/schema";
import type { InsertCompanyProfile, InsertBlogPost, InsertOrganization, InsertOrgMember, InsertOrgInvite } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get all product categories
 */
export async function getCategories() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(categories).orderBy(categories.name);
}

/**
 * Get all products with optional filtering
 */
export async function getProducts(categoryId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  let query: any = db.select().from(products);
  if (categoryId) {
    query = query.where(eq(products.categoryId, categoryId));
  }
  return await query.orderBy(products.name);
}

/**
 * Get a single product by slug
 */
export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get all pricing tiers
 */
export async function getPricingTiers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(pricingTiers).orderBy(pricingTiers.order);
}

/**
 * Create a lead from contact form
 */
export async function createLead(data: InsertLead) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(leads).values(data);
}

/**
 * Get all solution bundles
 */
export async function getBundles() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(bundles);
}

/**
 * Get a single bundle by slug
 */
export async function getBundleBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(bundles).where(eq(bundles.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get all assets for a product
 */
export async function getProductAssets(productId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(productAssets).where(eq(productAssets.productId, productId)).orderBy(productAssets.order);
}

/**
 * Add an asset to a product
 */
export async function addProductAsset(data: { productId: number; name: string; description?: string; fileUrl: string; fileKey: string; fileType?: string; fileSize?: number; order?: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(productAssets).values(data);
}

// ==================== ADMIN HELPERS ====================

/**
 * Get admin dashboard metrics
 */
export async function getAdminMetrics() {
  const db = await getDb();
  if (!db) return { totalProducts: 0, totalLeads: 0, totalDownloads: 0, totalUsers: 0, recentLeads: [] };

  const [productCount] = await db.select({ count: count() }).from(products);
  const [leadCount] = await db.select({ count: count() }).from(leads);
  const [userCount] = await db.select({ count: count() }).from(users);
  const [downloadCount] = await db.select({ count: count() }).from(activityLog);
  const recentLeads = await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(5);

  return {
    totalProducts: productCount?.count ?? 0,
    totalLeads: leadCount?.count ?? 0,
    totalDownloads: downloadCount?.count ?? 0,
    totalUsers: userCount?.count ?? 0,
    recentLeads,
  };
}

/**
 * Get all leads with pagination
 */
export async function getAllLeads(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(limit).offset(offset);
}

/**
 * Get all activity logs
 */
export async function getActivityLogs(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(activityLog).orderBy(desc(activityLog.createdAt)).limit(limit).offset(offset);
}

/**
 * Log an activity
 */
export async function logActivity(data: { userId?: number; userEmail?: string; action: string; productId?: number; productName?: string; metadata?: string }) {
  const db = await getDb();
  if (!db) return;
  await db.insert(activityLog).values(data);
}

/**
 * Update a product
 */
export async function updateProduct(id: number, data: Partial<{ name: string; description: string; longDescription: string; categoryId: number; pricing: string; basePrice: string; monthlyPrice: string; isPopular: boolean; features: string; icon: string }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(products).set(data).where(eq(products.id, id));
}

/**
 * Create a new product
 */
export async function createProduct(data: { name: string; slug: string; description: string; longDescription?: string; categoryId: number; pricing?: string; basePrice?: string; monthlyPrice?: string; isPopular?: boolean; features?: string; icon?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(products).values(data);
}

/**
 * Delete a product
 */
export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(productAssets).where(eq(productAssets.productId, id));
  await db.delete(products).where(eq(products.id, id));
}

/**
 * Delete a product asset
 */
export async function deleteProductAsset(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(productAssets).where(eq(productAssets.id, id));
}

/**
 * Create a new category
 */
export async function createCategory(data: { name: string; slug: string; description?: string; icon?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(categories).values(data);
}

/**
 * Update a category
 */
export async function updateCategory(id: number, data: Partial<{ name: string; slug: string; description: string; icon: string }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(categories).set(data).where(eq(categories.id, id));
}

/**
 * Delete a category
 */
export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(categories).where(eq(categories.id, id));
}

/**
 * Delete a lead
 */
export async function deleteLead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(leads).where(eq(leads.id, id));
}

// ==================== PURCHASE HELPERS ====================

/**
 * Create a purchase record
 */
export async function createPurchase(data: InsertPurchase) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(purchases).values(data);
}

/**
 * Check if a user has purchased a specific product (active purchase)
 */
export async function hasUserPurchased(userId: number, productId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select().from(purchases)
    .where(sql`${purchases.userId} = ${userId} AND ${purchases.productId} = ${productId} AND (${purchases.status} = 'active' OR ${purchases.status} = 'pending_cancel')`)
    .limit(1);
  return result.length > 0;
}

/**
 * Get all purchases for a user
 */
export async function getUserPurchases(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(purchases)
    .where(eq(purchases.userId, userId))
    .orderBy(desc(purchases.createdAt));
}

/**
 * Get all purchases for an organization (shared team purchases)
 */
export async function getOrgPurchases(orgId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(purchases)
    .where(eq(purchases.orgId, orgId))
    .orderBy(desc(purchases.createdAt));
}

/**
 * Check if an org has purchased a specific product
 */
export async function hasOrgPurchased(orgId: number, productId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select().from(purchases)
    .where(sql`${purchases.orgId} = ${orgId} AND ${purchases.productId} = ${productId} AND (${purchases.status} = 'active' OR ${purchases.status} = 'pending_cancel')`)
    .limit(1);
  return result.length > 0;
}

/**
 * Get all purchases (admin)
 */
export async function getAllPurchases(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(purchases)
    .orderBy(desc(purchases.createdAt))
    .limit(limit)
    .offset(offset);
}

/**
 * Update purchase status by stripe session ID
 */
export async function updatePurchaseBySessionId(sessionId: string, data: Partial<{ status: "active" | "pending_cancel" | "cancelled" | "expired" | "refunded"; stripeCustomerId: string; stripeSubscriptionId: string }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(purchases).set(data).where(eq(purchases.stripeSessionId, sessionId));
}

/**
 * Update purchase status by stripe subscription ID
 */
export async function updatePurchaseBySubscriptionId(subscriptionId: string, data: Partial<{ status: "active" | "pending_cancel" | "cancelled" | "expired" | "refunded" }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(purchases).set(data).where(eq(purchases.stripeSubscriptionId, subscriptionId));
}

// Re-export types for use in routers
export { categories, products, pricingTiers, subscriptions, leads, bundles, productAssets, activityLog, purchases } from "../drizzle/schema";
export type { Category, Product, PricingTier, Subscription, Lead, Bundle, ProductAsset, ActivityLog, Purchase } from "../drizzle/schema";

/**
 * Get product screenshots by product ID
 */
export async function getProductScreenshots(productId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(productScreenshots).where(eq(productScreenshots.productId, productId)).orderBy(productScreenshots.order);
}

/**
 * Get company profile by user ID
 */
export async function getCompanyProfile(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(companyProfiles).where(eq(companyProfiles.userId, userId));
  return rows[0] || null;
}

/**
 * Upsert company profile (create or update)
 */
export async function upsertCompanyProfile(userId: number, data: Partial<Omit<InsertCompanyProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getCompanyProfile(userId);
  if (existing) {
    await db.update(companyProfiles).set(data).where(eq(companyProfiles.userId, userId));
  } else {
    await db.insert(companyProfiles).values({ userId, ...data });
  }
  return await getCompanyProfile(userId);
}

// ==================== BLOG POSTS ====================

/**
 * Get all published blog posts (public, ordered by publishedAt desc)
 */
export async function getPublishedBlogPosts(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(blogPosts)
    .where(eq(blogPosts.status, "published"))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit)
    .offset(offset);
}

/**
 * Get a single published blog post by slug (public)
 */
export async function getPublishedBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(blogPosts)
    .where(sql`${blogPosts.slug} = ${slug} AND ${blogPosts.status} = 'published'`);
  return rows[0] || null;
}

/**
 * Get all blog posts (admin - includes drafts)
 */
export async function getAllBlogPosts(limit = 100, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(blogPosts)
    .orderBy(desc(blogPosts.createdAt))
    .limit(limit)
    .offset(offset);
}

/**
 * Get a blog post by ID (admin)
 */
export async function getBlogPostById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
  return rows[0] || null;
}

/**
 * Create a new blog post
 */
export async function createBlogPost(data: Omit<InsertBlogPost, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(blogPosts).values(data);
  return { success: true };
}

/**
 * Update a blog post
 */
export async function updateBlogPost(id: number, data: Partial<Omit<InsertBlogPost, 'id' | 'createdAt' | 'updatedAt'>>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
  return { success: true };
}

/**
 * Delete a blog post
 */
export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  return { success: true };
}

// ==================== ORGANIZATIONS ====================

/**
 * Create a new organization and add the creator as owner
 */
export async function createOrganization(data: { name: string; slug: string; ownerId: number; logoUrl?: string; website?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(organizations).values(data);
  const orgId = result[0].insertId;
  // Add creator as owner member
  await db.insert(orgMembers).values({ orgId, userId: data.ownerId, role: "owner" });
  return await getOrganizationById(orgId);
}

/**
 * Get organization by ID
 */
export async function getOrganizationById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(organizations).where(eq(organizations.id, id));
  return rows[0] || null;
}

/**
 * Get organization by slug
 */
export async function getOrganizationBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(organizations).where(eq(organizations.slug, slug));
  return rows[0] || null;
}

/**
 * Get all organizations a user belongs to (as owner, admin, or member)
 */
export async function getUserOrganizations(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const memberships = await db.select().from(orgMembers).where(eq(orgMembers.userId, userId));
  if (memberships.length === 0) return [];
  const orgIds = memberships.map(m => m.orgId);
  const orgs = await db.select().from(organizations).where(sql`${organizations.id} IN (${sql.join(orgIds.map(id => sql`${id}`), sql`, `)})`);
  // Attach role to each org
  return orgs.map(org => {
    const membership = memberships.find(m => m.orgId === org.id);
    return { ...org, role: membership?.role || "member" };
  });
}

/**
 * Update an organization
 */
export async function updateOrganization(id: number, data: Partial<Omit<InsertOrganization, 'id' | 'createdAt' | 'updatedAt'>>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(organizations).set(data).where(eq(organizations.id, id));
  return await getOrganizationById(id);
}

/**
 * Delete an organization and all its members/invites
 */
export async function deleteOrganization(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(orgInvites).where(eq(orgInvites.orgId, id));
  await db.delete(orgMembers).where(eq(orgMembers.orgId, id));
  await db.delete(organizations).where(eq(organizations.id, id));
  return { success: true };
}

// ==================== ORG MEMBERS ====================

/**
 * Get all members of an organization
 */
export async function getOrgMembers(orgId: number) {
  const db = await getDb();
  if (!db) return [];
  const members = await db.select().from(orgMembers).where(eq(orgMembers.orgId, orgId));
  if (members.length === 0) return [];
  const userIds = members.map(m => m.userId);
  const userRows = await db.select().from(users).where(sql`${users.id} IN (${sql.join(userIds.map(id => sql`${id}`), sql`, `)})`);
  return members.map(m => {
    const user = userRows.find(u => u.id === m.userId);
    return { ...m, user: user ? { id: user.id, name: user.name, email: user.email } : null };
  });
}

/**
 * Get a user's membership in a specific org
 */
export async function getOrgMembership(orgId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(orgMembers).where(sql`${orgMembers.orgId} = ${orgId} AND ${orgMembers.userId} = ${userId}`);
  return rows[0] || null;
}

/**
 * Add a member to an organization
 */
export async function addOrgMember(orgId: number, userId: number, role: "owner" | "admin" | "member" = "member") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(orgMembers).values({ orgId, userId, role });
}

/**
 * Update a member's role
 */
export async function updateOrgMemberRole(orgId: number, userId: number, role: "owner" | "admin" | "member") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(orgMembers).set({ role }).where(sql`${orgMembers.orgId} = ${orgId} AND ${orgMembers.userId} = ${userId}`);
}

/**
 * Remove a member from an organization
 */
export async function removeOrgMember(orgId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(orgMembers).where(sql`${orgMembers.orgId} = ${orgId} AND ${orgMembers.userId} = ${userId}`);
}

// ==================== ORG INVITES ====================

/**
 * Create an invite to join an organization
 */
export async function createOrgInvite(data: { orgId: number; email: string; role: "admin" | "member"; token: string; invitedBy: number; expiresAt: Date }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(orgInvites).values(data);
}

/**
 * Get pending invites for an organization
 */
export async function getOrgInvites(orgId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orgInvites).where(sql`${orgInvites.orgId} = ${orgId} AND ${orgInvites.status} = 'pending'`);
}

/**
 * Get an invite by token
 */
export async function getOrgInviteByToken(token: string) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(orgInvites).where(eq(orgInvites.token, token));
  return rows[0] || null;
}

/**
 * Accept an invite (update status)
 */
export async function acceptOrgInvite(token: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(orgInvites).set({ status: "accepted" }).where(eq(orgInvites.token, token));
}

/**
 * Delete/cancel an invite
 */
export async function deleteOrgInvite(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(orgInvites).where(eq(orgInvites.id, id));
}
