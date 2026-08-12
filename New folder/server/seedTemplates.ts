/**
 * Seed script: Generate all branded PDF templates and update productAssets table.
 * Run via: npx tsx server/seedTemplates.ts
 */
import { generateAndStorePDF, getDefaultLogoBuffer } from "./pdfGenerator";
import { TEMPLATE_DEFINITIONS } from "./templateDefinitions";
import { getDb } from "./db";
import { productAssets } from "../drizzle/schema";
import { eq } from "drizzle-orm";

async function seedTemplates() {
  console.log("🚀 Generating branded PDF templates...\n");

  const db = await getDb();
  if (!db) {
    console.error("❌ Database not available. Set DATABASE_URL.");
    process.exit(1);
  }

  const logoBuffer = getDefaultLogoBuffer();
  if (logoBuffer) {
    console.log("✅ GAGE logo loaded for branding\n");
  } else {
    console.log("⚠️  No logo found, using text fallback\n");
  }

  for (const template of TEMPLATE_DEFINITIONS) {
    try {
      console.log(`📄 Generating: ${template.title}...`);
      const result = await generateAndStorePDF(
        { title: template.title, subtitle: template.subtitle, sections: template.sections, logoBuffer, companyName: "GAGE Strategies" },
        template.storageKey
      );

      // Remove old placeholder assets for this product
      await db.delete(productAssets).where(eq(productAssets.productId, template.productId));

      // Insert real asset record
      await db.insert(productAssets).values({
        productId: template.productId,
        name: template.fileName,
        description: template.description,
        fileUrl: result.url,
        fileKey: result.key,
        fileType: template.fileType,
        fileSize: result.size,
        order: 1,
      });

      console.log(`   ✅ Stored: ${result.url} (${(result.size / 1024).toFixed(1)} KB)\n`);
    } catch (err) {
      console.error(`   ❌ Failed: ${template.title}`, err);
    }
  }

  console.log("\n🎉 All templates generated and stored!");
  process.exit(0);
}

seedTemplates();
