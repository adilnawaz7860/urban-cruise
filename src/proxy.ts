import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { ACCESS_COOKIE } from "@/lib/server/auth";
import { CUSTOMER_ACCESS_COOKIE } from "@/lib/server/customer-auth";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];

function verifyAdmin(request: NextRequest) {
  if (PUBLIC_ADMIN_PATHS.some((p) => request.nextUrl.pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

function verifyCustomer(request: NextRequest) {
  const token = request.cookies.get(CUSTOMER_ACCESS_COOKIE)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    jwt.verify(token, process.env.JWT_CUSTOMER_ACCESS_SECRET as string);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    return verifyAdmin(request);
  }

  if (pathname.startsWith("/account")) {
    return verifyCustomer(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
