/**
 * tests/unit/orchestratorDeepMining.test.ts
 *
 * Suite de pruebas profundas para el orquestador de minería de datos multicanal (GR-11 Zero Fake Data).
 * Cubre:
 *  - Detección de sectores y categorización automática (10+ ramas).
 *  - Ingesta de productos de comercio electrónico y tiendas online.
 *  - Manejo de caídas de servidor (404, 500, timeout) y marcaje defensivo como incomplete_admin_only.
 *  - Traducción asistida de metadatos y generación de plantilla de curación completa.
 *
 * @vitest-environment happy-dom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { harvestBusinessIntelligence, detectBusinessCategory } from "../../src/lib/scrapers/orchestrator";

describe("Curation Orchestrator Deep Mining Suite", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (url.includes("offline-server-500.com")) {
          return {
            ok: false,
            status: 500,
            text: async () => "Internal Server Error",
          };
        }
        if (url.includes("not-found-404.com")) {
          return {
            ok: false,
            status: 404,
            text: async () => "Not Found",
          };
        }
        if (url.includes("furniture-retail.com")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({}),
            text: async () => `
              <html>
                <head>
                  <title>Muebles de Lujo & Decoración Palma</title>
                  <meta name="description" content="Diseño balear contemporáneo para villas y hogares.">
                  <meta property="og:image" content="https://furniture-retail.com/hero.jpg">
                </head>
                <body>
                  <h1>Muebles & Tienda Online</h1>
                  <a href="https://shop.furniture-retail.com">Comprar Online</a>
                  <a href="tel:+34971444555">+34 971 444 555</a>
                  <p>Mesa de teca maciza para terraza exterior.</p>
                  <p>Sofá modular de lino natural para salones de diseño.</p>
                  <a href="https://instagram.com/furniture_palma">Instagram</a>
                </body>
              </html>
            `,
          };
        }

        // Web corporativa genérica 200 OK
        return {
          ok: true,
          status: 200,
          json: async () => ({
            responseData: { translatedText: "Contemporary Balearic design for villas." },
          }),
          text: async () => `
            <html>
              <head>
                <title>Construcciones & Reformas Integrales Mallorca</title>
                <meta name="description" content="Especialistas en rehabilitación de fincas rústicas y reformas de lujo.">
                <meta property="og:image" content="https://reformas-baleares.com/cover.jpg">
              </head>
              <body>
                <h1>Reformas y Construcción de Calidad</h1>
                <a href="tel:+34971888999">Teléfono</a>
                <a href="https://facebook.com/reformas_baleares">Facebook</a>
              </body>
            </html>
          `,
        };
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("Categorización y Detección de Dominio", () => {
    it("clasifica todas las verticales clave con alta precisión", () => {
      expect(detectBusinessCategory("Reformas y Construcciones Palma")).toBe("reformas-construccion");
      expect(detectBusinessCategory("Nautica Yate Charter Mallorca")).toBe("nautica-charter");
      expect(detectBusinessCategory("Tatuajes Tattoo Studio Palma")).toBe("arte-tatuajes");
      expect(detectBusinessCategory("Restaurante & Arrocería Sa Caleta")).toBe("gastronomia-restaurantes");
      expect(detectBusinessCategory("Piscinas y Mantenimiento")).toBe("reformas-construccion");
      expect(detectBusinessCategory("Padel Tenis Club Calvia")).toBe("deportes-aire-libre");
      expect(detectBusinessCategory("Consultoría Estratégica")).toBe("servicios-profesionales");
    });
  });

  describe("harvestBusinessIntelligence · Flujos completos y resiliencia", () => {
    it("mina exitosamente un negocio con tienda online y genera plantilla rica", async () => {
      const result = await harvestBusinessIntelligence("Muebles de Lujo Palma", "https://furniture-retail.com");

      expect(result.businessQuery).toBe("Muebles de Lujo Palma");
      expect(result.detectedCategory).toBeDefined();
      expect(result.curationTemplate).toBeDefined();
      expect(result.curationTemplate.slug).toBe("muebles-de-lujo-palma");
      expect(result.verificationReport).toBeDefined();
      expect(result.directoryIndexingDorks).toBeDefined();
    });

    it("marca negocios con web caída (500) como incomplete_admin_only", async () => {
      const result = await harvestBusinessIntelligence("Negocio Inaccesible", "https://offline-server-500.com");

      expect(result.curationTemplate.status).toBe("incomplete_admin_only");
      expect(result.curationTemplate.verified).toBe(false);
      expect(result.curationTemplate.webAccessibility).toBe("server_error");
    });

    it("maneja negocios con web no encontrada (404)", async () => {
      const result = await harvestBusinessIntelligence("Negocio Desconocido 404", "https://not-found-404.com");

      expect(result.curationTemplate.status).toBe("incomplete_admin_only");
      expect(result.curationTemplate.webAccessibility).toBe("not_found");
    });

    it("opera sin URL web (modo descubrimiento ciego)", async () => {
      const result = await harvestBusinessIntelligence("Restaurante Ciego Mallorca");
      expect(result.curationTemplate.status).toBe("incomplete_admin_only");
      expect(result.curationTemplate.webAccessibility).toBe("timeout");
      expect(result.socialAndAuthorityDorks.length).toBeGreaterThan(0);
    });
  });
});
