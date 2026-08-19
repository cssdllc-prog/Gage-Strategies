import { SignIn as ClerkSignIn } from "@clerk/clerk-react";

/**
 * Renders Clerk's sign-in UI directly inside our own app, at our own
 * domain, rather than redirecting out to Clerk's separately-hosted Account
 * Portal. This avoids Clerk's cross-domain redirect-origin validation
 * entirely — everything happens same-origin, so there's nothing to
 * allowlist and no "cannot redirect to your application" warning.
 */
export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <ClerkSignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-in"
        afterSignInUrl="/"
      />
    </div>
  );
}
