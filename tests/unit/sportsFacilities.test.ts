import { describe, it, expect } from "vitest";
import { SPORTS_FACILITIES } from "../../src/data/sports/facilities.ts";
import { validateSportsFacilitiesList } from "../../src/lib/validateSportsFacilities.ts";
import { MALLORCA_ZONES } from "../../src/data/zones.ts";
import type { SportsFacilityPOI } from "../../src/data/sports/types.ts";

describe("Sports Facilities & Points of Interest Integrity", () => {
  it("passes comprehensive validation for the entire SPORTS_FACILITIES catalog", () => {
    expect(SPORTS_FACILITIES.length).toBeGreaterThanOrEqual(40);
    const result = validateSportsFacilitiesList(SPORTS_FACILITIES);
    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
  });

  it("ensures every facility belongs to a valid zone in MALLORCA_ZONES", () => {
    const validZoneIds = new Set(MALLORCA_ZONES.map((z) => z.id));
    for (const facility of SPORTS_FACILITIES) {
      expect(validZoneIds.has(facility.zone)).toBe(true);
    }
  });

  it("ensures every facility has coordinates inside the Mallorca bounding box", () => {
    for (const facility of SPORTS_FACILITIES) {
      expect(facility.coordinates).toBeDefined();
      expect(facility.coordinates.lat).toBeGreaterThanOrEqual(39.0);
      expect(facility.coordinates.lat).toBeLessThanOrEqual(40.1);
      expect(facility.coordinates.lng).toBeGreaterThanOrEqual(2.2);
      expect(facility.coordinates.lng).toBeLessThanOrEqual(3.6);
    }
  });

  it("ensures full 4-language i18n descriptions and surface labels", () => {
    for (const facility of SPORTS_FACILITIES) {
      expect(facility.description.es).toBeTruthy();
      expect(facility.description.en).toBeTruthy();
      expect(facility.description.ca).toBeTruthy();
      expect(facility.description.de).toBeTruthy();
      expect(facility.surfaceLabel.es).toBeTruthy();
      expect(facility.surfaceLabel.en).toBeTruthy();
      expect(facility.surfaceLabel.ca).toBeTruthy();
      expect(facility.surfaceLabel.de).toBeTruthy();
      expect(facility.highlights.es.length).toBeGreaterThan(0);
      expect(facility.highlights.en.length).toBeGreaterThan(0);
      expect(facility.highlights.ca.length).toBeGreaterThan(0);
      expect(facility.highlights.de.length).toBeGreaterThan(0);
    }
  });

  it("ensures authentic verifiedOfficialSource is provided (GR-11)", () => {
    for (const facility of SPORTS_FACILITIES) {
      expect(facility.verifiedOfficialSource).toBeTruthy();
      expect(facility.verifiedOfficialSource.trim().length).toBeGreaterThanOrEqual(5);
    }
  });

  it("catches duplicate ids, slugs, names, and images", () => {
    const sample = SPORTS_FACILITIES[0];
    const duplicateId: SportsFacilityPOI = { ...sample, name: "Another Venue", slug: "another-venue" };
    const resId = validateSportsFacilitiesList([sample, duplicateId]);
    expect(resId.valid).toBe(false);
    expect(resId.errors.some((e) => e.includes("ID duplicado"))).toBe(true);

    const duplicateSlug: SportsFacilityPOI = { ...sample, id: "another-id", name: "Another Venue" };
    const resSlug = validateSportsFacilitiesList([sample, duplicateSlug]);
    expect(resSlug.valid).toBe(false);
    expect(resSlug.errors.some((e) => e.includes("Slug duplicado"))).toBe(true);

    const duplicateName: SportsFacilityPOI = { ...sample, id: "another-id", slug: "another-slug" };
    const resName = validateSportsFacilitiesList([sample, duplicateName]);
    expect(resName.valid).toBe(false);
    expect(resName.errors.some((e) => e.includes("Nombre duplicado"))).toBe(true);
  });

  it("catches fake sequential or repetitive phone patterns (GR-11)", () => {
    const sample = SPORTS_FACILITIES[0];
    const fakeSeqPhone: SportsFacilityPOI = {
      ...sample,
      id: "fake-venue-1",
      slug: "fake-venue-1",
      name: "Fake Venue 1",
      image: "/images/sports/fake1.jpg",
      contactPhone: "+34 971 123 456",
    };
    const res = validateSportsFacilitiesList([fakeSeqPhone]);
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.includes("Patrón telefónico secuencial/falso"))).toBe(true);
  });

  it("catches coordinates outside of Mallorca", () => {
    const sample = SPORTS_FACILITIES[0];
    const mainlandVenue: SportsFacilityPOI = {
      ...sample,
      id: "madrid-venue",
      slug: "madrid-venue",
      name: "Madrid Venue",
      image: "/images/sports/madrid.jpg",
      coordinates: { lat: 40.4168, lng: -3.7038 },
    };
    const res = validateSportsFacilitiesList([mainlandVenue]);
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.includes("Coordenadas fuera de la isla de Mallorca"))).toBe(true);
  });
});
