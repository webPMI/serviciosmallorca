import { describe, it, expect } from "vitest";
import { GET as getRobots } from "../../src/pages/robots.txt.ts";
import { GET as getLlms } from "../../src/pages/llms.txt.ts";
import { GET as getLlmsFull } from "../../src/pages/llms-full.txt.ts";
import { GET as getAgentsMd } from "../../src/pages/AGENTS.md.ts";
import { GET as getSitemapMd } from "../../src/pages/sitemap.md.ts";
import { GET as getAgentsJson } from "../../src/pages/.well-known/agents.json.ts";
import { GET as getMcpServerCard } from "../../src/pages/.well-known/mcp/server-card.json.ts";
import { GET as getOpenIdConfig } from "../../src/pages/.well-known/openid-configuration.ts";
import { generateHomepageJsonLd } from "../../src/lib/jsonLdGenerator.ts";

describe("AI Agent & LLM Readiness Surfaces (isyoursiteaiready Grade A / 100)", () => {
  it("robots.txt explicitly allows all major AI agents and references sitemaps", async () => {
    const res = await getRobots({} as any);
    expect(res.status).toBe(200);
    const body = await res.text();

    expect(body).toContain("User-agent: GPTBot");
    expect(body).toContain("User-agent: OAI-SearchBot");
    expect(body).toContain("User-agent: ChatGPT-User");
    expect(body).toContain("User-agent: ClaudeBot");
    expect(body).toContain("User-agent: Claude-SearchBot");
    expect(body).toContain("User-agent: PerplexityBot");
    expect(body).toContain("User-agent: Google-Extended");
    expect(body).toContain("Sitemap: https://serviciosmallorca.com/sitemap.xml");
    expect(body).toContain("Sitemap: https://serviciosmallorca.com/sitemap.md");
  });

  it("llms.txt complies with the llmstxt.org specification", async () => {
    const res = await getLlms({} as any);
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("text/plain");
    const body = await res.text();

    expect(body).toContain("# Servicios Mallorca");
    expect(body).toContain("https://serviciosmallorca.com/sitemap.md");
    expect(body).toContain("https://serviciosmallorca.com/.well-known/agents.json");
    expect(body).toContain("https://serviciosmallorca.com/.well-known/mcp/server-card.json");
  });

  it("llms-full.txt returns comprehensive text of all catalog services", async () => {
    const res = await getLlmsFull({} as any);
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain("# Servicios Mallorca - Índice Completo");
    expect(body).toContain("Restaurante Marc Fosh");
    expect(body).toContain("Cruceros Attraction Catamarans Palma");
  });

  it("AGENTS.md provides clear protocol instructions and Zero Fake Data guarantees", async () => {
    const res = await getAgentsMd({} as any);
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("text/markdown");
    const body = await res.text();

    expect(body).toContain("# AGENTS.md");
    expect(body).toContain("Zero Fake Data (GR-11)");
    expect(body).toContain("Accept: text/markdown");
  });

  it("sitemap.md dynamically outputs structured markdown links for all services and categories", async () => {
    const res = await getSitemapMd({} as any);
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("text/markdown");
    const body = await res.text();

    expect(body).toContain("# Mapa del Sitio (Markdown Sitemap)");
    expect(body).toContain("/es/servicios/restaurante-marc-fosh");
    expect(body).toContain("/es/servicios/attraction-catamarans");
    expect(body).toContain("/es/categorias/gastronomia-catering");
  });

  it(".well-known/agents.json returns machine-readable agent manifest", async () => {
    const res = await getAgentsJson({} as any);
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("application/json");
    const json = await res.json();

    expect(json.name).toBe("Servicios Mallorca Agent Interface");
    expect(json.discovery.llms_txt).toBe("https://serviciosmallorca.com/llms.txt");
    expect(json.discovery.sitemap_md).toBe("https://serviciosmallorca.com/sitemap.md");
    expect(json.capabilities.search).toBeDefined();
    expect(json.capabilities.mcp_server).toBeDefined();
  });

  it(".well-known/mcp/server-card.json returns valid MCP card", async () => {
    const res = await getMcpServerCard({} as any);
    expect(res.status).toBe(200);
    const json = await res.json();

    expect(json.name).toBe("servicios-mallorca-mcp");
    expect(json.tools).toBeInstanceOf(Array);
    expect(json.tools.some((t: any) => t.name === "search_businesses")).toBe(true);
  });

  it(".well-known/openid-configuration returns valid OAuth discovery", async () => {
    const res = await getOpenIdConfig({} as any);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.issuer).toBe("https://serviciosmallorca.com");
    expect(json.authorization_endpoint).toBe("https://serviciosmallorca.com/login");
  });

  it("generateHomepageJsonLd generates valid WebSite and Organization Schema.org entities", () => {
    const jsonLd = generateHomepageJsonLd("es", "https://serviciosmallorca.com/es");
    expect(jsonLd).toBeInstanceOf(Array);
    expect(jsonLd.length).toBe(2);

    const website = jsonLd.find((item) => item["@type"] === "WebSite");
    const org = jsonLd.find((item) => item["@type"] === "Organization");

    expect(website).toBeDefined();
    expect(website?.potentialAction?.["@type"]).toBe("SearchAction");
    expect(org).toBeDefined();
    expect(org?.areaServed?.name).toContain("Mallorca");
  });
});
