import type { APIRoute } from "astro";

export const prerender = false;

const MCP_SERVER_CARD = {
  $schema: "https://modelcontextprotocol.io/schemas/server-card.json",
  name: "servicios-mallorca-mcp",
  title: "Servicios Mallorca MCP Server",
  description:
    "Model Context Protocol (MCP) server for querying verified businesses, Michelin restaurants, nautical charters, and services across Mallorca.",
  version: "1.0.0",
  homepage: "https://serviciosmallorca.com",
  repository: "https://github.com/serviciosmallorca/serviciosmallorca",
  transport: {
    type: "sse",
    endpoint: "https://serviciosmallorca.com/api/mcp/sse",
  },
  tools: [
    {
      name: "search_businesses",
      description: "Search verified businesses in Mallorca by keyword, category, or geographic zone.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search term or service name" },
          zone: { type: "string", description: "Zone slug (e.g. palma, calvia-andratx, tramuntana)" },
          category: { type: "string", description: "Category slug (e.g. gastronomia-catering, nautica-charter)" },
        },
      },
    },
    {
      name: "get_business_details",
      description: "Retrieve comprehensive, verified 5-pillar data for a specific business by its slug.",
      parameters: {
        type: "object",
        properties: {
          slug: { type: "string", description: "The unique slug of the business" },
        },
        required: ["slug"],
      },
    },
  ],
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(MCP_SERVER_CARD, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
