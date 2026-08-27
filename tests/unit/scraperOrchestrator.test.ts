/**
 * Tests para src/lib/scrapers/orchestrator.ts + ramas oscuras de baseScraper.ts
 *
 * Pipeline de Curación (SOP v2.0) con red mockeada vía fetch global:
 *   - formateo telefónico español (+34 / 0034 / nacional / passthrough)
 *   - fetchHtmlWithTimeout: éxito, fallo de red y normalización de dominios sin protocolo
 *   - extracción avanzada: direcciones validadas por Mallorca, coordenadas en rango,
 *     ratings/reviews desde JSON-LD, galería filtrada por calidad
 *   - detectBusinessCategory con señales fuertes de HTML (meta/h1/h2/canonical)
 *   - harvestBusinessIntelligence end-to-end sin depender de internet
 */
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import {
  formatSpanishPhone,
  fetchHtmlWithTimeout,
  extractBaseMetadata,
  generateMapUrls,
  translateToEnglish,
} from "../../src/lib/scrapers/baseScraper";
import { detectBusinessCategory, harvestBusinessIntelligence } from "../../src/lib/scrapers/orchestrator";

const BASE_URL = new URL("https://negocio-ejemplo.com");

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("formatSpanishPhone · normalización telefónica", () => {
  it.each([
    [undefined, ""],
    ["", ""],
    ["971 67 77 70", "+34 971 677 770"], // 9 dígitos fijo
    ["600123456", "+34 600 123 456"], // 9 dígitos móvil
    ["0034971677770", "+34 971 677 770"], // prefijo internacional 0034
    ["+34 600 12 34 56", "+34 600 123 456"], // ya internacional con espacios
    ["12345", "12345"], // demasiado corto → passthrough
  ])("%j → %j", (input, expected) => {
    expect(formatSpanishPhone(input as string | undefined)).toBe(expected);
  });

  // Hallazgo ronda 2 (ver STRESS_TEST_PLAN §5.4): longitud ≠ 9 se trunca silenciosamente,
  // descartando dígitos sobrantes (determinista, pero conviene revisarlo para no-ES).
  it("normaliza números de 10 dígitos usando los primeros 9 (dígito extra descartado)", () => {
    expect(formatSpanishPhone("9711234567")).toBe("+34 971 123 456");
  });
});

describe("fetchHtmlWithTimeout · capa HTTP", () => {
  it("descarga y devuelve html + status + baseUrl en éxito", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("<html>OK</html>", { status: 200 })),
    );
    const result = await fetchHtmlWithTimeout("https://ok-site.com/menu");
    expect(result.httpStatus).toBe(200);
    expect(result.html).toContain("OK");
    expect(result.baseUrl.href).toBe("https://ok-site.com/menu");
  });

  it("normaliza dominios sin protocolo hacia https://", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("", { status: 200 })),
    );
    const result = await fetchHtmlWithTimeout("negociopalma.com");
    expect(result.baseUrl.protocol).toBe("https:");
    expect(result.baseUrl.hostname).toBe("negociopalma.com");
  });

  it("degrada a httpStatus 500 con html vacío si la red falla", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Promise.reject(new Error("ECONNREFUSED"))),
    );
    const result = await fetchHtmlWithTimeout("https://caido.com");
    expect(result.httpStatus).toBe(500);
    expect(result.html).toBe("");
  });
});

