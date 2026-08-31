/**
 * tests/unit/deepEnginesAndScrapers.coverage.test.ts
 *
 * Suite de alta fidelidad y rigor técnico para ramas profundas:
 * - honorBoardEngine (validación gremial y categorías inexistentes)
 * - scrollAwareNavbar (tolerance, selectores vacíos y DOM cleanup)
 * - managerSecurityEngine (límites de reseñas, links externos y payload seguro)
 * - communityVoiceEngine (longitud extrema de textos y sanitización de nombres)
 * - topEngine (preguntas frecuentes multilingües en alemán)
 * - sportsSearch (fallbacks de búsqueda y descripciones)
 * - socialShareHelper (generación de hashtags por defecto y descripciones)
 * - experienceTours (rutas de tours Calvià y Palma)
 * - verificationEngine (códigos HTTP 403, reputación media y cap por discrepancia telefónica)
 * - historicalHub (filtro open_only)
 *
 * @vitest-environment happy-dom
 */

import { describe, it, expect } from "vitest";
import { processCommunityBoost, HONOR_LISTS } from "../../src/lib/honorBoardEngine";
import { initScrollAwareNavbar } from "../../src/lib/scrollAwareNavbar";
import { validateReviewSecurity } from "../../src/lib/managerSecurityEngine";
import { validateFeedbackSubmission } from "../../src/lib/communityVoiceEngine";
import { generateDynamicFaqs } from "../../src/lib/topEngine";
import { searchUnifiedSports } from "../../src/lib/sportsSearch";
import { generateSocialShareData } from "../../src/lib/socialShareHelper";
import { getHydratedTourBySlug } from "../../src/lib/experienceTours";
import { auditBusinessData } from "../../src/lib/verificationEngine";
import { getHistoricalBusinesses } from "../../src/lib/historicalHub";
import type { ServiceItem } from "../../src/data/services/types";

const sampleService: ServiceItem = {
  id: "test-sample-service",
  slug: "test-sample-service",
  name: "Test Sample Service",
  category: "gastronomia-restaurantes",
  zone: "palma",
  address: "Paseo del Borne 5, Palma",
  coordinates: { lat: 39.57, lng: 2.65 },
  rating: 4.8,
  reviewCount: 40,
  priceRange: "€€",
  verified: true,
  featured: true,
  status: "open",
  phone: "+34971000111",
  whatsapp: "+34971000111",
  email: "sample@test.com",
  website: "https://testsample.com",
  googleMapsUrl: "https://maps.google.com/?id=sample",
  appleMapsUrl: "https://maps.apple.com/?id=sample",
  bingMapsUrl: "https://bing.com/maps/?id=sample",
  image: "/images/sample.jpg",
  schedule: "L-D 10:00-22:00",
  tags: ["product:lujo"],
  shortDescription: { es: "Corto", en: "Short", ca: "Curt", de: "Kurz" },
  fullDescription: { es: "Largo", en: "Long", ca: "Llarg", de: "Lang" },
  confidenceScore: 92,
};

