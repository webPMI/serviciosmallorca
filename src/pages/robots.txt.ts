import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async () => {
  const robots = `# https://www.robotstxt.org/robotstxt.html
# Robots & AI Agent Crawling Policy for Servicios Mallorca (https://serviciosmallorca.com)

User-agent: *
Allow: /
# Rutas privadas o autenticadas que no deben indexarse (bajo prefijo de locale: /es|en|ca|de/...).
Disallow: /api/
Disallow: /*/login
Disallow: /*/register
Disallow: /*/forgot-password
Disallow: /*/profile
Disallow: /*/dashboard
Disallow: /*/favoritos

# ==============================================================================
# OpenAI Agents (ChatGPT, Search, Browsing & GPT-4o)
# ==============================================================================
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

# ==============================================================================
# Anthropic Claude Agents (Claude 3.5 Sonnet, Search, User & Training)
# ==============================================================================
User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: anthropic-ai
Allow: /

# ==============================================================================
# Perplexity AI Agents
# ==============================================================================
User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

# ==============================================================================
# Google AI & Search Crawlers (Gemini, Googlebot, Vertex AI)
# ==============================================================================
User-agent: Google-Extended
Allow: /

User-agent: GoogleOther
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /

# ==============================================================================
# Apple Intelligence & Meta AI Crawlers
# ==============================================================================
User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

User-agent: Meta-ExternalFetcher
Allow: /

# ==============================================================================
# Other Semantic, Search & Emerging LLM Crawlers
# ==============================================================================
User-agent: MistralAI-Crawler
Allow: /

User-agent: MistralBot
Allow: /

User-agent: DeepSeekBot
Allow: /

User-agent: DuckAssistBot
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: Diffbot
Allow: /

User-agent: ByteSpider
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: YandexBot
Allow: /

# ==============================================================================
# Sitemaps & AI Agent Discovery Manifests
# ==============================================================================
Sitemap: https://serviciosmallorca.com/sitemap.xml
Sitemap: https://serviciosmallorca.com/sitemap.md

# LLMs.txt & Agent Specifications (https://llmstxt.org/)
# LLMs Index: https://serviciosmallorca.com/llms.txt
# LLMs Full Catalog: https://serviciosmallorca.com/llms-full.txt
# Agent Protocol: https://serviciosmallorca.com/.well-known/agents.json
# MCP Server Card: https://serviciosmallorca.com/.well-known/mcp/server-card.json
`;

  return new Response(robots.trim() + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
