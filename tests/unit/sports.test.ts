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
    expect(padelFacilities.length).toBeGreaterThanOrEqual(1);
    expect(padelFacilities.some((f) => f.id === "pins-padel-palma")).toBe(true);

    const singleFacility = getSportsFacilityById("pins-padel-palma");
    expect(singleFacility).toBeDefined();
    expect(singleFacility?.name).toBe("Pins Pádel Club Palma");

    // Zunray cerró en 2021 → ahora opera como Sadhana Works (GR-11 Zero Fake Data)
    const yogaFacilities = getSportsFacilitiesByActivity("yoga_pilates");
    expect(yogaFacilities.length).toBeGreaterThanOrEqual(1);
    expect(yogaFacilities.some((f) => f.id === "sadhana-works-yoga-palma")).toBe(true);

    // Los nuevos gimnasios deben existir y estar correctamente tipados
    const gymFacilities = getSportsFacilitiesByActivity("fitness_gym");
    expect(gymFacilities.length).toBeGreaterThanOrEqual(4);
    expect(gymFacilities.some((f) => f.id === "basic-fit-palma-avda-portugal")).toBe(true);
    expect(gymFacilities.some((f) => f.id === "vivagym-porto-pi-palma")).toBe(true);
    expect(gymFacilities.some((f) => f.id === "crossfit-mallorca-santa-ponca")).toBe(true);
  });

  it("filters facilities accurately by geographical zone", () => {
    const palmaFacilities = getSportsFacilitiesByZone("palma");
    // Palma: Pins Pádel, Paseo Marítimo, Parc de la Mar, Sadhana Works, Mallorca Cycling Center, Basic-Fit, VivaGym = 7
    expect(palmaFacilities.length).toBeGreaterThanOrEqual(5);

    const llevantFacilities = getSportsFacilitiesByZone("llevant");
    expect(llevantFacilities.some((f) => f.id === "rafa-nadal-sports-centre-manacor")).toBe(true);

    // CrossFit Mallorca está en Santa Ponça → zona calvia-andratx
    const calviaFacilities = getSportsFacilitiesByZone("calvia-andratx");
    expect(calviaFacilities.some((f) => f.id === "crossfit-mallorca-santa-ponca")).toBe(true);
    expect(calviaFacilities.some((f) => f.id === "pista-atletisme-magaluf-calvia")).toBe(true);

    const raiguerFacilities = getSportsFacilitiesByZone("raiguer-pla");
    expect(raiguerFacilities.some((f) => f.id === "poliesportiu-mateu-canellas-inca")).toBe(true);

    const llevantZone = getSportsFacilitiesByZone("llevant");
    expect(llevantZone.some((f) => f.id === "poliesportiu-torre-dels-enagistes-manacor")).toBe(true);
  });

  it("verifies public sports facilities and calisthenics parks compliance", () => {
    const publicFacilities = SPORTS_FACILITIES.filter(
      (f) => f.management === "parque_publico" || f.management === "publica_ayuntamiento",
    );
    expect(publicFacilities.length).toBeGreaterThanOrEqual(10);

    const calisthenics = SPORTS_FACILITIES.filter((f) => f.activityTypes.includes("calistenia"));
    expect(calisthenics.length).toBeGreaterThanOrEqual(5);

    // Son Moix and Son Hugo municipal aquatic centres
    const sonMoix = getSportsFacilityById("palau-municipal-esports-son-moix-palma");
    expect(sonMoix).toBeDefined();
    expect(sonMoix?.management).toBe("publica_ayuntamiento");
    expect(sonMoix?.verifiedOfficialSource).toContain("IME");

    const sonHugo = getSportsFacilityById("piscines-municipals-son-hugo-palma");
    expect(sonHugo).toBeDefined();
    expect(sonHugo?.activityTypes).toContain("natacion");

    // Free access public workout areas
    const bellver = getSportsFacilityById("circuito-running-bosque-bellver-palma");
    expect(bellver?.pricing.isFree).toBe(true);
    expect(bellver?.amenities.fuenteAgua).toBe(true);
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
