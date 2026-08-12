import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Product categories (e.g., "AI Automation", "CRM", "Email Marketing")
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * AI Solutions and SaaS products available on the marketplace
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  longDescription: text("longDescription"),
  categoryId: int("categoryId").notNull(),
  image: varchar("image", { length: 512 }),
  icon: varchar("icon", { length: 512 }),
  features: text("features"), // JSON array as text
  pricing: varchar("pricing", { length: 64 }), // "free", "one-time", "subscription"
  basePrice: decimal("basePrice", { precision: 10, scale: 2 }),
  monthlyPrice: decimal("monthlyPrice", { precision: 10, scale: 2 }),
  isPopular: boolean("isPopular").default(false),
  downloadUrl: varchar("downloadUrl", { length: 512 }),
  demoUrl: varchar("demoUrl", { length: 512 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Subscription pricing tiers
 */
export const pricingTiers = mysqlTable("pricingTiers", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  monthlyPrice: decimal("monthlyPrice", { precision: 10, scale: 2 }).notNull(),
  yearlyPrice: decimal("yearlyPrice", { precision: 10, scale: 2 }),
  description: text("description"),
  features: text("features"), // JSON array as text
  isPopular: boolean("isPopular").default(false),
  order: int("order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PricingTier = typeof pricingTiers.$inferSelect;
export type InsertPricingTier = typeof pricingTiers.$inferInsert;

/**
 * User subscriptions to pricing tiers
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tierId: int("tierId").notNull(),
  status: mysqlEnum("status", ["active", "cancelled", "expired"]).default("active").notNull(),
  startDate: timestamp("startDate").defaultNow().notNull(),
  endDate: timestamp("endDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Lead capture form submissions
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  company: varchar("company", { length: 255 }),
  message: text("message"),
  inquiryType: varchar("inquiryType", { length: 64 }).default("general"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

/**
 * Solution bundles - curated groups of products sold together at a discount
 */
export const bundles = mysqlTable("bundles", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 64 }),
  productIds: text("productIds"), // JSON array of product IDs
  originalPrice: decimal("originalPrice", { precision: 10, scale: 2 }).notNull(),
  bundlePrice: decimal("bundlePrice", { precision: 10, scale: 2 }).notNull(),
  savings: varchar("savings", { length: 64 }),
  isPopular: boolean("isPopular").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Bundle = typeof bundles.$inferSelect;
export type InsertBundle = typeof bundles.$inferInsert;

/**
 * Downloadable assets attached to products (templates, guides, SOPs, etc.)
 */
export const productAssets = mysqlTable("productAssets", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  fileUrl: varchar("fileUrl", { length: 512 }).notNull(),
  fileKey: varchar("fileKey", { length: 512 }).notNull(),
  fileType: varchar("fileType", { length: 64 }), // "pdf", "xlsx", "zip", etc.
  fileSize: int("fileSize"), // in bytes
  order: int("order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProductAsset = typeof productAssets.$inferSelect;
export type InsertProductAsset = typeof productAssets.$inferInsert;

/**
 * Product screenshots/gallery images for marketing display
 */
export const productScreenshots = mysqlTable("productScreenshots", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  imageUrl: varchar("imageUrl", { length: 512 }).notNull(),
  caption: varchar("caption", { length: 255 }),
  order: int("order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProductScreenshot = typeof productScreenshots.$inferSelect;
export type InsertProductScreenshot = typeof productScreenshots.$inferInsert;

/**
 * Activity log - tracks downloads, white-label requests, and other user actions
 */
export const activityLog = mysqlTable("activityLog", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  userEmail: varchar("userEmail", { length: 320 }),
  action: varchar("action", { length: 64 }).notNull(), // "download", "whitelabel", "view", "lead_submit"
  productId: int("productId"),
  productName: varchar("productName", { length: 255 }),
  metadata: text("metadata"), // JSON for extra info
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLog.$inferSelect;
export type InsertActivityLog = typeof activityLog.$inferInsert;

/**
 * Purchases - tracks completed one-time purchases and active subscriptions
 * Follows Stripe best practice: store only Stripe IDs + business-specific fields
 */
export const purchases = mysqlTable("purchases", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  orgId: int("orgId"),
  productId: int("productId").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSessionId: varchar("stripeSessionId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  type: mysqlEnum("type", ["one_time", "subscription"]).notNull(),
  status: mysqlEnum("status", ["active", "pending_cancel", "cancelled", "expired", "refunded"]).default("active").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 10 }).default("usd"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = typeof purchases.$inferInsert;

/**
 * Company profiles - allows clients to save their branding info
 * When they download purchased products, GAGE branding is replaced with theirs
 */
export const companyProfiles = mysqlTable("companyProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  companyName: varchar("companyName", { length: 255 }),
  tagline: varchar("tagline", { length: 500 }),
  logoUrl: varchar("logoUrl", { length: 512 }),
  website: varchar("website", { length: 255 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 64 }),
  address: text("address"),
  primaryColor: varchar("primaryColor", { length: 32 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CompanyProfile = typeof companyProfiles.$inferSelect;
export type InsertCompanyProfile = typeof companyProfiles.$inferInsert;

/**
 * Blog posts - supports original content, curated/reposted content, and commentary
 */
export const blogPosts = mysqlTable("blogPosts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  excerpt: text("excerpt"), // Short summary for listing pages
  content: text("content").notNull(), // Markdown content
  contentType: mysqlEnum("contentType", ["original", "curated", "commentary"]).default("original").notNull(),
  // For curated/reposted content
  sourceUrl: varchar("sourceUrl", { length: 1024 }), // Link to original article
  sourceAuthor: varchar("sourceAuthor", { length: 255 }), // Original author name
  sourcePublication: varchar("sourcePublication", { length: 255 }), // e.g. "Harvard Business Review"
  // Metadata
  category: varchar("category", { length: 128 }),
  tags: text("tags"), // JSON array of tag strings
  coverImage: varchar("coverImage", { length: 512 }),
  authorId: int("authorId"), // references users.id for the poster
  authorName: varchar("authorName", { length: 255 }), // display name override
  // Status
  status: mysqlEnum("status", ["draft", "published"]).default("draft").notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * Organizations - workspaces that group company profiles, purchases, and team members
 */
export const organizations = mysqlTable("organizations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  logoUrl: varchar("logoUrl", { length: 512 }),
  website: varchar("website", { length: 255 }),
  ownerId: int("ownerId").notNull(), // references users.id
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = typeof organizations.$inferInsert;

/**
 * Organization members - links users to organizations with roles
 */
export const orgMembers = mysqlTable("orgMembers", {
  id: int("id").autoincrement().primaryKey(),
  orgId: int("orgId").notNull(), // references organizations.id
  userId: int("userId").notNull(), // references users.id
  role: mysqlEnum("role", ["owner", "admin", "member"]).default("member").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});

export type OrgMember = typeof orgMembers.$inferSelect;
export type InsertOrgMember = typeof orgMembers.$inferInsert;

/**
 * Organization invites - pending invitations to join an org
 */
export const orgInvites = mysqlTable("orgInvites", {
  id: int("id").autoincrement().primaryKey(),
  orgId: int("orgId").notNull(), // references organizations.id
  email: varchar("email", { length: 320 }).notNull(),
  role: mysqlEnum("role", ["admin", "member"]).default("member").notNull(),
  token: varchar("token", { length: 128 }).notNull().unique(),
  status: mysqlEnum("status", ["pending", "accepted", "expired"]).default("pending").notNull(),
  invitedBy: int("invitedBy").notNull(), // references users.id
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrgInvite = typeof orgInvites.$inferSelect;
export type InsertOrgInvite = typeof orgInvites.$inferInsert;
