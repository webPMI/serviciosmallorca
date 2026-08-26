import { describe, it, expect } from "vitest";
import { smartMergeService } from "../../scripts/reharvest-catalog";
import type { ServiceItem } from "../../src/data/services/types";

describe("Catalog Re-Harvesting and Smart Merge Engine", () => {
  const mockExistingService: ServiceItem = {
    id: "restaurante-test",
    slug: "restaurante-test",
    name: "Restaurante Test Palma",
    category: "gastronomia-restaurantes",
    secondaryCategories: [],
    zone: "palma",
    address: "Carrer de la Mar, 10, Palma",
    coordinates: { lat: 39.5696, lng: 2.6502 },
    rating: 4.8,
    reviewCount: 45,
    priceRange: "€€",
    verified: true,
    featured: false,
    status: "open",
    seasonality: "year_round",
    culturalIdentity: "mallorquin_heritage",
    isIconicHeritage: false,
    targetAudience: ["residentes"],
    languagesSpoken: ["es", "ca"],
    emergency24h: false,
    inVillaService: false,
    features: ["wifi"],
    paymentMethods: ["credit_card"],
    amenities: ["wifi"],
    certifications: ["Registro Sanitario"],
    pricing: { startingPrice: "30€" },
    teamMembers: [],
    faqs: [],
    foundedYear: 2018,
    founderName: "Joan",
    founderStory: { es: "Historia auténtica", en: "", ca: "", de: "" },
    reputationBreakdown: {
      googleMaps: { rating: 4.8, reviewCount: 45, url: "https://maps.google.com" },
      totalReviewsAggregated: 45,
      overallWeightedRating: 4.8,
    },
    reviews: [],
    socialLinks: { instagram: "https://instagram.com/restaurantetest" },
    socialPosts: [],
    webDirectories: [],
    pressMentions: [],
    awards: [],
    authorityProfiles: [],
    googleMapsUrl: "https://maps.google.com",
    appleMapsUrl: "https://maps.apple.com",
    bingMapsUrl: "https://bing.com",
    phone: "+34 971 000 000",
    whatsapp: "+34 971 000 000",
    email: "info@test.com",
    website: "https://restaurantetest.com",
    tags: ["zona:palma"],
    shortDescription: { es: "Cocina tradicional", en: "", ca: "", de: "" },
    fullDescription: { es: "Descripción extensa y curada manualmente.", en: "", ca: "", de: "" },
    highlights: { es: ["Pescado fresco"], en: [], ca: [], de: [] },
    servicesProvided: { es: ["Cenas"], en: [], ca: [], de: [] },
    image: "https://test.com/foto.jpg",
    gallery: [],
    schedule: "Lun - Dom: 13:00 - 23:00",
    lastVerifiedAt: "2025-01-01",
    confidenceScore: 75,
  };

  it("merges newly discovered social networks without deleting existing ones", () => {
    const harvestedTemplate = {
      socialLinks: {
        instagram: "https://instagram.com/restaurantetest",
        youtube: "https://youtube.com/@restaurantetest",
        facebook: "https://facebook.com/restaurantetest",
      },
      confidenceScore: 92,
    };

    const { merged, diff } = smartMergeService(mockExistingService, harvestedTemplate);

    expect(merged.socialLinks?.instagram).toBe("https://instagram.com/restaurantetest");
    expect(merged.socialLinks?.youtube).toBe("https://youtube.com/@restaurantetest");
    expect(merged.socialLinks?.facebook).toBe("https://facebook.com/restaurantetest");
    expect(diff.addedFields).toContain("socialLinks.youtube");
    expect(diff.addedFields).toContain("socialLinks.facebook");
    expect(merged.confidenceScore).toBe(92);
  });

  it("adds menuUrl and specialties if newly discovered", () => {
    const harvestedTemplate = {
      menuUrl: "https://restaurantetest.com/carta.pdf",
      specialties: ["Arroz Meloso de Gamba", "Pescado de Lonja"],
      confidenceScore: 88,
    };

    const { merged, diff } = smartMergeService(mockExistingService, harvestedTemplate);

    expect(merged.menuUrl).toBe("https://restaurantetest.com/carta.pdf");
    expect(merged.specialties).toEqual(["Arroz Meloso de Gamba", "Pescado de Lonja"]);
    expect(diff.addedFields).toContain("menuUrl");
    expect(diff.addedFields).toContain("specialties");
  });

  it("preserves manual curated descriptions and founder stories", () => {
    const harvestedTemplate = {
      shortDescription: { es: "Sobrescritura automatica", en: "", ca: "", de: "" },
      confidenceScore: 85,
    };

    const { merged } = smartMergeService(mockExistingService, harvestedTemplate);

    expect(merged.fullDescription.es).toBe("Descripción extensa y curada manualmente.");
    expect(merged.founderStory?.es).toBe("Historia auténtica");
  });
});
