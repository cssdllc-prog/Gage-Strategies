# GAGE Strategies — Admin Guide: Adding Tools & Content

This guide walks you through the simple process of adding new products, uploading tool files, and managing content on your site.

---

## Quick Overview

Your admin panel is at: **www.gage-strategies.com/admin**

From there you can:
- Add/edit/delete products
- Upload HTML tools and other files
- Manage categories
- View leads, purchases, and activity

---

## Step 1: Add a New Product

1. Go to **www.gage-strategies.com/admin/products**
2. Click the green **"Add Product"** button (top right)
3. Fill in the form:

| Field | What to enter |
|-------|---------------|
| Name | The product name customers will see (e.g., "AI Email Writer") |
| Slug | Auto-generated from name — leave as-is or customize the URL path |
| Short Description | 1-2 sentence summary shown in product cards |
| Long Description | Detailed description shown on the product detail page |
| Category | Select from your existing categories |
| Icon | Pick an emoji that represents the product (e.g., "✉️") |
| Pricing Type | Choose: Free, One-Time, or Subscription |
| Base Price | For one-time products (e.g., 29.00) |
| Monthly Price | For subscription products (e.g., 9.00) |
| Features | JSON array of feature bullet points: `["Feature 1", "Feature 2"]` |
| Mark as Popular | Toggle on to highlight the product |

4. Click **"Create Product"**

---

## Step 2: Upload the Tool File

1. Go to **www.gage-strategies.com/admin/assets**
2. In the left panel, find and click the product you just created
3. Click **"Upload File"** button
4. Select your HTML tool file (or PDF, XLSX, ZIP, etc.)
5. The file uploads automatically and attaches to the product

**Supported file types:**
- `.html` / `.htm` — Interactive tools (calculators, trackers, generators)
- `.pdf` — Documents, guides, reports
- `.xlsx` / `.csv` — Spreadsheets, templates
- `.zip` — Bundled files
- `.docx` / `.pptx` — Word/PowerPoint documents

---

## Step 3: Verify It Works

1. Go to your site's Solutions page
2. Find the new product and click into it
3. If you're logged in as admin, you'll see the Download button
4. Click Download to test the file
5. For HTML tools: open the downloaded file in your browser and test all buttons

---

## How to Replace/Update an Existing Tool

1. Go to **www.gage-strategies.com/admin/assets**
2. Select the product in the left panel
3. Click the **replace icon** (↔) next to the existing file
4. Upload the new version

Or to manually replace:
1. Click the **trash icon** to delete the old file
2. Click **"Upload File"** to upload the new version

---

## How to Add a New Category

1. Go to **www.gage-strategies.com/admin/categories**
2. Click **"Add Category"**
3. Enter:
   - Name (e.g., "Marketing Tools")
   - Slug (e.g., "marketing-tools")
   - Description
   - Icon (emoji)
4. Save

---

## How to Edit an Existing Product

1. Go to **www.gage-strategies.com/admin/products**
2. Find the product (use the search bar)
3. Click the **pencil icon** to edit
4. Make changes and click **"Update Product"**

---

## Tips for Creating HTML Tools

If you want to create your own HTML tools to sell:

1. **Structure**: Each tool should be a single `.html` file with embedded CSS and JavaScript
2. **Self-contained**: Don't rely on external CDN links (they may not work offline)
3. **Branding tokens**: Include these placeholders in your HTML and they'll be auto-replaced with the customer's company info when downloaded:
   - `{{COMPANY_NAME}}` — Customer's company name
   - `{{COMPANY_EMAIL}}` — Customer's email
   - `{{COMPANY_PHONE}}` — Customer's phone
   - `{{COMPANY_ADDRESS}}` — Customer's address
   - `{{COMPANY_WEBSITE}}` — Customer's website
   - `{{COMPANY_LOGO}}` — Customer's logo URL
4. **localStorage**: Use `try/catch` around localStorage calls for iPad compatibility:
   ```javascript
   let _store = {};
   const _ls = {
     getItem: (k) => { try { return window.localStorage.getItem(k); } catch { return _store[k] || null; } },
     setItem: (k, v) => { try { window.localStorage.setItem(k, v); } catch { _store[k] = v; } },
     removeItem: (k) => { try { window.localStorage.removeItem(k); } catch { delete _store[k]; } }
   };
   ```
5. **Touch support**: Add this CSS for iPad/mobile compatibility:
   ```css
   button, [onclick], a, input, select, textarea { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
   ```
6. **Contact Support button**: Add a floating support button:
   ```html
   <a href="mailto:support@gage-strategies.com?subject=Support: [Tool Name]"
      style="position:fixed;bottom:20px;right:20px;background:#2C3E2D;color:white;padding:10px 16px;border-radius:8px;text-decoration:none;font-size:14px;z-index:9999;">
      Contact Support
   </a>
   ```

---

## Pricing Strategy

| Pricing Type | When to Use | Example |
|---|---|---|
| Free | Lead magnets, simple tools to attract visitors | Basic checklist, simple calculator |
| One-Time ($) | Complete tools that don't need updates | Dashboard template, project planner |
| Subscription ($/mo) | Tools with ongoing updates or AI features | AI content generator, live data dashboard |

---

## Troubleshooting

**Product not showing on site?**
- Make sure it has a category assigned
- Check that the slug is unique (no duplicates)

**Download not working?**
- Go to Admin → Assets and verify a file is attached
- Try re-uploading the file

**Tool buttons not working on iPad?**
- Make sure your HTML includes the localStorage shim and touch-action CSS (see Tips above)

**Need help?**
- Contact Manus support at https://help.manus.im for platform issues
- For tool development help, start a new Manus task
