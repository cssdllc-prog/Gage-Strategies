import PDFDocument from "pdfkit";
import { storagePut } from "./storage";
import * as fs from "fs";
import * as path from "path";

// GAGE brand colors
const BRAND = {
  primary: "#1B2B1B",
  accent: "#4A7A3D",
  lime: "#D9F36B",
  lightGreen: "#E8F5E0",
  gray: "#6B7280",
  white: "#FFFFFF",
};

// Default GAGE logo URL (stored in project)
const DEFAULT_LOGO_PATH = path.resolve("/home/ubuntu/webdev-static-assets/gage-strategies-logo.png");

/**
 * Load the default GAGE logo from the filesystem
 */
export function getDefaultLogoBuffer(): Buffer | null {
  try {
    if (fs.existsSync(DEFAULT_LOGO_PATH)) {
      return fs.readFileSync(DEFAULT_LOGO_PATH);
    }
  } catch {
    console.warn("Could not load default GAGE logo from filesystem");
  }
  return null;
}

interface PDFTemplateOptions {
  title: string;
  subtitle?: string;
  sections: Array<{
    heading: string;
    content?: string;
    items?: string[];
    type?: "text" | "checklist" | "numbered" | "table";
    tableData?: { headers: string[]; rows: string[][] };
  }>;
  logoBuffer?: Buffer | null;
  companyName?: string;
  footer?: string;
}

/**
 * Generate a branded PDF document with dynamic logo injection
 */
export async function generateBrandedPDF(options: PDFTemplateOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "LETTER",
      margins: { top: 60, bottom: 60, left: 60, right: 60 },
      info: {
        Title: options.title,
        Author: options.companyName || "GAGE Strategies",
      },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageWidth = doc.page.width - 120; // margins

    // === COVER PAGE ===
    // Header bar
    doc.rect(0, 0, doc.page.width, 120).fill(BRAND.primary);

    // Logo
    if (options.logoBuffer) {
      try {
        doc.image(options.logoBuffer, 60, 25, { height: 70 });
      } catch {
        // fallback to text if logo fails
        doc.fontSize(24).fillColor(BRAND.white).text(options.companyName || "GAGE Strategies", 60, 45);
      }
    } else {
      doc.fontSize(24).fillColor(BRAND.white).font("Helvetica-Bold")
        .text(options.companyName || "GAGE Strategies", 60, 45);
    }

    // Title
    doc.moveDown(4);
    doc.fontSize(28).fillColor(BRAND.primary).font("Helvetica-Bold")
      .text(options.title, 60, 180, { width: pageWidth });

    // Subtitle
    if (options.subtitle) {
      doc.moveDown(0.5);
      doc.fontSize(14).fillColor(BRAND.gray).font("Helvetica")
        .text(options.subtitle, { width: pageWidth });
    }

    // Accent line
    doc.moveDown(1);
    doc.rect(60, doc.y, 80, 4).fill(BRAND.accent);
    doc.moveDown(2);

    // Branding footer text on cover
    doc.fontSize(10).fillColor(BRAND.gray).font("Helvetica")
      .text(`Prepared by ${options.companyName || "GAGE Strategies"}`, 60, doc.page.height - 100, { width: pageWidth });
    doc.fontSize(9).fillColor(BRAND.gray)
      .text("From Chaos to Clarity — Positioning Your Business for What's Next", { width: pageWidth });

    // === CONTENT PAGES ===
    for (const section of options.sections) {
      doc.addPage();

      // Page header with thin accent bar
      doc.rect(0, 0, doc.page.width, 6).fill(BRAND.accent);

      // Section heading
      doc.fontSize(20).fillColor(BRAND.primary).font("Helvetica-Bold")
        .text(section.heading, 60, 40, { width: pageWidth });

      doc.moveDown(1);
      doc.rect(60, doc.y, 50, 3).fill(BRAND.lime);
      doc.moveDown(1);

      // Content based on type
      if (section.type === "checklist" && section.items) {
        for (const item of section.items) {
          doc.fontSize(11).fillColor(BRAND.primary).font("Helvetica")
            .text(`☐  ${item}`, 60, doc.y, { width: pageWidth });
          doc.moveDown(0.8);
        }
      } else if (section.type === "numbered" && section.items) {
        section.items.forEach((item, idx) => {
          doc.fontSize(11).fillColor(BRAND.accent).font("Helvetica-Bold")
            .text(`${idx + 1}.`, 60, doc.y, { continued: true });
          doc.fillColor(BRAND.primary).font("Helvetica")
            .text(`  ${item}`, { width: pageWidth - 20 });
          doc.moveDown(0.6);
        });
      } else if (section.type === "table" && section.tableData) {
        const { headers, rows } = section.tableData;
        const colWidth = pageWidth / headers.length;

        // Table header
        doc.rect(60, doc.y, pageWidth, 25).fill(BRAND.lightGreen);
        const headerY = doc.y + 7;
        headers.forEach((h, i) => {
          doc.fontSize(10).fillColor(BRAND.primary).font("Helvetica-Bold")
            .text(h, 60 + i * colWidth, headerY, { width: colWidth, align: "left" });
        });
        doc.y = headerY + 25;

        // Table rows
        for (const row of rows) {
          const rowY = doc.y + 5;
          row.forEach((cell, i) => {
            doc.fontSize(10).fillColor(BRAND.primary).font("Helvetica")
              .text(cell, 60 + i * colWidth, rowY, { width: colWidth, align: "left" });
          });
          doc.y = rowY + 20;
          doc.rect(60, doc.y, pageWidth, 0.5).fill("#E5E7EB");
        }
      } else {
        // Regular text content
        if (section.content) {
          doc.fontSize(11).fillColor(BRAND.primary).font("Helvetica")
            .text(section.content, 60, doc.y, { width: pageWidth, lineGap: 4 });
        }
        if (section.items) {
          doc.moveDown(0.5);
          for (const item of section.items) {
            doc.fontSize(11).fillColor(BRAND.primary).font("Helvetica")
              .text(`•  ${item}`, 70, doc.y, { width: pageWidth - 10 });
            doc.moveDown(0.5);
          }
        }
      }

      // Page footer
      doc.fontSize(8).fillColor(BRAND.gray).font("Helvetica")
        .text(
          options.footer || `© ${new Date().getFullYear()} ${options.companyName || "GAGE Strategies"} — All Rights Reserved`,
          60,
          doc.page.height - 40,
          { width: pageWidth, align: "center" }
        );
    }

    doc.end();
  });
}

/**
 * Generate and upload a branded PDF to S3
 */
export async function generateAndStorePDF(
  options: PDFTemplateOptions,
  storageKey: string
): Promise<{ key: string; url: string; size: number }> {
  const pdfBuffer = await generateBrandedPDF(options);
  const { key, url } = await storagePut(storageKey, pdfBuffer, "application/pdf");
  return { key, url, size: pdfBuffer.length };
}

/**
 * Re-brand an existing template with a new logo
 */
export async function rebrandTemplate(
  templateOptions: PDFTemplateOptions,
  logoBuffer: Buffer,
  companyName: string,
  storageKey: string
): Promise<{ key: string; url: string; size: number }> {
  const rebranded = {
    ...templateOptions,
    logoBuffer,
    companyName,
    footer: `© ${new Date().getFullYear()} ${companyName} — Powered by GAGE Strategies`,
  };
  return generateAndStorePDF(rebranded, storageKey);
}
