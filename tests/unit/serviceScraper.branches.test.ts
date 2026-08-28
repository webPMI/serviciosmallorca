/**
 * serviceScraper.branches.test.ts
 *
 * 🛰️ COBERTURA DE RAMAS DEL SCRAPER DE SERVICIOS (GR-11 / GR-12 — minería verificada)
 *
 * src/lib/scrapers/serviceScraper.ts estaba al 6.66% de branches (la peor del repo).
 * Se verifica:
 *  1. Defaults de pagos (credit_card/cash) y comodidades (wifi/AC) + detecciones extra.
 *  2. Shopify: onlineStore /collections/all + mapeo de products.json (precio, stock,
 *     categoría, imágenes) con límite de 6 y fallbacks ("Consultar", "Catálogo Oficial").
 *  3. Shopify: fetch no-ok, products no-array y rechazo de red → products [] sin crash.
 *  4. WooCommerce con supresión por assets estáticos; PrestaShop; tienda "custom" con
 *     supresión por WordPress; ausencia de tienda → undefined.
 *  5. Dorks de directorios (4) y prensa balear (6) con query URL-encoded y trim.
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import { scrapeServiceData } from "../../src/lib/scrapers/serviceScraper.ts";

const BASE = new URL("https://negocio-mallorca.com");

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("🛰️ scrapeServiceData — métodos de pago y comodidades", () => {
  it("defaults sin señales en el HTML", async () => {
    const r = await scrapeServiceData("<html><body>Hola</body></html>", BASE, "Negocio");
    expect(r.paymentMethods).toEqual(["credit_card", "cash"]);
    expect(r.amenities).toEqual(["wifi", "air_conditioning"]);
    expect(r.onlineStore).toBeUndefined();
    expect(r.products).toEqual([]);
  });

  it("detecta Bizum, Apple Pay (dos grafías) y crypto/bitcoin", async () => {
    const r = await scrapeServiceData("<div>Aceptamos Bizum, Apple Pay y bitcoin</div>", BASE, "N");
    expect(r.paymentMethods).toEqual(["credit_card", "cash", "bizum", "apple_pay", "crypto"]);
  });

  it("detecta comodidades: aparcamiento, accesibilidad y mascotas", async () => {
    const r = await scrapeServiceData("<p>Parking gratis, acceso wheelchair y pet friendly</p>", BASE, "N");
    expect(r.amenities).toEqual([
      "wifi",
      "air_conditioning",
      "parking_nearby",
      "wheelchair_accessible",
      "pet_friendly",
    ]);
  });
});

describe("🛰️ scrapeServiceData — rama Shopify", () => {
  it("mapea products.json (máx 6) con precio, stock, categoría e imágenes", async () => {
    const apiResponse = {
      products: [
        {
          id: 1,
          title: "Tabla SUP",
          handle: "tabla-sup",
          product_type: "Nautica",
          variants: [{ price: "129.5", available: false }],
          images: [{ src: "https://cdn.shopify.com/1.png" }],
        },
        { id: 2, title: "Neopreno", handle: "neopreno", variants: [] },
        { id: 3, title: "Extra 1", handle: "e1" },
        { id: 4, title: "Extra 2", handle: "e2" },
        { id: 5, title: "Extra 3", handle: "e3" },
        { id: 6, title: "Extra 4", handle: "e4" },
        { id: 7, title: "Fuera de límite", handle: "e5" },
      ],
    };
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(apiResponse), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const r = await scrapeServiceData("<html>Powered by Shopify</html>", BASE, "Nautica");

    expect(r.onlineStore).toEqual({
      hasOnlineStore: true,
      platform: "shopify",
      url: "https://negocio-mallorca.com/collections/all",
    });
    expect(r.products).toHaveLength(6); // el séptimo se descarta
    expect(r.products[0]).toEqual({
      id: "prod-1",
      name: { es: "Tabla SUP", en: "Tabla SUP", ca: "Tabla SUP", de: "Tabla SUP" },
      price: "129.50€",
      imageUrl: "https://cdn.shopify.com/1.png",
      url: "https://negocio-mallorca.com/products/tabla-sup",
      category: "Nautica",
      inStock: false,
    });
    expect(r.products[1].price).toBe("Consultar"); // sin variants → sin precio
    expect(r.products[1].inStock).toBe(true); // default disponible
    expect(r.products[1].category).toBe("Catálogo Oficial");
    expect(fetchMock.mock.calls[0][0]).toBe("https://negocio-mallorca.com/products.json?limit=6");
  });

  it("Shopify: fetch no-ok, products no-array o red caída → products [] sin crash", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 500 })));
    const noOk = await scrapeServiceData("<html>Shopify theme</html>", BASE, "N");
    expect(noOk.onlineStore?.platform).toBe("shopify");
    expect(noOk.products).toEqual([]);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ products: "no-soy-array" }), { status: 200 })),
    );
    const noArray = await scrapeServiceData("<html>Shopify</html>", BASE, "N");
    expect(noArray.products).toEqual([]);

    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
    const rechazo = await scrapeServiceData("<html>cdn.shopify.com asset</html>", BASE, "N");
    expect(rechazo.onlineStore?.platform).toBe("shopify");
    expect(rechazo.products).toEqual([]);
  });

  it("WooCommerce: detecta tienda; se suprime si solo hay assets estáticos (.min.css)", async () => {
    const aceptada = await scrapeServiceData("<html>La mejor tienda woocommerce de la isla</html>", BASE, "N");
    expect(aceptada.onlineStore).toEqual({
      hasOnlineStore: true,
      platform: "woocommerce",
      url: "https://negocio-mallorca.com/shop",
    });

    const suprimida = await scrapeServiceData("<html>woocommerce<link href='/tienda.min.css'></html>", BASE, "N");
    expect(suprimida.onlineStore).toBeUndefined();
  });

  it("PrestaShop → /tienda; WordPress suprime la tienda custom; sin señales → undefined", async () => {
    const presta = await scrapeServiceData("<html>Tienda prestashop oficial</html>", BASE, "N");
    expect(presta.onlineStore).toEqual({
      hasOnlineStore: true,
      platform: "prestashop",
      url: "https://negocio-mallorca.com/tienda",
    });

    const wpSuprimida = await scrapeServiceData("<html>/shop/ /wp-content/themes/x</html>", BASE, "N");
    expect(wpSuprimida.onlineStore).toBeUndefined();

    const custom = await scrapeServiceData("<html>Visita nuestra /productos online</html>", BASE, "N");
    expect(custom.onlineStore).toEqual({
      hasOnlineStore: true,
      platform: "custom",
      url: "https://negocio-mallorca.com/shop",
    });

    const ninguna = await scrapeServiceData("<html>solo información de contacto</html>", BASE, "N");
    expect(ninguna.onlineStore).toBeUndefined();
  });

  it("genera 4 dorks de directorios y 6 de prensa balear con query URL-encoded y trim", async () => {
    const r = await scrapeServiceData("<html></html>", BASE, "  Escuela de Vela & SUP  ");
    expect(r.generalDirectoryDorks).toHaveLength(4);
    expect(r.pressDorks).toHaveLength(6);

    const expected = encodeURIComponent("Escuela de Vela & SUP");
    expect(r.generalDirectoryDorks[0].directoryName).toBe("Páginas Amarillas Baleares");
    expect(r.generalDirectoryDorks[0].searchUrl).toContain(`site:paginasamarillas.es+${expected}+mallorca`);
    expect(r.pressDorks.some((d) => d.mediaName.includes("Majorca Daily Bulletin") && d.language === "en")).toBe(true);
    expect(r.pressDorks.some((d) => d.language === "ca")).toBe(true);
    expect(r.pressDorks.some((d) => d.language === "de")).toBe(true);
  });
});
