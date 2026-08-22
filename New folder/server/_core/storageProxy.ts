import type { Express } from "express";
import { storageGetSignedUrl } from "../storage";

export function registerStorageProxy(app: Express) {
  app.get("/manus-storage/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
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
