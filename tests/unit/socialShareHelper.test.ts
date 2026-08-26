/**
 * tests/unit/socialShareHelper.test.ts
 *
 * Test suite para el generador de compartir en redes sociales (socialShareHelper.ts).
 * Verifica la creación de hashtags, formateo de mensajes, URLs de plataformas y soporte multiidioma.
 *
 * GR-05: Todo feature con tests.
 */

import { describe, it, expect } from "vitest";
import { formatToHashtag, generateSocialShareData } from "../../src/lib/socialShareHelper";
import type { ServiceItem } from "../../src/data/services/types";

const MOCK_SERVICE: ServiceItem = {
  id: "dins-santi-taura",
  slug: "dins-santi-taura",
  name: "DINS Santi Taura",
  category: "gastronomia-restaurantes",
  sectorId: "gastronomia-restaurantes",
  sectors: ["gastronomia-restaurantes"],
  zone: "palma",
  address: "Plaça de Llorenç Villalonga, 4, 07001 Palma",
  coordinates: { lat: 39.5696, lng: 2.6502 },
  rating: 4.8,
  reviewCount: 320,
  priceRange: "€€€€",
  verified: true,
  featured: true,
  status: "open",
  culturalIdentity: "mallorquin_heritage",
  targetAudience: ["residentes", "turistas"],
  languagesSpoken: ["es", "en", "ca"],
  phone: "+34 971 720 000",
  whatsapp: "+34 971 720 000",
  email: "reservas@dinssantitaura.com",
  website: "https://dinssantitaura.com",
  googleMapsUrl: "https://www.google.com/maps/search/DINS+Santi+Taura+Mallorca",
  appleMapsUrl: "https://maps.apple.com/?q=DINS+Santi+Taura",
  bingMapsUrl: "https://www.bing.com/maps?q=DINS+Santi+Taura",
  tags: ["zona:palma", "product:alta-cocina", "amb:mar"],
  capabilities: { terrace: true, seaViews: true },
  shortDescription: {
    es: "Restaurante con Estrella Michelin en el casco antiguo de Palma, reinterpretando el recetario tradicional balear.",
    en: "Michelin-starred restaurant in Palma's old town, reinterpreting traditional Balearic cuisine with contemporary flair.",
    ca: "Restaurant amb Estrella Michelin al casc antic de Palma, reinterpretant el receptari tradicional balear.",
    de: "Michelin-Stern-Restaurant in Palmas Altstadt, das traditionelle balearische Rezepte modern interpretiert.",
  },
  fullDescription: {
    es: "DINS Santi Taura ofrece un viaje gastronómico a través de la historia culinaria de Mallorca.",
    en: "DINS Santi Taura offers a culinary journey through Mallorca's gastronomic heritage.",
    ca: "DINS Santi Taura ofereix un viatge gastronòmic a través de la història culinària de Mallorca.",
    de: "DINS Santi Taura bietet eine kulinarische Reise durch Mallorcas Gastronomiegeschichte.",
  },
  specialties: {
    es: ["Panades de peix de roca", "Arroz brut contemporáneo"],
    en: ["Rockfish panades", "Contemporary arròs brut"],
    ca: ["Panades de peix de roca", "Arròs brut contemporani"],
    de: ["Panades mit Felsfisch", "Zeitgenössischer Arròs Brut"],
  },
  highlights: {
    es: ["Estrella Michelin", "Ubicación histórica"],
    en: ["Michelin Star", "Historic location"],
    ca: ["Estrella Michelin", "Ubicació històrica"],
    de: ["Michelin-Stern", "Historischer Standort"],
  },
  servicesProvided: {
    es: ["Menú degustación"],
    en: ["Tasting menu"],
    ca: ["Menú degustació"],
    de: ["Degustationsmenü"],
  },
  founderStory: {
    es: "Santi Taura ha dedicado su carrera a recuperar la memoria culinaria de las Islas Baleares.",
    en: "Santi Taura has dedicated his career to reviving the culinary memory of the Balearic Islands.",
    ca: "Santi Taura ha dedicat la seva carrera a recuperar la memòria culinària de les Illes Balears.",
    de: "Santi Taura hat seine Karriere der Wiederbelebung der kulinarischen Tradition Mallorcas gewidmet.",
  },
  image: "/images/services/dins-santi-taura.jpg",
  gallery: [],
  schedule: "Miércoles a Domingo: 13:30 - 15:30, 20:00 - 22:30",
  confidenceScore: 98,
  verificationStatus: "verified",
};