describe("extractBaseMetadata · extracción avanzada", () => {
  const latLngHtml = `<div>{"latitude": 39.57, "longitude": 2.65}</div>`;

  it("extrae coordenadas válidas dentro del rango de Mallorca", () => {
    const r = extractBaseMetadata(latLngHtml, BASE_URL, 200);
    expect(r.extractedCoordinates).toEqual({ lat: 39.57, lng: 2.65 });
  });

  it("rechaza coordenadas fuera del rectángulo balear", () => {
    const r = extractBaseMetadata(`<div>{"latitude": 48.85, "longitude": 2.35}</div>`, BASE_URL, 200);
    expect(r.extractedCoordinates).toBeUndefined(); // París ≠ Mallorca
  });

  it("lee rating y reviewCount del JSON-LD en una sola línea", () => {
    const jsonLd = `"aggregateRating":{"@type":"AggregateRating","ratingValue":4.7,"reviewCount":212}`;
    const r = extractBaseMetadata(jsonLd, BASE_URL, 200);
    expect(r.extractedRating).toBe(4.7);
    expect(r.extractedReviewCount).toBe(212);
  });

  it("valida la dirección contra contexto mallorquín (Palma/CP 5 dígitos)", () => {
    const valid = extractBaseMetadata(`<address>Carrer de Sant Miquel 21, 07002 Palma</address>`, BASE_URL, 200);
    expect(valid.extractedAddress).toBe("Carrer de Sant Miquel 21, 07002 Palma");

    const invalid = extractBaseMetadata(`<address>Carrer de la Lluna numero ocho</address>`, BASE_URL, 200);
    expect(invalid.extractedAddress).toBeUndefined();
  });

  it("resuelve og:image relativa y hace fallback a twitter:image", () => {
    const relOg = extractBaseMetadata(`<meta property="og:image" content="/img/portada.jpg">`, BASE_URL, 200);
    expect(relOg.ogImage).toBe("https://negocio-ejemplo.com/img/portada.jpg");

    const twFallback = extractBaseMetadata(
      `<meta name="twitter:image" content="https://cdn.ejemplo.com/tw.jpg">`,
      BASE_URL,
      200,
    );
    expect(twFallback.ogImage).toBe("https://cdn.ejemplo.com/tw.jpg");
  });

  it("galería: filtra svg/logos/thumbs, absolutiza relativas y limita a 8", () => {
    const imgs = Array.from({ length: 12 }, (_, i) => `<img src="/galeria/foto${i}.jpg">`).join("");
    const html = `
      <img src="logo.svg">
      <img src="data:image/png;base64,AAAA">
      <img src="/img/icon-thumb.png">
      ${imgs}
    `;
    const r = extractBaseMetadata(html, BASE_URL, 200);
    expect(r.galleryImages.length).toBeLessThanOrEqual(8);
    expect(r.galleryImages[0]).toBe("https://negocio-ejemplo.com/galeria/foto0.jpg");
    expect(r.galleryImages.every((src) => !src.includes("logo"))).toBe(true);
  });

  it("html vacío devuelve un esqueleto seguro sin lanzar", () => {
    const r = extractBaseMetadata("", BASE_URL, 500);
    expect(r.html).toBe("");
    expect(r.galleryImages).toEqual([]);
    expect(r.metaDescription).toBeUndefined();
    expect(r.httpStatus).toBe(500);
  });
});

describe("translateToEnglish · diccionario asistido", () => {
  it("traduce términos del diccionario y hace passthrough en desconocidos", () => {
    expect(translateToEnglish("")).toBe("");
    expect(translateToEnglish("fontanería urgente").toLowerCase()).toContain("plumbing");
    expect(translateToEnglish("palabraquenoexistediccionario")).toBe("palabraquenoexistediccionario");
  });
});

describe("detectBusinessCategory · señales fuertes y prioridades", () => {
  it("meta description del HTML detecta construcción aunque el nombre sea genérico", () => {
    const html = `<head><meta name="description" content="Reformas integrales de baños y pavimentos"></head>`;
    expect(detectBusinessCategory("Servicios Integrales", html)).toBe("reformas-construccion");
  });

  it("el H2 del documento activa detección náutica", () => {
    expect(detectBusinessCategory("Marina BN", "<h2>Yates y barcos de lujo</h2>")).toBe("nautica-charter");
  });

  it("la URL canónica del dominio influye (charter en hostname)", () => {
    const html = `<link rel="canonical" href="https://charters-mallorca.com/">`;
    expect(detectBusinessCategory("Empresa XYZ", html)).toBe("nautica-charter");
  });

  it("prioridad: construcción gana a gastronomía cuando conviven ambas señales", () => {
    expect(detectBusinessCategory("Bar La Viga materiales de construccion")).toBe("reformas-construccion");
  });

  it("deportes al aire libre y fallback por defecto", () => {
    expect(detectBusinessCategory("Padel Club Santa Ponça")).toBe("deportes-aire-libre");
    expect(detectBusinessCategory("Gimnasio Central Fit")).toBe("deportes-aire-libre");
    expect(detectBusinessCategory("Consultorio Aleatorio XYZ")).toBe("servicios-profesionales");
  });

  it("ESTRES: 300 consultas sintéticas clasificadas sin errores ni falsos positivos", () => {
    const noiseWords = ["grupo", "s.l.", "premium", "2026", "center"];
    let checked = 0;
    for (let i = 0; i < 100; i++) {
      const n = noiseWords[i % noiseWords.length];
      const cases: Array<[string, string]> = [
        [`Tattoo Ink Studio ${n} ${i}`, "arte-tatuajes"],
        [`Restaurante Chef ${n} ${i}`, "gastronomia-restaurantes"],
        [`Catamaran Charter ${n} ${i}`, "nautica-charter"],
        [`Spa Masaje ${n} ${i}`, "salud-bienestar"],
      ];
      for (const [query, expected] of cases) {
        expect(detectBusinessCategory(query)).toBe(expected);
        checked++;
      }
    }
    expect(checked).toBe(400);
  });
});

