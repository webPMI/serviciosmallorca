import type { APIRoute } from "astro";
import { SERVICES } from "../data/services/index.ts";
import { CATEGORIES } from "../data/categories.ts";
import { MALLORCA_ZONES } from "../data/zones.ts";
import { DISCOVERY_TOURS } from "../data/discoveryTours.ts";
import { BLOG_POSTS } from "../data/posts.ts";
import { HONOR_LISTS } from "../lib/honorBoardEngine.ts";
import { LOCALES } from "../i18n/index.ts";

export const prerender = false;

export const GET: APIRoute = async () => {
  const DOMAIN = "https://serviciosmallorca.com";

  let md = `# Mapa del Sitio (Markdown Sitemap) - Servicios Mallorca\n\n`;
  md += `> Índice canónico estructurado de páginas institucionales, mercados de autoridad, categorías sectoriales, zonas geográficas y comercios verificados en Mallorca (Islas Baleares, España).\n\n`;

  md += `## 🏠 Páginas Principales y Mercados de Autoridad\n\n`;
  for (const lang of LOCALES) {
    const l = lang.toUpperCase();
    md += `- [${l} · Inicio](${DOMAIN}/${lang})\n`;
    md += `- [${l} · Directorio General de Servicios](${DOMAIN}/${lang}/servicios)\n`;
    md += `- [${l} · Cuadro de Honor & Subastas +1€](${DOMAIN}/${lang}/cuadro-de-honor)\n`;
    md += `- [${l} · Únete / Alta de Negocios & Tarifas](${DOMAIN}/${lang}/unete)\n`;
    md += `- [${l} · Espacios Deportivos & Fitness](${DOMAIN}/${lang}/deporte)\n`;
    md += `- [${l} · Memoria Histórica & Comercios Centenarios](${DOMAIN}/${lang}/memoria-historica)\n`;
    md += `- [${l} · Comunidad Balear](${DOMAIN}/${lang}/comunidad)\n`;
    md += `- [${l} · Sobre Nosotros & Protocolo de Veracidad](${DOMAIN}/${lang}/sobre-nosotros)\n`;
    md += `- [${l} · Términos & Condiciones Legales](${DOMAIN}/${lang}/terms)\n`;
    md += `- [${l} · Política de Privacidad & RGPD](${DOMAIN}/${lang}/privacy)\n`;
  }

  md += `\n## 👑 Listas del Cuadro de Honor (+1€ Infinito)\n\n`;
  for (const list of HONOR_LISTS) {
    md += `- **${list.icon} ${list.title.es}:** ${list.subtitle.es} ([Ver Puesto en Vivo](${DOMAIN}/es/cuadro-de-honor))\n`;
  }

  md += `\n## 🏷️ Categorías Sectoriales de Mallorca (${CATEGORIES.length})\n\n`;
  for (const cat of CATEGORIES) {
    md += `### ${cat.name.es} (${cat.icon})\n`;
    md += `> ${cat.description.es}\n`;
    for (const lang of LOCALES) {
      const name = cat.name[lang] || cat.name.es;
      md += `- [${lang.toUpperCase()} · ${name}](${DOMAIN}/${lang}/categorias/${cat.slug})\n`;
    }
  }

  md += `\n## 📍 Zonas y Comarcas de Mallorca (${MALLORCA_ZONES.length})\n\n`;
  for (const zone of MALLORCA_ZONES) {
    md += `### ${zone.name.es}\n`;
    md += `> Municipios y áreas de cobertura: ${zone.popularAreas.slice(0, 8).join(", ")}.\n`;
    for (const lang of LOCALES) {
      const name = zone.name[lang] || zone.name.es;
      md += `- [${lang.toUpperCase()} · ${name}](${DOMAIN}/${lang}/zonas/${zone.id})\n`;
    }
  }

  if (DISCOVERY_TOURS && Array.isArray(DISCOVERY_TOURS)) {
    md += `\n## 🗺️ Rutas y Tours Experienciales (${DISCOVERY_TOURS.length})\n\n`;
    for (const t of DISCOVERY_TOURS) {
      md += `- **[${t.title.es}](${DOMAIN}/es/tours/${t.slug})**: ${t.subtitle.es} (${t.estimatedTime} · ${t.stops.length} paradas recomendadas)\n`;
    }
  }

  md += `\n## 💼 Directorio de Negocios y Servicios Auditados (${SERVICES.length})\n\n`;
  for (const s of SERVICES) {
    if (s.status !== "permanently_closed") {
      const cat = CATEGORIES.find((c) => c.id === s.category);
      const z = MALLORCA_ZONES.find((zone) => zone.id === s.zone);
      const ratingStr = s.rating ? ` (${s.rating}★ · ${s.reviewCount || 0} reseñas)` : " (Nueva Apertura)";
      const phoneStr = s.phone ? ` · 📞 ${s.phone}` : "";
      md += `- **[${s.name}](${DOMAIN}/es/servicios/${s.slug})**${ratingStr} - ${cat?.name.es || s.category} · ${z?.name.es || s.zone}${phoneStr}\n`;
    }
  }

  if (BLOG_POSTS && Array.isArray(BLOG_POSTS) && BLOG_POSTS.length > 0) {
    md += `\n## 📰 Artículos y Guías del Blog (${BLOG_POSTS.length})\n\n`;
    for (const p of BLOG_POSTS) {
      md += `- **[${p.title.es}](${DOMAIN}/es/blog/${p.slug})**: Publicado el ${p.publishDate || "reciente"} · [Leer artículo](${DOMAIN}/es/blog/${p.slug})\n`;
    }
  }

  return new Response(md.trim() + "\n", {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
};
