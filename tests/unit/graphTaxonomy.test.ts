import { describe, it, expect } from "vitest";
import { ServiceRepository } from "../../src/lib/repository/serviceRepository.ts";
import type { ServiceItem } from "../../src/data/services/types.ts";

describe("Dynamic Graph Taxonomy & Capabilities Matrix", () => {
  const sampleData: ServiceItem[] = [
    {
      id: "finca-gastro-sports",
      slug: "finca-gastro-sports",
      name: "Finca Agroturismo & Padel Club",
      category: "gastronomia-catering",
      sectorId: "gastronomia-hosteleria",
      sectors: ["gastronomia-hosteleria", "deportes-fitness", "alojamiento-turismo"],
      specialties: ["paellas", "padel-tournaments", "agroturismo"],
      capabilities: {
        petFriendly: true,
        wheelchairAccessible: true,
        terrace: true,
        parkingAvailable: true,
        onlineBooking: true,
      },
      zone: "raiguer-pla",
      address: "Inca, Mallorca",
      coordinates: { lat: 39.72, lng: 2.91 },
      rating: 4.8,
      reviewCount: 320,
      priceRange: "€€",
      verified: true,
      featured: true,
      status: "open",
      phone: "+34 971 11 22 33",
      whatsapp: "+34 971 11 22 33",
      email: "info@finca-demo.com",
      website: "https://finca-demo.com",
      googleMapsUrl: "https://maps.google.com/?q=finca-demo",
      appleMapsUrl: "https://maps.apple.com/?q=finca-demo",
      bingMapsUrl: "https://bing.com/maps?q=finca-demo",
      tags: ["zona:inca", "mod:cita-previa"],
      shortDescription: {
        es: "Finca con restaurante y pistas de pádel",
        en: "Finca with restaurant and padel courts",
        ca: "Finca amb restaurant",
        de: "Finca mit Restaurant",
      },
      fullDescription: { es: "Finca", en: "Finca", ca: "Finca", de: "Finca" },
      highlights: { es: [], en: [], ca: [], de: [] },
      servicesProvided: { es: [], en: [], ca: [], de: [] },
      image: "https://finca-demo.com/img.jpg",
      gallery: [],
      schedule: "10:00 - 22:00",
      lastVerifiedAt: "2026-08-26",
      createdAt: "2026-08-26",
      lastUpdatedAt: "2026-08-26",
      sourceConfidence: "high",
      auditLog: [],
    },
    {
      id: "tattoo-fine-line",
      slug: "tattoo-fine-line",
      name: "Studio Fine Line & Art",
      category: "arte-tatuajes",
      sectorId: "arte-estilo-cultura",
      sectors: ["arte-estilo-cultura", "salud-bienestar-belleza"],
      specialties: ["fine-line", "microrealismo", "piercing-titanio"],
      capabilities: {
        petFriendly: true,
        wheelchairAccessible: false,
        onlineBooking: true,
      },
      zone: "palma",
      address: "Santa Catalina, Palma",
      coordinates: { lat: 39.57, lng: 2.64 },
      rating: 4.9,
      reviewCount: 450,
      priceRange: "€€",
      verified: true,
      featured: true,
      status: "open",
      phone: "+34 971 44 55 66",
      whatsapp: "+34 971 44 55 66",
      email: "info@tattoo-demo.com",
      website: "https://tattoo-demo.com",
      googleMapsUrl: "https://maps.google.com/?q=tattoo-demo",
      appleMapsUrl: "https://maps.apple.com/?q=tattoo-demo",
      bingMapsUrl: "https://bing.com/maps?q=tattoo-demo",
      tags: ["zona:santa-catalina", "mod:cita-previa", "product:fine-line"],
      shortDescription: {
        es: "Estudio de tatuaje fine line",
        en: "Fine line tattoo studio",
        ca: "Estudi de tatuatge",
        de: "Fine Line Tattoo Studio",
      },
      fullDescription: { es: "Estudio", en: "Studio", ca: "Estudi", de: "Studio" },
      highlights: { es: [], en: [], ca: [], de: [] },
      servicesProvided: { es: [], en: [], ca: [], de: [] },
      image: "https://tattoo-demo.com/img.jpg",
      gallery: [],
      schedule: "11:00 - 20:00",
      lastVerifiedAt: "2026-08-26",
      createdAt: "2026-08-26",
      lastUpdatedAt: "2026-08-26",
      sourceConfidence: "high",
      auditLog: [],
    },
    {
      id: "emergency-locksmith",
      slug: "emergency-locksmith",
      name: "Cerrajería Urgente 24h Palma",
      category: "reformas-construccion",
      sectorId: "inmobiliaria-construccion-hogar",
      sectors: ["inmobiliaria-construccion-hogar", "seguridad-tecnologia"],
      specialties: ["apertura-puertas", "cambio-cerraduras", "emergencias-24h"],
      capabilities: {
        emergency24h: true,
        inVillaService: true,
      },
      emergency24h: true,
      inVillaService: true,
      zone: "palma",
      address: "Palma Centro",
      coordinates: { lat: 39.57, lng: 2.65 },
      rating: 4.7,
      reviewCount: 180,
      priceRange: "€€",
      verified: true,
      featured: false,
      status: "open",
      phone: "+34 971 77 88 99",
      whatsapp: "+34 971 77 88 99",
      email: "info@locksmith-demo.com",
      website: "https://locksmith-demo.com",
      googleMapsUrl: "https://maps.google.com/?q=locksmith-demo",
      appleMapsUrl: "https://maps.apple.com/?q=locksmith-demo",
      bingMapsUrl: "https://bing.com/maps?q=locksmith-demo",
      tags: ["zona:palma-centro", "mod:a-domicilio"],
      shortDescription: {
        es: "Cerrajería de urgencia 24h",
        en: "24h emergency locksmith",
        ca: "Serralleria 24h",
        de: "24h Not-Schlüsseldienst",
      },
      fullDescription: { es: "Cerrajería", en: "Locksmith", ca: "Serralleria", de: "Schlüsseldienst" },
      highlights: { es: [], en: [], ca: [], de: [] },
      servicesProvided: { es: [], en: [], ca: [], de: [] },
      image: "https://locksmith-demo.com/img.jpg",
      gallery: [],
      schedule: "24h / 7 días",
      lastVerifiedAt: "2026-08-26",
      createdAt: "2026-08-26",
      lastUpdatedAt: "2026-08-26",
      sourceConfidence: "high",
      auditLog: [],
    },
  ];

  const repo = new ServiceRepository(sampleData);

  it("finds businesses across multiple overlapping sectors (Cross-Sector Graph)", async () => {
    // When querying for sports sector, the agroturismo appears because it has padel
    const sportsResult = await repo.query({ sectors: ["deportes-fitness"] });
    expect(sportsResult.total).toBe(1);
    expect(sportsResult.items[0].id).toBe("finca-gastro-sports");

    // When querying for gastronomy, the agroturismo also appears
    const gastroResult = await repo.query({ sectors: ["gastronomia-hosteleria"] });
    expect(gastroResult.total).toBe(1);
    expect(gastroResult.items[0].id).toBe("finca-gastro-sports");
  });

  it("filters accurately by specific specialties", async () => {
    const fineLineResult = await repo.query({ specialties: ["fine-line"] });
    expect(fineLineResult.total).toBe(1);
    expect(fineLineResult.items[0].id).toBe("tattoo-fine-line");

    const paellaResult = await repo.query({ specialties: ["paellas"] });
    expect(paellaResult.total).toBe(1);
    expect(paellaResult.items[0].id).toBe("finca-gastro-sports");
  });

  it("filters by capabilities matrix (Pet Friendly & Wheelchair Accessible)", async () => {
    // Pet Friendly: should return Finca and Tattoo studio
    const petFriendlyResult = await repo.query({ capabilities: { petFriendly: true } });
    expect(petFriendlyResult.total).toBe(2);

    // Wheelchair Accessible: only Finca
    const wheelchairResult = await repo.query({ capabilities: { wheelchairAccessible: true } });
    expect(wheelchairResult.total).toBe(1);
    expect(wheelchairResult.items[0].id).toBe("finca-gastro-sports");

    // Emergency 24h: only Locksmith
    const emergencyResult = await repo.query({ capabilities: { emergency24h: true } });
    expect(emergencyResult.total).toBe(1);
    expect(emergencyResult.items[0].id).toBe("emergency-locksmith");
  });

  it("executes multidimensional composite query (Sector + Zone + Capability + Min Rating)", async () => {
    const compositeResult = await repo.query({
      sectors: ["arte-estilo-cultura"],
      zone: "palma",
      capabilities: { petFriendly: true },
      minRating: 4.8,
    });

    expect(compositeResult.total).toBe(1);
    expect(compositeResult.items[0].id).toBe("tattoo-fine-line");
    expect(compositeResult.items[0].rating).toBe(4.9);
  });
});
