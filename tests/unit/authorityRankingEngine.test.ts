import { describe, it, expect } from "vitest";
import {
  calculateBusinessScore,
  calculateQualityBreakdown,
  getTopServicesByCategory,
  getComparisonList,
  generateDynamicFaqs,
} from "../../src/lib/topEngine";
import { SERVICES } from "../../src/data/services";

describe("Authority Ranking Engine & Dynamic Comparison Matrix (20/30/30/20 Formula)", () => {
  it("calculates Quality Score breakdown conforming to 20/30/30/20 rules", () => {
    const service = SERVICES.find((s) => s.id === "restaurante-ola-del-mar") || SERVICES[0];
    const breakdown = calculateQualityBreakdown(service, "es");
    const score = calculateBusinessScore(service, "es");

    expect(score).toBe(breakdown.total);
    expect(breakdown.visualQuality).toBeGreaterThanOrEqual(0);
    expect(breakdown.visualQuality).toBeLessThanOrEqual(20);

    expect(breakdown.dataVeracity).toBeGreaterThanOrEqual(0);
    expect(breakdown.dataVeracity).toBeLessThanOrEqual(30);

    expect(breakdown.popularity).toBeGreaterThanOrEqual(0);
    expect(breakdown.popularity).toBeLessThanOrEqual(30);

    expect(breakdown.intentAffinity).toBeGreaterThanOrEqual(0);
    expect(breakdown.intentAffinity).toBeLessThanOrEqual(20);

    expect(breakdown.total).toBeGreaterThanOrEqual(70);
    expect(breakdown.total).toBeLessThanOrEqual(100);
  });

  it("filters comparison list by specific business capabilities (e.g. terrace)", () => {
    const listWithTerrace = getComparisonList({
      category: "gastronomia-catering",
      capabilities: ["terrace"],
      limit: 10,
    });

    expect(listWithTerrace.length).toBeGreaterThan(0);
    for (const item of listWithTerrace) {
      expect(Boolean(item.service.capabilities?.terrace)).toBe(true);
    }
  });

  it("filters comparison list by specific zone and minimum score", () => {
    const palmaList = getComparisonList({
      zone: "palma",
      minScore: 75,
      limit: 5,
    });

    expect(palmaList.length).toBeGreaterThan(0);
    for (const item of palmaList) {
      expect(item.service.zone).toBe("palma");
      expect(item.score).toBeGreaterThanOrEqual(75);
    }
  });

  it("generates rich localized FAQs for long-tail search capture", () => {
    const topServices = getTopServicesByCategory("gastronomia-catering", 3, "es");
    const faqs = generateDynamicFaqs("Gastronomía", "Palma", topServices, "es");

    expect(faqs.length).toBe(3);
    expect(faqs[0].question).toContain("Gastronomía");
    expect(faqs[0].answer).toContain(topServices[0].service.name);
  });
});
