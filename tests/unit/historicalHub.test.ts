import { describe, it, expect } from "vitest";
import {
  getYearsOfOperation,
  resolveHistoricalSignificance,
  getHistoricalBusinesses,
  getCentenaryBusinesses,
  getLongevityStatistics,
  getSectorResilienceMetrics,
} from "../../src/lib/historicalHub";
import type { ServiceItem } from "../../src/data/services/types";

describe("Historical Hub & Longevity Business Intelligence", () => {
  it("calcula correctamente los años de operación de comercios con foundedYear", () => {
    const mockItem: ServiceItem = {
      id: "vidrios-gordiola",
      slug: "vidrios-gordiola",
      name: "Vidrios Gordiola",
      category: "arte-tatuajes",
      zone: "raiguer-pla",
      address: "Algaida",
      coordinates: { lat: 39.55, lng: 2.89 },
      rating: 4.8,
      reviewCount: 500,
      priceRange: "€€",
      verified: true,
      featured: true,
      status: "open",
      foundedYear: 1719,
      phone: "+34971665000",
      whatsapp: "+34971665000",
      email: "info@gordiola.com",
      website: "https://gordiola.com",
      googleMapsUrl: "https://maps.google.com",
      appleMapsUrl: "https://maps.apple.com",
      bingMapsUrl: "https://bing.com",
      image: "/images/gordiola.jpg",
      schedule: "Lunes a Viernes 9:00 - 18:00",
      tags: ["zona:raiguer-pla"],
      shortDescription: { es: "s", en: "s", ca: "s" },
      fullDescription: { es: "f", en: "f", ca: "f" },
    };

    const years = getYearsOfOperation(mockItem);
    expect(years).toBeGreaterThanOrEqual(300);
    expect(resolveHistoricalSignificance(mockItem)).toBe("centenary_heritage");
  });

  it("calcula años para negocios cerrados usando closureYear y evalúa diferentes tramos de longevidad", () => {
    const closedItem: ServiceItem = {
      id: "antiguo-taller-palma",
      slug: "antiguo-taller-palma",
      name: "Antiguo Taller Palma",
      category: "reformas-construccion",
      zone: "palma",
      address: "Palma",
      coordinates: { lat: 39.57, lng: 2.65 },
      rating: 4.5,
      reviewCount: 80,
      priceRange: "€€",
      verified: true,
      featured: false,
      status: "permanently_closed",
      foundedYear: 1950,
      closureYear: 2020,
      closureReason: "retirement",
      image: "/images/taller.jpg",
      schedule: "Cerrado permanentemente",
      phone: "+34971000000",
      whatsapp: "",
      email: "",
      website: "",
      googleMapsUrl: "https://maps.google.com",
      appleMapsUrl: "https://maps.apple.com",
      bingMapsUrl: "https://bing.com",
      tags: ["zona:palma"],
      shortDescription: { es: "s", en: "s", ca: "s" },
      fullDescription: { es: "f", en: "f", ca: "f" },
    };

    expect(getYearsOfOperation(closedItem)).toBe(70);
    expect(resolveHistoricalSignificance(closedItem)).toBe("historical_landmark");

    // Probar tramos pioneer y none
    const pioneerItem: ServiceItem = { ...closedItem, foundedYear: 2012, closureYear: undefined };
    expect(resolveHistoricalSignificance(pioneerItem)).toBe("commercial_pioneer");

    const recentItem: ServiceItem = { ...closedItem, foundedYear: 2024, closureYear: undefined };
    expect(resolveHistoricalSignificance(recentItem)).toBe("standard");
  });

  it("obtiene estadísticas de longevidad coherentes en el catálogo real", () => {
    const stats = getLongevityStatistics();
    expect(stats.totalHistoricalTracked).toBeGreaterThanOrEqual(0);
    expect(typeof stats.centenaryCount).toBe("number");
    expect(typeof stats.heritage50Count).toBe("number");
  });

  it("permite filtrar negocios históricos por categoría, zona, status y closureReason", () => {
    const historical = getHistoricalBusinesses({ minYears: 20 });
    expect(Array.isArray(historical)).toBe(true);

    const openHistorical = getHistoricalBusinesses({ minYears: 10, status: "open_only" });
    expect(openHistorical.every((s) => s.status !== "permanently_closed")).toBe(true);

    const closedHistorical = getHistoricalBusinesses({ minYears: 10, status: "closed_only" });
    expect(closedHistorical.every((s) => s.status === "permanently_closed")).toBe(true);

    const byZone = getHistoricalBusinesses({ minYears: 5, zone: "palma" });
    expect(byZone.every((s) => s.zone === "palma")).toBe(true);

    const byCategory = getHistoricalBusinesses({ minYears: 5, category: "gastronomia-catering" });
    expect(byCategory.every((s) => s.category === "gastronomia-catering")).toBe(true);

    const bySignificance = getHistoricalBusinesses({ significance: "centenary_heritage" });
    expect(bySignificance.every((s) => resolveHistoricalSignificance(s) === "centenary_heritage")).toBe(true);

    const byClosureReason = getHistoricalBusinesses({ closureReason: "retirement" });
    expect(byClosureReason.every((s) => s.closureReason === "retirement")).toBe(true);
  });

  it("obtiene métricas de resiliencia sectorial ordenadas por años medios de actividad", () => {
    const metrics = getSectorResilienceMetrics();
    expect(Array.isArray(metrics)).toBe(true);
    if (metrics.length > 1) {
      expect(metrics[0].averageYearsInOperation).toBeGreaterThanOrEqual(metrics[1].averageYearsInOperation);
    }
  });

  it("filtra comercios centenarios reales del catálogo", () => {
    const centenaries = getCentenaryBusinesses();
    expect(Array.isArray(centenaries)).toBe(true);
    centenaries.forEach((c) => {
      const years = getYearsOfOperation(c);
      expect(years).toBeGreaterThanOrEqual(100);
    });
  });
});
