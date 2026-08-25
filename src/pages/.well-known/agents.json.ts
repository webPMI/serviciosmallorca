import type { APIRoute } from "astro";

export const prerender = false;

const AGENTS_MANIFEST = {
  $schema: "https://schemas.agentprotocols.org/agent-manifest.json",
  name: "Servicios Mallorca Agent Interface",
  description:
    "AI Agent interface and discovery manifest for verified businesses, restaurants, yacht charters, spas, and professional services across Mallorca (Balearic Islands, Spain).",
  url: "https://serviciosmallorca.com",
  version: "1.0.0",
  provider: {
    name: "Servicios Mallorca",
    url: "https://serviciosmallorca.com",
    contact: "tech@serviciosmallorca.com",
  },
  discovery: {
    llms_txt: "https://serviciosmallorca.com/llms.txt",
    llms_full_txt: "https://serviciosmallorca.com/llms-full.txt",
    sitemap_xml: "https://serviciosmallorca.com/sitemap.xml",
    sitemap_md: "https://serviciosmallorca.com/sitemap.md",
    agents_md: "https://serviciosmallorca.com/AGENTS.md",
  },
  content_negotiation: {
    supported_formats: ["text/html", "text/markdown", "application/json", "application/ld+json"],
    markdown_header: "Accept: text/markdown",
  },
  capabilities: {
    search: {
      url: "https://serviciosmallorca.com/api/search?q={query}",
      method: "GET",
      description: "Search businesses by keyword, category, zone, or service name",
    },
    categories: {
      url: "https://serviciosmallorca.com/api/categories",
      method: "GET",
      description: "List all official taxonomy categories in Mallorca",
    },
    mcp_server: {
      card_url: "https://serviciosmallorca.com/.well-known/mcp/server-card.json",
      status: "active",
    },
  },
  data_quality_guarantee: {
    standard: "GR-11 Zero Fake Data",
    geographic_bounds: "Mallorca, Balearic Islands, Spain",
    multilingual: ["es", "en", "ca"],
  },
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(AGENTS_MANIFEST, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
