import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { getCategories, getProducts, getProductBySlug, getProductById, getPricingTiers, createLead, getBundles, getBundleBySlug, getProductAssets, getAdminMetrics, getAllLeads, getActivityLogs, logActivity, updateProduct, createProduct, deleteProduct, deleteProductAsset, addProductAsset, createCategory, updateCategory, deleteCategory, deleteLead, hasUserPurchased, getUserPurchases, getAllPurchases, getProductScreenshots, getCompanyProfile, upsertCompanyProfile } from "./db";
import { getPublishedBlogPosts, getPublishedBlogPostBySlug, getAllBlogPosts, getBlogPostById, createBlogPost, updateBlogPost, deleteBlogPost } from "./db";
import { z } from "zod";
import { generateAndStorePDF, rebrandTemplate } from "./pdfGenerator";
import { TEMPLATE_DEFINITIONS } from "./templateDefinitions";
import { createOneTimeCheckout, createSubscriptionCheckout } from "./stripe";
import { invokeLLM } from "./_core/llm";

// Helper to generate URL-safe slugs
function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + crypto.randomBytes(3).toString('hex');
}

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,

  // ==================== ADMIN ROUTES ====================
  admin: router({
    metrics: adminProcedure.query(async () => {
      return await getAdminMetrics();
    }),

    leads: router({
      list: adminProcedure
        .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }).optional())
        .query(async ({ input }) => {
          return await getAllLeads(input?.limit ?? 50, input?.offset ?? 0);
        }),
      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await deleteLead(input.id);
          return { success: true };
        }),
    }),

    activity: router({
      list: adminProcedure
        .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }).optional())
        .query(async ({ input }) => {
          return await getActivityLogs(input?.limit ?? 50, input?.offset ?? 0);
        }),
    }),

    purchases: router({
      list: adminProcedure
        .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }).optional())
        .query(async ({ input }) => {
          return await getAllPurchases(input?.limit ?? 50, input?.offset ?? 0);
        }),
    }),

    products: router({
      list: adminProcedure.query(async () => {
        return await getProducts();
      }),
      create: adminProcedure
        .input(z.object({
          name: z.string().min(1),
          slug: z.string().min(1),
          description: z.string().min(1),
          longDescription: z.string().optional(),
          categoryId: z.number(),
          pricing: z.string().optional(),
          basePrice: z.string().optional(),
          monthlyPrice: z.string().optional(),
          isPopular: z.boolean().optional(),
          features: z.string().optional(),
          icon: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
          await createProduct(input);
          return { success: true };
        }),
      update: adminProcedure
        .input(z.object({
          id: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
          longDescription: z.string().optional(),
          categoryId: z.number().optional(),
          pricing: z.string().optional(),
          basePrice: z.string().optional(),
          monthlyPrice: z.string().optional(),
          isPopular: z.boolean().optional(),
          features: z.string().optional(),
          icon: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
          const { id, ...data } = input;
          await updateProduct(id, data);
          return { success: true };
        }),
      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await deleteProduct(input.id);
          return { success: true };
        }),
    }),

    categories: router({
      list: adminProcedure.query(async () => {
        return await getCategories();
      }),
      create: adminProcedure
        .input(z.object({
          name: z.string().min(1),
          slug: z.string().min(1),
          description: z.string().optional(),
          icon: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
          await createCategory(input);
          return { success: true };
        }),
      update: adminProcedure
        .input(z.object({
          id: z.number(),
          name: z.string().optional(),
          slug: z.string().optional(),
          description: z.string().optional(),
          icon: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
          const { id, ...data } = input;
          await updateCategory(id, data);
          return { success: true };
        }),
      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await deleteCategory(input.id);
          return { success: true };
        }),
    }),

    assets: router({
      list: adminProcedure
        .input(z.object({ productId: z.number() }))
        .query(async ({ input }) => {
          return await getProductAssets(input.productId);
        }),
      create: adminProcedure
        .input(z.object({
          productId: z.number(),
          fileName: z.string().min(1),
          fileType: z.string().optional(),
          fileSize: z.number().optional(),
          description: z.string().optional(),
          fileBase64: z.string(),
        }))
        .mutation(async ({ input }) => {
          const { storagePut } = await import("./storage");
          const buffer = Buffer.from(input.fileBase64, "base64");
          const ext = input.fileName.split(".").pop() || "pdf";
          const storageKey = `assets/${input.productId}/${Date.now()}-${input.fileName}`;
          const { url } = await storagePut(storageKey, buffer, `application/${ext}`);
          await addProductAsset({
            productId: input.productId,
            name: input.fileName,
            description: input.description,
            fileUrl: url,
            fileKey: storageKey,
            fileType: input.fileType || ext,
            fileSize: buffer.length,
          });
          return { success: true, url };
        }),
      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await deleteProductAsset(input.id);
          return { success: true };
        }),
    }),

    blog: router({
      list: adminProcedure
        .input(z.object({ limit: z.number().default(100), offset: z.number().default(0) }).optional())
        .query(async ({ input }) => {
          return await getAllBlogPosts(input?.limit ?? 100, input?.offset ?? 0);
        }),
      get: adminProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          return await getBlogPostById(input.id);
        }),
      create: adminProcedure
        .input(z.object({
          title: z.string().min(1),
          slug: z.string().min(1),
          excerpt: z.string().optional(),
          content: z.string().min(1),
          contentType: z.enum(["original", "curated", "commentary"]).default("original"),
          sourceUrl: z.string().optional(),
          sourceAuthor: z.string().optional(),
          sourcePublication: z.string().optional(),
          category: z.string().optional(),
          tags: z.string().optional(),
          coverImage: z.string().optional(),
          authorName: z.string().optional(),
          status: z.enum(["draft", "published"]).default("draft"),
          publishedAt: z.date().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
          const data = {
            ...input,
            authorId: ctx.user.id,
            publishedAt: input.status === "published" ? (input.publishedAt || new Date()) : input.publishedAt,
          };
          await createBlogPost(data);
          return { success: true };
        }),
      update: adminProcedure
        .input(z.object({
          id: z.number(),
          title: z.string().optional(),
          slug: z.string().optional(),
          excerpt: z.string().optional(),
          content: z.string().optional(),
          contentType: z.enum(["original", "curated", "commentary"]).optional(),
          sourceUrl: z.string().nullable().optional(),
          sourceAuthor: z.string().nullable().optional(),
          sourcePublication: z.string().nullable().optional(),
          category: z.string().nullable().optional(),
          tags: z.string().nullable().optional(),
          coverImage: z.string().nullable().optional(),
          authorName: z.string().nullable().optional(),
          status: z.enum(["draft", "published"]).optional(),
          publishedAt: z.date().nullable().optional(),
        }))
        .mutation(async ({ input }) => {
          const { id, ...data } = input;
          if (data.status === "published" && !data.publishedAt) {
            const existing = await getBlogPostById(id);
            if (!existing?.publishedAt) {
              data.publishedAt = new Date();
            }
          }
          await updateBlogPost(id, data);
          return { success: true };
        }),
      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await deleteBlogPost(input.id);
          return { success: true };
        }),
    }),
  }),

  // ==================== PUBLIC ROUTES ====================
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    // Actual sign-out happens client-side via Clerk's signOut(), which clears
    // Clerk's own session cookie. This endpoint is kept only so the frontend
    // doesn't need a separate code path — it's a no-op on the server.
    logout: publicProcedure.mutation(() => {
      return {
        success: true,
      } as const;
    }),
  }),

  blog: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }).optional())
      .query(async ({ input }) => {
        return await getPublishedBlogPosts(input?.limit ?? 20, input?.offset ?? 0);
      }),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await getPublishedBlogPostBySlug(input.slug);
      }),
  }),

  products: router({
    listCategories: publicProcedure.query(async () => {
      return await getCategories();
    }),
    
    list: publicProcedure
      .input(z.object({ categoryId: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return await getProducts(input?.categoryId);
      }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await getProductBySlug(input.slug);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getProductById(input.id);
      }),

    getScreenshots: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input }) => {
        return await getProductScreenshots(input.productId);
      }),
  }),

  pricing: router({
    list: publicProcedure.query(async () => {
      return await getPricingTiers();
    }),
  }),

  leads: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        company: z.string().optional(),
        message: z.string().optional(),
        inquiryType: z.enum(["general", "solutions", "hub", "support", "billing"]).default("general"),
      }))
      .mutation(async ({ input }) => {
        await createLead({
          name: input.name,
          email: input.email,
          company: input.company,
          message: input.message,
          inquiryType: input.inquiryType,
        });
        // Send owner notification
        const { notifyOwner } = await import("./_core/notification");
        const emailMap: Record<string, string> = {
          general: "hello@gage-strategies.com",
          solutions: "solutions@gage-strategies.com",
          hub: "hub@gage-strategies.com",
          support: "support@gage-strategies.com",
          billing: "billing@gage-strategies.com",
        };
        const targetEmail = emailMap[input.inquiryType] || "hello@gage-strategies.com";
        await notifyOwner({
          title: `New ${input.inquiryType} inquiry from ${input.name}`,
          content: `Name: ${input.name}\nEmail: ${input.email}\nCompany: ${input.company || "N/A"}\nType: ${input.inquiryType}\nRoutes to: ${targetEmail}\n\nMessage:\n${input.message || "No message provided"}`,
        });
        return { success: true };
      }),
  }),

  bundles: router({
    list: publicProcedure.query(async () => {
      return await getBundles();
    }),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await getBundleBySlug(input.slug);
      }),
  }),

  // ==================== STRIPE / PURCHASES ====================
  purchases: router({
    /** Check if current user has purchased a specific product */
    check: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input, ctx }) => {
        // Owner/admin always has access to all products
        if (ctx.user.role === 'admin') {
          return { purchased: true };
        }
        const purchased = await hasUserPurchased(ctx.user.id, input.productId);
        return { purchased };
      }),

    /** Get current user's purchase history */
    myPurchases: protectedProcedure.query(async ({ ctx }) => {
      const purchases = await getUserPurchases(ctx.user.id);
      // Enrich with product names
      const enriched = await Promise.all(
        purchases.map(async (p: any) => {
          const product = await getProductById(p.productId);
          return { ...p, productName: product?.name || `Product #${p.productId}` };
        })
      );
      return enriched;
    }),

    /** Create a Stripe checkout session */
    createCheckout: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const product = await getProductById(input.productId);
        if (!product) throw new Error("Product not found");

        if (product.pricing === "free") {
          throw new Error("This product is free and does not require purchase");
        }

        const origin = ctx.req.headers.origin || "https://gagesaas-6h3amb7j.manus.space";

        if (product.pricing === "subscription" && product.monthlyPrice) {
          const priceInCents = Math.round(parseFloat(product.monthlyPrice) * 100);
          const session = await createSubscriptionCheckout({
            productId: product.id,
            productName: product.name,
            monthlyPriceInCents: priceInCents,
            userId: ctx.user.id,
            userEmail: ctx.user.email || "",
            userName: ctx.user.name || undefined,
            origin,
          });
          return { checkoutUrl: session.url, sessionId: session.id };
        } else {
          const priceInCents = Math.round(parseFloat(product.basePrice || "0") * 100);
          const session = await createOneTimeCheckout({
            productId: product.id,
            productName: product.name,
            priceInCents,
            userId: ctx.user.id,
            userEmail: ctx.user.email || "",
            userName: ctx.user.name || undefined,
            origin,
          });
          return { checkoutUrl: session.url, sessionId: session.id };
        }
      }),

    /** Cancel an active subscription */
    cancelSubscription: protectedProcedure
      .input(z.object({ purchaseId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const purchases = await getUserPurchases(ctx.user.id);
        const purchase = purchases.find((p: any) => p.id === input.purchaseId);

        if (!purchase) {
          throw new Error("Purchase not found");
        }
        if (purchase.userId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }
        if (purchase.type !== "subscription") {
          throw new Error("This purchase is not a subscription");
        }
        if (purchase.status !== "active" && purchase.status !== "pending_cancel") {
          throw new Error("This subscription is not active");
        }
        if (purchase.status === "pending_cancel") {
          throw new Error("This subscription is already scheduled for cancellation");
        }
        if (!purchase.stripeSubscriptionId) {
          throw new Error("No Stripe subscription ID found for this purchase");
        }

        // Cancel the subscription in Stripe (at period end so user keeps access until billing cycle ends)
        await stripe.subscriptions.update(purchase.stripeSubscriptionId, {
          cancel_at_period_end: true,
        });

        // Mark as pending_cancel - user keeps access until period ends
        // The actual cancellation (status → cancelled) happens via webhook when subscription.deleted fires
        const { updatePurchaseBySubscriptionId } = await import("./db");
        await updatePurchaseBySubscriptionId(purchase.stripeSubscriptionId, { status: "pending_cancel" });

        return { success: true, message: "Subscription will be cancelled at the end of the current billing period." };
      }),

    /** Resume a subscription that was scheduled for cancellation */
    resumeSubscription: protectedProcedure
      .input(z.object({ purchaseId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const purchases = await getUserPurchases(ctx.user.id);
        const purchase = purchases.find((p: any) => p.id === input.purchaseId);

        if (!purchase) {
          throw new Error("Purchase not found");
        }
        if (purchase.userId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }
        if (purchase.type !== "subscription") {
          throw new Error("This purchase is not a subscription");
        }
        if (purchase.status !== "pending_cancel") {
          throw new Error("This subscription is not pending cancellation");
        }
        if (!purchase.stripeSubscriptionId) {
          throw new Error("No Stripe subscription ID found for this purchase");
        }

        // Remove the cancel_at_period_end flag in Stripe to resume the subscription
        await stripe.subscriptions.update(purchase.stripeSubscriptionId, {
          cancel_at_period_end: false,
        });

        // Restore to active status
        const { updatePurchaseBySubscriptionId } = await import("./db");
        await updatePurchaseBySubscriptionId(purchase.stripeSubscriptionId, { status: "active" });

        return { success: true, message: "Subscription has been resumed. You will continue to be billed at the next billing cycle." };
      }),

    /** Get billing history (invoices) for the current user */
    billingHistory: protectedProcedure.query(async ({ ctx }) => {
      const purchases = await getUserPurchases(ctx.user.id);
      
      // Collect all unique Stripe customer IDs from user's purchases
      const customerIds = Array.from(new Set(
        purchases
          .map((p: any) => p.stripeCustomerId)
          .filter(Boolean)
      )) as string[];

      if (customerIds.length === 0) {
        return [];
      }

      // Fetch invoices from Stripe for each customer ID
      const allInvoices: Array<{
        id: string;
        number: string | null;
        status: string | null;
        amountDue: number;
        amountPaid: number;
        currency: string;
        created: number;
        hostedInvoiceUrl: string | null;
        invoicePdf: string | null;
        description: string | null;
        productName: string | null;
      }> = [];

      for (const customerId of customerIds) {
        try {
          const invoices = await stripe.invoices.list({
            customer: customerId,
            limit: 50,
          });

          for (const invoice of invoices.data) {
            // Get product name from line items
            const lineItem = invoice.lines?.data?.[0];
            const productName = lineItem?.description || null;

            allInvoices.push({
              id: invoice.id,
              number: invoice.number,
              status: invoice.status,
              amountDue: invoice.amount_due,
              amountPaid: invoice.amount_paid,
              currency: invoice.currency,
              created: invoice.created,
              hostedInvoiceUrl: invoice.hosted_invoice_url || null,
              invoicePdf: invoice.invoice_pdf || null,
              description: invoice.description,
              productName,
            });
          }
        } catch (err) {
          console.error(`[Billing] Failed to fetch invoices for customer ${customerId}:`, err);
        }
      }

      // Sort by date descending
      allInvoices.sort((a, b) => b.created - a.created);

      return allInvoices;
    }),

    /** Create a Stripe Billing Portal session for updating payment method */
    createBillingPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
      const purchases = await getUserPurchases(ctx.user.id);

      // Find the first purchase with a Stripe customer ID
      const purchaseWithCustomer = purchases.find((p: any) => p.stripeCustomerId);

      if (!purchaseWithCustomer || !purchaseWithCustomer.stripeCustomerId) {
        throw new Error("No Stripe customer found. You need to make a purchase first.");
      }

      const origin = ctx.req.headers.origin || "https://gagesaas-6h3amb7j.manus.space";

      const session = await stripe.billingPortal.sessions.create({
        customer: purchaseWithCustomer.stripeCustomerId,
        return_url: `${origin}/my-purchases`,
      });

      return { url: session.url };
    }),
  }),

  assets: router({
    getByProductId: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input }) => {
        return await getProductAssets(input.productId);
      }),
    logDownload: publicProcedure
      .input(z.object({
        productId: z.number(),
        productName: z.string(),
        fileName: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await logActivity({
          userId: ctx.user?.id,
          userEmail: ctx.user?.email || "anonymous",
          action: "download",
          productId: input.productId,
          productName: input.productName,
          metadata: input.fileName || undefined,
        });
        return { success: true };
      }),

    /** Download a product asset with auto-branding replacement */
    brandedDownload: protectedProcedure
      .input(z.object({
        productId: z.number(),
        assetId: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        // 1. Verify purchase (admin bypasses)
        const isAdmin = ctx.user.role === 'admin';
        const purchased = isAdmin || await hasUserPurchased(ctx.user.id, input.productId);
        const productData = await getProductById(input.productId);
        const isFree = productData?.pricing === "free";
        if (!purchased && !isFree) {
          throw new Error("You must purchase this product to download.");
        }

        // 2. Get the asset
        const allAssets = await getProductAssets(input.productId);
        const asset = allAssets.find((a: any) => a.id === input.assetId);
        if (!asset) throw new Error("Asset not found.");

        // 3. Get user's company profile
        const profile = await getCompanyProfile(ctx.user.id);

        // 4. Determine if this is an HTML file that supports branding
        const isHtml = asset.fileType === "html" || asset.fileUrl.endsWith(".html");
        const isPdf = asset.fileType === "pdf" || asset.fileUrl.endsWith(".pdf");

        if (!isHtml && !isPdf) {
          // For non-brandable files (ZIP, etc.), return the direct URL
          return { type: "redirect" as const, url: asset.fileUrl, fileName: asset.name };
        }

        // 4b. Handle PDF auto-branding via existing rebrandTemplate system
        if (isPdf && profile?.companyName && profile?.logoUrl) {
          const template = TEMPLATE_DEFINITIONS.find(t => t.productId === input.productId);
          if (template) {
            try {
              // Fetch the logo as a buffer
              const logoResponse = await fetch(profile.logoUrl);
              if (logoResponse.ok) {
                const logoBuffer = Buffer.from(await logoResponse.arrayBuffer());
                const storageKey = `whitelabel/${ctx.user.id}/${template.storageKey}`;
                const result = await rebrandTemplate(
                  { title: template.title, subtitle: template.subtitle, sections: template.sections },
                  logoBuffer,
                  profile.companyName,
                  storageKey
                );
                await logActivity({
                  userId: ctx.user.id,
                  userEmail: ctx.user.email || "unknown",
                  action: "download",
                  productId: input.productId,
                  productName: productData?.name || "",
                  metadata: `Auto-branded PDF download: ${asset.name}`,
                });
                return { type: "redirect" as const, url: result.url, fileName: `${profile.companyName} - ${asset.name}` };
              }
            } catch (e) {
              // Fall through to direct URL if branding fails
            }
          }
          // No template definition — return direct URL
          return { type: "redirect" as const, url: asset.fileUrl, fileName: asset.name };
        }

        if (!isHtml) {
          // PDF without company profile — return direct URL
          return { type: "redirect" as const, url: asset.fileUrl, fileName: asset.name };
        }

        // 5. Fetch the HTML content from storage
        const { storageGetSignedUrl } = await import("./storage");
        const fileKey = asset.fileKey || asset.fileUrl.replace("/manus-storage/", "");
        const signedUrl = await storageGetSignedUrl(fileKey);
        const response = await fetch(signedUrl);
        if (!response.ok) throw new Error("Failed to fetch asset file.");
        let html = await response.text();

        // 6. Replace branding tokens with user's company info (or keep GAGE defaults)
        const brandName = profile?.companyName || "GAGE Strategies";
        const brandTagline = profile?.tagline || "Positioning Your Business for What's Next";
        const brandEmail = profile?.email || "hello@gage-strategies.com";
        const brandWebsite = profile?.website || "gage-strategies.com";
        const brandPhone = profile?.phone || "";
        const brandLogo = profile?.logoUrl || "";

        html = html.replace(/\{\{COMPANY_NAME\}\}/g, brandName);
        html = html.replace(/\{\{TAGLINE\}\}/g, brandTagline);
        html = html.replace(/\{\{EMAIL\}\}/g, brandEmail);
        html = html.replace(/\{\{WEBSITE\}\}/g, brandWebsite);
        html = html.replace(/\{\{PHONE\}\}/g, brandPhone);
        html = html.replace(/\{\{LOGO_URL\}\}/g, brandLogo);

        // 7. Log the download
        await logActivity({
          userId: ctx.user.id,
          userEmail: ctx.user.email || "unknown",
          action: "download",
          productId: input.productId,
          productName: productData?.name || "",
          metadata: `Branded download: ${asset.name}`,
        });

        // 8. Return the branded HTML content
      return { type: "html" as const, content: html, fileName: `${brandName} - ${asset.name}.html` };
    }),

    /** Bulk download branded assets for multiple products */
    bulkBrandedDownload: protectedProcedure
      .input(z.object({
        productIds: z.array(z.number()).min(1).max(50),
      }))
      .mutation(async ({ input, ctx }) => {
        const profile = await getCompanyProfile(ctx.user.id);
        const brandName = profile?.companyName || "GAGE Strategies";
        const brandTagline = profile?.tagline || "Positioning Your Business for What's Next";
        const brandEmail = profile?.email || "hello@gage-strategies.com";
        const brandWebsite = profile?.website || "gage-strategies.com";
        const brandPhone = profile?.phone || "";
        const brandLogo = profile?.logoUrl || "";

        const results: Array<{ productId: number; productName: string; fileName: string; content: string; type: string; error?: string }> = [];
        const failures: Array<{ productId: number; productName: string; reason: string }> = [];

        for (const productId of input.productIds) {
          // Verify access
          const isAdmin = ctx.user.role === 'admin';
          const purchased = isAdmin || await hasUserPurchased(ctx.user.id, productId);
          const productData = await getProductById(productId);
          const isFree = productData?.pricing === "free";
          if (!purchased && !isFree) {
            failures.push({ productId, productName: productData?.name || `Product #${productId}`, reason: "Not purchased" });
            continue;
          }

          // Get assets
          const allAssets = await getProductAssets(productId);
          if (allAssets.length === 0) {
            failures.push({ productId, productName: productData?.name || `Product #${productId}`, reason: "No assets available" });
            continue;
          }

          for (const asset of allAssets) {
            const isHtml = asset.fileType === "html" || asset.fileUrl.endsWith(".html");
            if (!isHtml) {
              results.push({
                productId,
                productName: productData?.name || "",
                fileName: asset.name,
                content: asset.fileUrl,
                type: "redirect",
              });
              continue;
            }

            try {
              const { storageGetSignedUrl } = await import("./storage");
              const fileKey = asset.fileKey || asset.fileUrl.replace("/manus-storage/", "");
              const signedUrl = await storageGetSignedUrl(fileKey);
              const response = await fetch(signedUrl);
              if (!response.ok) {
                failures.push({ productId, productName: productData?.name || "", reason: `File fetch failed (${response.status})` });
                continue;
              }
              let html = await response.text();

              html = html.replace(/\{\{COMPANY_NAME\}\}/g, brandName);
              html = html.replace(/\{\{TAGLINE\}\}/g, brandTagline);
              html = html.replace(/\{\{EMAIL\}\}/g, brandEmail);
              html = html.replace(/\{\{WEBSITE\}\}/g, brandWebsite);
              html = html.replace(/\{\{PHONE\}\}/g, brandPhone);
              html = html.replace(/\{\{LOGO_URL\}\}/g, brandLogo);

              results.push({
                productId,
                productName: productData?.name || "",
                fileName: `${brandName} - ${asset.name}.html`,
                content: html,
                type: "html",
              });
            } catch (e) {
              failures.push({ productId, productName: productData?.name || "", reason: `Error: ${(e as Error).message}` });
            }
          }
        }

        // Log bulk download activity
        await logActivity({
          userId: ctx.user.id,
          userEmail: ctx.user.email || "unknown",
          action: "download",
          productId: 0,
          productName: "Bulk Download",
          metadata: `Bulk branded download: ${results.length} files from ${input.productIds.length} products${failures.length > 0 ? ` (${failures.length} failed)` : ""}`,
        });

        return { files: results, totalFiles: results.length, failures };
      }),
  }),

  templates: router({
    /** Check if a product has a template definition */
    hasTemplate: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(({ input }) => {
        const template = TEMPLATE_DEFINITIONS.find(t => t.productId === input.productId);
        return { hasTemplate: !!template };
      }),

    /** Generate a branded PDF for a specific product template */
    generate: publicProcedure
      .input(z.object({ productId: z.number() }))
      .mutation(async ({ input }) => {
        const template = TEMPLATE_DEFINITIONS.find(t => t.productId === input.productId);
        if (!template) {
          throw new Error(`No template found for product ${input.productId}`);
        }
        const result = await generateAndStorePDF(
          { title: template.title, subtitle: template.subtitle, sections: template.sections },
          template.storageKey
        );
        return { ...result, fileName: template.fileName, fileType: template.fileType };
      }),

    /** Generate all templates at once (admin use) */
    generateAll: publicProcedure.mutation(async () => {
      const results: Array<{ productId: number; fileName: string; url: string; size: number }> = [];
      for (const template of TEMPLATE_DEFINITIONS) {
        const result = await generateAndStorePDF(
          { title: template.title, subtitle: template.subtitle, sections: template.sections },
          template.storageKey
        );
        results.push({ productId: template.productId, fileName: template.fileName, url: result.url, size: result.size });
      }
      return results;
    }),

    /** Re-brand a template with client's logo */
    rebrand: protectedProcedure
      .input(z.object({
        productId: z.number(),
        companyName: z.string().min(1),
        logoBase64: z.string(), // base64 encoded logo image
      }))
      .mutation(async ({ input, ctx }) => {
        const template = TEMPLATE_DEFINITIONS.find(t => t.productId === input.productId);
        if (!template) {
          throw new Error(`No template found for product ${input.productId}`);
        }
        const logoBuffer = Buffer.from(input.logoBase64, "base64");
        const storageKey = `whitelabel/${ctx.user.id}/${template.storageKey}`;
        const result = await rebrandTemplate(
          { title: template.title, subtitle: template.subtitle, sections: template.sections },
          logoBuffer,
          input.companyName,
          storageKey
        );
        // Log the white-label activity
        await logActivity({
          userId: ctx.user.id,
          userEmail: ctx.user.email || undefined,
          action: "whitelabel",
          productId: input.productId,
          productName: template.title,
          metadata: `Company: ${input.companyName}`,
        });
        return { ...result, fileName: `${input.companyName} - ${template.fileName}`, fileType: template.fileType };
      }),

    /** List available templates for a product */
    listAvailable: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(({ input }) => {
        const template = TEMPLATE_DEFINITIONS.find(t => t.productId === input.productId);
        if (!template) return null;
        return {
          productId: template.productId,
          title: template.title,
          subtitle: template.subtitle,
          fileName: template.fileName,
          description: template.description,
          sectionCount: template.sections.length,
          sections: template.sections.map(s => s.heading),
        };
      }),
  }),

  // ==================== AI TOOLS (PUBLIC) ====================
  ai: router({
    generateSubjectLines: publicProcedure
      .input(z.object({
        topic: z.string().min(3).max(500),
        tone: z.string().default("professional"),
      }))
      .mutation(async ({ input }) => {
        let subjectLines: string[] = [];
        try {
          const result = await invokeLLM({
            model: "gpt-5-mini",
            messages: [
              {
                role: "system",
                content: `You are an expert email marketing copywriter. Generate exactly 10 email subject lines based on the user's topic and tone. Return ONLY a JSON object with a key "subjectLines" containing an array of 10 strings. Each subject line should be under 60 characters, compelling, and optimized for open rates.`,
              },
              {
                role: "user",
                content: `Topic: ${input.topic}\nTone: ${input.tone}\n\nGenerate 10 email subject lines.`,
              },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "subject_lines",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    subjectLines: {
                      type: "array",
                      items: { type: "string" },
                      description: "Array of 10 email subject lines"
                    }
                  },
                  required: ["subjectLines"],
                  additionalProperties: false,
                },
              },
            },
          });

          const content = result?.choices?.[0]?.message?.content;
          
          const text = typeof content === "string" ? content : Array.isArray(content) ? content.map((c: any) => "text" in c ? c.text : "").join("") : "";
          if (!text) {
            subjectLines = ["Unable to generate subject lines. The AI service returned an empty response."];
            return { subjectLines };
          }
          
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            subjectLines = parsed.slice(0, 10);
          } else if (parsed.subjectLines && Array.isArray(parsed.subjectLines)) {
            subjectLines = parsed.subjectLines.slice(0, 10);
          } else if (parsed.subject_lines && Array.isArray(parsed.subject_lines)) {
            subjectLines = parsed.subject_lines.slice(0, 10);
          } else {
            const firstArray = Object.values(parsed).find((v: unknown) => Array.isArray(v));
            if (firstArray) subjectLines = (firstArray as string[]).slice(0, 10);
          }
          
          if (subjectLines.length === 0) {
            subjectLines = ["Unable to parse AI response. Please try again."];
          }
        } catch (e) {
          console.error("[AI Subject Lines] Error:", e instanceof Error ? e.message : String(e));
          subjectLines = ["Unable to generate subject lines. Please try again."];
        }

       return { subjectLines };
     }),

    generateBusinessNames: publicProcedure
      .input(z.object({
        industry: z.string().min(2).max(200),
        keywords: z.string().max(500).default(""),
        style: z.enum(["modern", "classic", "playful", "bold", "minimal", "tech"]),
        nameLength: z.enum(["short", "medium", "long"]).default("medium"),
      }))
      .mutation(async ({ input }) => {
        let names: Array<{ name: string; tagline: string; available: boolean }> = [];
        try {
          const result = await invokeLLM({
            model: "gpt-5-mini",
            messages: [
              {
                role: "system",
                content: `You are a creative brand naming expert. Generate exactly 15 unique, brandable business names based on the user's industry, keywords, and style preferences. For each name, also generate a short tagline (under 8 words). Return a JSON object with a key "names" containing an array of objects with "name" and "tagline" fields. Names should be: memorable, easy to spell, domain-friendly (no special characters), and match the requested style. Length preference: ${input.nameLength === "short" ? "1-2 words" : input.nameLength === "medium" ? "2-3 words" : "3-4 words"}.`,
              },
              {
                role: "user",
                content: `Industry: ${input.industry}\nKeywords: ${input.keywords || "none specified"}\nStyle: ${input.style}\n\nGenerate 15 unique business names.`,
              },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "business_names",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    names: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          tagline: { type: "string" },
                        },
                        required: ["name", "tagline"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["names"],
                  additionalProperties: false,
                },
              },
            },
          });
          const content = result?.choices?.[0]?.message?.content;
          const text = typeof content === "string" ? content : Array.isArray(content) ? content.map((c: any) => "text" in c ? c.text : "").join("") : "";
          if (text) {
            const parsed = JSON.parse(text);
            const rawNames = parsed.names || parsed.businessNames || Object.values(parsed).find((v: unknown) => Array.isArray(v)) || [];
            names = (rawNames as any[]).slice(0, 15).map((n: any) => ({
              name: n.name || n,
              tagline: n.tagline || "",
              available: Math.random() > 0.3,
            }));
          }
        } catch (e) {
          console.error("[AI Business Names] Error:", e instanceof Error ? e.message : String(e));
        }
        if (names.length === 0) {
          names = [{ name: "Unable to generate names. Please try again.", tagline: "", available: false }];
        }
        return { names };
      }),

    generateColdEmails: publicProcedure
      .input(z.object({
        product: z.string().min(3).max(500),
        targetAudience: z.string().min(3).max(300),
        goal: z.enum(["book_meeting", "get_reply", "drive_signup", "build_awareness"]),
        tone: z.enum(["professional", "casual", "direct", "friendly", "provocative"]),
        senderName: z.string().max(100).default(""),
        companyName: z.string().max(100).default(""),
      }))
      .mutation(async ({ input }) => {
        let emails: Array<{ subject: string; body: string; type: string }> = [];
        try {
          const result = await invokeLLM({
            model: "gpt-5-mini",
            messages: [
              {
                role: "system",
                content: `You are an expert cold outreach copywriter. Generate a 4-email cold outreach sequence. Each email should have a subject line and body. The sequence: 1) Initial outreach, 2) Follow-up with value, 3) Social proof angle, 4) Breakup email. Keep emails concise (under 150 words each). Use sender name/company if provided. Return JSON with key "emails" containing array of objects with "subject", "body", and "type" fields.`,
              },
              {
                role: "user",
                content: `Product/Service: ${input.product}\nTarget Audience: ${input.targetAudience}\nGoal: ${input.goal.replace(/_/g, " ")}\nTone: ${input.tone}\nSender: ${input.senderName || "not specified"}\nCompany: ${input.companyName || "not specified"}\n\nGenerate a 4-email sequence.`,
              },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "cold_emails",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    emails: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          subject: { type: "string" },
                          body: { type: "string" },
                          type: { type: "string" },
                        },
                        required: ["subject", "body", "type"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["emails"],
                  additionalProperties: false,
                },
              },
            },
          });
          const content = result?.choices?.[0]?.message?.content;
          const text = typeof content === "string" ? content : Array.isArray(content) ? content.map((c: any) => "text" in c ? c.text : "").join("") : "";
          if (text) {
            const parsed = JSON.parse(text);
            emails = (parsed.emails || Object.values(parsed).find((v: unknown) => Array.isArray(v)) || []).slice(0, 4);
          }
        } catch (e) {
          console.error("[AI Cold Emails] Error:", e instanceof Error ? e.message : String(e));
        }
        if (emails.length === 0) {
          emails = [{ subject: "Unable to generate. Please try again.", body: "", type: "error" }];
        }
        return { emails };
      }),

    generateCaptions: publicProcedure
      .input(z.object({
        topic: z.string().min(3).max(500),
        platform: z.enum(["instagram", "linkedin", "twitter", "facebook", "tiktok"]),
        tone: z.enum(["professional", "casual", "witty", "inspirational", "educational", "promotional"]),
        includeHashtags: z.boolean().default(true),
        includeEmojis: z.boolean().default(true),
        captionLength: z.enum(["short", "medium", "long"]).default("medium"),
      }))
      .mutation(async ({ input }) => {
        let captions: Array<{ caption: string; hashtags: string[] }> = [];
        try {
          const lengthGuide = input.captionLength === "short" ? "under 50 words" : input.captionLength === "medium" ? "50-100 words" : "100-200 words";
          const result = await invokeLLM({
            model: "gpt-5-mini",
            messages: [
              {
                role: "system",
                content: `You are a social media expert. Generate exactly 10 ${input.platform} captions for the given topic. Each caption should be ${lengthGuide}, match the ${input.tone} tone, ${input.includeEmojis ? "include relevant emojis" : "no emojis"}, and be optimized for ${input.platform}. ${input.includeHashtags ? "Include 5-8 relevant hashtags per caption." : "No hashtags."} Return JSON with key "captions" containing array of objects with "caption" and "hashtags" (array of strings without #) fields.`,
              },
              {
                role: "user",
                content: `Topic: ${input.topic}\nPlatform: ${input.platform}\nTone: ${input.tone}\n\nGenerate 10 captions.`,
              },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "social_captions",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    captions: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          caption: { type: "string" },
                          hashtags: { type: "array", items: { type: "string" } },
                        },
                        required: ["caption", "hashtags"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["captions"],
                  additionalProperties: false,
                },
              },
            },
          });
          const content = result?.choices?.[0]?.message?.content;
          const text = typeof content === "string" ? content : Array.isArray(content) ? content.map((c: any) => "text" in c ? c.text : "").join("") : "";
          if (text) {
            const parsed = JSON.parse(text);
            captions = (parsed.captions || Object.values(parsed).find((v: unknown) => Array.isArray(v)) || []).slice(0, 10);
          }
        } catch (e) {
          console.error("[AI Captions] Error:", e instanceof Error ? e.message : String(e));
        }
        if (captions.length === 0) {
          captions = [{ caption: "Unable to generate captions. Please try again.", hashtags: [] }];
        }
        return { captions };
      }),
  }),

  // ==================== COMPANY PROFILE ====================
  companyProfile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return await getCompanyProfile(ctx.user.id);
    }),

    update: protectedProcedure
      .input(z.object({
        companyName: z.string().optional(),
        tagline: z.string().optional(),
        logoUrl: z.string().optional(),
        website: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        primaryColor: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await upsertCompanyProfile(ctx.user.id, input);
      }),

    uploadLogo: protectedProcedure
      .input(z.object({
        base64: z.string(),
        filename: z.string(),
        contentType: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { storagePut } = await import("./storage");
        const buffer = Buffer.from(input.base64, "base64");
        const ext = input.filename.split(".").pop() || "png";
        const storageKey = `company-logos/${ctx.user.id}/logo.${ext}`;
        const { url } = await storagePut(storageKey, buffer, input.contentType);
        await upsertCompanyProfile(ctx.user.id, { logoUrl: url });
        return { url };
      }),
  }),

  // ==================== ORGANIZATIONS ====================
  org: router({
    // List all orgs the current user belongs to
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserOrganizations(ctx.user.id);
    }),

    // Get a single org by ID (must be a member)
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const membership = await getOrgMembership(input.id, ctx.user.id);
        if (!membership) throw new Error("Not a member of this organization");
        const org = await getOrganizationById(input.id);
        return { ...org, role: membership.role };
      }),

    // Create a new organization
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1).max(255),
        website: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const slug = generateSlug(input.name);
        return await createOrganization({
          name: input.name,
          slug,
          ownerId: ctx.user.id,
          website: input.website || undefined,
        });
      }),

    // Update an organization (owner/admin only)
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).max(255).optional(),
        logoUrl: z.string().optional(),
        website: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const membership = await getOrgMembership(input.id, ctx.user.id);
        if (!membership || membership.role === "member") throw new Error("Only owners and admins can update the organization");
        const { id, ...data } = input;
        return await updateOrganization(id, data);
      }),

    // Delete an organization (owner only)
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const membership = await getOrgMembership(input.id, ctx.user.id);
        if (!membership || membership.role !== "owner") throw new Error("Only the owner can delete the organization");
        return await deleteOrganization(input.id);
      }),

    // Upload org logo
    uploadLogo: protectedProcedure
      .input(z.object({
        orgId: z.number(),
        base64: z.string(),
        filename: z.string(),
        contentType: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const membership = await getOrgMembership(input.orgId, ctx.user.id);
        if (!membership || membership.role === "member") throw new Error("Only owners and admins can update the logo");
        const { storagePut } = await import("./storage");
        const buffer = Buffer.from(input.base64, "base64");
        const ext = input.filename.split(".").pop() || "png";
        const storageKey = `org-logos/${input.orgId}/logo.${ext}`;
        const { url } = await storagePut(storageKey, buffer, input.contentType);
        await updateOrganization(input.orgId, { logoUrl: url });
        return { url };
      }),

    // ==================== MEMBERS ====================
    members: router({
      // List members of an org
      list: protectedProcedure
        .input(z.object({ orgId: z.number() }))
        .query(async ({ ctx, input }) => {
          const membership = await getOrgMembership(input.orgId, ctx.user.id);
          if (!membership) throw new Error("Not a member of this organization");
          return await getOrgMembers(input.orgId);
        }),

      // Update a member's role (owner/admin only)
      updateRole: protectedProcedure
        .input(z.object({
          orgId: z.number(),
          userId: z.number(),
          role: z.enum(["admin", "member"]),
        }))
        .mutation(async ({ ctx, input }) => {
          const membership = await getOrgMembership(input.orgId, ctx.user.id);
          if (!membership || membership.role === "member") throw new Error("Only owners and admins can change roles");
          if (input.userId === ctx.user.id) throw new Error("Cannot change your own role");
          await updateOrgMemberRole(input.orgId, input.userId, input.role);
          return { success: true };
        }),

      // Remove a member (owner/admin only, cannot remove owner)
      remove: protectedProcedure
        .input(z.object({ orgId: z.number(), userId: z.number() }))
        .mutation(async ({ ctx, input }) => {
          const membership = await getOrgMembership(input.orgId, ctx.user.id);
          if (!membership || membership.role === "member") throw new Error("Only owners and admins can remove members");
          const targetMembership = await getOrgMembership(input.orgId, input.userId);
          if (targetMembership?.role === "owner") throw new Error("Cannot remove the owner");
          await removeOrgMember(input.orgId, input.userId);
          return { success: true };
        }),

      // Leave an organization (cannot leave if you're the owner)
      leave: protectedProcedure
        .input(z.object({ orgId: z.number() }))
        .mutation(async ({ ctx, input }) => {
          const membership = await getOrgMembership(input.orgId, ctx.user.id);
          if (!membership) throw new Error("Not a member of this organization");
          if (membership.role === "owner") throw new Error("Owner cannot leave. Transfer ownership or delete the organization.");
          await removeOrgMember(input.orgId, ctx.user.id);
          return { success: true };
        }),
    }),

    // ==================== INVITES ====================
    invites: router({
      // List pending invites for an org (owner/admin only)
      list: protectedProcedure
        .input(z.object({ orgId: z.number() }))
        .query(async ({ ctx, input }) => {
          const membership = await getOrgMembership(input.orgId, ctx.user.id);
          if (!membership || membership.role === "member") throw new Error("Only owners and admins can view invites");
          return await getOrgInvites(input.orgId);
        }),

      // Create an invite (owner/admin only)
      create: protectedProcedure
        .input(z.object({
          orgId: z.number(),
          email: z.string().email(),
          role: z.enum(["admin", "member"]).default("member"),
          origin: z.string().url(),
        }))
        .mutation(async ({ ctx, input }) => {
          const membership = await getOrgMembership(input.orgId, ctx.user.id);
          if (!membership || membership.role === "member") throw new Error("Only owners and admins can invite members");
          const token = crypto.randomBytes(32).toString('hex');
          const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
          await createOrgInvite({
            orgId: input.orgId,
            email: input.email,
            role: input.role,
            token,
            invitedBy: ctx.user.id,
            expiresAt,
          });
          const inviteUrl = `${input.origin}/invite/${token}`;
          return { inviteUrl, token, expiresAt };
        }),

      // Accept an invite (any authenticated user)
      accept: protectedProcedure
        .input(z.object({ token: z.string() }))
        .mutation(async ({ ctx, input }) => {
          const invite = await getOrgInviteByToken(input.token);
          if (!invite) throw new Error("Invite not found");
          if (invite.status !== "pending") throw new Error("Invite is no longer valid");
          if (new Date(invite.expiresAt) < new Date()) throw new Error("Invite has expired");
          // Check if already a member
          const existing = await getOrgMembership(invite.orgId, ctx.user.id);
          if (existing) throw new Error("You are already a member of this organization");
          // Add as member and mark invite accepted
          await addOrgMember(invite.orgId, ctx.user.id, invite.role);
          await acceptOrgInvite(input.token);
          const org = await getOrganizationById(invite.orgId);
          return { success: true, organization: org };
        }),

      // Cancel/delete an invite (owner/admin only)
      delete: protectedProcedure
        .input(z.object({ orgId: z.number(), inviteId: z.number() }))
        .mutation(async ({ ctx, input }) => {
          const membership = await getOrgMembership(input.orgId, ctx.user.id);
          if (!membership || membership.role === "member") throw new Error("Only owners and admins can cancel invites");
          await deleteOrgInvite(input.inviteId);
          return { success: true };
        }),

      // Get invite details by token (public for the invite acceptance page)
      getByToken: publicProcedure
        .input(z.object({ token: z.string() }))
        .query(async ({ input }) => {
          const invite = await getOrgInviteByToken(input.token);
          if (!invite) return null;
          const org = await getOrganizationById(invite.orgId);
          return { invite: { email: invite.email, role: invite.role, status: invite.status, expiresAt: invite.expiresAt }, organization: org ? { name: org.name, logoUrl: org.logoUrl } : null };
        }),
    }),
  }),
});
export type AppRouter = typeof appRouter;
import { stripe } from "./stripe";
import { createOrganization, getOrganizationById, getOrganizationBySlug, getUserOrganizations, updateOrganization, deleteOrganization, getOrgMembers, getOrgMembership, addOrgMember, updateOrgMemberRole, removeOrgMember, createOrgInvite, getOrgInvites, getOrgInviteByToken, acceptOrgInvite, deleteOrgInvite } from "./db";
import crypto from "crypto";

// Blog routes are defined inside the appRouter above
