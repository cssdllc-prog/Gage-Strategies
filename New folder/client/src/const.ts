export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Points at our own in-app /sign-in route (rendering Clerk's <SignIn />
// component directly) rather than redirecting out to Clerk's separately
// hosted Account Portal. Keeping this as a function (rather than inlining
// "/sign-in" at each call site) preserves the existing call sites'
// `window.location.href = getLoginUrl()` pattern unchanged.
export const getLoginUrl = () => "/sign-in";
