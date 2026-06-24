import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/aastha") ||
    pathname.startsWith("/talk") ||
    pathname.startsWith("/journal") ||
    pathname.startsWith("/quiz") ||
    pathname === "/result";

  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (!isProtectedRoute && !isAuthPage) return NextResponse.next();

  // Validate the *actual* session, not just cookie presence. A stale/expired
  // `better-auth.session_token` cookie would otherwise pass the proxy but be
  // rejected by the page's getSession() — bouncing /dashboard -> /login ->
  // /dashboard forever. Checking the real session here keeps both layers in
  // agreement. (This endpoint isn't in the matcher, so there's no recursion.)
  let isLoggedIn = false;
  let isBlocked = false;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  try {
    const res = await fetch(new URL("/api/auth/get-session", request.url), {
      headers: { cookie: request.headers.get("cookie") ?? "" },
      signal: controller.signal,
    });
    if (res.ok) {
      const session = await res.json().catch(() => null);
      isLoggedIn = !!session?.user;
      isBlocked = !!session?.user?.isBlocked;
    }
  } catch {
    // Timeout or network error (serverless cold start) — fall back to cookie
    // presence so logged-in users aren't bounced to /login.
    isLoggedIn = request.cookies.has("better-auth.session_token");
  } finally {
    clearTimeout(timeout);
  }

  // 1. Block unauthenticated users from protected routes
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Restricted (over-reported) users lose ONLY Talk — the peer-to-peer
  // feature where abuse happens. Their private wellness tools (journal,
  // Aastha, mood) stay open. /blocked isn't in the matcher, so no loop.
  if (pathname.startsWith("/talk") && isBlocked) {
    return NextResponse.redirect(new URL("/blocked", request.url));
  }

  // 3. Prevent logged-in users from seeing login/signup
  if (isAuthPage && isLoggedIn) {
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