describe("harvestBusinessIntelligence · pipeline end-to-end (red simulada)", () => {
  beforeEach(() => {
    const scrapingTargetHtml = `
      <html>
        <head>
          <title>Ink Masters — Tattoo Studio Palma</title>
          <meta name="description" content="Estudio de tatuajes fine line en Palma de Mallorca.">
          "aggregateRating":{"@type":"AggregateRating","ratingValue":4.9,"reviewCount":87}
        </head>
        <body>
          <a href="tel:+34600123456">Llama</a>
          <a href="mailto:hola@inkmasters.example.com">Email</a>
          <a href="https://instagram.com/inkmasters">IG</a>
          <img src="https://cdn.example.com/tattoo1.jpg">
        </body>
      </html>
    `;
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(scrapingTargetHtml, { status: 200 })),
    );
  });

  it("con web activa coordina base + sociales + especialista + verificación", async () => {
    const r = await harvestBusinessIntelligence("Ink Masters Tattoo Palma", "https://inkmasters.example.com");

    // Núcleo
    expect(r.businessQuery).toBe("Ink Masters Tattoo Palma");
    expect(r.websiteProvided).toBe("https://inkmasters.example.com");
    expect(r.detectedCategory).toBe("arte-tatuajes");
    expect(new Date(r.extractionTimestamp).getTime()).not.toBeNaN();

    // Media extraída del HTML servido
    expect(r.extractedMedia.galleryImages.length).toBeGreaterThanOrEqual(1);
    expect(r.extractedMedia.galleryImages[0]).toContain("tattoo1.jpg");

    // Redes sociales detectadas desde el body
    expect(r.detectedSocialLinks.instagram).toBe("https://instagram.com/inkmasters");

    // Presencia multi-mapa generada (GR-12)
    expect(r.mapsPresence.googleMapsSearchUrl).toContain("Ink%20Masters");
    expect(r.mapsPresence.appleMapsSearchUrl).toContain("Mallorca"); // sufijo añadido

    // Dorks editoriales estructurados para el Hub de curación
    expect(Array.isArray(r.directoryIndexingDorks)).toBe(true);
    expect(Array.isArray(r.balearicPressDorks)).toBe(true);
    expect(r.balearicPressDorks.every((d) => typeof d.mediaName === "string")).toBe(true);

    // Auditoría GR-11 integrada
    expect(r.verificationReport).toBeTruthy();

    // Plantilla de curación lista para el curador humano
    expect(r.curationTemplate.slug).toBe("ink-masters-tattoo-palma");
    expect(r.curationTemplate.category).toBe("arte-tatuajes");
    expect(typeof r.curationTemplate.verified).toBe("boolean");
    expect(["open", "incomplete_admin_only"]).toContain(r.curationTemplate.status);
  });

  it("sin website no lanza y produce plantilla con categoría inferida del nombre", async () => {
    const r = await harvestBusinessIntelligence("Restaurante Es Curador Test");
    expect(r.websiteProvided).toBeUndefined();
    expect(r.detectedCategory).toBe("gastronomia-restaurantes");
    expect(r.extractedMedia.galleryImages).toEqual([]);
    expect(r.curationTemplate.name).toBe("Restaurante Es Curador Test");
    expect(r.curationTemplate.priceRange).toBe("€€€"); // especialización gastronómica
  });

  it("generateMapUrls produce URLs multi-mapa consistentes con el sufijo Mallorca", () => {
    const urls = generateMapUrls("Kuyen Art Tattoo");
    expect(urls.googleMapsUrl).toContain("google.com/maps");
    expect(urls.appleMapsUrl).toContain("maps.apple.com");
    expect(urls.bingMapsUrl).toContain("bing.com/maps");
  });
});
