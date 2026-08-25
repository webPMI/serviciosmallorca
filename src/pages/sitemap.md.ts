import type { APIRoute } from "astro";
import { SERVICES } from "../data/services/index.ts";
import { CATEGORIES } from "../data/categories.ts";
import { MALLORCA_ZONES } from "../data/zones.ts";
import { BLOG_POSTS } from "../data/posts.ts";
import { LOCALES } from "../i18n/index.ts";

export const prerender = false;

export const GET: APIRoute = async () => {
  const DOMAIN = "https://serviciosmallorca.com";

  let md = `# Mapa del Sitio (Markdown Sitemap) - Servicios Mallorca\n\n`;
  md += `> Índice completo de páginas, categorías sectoriales, zonas geográficas y servicios verificados en Mallorca.\n\n`;

  md += `## 🏠 Páginas Principales\n\n`;
  for (const lang of LOCALES) {
    md += `- [${lang.toUpperCase()} Inicio](${DOMAIN}/${lang})\n`;
    md += `- [${lang.toUpperCase()} Directorio de Servicios](${DOMAIN}/${lang}/servicios)\n`;
    md += `- [${lang.toUpperCase()} Categorías Sectoriales](${DOMAIN}/${lang}/categorias)\n`;
    md += `- [${lang.toUpperCase()} Zonas de Mallorca](${DOMAIN}/${lang}/zonas)\n`;
    md += `- [${lang.toUpperCase()} Blog & Guías](${DOMAIN}/${lang}/blog)\n`;
  }

  md += `\n## 🏷️ Categorías Sectoriales\n\n`;
  for (const cat of CATEGORIES) {
    md += `### ${cat.name.es} (${cat.icon})\n`;
    for (const lang of LOCALES) {
      const name = cat.name[lang] || cat.name.es;
      md += `- [${name}](${DOMAIN}/${lang}/categorias/${cat.slug})\n`;
    }
  }

  md += `\n## 📍 Zonas y Comarcas de Mallorca\n\n`;
  for (const zone of MALLORCA_ZONES) {
    md += `### ${zone.name.es}\n`;
    for (const lang of LOCALES) {
      const name = zone.name[lang] || zone.name.es;
      md += `- [${name}](${DOMAIN}/${lang}/zonas/${zone.id})\n`;
    }
  }

  md += `\n## 💼 Negocios y Servicios Verificados (${SERVICES.length})\n\n`;
  for (const s of SERVICES) {
    const cat = CATEGORIES.find((c) => c.id === s.category);
    const z = MALLORCA_ZONES.find((zone) => zone.id === s.zone);
    const ratingStr = s.rating ? ` (${s.rating}★)` : " (🆕 Nueva Apertura)";
    md += `- **[${s.name}](${DOMAIN}/es/servicios/${s.slug})**${ratingStr} - ${cat?.name.es || s.category} · ${z?.name.es || s.zone}\n`;
  }

  if (BLOG_POSTS && BLOG_POSTS.length > 0) {
    md += `\n## 📰 Artículos y Guías del Blog\n\n`;
    for (const p of BLOG_POSTS) {
      md += `- [${p.title.es}](${DOMAIN}/es/blog/${p.slug})\n`;
    }
  }

  return new Response(md.trim() + "\n", {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
