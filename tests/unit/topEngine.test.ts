import { describe, it, expect } from "vitest";
import {
  calculateBusinessScore,
  getTopServicesByCategory,
  getTopRankedServices,
  getWeeklyCuratedTops,
  getTopServicesByZone,
} from "../../src/lib/topEngine";
import { elCaminoPalma } from "../../src/data/services/gastronomia-restaurantes/el-camino";

describe("Top Engine - Multi-criteria Ranking Algorithm", () => {
  it("calculates positive score between 0 and 100 for verified businesses", () => {
    const score = calculateBusinessScore(elCaminoPalma);
    expect(score).toBeGreaterThan(70);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("ranks top services by category correctly", () => {
    const topFood = getTopServicesByCategory("gastronomia-catering", 3);
    expect(topFood.length).toBeGreaterThan(0);
    expect(topFood[0].rank).toBe(1);
    expect(topFood[0].badgeLabel).toContain("Top #1");
    expect(topFood[0].score).toBeGreaterThan(0);
  });

  it("ranks top services overall", () => {
    const overall = getTopRankedServices(5);
    expect(overall.length).toBeLessThanOrEqual(5);
    expect(overall[0].score).toBeGreaterThanOrEqual(overall[overall.length - 1].score);
  });

  it("deterministically returns 3 weekly curated items", () => {
    const weekTopsA = getWeeklyCuratedTops(new Date("2025-06-15"));
    const weekTopsB = getWeeklyCuratedTops(new Date("2025-06-15"));
    expect(weekTopsA.length).toBe(3);
    expect(weekTopsA[0].service.id).toBe(weekTopsB[0].service.id);
  });

  it("filters top services by zone", () => {
    const palmaTops = getTopServicesByZone("palma", 3);
    palmaTops.forEach((item) => {
      expect(item.service.zone).toBe("palma");
    });
  });

  it("applies German locale authority boosts and localized reason badges", () => {
    const topGerman = getTopServicesByCategory("gastronomia-catering", 3, "de");
    expect(topGerman.length).toBeGreaterThan(0);
    expect(topGerman[0].badgeLabel).toContain("Top #1 Kategorie");
    expect(topGerman[0].reasons.length).toBeGreaterThan(0);
  });
});
