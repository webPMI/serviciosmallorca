/**
 * tests/unit/seoPositioningAndAiBots.test.ts
 *
 * 🧪 SUITE DE PRUEBAS PARA SEO INTERNACIONAL, GEO LOCAL Y RASTREABILIDAD DE AGENTES IA
 */

import { describe, it, expect } from "vitest";
import { GET as getRobots } from "../../src/pages/robots.txt.ts";
import { GET as getSitemapXml } from "../../src/pages/sitemap.xml.ts";
import { GET as getSitemapMd } from "../../src/pages/sitemap.md.ts";
import { GET as getLlmsTxt } from "../../src/pages/llms.txt.ts";
import { GET as getLlmsFullTxt } from "../../src/pages/llms-full.txt.ts";

const mockContext: any = {
  url: new URL("https://serviciosmallorca.com/robots.txt"),
  request: new Request("https://serviciosmallorca.com/robots.txt"),
};

describe("🤖 SEO, GEO & AI BOT POSITIONING ENGINE", () => {
  it("debe generar un robots.txt completo con soporte explícito para GPTBot, ClaudeBot, Perplexity y Google-Extended", async () => {
    const res = await getRobots(mockContext);
    expect(res.status).toBe(200);
    const text = await res.text();

    // Verificación de AI bots permitidos
    expect(text).toContain("User-agent: GPTBot");
    expect(text).toContain("User-agent: OAI-SearchBot");
    expect(text).toContain("User-agent: ClaudeBot");
    expect(text).toContain("User-agent: PerplexityBot");
    expect(text).toContain("User-agent: Google-Extended");
    expect(text).toContain("User-agent: Applebot");
    expect(text).toContain("User-agent: MistralAI-Crawler");
    expect(text).toContain("User-agent: DeepSeekBot");

    // Verificación de rutas privadas protegidas
    expect(text).toContain("Disallow: /*/profile");
    expect(text).toContain("Disallow: /*/dashboard");

    // Sitemaps listados
    expect(text).toContain("Sitemap: https://serviciosmallorca.com/sitemap.xml");
    expect(text).toContain("Sitemap: https://serviciosmallorca.com/sitemap.md");
  });

  it("debe generar sitemap.xml multilingüe con los 4 idiomas (ES, EN, CA, DE) y etiquetas hreflang", async () => {
    const res = await getSitemapXml(mockContext);
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("application/xml");
    const xml = await res.text();

    // XML Structure
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');

    // Idiomas cubiertos
    expect(xml).toContain("https://serviciosmallorca.com/es");
    expect(xml).toContain("https://serviciosmallorca.com/en");
    expect(xml).toContain("https://serviciosmallorca.com/ca");
    expect(xml).toContain("https://serviciosmallorca.com/de");

    // Alternates hreflang
    expect(xml).toContain('hreflang="es"');
    expect(xml).toContain('hreflang="en"');
    expect(xml).toContain('hreflang="ca"');
    expect(xml).toContain('hreflang="de"');
    expect(xml).toContain('hreflang="x-default"');

    // Secciones clave incluidas
    expect(xml).toContain("/cuadro-de-honor");
    expect(xml).toContain("/unete");
    expect(xml).toContain("/deporte");
  });

  it("debe generar sitemap.md en Markdown optimizado para agentes de lenguaje", async () => {
    const res = await getSitemapMd(mockContext);
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("text/markdown");
    const md = await res.text();

    expect(md).toContain("# Mapa del Sitio (Markdown Sitemap)");
    expect(md).toContain("## 👑 Listas del Cuadro de Honor");
    expect(md).toContain("## 🏷️ Categorías Sectoriales");
    expect(md).toContain("## 📍 Zonas y Comarcas");
  });

  it("debe exponer llms.txt y llms-full.txt con datos de confianza y teléfonos contrastados", async () => {
    const resLlms = await getLlmsTxt(mockContext);
    expect(resLlms.status).toBe(200);
    const txt = await resLlms.text();
    expect(txt).toContain("# Servicios Mallorca");
    expect(txt).toContain("Zero Fake Data (GR-11)");

    const resFull = await getLlmsFullTxt(mockContext);
    expect(resFull.status).toBe(200);
    const fullTxt = await resFull.text();
    expect(fullTxt).toContain("Coordenadas GPS");
    expect(fullTxt).toContain("Índice de Confianza");
  });
});
