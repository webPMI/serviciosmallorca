/**
 * restaurantScraper.branches.test.ts
 *
 * 🍽️ COBERTURA DE RAMAS DEL SCRAPER DE RESTAURACIÓN (GR-11 minería verificada)
 *
 * tests/unit/scrapers.test.ts cubría el camino feliz. Esta suite ataca:
 *  1. Exclusiones anti-falso-positivo del menú: wp-content, .min.css/.js, /tags/, /category/,
 *     ?ver=, /feed/, /comments/, /images/, /css/, /js/.
 *  2. HTML con slashes escapados (JSON embebido) normalizado antes del parseo.
 *  3. Resolución relativa vs absoluta de URLs de carta.
 *  4. Límite de 5 especialidades (orden del catálogo interno) y variantes ca ("degustacio").
 *  5. Dorks gastronómicos (Michelin/Repsol/TheFork/TripAdvisor/ABC) con query encoded.
 */

import { describe, it, expect } from "vitest";
import { scrapeRestaurantData } from "../../src/lib/scrapers/restaurantScraper.ts";

const BASE = new URL("https://restaurante-mallorca.com");

describe("🍽️ scrapeRestaurantData — detección de carta con exclusiones", () => {
  it("salta falsos positivos (wp-content, .min.js, ?ver=, /category/, /images/) y elige la carta real", () => {
    const html = `
      <a href="/wp-content/plugins/menu/menu.pdf">plugin</a>
      <a href="/assets/menu.min.js">script</a>
      <a href="/category/menu">category</a>
      <a href="/tags/menu">tags</a>
      <a href="/feed/menu">feed</a>
      <a href="/images/menu.png">imagen</a>
      <a href="/menu?ver=5">ver</a>
      <a href="/carta">Nuestra Carta</a>
    `;
    const r = scrapeRestaurantData(html, BASE, "Restaurante Prova");
    expect(r.menuUrl).toBe("https://restaurante-mallorca.com/carta");
  });

  it("prioriza .pdf con menu/carta pero excluye rutas /css/ y /js/", () => {
    const html = `
      <link href="/css/menu.css">
      <script src="/js/menu.js"></script>
      <a href="/docs/carta-2026.pdf">Carta PDF</a>
    `;
    const r = scrapeRestaurantData(html, BASE, "Restaurante Prova");
    expect(r.menuUrl).toBe("https://restaurante-mallorca.com/docs/carta-2026.pdf");
  });

  it("normaliza slashes escapados de JSON embebido (https:\\/\\/...)", () => {
    const html = `<script>var x = "https:\\/\\/restaurante-mallorca.com\\/menu-digital";</script>`;
    const r = scrapeRestaurantData(html, BASE, "Restaurante Prova");
    expect(r.menuUrl).toBe("https://restaurante-mallorca.com/menu-digital");
  });

  it("resuelve URLs relativas contra el baseUrl y acepta /food y /speisekarte", () => {
    const r = scrapeRestaurantData(`<a href="/food">Food</a>`, new URL("https://bistro.example.com/es/"), "Bistro");
    expect(r.menuUrl).toBe("https://bistro.example.com/food");

    const r2 = scrapeRestaurantData(`<a href="/speisekarte">Speisekarte</a>`, BASE, "Bistro");
    expect(r2.menuUrl).toBe("https://restaurante-mallorca.com/speisekarte");
  });

  it("sin candidatas válidas → menuUrl undefined", () => {
    const r = scrapeRestaurantData("<html><p>Solo texto y <a href='/contacto'>contacto</a></p></html>", BASE, "X");
    expect(r.menuUrl).toBeUndefined();
  });
});

describe("🍽️ scrapeRestaurantData — especialidades culinarias", () => {
  it("límite de 5 especialidades respetando el orden del catálogo interno", () => {
    const html = `
      <p>pescado del día, pescado de lonja, marisco fresco, arroz meloso, paella mallorquina,
      tapas, menú degustación, porc negre y gamba roja</p>
    `;
    const r = scrapeRestaurantData(html, BASE, "Restaurante Prova");
    expect(r.specialties).toHaveLength(5);
    expect(r.specialties).toEqual([
      "Pescado Fresco del Día",
      "Pescado de Lonja Balear",
      "Marisco Fresco",
      "Arroces y Paellas Tradicionales",
      "Paella Mallorquina",
    ]);
  });

  it("reconoce variante catalana sin acento (degustacio) y keywords en minúscula", () => {
    const r = scrapeRestaurantData("<p>MENÚ DEGUSTACIO y cocktails de autor</p>", BASE, "Bistro Prova");
    expect(r.specialties).toContain("Menú Degustació");
    expect(r.specialties).toContain("Cocktails de Autor");
  });

  it("sin matches → specialties vacío", () => {
    expect(scrapeRestaurantData("<p>solo pizza congelada</p>", BASE, "X").specialties).toEqual([]);
  });
});

describe("🍽️ scrapeRestaurantData — dorks gastronómicos", () => {
  it("5 dorks (Michelin, Repsol, TheFork, TripAdvisor, ABC) con query encoded y trim", () => {
    const r = scrapeRestaurantData("<html></html>", BASE, "  Ca Na Margalida & Sons  ");
    expect(r.gastronomyDorks).toHaveLength(5);
    const expected = encodeURIComponent("Ca Na Margalida & Sons");
    expect(r.gastronomyDorks[0].directoryName).toContain("Michelin");
    expect(r.gastronomyDorks[0].searchUrl).toContain(`site:guide.michelin.com+${expected}+mallorca`);
    expect(r.gastronomyDorks.some((d) => d.directoryName.includes("Repsol"))).toBe(true);
    expect(r.gastronomyDorks.some((d) => d.directoryName.includes("TheFork"))).toBe(true);
    expect(r.gastronomyDorks.some((d) => d.directoryName.includes("TripAdvisor"))).toBe(true);
    expect(r.gastronomyDorks.some((d) => d.searchUrl.includes("site:abc-mallorca.com"))).toBe(true);
  });
});
