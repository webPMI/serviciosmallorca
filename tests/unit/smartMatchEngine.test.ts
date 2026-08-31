import { describe, it, expect } from "vitest";
import { getSmartMatchCrossSell } from "../../src/lib/smartMatchEngine";
import { elCaminoPalma } from "../../src/data/services/gastronomia-restaurantes/el-camino";
import { oasisCatamaran } from "../../src/data/services/nautica-charter/oasis-catamaran";

describe("Smart-Match Recommendation Engine (Dynamic Cross-Selling)", () => {
  it("suggests complementary high-converting cross-sector services", () => {
    const nauticalRecommendations = getSmartMatchCrossSell(oasisCatamaran, 3, "es");
    expect(nauticalRecommendations.length).toBeGreaterThan(0);
    expect(nauticalRecommendations.length).toBeLessThanOrEqual(3);

    // Náutica debería sugerir gastronomía o spas
    const categories = nauticalRecommendations.map((r) => r.service.category);
    const hasComplementary = categories.some((c) =>
      [
        "gastronomia-restaurantes",
        "gastronomia-catering",
        "spas-bienestar",
        "salud-bienestar",
        "motor-transporte",
      ].includes(c),
    );
    expect(hasComplementary).toBe(true);

    // Debe incluir razonamiento multilingüe
    expect(nauticalRecommendations[0].crossSellReason.es).toBeDefined();
    expect(nauticalRecommendations[0].crossSellReason.de).toBeDefined();
    expect(nauticalRecommendations[0].relevanceScore).toBeGreaterThan(0);
  });

  it("calculates proximity distance when coordinates are present", () => {
    const restaurantRecs = getSmartMatchCrossSell(elCaminoPalma, 3, "de");
    expect(restaurantRecs.length).toBeGreaterThan(0);
    restaurantRecs.forEach((rec) => {
      expect(rec.service.id).not.toBe(elCaminoPalma.id);
    });
  });

  it("generates targeted cross-sell reasoning for tattoo, real-estate, and wellness", () => {
    // 1. Tattoo source
    const tattooRecs = getSmartMatchCrossSell(
      {
        id: "tattoo-test",
        slug: "tattoo-test",
        category: "arte-tatuajes",
        zone: "palma",
        coordinates: { lat: 39.5696, lng: 2.6502 },
      },
      3,
      "es",
    );
    expect(tattooRecs.length).toBeGreaterThan(0);
    const hasSpecialtyCafe = tattooRecs.some(
      (r) =>
        r.crossSellReason.es.includes("Café y gastronomía") ||
        r.crossSellReason.es.includes("Relajación") ||
        r.crossSellReason.es.includes("Servicio complementario"),
    );
    expect(hasSpecialtyCafe).toBe(true);

    // 2. Real estate source
    const realEstateRecs = getSmartMatchCrossSell(
      {
        id: "real-estate-test",
        slug: "real-estate-test",
        category: "inmobiliaria-villas",
        zone: "calvia-andratx",
      },
      3,
      "en",
    );
    expect(realEstateRecs.length).toBeGreaterThan(0);
    expect(realEstateRecs[0].crossSellReason.en).toBeDefined();

    // 3. Fallback / unknown category
    const unknownCategoryRecs = getSmartMatchCrossSell(
      {
        id: "unknown-cat-test",
        slug: "unknown-cat-test",
        category: "categoria-no-mapeada",
        zone: "palma",
      },
      2,
      "ca",
    );
    expect(unknownCategoryRecs.length).toBeGreaterThan(0);
    expect(unknownCategoryRecs[0].crossSellReason.ca).toBeDefined();
  });

  it("handles source without coordinates matching by zone", () => {
    const noCoordRecs = getSmartMatchCrossSell(
      {
        id: "no-coord-test",
        category: "nautica-charter",
        zone: "palma",
      },
      3,
      "de",
    );
    expect(noCoordRecs.length).toBeGreaterThan(0);
    expect(noCoordRecs[0].formattedDistance).toBeUndefined();
  });
});
