import { describe, it, expect } from "vitest";
import { ServiceRepository } from "../../src/lib/repository/serviceRepository.ts";
import { SERVICES } from "../../src/data/services/index.ts";

describe("ServiceRepository & Dynamic Query Engine", () => {
  const repo = new ServiceRepository(SERVICES);

  it("fetches business by slug accurately", async () => {
    const item = await repo.getBySlug("celler-sa-premsa");
    expect(item).toBeDefined();
    expect(item?.name).toBe("Celler Sa Premsa");
    expect(item?.category).toBe("gastronomia-catering");
  });

  it("returns null for non-existent slug", async () => {
    const item = await repo.getBySlug("non-existent-business-12345");
    expect(item).toBeNull();
  });

  it("filters businesses dynamically by category and minRating", async () => {
    const result = await repo.query({
      category: "gastronomia-catering",
      minRating: 4.5,
      sortBy: "rating",
      sortOrder: "desc",
    });

    expect(result.total).toBeGreaterThan(0);
    expect(result.items.every((i) => i.category === "gastronomia-catering")).toBe(true);
    expect(result.items.every((i) => (i.rating || 0) >= 4.5)).toBe(true);
  });

  it("performs geo-distance queries with Haversine radius (Palma center)", async () => {
    // Palma Cathedral coordinates
    const palmaLat = 39.5684;
    const palmaLng = 2.6519;

    const result = await repo.query({
      geo: {
        lat: palmaLat,
        lng: palmaLng,
        radiusKm: 5, // 5km radius around Palma center
      },
      sortBy: "distance",
      sortOrder: "asc",
    });

    expect(result.total).toBeGreaterThan(0);
    expect(result.items.every((i) => i.distanceKm !== undefined && i.distanceKm <= 5)).toBe(true);
    // Closest should have smallest distanceKm
    expect(result.items[0].distanceKm).toBeLessThanOrEqual(result.items[result.items.length - 1].distanceKm!);
  });

  it("supports pagination cleanly", async () => {
    const page1 = await repo.query({ pageSize: 5, page: 1 });
    const page2 = await repo.query({ pageSize: 5, page: 2 });

    expect(page1.items.length).toBeLessThanOrEqual(5);
    expect(page2.items.length).toBeLessThanOrEqual(5);
    expect(page1.page).toBe(1);
    expect(page2.page).toBe(2);
    if (page1.items.length > 0 && page2.items.length > 0) {
      expect(page1.items[0].id).not.toBe(page2.items[0].id);
    }
  });

  it("finds nearby businesses via getNearby helper", async () => {
    const nearby = await repo.getNearby(39.5709, 2.6394, 10, 3);
    expect(nearby.length).toBeLessThanOrEqual(3);
    expect(nearby.every((n) => n.distanceKm !== undefined)).toBe(true);
  });
});
