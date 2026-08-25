import { describe, it, expect } from "vitest";
import { calculateHaversineDistance, formatDistance, getServicesNearLocation } from "../../src/lib/geoUtils.ts";
import { SERVICES } from "../../src/data/services/index.ts";

describe("geoUtils - Haversine Proximity Engine", () => {
  it("calculates accurate distance between known Mallorca locations", () => {
    // Palma Centro (Plaça Major: 39.5701, 2.6515) to Portixol (39.5605, 2.6710) ~ 2.0 km
    const distPalmaPortixol = calculateHaversineDistance(39.5701, 2.6515, 39.5605, 2.671);
    expect(distPalmaPortixol).toBeGreaterThan(1.5);
    expect(distPalmaPortixol).toBeLessThan(2.5);

    // Palma to Sóller (~22 km)
    const distPalmaSoller = calculateHaversineDistance(39.57, 2.65, 39.76, 2.71);
    expect(distPalmaSoller).toBeGreaterThan(20);
    expect(distPalmaSoller).toBeLessThan(25);
  });

  it("formats distances cleanly (< 1 km in meters, >= 1 km in km)", () => {
    expect(formatDistance(0.35)).toBe("350 m");
    expect(formatDistance(0.85)).toBe("850 m");
    expect(formatDistance(1.24)).toBe("1.2 km");
    expect(formatDistance(15.89)).toBe("15.9 km");
  });

  it("filters and sorts services ascending by proximity to user coordinates", () => {
    // Coordenadas de prueba en Plaça Major (Palma Centro)
    const userLocation = { lat: 39.5701, lng: 2.6515 };

    const nearbyServices = getServicesNearLocation(SERVICES, userLocation);
    expect(nearbyServices.length).toBe(SERVICES.length);

    // Debe estar ordenado de menor a mayor distancia
    for (let i = 0; i < nearbyServices.length - 1; i++) {
      expect(nearbyServices[i].distanceKm).toBeLessThanOrEqual(nearbyServices[i + 1].distanceKm);
      expect(nearbyServices[i].formattedDistance).toBeDefined();
    }
  });

  it("respects maxDistanceKm radius parameter", () => {
    const userLocation = { lat: 39.5701, lng: 2.6515 };

    // Filtrar a un radio muy pequeño (ej: 0.5 km)
    const veryClose = getServicesNearLocation(SERVICES, userLocation, 0.5);
    expect(veryClose.every((s) => s.distanceKm <= 0.5)).toBe(true);
  });
});
