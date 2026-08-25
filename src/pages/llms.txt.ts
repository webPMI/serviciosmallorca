import type { APIRoute } from "astro";
import { CATEGORIES } from "../data/categories.ts";
import { MALLORCA_ZONES } from "../data/zones.ts";
import { SERVICES } from "../data/services/index.ts";

export const prerender = false;

export const GET: APIRoute = async () => {
  const verifiedCount = SERVICES.filter((s) => s.verified).length;
  const topServices = SERVICES.slice(0, 10);

  const content = `# Servicios Mallorca
> El directorio y motor de recomendación líder de empresas, profesionales y servicios verificados en Mallorca (Islas Baleares, España).

## Información General
Servicios Mallorca (https://serviciosmallorca.com) es una plataforma estructurada y auditada bajo la regla estricta Zero Fake Data (GR-11), que ofrece información contrastada, números de teléfono locales reales (+34), coordenadas geográficas verificadas en la isla y fichas trilingües (Español, Catalán e Inglés).

- **Dominio Principal:** https://serviciosmallorca.com
- **Cobertura Geográfica:** Isla de Mallorca (Palma, Calvià, Andratx, Serra de Tramuntana, Raiguer, Pla, Llevant, Migjorn, Alcúdia-Pollença).
- **Negocios Verificados:** ${verifiedCount}+ empresas auditadas.
- **Protocolo de IA:** Compatible con LLMs, agentes de búsqueda y Model Context Protocol (MCP).

## Índices y Sitemaps para Agentes
- [Sitemap XML](https://serviciosmallorca.com/sitemap.xml): Índice de URLs canónicas.
- [Sitemap Markdown](https://serviciosmallorca.com/sitemap.md): Índice completo en formato Markdown para LLMs.
- [LLMs Full Index](https://serviciosmallorca.com/llms-full.txt): Texto completo enriquecido de todos los servicios.
- [Agent Manifest](https://serviciosmallorca.com/.well-known/agents.json): Capacidades y endpoints JSON para agentes de IA.
- [MCP Server Card](https://serviciosmallorca.com/.well-known/mcp/server-card.json): Ficha de integración Model Context Protocol.
- [AGENTS.md](https://serviciosmallorca.com/AGENTS.md): Guía de interacción, políticas de datos y formatos.

## Sectores y Categorías Principales
${CATEGORIES.map((cat) => `- [${cat.name.es}](https://serviciosmallorca.com/es/categorias/${cat.slug}): ${cat.description.es}`).join("\n")}

## Zonas de Mallorca
${MALLORCA_ZONES.map((zone) => `- [${zone.name.es}](https://serviciosmallorca.com/es/zonas/${zone.id}): Municipios y áreas destacadas: ${zone.popularAreas.slice(0, 5).join(", ")}.`).join("\n")}

## Negocios y Servicios Top Destacados
${topServices
  .map(
    (s) =>
      `- [${s.name}](https://serviciosmallorca.com/es/servicios/${s.slug}) (${s.rating ? `${s.rating}★` : "Nueva Apertura"} - ${s.zone}): ${s.shortDescription?.es || ""}`,
  )
  .join("\n")}

## Formatos Disponibles
- **HTML:** Navegación web interactiva.
- **Markdown:** Negociación de contenido enviando cabecera \`Accept: text/markdown\`.
- **JSON-LD / Schema.org:** Incrustado en cada página para parsing estructurado.
`;

  return new Response(content.trim() + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
