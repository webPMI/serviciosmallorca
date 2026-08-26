import { describe, it, expect } from "vitest";
import { processRawBusinessBatch } from "../../scripts/batch-ingest.ts";
import { runAnomalyAndQualityAudit } from "../../scripts/anomaly-audit.ts";
import type { VerificationInput } from "../../src/lib/verificationEngine.ts";
import type { ServiceItem } from "../../src/data/services/types.ts";

describe("Batch Ingestion & QA Anomaly Pipeline", () => {
  it("processes a raw batch and routes high-confidence items to approved and low-confidence to review queue", () => {
    const rawBatch: VerificationInput[] = [
      {
        name: "Restaurante Alta Confianza",
        category: "gastronomia-catering",
        zone: "palma",
        address: "Carrer de Jaume III, 1, Palma",
        coordinates: { lat: 39.571, lng: 2.645 },
        website: "https://restaurante-altaconfianza.es",
        phone: "+34 971 00 11 22",
        extractedWebPhone: "+34 971 00 11 22",
        extractedMapsPhone: "+34 971 00 11 22",
        rating: 4.8,
        reviewCount: 350,
        webHttpStatus: 200,
      },
      {
        name: "Negocio Dudoso Sin Telefono Ni Coordenadas",
        category: "servicios-profesionales",
        zone: "palma",
        address: "Direccion Incompleta",
        webHttpStatus: 404,
      },
    ];

    const result = processRawBusinessBatch(rawBatch);

    expect(result.totalProcessed).toBe(2);
    expect(result.approvedCount).toBe(1);
    expect(result.needsReviewCount).toBe(1);
    expect(result.itemsApproved[0].name).toBe("Restaurante Alta Confianza");
    expect(result.itemsApproved[0].score).toBeGreaterThanOrEqual(80);
    expect(result.itemsNeedsReview[0].name).toBe("Negocio Dudoso Sin Telefono Ni Coordenadas");
    expect(result.itemsNeedsReview[0].score).toBeLessThan(80);
  });

  it("audits catalog and accurately generates a 5% random sampling", () => {
    const auditReport = runAnomalyAndQualityAudit();

    expect(auditReport.totalCatalogSize).toBeGreaterThan(0);
    expect(auditReport.sectorAudits.length).toBeGreaterThan(0);
    expect(auditReport.sampleAudited5Percent.length).toBeGreaterThan(0);
    expect(auditReport.sampleAudited5Percent.length).toBe(Math.max(1, Math.round(auditReport.totalCatalogSize * 0.05)));
  });

  it("detects anomalies when a sector has >10% drop rate", () => {
    const mockServices: ServiceItem[] = [
      {
        id: "valid-1",
        slug: "valid-1",
        name: "Valid 1",
        category: "gastronomia-catering",
        sectorId: "gastronomia-hosteleria",
        culturalIdentity: "mallorquin_heritage",
        zone: "palma",
        address: "Palma",
        rating: 4.5,
        reviewCount: 100,
        verified: true,
        featured: false,
        status: "open",
        seasonality: "year_round",
        isIconicHeritage: false,
        confidenceScore: 90,
        verificationStatus: "verified",
        priceRange: "€€",
        targetAudience: ["residentes"],
        languagesSpoken: ["es"],
        emergency24h: false,
        inVillaService: false,
        features: [],
        paymentMethods: [],
        amenities: [],
        certifications: [],
        pricing: { rateType: "fixed" },
        teamMembers: [],
        faqs: [],
        coordinates: { lat: 39.5696, lng: 2.6502 },
        whatsapp: "+34 971 11 11 11",
        email: "info@valid1.com",
        phone: "+34 971 11 11 11",
        website: "https://valid1.com",
        googleMapsUrl: "https://maps.google.com/?q=valid1",
        appleMapsUrl: "https://maps.apple.com/?q=valid1",
        bingMapsUrl: "https://bing.com/maps?q=valid1",
        tags: ["mod:cita-previa"],
        shortDescription: { es: "Desc", en: "Desc", ca: "Desc", de: "Desc" },
        fullDescription: { es: "Desc", en: "Desc", ca: "Desc", de: "Desc" },
        highlights: { es: [], en: [], ca: [], de: [] },
        servicesProvided: { es: [], en: [], ca: [], de: [] },
        image: "https://valid1.com/img.jpg",
        gallery: [],
        schedule: "10:00 - 20:00",
        lastVerifiedAt: "2026-08-26",
        createdAt: "2026-08-26",
        lastUpdatedAt: "2026-08-26",
        sourceConfidence: "high",
        auditLog: [],
      },
      {
        id: "invalid-1",
        slug: "invalid-1",
        name: "Invalid 1",
        category: "gastronomia-catering",
        sectorId: "gastronomia-hosteleria",
        culturalIdentity: "mallorquin_heritage",
        zone: "palma",
        address: "Palma",
        coordinates: { lat: 39.5696, lng: 2.6502 },
        whatsapp: "+34 971 22 22 22",
        email: "info@invalid1.com",
        rating: 2.0,
        reviewCount: 5,
        verified: false,
        featured: false,
        status: "open",
        seasonality: "year_round",
        isIconicHeritage: false,
        confidenceScore: 40, // Low confidence drop!
        verificationStatus: "needs_review",
        priceRange: "€€",
        targetAudience: ["residentes"],
        languagesSpoken: ["es"],
        emergency24h: false,
        inVillaService: false,
        features: [],
        paymentMethods: [],
        amenities: [],
        certifications: [],
        pricing: { rateType: "fixed" },
        teamMembers: [],
        faqs: [],
        phone: "+34 971 22 22 22",
        website: "https://invalid1.com",
        googleMapsUrl: "https://maps.google.com/?q=invalid1",
        appleMapsUrl: "https://maps.apple.com/?q=invalid1",
        bingMapsUrl: "https://bing.com/maps?q=invalid1",
        tags: ["mod:cita-previa"],
        shortDescription: { es: "Desc", en: "Desc", ca: "Desc", de: "Desc" },
        fullDescription: { es: "Desc", en: "Desc", ca: "Desc", de: "Desc" },
        highlights: { es: [], en: [], ca: [], de: [] },
        servicesProvided: { es: [], en: [], ca: [], de: [] },
        image: "https://invalid1.com/img.jpg",
        gallery: [],
        schedule: "10:00 - 20:00",
        lastVerifiedAt: "2026-08-26",
        createdAt: "2026-08-26",
        lastUpdatedAt: "2026-08-26",
        sourceConfidence: "low",
        auditLog: [],
      },
    ];

    const report = runAnomalyAndQualityAudit(mockServices);
    const gastroAudit = report.sectorAudits.find((s) => s.sector === "gastronomia-catering");

    expect(gastroAudit).toBeDefined();
    expect(gastroAudit?.lowConfidenceDropRate).toBe(50); // 1 out of 2 = 50%
    expect(gastroAudit?.isAnomalyDetected).toBe(true);
    expect(report.anomaliesFound).toBe(true);
  });
});
