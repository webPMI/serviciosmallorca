import { describe, it, expect } from "vitest";
import {
  SPORTS_FACILITIES,
  getSportsFacilityById,
  getSportsFacilitiesByActivity,
  getSportsFacilitiesByZone,
} from "../../src/data/sports/facilities.ts";

describe("Sports & Wellbeing POI Module (Deporte & Bienestar Mallorca)", () => {
  it("defines a robust catalog of sports facilities and outdoor POIs", () => {
    expect(Array.isArray(SPORTS_FACILITIES)).toBe(true);
    expect(SPORTS_FACILITIES.length).toBeGreaterThanOrEqual(5);

    for (const facility of SPORTS_FACILITIES) {
      expect(facility.id).toBeDefined();
      expect(facility.slug).toBeDefined();
      expect(facility.name).toBeDefined();
      expect(facility.activityTypes.length).toBeGreaterThan(0);
      expect(facility.coordinates).toBeDefined();
      expect(facility.coordinates.lat).toBeGreaterThan(39.0);
      expect(facility.coordinates.lat).toBeLessThan(40.1);
      expect(facility.coordinates.lng).toBeGreaterThan(2.2);
      expect(facility.coordinates.lng).toBeLessThan(3.6);
      expect(facility.surfaceType).toBeDefined();
      expect(facility.surfaceLabel.es).toBeDefined();
      expect(facility.surfaceLabel.en).toBeDefined();
      expect(facility.surfaceLabel.ca).toBeDefined();
      expect(facility.surfaceLabel.de).toBeDefined();
      expect(facility.description.es).toBeDefined();
      expect(facility.description.en).toBeDefined();
      expect(facility.description.ca).toBeDefined();
      expect(facility.description.de).toBeDefined();
      expect(facility.highlights.es.length).toBeGreaterThan(0);
      expect(facility.highlights.de.length).toBeGreaterThan(0);
      expect(facility.confidenceScore).toBeGreaterThanOrEqual(80);
      expect(facility.verifiedOfficialSource).toBeDefined();
    }
  });

  it("filters facilities accurately by activity type", () => {
    const padelFacilities = getSportsFacilitiesByActivity("padel");
    expect(padelFacilities.length).toBeGreaterThanOrEqual(2);
    expect(padelFacilities.some((f) => f.id === "pins-padel-palma")).toBe(true);

    const singleFacility = getSportsFacilityById("pins-padel-palma");
    expect(singleFacility).toBeDefined();
    expect(singleFacility?.name).toBe("Pins Pádel Club Palma");

    const yogaFacilities = getSportsFacilitiesByActivity("yoga_pilates");
    expect(yogaFacilities.length).toBeGreaterThanOrEqual(1);
    expect(yogaFacilities.some((f) => f.id === "zunray-yoga-studio-palma")).toBe(true);
  });

  it("filters facilities accurately by geographical zone", () => {
    const palmaFacilities = getSportsFacilitiesByZone("palma");
    expect(palmaFacilities.length).toBeGreaterThanOrEqual(3);

    const llevantFacilities = getSportsFacilitiesByZone("llevant");
    expect(llevantFacilities.some((f) => f.id === "rafa-nadal-sports-centre-manacor")).toBe(true);
  });

  it("provides contextual cross-selling links to nearby verified services", () => {
    const facilityWithCrossSell = SPORTS_FACILITIES.find(
      (f) => f.crossSellRecommendations && f.crossSellRecommendations.length > 0,
    );
    expect(facilityWithCrossSell).toBeDefined();
    expect(facilityWithCrossSell!.crossSellRecommendations![0].serviceSlug).toBeDefined();
    expect(facilityWithCrossSell!.crossSellRecommendations![0].reason.es).toBeDefined();
    expect(facilityWithCrossSell!.crossSellRecommendations![0].reason.de).toBeDefined();
  });
});
