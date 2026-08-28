import { describe, it, expect } from "vitest";
import {
  calculateNextBidPrice,
  isEligibleForHonorSpot,
  rankHonorList,
  HONOR_LISTS,
  getDefaultHonorSpots,
  type HonorSpotEntry,
} from "../../src/lib/honorBoardEngine";
import type { ServiceItem } from "../../src/data/services";

const validService: ServiceItem = {
  id: "taller-artesano-palma",
  slug: "taller-artesano-palma",
  name: "Taller Artesano Palma",
  category: "arte-tatuajes",
  zone: "palma",
  address: "Carrer dels Oms 10, Palma",
  coordinates: { lat: 39.57, lng: 2.65 },
  rating: 4.9,
  reviewCount: 120,
  priceRange: "€€",
  verified: true,
  featured: true,
  status: "open",
  confidenceScore: 95,
  googleMapsUrl: "https://maps.google.com/?id=1",
  appleMapsUrl: "https://maps.apple.com/?id=1",
  bingMapsUrl: "https://bing.com/maps/?id=1",
  phone: "+34971000000",
  whatsapp: "+34971000000",
  email: "taller@artesano.com",
  website: "https://artesano.com",
  tags: ["Artesanía"],
  shortDescription: { es: "Taller", en: "Workshop", ca: "Taller" },
  fullDescription: { es: "Descripción completa", en: "Full description", ca: "Descripció" },
  image: "/images/artesano.jpg",
  schedule: "L-V 10:00-19:00",
};

describe("honorBoardEngine · Cuadro de Honor y Subastas de Reconocimiento", () => {
  describe("calculateNextBidPrice (Incremento de 1€)", () => {
    it("devuelve 1.00€ para un puesto nuevo sin pujas previas", () => {
      expect(calculateNextBidPrice(0)).toBe(1.0);
    });

    it("requiere 1.00€ adicional sobre la puja máxima actual", () => {
      expect(calculateNextBidPrice(5.0)).toBe(6.0);
      expect(calculateNextBidPrice(12.5)).toBe(13.5);
    });
  });

  describe("isEligibleForHonorSpot (Filtro Ético Zero Fake Data)", () => {
    it("aprueba servicios verificados con alta confianza (>=80%)", () => {
      const result = isEligibleForHonorSpot(validService);
      expect(result.eligible).toBe(true);
    });

    it("rechaza negocios cerrados permanentemente", () => {
      const closedService: ServiceItem = {
        ...validService,
        status: "permanently_closed",
      };
      const result = isEligibleForHonorSpot(closedService);
      expect(result.eligible).toBe(false);
      expect(result.reason).toContain("inactivos");
    });

    it("rechaza negocios con baja confianza (<80%) para evitar compra de spam", () => {
      const lowTrustService: ServiceItem = {
        ...validService,
        confidenceScore: 65,
        verified: false,
      };
      const result = isEligibleForHonorSpot(lowTrustService);
      expect(result.eligible).toBe(false);
      expect(result.reason).toContain("80%");
    });
  });

  describe("rankHonorList (Ordenación por puja y antigüedad)", () => {
    it("ordena descendentemente por puja económica", () => {
      const entries: HonorSpotEntry[] = [
        {
          id: "1",
          position: 0,
          serviceId: "s1",
          serviceName: "Servicio A",
          serviceSlug: "s-a",
          category: "nautica",
          zone: "palma",
          honorTitle: { es: "Título A", en: "Title A", ca: "Títol A", de: "Titel A" },
          currentBidEuros: 4.0,
          sponsorName: "User 1",
          nominatedAt: "2026-08-01T00:00:00Z",
          confidenceScore: 90,
          isVerified: true,
        },
        {
          id: "2",
          position: 0,
          serviceId: "s2",
          serviceName: "Servicio B",
          serviceSlug: "s-b",
          category: "nautica",
          zone: "calvia",
          honorTitle: { es: "Título B", en: "Title B", ca: "Títol B", de: "Titel B" },
          currentBidEuros: 10.0,
          sponsorName: "User 2",
          nominatedAt: "2026-08-02T00:00:00Z",
          confidenceScore: 95,
          isVerified: true,
        },
      ];

      const ranked = rankHonorList(entries);
      expect(ranked[0].serviceName).toBe("Servicio B");
      expect(ranked[0].position).toBe(1);
      expect(ranked[1].serviceName).toBe("Servicio A");
      expect(ranked[1].position).toBe(2);
    });
  });

  describe("Catálogo de Listas de Honor (HONOR_LISTS)", () => {
    it("define las 6 listas de honor esenciales de Mallorca con precio base de 1€", () => {
      expect(HONOR_LISTS).toHaveLength(6);
      HONOR_LISTS.forEach((list) => {
        expect(list.basePriceEuros).toBe(1.0);
        expect(list.bidIncrementEuros).toBe(1.0);
      });
    });

    it("provee datos de ejemplo verificados en getDefaultHonorSpots", () => {
      const spots = getDefaultHonorSpots();
      expect(spots["elite-general"].length).toBeGreaterThan(0);
      expect(spots["artesanos-sabor"].length).toBeGreaterThan(0);
    });
  });

  describe("isBusinessHonorRecognized (Detección para Badges Frontend)", () => {
    it("detecta comercios honoríficos configurados por defecto", () => {
      const res = isBusinessHonorRecognized("forn-sant-francesc-inca");
      expect(res.recognized).toBe(true);
      expect(res.sponsorName).toBe("Vecinos del Raiguer");
      expect(res.position).toBe(1);
    });

    it("devuelve recognized: false para comercios sin puesto de honor", () => {
      const res = isBusinessHonorRecognized("comercio-sin-honor-123");
      expect(res.recognized).toBe(false);
    });
  });

  describe("processHonorBid con Auditoría en Tiempo Real", () => {
    it("genera auditId y ejecuta el log de PAYMENT en D1 cuando se proporciona binding", () => {
      const spots = getDefaultHonorSpots()["elite-general"];
      const mockD1 = {
        prepare: () => ({ bind: () => ({ run: async () => ({}) }) }),
      };

      const result = processHonorBid(
        spots,
        {
          serviceId: validService.id,
          sponsorName: "Federación de Artesanos",
          bidAmountEuros: 15.0,
        },
        "elite-general",
        validService,
        mockD1,
      );

      expect(result.success).toBe(true);
      expect(result.auditId).toMatch(/^audit_honor_/);
      expect(result.newPosition).toBe(1);
    });
  });
});
