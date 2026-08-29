import type { APIRoute } from "astro";
import { SERVICES } from "../data/services/index.ts";
import { CATEGORIES } from "../data/categories.ts";
import { MALLORCA_ZONES } from "../data/zones.ts";
import { DISCOVERY_TOURS } from "../data/discoveryTours.ts";
import { SIGNATURE_TOURS } from "../lib/experienceTours.ts";
import { BLOG_POSTS } from "../data/posts.ts";

export const prerender = false;

const SITE_URL = "https://serviciosmallorca.com";
const LOCALES = ["es", "en", "ca", "de"] as const;

const TOP_HUBS = [
  "restaurantes-palma",
  "spas-bienestar-mallorca",
  "nautica-charter-calvia",
  "deporte-padel-mallorca",
  "tatuajes-estudios-palma",
  "hoteles-boutique-mallorca",
  "inmobiliarias-lujo-mallorca",
  "bodegas-catas-mallorca",
  "artesania-tradicional-mallorca",
];

export const GET: APIRoute = async () => {
  const now = new Date().toISOString().split("T")[0];

  const urls: Array<{
    loc: string;
    lastmod?: string;
    changefreq?: string;
    priority?: string;
    alternates?: Array<{ lang: string; href: string }>;
  }> = [];

  function addMultilingualUrl(pathSuffix: string, priority = "0.8", changefreq = "weekly", lastmod = now) {
    const cleanPath = pathSuffix.startsWith("/") ? pathSuffix : `/${pathSuffix}`;
    const pathWithoutSlash = cleanPath === "/" ? "" : cleanPath;

    LOCALES.forEach((lang) => {
      const pageLoc = `${SITE_URL}/${lang}${pathWithoutSlash}`;
      urls.push({
        loc: pageLoc,
        lastmod,
        changefreq,
        priority,
        alternates: [
          ...LOCALES.map((l) => ({
            lang: l,
            href: `${SITE_URL}/${l}${pathWithoutSlash}`,
          })),
          {
            lang: "x-default",
            href: `${SITE_URL}/es${pathWithoutSlash}`,
          },
        ],
      });
    });
  }

  // 1. Homepages (Máxima prioridad)
  addMultilingualUrl("/", "1.0", "daily", now);

  // 2. Secciones Principales y Mercados de Autoridad
  addMultilingualUrl("/servicios", "0.95", "daily", now);
  addMultilingualUrl("/cuadro-de-honor", "0.95", "daily", now);
  addMultilingualUrl("/blog", "0.90", "daily", now);
  addMultilingualUrl("/tours", "0.90", "weekly", now);
  addMultilingualUrl("/unete", "0.90", "weekly", now);
  addMultilingualUrl("/deporte", "0.90", "weekly", now);
  addMultilingualUrl("/memoria-historica", "0.85", "monthly", now);
  addMultilingualUrl("/comunidad", "0.85", "daily", now);
  addMultilingualUrl("/sobre-nosotros", "0.70", "monthly", now);
  addMultilingualUrl("/terms", "0.40", "yearly", now);
  addMultilingualUrl("/privacy", "0.40", "yearly", now);

  // 3. Hubs de Categorías Sectoriales
  CATEGORIES.forEach((cat) => {
    addMultilingualUrl(`/categorias/${cat.slug}`, "0.90", "weekly", now);
  });

  // 4. Hubs de Zonas y Comarcas de Mallorca
  MALLORCA_ZONES.forEach((zone) => {
    addMultilingualUrl(`/zonas/${zone.id}`, "0.85", "weekly", now);
  });

  // 5. Hubs Comparativos "Los Mejores"
  TOP_HUBS.forEach((slug) => {
    addMultilingualUrl(`/mejores/${slug}`, "0.85", "weekly", now);
  });

  // 6. Rutas y Tours Experienciales
  SIGNATURE_TOURS.forEach((tour) => {
    addMultilingualUrl(`/tours/${tour.slug}`, "0.80", "weekly", now);
  });

  if (DISCOVERY_TOURS && Array.isArray(DISCOVERY_TOURS)) {
    DISCOVERY_TOURS.forEach((tour) => {
      addMultilingualUrl(`/tours/${tour.slug}`, "0.80", "weekly", now);
    });
  }

  // 6. Fichas de Negocios y Servicios (Todos los comercios verificados y activos)
  SERVICES.forEach((service) => {
    if (service.status !== "permanently_closed") {
      addMultilingualUrl(
        `/servicios/${service.slug}`,
        service.confidenceScore && service.confidenceScore >= 90 ? "0.85" : "0.75",
        "weekly",
        service.lastVerifiedAt || now,
      );
    }
  });

  // 7. Artículos del Blog & Guías Locales
  if (BLOG_POSTS && Array.isArray(BLOG_POSTS)) {
    BLOG_POSTS.forEach((post) => {
      addMultilingualUrl(`/blog/${post.slug}`, "0.75", "monthly", post.publishDate || now);
    });
  }

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
  </url>`,
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
