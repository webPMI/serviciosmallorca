import { describe, it, expect } from "vitest";
import { generateServiceJsonLd } from "../../src/lib/jsonLdGenerator";
import { SERVICES } from "../../src/data/services";
import { elCaminoPalma } from "../../src/data/services/gastronomia-restaurantes/el-camino";
import { goodLuckTattoo } from "../../src/data/services/arte-tatuajes/good-luck-tattoo";
import { bufeteFrau } from "../../src/data/services/servicios-profesionales/bufete-frau";
import { roigPremium } from "../../src/data/services/motor-transporte/roig-premium";

describe("SEO & Schema.org JSON-LD Generation", () => {
  it("generates valid LocalBusiness Restaurant schema for Gastronomía", () => {
    const jsonLd = generateServiceJsonLd(
      elCaminoPalma,
      "es",
      "https://serviciosmallorca.com/es/servicios/el-camino-palma",
    );

    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toBe("Restaurant");
    expect(jsonLd.name).toBe("Restaurante El Camino Palma");
    expect(jsonLd.geo.latitude).toBeCloseTo(39.5712, 2);
    expect(jsonLd.geo.longitude).toBeCloseTo(2.6496, 2);
    expect(jsonLd.aggregateRating.ratingValue).toBe(4.8);
    expect(jsonLd.aggregateRating.reviewCount).toBeGreaterThan(100);
    expect(jsonLd.review.length).toBeGreaterThan(0);
    expect(jsonLd.hasOfferCatalog).toBeDefined();
  });

  it("generates valid TattooParlor schema for Arte & Tatuajes", () => {
    const jsonLd = generateServiceJsonLd(goodLuckTattoo, "es");

    expect(jsonLd["@type"]).toEqual(["LocalBusiness", "TattooParlor"]);
    expect(jsonLd.name).toBe("Good Luck Tattoo Mallorca");
    expect(jsonLd.aggregateRating.ratingValue).toBe(5.0);
    expect(jsonLd.address.addressLocality).toBe("palma");
  });

  it("generates valid LegalService schema for Bufete Frau", () => {
    const jsonLd = generateServiceJsonLd(bufeteFrau, "en");

    expect(jsonLd["@type"]).toBe("LegalService");
    expect(jsonLd.name).toBe("Bufete Frau Abogados & Asesores");
    expect(jsonLd.telephone).toBe("+34 971 22 80 36");
    expect(jsonLd.sameAs).toContain("https://bufetefrau.com");
  });

  it("generates valid AutoRental schema for Roig Premium", () => {
    const jsonLd = generateServiceJsonLd(roigPremium, "es");

    expect(jsonLd["@type"]).toEqual(["LocalBusiness", "AutoRental"]);
    expect(jsonLd.name).toBe("Roig Premium (VIP Chauffeur & Transfers)");
    expect(jsonLd.areaServed.name).toBe("Mallorca, Illes Balears");
  });

  it("generates valid JSON-LD for every single service in the catalog without crashing", () => {
    for (const service of SERVICES) {
      const jsonLdEs = generateServiceJsonLd(service, "es");
      const jsonLdEn = generateServiceJsonLd(service, "en");
      const jsonLdCa = generateServiceJsonLd(service, "ca");
      const jsonLdDe = generateServiceJsonLd(service, "de");

      expect(jsonLdEs["@context"]).toBe("https://schema.org");
      expect(jsonLdEs.name).toBe(service.name);
      expect(jsonLdEn.name).toBe(service.name);
      expect(jsonLdCa.name).toBe(service.name);
      expect(jsonLdDe.name).toBe(service.name);
      expect(jsonLdEs.geo.latitude).toBeTypeOf("number");
      expect(jsonLdEs.geo.longitude).toBeTypeOf("number");
    }
  });
});
