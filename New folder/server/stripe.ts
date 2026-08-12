import Stripe from "stripe";
import { ENV } from "./_core/env";
import express, { Router, Request, Response } from "express";
import { createPurchase, updatePurchaseBySessionId, updatePurchaseBySubscriptionId, getProductById } from "./db";
import { notifyOwner } from "./_core/notification";

// Initialize Stripe
const stripe = new Stripe(ENV.stripeSecretKey);

export { stripe };

/**
 * Create a Stripe Checkout session for a one-time purchase
 */
export async function createOneTimeCheckout(params: {
  productId: number;
  productName: string;
  priceInCents: number;
  userId: number;
  userEmail: string;
  userName?: string;
  origin: string;
}) {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: params.userEmail,
    client_reference_id: params.userId.toString(),
    allow_promotion_codes: true,
    metadata: {
      user_id: params.userId.toString(),
      product_id: params.productId.toString(),
      product_name: params.productName,
      customer_email: params.userEmail,
      customer_name: params.userName || "",
      purchase_type: "one_time",
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: params.productName,
            description: `One-time purchase: ${params.productName}`,
          },
          unit_amount: params.priceInCents,
        },
        quantity: 1,
      },
    ],
    success_url: `${params.origin}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${params.origin}/solution/${params.productId}`,
  });

  return session;
}

/**
 * Create a Stripe Checkout session for a subscription
 */
export async function createSubscriptionCheckout(params: {
  productId: number;
  productName: string;
  monthlyPriceInCents: number;
  userId: number;
  userEmail: string;
  userName?: string;
  origin: string;
}) {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: params.userEmail,
    client_reference_id: params.userId.toString(),
    allow_promotion_codes: true,
    metadata: {
      user_id: params.userId.toString(),
      product_id: params.productId.toString(),
      product_name: params.productName,
      customer_email: params.userEmail,
      customer_name: params.userName || "",
      purchase_type: "subscription",
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: params.productName,
            description: `Monthly subscription: ${params.productName}`,
          },
          recurring: {
            interval: "month",
          },
          unit_amount: params.monthlyPriceInCents,
        },
        quantity: 1,
      },
    ],
    success_url: `${params.origin}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${params.origin}/solution/${params.productId}`,
  });

  return session;
}

/**
 * Register the Stripe webhook endpoint
 * MUST be registered BEFORE express.json() middleware
 */
export function registerStripeWebhook(app: ReturnType<typeof Router>) {
  // Use express.raw for webhook signature verification

  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      const sig = req.headers["stripe-signature"] as string;
      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          ENV.stripeWebhookSecret
        );
      } catch (err: any) {
        console.error("[Stripe Webhook] Signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // Handle test events
      if (event.id.startsWith("evt_test_")) {
        console.log("[Stripe Webhook] Test event detected, returning verification response");
        return res.json({ verified: true });
      }

      console.log(`[Stripe Webhook] Received event: ${event.type} (${event.id})`);

      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = parseInt(session.metadata?.user_id || "0");
            const productId = parseInt(session.metadata?.product_id || "0");
            const purchaseType = session.metadata?.purchase_type as "one_time" | "subscription";

            if (userId && productId) {
              await createPurchase({
                userId,
                productId,
                stripeCustomerId: session.customer as string || undefined,
                stripeSessionId: session.id,
                stripeSubscriptionId: session.subscription as string || undefined,
                type: purchaseType || "one_time",
                status: "active",
                amount: session.amount_total ? (session.amount_total / 100).toFixed(2) : undefined,
                currency: session.currency || "usd",
              });
              console.log(`[Stripe Webhook] Purchase recorded: user=${userId}, product=${productId}, type=${purchaseType}`);

              // Send purchase confirmation email notification to owner
              const productName = session.metadata?.product_name || `Product #${productId}`;
              const customerEmail = session.metadata?.customer_email || session.customer_email || "Unknown";
              const customerName = session.metadata?.customer_name || "A customer";
              const amountFormatted = session.amount_total ? `$${(session.amount_total / 100).toFixed(2)}` : "N/A";

              await notifyOwner({
                title: `New Purchase: ${productName}`,
                content: `Purchase Confirmation\n\nCustomer: ${customerName} (${customerEmail})\nProduct: ${productName}\nAmount: ${amountFormatted} ${(session.currency || "USD").toUpperCase()}\nType: ${purchaseType === "subscription" ? "Monthly Subscription" : "One-time Purchase"}\nDate: ${new Date().toLocaleString()}\n\nThis payment has been processed successfully via Stripe.`,
              }).catch((err) => {
                console.warn("[Stripe Webhook] Failed to send purchase notification:", err);
              });
            }
            break;
          }

          case "customer.subscription.created": {
            const subscription = event.data.object as Stripe.Subscription;
            console.log(`[Stripe Webhook] Subscription created: ${subscription.id}, status=${subscription.status}`);
            // Purchase is already recorded via checkout.session.completed
            // This handler ensures status is synced if subscription starts in a non-active state
            if (subscription.status === "active") {
              await updatePurchaseBySubscriptionId(subscription.id, { status: "active" });
            } else if (subscription.status === "trialing") {
              await updatePurchaseBySubscriptionId(subscription.id, { status: "active" });
            }
            break;
          }

          case "customer.subscription.updated": {
            const subscription = event.data.object as Stripe.Subscription;
            if (subscription.status === "active") {
              await updatePurchaseBySubscriptionId(subscription.id, { status: "active" });
            } else if (subscription.status === "canceled" || subscription.status === "unpaid") {
              await updatePurchaseBySubscriptionId(subscription.id, { status: "cancelled" });
            }
            console.log(`[Stripe Webhook] Subscription updated: ${subscription.id} → ${subscription.status}`);
            break;
          }

          case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            await updatePurchaseBySubscriptionId(subscription.id, { status: "cancelled" });
            console.log(`[Stripe Webhook] Subscription cancelled: ${subscription.id}`);
            break;
          }

          default:
            console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        }
      } catch (err: any) {
        console.error(`[Stripe Webhook] Error processing ${event.type}:`, err.message);
      }

      res.json({ received: true });
    }
  );
}
