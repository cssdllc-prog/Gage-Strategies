import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { clerkMiddleware } from "@clerk/express";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { registerStripeWebhook } from "../stripe";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Register Stripe webhook BEFORE body parsers (needs raw body for signature verification)
  registerStripeWebhook(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // Reads the Clerk session (cookie or Bearer token) on every request and
  // makes it available to getAuth(req) in context.ts. Doesn't block
  // unauthenticated requests itself — that's left to individual procedures.
  // clerkMiddleware's internal auth check doesn't await/catch its own
  // promise (a known gap — see @clerk/express source), so if it ever
  // rejects, Express never finds out and the connection just hangs until
  // Railway's edge times out and fabricates its own opaque 500 — with
  // nothing ever logged on our end. A timeout-based safety net guarantees
  // every request resolves quickly even if Clerk's own check never calls
  // back: after 5s we proceed as unauthenticated rather than hanging.
  app.use((req, res, next) => {
    let settled = false;
    const settle = (err?: unknown) => {
      if (settled) return;
      settled = true;
      next(err as never);
    };

    const timeout = setTimeout(() => {
      console.error(
        "[ClerkMiddleware] Did not complete within 5s for",
        req.method,
        req.path,
        "— proceeding as unauthenticated to avoid a hung request."
      );
      settle();
    }, 5000);

    try {
      clerkMiddleware()(req, res, err => {
        clearTimeout(timeout);
        settle(err);
      });
    } catch (err) {
      clearTimeout(timeout);
      settle(err);
    }
  });
  registerStorageProxy(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Safety net: any error that reaches this point (including ones from
  // middleware/routes that didn't handle their own errors) gets logged in
  // full rather than silently producing an unexplained 500.
  app.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      console.error("[GlobalErrorHandler] Unhandled error:", err);
      if (!res.headersSent) {
        res.status(500).send("Internal Server Error");
      }
    }
  );

  process.on("unhandledRejection", reason => {
    console.error("[UnhandledRejection]", reason);
  });
  process.on("uncaughtException", err => {
    console.error("[UncaughtException]", err);
  });

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
