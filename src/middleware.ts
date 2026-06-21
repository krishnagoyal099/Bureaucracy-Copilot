// src/middleware.ts
// IMPORTANT: Middleware runs in the Edge Runtime — no Node.js APIs, no Prisma.
// Strategy: check that the session cookie is present. The real session
// validation (DB lookup) happens in server components/actions via auth().
//
// next-auth@5.0.0-beta uses "authjs." prefix for cookies.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// next-auth v5 beta uses "authjs." prefix (not "next-auth.")
const SESSION_COOKIE =
  process.env.NODE_ENV === "production"
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

// Fallback: next-auth v4 style (in case beta uses old naming)
const SESSION_COOKIE_LEGACY = "next-auth.session-token";

export function middleware(req: NextRequest) {
  const hasSession =
    req.cookies.has(SESSION_COOKIE) || req.cookies.has(SESSION_COOKIE_LEGACY);

  if (!hasSession) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/documents/:path*",
    "/opportunities/:path*",
    "/settings/:path*",
  ],
};