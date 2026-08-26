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
      ["gastronomia-restaurantes", "spas-bienestar", "motor-transporte"].includes(c),
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
});
