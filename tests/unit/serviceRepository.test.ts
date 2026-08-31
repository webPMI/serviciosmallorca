import { describe, it, expect } from "vitest";
import { ServiceRepository, defaultRepository } from "../../src/lib/repository/serviceRepository.ts";
import { SERVICES } from "../../src/data/services/index.ts";
import type { ServiceItem } from "../../src/data/services/types.ts";

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

  it("fetches business by id accurately and handles null", async () => {
    const firstService = SERVICES[0];
    const found = await repo.getById(firstService.id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(firstService.id);

    const notFound = await repo.getById("non-existent-id-9999");
    expect(notFound).toBeNull();
  });

  it("exports a functioning defaultRepository singleton", async () => {
    expect(defaultRepository).toBeInstanceOf(ServiceRepository);
    const item = await defaultRepository.getBySlug("celler-sa-premsa");
    expect(item).toBeDefined();
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

  it("handles status filter 'all' including closed/incomplete", async () => {
    const mockServices: ServiceItem[] = [
      {
        ...SERVICES[0],
        id: "mock-closed",
        slug: "mock-closed",
        status: "permanently_closed",
      },
      {
        ...SERVICES[0],
        id: "mock-incomplete",
        slug: "mock-incomplete",
        status: "incomplete_admin_only",
      },
      {
        ...SERVICES[0],
        id: "mock-active",
        slug: "mock-active",
        status: "open",
      },
    ];
    const customRepo = new ServiceRepository(mockServices);

    const standardResult = await customRepo.query({});
    expect(standardResult.total).toBe(1);
    expect(standardResult.items[0].id).toBe("mock-active");

    const allResult = await customRepo.query({ status: "all" });
    expect(allResult.total).toBe(3);
  });

  it("filters by verifiedOnly and featuredOnly", async () => {
    const verifiedRes = await repo.query({ verifiedOnly: true });
    expect(verifiedRes.items.every((s) => s.verified)).toBe(true);

    const featuredRes = await repo.query({ featuredOnly: true });
    expect(featuredRes.items.every((s) => s.featured)).toBe(true);
  });

  it("filters by sectors array, sectorId, zone, and tags", async () => {
    const mockServices: ServiceItem[] = [
      {
        ...SERVICES[0],
        id: "mock-multi-sector",
        slug: "mock-multi-sector",
        sectorId: "nautica-maritimo",
        sectors: ["nautica-maritimo", "gastronomia-ocio"],
        zone: "palma",
        tags: ["product:lujo", "aud:familias"],
      },
      {
        ...SERVICES[0],
        id: "mock-other",
        slug: "mock-other",
        sectorId: "arte-estilo-cultura",
        sectors: ["arte-estilo-cultura"],
        zone: "calvia-andratx",
        tags: ["product:accesible"],
      },
    ];
    const customRepo = new ServiceRepository(mockServices);

    const sectorRes = await customRepo.query({ sectors: ["nautica-maritimo"] });
    expect(sectorRes.total).toBe(1);
    expect(sectorRes.items[0].id).toBe("mock-multi-sector");

    const sectorIdRes = await customRepo.query({ sectorId: "arte-estilo-cultura" });
    expect(sectorIdRes.total).toBe(1);
    expect(sectorIdRes.items[0].id).toBe("mock-other");

    const zoneRes = await customRepo.query({ zone: "palma" });
    expect(zoneRes.total).toBe(1);
    expect(zoneRes.items[0].id).toBe("mock-multi-sector");

    const tagRes = await customRepo.query({ tags: ["product:lujo", "aud:familias"] });
    expect(tagRes.total).toBe(1);
    expect(tagRes.items[0].id).toBe("mock-multi-sector");

    const noTagMatch = await customRepo.query({ tags: ["product:inexistente"] });
    expect(noTagMatch.total).toBe(0);
  });

  it("filters by specialties with both array and localized object schemas", async () => {
    const mockServices: ServiceItem[] = [
      {
        ...SERVICES[0],
        id: "mock-spec-array",
        slug: "mock-spec-array",
        tags: ["product:tatuaje"],
        features: ["paella"],
        specialties: ["Cocktails", "Tapas"],
      },
      {
        ...SERVICES[0],
        id: "mock-spec-obj",
        slug: "mock-spec-obj",
        tags: [],
        features: [],
        specialties: {
          es: ["Arroces"],
          en: ["Rice Dishes"],
          ca: ["Arrossos"],
          de: ["Reisgerichte"],
        },
      },
    ];
    const customRepo = new ServiceRepository(mockServices);

    const matchTag = await customRepo.query({ specialties: ["tatuaje"] });
    expect(matchTag.total).toBe(1);

    const matchFeature = await customRepo.query({ specialties: ["paella"] });
    expect(matchFeature.total).toBe(1);

    const matchArray = await customRepo.query({ specialties: ["Cocktails"] });
    expect(matchArray.total).toBe(1);

    const matchObjEn = await customRepo.query({ specialties: ["Rice Dishes"] });
    expect(matchObjEn.total).toBe(1);

    const matchNone = await customRepo.query({ specialties: ["SpecialtyNonExistent"] });
    expect(matchNone.total).toBe(0);
  });

  it("filters by capabilities matrix (petFriendly, wheelchairAccessible, kidsArea, emergency24h, inVillaService, terrace, seaViews, onlineBooking)", async () => {
    const mockServices: ServiceItem[] = [
      {
        ...SERVICES[0],
        id: "mock-all-caps",
        slug: "mock-all-caps",
        capabilities: {
          petFriendly: true,
          wheelchairAccessible: true,
          kidsArea: true,
          emergency24h: true,
          inVillaService: true,
          terrace: true,
          seaViews: true,
          onlineBooking: true,
        },
        website: "https://example.com",
      },
      {
        ...SERVICES[0],
        id: "mock-no-caps",
        slug: "mock-no-caps",
        capabilities: undefined,
        amenities: [],
        features: [],
        targetAudience: [],
        emergency24h: false,
        inVillaService: false,
        website: "",
      },
    ];
    const customRepo = new ServiceRepository(mockServices);

    const res1 = await customRepo.query({ capabilities: { petFriendly: true } });
    expect(res1.total).toBe(1);
    expect(res1.items[0].id).toBe("mock-all-caps");

    const res2 = await customRepo.query({ capabilities: { wheelchairAccessible: true } });
    expect(res2.total).toBe(1);

    const res3 = await customRepo.query({ capabilities: { kidsArea: true } });
    expect(res3.total).toBe(1);

    const res4 = await customRepo.query({ capabilities: { emergency24h: true } });
    expect(res4.total).toBe(1);

    const res5 = await customRepo.query({ capabilities: { inVillaService: true } });
    expect(res5.total).toBe(1);

    const res6 = await customRepo.query({ capabilities: { terrace: true } });
    expect(res6.total).toBe(1);

    const res7 = await customRepo.query({ capabilities: { seaViews: true } });
    expect(res7.total).toBe(1);

    const res8 = await customRepo.query({ capabilities: { onlineBooking: true } });
    expect(res8.total).toBe(1);
  });

  it("performs multi-language free-text queries across name, descriptions, address, tags, and specialties", async () => {
    const mockServices: ServiceItem[] = [
      {
        ...SERVICES[0],
        id: "mock-es",
        slug: "mock-es",
        name: "Restaurante Miramar",
        shortDescription: {
          es: "Mariscos frescos en el puerto",
          en: "Fresh seafood at the port",
          ca: "Marisc fresc al port",
          de: "Frische Meeresfrüchte am Hafen",
        },
        address: "Paseo Marítimo 12",
        tags: ["product:lujo"],
        specialties: ["Lubina", "Ostras"],
      },
      {
        ...SERVICES[0],
        id: "mock-de",
        slug: "mock-de",
        name: "Mallorca Hair Studio",
        shortDescription: {
          es: "Peluquería de autor",
          en: "Author hair salon",
          ca: "Perruqueria d'autor",
          de: "Exklusiver Friseursalon für anspruchsvolle Kunden",
        },
        address: "Carrer Sant Miquel 4",
        tags: ["mod:cita-previa"],
        specialties: {
          es: ["Corte"],
          en: ["Haircut"],
          ca: ["Tall"],
          de: ["Haarschnitt"],
        },
      },
    ];
    const customRepo = new ServiceRepository(mockServices);

    const matchName = await customRepo.query({ query: "miramar" });
    expect(matchName.total).toBe(1);

    const matchDescDe = await customRepo.query({ query: "Friseursalon" });
    expect(matchDescDe.total).toBe(1);

    const matchAddress = await customRepo.query({ query: "Sant Miquel" });
    expect(matchAddress.total).toBe(1);

    const matchTag = await customRepo.query({ query: "cita-previa" });
    expect(matchTag.total).toBe(1);

    const matchSpecObj = await customRepo.query({ query: "Haarschnitt" });
    expect(matchSpecObj.total).toBe(1);
  });

  it("sorts by reviews and name in ascending and descending orders", async () => {
    const mockServices: ServiceItem[] = [
      { ...SERVICES[0], id: "s1", name: "Alpha Service", reviewCount: 10 },
      { ...SERVICES[0], id: "s2", name: "Beta Service", reviewCount: 50 },
      { ...SERVICES[0], id: "s3", name: "Gamma Service", reviewCount: 2 },
    ];
    const customRepo = new ServiceRepository(mockServices);

    const byReviewsDesc = await customRepo.query({ sortBy: "reviews", sortOrder: "desc" });
    expect(byReviewsDesc.items[0].id).toBe("s2");
    expect(byReviewsDesc.items[2].id).toBe("s3");

    const byNameAsc = await customRepo.query({ sortBy: "name", sortOrder: "asc" });
    expect(byNameAsc.items[0].name).toBe("Alpha Service");
    expect(byNameAsc.items[2].name).toBe("Gamma Service");
  });

  it("performs geo-distance queries with Haversine radius (Palma center)", async () => {
    const palmaLat = 39.5684;
    const palmaLng = 2.6519;

    const result = await repo.query({
      geo: {
        lat: palmaLat,
        lng: palmaLng,
        radiusKm: 5,
      },
      sortBy: "distance",
      sortOrder: "asc",
    });

    expect(result.total).toBeGreaterThan(0);
    expect(result.items.every((i) => i.distanceKm !== undefined && i.distanceKm <= 5)).toBe(true);
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
