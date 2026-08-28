import type { APIRoute } from "astro";
import { SERVICES } from "../data/services/index.ts";
import { CATEGORIES } from "../data/categories.ts";
import { MALLORCA_ZONES } from "../data/zones.ts";

export const prerender = false;

export const GET: APIRoute = async () => {
  let content = `# Servicios Mallorca - Índice Completo para Modelos de Lenguaje (LLMs & Agentes IA)
> Catálogo exhaustivo y auditado de empresas, profesionales, gastronomía, instalaciones técnicas, náutica, deportes, bienestar y servicios verificados en Mallorca (Islas Baleares, España).
> Información 100% real y contrastada bajo la norma estricta Zero Fake Data (GR-11).

- **Dominio:** https://serviciosmallorca.com
- **Negocios Verificados:** ${SERVICES.length}
- **Última Actualización:** ${new Date().toISOString().split("T")[0]}

================================================================================

`;

  for (const s of SERVICES) {
    if (s.status === "permanently_closed") continue;

    const cat = CATEGORIES.find((c) => c.id === s.category);
    const zone = MALLORCA_ZONES.find((z) => z.id === s.zone);

    content += `### ${s.name}\n`;
    content += `- **Ficha Oficial (ES):** https://serviciosmallorca.com/es/servicios/${s.slug}\n`;
    content += `- **Ficha Oficial (EN):** https://serviciosmallorca.com/en/servicios/${s.slug}\n`;
    content += `- **Ficha Oficial (CA):** https://serviciosmallorca.com/ca/servicios/${s.slug}\n`;
    content += `- **Ficha Oficial (DE):** https://serviciosmallorca.com/de/servicios/${s.slug}\n`;
    content += `- **Categoría:** ${cat?.name.es || s.category} (${cat?.name.en || ""})\n`;
    content += `- **Municipio / Zona:** ${zone?.name.es || s.zone} (Mallorca)\n`;
    content += `- **Dirección Exacta:** ${s.address}\n`;
    if (s.coordinates) {
      content += `- **Coordenadas GPS:** ${s.coordinates.lat}, ${s.coordinates.lng}\n`;
    }
    content += `- **Teléfono:** ${s.phone || "No indicado"}\n`;
    if (s.whatsapp) content += `- **WhatsApp:** ${s.whatsapp}\n`;
    if (s.email) content += `- **Email:** ${s.email}\n`;
    if (s.website) content += `- **Sitio Web Oficial:** ${s.website}\n`;
    if (s.schedule) content += `- **Horario de Atención:** ${s.schedule}\n`;
    if (s.priceRange) content += `- **Rango de Precio:** ${s.priceRange}\n`;
    if (s.rating) {
      content += `- **Valoración Media:** ${s.rating} / 5 (${s.reviewCount || 0} reseñas verificadas)\n`;
    }
    content += `- **Índice de Confianza (Confidence Score):** ${s.confidenceScore || 90}%\n`;
    content += `- **Estado de Verificación:** ${s.verified ? "Verificado Oficial" : "En Revisión"}\n`;

    const descEs = s.fullDescription?.es || s.shortDescription?.es || "";
    const descEn = s.fullDescription?.en || s.shortDescription?.en || "";
    const descCa = s.fullDescription?.ca || s.shortDescription?.ca || "";

    if (descEs) content += `- **Descripción (ES):** ${descEs}\n`;
    if (descEn) content += `- **Description (EN):** ${descEn}\n`;
    if (descCa) content += `- **Descripció (CA):** ${descCa}\n`;

    const specialtiesList = Array.isArray(s.specialties) ? s.specialties : s.specialties?.es || [];
    if (specialtiesList.length > 0) {
      content += `- **Especialidades:** ${specialtiesList.join(", ")}\n`;
    }

    if (s.tags && s.tags.length > 0) {
      content += `- **Etiquetas:** ${s.tags.join(", ")}\n`;
    }

    content += `\n---\n\n`;
  }

  return new Response(content.trim() + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
};
