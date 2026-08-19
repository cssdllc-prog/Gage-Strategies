import { trpc } from "@/lib/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import "./index.css";
import { OrgProvider } from "./contexts/OrgContext";

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  console.error(
    "[Auth] Missing VITE_CLERK_PUBLISHABLE_KEY — sign-in will not work until this is set."
  );
}

const queryClient = new QueryClient();

// tRPC errors are still logged; unauthorized handling now lives at the
// component level via Clerk's <SignedIn>/<SignedOut>, not a global redirect,
// since Clerk manages its own session cookie automatically.
queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    console.error("[API Query Error]", event.query.state.error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    console.error("[API Mutation Error]", event.mutation.state.error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      async headers() {
        // Clerk's dev instance lives on a different domain than this app
        // (pumped-jaguar-43.clerk.accounts.dev vs gage-strategies.com), so
        // its session cookie isn't reliably readable by our own backend.
        // Attaching the session token directly as a Bearer header sidesteps
        // that entirely — @clerk/express's getAuth() already checks for
        // this header automatically, no backend changes needed.
        try {
          const token = await (window as any).Clerk?.session?.getToken();
          return token ? { Authorization: `Bearer ${token}` } : {};
        } catch {
          return {};
        }
      },
      fetch(input, init) {
        // Clerk's session cookie rides along automatically as long as
        // credentials are included on same-origin requests.
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <OrgProvider>
          <App />
        </OrgProvider>
      </QueryClientProvider>
    </trpc.Provider>
  </ClerkProvider>
);
