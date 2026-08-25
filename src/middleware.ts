import { defineMiddleware } from "astro/middleware";
import { detectUserLocale, getLangPrefix, LOCALES } from "./i18n";

// ---------------------------------------------------------------------------
// Security Headers aplicados a cada respuesta SSR
// ---------------------------------------------------------------------------
const SECURITY_HEADERS: Record<string, string> = {
  // Prevent embedding in iframes (clickjacking)
  "X-Frame-Options": "SAMEORIGIN",
  // Prevent MIME-type sniffing
  "X-Content-Type-Options": "nosniff",
  // Strict referrer leakage policy
  "Referrer-Policy": "strict-origin-when-cross-origin",
  // Disable browser features not needed
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(self), payment=()",
  // Strict Transport Security (only meaningful on HTTPS)
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  // Cross-Origin policies
  "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
  "Cross-Origin-Embedder-Policy": "unsafe-none",
};

// Private routes whose responses should never be cached by browsers/CDNs
const PRIVATE_ROUTE_PATTERNS = [
  /\/(es|en|ca)\/dashboard/,
  /\/(es|en|ca)\/profile/,
  /\/(es|en|ca)\/login/,
  /\/(es|en|ca)\/register/,
  /\/(es|en|ca)\/forgot-password/,
];

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, request, cookies, redirect } = context;
  const pathname = url.pathname;

  // ── Locale detection & redirect ──────────────────────────────────────────
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0] as string | undefined;

  if (firstSegment && LOCALES.includes(firstSegment as any)) {
    cookies.set("locale", firstSegment, {
      path: "/",
      maxAge: 365 * 24 * 60 * 60,
      sameSite: "lax",
      // In production (HTTPS) mark as secure
      secure: process.env.NODE_ENV === "production",
      httpOnly: false, // needs to be readable client-side for i18n
    });

    const response = await next();

    // ── Security headers ────────────────────────────────────────────────────
    for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
      response.headers.set(key, value);
    }

    // ── Cache-Control: no-store for private/authenticated pages ─────────────
    const isPrivate = PRIVATE_ROUTE_PATTERNS.some((re) => re.test(pathname));
    if (isPrivate) {
      response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
      response.headers.set("Pragma", "no-cache");
    }

    return response;
  }

  // Root redirect
  if (pathname === "/" || pathname === "") {
    const detected = detectUserLocale(request);
    const prefix = getLangPrefix(detected);
    return redirect(prefix, 302);
  }

  const response = await next();
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
});
