import { describe, it, expect } from "vitest";
import { getDiscoveryTours, getDiscoveryTourBySlug } from "../../src/data/discoveryTours";

describe("Discovery Hub - Thematic Tours Module", () => {
  it("defines complete curated itineraries across Mallorca", () => {
    const tours = getDiscoveryTours();
    expect(Array.isArray(tours)).toBe(true);
    expect(tours.length).toBeGreaterThanOrEqual(3);

    for (const tour of tours) {
      expect(tour.id).toBeDefined();
      expect(tour.slug).toBeDefined();
      expect(tour.title.es).toBeDefined();
      expect(tour.title.en).toBeDefined();
      expect(tour.title.ca).toBeDefined();
      expect(tour.title.de).toBeDefined();
      expect(tour.subtitle.es).toBeDefined();
      expect(tour.subtitle.de).toBeDefined();
      expect(tour.stops.length).toBeGreaterThanOrEqual(2);

      for (const stop of tour.stops) {
        expect(stop.stopNumber).toBeGreaterThan(0);
        expect(stop.name).toBeDefined();
        expect(stop.categoryIcon).toBeDefined();
        expect(stop.coordinates).toBeDefined();
        expect(stop.description.es).toBeDefined();
        expect(stop.description.de).toBeDefined();
        expect(stop.highlight.es).toBeDefined();
        expect(stop.highlight.de).toBeDefined();
      }
    }
  });

  it("retrieves a tour by slug correctly", () => {
    const tour = getDiscoveryTourBySlug("ruta-gastro-vinos-raiguer");
    expect(tour).toBeDefined();
    expect(tour?.zone).toBe("raiguer");
    expect(tour?.stops.some((s) => s.businessSlug === "forn-sant-francesc-inca")).toBe(true);
  });
});