describe("socialShareHelper", () => {
  describe("formatToHashtag()", () => {
    it("convierte frases con espacios y tildes a Hashtags limpios", () => {
      expect(formatToHashtag("Gastronomía Mallorca")).toBe("#GastronomiaMallorca");
      expect(formatToHashtag("Palma de Mallorca")).toBe("#PalmaDeMallorca");
      expect(formatToHashtag("Spas & Bienestar")).toBe("#SpasBienestar");
      expect(formatToHashtag("Calvià")).toBe("#Calvia");
    });

    it("retorna string vacío si la entrada es vacía o nula", () => {
      expect(formatToHashtag("")).toBe("");
      expect(formatToHashtag("   ")).toBe("");
    });
  });

  describe("generateSocialShareData()", () => {
    const pageUrl = "https://serviciosmallorca.com/es/servicios/dins-santi-taura";

    it("genera hashtags pertinentes de categoría y zona", () => {
      const data = generateSocialShareData(MOCK_SERVICE, "es", pageUrl);

      expect(data.hashtags).toContain("#Mallorca");
      expect(data.hashtags).toContain("#ServiciosMallorca");
      expect(
        data.hashtags.some((h) => h.toLowerCase().includes("gastronomia") || h.toLowerCase().includes("restaurante")),
      ).toBe(true);
      expect(data.hashtagsString).toContain("#Mallorca");
    });

    it("incluye el nombre del negocio, rating y enlace en el texto completo", () => {
      const data = generateSocialShareData(MOCK_SERVICE, "es", pageUrl);

      expect(data.fullShareText).toContain("DINS Santi Taura");
      expect(data.fullShareText).toContain("4.8/5");
      expect(data.fullShareText).toContain("Mallorca");
      expect(data.fullShareText).toContain(pageUrl);
      expect(data.fullShareText).toContain("#Mallorca");
    });

    it("genera URLs de compartir válidas para todas las plataformas", () => {
      const data = generateSocialShareData(MOCK_SERVICE, "es", pageUrl);

      // WhatsApp
      expect(data.shareUrls.whatsapp).toContain("https://api.whatsapp.com/send?text=");
      expect(data.shareUrls.whatsapp).toContain(encodeURIComponent(pageUrl));

      // Twitter / X
      expect(data.shareUrls.twitter).toContain("https://twitter.com/intent/tweet?text=");
      expect(data.shareUrls.twitter).toContain("hashtags=");

      // Telegram
      expect(data.shareUrls.telegram).toContain("https://t.me/share/url?url=");

      // LinkedIn
      expect(data.shareUrls.linkedin).toContain("https://www.linkedin.com/sharing/share-offsite/?url=");

      // Facebook
      expect(data.shareUrls.facebook).toContain("https://www.facebook.com/sharer/sharer.php?u=");

      // Email
      expect(data.shareUrls.email).toContain("mailto:?subject=");
      expect(data.shareUrls.email).toContain(encodeURIComponent("DINS Santi Taura"));
    });

    it("soporta los 4 idiomas oficiales (ES, EN, CA, DE)", () => {
      const locales: Array<"es" | "en" | "ca" | "de"> = ["es", "en", "ca", "de"];

      for (const locale of locales) {
        const data = generateSocialShareData(
          MOCK_SERVICE,
          locale,
          `https://serviciosmallorca.com/${locale}/servicios/dins-santi-taura`,
        );
        expect(data.title).toBeDefined();
        expect(data.fullShareText).toBeDefined();
        expect(data.shareUrls.whatsapp).toBeDefined();
        expect(data.shareUrls.twitter).toBeDefined();
        expect(data.nativeSharePayload.url).toContain(`/${locale}/`);
      }
    });

    it("maneja negocios sin rating o con descripción breve vacía de forma elegante", () => {
      const minimalService: ServiceItem = {
        ...MOCK_SERVICE,
        rating: null,
        reviewCount: null,
        shortDescription: { es: "", en: "", ca: "", de: "" },
      };

      const data = generateSocialShareData(minimalService, "es", pageUrl);
      expect(data.title).toContain("DINS Santi Taura");
      expect(data.ratingText).toBe("");
      expect(data.fullShareText).toContain("DINS Santi Taura");
      expect(data.shareUrls.whatsapp).toBeDefined();
    });
  });
});
