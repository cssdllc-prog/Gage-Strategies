// File storage backed by Cloudflare R2 (S3-compatible, zero egress fees).
// Uses the same AWS SDK as regular S3 — R2 just needs a custom endpoint and
// its own credentials, since it speaks the S3 API rather than being AWS.
//
// Upload path: files are PUT directly to R2 from the server.
// Download path: /manus-storage/{key} is served by storageProxy.ts, which
// redirects to a short-lived signed R2 URL. The route prefix is kept as
// "/manus-storage" (rather than renamed) so any already-stored asset URLs
// in the database keep working without a data migration.

import crypto from "crypto";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ENV } from "./_core/env";

let cachedClient: S3Client | null = null;

function getR2Client(): S3Client {
  if (!ENV.r2AccountId || !ENV.r2AccessKeyId || !ENV.r2SecretAccessKey) {
    throw new Error(
      "Storage config missing: set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY"
    );
  }
  if (!cachedClient) {
    cachedClient = new S3Client({
      region: "auto",
      endpoint: `https://${ENV.r2AccountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: ENV.r2AccessKeyId,
        secretAccessKey: ENV.r2SecretAccessKey,
      },
    });
  }
  return cachedClient;
}

function requireBucket(): string {
  if (!ENV.r2BucketName) {
    throw new Error("Storage config missing: set R2_BUCKET_NAME");
  }
  return ENV.r2BucketName;
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

function appendHashSuffix(relKey: string): string {
  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1) return `${relKey}_${hash}`;
  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const client = getR2Client();
  const bucket = requireBucket();
  const key = appendHashSuffix(normalizeKey(relKey));

  const body =
    typeof data === "string" ? Buffer.from(data, "utf-8") : Buffer.from(data);

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  return { key, url: `/manus-storage/${key}` };
}

export async function storageGet(
  relKey: string
): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  return { key, url: `/manus-storage/${key}` };
}

export async function storageGetSignedUrl(relKey: string): Promise<string> {
  const client = getR2Client();
  const bucket = requireBucket();
  const key = normalizeKey(relKey);

  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  // Signed URL valid for 1 hour — plenty for a redirect-then-download flow,
  // short enough that leaked links don't stay useful indefinitely.
  return getSignedUrl(client, command, { expiresIn: 3600 });
}
