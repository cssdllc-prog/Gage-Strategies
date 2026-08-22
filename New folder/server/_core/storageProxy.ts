import type { Express } from "express";
import { storageGetSignedUrl } from "../storage";

const STORAGE_PREFIX = "/manus-storage/";

export function registerStorageProxy(app: Express) {
  // Plain middleware with a string-prefix check instead of an Express route
  // pattern (e.g. app.get("/manus-storage/*", ...)). This sidesteps any
  // path-to-regexp version quirks entirely, since there's no pattern
  // matching involved at all — just a direct string comparison.
  app.use(async (req, res, next) => {
    if (req.method !== "GET" || !req.path.startsWith(STORAGE_PREFIX)) {
      next();
      return;
    }

    const key = req.path.slice(STORAGE_PREFIX.length);
    console.log("[StorageProxy] Request for key:", key);
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    try {
      console.log("[StorageProxy] Generating signed URL...");
      const signedUrl = await storageGetSignedUrl(key);
      console.log("[StorageProxy] Signed URL generated, redirecting");
      res.set("Cache-Control", "no-store");
      res.redirect(307, signedUrl);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}
