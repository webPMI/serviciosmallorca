import type { APIRoute } from "astro";
import { SERVICES } from "../data/services";
import { BLOG_POSTS } from "../data/posts";

export const prerender = false;

const SITE_URL = "https://serviciosmallorca.com";
const LOCALES = ["es", "en", "ca"] as const;

export const GET: APIRoute = async () => {
  const now = new Date().toISOString().split("T")[0];

  const urls: Array<{
    loc: string;
    lastmod?: string;
    changefreq?: string;
    priority?: string;
    alternates?: Array<{ lang: string; href: string }>;
  }> = [];

  // 1. Homepages
  LOCALES.forEach((lang) => {
    const prefix = lang === "es" ? "" : `/${lang}`;
    urls.push({
      loc: `${SITE_URL}${prefix}/`,
      lastmod: now,
      changefreq: "daily",
      priority: "1.0",
      alternates: LOCALES.map((l) => ({
        lang: l,
        href: `${SITE_URL}${l === "es" ? "" : `/${l}`}/`,
      })),
    });
  });

  // 2. Directorio Principal de Servicios
  LOCALES.forEach((lang) => {
    const prefix = lang === "es" ? "" : `/${lang}`;
    urls.push({
      loc: `${SITE_URL}${prefix}/servicios`,
      lastmod: now,
      changefreq: "daily",
      priority: "0.9",
      alternates: LOCALES.map((l) => ({
        lang: l,
        href: `${SITE_URL}${l === "es" ? "" : `/${l}`}/servicios`,
      })),
    });
  });

  // 3. Fichas de Negocios y Servicios (Todos los 10+ sectores)
  SERVICES.forEach((service) => {
    LOCALES.forEach((lang) => {
      const prefix = lang === "es" ? "" : `/${lang}`;
      urls.push({
        loc: `${SITE_URL}${prefix}/servicios/${service.slug}`,
        lastmod: service.lastVerifiedAt || now,
        changefreq: "weekly",
        priority: "0.85",
        alternates: LOCALES.map((l) => ({
          lang: l,
          href: `${SITE_URL}${l === "es" ? "" : `/${l}`}/servicios/${service.slug}`,
        })),
      });
    });
  });

  // 4. Artículos del Blog & Guías Locales
  BLOG_POSTS.forEach((post) => {
    LOCALES.forEach((lang) => {
      const prefix = lang === "es" ? "" : `/${lang}`;
      urls.push({
        loc: `${SITE_URL}${prefix}/blog/${post.slug}`,
        lastmod: post.publishDate || now,
        changefreq: "monthly",
        priority: "0.7",
        alternates: LOCALES.map((l) => ({
          lang: l,
          href: `${SITE_URL}${l === "es" ? "" : `/${l}`}/blog/${post.slug}`,
        })),
      });
    });
  });

  // 5. Páginas Estáticas e Institucionales
  const staticRoutes = ["comunidad", "sobre-nosotros", "contacto", "terminos", "privacidad"];
  staticRoutes.forEach((route) => {
    LOCALES.forEach((lang) => {
      const prefix = lang === "es" ? "" : `/${lang}`;
      urls.push({
        loc: `${SITE_URL}${prefix}/${route}`,
        lastmod: now,
        changefreq: "monthly",
        priority: "0.5",
        alternates: LOCALES.map((l) => ({
          lang: l,
          href: `${SITE_URL}${l === "es" ? "" : `/${l}`}/${route}`,
        })),
      });
    });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}
    ${u.changefreq ? `<changefreq>${u.changefreq}</changefreq>` : ""}
    ${u.priority ? `<priority>${u.priority}</priority>` : ""}
    ${(u.alternates || [])
      .map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${alt.href}" />`)
      .join("\n")}
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml.trim(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
};
