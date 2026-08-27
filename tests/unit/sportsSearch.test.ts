import { describe, it, expect } from "vitest";
import { detectSportActivity, searchUnifiedSports } from "../../src/lib/sportsSearch";

describe("Unified Sports Search (Services & Public Facilities)", () => {
  it("detecta correctamente la actividad deportiva a partir de palabras clave", () => {
    expect(detectSportActivity("quiero jugar al pádel en palma")).toBe("padel");
    expect(detectSportActivity("clases de yoga matutinas")).toBe("yoga_pilates");
    expect(detectSportActivity("parque de calistenia")).toBe("calistenia");
    expect(detectSportActivity("circuito de running")).toBe("running");
    expect(detectSportActivity("consulta medica general")).toBeNull();
  });

  it("devuelve tanto servicios como instalaciones públicas para una búsqueda deportiva", () => {
    const result = searchUnifiedSports("padel");
    expect(result.query).toBe("padel");
    expect(result.totalResults).toBeGreaterThan(0);
    expect(Array.isArray(result.services)).toBe(true);
    expect(Array.isArray(result.publicFacilities)).toBe(true);
    expect(result.publicFacilities.length).toBeGreaterThan(0);
  });

  it("calcula distancias y ordena instalaciones públicas por proximidad cuando se pasa ubicación", () => {
    const userLocation = { lat: 39.5696, lng: 2.6502 }; // Palma Centro
    const result = searchUnifiedSports("calistenia", userLocation, "es");

    expect(result.nearbyFacilitiesWithDistance).toBeDefined();
    expect(result.nearbyFacilitiesWithDistance?.length).toBeGreaterThan(0);

    const first = result.nearbyFacilitiesWithDistance?.[0];
    expect(first?.distanceKm).toBeGreaterThanOrEqual(0);
    expect(first?.formattedDistance).toBeDefined();

    if ((result.nearbyFacilitiesWithDistance?.length || 0) > 1) {
      const second = result.nearbyFacilitiesWithDistance?.[1];
      expect((first?.distanceKm || 0) <= (second?.distanceKm || 0)).toBe(true);
    }
  });
});
