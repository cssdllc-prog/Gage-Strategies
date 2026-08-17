import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { clerkClient, getAuth } from "@clerk/express";
import type { User } from "../../drizzle/schema";
import * as db from "../db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

/**
 * Resolves the local `users` row for the currently signed-in Clerk user,
 * creating it on first sign-in. The `openId` column (originally Manus's
 * identifier) now stores the Clerk user ID instead — same field, new source.
 * Admin-role assignment for the configured OWNER_OPEN_ID still happens
 * inside db.upsertUser, unchanged from before.
 */
async function resolveUser(clerkUserId: string): Promise<User | null> {
  let user = await db.getUserByOpenId(clerkUserId);

  if (!user) {
    try {
      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      const primaryEmail =
        clerkUser.emailAddresses.find(
          e => e.id === clerkUser.primaryEmailAddressId
        )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress ?? null;

      await db.upsertUser({
        openId: clerkUserId,
        name:
          [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
          clerkUser.username ||
          null,
        email: primaryEmail,
        loginMethod:
          clerkUser.externalAccounts[0]?.provider?.replace("oauth_", "") ??
          "email",
        lastSignedIn: new Date(),
      });
      user = await db.getUserByOpenId(clerkUserId);
    } catch (error) {
      console.error("[Auth] Failed to sync new user from Clerk:", error);
      return null;
    }
  } else {
    // Keep lastSignedIn fresh without a second Clerk API round-trip.
    await db.upsertUser({ openId: clerkUserId, lastSignedIn: new Date() });
    user = await db.getUserByOpenId(clerkUserId);
  }

  return user ?? null;
}

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    const auth = getAuth(opts.req);
    if (auth?.userId) {
      user = await resolveUser(auth.userId);
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
