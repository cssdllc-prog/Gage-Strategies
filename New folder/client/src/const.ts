export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Builds a link to Clerk's hosted sign-in page, bringing the user back to
// wherever they were once they're signed in. A Clerk publishable key embeds
// its account portal's domain as base64 (e.g. pk_test_<base64> decodes to
// "your-app.clerk.accounts.dev$"), so this works for any Clerk instance
// without hardcoding a domain.
export const getLoginUrl = () => {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as
    | string
    | undefined;

  if (!publishableKey) {
    console.error("[Auth] Missing VITE_CLERK_PUBLISHABLE_KEY");
    return "/";
  }

  try {
    const encoded = publishableKey.replace(/^pk_(test|live)_/, "");
    const frontendApiDomain = atob(encoded).replace(/\$$/, "");
    const url = new URL(`https://${frontendApiDomain}/sign-in`);
    url.searchParams.set("redirect_url", window.location.href);
    return url.toString();
  } catch (error) {
    console.error("[Auth] Failed to build Clerk sign-in URL", error);
    return "/";
  }
};
