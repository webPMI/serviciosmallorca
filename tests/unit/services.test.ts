import { describe, it, expect } from "vitest";
import {
  SERVICES,
  getServiceById,
  getFeaturedServices,
  getServicesByCategory,
  getServicesByZone,
} from "../../src/data/services";
import { BLOG_POSTS, getPostBySlug, getFeaturedPosts } from "../../src/data/posts";
import { CATEGORIES } from "../../src/data/categories";
import { MALLORCA_ZONES } from "../../src/data/zones";

describe("Servicios Mallorca Data Layer", () => {
  describe("Categories and Zones", () => {
    it("defines valid categories with multilingual names and getActiveCategories filter", async () => {
      const { getActiveCategories, getActiveSuperSectors, SUPER_SECTORS } = await import("../../src/data/categories");
      expect(CATEGORIES.length).toBeGreaterThan(0);
      expect(SUPER_SECTORS.length).toBeGreaterThan(0);

      for (const cat of CATEGORIES) {
        expect(cat.id).toBeDefined();
        expect(cat.sectorId).toBeDefined();
        expect(cat.synonyms.length).toBeGreaterThan(0);
        expect(cat.name.es).toBeDefined();
        expect(cat.name.en).toBeDefined();
        expect(cat.name.ca).toBeDefined();
        expect(cat.icon).toBeDefined();
      }

      // When services is empty, active categories should be empty
      expect(getActiveCategories([])).toEqual([]);
      expect(getActiveSuperSectors([])).toEqual([]);

      // When a service with category exists, it should be included
      const activeSample = getActiveCategories([{ category: "arte-tatuajes" }]);
      expect(activeSample.length).toBe(1);
      expect(activeSample[0].id).toBe("arte-tatuajes");

      const activeSectors = getActiveSuperSectors([{ category: "arte-tatuajes" }]);
      expect(activeSectors.length).toBe(1);
      expect(activeSectors[0].id).toBe("arte-estilo-cultura");
    });

    it("defines Mallorca zones with popular areas", () => {
      expect(MALLORCA_ZONES.length).toBeGreaterThan(0);
      for (const zone of MALLORCA_ZONES) {
        expect(zone.id).toBeDefined();
        expect(zone.name.es).toBeDefined();
        expect(zone.name.en).toBeDefined();
        expect(zone.name.ca).toBeDefined();
        expect(zone.popularAreas.length).toBeGreaterThan(0);
      }
    });
  });

  describe("Services repository", () => {
    it("handles query operations safely on catalog", () => {
      expect(Array.isArray(SERVICES)).toBe(true);
      expect(SERVICES.length).toBeGreaterThanOrEqual(3);
      expect(getServiceById("non-existent")).toBeUndefined();
      expect(getServiceById("kuyen-art-tattoo")).toBeDefined();
      expect(getServiceById("box-tattoo-piercing")).toBeDefined();
      expect(getServiceById("dins-santi-taura")).toBeDefined();
      expect(getServiceById("ca-n-eduardo")).toBeDefined();
      expect(getFeaturedServices().length).toBeGreaterThanOrEqual(2);
      expect(getServicesByCategory("arte-tatuajes").length).toBeGreaterThanOrEqual(2);
      expect(getServicesByCategory("gastronomia-catering").length).toBeGreaterThanOrEqual(1);
      expect(getServicesByZone("palma").length).toBeGreaterThanOrEqual(3);
    });

    it("validates a well-formed ServiceItem structure", () => {
      const categoryIds = CATEGORIES.map((c) => c.id);
      const zoneIds = MALLORCA_ZONES.map((z) => z.id);

      for (const service of SERVICES) {
        expect(service.id).toBeDefined();
        expect(service.slug).toBeDefined();
        expect(categoryIds).toContain(service.category);
        expect(zoneIds).toContain(service.zone);
        expect(service.rating).toBeGreaterThanOrEqual(1);
        expect(service.rating).toBeLessThanOrEqual(5);
        expect(service.phone).toBeDefined();
        expect(service.shortDescription.es).toBeDefined();
        expect(service.shortDescription.en).toBeDefined();
        expect(service.shortDescription.ca).toBeDefined();
      }
    });
  });

  describe("Blog posts repository", () => {
    it("has valid blog posts with multilingual content", () => {
      expect(BLOG_POSTS.length).toBeGreaterThan(0);
      for (const post of BLOG_POSTS) {
        expect(post.slug).toBeDefined();
        expect(post.title.es).toBeDefined();
        expect(post.title.en).toBeDefined();
        expect(post.title.ca).toBeDefined();
        expect(post.author.name).toBeDefined();
      }
    });

    it("fetches blog post by slug correctly", () => {
      const first = BLOG_POSTS[0];
      expect(getPostBySlug(first.slug)).toEqual(first);
      expect(getPostBySlug("non-existent")).toBeUndefined();
    });

    it("fetches featured posts", () => {
      const featured = getFeaturedPosts();
      expect(featured.every((p) => p.featured)).toBe(true);
    });
  });

  describe("Zero Duplicates and Integrity Enforcement", () => {
    it("verifies that SERVICES has zero duplicate ids, slugs, names, or websites", async () => {
      const { validateServicesList } = await import("../../src/lib/validateServices");
      const result = validateServicesList(SERVICES);
      expect(result.errors).toEqual([]);
      expect(result.valid).toBe(true);
    });

    it("verifies that all services have valid geo coordinates within Mallorca", () => {
      for (const service of SERVICES) {
        expect(service.coordinates).toBeDefined();
        expect(service.coordinates.lat).toBeGreaterThan(39.0);
        expect(service.coordinates.lat).toBeLessThan(40.1);
        expect(service.coordinates.lng).toBeGreaterThan(2.2);
        expect(service.coordinates.lng).toBeLessThan(3.6);
      }
    });

    it("verifies that all services provide Google, Apple, and Bing Maps URLs", () => {
      for (const service of SERVICES) {
        expect(service.googleMapsUrl).toContain("google.com/maps");
        expect(service.appleMapsUrl).toContain("maps.apple.com");
        expect(service.bingMapsUrl).toContain("bing.com/maps");
      }
    });

    it("verifies that all services have unique main image URLs with zero cross-duplicates", () => {
      const mainImages = SERVICES.map((s) => s.image).filter((img) => img && img.trim() !== "");
      const uniqueImages = new Set(mainImages);
      expect(uniqueImages.size).toBe(mainImages.length);
    });

    it("enforces Zero Stock Photos Rule (GR-11): rejects Unsplash, Pexels, Pixabay, and other generic placeholders", () => {
      const forbiddenDomains = [
        "unsplash.com",
        "pexels.com",
        "pixabay.com",
        "freepik.com",
        "placeholder",
        "dummyimage",
        "loremflickr",
        "stock.adobe.com",
        "shutterstock.com",
      ];

      for (const service of SERVICES) {
        const allImages = [
          service.image,
          ...(service.images ?? []),
          ...(service.gallery ?? []),
        ].filter(Boolean) as string[];

        for (const img of allImages) {
          for (const forbidden of forbiddenDomains) {
            expect(img.toLowerCase()).not.toContain(forbidden);
          }
        }
      }
    });
  });
});

