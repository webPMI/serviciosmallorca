import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async () => {
  const robots = `# https://www.robotstxt.org/robotstxt.html
# Robots & AI Agent Crawling Policy for Servicios Mallorca (https://serviciosmallorca.com)

User-agent: *
Allow: /
# Rutas privadas reales (bajo prefijo de locale: /es|en|ca/...).
# Ver docs/TOPS_SEO_PLAYBOOK.md §4 y tests/unit/topsSeoPlaybook.test.ts.
Disallow: /api/
Disallow: /*/login
Disallow: /*/register
Disallow: /*/forgot-password
Disallow: /*/profile
Disallow: /*/dashboard

# ==============================================================================
# OpenAI Agents (ChatGPT, Search, Browsing & Training)
# ==============================================================================
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

# ==============================================================================
# Anthropic Claude Agents (Search, User & Training)
# ==============================================================================
User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

# ==============================================================================
# Perplexity AI Agents
# ==============================================================================
User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

# ==============================================================================
# Google AI & Search Crawlers
# ==============================================================================
User-agent: Google-Extended
Allow: /

User-agent: GoogleOther
Allow: /

User-agent: Googlebot
Allow: /

# ==============================================================================
# Apple & Meta AI Agents
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
# Other Semantic & LLM Crawlers
# ==============================================================================
User-agent: cohere-ai
Allow: /

User-agent: Diffbot
Allow: /

User-agent: ByteSpider
Allow: /

User-agent: Amazonbot
Allow: /

# ==============================================================================
# Sitemaps & AI Agent Discovery Manifests
# ==============================================================================
Sitemap: https://serviciosmallorca.com/sitemap.xml
Sitemap: https://serviciosmallorca.com/sitemap.md

# LLMs.txt & Agent Specifications
# See https://llmstxt.org/ & https://serviciosmallorca.com/AGENTS.md
`;

  return new Response(robots.trim() + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
