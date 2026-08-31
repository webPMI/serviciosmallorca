/**
 * tests/unit/scrapersAndEnginesCoverage.test.ts
 *
 * Suite de alta precisión para maximizar la cobertura en motores auxiliares:
 * - displacementNotificationEngine (alertas de rivalidad comercial)
 * - baseScraper (traducción multilingüe asistida, generación de URLs de mapas y parsing HTML)
 * - jsonLdGenerator (estructuras de datos Schema.org y fallbacks)
 * - scheduleParser (horarios multilingües, turnos partidos y 24h)
 *
 * @vitest-environment happy-dom
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  createDisplacementAlert,
  getActiveDisplacementAlerts,
  markDisplacementAlertAsRead,
} from "../../src/lib/displacementNotificationEngine";
import {
  translateToEnglish,
  translateToCatalan,
  generateMapUrls,
  extractBaseMetadata,
} from "../../src/lib/scrapers/baseScraper";
import { getLiveBusinessStatus } from "../../src/lib/scheduleParser";
import { generateServiceJsonLd } from "../../src/lib/jsonLdGenerator";
import type { ServiceItem } from "../../src/data/services/types";

describe("Scrapers & Engine Helpers Full Coverage Suite", () => {
  describe("src/lib/displacementNotificationEngine.ts", () => {
    const memoryStorage = new Map<string, string>();
    const storageMock = {
      getItem: (key: string) => memoryStorage.get(key) || null,
      setItem: (key: string, val: string) => memoryStorage.set(key, String(val)),
      removeItem: (key: string) => memoryStorage.delete(key),
      clear: () => memoryStorage.clear(),
    };

    beforeEach(() => {
      memoryStorage.clear();
      vi.stubGlobal("localStorage", storageMock);
    });

    it("crea alertas con cálculo de contra-oferta +1€ y URL de recuperación", () => {
      const alertEs = createDisplacementAlert({
        category: "nautica-charter",
        categoryTitle: "Náutica y Yates",
        displacedServiceId: "charter-a",
        displacedServiceName: "Charter Alpha",
        displacedContactEmail: "info@alpha.com",
        newLeaderServiceId: "charter-b",
        newLeaderServiceName: "Charter Beta",
        newLeaderBidEuros: 25.5,
      });

      expect(alertEs.counterBidPriceEuros).toBe(26.5);
      expect(alertEs.oneClickReclaimUrl).toContain("/es/cuadro-de-honor");
      expect(alertEs.oneClickReclaimUrl).toContain("minBid=26.5");

      const alertDe = createDisplacementAlert({
        category: "arte-tatuajes",
        categoryTitle: "Tattoos",
        displacedServiceId: "tat-1",
        displacedServiceName: "Tat Studio",
        newLeaderServiceId: "tat-2",
        newLeaderServiceName: "Tat Two",
        newLeaderBidEuros: 10,
        locale: "de",
      });
      expect(alertDe.oneClickReclaimUrl).toContain("/de/cuadro-de-honor");
    });

    it("persiste alertas en localStorage y permite filtrado y marcado como leído", () => {
      const a1 = createDisplacementAlert({
        category: "gastronomia-catering",
        categoryTitle: "Gastro",
        displacedServiceId: "rest-1",
        displacedServiceName: "Rest 1",
        newLeaderServiceId: "rest-2",
        newLeaderServiceName: "Rest 2",
        newLeaderBidEuros: 15,
      });

      createDisplacementAlert({
        category: "spas-bienestar",
        categoryTitle: "Spa",
        displacedServiceId: "spa-1",
        displacedServiceName: "Spa 1",
        newLeaderServiceId: "spa-2",
        newLeaderServiceName: "Spa 2",
        newLeaderBidEuros: 30,
      });

      const all = getActiveDisplacementAlerts();
      expect(all.length).toBe(2);

      const filtered = getActiveDisplacementAlerts("rest-1");
      expect(filtered.length).toBe(1);
      expect(filtered[0].displacedServiceId).toBe("rest-1");

      markDisplacementAlertAsRead(a1.id);
      const updated = getActiveDisplacementAlerts("rest-1");
      expect(updated[0].read).toBe(true);

      // Marcar una alerta inexistente no debe romper
      expect(() => markDisplacementAlertAsRead("non-existent-alert-999")).not.toThrow();
    });
  });

  describe("src/lib/scrapers/baseScraper.ts", () => {
    it("traduce términos comunes de servicios a inglés con diccionario asistido", () => {
      expect(translateToEnglish("")).toBe("");
      const text = "Fontanería urgente 24 horas y reparación de fugas de agua sin compromiso.";
      const translated = translateToEnglish(text);
      expect(translated).toContain("emergency plumbing");
      expect(translated).toContain("24 hours");
      expect(translated).toContain("leak repair");
      expect(translated).toContain("no obligation");
    });

    it("traduce términos comunes de servicios a catalán con diccionario asistido", () => {
      expect(translateToCatalan("")).toBe("");
      const text = "Fontanería urgente, reparación de fugas y mantenimiento con presupuesto sin compromiso.";
      const translated = translateToCatalan(text);
      expect(translated).toContain("fontaneria urgent");
      expect(translated).toContain("reparació de fuites");
      expect(translated).toContain("manteniment");
      expect(translated).toContain("pressupost");
      expect(translated).toContain("sense compromís");
    });

    it("genera URLs de multi-mapas con sufijo inteligente de Mallorca", () => {
      const urls1 = generateMapUrls("Celler Sa Premsa");
      expect(urls1.googleMapsUrl).toContain("Celler%20Sa%20Premsa%20Mallorca");
      expect(urls1.appleMapsUrl).toContain("Celler%20Sa%20Premsa%20Mallorca");
      expect(urls1.openStreetMapUrl).toContain("Celler%20Sa%20Premsa%20Mallorca");

      const urls2 = generateMapUrls("Tattoo Mallorca Studio");
      expect(urls2.googleMapsUrl).not.toContain("Mallorca%20Mallorca");
    });

    it("parsea HTML extrayendo metadatos, teléfonos, emails, coordenadas e imágenes válidas", () => {
      const sampleHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="description" content="Excelente restaurante tradicional en Palma.">
            <meta property="og:image" content="https://example.com/hero.jpg">
            <link rel="icon" href="/favicon.ico">
          </head>
          <body>
            <h1>Restaurante Bon Profit</h1>
            <p>Contacto: info@bonprofit.es o llámanos al +34 971 12 34 56</p>
            <address>Carrer Major 10, 07001 Palma de Mallorca</address>
            <div data-lat="39.5696" data-lng="2.6502"></div>
            <img src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80" alt="Interior">
            <img src="data:image/png;base64,12345" alt="Ignored Base64">
            <img src="https://example.com/logo-small.svg" alt="Ignored SVG">
            <img src="https://example.com/icon.png" alt="Ignored Icon">
          </body>
        </html>
      `;

      const result = extractBaseMetadata(sampleHtml, new URL("https://example.com"), 200);
      expect(result.httpStatus).toBe(200);
      expect(result.metaDescription).toBe("Excelente restaurante tradicional en Palma.");
      expect(result.extractedEmail).toBe("info@bonprofit.es");
      expect(result.ogImage).toBe("https://example.com/hero.jpg");
      expect(result.favicon).toBe("https://example.com/favicon.ico");
      expect(result.extractedAddress).toContain("Palma");

      const emptyRes = extractBaseMetadata("", new URL("https://example.com"), 404);
      expect(emptyRes.galleryImages).toEqual([]);
    });
  });

  describe("src/lib/scheduleParser.ts", () => {
    it("evalúa estado en vivo de negocio (abierto, cerrado, estacional, permanente, sin horario)", () => {
      // 1. Permanently closed
      const closed = getLiveBusinessStatus("L-V 09:00-18:00", "permanently_closed");
      expect(closed.isOpen).toBe(false);
      expect(closed.statusClass).toBe("closed");

      // 2. Seasonal closure
      const seasonal = getLiveBusinessStatus("L-V 09:00-18:00", "seasonal_closure");
      expect(seasonal.isOpen).toBe(false);
      expect(seasonal.statusClass).toBe("seasonal");

      // 3. Sin horario
      const noSched = getLiveBusinessStatus("", "open");
      expect(noSched.statusClass).toBe("closed");
      expect(noSched.statusText).toBe("Consultar Horario");

      // 4. Abierto 24h
      const sched24 = getLiveBusinessStatus("Abierto 24 horas", "open");
      expect(sched24.isOpen).toBe(true);
      expect(sched24.statusClass).toBe("open");

      // 5. Horario estándar en miércoles a las 11:00 (abierto)
      const wednesdayMorning = new Date("2026-09-02T09:00:00.000Z"); // Miércoles 11:00 CEST (UTC+2)
      const resWed = getLiveBusinessStatus("Lunes a Viernes 09:00 - 18:00", "open", wednesdayMorning, "es");
      expect(resWed.isOpen).toBe(true);
      expect(resWed.statusClass).toBe("open");

      // 6. Horario estándar en domingo cerrado
      const sundayNoon = new Date("2026-09-06T10:00:00.000Z"); // Domingo
      const resSun = getLiveBusinessStatus("Lunes a Viernes 09:00 - 18:00, Domingo cerrado", "open", sundayNoon, "es");
      expect(resSun.isOpen).toBe(false);
      expect(resSun.statusClass).toBe("closed");
      expect(resSun.nextOpening?.type).toBe("monday");
    });
  });

  describe("src/lib/jsonLdGenerator.ts", () => {
    it("genera JSON-LD estructurado para negocios con todos los campos opcionales y especialidades", () => {
      const mockBusiness: ServiceItem = {
        id: "b1",
        slug: "b1",
        name: "Restaurante Completo",
        category: "gastronomia-catering",
        sectorId: "gastronomia-ocio",
        zone: "palma",
        address: "Paseo Marítimo 1",
        coordinates: { lat: 39.57, lng: 2.64 },
        rating: 4.8,
        reviewCount: 150,
        priceRange: "€€€",
        verified: true,
        featured: true,
        status: "open",
        phone: "+34971000000",
        whatsapp: "+34971000000",
        email: "test@example.com",
        website: "https://example.com",
        googleMapsUrl: "https://maps.google.com/?id=b1",
        appleMapsUrl: "https://maps.apple.com/?id=b1",
        bingMapsUrl: "https://bing.com/maps/?id=b1",
        image: "https://example.com/photo.jpg",
        images: ["https://example.com/photo.jpg"],
        schedule: "L-V 09:00-22:00",
        tags: ["product:lujo"],
        specialties: ["Paella", "Marisco"],
        reviews: [
          {
            id: "rev-1",
            authorName: "Maria",
            rating: 5,
            comment: "Excelente servicio",
            date: "2026-08-01",
            platform: "google_maps",
            language: "es",
          },
        ],
        shortDescription: { es: "Restaurante", en: "Restaurant", ca: "Restaurant", de: "Restaurant" },
        fullDescription: { es: "Full", en: "Full", ca: "Full", de: "Full" },
      };

      const jsonLd = generateServiceJsonLd(mockBusiness, "es", "https://serviciosmallorca.com/es/restaurante-completo");
      expect(jsonLd["@context"]).toBe("https://schema.org");
      expect(jsonLd.name).toBe("Restaurante Completo");
      expect(jsonLd.priceRange).toBe("€€€");
      expect(jsonLd.geo?.latitude).toBe(39.57);
      expect(jsonLd.review?.length).toBe(1);
    });
  });
});
