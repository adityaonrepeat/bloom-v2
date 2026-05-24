import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("better-auth.session_token");

  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/aastha") ||
    request.nextUrl.pathname.startsWith("/talk") ||
    request.nextUrl.pathname.startsWith("/journal") ||
    request.nextUrl.pathname.startsWith("/quiz") ||
    request.nextUrl.pathname === "/result";

  // 1. Block unauthenticated users
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Prevent logged-in users from seeing login/signup
  if (token && request.nextUrl.pathname === "/login" || token && request.nextUrl.pathname === "/signup") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/aastha/:path*",
    "/talk/:path*",
    "/journal/:path*",
    "/quiz/:path*",
    "/result",
    "/login",
    "/signup",
  ],
};
