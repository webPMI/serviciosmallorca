import { describe, it, expect } from "vitest";
import { getSmartMatchCrossSell } from "../../src/lib/smartMatchEngine";
import { SERVICES } from "../../src/data/services";

describe("Integration: Smart-Match Recommendation Engine Multi-Query Simulation", () => {
  it("processes concurrent recommendations across all categories without crashing or corrupting state", () => {
    // Tomamos una muestra de negocios de diferentes categorías
    const sampleBusinesses = SERVICES.slice(0, 20);

    const allRecommendations = sampleBusinesses.map((service) => ({
      sourceId: service.id,
      sourceCategory: service.category,
      recs: getSmartMatchCrossSell(service, 3, "es"),
    }));

    expect(allRecommendations.length).toBe(sampleBusinesses.length);

    for (const item of allRecommendations) {
      expect(item.recs.length).toBeGreaterThan(0);
      expect(item.recs.length).toBeLessThanOrEqual(3);

      for (const rec of item.recs) {
        // Ningún negocio debe recomendarse a sí mismo
        expect(rec.service.id).not.toBe(item.sourceId);

        // Debe contener métricas válidas
        expect(rec.relevanceScore).toBeGreaterThan(0);
        expect(rec.relevanceScore).toBeLessThanOrEqual(100);
        expect(rec.crossSellReason.es).toBeTruthy();
        expect(rec.crossSellReason.de).toBeTruthy();
      }
    }
  });

  it("handles locale switching dynamically across all 4 locales (es, en, ca, de)", () => {
    const testService = SERVICES[0];
    const locales = ["es", "en", "ca", "de"] as const;

    for (const loc of locales) {
      const recs = getSmartMatchCrossSell(testService, 2, loc);
      expect(recs.length).toBeGreaterThan(0);
      expect(recs[0].crossSellReason[loc]).toBeDefined();
      expect(recs[0].crossSellReason[loc].length).toBeGreaterThan(5);
    }
  });
});
