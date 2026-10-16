import { NextResponse, type NextRequest } from "next/server";

// Must match SESSION_COOKIE in src/lib/account.ts (kept here so the proxy stays dependency-free).
const SESSION_COOKIE = "growtern_session";

/** Pages that need a (placeholder) personal account. API routes check auth themselves. */
export function proxy(req: NextRequest) {
  if (!req.cookies.get(SESSION_COOKIE)?.value) {
    const url = new URL("/sign-in", req.url);
    url.searchParams.set("redirect_url", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/assessment/take/:path*", "/assessment/result/:path*"],
};
