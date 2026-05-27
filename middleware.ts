// ─── middleware.ts ─────────────────────────────────────────────────────────────
// Next.js Edge Middleware — protects /dashboard/* AND /admin/* routes.
// Place this file at the PROJECT ROOT (same level as app/).

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Role → allowed dashboard path prefixes
const ROLE_PATHS: Record<string, string> = {
  admin:           "/dashboard/admin",
  employer:        "/dashboard/employer",
  employee:        "/dashboard/employee",
  companyEmployee: "/dashboard/employee",
};

// Paths that do NOT require authentication
const PUBLIC_PATHS = [
  "/",
  "/about",
  "/services",
  "/blog",
  "/contact",
  "/auth",
  "/employer/payment",
  "/_next",
  "/images",
  "/favicon",
  // Admin login is public — admins visit it directly
  "/admin/login",
];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p + "?"));
}

/**
 * Decode a JWT payload without verifying the signature.
 * Signature verification happens on the backend on every API call.
 * We only need the role here to decide where to redirect.
 */
function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let public paths through
  if (isPublic(pathname)) return NextResponse.next();

  const token = request.cookies.get("sk_token")?.value;

  // ─── Admin routes: /admin/* ───────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    // No token → redirect to admin login
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("reason", "unauthenticated");
      return NextResponse.redirect(url);
    }

    const payload = decodeJwtPayload(token);

    // Malformed token
    if (!payload) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("reason", "invalid_token");
      return NextResponse.redirect(url);
    }

    // Expired token
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("reason", "session_expired");
      return NextResponse.redirect(url);
    }

    // CRITICAL: Only admin role is allowed — employers and employees are REJECTED
    const role: string = payload.isCompanyEmployee ? "companyEmployee" : payload.role;
    if (role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("reason", "unauthorized");
      return NextResponse.redirect(url);
    }

    // /admin → redirect to dashboard
    if (pathname === "/admin" || pathname === "/admin/") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    return NextResponse.next();
  }

  // ─── Dashboard routes: /dashboard/* ──────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    // No token → redirect to login
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/callback";
      url.searchParams.set("reason", "unauthenticated");
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    const payload = decodeJwtPayload(token);

    if (!payload) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/callback";
      url.searchParams.set("reason", "invalid_token");
      return NextResponse.redirect(url);
    }

    if (payload.exp && Date.now() / 1000 > payload.exp) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/callback";
      url.searchParams.set("reason", "session_expired");
      return NextResponse.redirect(url);
    }

    const role: string = payload.isCompanyEmployee ? "companyEmployee" : payload.role;
    const allowedPrefix = ROLE_PATHS[role];

    if (!allowedPrefix) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (!pathname.startsWith(allowedPrefix)) {
      return NextResponse.redirect(new URL(allowedPrefix, request.url));
    }

    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      return NextResponse.redirect(new URL(allowedPrefix, request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on dashboard AND admin routes
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
