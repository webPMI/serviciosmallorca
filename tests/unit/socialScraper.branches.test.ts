/**
 * socialScraper.branches.test.ts
 *
 * 📱 COBERTURA DE RAMAS DEL SCRAPER SOCIAL (GR-11 / GR-12 huella digital verificada)
 *
 * tests/unit/scrapers.test.ts cubría el camino feliz de 4 plataformas. Esta suite ataca:
 *  1. HTML vacío → {} temprano; URLs protocol-relative (//dominio) → https.
 *  2. Exclusiones: YouTube /embed/, facebook /sharer|/share.php|/dialog/|/tr/|/login,
 *     instagram /sharer, twitter /intent/|/share.
 *  3. Plataformas no cubiertas antes: LinkedIn, Pinterest, WhatsApp Channel (2 formatos).
 *  4. First-match-wins: el primer perfil de cada red gana.
 *  5. Limpieza de puntuación final (comillas/comas/paréntesis).
 *  6. Deep-crawl de bio-links (Linktree) con fetch stubeado, exclusión /sitemap y fallback.
 *  7. generateSocialDorks: usa URLs encontradas y genera dork solo para las que faltan.
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import { extractSocialLinks, generateSocialDorks } from "../../src/lib/scrapers/socialScraper.ts";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("📱 extractSocialLinks — guard y normalización", () => {
  it("HTML vacío → objeto vacío sin crash", async () => {
    expect(await extractSocialLinks("")).toEqual({});
  });

  it("URLs protocol-relative (//instagram.com) se normalizan a https", async () => {
    const r = await extractSocialLinks(`<script src="//instagram.com/perfil"></script>`);
    expect(r.instagram).toBe("https://instagram.com/perfil");
  });

  it("limpia puntuación final (comillas, comas, paréntesis) de las URLs", async () => {
    const r = await extractSocialLinks(
      `<a href="https://www.tiktok.com/@tienda">TikTok</a>, ("https://pinterest.es/tableros"),`,
    );
    expect(r.tiktok).toBe("https://www.tiktok.com/@tienda");
    expect(r.pinterest).toBe("https://pinterest.es/tableros");
  });

  it("first-match-wins: el primer perfil de cada red gana", async () => {
    const r = await extractSocialLinks(`
      <a href="https://instagram.com/primero">1</a>
      <a href="https://instagram.com/segundo">2</a>
    `);
    expect(r.instagram).toBe("https://instagram.com/primero");
  });
});

describe("📱 extractSocialLinks — exclusiones anti-falso-positivo", () => {
  it("YouTube: ignora /embed/, /iframe_api y /player_api", async () => {
    const r = await extractSocialLinks(`
      <iframe src="https://www.youtube.com/embed/abc"></iframe>
      <script src="https://www.youtube.com/iframe_api"></script>
      <a href="https://www.youtube.com/player_api">api</a>
    `);
    expect(r.youtube).toBeUndefined();
  });

  it("Facebook: ignora /sharer, /share.php, /dialog/, /tr/ y /login", async () => {
    const r = await extractSocialLinks(`
      <a href="https://www.facebook.com/sharer/sharer.php?u=x">sharer</a>
      <a href="https://www.facebook.com/share.php?u=x">share</a>
      <a href="https://www.facebook.com/dialog/send">dialog</a>
      <a href="https://www.facebook.com/tr?id=1">pixel</a>
      <a href="https://www.facebook.com/login">login</a>
    `);
    expect(r.facebook).toBeUndefined();
  });

  it("Instagram ignora /sharer y Twitter ignora /intent/ y /share", async () => {
    const r = await extractSocialLinks(`
      <a href="https://www.instagram.com/sharer.php?u=x">ig share</a>
      <a href="https://twitter.com/intent/tweet?text=x">intent</a>
      <a href="https://x.com/share?url=x">x share</a>
    `);
    expect(r.instagram).toBeUndefined();
    expect(r.twitter).toBeUndefined();
  });

  it("plataformas válidas: LinkedIn, Pinterest y YouTube normal pasan el filtro", async () => {
    const r = await extractSocialLinks(`
      <a href="https://www.linkedin.com/company/estudio-x">LinkedIn</a>
      <a href="https://pinterest.com/tableros">Pinterest</a>
      <a href="https://www.youtube.com/@canaloficial">Canal</a>
    `);
    expect(r.linkedin).toBe("https://www.linkedin.com/company/estudio-x");
    expect(r.pinterest).toBe("https://pinterest.com/tableros");
    expect(r.youtube).toBe("https://www.youtube.com/@canaloficial");
  });

  it("WhatsApp Channel: acepta whatsapp.com/channel/ y chat.whatsapp.com (primer match gana)", async () => {
    const r = await extractSocialLinks(`
      <a href="https://whatsapp.com/channel/canal-oficial">Canal</a>
      <a href="https://chat.whatsapp.com/invitacion">Grupo</a>
    `);
    expect(r.whatsappChannel).toBe("https://whatsapp.com/channel/canal-oficial");

    const r2 = await extractSocialLinks(`<a href="https://chat.whatsapp.com/otro">Chat</a>`);
    expect(r2.whatsappChannel).toBe("https://chat.whatsapp.com/otro");
  });

  it("deep-crawl de Linktree: extrae YouTube/Facebook/TikTok de la bio (fetch stub)", async () => {
    const bioHtml = `
      <a href="https://www.youtube.com/c/canal-de-la-bio">YouTube bio</a>
      <a href="https://www.facebook.com/paginabio">Facebook bio</a>
      <a href="https://www.tiktok.com/@biotiktok">TikTok bio</a>
    `;
    const fetchMock = vi.fn().mockResolvedValue(new Response(bioHtml, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const r = await extractSocialLinks(`<a href="https://linktr.ee/negociomallorca">Todos los enlaces</a>`);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe("https://linktr.ee/negociomallorca");
    expect(r.youtube).toBe("https://www.youtube.com/c/canal-de-la-bio");
    expect(r.facebook).toBe("https://www.facebook.com/paginabio");
    expect(r.tiktok).toBe("https://www.tiktok.com/@biotiktok");
  });

  it("bio-links: no hace fetch a /sitemap y el fallo de red es silencioso", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("bio down"));
    vi.stubGlobal("fetch", fetchMock);

    const conSitemap = await extractSocialLinks(`<a href="https://linktr.ee/negocio/sitemap">mapa</a>`);
    expect(conSitemap).toEqual({});
    expect(fetchMock).not.toHaveBeenCalled();

    const falla = await extractSocialLinks(`<a href="https://beacons.ai/negocio">bio</a>`);
    expect(falla).toEqual({});
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("no hace crawl de bio-links cuando no hay agregadores en el HTML", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await extractSocialLinks(`<a href="https://instagram.com/directo">IG</a>`);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("📱 generateSocialDorks — fallback vs URLs encontradas", () => {
  it("usa las URLs encontradas cuando existen", () => {
    const dorks = generateSocialDorks("Negocio X", {
      instagram: "https://instagram.com/encontrado",
      youtube: "https://youtube.com/c/encontrado",
    });
    const ig = dorks.find((d) => d.platform === "Instagram Official");
    const yt = dorks.find((d) => d.platform === "YouTube Canal Oficial");
    expect(ig?.searchUrl).toBe("https://instagram.com/encontrado");
    expect(yt?.searchUrl).toBe("https://youtube.com/c/encontrado");
  });

  it("genera dork de búsqueda para las plataformas sin URL encontrada", () => {
    const dorks = generateSocialDorks("  Ca'n Pipa  ", {});
    const expected = encodeURIComponent("Ca'n Pipa");
    const tiktok = dorks.find((d) => d.platform === "TikTok Oficial");
    const linkedin = dorks.find((d) => d.platform === "LinkedIn Empresa");
    expect(tiktok?.searchUrl).toContain(`site:tiktok.com+${expected}+mallorca`);
    expect(linkedin?.searchUrl).toContain(`site:linkedin.com+${expected}+mallorca`);
    expect(dorks).toHaveLength(6);
  });
});
