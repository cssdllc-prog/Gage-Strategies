CREATE TYPE "public"."blog_content_type" AS ENUM('original', 'curated', 'commentary');--> statement-breakpoint
CREATE TYPE "public"."blog_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."org_invite_role" AS ENUM('admin', 'member');--> statement-breakpoint
CREATE TYPE "public"."org_invite_status" AS ENUM('pending', 'accepted', 'expired');--> statement-breakpoint
CREATE TYPE "public"."org_member_role" AS ENUM('owner', 'admin', 'member');--> statement-breakpoint
CREATE TYPE "public"."purchase_status" AS ENUM('active', 'pending_cancel', 'cancelled', 'expired', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."purchase_type" AS ENUM('one_time', 'subscription');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'cancelled', 'expired');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "activityLog" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"userEmail" varchar(320),
	"action" varchar(64) NOT NULL,
	"productId" integer,
	"productName" varchar(255),
	"metadata" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blogPosts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(500) NOT NULL,
	"slug" varchar(500) NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"contentType" "blog_content_type" DEFAULT 'original' NOT NULL,
	"sourceUrl" varchar(1024),
	"sourceAuthor" varchar(255),
	"sourcePublication" varchar(255),
	"category" varchar(128),
	"tags" text,
	"coverImage" varchar(512),
	"authorId" integer,
	"authorName" varchar(255),
	"status" "blog_status" DEFAULT 'draft' NOT NULL,
	"publishedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blogPosts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "bundles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"icon" varchar(64),
	"productIds" text,
	"originalPrice" numeric(10, 2) NOT NULL,
	"bundlePrice" numeric(10, 2) NOT NULL,
	"savings" varchar(64),
	"isPopular" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bundles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"slug" varchar(128) NOT NULL,
	"description" text,
	"icon" varchar(64),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "companyProfiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"companyName" varchar(255),
	"tagline" varchar(500),
	"logoUrl" varchar(512),
	"website" varchar(255),
	"email" varchar(320),
	"phone" varchar(64),
	"address" text,
	"primaryColor" varchar(32),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "companyProfiles_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(320) NOT NULL,
	"company" varchar(255),
	"message" text,
	"inquiryType" varchar(64) DEFAULT 'general',
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orgInvites" (
	"id" serial PRIMARY KEY NOT NULL,
	"orgId" integer NOT NULL,
	"email" varchar(320) NOT NULL,
	"role" "org_invite_role" DEFAULT 'member' NOT NULL,
	"token" varchar(128) NOT NULL,
	"status" "org_invite_status" DEFAULT 'pending' NOT NULL,
	"invitedBy" integer NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orgInvites_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "orgMembers" (
	"id" serial PRIMARY KEY NOT NULL,
	"orgId" integer NOT NULL,
	"userId" integer NOT NULL,
	"role" "org_member_role" DEFAULT 'member' NOT NULL,
	"joinedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"logoUrl" varchar(512),
	"website" varchar(255),
	"ownerId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "organizations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "pricingTiers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"slug" varchar(128) NOT NULL,
	"monthlyPrice" numeric(10, 2) NOT NULL,
	"yearlyPrice" numeric(10, 2),
	"description" text,
	"features" text,
	"isPopular" boolean DEFAULT false,
	"order" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pricingTiers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "productAssets" (
	"id" serial PRIMARY KEY NOT NULL,
	"productId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"fileUrl" varchar(512) NOT NULL,
	"fileKey" varchar(512) NOT NULL,
	"fileType" varchar(64),
	"fileSize" integer,
	"order" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "productScreenshots" (
	"id" serial PRIMARY KEY NOT NULL,
	"productId" integer NOT NULL,
	"imageUrl" varchar(512) NOT NULL,
	"caption" varchar(255),
	"order" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"longDescription" text,
	"categoryId" integer NOT NULL,
	"image" varchar(512),
	"icon" varchar(512),
	"features" text,
	"pricing" varchar(64),
	"basePrice" numeric(10, 2),
	"monthlyPrice" numeric(10, 2),
	"isPopular" boolean DEFAULT false,
	"downloadUrl" varchar(512),
	"demoUrl" varchar(512),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "purchases" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"orgId" integer,
	"productId" integer NOT NULL,
	"stripeCustomerId" varchar(255),
	"stripeSessionId" varchar(255),
	"stripeSubscriptionId" varchar(255),
	"type" "purchase_type" NOT NULL,
	"status" "purchase_status" DEFAULT 'active' NOT NULL,
	"amount" numeric(10, 2),
	"currency" varchar(10) DEFAULT 'usd',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"tierId" integer NOT NULL,
	"status" "subscription_status" DEFAULT 'active' NOT NULL,
	"startDate" timestamp DEFAULT now() NOT NULL,
	"endDate" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
