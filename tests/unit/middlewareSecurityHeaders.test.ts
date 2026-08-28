/**
 * middlewareSecurityHeaders.test.ts
 *
 * 🛡️ SUITE DE SEGURIDAD HTTP — CABECERAS SSR, RUTAS PRIVADAS Y COOKIES (GR-13 / SECURITY.md §4)
 *
 * Cubre src/middleware.ts, la primera línea de defensa de transporte del sitio:
 *  1. Cabeceras de seguridad obligatorias en cada respuesta SSR (rutas locale y no-locale).
 *  2. Cache-Control: no-store en rutas privadas (dashboard/profile/login/register/forgot).
 *  3. Flags de la cookie de locale (SameSite, Secure solo en producción, httpOnly=false).
 *  4. Negociación Markdown para agentes de IA, servida con cabeceras de seguridad.
 *  5. Redirección raíz 302 CON cabeceras de seguridad (hardening aplicado el 28/08/2026).
 */

import { describe, it, expect } from "vitest";
import { onRequest } from "../../src/middleware.ts";

interface CookieSet {
  name: string;
  value: string;
  options?: Record<string, unknown>;
}

function makeContext(
  pathname: string,
  headers: Record<string, string> = {},
): {
  context: Record<string, unknown>;
  cookieSets: CookieSet[];
  next: () => Promise<Response>;
} {
  const cookieSets: CookieSet[] = [];
  const url = new URL("https://serviciosmallorca.com" + pathname);
  const context: Record<string, unknown> = {
    url,
    request: new Request(url, { headers }),
    cookies: {
      get: (_name: string) => undefined,
      set: (name: string, value: string, options?: Record<string, unknown>) => {
        cookieSets.push({ name, value, options });
      },
    },
    redirect: (location: string, status = 302) => new Response(null, { status, headers: { Location: location } }),
  };
  const next = async (): Promise<Response> => new Response("<html>ok</html>", { status: 200 });
  return { context, cookieSets, next };
}

async function run(
  pathname: string,
  headers: Record<string, string> = {},
): Promise<{
  response: Response;
  cookieSets: CookieSet[];
}> {
  const { context, cookieSets, next } = makeContext(pathname, headers);
  const response = (await onRequest(context as any, next)) as Response;
  return { response, cookieSets };
}

describe("🛡️ Middleware: cabeceras de seguridad HTTP (GR-13 / SECURITY.md §4)", () => {
  it("aplica las cabeceras de seguridad obligatorias en rutas con locale", async () => {
    const { response } = await run("/es/");
    expect(response.headers.get("x-frame-options")).toBe("SAMEORIGIN");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(response.headers.get("referrer-policy")).toBe("strict-origin-when-cross-origin");
    expect(response.headers.get("strict-transport-security")).toContain("max-age=31536000");
    expect(response.headers.get("strict-transport-security")).toContain("includeSubDomains");
    expect(response.headers.get("permissions-policy")).toContain("camera=()");
    expect(response.headers.get("permissions-policy")).toContain("microphone=()");
    expect(response.headers.get("cross-origin-opener-policy")).toBeTruthy();
    expect(response.headers.get("vary")).toContain("Accept");
  });

  it("rutas privadas: Cache-Control no-store + Pragma no-cache (nunca cacheables)", async () => {
    for (const pathname of ["/es/dashboard", "/en/profile", "/ca/login", "/de/register", "/es/forgot-password"]) {
      const { response } = await run(pathname);
      expect(response.headers.get("cache-control")).toContain("no-store");
      expect(response.headers.get("pragma")).toBe("no-cache");
    }
  });

  it("rutas públicas NO reciben no-store (permanecen cacheables)", async () => {
    const { response } = await run("/es/");
    expect(response.headers.get("cache-control")).toBeNull();
    expect(response.headers.get("pragma")).toBeNull();
  });

  it("cookie de locale: SameSite=Lax, httpOnly=false y Secure solo en producción", async () => {
    const prev = process.env.NODE_ENV;
    try {
      process.env.NODE_ENV = "production";
      const prod = await run("/es/");
      const prodCookie = prod.cookieSets.find((c) => c.name === "locale");
      expect(prodCookie).toBeTruthy();
      expect(prodCookie?.options?.sameSite).toBe("lax");
      expect(prodCookie?.options?.secure).toBe(true);
      expect(prodCookie?.options?.httpOnly).toBe(false);

      process.env.NODE_ENV = "development";
      const dev = await run("/es/");
      expect(dev.cookieSets.find((c) => c.name === "locale")?.options?.secure).toBe(false);
    } finally {
      if (prev === undefined) delete process.env.NODE_ENV;
      else process.env.NODE_ENV = prev;
    }
  });

  it("negociación Markdown (agentes de IA): text/markdown con cabeceras de seguridad", async () => {
    const { response } = await run("/es/", { accept: "text/markdown" });
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/markdown");
    expect(await response.text()).toContain("Servicios Mallorca");
    expect(response.headers.get("x-frame-options")).toBe("SAMEORIGIN");
    expect(response.headers.get("vary")).toContain("Accept");
  });

  it("ruta sin prefijo de locale (p.ej. /robots.txt) recibe cabeceras y no fija cookie", async () => {
    const { response, cookieSets } = await run("/robots.txt");
    expect(response.headers.get("x-frame-options")).toBe("SAMEORIGIN");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(cookieSets.length).toBe(0);
  });

  it("redirección raíz 302 incluye cabeceras de seguridad (hardening 28/08/2026)", async () => {
    const { response } = await run("/");
    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toMatch(/^\/(es|en|ca|de)\/?$/);
    expect(response.headers.get("x-frame-options")).toBe("SAMEORIGIN");
    expect(response.headers.get("strict-transport-security")).toContain("max-age=31536000");
  });
});
