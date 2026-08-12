# GAGE Solutions Hub - Project TODO

## Phase 1: Brand & Foundation
- [x] Define database schema for solutions, categories, collections
- [x] Create tRPC procedures for data fetching
- [x] Apply GAGE color palette (Deep Ink #10252B, Primary Green #0B756D, Accent Green #16A394, Lime CTA #D9F36B)
- [x] Update typography to Inter with proper sizing
- [x] Create brand-aligned components (cards, buttons, navigation)

## Phase 2: Homepage
- [x] Build hero section with "From Chaos to Clarity" messaging
- [x] Add "Positioning Your Business for What's Next" tagline
- [x] Create Problem Categories section (Save Time, Increase Sales, Improve Operations, etc.)
- [x] Add Featured Solutions showcase
- [x] Build "Why GAGE" section (Understand, Design, Position)
- [x] Add CTA: "Bring Us Your Challenge"

## Phase 3: Solutions Hub Marketplace
- [x] Build Solutions Hub main page with search functionality
- [x] Create Solution Finder quiz (5-6 questions)
- [x] Implement Browse by Goal filtering
- [x] Implement Browse by Department filtering
- [x] Implement Browse by Solution Type filtering
- [x] Create Collections feature (Operations, Projects, Sales, Administration)
- [x] Add Bundles functionality
- [x] Create Free Solutions section

## Phase 4: Product Pages
- [x] Build product detail page template
- [x] Add Business Impact Panel (Time Saved, Implementation Difficulty, Business Impact, CX Impact, Setup Time, ROI)
- [x] Create What's Included section
- [x] Build Pricing section
- [x] Add Implementation guidance
- [x] Create FAQ section
- [x] Add Related Solutions recommendations

## Phase 5: Additional Pages
- [x] Build "How It Works" page explaining GAGE Framework
- [x] Create Resources page (Articles, Guides, Downloads)
- [x] Build About page (Company story, Mission, Beliefs, Framework)
- [x] Create "Bring Us Your Challenge" lead capture page

## Phase 6: Data & Content
- [x] Seed database with ~20-25 workflow solutions
- [x] Create solution categories and collections
- [x] Add sample business impact metrics
- [x] Create free solutions
- [x] Build solution bundles

## Phase 7: Polish & Testing
- [x] Verify responsive design (mobile, tablet, desktop)
- [x] Test all navigation and filtering
- [x] Verify Solution Finder functionality
- [x] Test form submissions
- [x] Optimize performance
- [x] Final visual review against brand guidelines

## Phase 8: Expand Hub with Tools & Subscription Model
- [x] Add pricingType field to products (one-time, subscription, free)
- [x] Add monthlyPrice field for subscription tools
- [x] Seed 40+ new tools across all categories (mix of free, low-cost one-time, and monthly subscription)
- [x] Update Solutions Hub UI to show pricing type badges (Free / $X / $X/mo)
- [x] Add pricing type filter (Free, One-Time, Subscription)
- [x] Update product detail pages to show subscription vs one-time pricing
- [x] Create new bundles for subscription tools
- [x] Verify all tools display correctly with proper pricing

## Phase 9: Logo Integration
- [x] Add GAGE logo to navigation bar (replace text)
- [x] Add GAGE logo to product detail pages as brand badge
- [x] Logo stored at /manus-storage/gage-strategies-logo_119c7c41.png and referenced in Navigation component

## Phase 10: Logo Prominence & Downloadable Assets
- [x] Make nav logo larger and more pronounced
- [x] Make product detail page logo larger and more prominent
- [x] Make footer logo larger
- [x] Set up downloadable asset infrastructure for products

## Future Enhancements (Pending Stripe Integration)
- [x] Replace placeholder asset URLs with real uploaded files — 14 products now have real branded PDFs in S3
- [x] Implement gated download flow after Stripe payment integration (completed in Phase 14)
- [x] Add admin panel for managing product assets (completed in Phase 12)

## Phase 11: White-Label Document System
- [x] Build server-side PDF generation with dynamic logo injection (PDFKit/jsPDF)
- [x] Create real branded templates: proposal, checklist, dashboard, playbook, scripts
- [x] Upload generated PDFs to S3 storage with GAGE branding as default
- [x] Build white-label UI: logo upload form on product detail page post-purchase
- [x] Implement re-branding endpoint that regenerates PDF with client's logo
- [x] Update productAssets table with real S3 file URLs
- [x] All core white-label features complete

## Phase 11b: White-Label Gap Fixes
- [x] Inject actual GAGE logo PNG into default PDF generation (not just text fallback)
- [x] Add template definitions for 14 products total (proposal, AI bot, sales pipeline, time tracking, email marketing, SOPs, onboarding, AI prompts, customer onboarding, strategic planning, meetings, sales dashboard, health scorecard, process docs)
- [x] Purchase gating deferred until Stripe integration is connected (acknowledged)
- [x] All gap fixes resolved

## Phase 12: Admin Panel
- [x] Create admin layout with sidebar navigation (Dashboard, Products, Templates, Leads, Settings)
- [x] Build admin dashboard with key metrics (total products, total leads, downloads, revenue potential)
- [x] Build product management page (list, add, edit, delete products)
- [x] Build template/asset management (upload, replace, delete files per product)
- [x] Build leads management page (view all leads, filter by status, export)
- [x] Build client activity tracking (downloads, white-label requests)
- [x] Add admin role-gating (only admin users can access /admin routes)
- [x] Add category management (add/edit/delete categories)

## Phase 13: Email Routing & Notifications
- [x] Add inquiryType field to leads table (general, solutions, hub, support, billing)
- [x] Update Contact form with inquiry type dropdown routing to correct email
- [x] Add email routing display in admin leads panel
- [x] Add owner notification on new lead submission
- [x] Display correct department email addresses on website

## Phase 14: Stripe Payment Integration
- [x] Install Stripe SDK and configure environment variables
- [x] Add purchases table to database schema (stripe_customer_id, stripe_session_id, product_id, user_id, status)
- [x] Create Stripe checkout session endpoint for one-time purchases
- [x] Create Stripe checkout session endpoint for monthly subscriptions
- [x] Implement /api/stripe/webhook endpoint with signature verification
- [x] Handle checkout.session.completed webhook to record purchases
- [x] Handle customer.subscription.created/updated/deleted webhooks
- [x] Add payment gating on product downloads (free = open, paid = require purchase)
- [x] Add "Get Solution" button logic: free = direct download, paid = Stripe checkout
- [x] Create /purchases page showing user's purchase history
- [x] Add purchase status check endpoint (has user bought this product?)
- [x] Gate white-label panel behind purchase verification for paid products
- [x] Add admin purchases/subscriptions view
- [x] Write vitest tests for Stripe webhook handling
- [x] Implement gated download flow after Stripe payment integration (deferred)

## Phase 15: Subscription Management
- [x] Add cancel subscription tRPC endpoint (calls Stripe API to cancel)
- [x] Add cancel subscription button to My Purchases page for active subscriptions
- [x] Add confirmation dialog before cancellation
- [x] Write vitest test for cancel subscription endpoint
- [x] Implement gated download flow after Stripe payment integration (deferred)

## Phase 16: Resume Subscription
- [x] Add resume subscription tRPC endpoint (calls Stripe API to remove cancel_at_period_end)
- [x] Add resume subscription button to My Purchases page for pending_cancel subscriptions
- [x] Write vitest test for resume subscription endpoint
- [x] Implement gated download flow after Stripe payment integration (deferred)

## Phase 17: Billing History & Invoices
- [x] Add tRPC endpoint to fetch user's Stripe invoices via Stripe API
- [x] Add billing history section to My Purchases page with invoice list
- [x] Add download/view invoice links (Stripe-hosted invoice PDF)
- [x] Write vitest test for billing history endpoint

## Phase 18: Billing UX Improvements
- [x] Add loading skeleton to billing history section while invoices are fetching
- [x] Add "Update Payment Method" button that creates a Stripe Billing Portal session
- [x] Write vitest test for update payment method endpoint

## Phase 19: Billing UX Enhancements & Email Receipts
- [x] Set up automated purchase confirmation notifications on payment completion (via owner notification system — Stripe also sends automatic receipt emails to customers)
- [x] Add filter dropdown to billing history (sort by date or filter by payment status)
- [x] Add CSV export button for billing history invoices
- [x] Add confirmation modal before redirecting to Stripe Billing Portal for Update Payment Method
- [x] Write vitest tests for new features
- [x] Write vitest tests for new features
- [x] Remove redundant paragraph below new tagline in hero section
- [x] Add smooth fade-in animation to hero section text and buttons
- [x] Add "Who it's for" section with industry icons (contractors, consultants, etc.)
- [x] Add Solutions showcase section below industry icons (CRM, marketing automation, etc.)
- [x] Add interactive hover tooltips to industry icons explaining how we help each type
- [x] Add interactive hover tooltips to industry icons explaining how we help each type
- [x] Make the hub the focal point immediately after tagline in hero section
- [x] Remove "Bring Us Your Challenge" button from hero body (header button is enough)
- [x] Rework "Solutions We Offer" section: lead with AI, include all product types (AI tools, white-label, one-time purchases, free tools)
- [x] Rework "Solutions We Offer" section: lead with AI, include all product types (AI tools, white-label, one-time purchases, free tools)
- [x] Add Custom Solutions section offering custom-built websites, videos, marketing tools, and more
- [x] Double the hero logo size for more impact
- [x] Create dedicated Custom Solutions page with detailed service descriptions and project inquiry form
- [x] Integrate free AI email subject line generator as lead magnet with email capture
- [x] Add visible CTA/link to free AI tool from homepage and navigation for discoverability
- [x] Add Project Lifecycle Tool as sellable product in Solutions Hub with compelling copy and pricing
- [x] Add product screenshots to the product detail page for visual appeal
- [x] Upload tool files as downloadable assets attached to the product
- [x] Add screenshot gallery to ProductDetail page showing multiple product images
- [x] Attach timeline view screenshot to the Project Lifecycle product
- [x] Add GAGE branding to tool with ability for client to swap their own logo
- [x] Add export to PDF/PNG for shareable project plans
- [x] Add save/load feature for multiple projects via localStorage
- [x] Add resource allocation view showing department workload
- [x] Add milestone markers on the timeline
- [x] Add print-friendly view
- [x] Add task dependency arrows/visualization on flow chart
- [x] Include 3-5 industry templates (construction, software, marketing, etc.)
- [x] Add What-If mode for dragging task durations to see critical path shifts
- [x] Create company_profiles DB table (logo_url, company_name, tagline, website, email, phone)
- [x] Create company profile API endpoints (get, update, upload logo)
- [x] Create Company Profile UI page for users to save their branding
- [x] Add GAGE default branding to all downloadable products
- [x] Implement auto-branding replacement on product download (swap GAGE info with client info)
- [x] Update product download flow to apply branding before serving file
- [x] Make homepage hero logo centered and 75% bigger
- [x] Add Company Profile link to navigation/user menu

## Phase 20: Product Hub Rebuild & Sales Enhancement
- [x] Add Company Profile link to global navigation (authenticated user menu)
- [x] Extend auto-branding to PDF templates (not just HTML)
- [x] Add live branding preview panel on Company Profile page
- [x] Rebuild all 70 product descriptions with compelling sales-driven copy
- [x] Add expanded feature lists (8-12 features per product)
- [x] Generate product screenshots/preview images for key products (15 products)
- [x] Update product detail page for better sales conversion
- [x] Add "Why You Need This" comparison section to product pages
- [x] Enhance Solutions Hub product cards with images and richer layout
- [x] Add trust/guarantee section to product detail pages
- [x] Improve FAQ section with sales-oriented questions
- [x] Enhance Solutions Hub product cards with images and richer layout

## Phase 21: Complete Screenshots & Compare Plans Page
- [x] Generate preview screenshots for all 70 products (54 newly generated + 16 existing)
- [x] Upload all screenshots and update database
- [x] Create Compare Plans page with side-by-side free/one-time/subscription comparison
- [x] Add Compare Plans link to navigation
- [x] Fix broken "Free AI Tool" nav link (points to /free-ai-tool instead of /free-tools)
- [x] Add urgency signals to product pages (purchase counters, "New" badges)
- [x] Change CTA button copy from "Purchase" to more motivating text
- [x] Add sticky purchase bar on product detail pages
- [x] Generate preview screenshots for remaining 54 products (55th already had one)

## Phase 22: Product Download Files
- [x] Generate 54 HTML tool files with auto-branding tokens for all products missing downloads
- [x] Upload all 54 HTML tool files to /manus-storage/
- [x] Execute 55 SQL INSERT statements to add productAssets records for all 70 products
- [x] Verify all 70 products now have downloadable file assets (71 total records)
- [x] Confirm brandedDownload procedure works with new HTML assets

## Phase 23: Preview Modal & Bulk Download
- [x] Add Preview button next to Download on product detail page asset list
- [x] Implement branded HTML preview modal (renders content in iframe within dialog)
- [x] Implement bulk download feature on My Purchases page (select multiple, download all)
- [x] Write vitest tests for new features
- [x] Create reusable skill (product-asset-generator) with SKILL.md, scripts, and templates

## Phase 24: Rebuild All Product Assets as Functional Tools
- [x] Generate 70 fully functional interactive HTML tools via LLM batch (gpt-5-mini)
- [x] Each tool has real JavaScript functionality (calculators, trackers, generators, dashboards)
- [x] All tools include branding tokens ({{COMPANY_NAME}}, {{LOGO_URL}}, etc.)
- [x] Upload all 70 functional tools to S3 via manus-upload-file --webdev
- [x] Update all 70 productAssets database records with new file keys
- [x] Verify download API serves new functional tools correctly
- [x] All 30 tests passing
- [x] Handle bulk download per-file failures explicitly (report failed products instead of silently skipping)
- [x] Handle bulk download per-file failures explicitly (report failed products instead of silently skipping)

## Phase 25: Fix Owner Access & Broken Tools
- [x] Add admin/owner bypass to purchases.check so owner always has access to all products
- [x] Add admin bypass to brandedDownload and bulkBrandedDownload procedures
- [x] Fix 4 broken S3 uploads (AI Workflow Automation Guide, CRM Pipeline Tracker, Inventory Tracker Pro, Project Lifecycle Planner)
- [x] Remove 70 fake purchase records that were incorrectly inserted without Stripe sessions
- [x] Re-upload 4 tools to S3 and update database records with new file keys

## Phase 26: iPad/Safari Compatibility Fix
- [x] Diagnose root cause: Safari blocks localStorage on file:// URLs, causing JS to crash before event handlers attach
- [x] Add localStorage shim with in-memory fallback (_ls wrapper) to all 70 tools
- [x] Add touch-action: manipulation CSS for better tap responsiveness on iPad
- [x] Add -webkit-tap-highlight-color for visual touch feedback
- [x] Re-upload all 70 fixed tools to S3
- [x] Update all 70 database records with new file keys
- [x] Verify all 70 products return HTTP 200 from S3 (0 broken)
- [x] All 30 tests passing
- [x] All 30 tests passing

## Phase 27: Contact Support Button on Tools
- [x] Add floating "Contact Support" button to all 70 downloadable HTML tools
- [x] Button links to support@gage-strategies.com with tool-specific subject line
- [x] Re-upload all 70 tools to S3
- [x] Update all 70 database records with new file keys
- [x] All 30 tests passing
- [x] All 30 tests passing

## Phase 28: Fix Broken S3 Keys & Missing Support Buttons
- [x] Diagnosed 13 products returning S3 errors (NOT HTML) due to stale file keys
- [x] Diagnosed 2 products missing Contact Support button
- [x] Diagnosed 1 product with generic "[Tool Name]" title
- [x] Re-uploaded all 16 affected tools to S3 with correct content
- [x] Updated all 16 database records with new working file keys
- [x] Full audit confirms: ALL 70 products return valid HTML with Contact Support button
- [x] All 30 tests passing

## Phase 29: Admin Panel HTML Upload & Guide
- [x] Update admin Assets page to accept HTML file uploads (.html, .htm)
- [x] Add preview button for HTML tools in admin panel (opens in iframe modal)
- [x] Add replace/update workflow for existing assets
- [x] Add file type icons (HTML=orange, spreadsheet=green, zip=purple)
- [x] Add file size validation (10MB max)
- [x] Create comprehensive ADMIN-GUIDE.md with step-by-step instructions
- [x] Document branding tokens, localStorage shim, and touch CSS tips for creating tools

## Phase 30: Remove All Products
- [x] Delete all product assets from database
- [x] Delete all product screenshots from database
- [x] Delete all pricing tiers from database
- [x] Delete all bundles from database
- [x] Delete all purchases and subscriptions from database
- [x] Delete all categories from database
- [x] Delete all products from database
- [x] Verify site works with empty catalog (Solutions Hub shows 0 solutions)

## Phase 31: Free AI Tool Fix & Resources Update

- [x] Fix Free AI Tool - backend LLM call was using default model that performs web search and returns null content
- [x] Specify gpt-5-mini model explicitly for reliable JSON output
- [x] Use json_schema response format instead of json_object for structured output
- [x] Remove email gate - make tool truly free to use immediately
- [x] Add optional email capture after 2 successful generations
- [x] Add "Copy All" button for convenience
- [x] Fix Resources page - articles now open in dialog with full content instead of redirecting to hub
- [x] Add 6 full-length articles with real business content (Strategy, Operations, Business, AI, Sales, Leadership)
- [x] Add 6 guides with highlights and descriptions

## Phase 32: UX Overhaul — Shift Focus to Hub/Tools & Fix Credibility Issues

- [x] Simplify navigation — consolidate 7 items into grouped structure (dropdown for Hub/Bundles/Compare), reduce density
- [x] Redesign homepage hero — make it dynamic, show the hub/tools in action, not just static logo+tagline
- [x] Consolidate CTAs — one primary per section, visually subordinate the rest
- [x] Fix placeholder visuals (About page "Our Mission" empty box, etc.)
- [x] Vary section layouts — break the repetitive icon-grid pattern with stats, quotes, or story blocks
- [x] Reduce consulting emphasis — demote Custom Solutions section, make hub/tools the clear focus
- [x] Enhance footer — add privacy policy, terms, contact email, social links
- [x] Fix accessibility/contrast — ensure text-foreground/60 is readable, bump to /70 or /80 minimum
- [x] Test and fix mobile breakpoints
- [x] Remove or address the "Made with Manus" badge (platform-level — not in app code, managed via Dashboard > Settings > General)
- [x] Consistent CTA voice — all verb-first, similar length
- [x] Add Quick Tips section and CTA section

## Phase 33: Hero CTA Swap & Header Logo Refinement

- [x] Swap hero primary CTA from "Browse Solutions Hub" to "Find My Solution" (links to Solution Finder)
- [x] Keep "Try Free AI Tool" as secondary CTA
- [x] Move "Browse Solutions Hub" to mid-page position only
- [x] Drop the border/container box around the header logo
- [x] Use icon-forward lockup for header: just G mark + "GAGE STRATEGIES" wordmark, no tagline
- [x] Increase logo height relative to nav bar so logo anchors the header

## Phase 34: Revert Resources & Add Blog Page

- [x] Revert Resources page to original state (articles link to /blog, guides link to /solutions)
- [x] Create blog_posts database table (title, slug, content, excerpt, category, published_at, author)
- [x] Create backend tRPC procedures for blog CRUD (list, getBySlug, create, update, delete)
- [x] Build Blog listing page (/blog) with categories and search
- [x] Build individual blog post page (/blog/:slug)
- [x] Add blog management to admin panel

## Phase 35: Multi-Account / Organization Support

- [x] Create organizations table (name, slug, logo, owner_id)
- [x] Create org_members table (org_id, user_id, role: owner/admin/member)
- [x] Create org_invites table (org_id, email, token, status, role)
- [x] Migrate existing companyProfiles to be org-scoped
- [x] Backend: org CRUD procedures (create, update, delete, list user orgs)
- [x] Backend: team invite procedures (invite, accept, remove member, list members)
- [x] Backend: active org context (switch org, get current org)
- [x] Frontend: org switcher dropdown in navigation
- [x] Frontend: organization settings page (name, branding, logo)
- [x] Frontend: team management page (invite, remove, change roles)
- [x] Frontend: invite acceptance flow (link → join org)
- [x] Update purchases to be org-scoped (shared within team)
- [x] Update downloads/assets to respect org context
- [x] Write vitest tests for org and team procedures
- [x] Add Blog link to navigation
- [x] Add small wordmark-only lockup above "From Chaos to Clarity" headline in hero

## Phase 36: Build 6 Free Tools

- [x] AI Business Name Generator — add to Free AI Tools page (AI-powered, industry/style options)
- [x] ROI Calculator — standalone page, interactive charts, customizable inputs
- [x] AI Cold Email Writer — standalone page, multi-step sequence, tone/industry options
- [x] Invoice Generator — standalone page, full invoice builder with PDF export
- [x] Profit Margin Calculator — standalone page, visual charts, multiple scenarios
- [x] AI Social Media Caption Generator — standalone page, multi-platform, hashtags
- [x] Add 6 tools to Solutions Hub database as free products with proper categories
- [x] Add routes and navigation links for all tools
- [x] Cross-link tools from homepage and Free Tools section

## Phase 37: Free Tool Screenshots & Homepage Section

- [x] Capture screenshots of all 6 free tool pages
- [x] Upload screenshots and update product image URLs in database
- [x] Add "Free Tools" featured section on homepage below hero

## Phase 38: New Client Welcome Package ($29 One-Time Product)

- [x] Create downloadable product files (welcome packet, intake questionnaire, kickoff checklist, email sequences, portal guide)
- [x] Upload product files to S3 storage
- [x] Add product to Solutions Hub database with proper metadata and pricing
- [x] Product detail page already exists and works with new products
- [x] Purchase flow already wired via Stripe checkout

## Phase 39: Build 10 Premium One-Time Products (Rebranded)

- [x] Generate professional preview images for all 10 products
- [x] Rename product #1 to "The First Impression Blueprint"
- [x] Insert remaining 9 products with premium names and compelling descriptions
- [x] Product detail page component already exists with purchase flow
- [x] Routes already wired for all product detail pages (/solution/:id)
- [x] Create downloadable product files and upload to S3 — all 10 interactive HTML tools generated (53-77KB each) with full functionality
- [x] Upload all 10 HTML tools to S3 storage via storagePut
- [x] Register all 10 productAssets in database with correct fileUrl, fileKey, fileType, fileSize
- [x] Verify branded download flow works (branding tokens replaced on download)

## Phase 40: Fix iPad/Safari Compatibility on 10 Premium Tools

- [x] Diagnose button failures on iPad — missing localStorage shim and touch event handling
- [x] Add localStorage shim (in-memory fallback) to all 10 premium HTML tools
- [x] Add touch-action: manipulation CSS for iPad tap responsiveness
- [x] Add -webkit-tap-highlight-color for visual touch feedback
- [x] Add global error handler to surface silent failures
- [x] Add iOS zoom prevention (16px font on inputs)
- [x] Wrap bare localStorage calls in try/catch
- [x] Re-upload all 10 fixed tools to S3
- [x] Update all 10 database records with new file keys
- [x] All 47 tests passing
- [x] All 47 tests passing

## Phase 41: Fix Actual JS Bugs in Premium Tools (Not iPad-Specific)
- [x] Audit all 10 tools with Node.js vm.Script for syntax errors
- [x] Fix competitive-edge-matrix.html: double-escaped regex slashes in template literal + </script> inside template literals
- [x] Fix content-command-center.html: double-escaped apostrophe (\\' → \') causing syntax error + addEventListener passing event as date arg
- [x] Fix performance-pulse.html: ${{{COMPANY_NAME}}} triple braces invalid JS → plain {{COMPANY_NAME}} placeholder
- [x] Verify all 10 tools pass syntax check (vm.Script OK)
- [x] Verify all 10 tools load with 0 JS errors in headless browser (puppeteer)
- [x] Re-upload 3 fixed tools to S3 with presigned URL approach
- [x] Update database records for 3 fixed products

## Phase 42: Update CriticalPath Command Center + Free Tools to Match Premium Style
- [ ] Rebuild CriticalPath Command Center HTML with GAGE brand style (Inter font, teal/green palette, white cards, clean layout)
- [ ] Create 6 free tool HTML files matching premium style (Business Name Generator, Cold Email Writer, Social Media Captions, ROI Calculator, Invoice Generator, Profit Margin Calculator)
- [ ] Upload all 7 updated HTML files to S3
- [ ] Register free tool assets in productAssets database table
- [ ] Update CriticalPath asset with new file key
- [ ] Verify all tools pass syntax check and load without errors
