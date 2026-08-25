import type { APIRoute } from "astro";
import { SERVICES } from "../data/services/index.ts";
import { CATEGORIES } from "../data/categories.ts";
import { MALLORCA_ZONES } from "../data/zones.ts";

export const prerender = false;

export const GET: APIRoute = async () => {
  let content = `# Servicios Mallorca - Índice Completo para Modelos de Lenguaje (LLMs)
> Catálogo exhaustivo de todos los servicios profesionales, restaurantes, náutica, spas e inmobiliarias verificadas en Mallorca.

`;

  for (const s of SERVICES) {
    const cat = CATEGORIES.find((c) => c.id === s.category);
    const zone = MALLORCA_ZONES.find((z) => z.id === s.zone);

    content += `## ${s.name}\n`;
    content += `- **URL Canónica:** https://serviciosmallorca.com/es/servicios/${s.slug}\n`;
    content += `- **Categoría:** ${cat?.name.es || s.category}\n`;
    content += `- **Zona:** ${zone?.name.es || s.zone}\n`;
    content += `- **Dirección:** ${s.address}\n`;
    content += `- **Teléfono:** ${s.phone || "No disponible"}\n`;
    if (s.website) content += `- **Sitio Web Oficial:** ${s.website}\n`;
    if (s.rating) content += `- **Valoración:** ${s.rating} / 5 (${s.reviewCount || 0} reseñas verificadas)\n`;
    content += `- **Descripción:** ${s.fullDescription?.es || s.shortDescription?.es || ""}\n`;
    if (Array.isArray(s.specialties) ? s.specialties.length > 0 : (s.specialties?.es?.length ?? 0) > 0) {
      const specialties = Array.isArray(s.specialties) ? s.specialties : s.specialties?.es || [];
      content += `- **Especialidades:**\n`;
      for (const sp of specialties) {
        content += `  - ${sp}\n`;
      }
    }
    content += `\n---\n\n`;
  }

  return new Response(content.trim() + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