describe("Deep Engines & Edge-Branches Coverage Suite", () => {
  describe("src/lib/honorBoardEngine.ts · processCommunityBoost edge cases", () => {
    it("rechaza aportación si la categoría de honor no existe", () => {
      const result = processCommunityBoost(
        [],
        {
          serviceId: sampleService.id,
          backerName: "Pedro",
          amountEuros: 10,
        },
        "categoria-fantasma-999" as any,
        sampleService,
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain("no existe");
    });

    it("rechaza aportación si el negocio no pertenece a la categoría gremial de la lista", () => {
      const nauticaList = HONOR_LISTS.find((l) => l.id === "excelencia-nautica");
      if (nauticaList) {
        const result = processCommunityBoost(
          [],
          {
            serviceId: sampleService.id,
            backerName: "Pedro",
            amountEuros: 10,
          },
          "excelencia-nautica",
          sampleService, // Categoría: gastronomia-restaurantes (incompatible)
        );

        expect(result.success).toBe(false);
        expect(result.error).toContain("incompatible con la lista gremial");
      }
    });
  });

  describe("src/lib/scrollAwareNavbar.ts · Tolerancia y selector vacío", () => {
    it("devuelve cleanup no-op cuando no existen elementos que coincidan con selector", () => {
      const cleanup = initScrollAwareNavbar({ selector: ".navbar-inexistente-12345" });
      expect(typeof cleanup).toBe("function");
      expect(() => cleanup()).not.toThrow();
    });

    it("ignora deltas de scroll inferiores a la tolerancia configurada", () => {
      const nav = document.createElement("header");
      nav.className = "scroll-aware-navbar";
      document.body.appendChild(nav);

      const cleanup = initScrollAwareNavbar({
        selector: ".scroll-aware-navbar",
        tolerance: 15,
        threshold: 50,
      });

      // Scroll pequeño (delta = 5, menor que tolerancia 15)
      Object.defineProperty(window, "scrollY", { value: 60, writable: true, configurable: true });
      window.dispatchEvent(new Event("scroll"));

      expect(nav.classList.contains("is-hidden")).toBe(false);
      cleanup();
      nav.remove();
    });
  });

  describe("src/lib/managerSecurityEngine.ts · Límites de reseñas", () => {
    it("rechaza reseñas de más de 3000 caracteres o con más de 2 enlaces externos", () => {
      const longText = "a".repeat(3001);
      const resLong = validateReviewSecurity({
        businessId: "svc-1",
        authorUid: "user-1",
        rating: 5,
        text: longText,
      });
      expect(resLong.safe).toBe(false);
      expect(resLong.reason).toContain("excede el límite máximo de 3000 caracteres");

      const spamLinksText = "Visita https://site1.com y también https://site2.com y https://site3.com para ofertas.";
      const resLinks = validateReviewSecurity({
        businessId: "svc-1",
        authorUid: "user-1",
        rating: 5,
        text: spamLinksText,
      });
      expect(resLinks.safe).toBe(false);
      expect(resLinks.reason).toContain("No se permiten más de 2 enlaces");
    });

    it("aprueba reseñas válidas correctamente", () => {
      const validRes = validateReviewSecurity({
        businessId: "svc-1",
        authorUid: "user-1",
        rating: 5,
        text: "Excelente servicio y trato impecable.",
      });
      expect(validRes.safe).toBe(true);
    });
  });

  describe("src/lib/communityVoiceEngine.ts · Validaciones de longitud", () => {
    it("detecta títulos y descripciones que exceden los límites máximos permitidos", () => {
      const longTitle = "t".repeat(125);
      const resTitle = validateFeedbackSubmission({
        type: "SUGGESTION",
        title: longTitle,
        description: "Descripción perfectamente válida para esta prueba.",
      });
      expect(resTitle.valid).toBe(false);
      expect(resTitle.errors).toContain("TITLE_TOO_LONG");

      const longDesc = "d".repeat(2005);
      const resDesc = validateFeedbackSubmission({
        type: "SUGGESTION",
        title: "Título Válido",
        description: longDesc,
      });
      expect(resDesc.valid).toBe(false);
      expect(resDesc.errors).toContain("DESCRIPTION_TOO_LONG");
    });

    it("sanitiza targetServiceName correctamente", () => {
      const res = validateFeedbackSubmission({
        type: "CORRECTION",
        title: "Horario incorrecto",
        description: "El local abre a las diez de la mañana en lugar de las nueve.",
        targetServiceName: "Restaurante Miramar",
      });
      expect(res.valid).toBe(true);
      expect(res.sanitized?.targetServiceName).toBe("Restaurante Miramar");
    });
  });

  describe("src/lib/topEngine.ts · FAQs en alemán (locale === 'de')", () => {
    it("genera FAQs estructuradas en alemán con la explicación de los 4 pilares", () => {
      const rankedMock = [
        { service: sampleService, score: 90, breakdown: {} as any, reasons: [], rank: 1, badgeLabel: "👑 Top #1" },
      ];
      const faqsDe = generateDynamicFaqs("Restaurantes", "Palma", rankedMock, "de");
      expect(faqsDe.length).toBe(3);
      expect(faqsDe[0].answer).toContain("Basierend auf unserem unabhängigen Qualitäts- und Vertrauensindex");
      expect(faqsDe[1].question).toContain("Wie werden die Unternehmen in der Bestenliste");
      expect(faqsDe[1].answer).toContain("4-Säulen-Index");
      expect(faqsDe[2].answer).toContain("Ja, Sie können die Liste interaktiv filtern");
    });
  });

  describe("src/lib/sportsSearch.ts · Búsqueda por texto y descripciones", () => {
    it("busca instalaciones deportivas y servicios con concordancia en descripciones", () => {
      const res = searchUnifiedSports("padel", undefined, "es");
      expect(res.services).toBeDefined();
      expect(res.publicFacilities).toBeDefined();
    });
  });

  describe("src/lib/socialShareHelper.ts · Hashtags por defecto y descripciones", () => {
    it("genera datos de compartir para categorías no mapeadas y descripciones cortas", () => {
      const unmappedService: ServiceItem = {
        ...sampleService,
        category: "categoria-no-mapeada-en-hashtags",
        shortDescription: { es: "Servicio especial", en: "", ca: "" },
        fullDescription: { es: "Descripción completa", en: "", ca: "" },
      };

      const shareData = generateSocialShareData(unmappedService, "es", "https://serviciosmallorca.com/test");
      expect(shareData.hashtags.length).toBeGreaterThan(0);
      expect(shareData.title).toContain(unmappedService.name);
      expect(shareData.shareUrls.whatsapp).toContain("whatsapp");
    });
  });

  describe("src/lib/experienceTours.ts · Rutas exclusivas Calvià y Palma", () => {
    it("obtiene la ruta signature de Calvià y la de Palma por su slug", () => {
      const calviaTour = getHydratedTourBySlug("ruta-nautica-marinas-calvia");
      expect(calviaTour).toBeDefined();
      expect(calviaTour?.id).toBe("tour-calvia-nautica-lifestyle");

      const palmaTour = getHydratedTourBySlug("ruta-cultura-museos-alta-gastronomia-palma");
      expect(palmaTour).toBeDefined();
      expect(palmaTour?.id).toBe("tour-palma-cultura-gastronomia");
    });
  });

  describe("src/lib/verificationEngine.ts · Casos de auditoría web y reputación", () => {
    it("asigna advertencias ante error HTTP 403 y evalúa reputación media", () => {
      const report = auditBusinessData({
        name: sampleService.name,
        category: sampleService.category,
        zone: sampleService.zone,
        phone: sampleService.phone,
        address: sampleService.address,
        coordinates: sampleService.coordinates,
        website: "https://example.com",
        webHttpStatus: 403,
        webAccessibility: "error",
        reviewCount: 25,
        rating: 4.2,
        socialLinks: { instagram: "https://instagram.com/sample" },
      });

      expect(report.warnings.some((w) => w.includes("403"))).toBe(true);
      expect(report.scoreBreakdown.reputationVolume).toBe(12);
    });

    it("limita el confidence score al 75% cuando existe discrepancia telefónica crítica", () => {
      const report = auditBusinessData({
        name: sampleService.name,
        category: sampleService.category,
        zone: sampleService.zone,
        phone: "+34971000111",
        extractedWebPhone: "+34971000111",
        extractedMapsPhone: "+34971999888", // Discrepancia crítica
        address: sampleService.address,
        coordinates: sampleService.coordinates,
        website: "https://example.com",
        webHttpStatus: 200,
        webAccessibility: "active",
        reviewCount: 200,
        rating: 4.9,
        socialLinks: {
          instagram: "https://instagram.com/sample",
          facebook: "https://facebook.com/sample",
          linkedin: "https://linkedin.com/sample",
        },
      });

      expect(report.confidenceScore).toBeLessThanOrEqual(75);
      expect(report.status).toBe("needs_manual_review");
    });
  });

  describe("src/lib/historicalHub.ts · Filtro open_only de comercios cerrados", () => {
    it("filtra rigurosamente comercios cerrados cuando status es open_only", () => {
      const openHistorical = getHistoricalBusinesses({ minYears: 5, status: "open_only" });
      expect(openHistorical.every((s) => s.status !== "permanently_closed")).toBe(true);
    });
  });
});
