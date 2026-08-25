import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async () => {
  const robots = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /login
Disallow: /registro
Disallow: /recuperar-password
Disallow: /perfil

# Directiva para IAs y Motores de Búsqueda Semántica
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

# Sitemap Oficial
Sitemap: https://serviciosmallorca.com/sitemap.xml
`;

  return new Response(robots.trim(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
