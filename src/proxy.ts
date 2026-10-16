import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Pages that require a personal account. API routes check auth themselves
// so they can return JSON 401s instead of redirects.
const isProtectedPage = createRouteMatcher(["/dashboard(.*)", "/assessment/take(.*)", "/assessment/result(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedPage(req)) await auth.protect();
}, { signInUrl: "/sign-in", signUpUrl: "/sign-up" });

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
