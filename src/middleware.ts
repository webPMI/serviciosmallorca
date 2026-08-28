import { defineMiddleware } from "astro/middleware";
import { detectUserLocale, getLangPrefix, LOCALES } from "./i18n";
import { logToD1 } from "./lib/d1Logger";

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
  /\/(es|en|ca|de)\/dashboard/,
  /\/(es|en|ca|de)\/profile/,
  /\/(es|en|ca|de)\/login/,
  /\/(es|en|ca|de)\/register/,
  /\/(es|en|ca|de)\/forgot-password/,
];

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, request, cookies, redirect } = context;
  const pathname = url.pathname;
  const d1 = (context.locals as any)?.runtime?.env?.DB;

  // ── Markdown Content Negotiation (AI Agents & LLMs) ─────────────────────
  const acceptHeader = request.headers.get("accept") || "";
  const wantsMarkdown =
    acceptHeader.includes("text/markdown") ||
    acceptHeader.includes("text/x-markdown") ||
    url.searchParams.get("format") === "md";

  if (wantsMarkdown && !pathname.startsWith("/api/")) {
    const mdResponse = `# Servicios Mallorca
> El directorio y motor de recomendación líder de empresas, profesionales y servicios verificados en Mallorca (Islas Baleares, España).

## Superficies de Descubrimiento para Agentes de IA
- **Sitemap Markdown:** https://serviciosmallorca.com/sitemap.md
- **LLMs.txt:** https://serviciosmallorca.com/llms.txt
- **LLMs Full Index:** https://serviciosmallorca.com/llms-full.txt
- **Agent Manifest:** https://serviciosmallorca.com/.well-known/agents.json
- **MCP Server Card:** https://serviciosmallorca.com/.well-known/mcp/server-card.json
- **Guía para Agentes (AGENTS.md):** https://serviciosmallorca.com/AGENTS.md

## Catálogo de Servicios y Empresas
Explora el directorio completo y las valoraciones de restaurantes Michelin, chárters náuticos, reformas de villas, spas y servicios profesionales en https://serviciosmallorca.com/sitemap.md.
`;

    return new Response(mdResponse.trim() + "\n", {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        Vary: "Accept",
        "Cache-Control": "public, max-age=3600",
        ...SECURITY_HEADERS,
      },
    });
  }

  try {
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
      response.headers.set("Vary", "Accept, Accept-Language");

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
      const cookieLocale = cookies.get("locale")?.value;
      const detected =
        cookieLocale && LOCALES.includes(cookieLocale as any) ? (cookieLocale as any) : detectUserLocale(request);
      const prefix = getLangPrefix(detected);
      // Hardening GR-13: la redirección 302 también viaja con las cabeceras de seguridad
      const redirectResponse = redirect(prefix, 302);
      for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
        redirectResponse.headers.set(key, value);
      }
      return redirectResponse;
    }

    const response = await next();
    for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
      response.headers.set(key, value);
    }
    response.headers.set("Vary", "Accept, Accept-Language");
    return response;
  } catch (ssrError: any) {
    // 🛡️ Capturar y persistir error SSR crítico en Cloudflare D1
    await logToD1(d1, {
      level: "ERROR",
      category: "SSR",
      message: ssrError?.message || "Excepción no controlada en renderizado SSR",
      stack: ssrError?.stack,
      url: pathname,
      method: request.method,
      status: 500,
      userAgent: request.headers.get("user-agent") || undefined,
      clientIp: request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || undefined,
    });

    return new Response(
      `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Error del Servidor | Servicios Mallorca</title><style>body{font-family:system-ui;background:#0f172a;color:#f8fafc;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;padding:20px;text-align:center}h1{color:#f87171}a{color:#ffd700;text-decoration:none;font-weight:bold}</style></head><body><div><h1>💥 Error Temporal del Servidor</h1><p>El incidente ha sido registrado automáticamente en nuestro sistema de auditoría D1.</p><p><a href="/es/">← Volver a la página principal</a></p></div></body></html>`,
      {
        status: 500,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          ...SECURITY_HEADERS,
        },
      },
    );
  }
});
