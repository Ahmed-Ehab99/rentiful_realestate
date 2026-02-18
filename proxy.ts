import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  const userRole = session?.user?.role;

  // If not authenticated → block protected routes
  if (!session) {
    const isProtectedRoute =
      pathname.startsWith("/managers") || pathname.startsWith("/tenants");

    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    return NextResponse.next();
  }

  // Prevent authenticated users from accessing auth pages
  const isAuthPage = pathname.match(/^\/(signin|signup)$/);
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Role-based protection
  if (pathname.startsWith("/managers") && userRole === "tenant") {
    return NextResponse.redirect(new URL("/tenants/favorites", request.url));
  }

  if (pathname.startsWith("/tenants") && userRole === "manager") {
    return NextResponse.redirect(new URL("/managers/properties", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*|_vercel).*)"],
};
