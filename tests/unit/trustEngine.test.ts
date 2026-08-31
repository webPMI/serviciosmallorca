import { describe, it, expect } from "vitest";
import {
  calculateDecayedConfidenceScore,
  calculateTrustLevel,
  evaluateServiceTrust,
  canUserInteractWithService,
  isAuthorizedToEdit,
  getDaysSinceValidation,
} from "../../src/lib/trustEngine";
import type { ServiceItem } from "../../src/data/services";

const baseService: ServiceItem = {
  id: "restaurante-can-feliu",
  slug: "restaurante-can-feliu",
  name: "Restaurante Can Feliu",
  category: "gastronomia-restaurantes",
  zone: "porreres",
  address: "Camí de Sa Serra, 07260 Porreres",
  coordinates: { lat: 39.52, lng: 3.02 },
  rating: 4.7,
  reviewCount: 320,
  priceRange: "€€",
  verified: true,
  featured: false,
  status: "open",
  googleMapsUrl: "https://maps.google.com/?id=1",
  appleMapsUrl: "https://maps.apple.com/?id=1",
  bingMapsUrl: "https://bing.com/maps/?id=1",
  phone: "+34971168000",
  whatsapp: "+34971168000",
  email: "info@canfeliu.es",
  website: "https://www.canfeliu.es",
  tags: ["Bodega", "Restaurante"],
  shortDescription: { es: "Restaurante y bodega", en: "Restaurant and winery", ca: "Restaurant" },
  fullDescription: { es: "Cocina tradicional", en: "Traditional cuisine", ca: "Cuina tradicional" },
  image: "/images/feliu.jpg",
  schedule: "L-D 12:00-23:00",
};

describe("trustEngine · Arquitectura de Verificación de Seguridad (Trust Layer)", () => {
  const NOW = new Date("2026-08-28T00:00:00Z");

  describe("Cálculo de Días y Degradación Temporal (Decay Engine)", () => {
    it("calcula días exactos desde la última validación", () => {
      const thirtyDaysAgo = new Date(NOW.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      expect(getDaysSinceValidation(thirtyDaysAgo, NOW)).toBe(30);
    });

    it("aplica penalización de 30% tras 6 meses sin validar", () => {
      const sevenMonthsAgo = new Date(NOW.getTime() - 210 * 24 * 60 * 60 * 1000).toISOString();
      const service: ServiceItem = {
        ...baseService,
        confidenceScore: 100,
        lastValidatedAt: sevenMonthsAgo,
      };

      const decayed = calculateDecayedConfidenceScore(service, NOW);
      expect(decayed).toBe(70); // 100 * 0.7 = 70
    });

    it("aplica penalización de 50% tras más de 1 año sin validar", () => {
      const twoYearsAgo = new Date(NOW.getTime() - 730 * 24 * 60 * 60 * 1000).toISOString();
      const service: ServiceItem = {
        ...baseService,
        confidenceScore: 100,
        lastValidatedAt: twoYearsAgo,
      };

      const decayed = calculateDecayedConfidenceScore(service, NOW);
      expect(decayed).toBe(50); // 100 * 0.5 = 50
    });
  });

  describe("Niveles de Confianza (Trust Levels)", () => {
    it("asigna Nivel 1 (Discovery Mode) a servicios sin validar o con score bajo", () => {
      const discoveryService: ServiceItem = {
        ...baseService,
        confidenceScore: 60,
        verificationStatus: "unverified",
      };
      expect(calculateTrustLevel(discoveryService, NOW)).toBe("level_1_discovery");
    });

    it("asigna Nivel 2 (Community Trust) a servicios verificados con score >= 80%", () => {
      const communityService: ServiceItem = {
        ...baseService,
        confidenceScore: 85,
        verificationStatus: "verified_community",
        lastValidatedAt: NOW.toISOString(),
      };
      expect(calculateTrustLevel(communityService, NOW)).toBe("level_2_community");
    });

    it("mantiene en Nivel 2 (Comunitario) a servicios de alta calidad no reclamados aún", () => {
      const unclaimedService: ServiceItem = {
        ...baseService,
        confidenceScore: 100,
        verificationStatus: "verified_community",
        lastValidatedAt: NOW.toISOString(),
      };
      // Sin cesión de titularidad (isClaimed = false/undefined), no asciende a nivel 3
      expect(calculateTrustLevel(unclaimedService, NOW)).toBe("level_2_community");
    });

    it("asigna Nivel 3 (Official Trust) a servicios formalmente reclamados y cedidos a su titular", () => {
      const officialService: ServiceItem = {
        ...baseService,
        confidenceScore: 100,
        verificationStatus: "verified_official",
        isClaimed: true,
        claimedByUid: "manager_owner_123",
        sourceCrossReference: { taxIdVerified: true },
        lastValidatedAt: NOW.toISOString(),
      };
      expect(calculateTrustLevel(officialService, NOW)).toBe("level_3_official");

      const evaluation = evaluateServiceTrust(officialService, NOW);
      expect(evaluation.trustLevel).toBe("level_3_official");
      expect(evaluation.statusBadge.variant).toBe("premium");
      expect(evaluation.allowedActions.canDirectBook).toBe(true);
    });
  });

  describe("Permisos de Interacción por Nivel y Rol de Usuario", () => {
    it("bloquea contacto directo en servicios de Nivel 1 (Modo Observación)", () => {
      const level1Service: ServiceItem = {
        ...baseService,
        confidenceScore: 60,
        verificationStatus: "pending_audit",
      };

      // Contacto directo está bloqueado (muestra aviso informativo en UI)
      expect(canUserInteractWithService("user", level1Service, "contact", NOW)).toBe(false);
      expect(canUserInteractWithService("user", level1Service, "view", NOW)).toBe(true);
    });

    it("permite contacto y reseñas a usuarios registrados en Nivel 2", () => {
      const level2Service: ServiceItem = {
        ...baseService,
        confidenceScore: 90,
        verificationStatus: "verified_community",
        lastValidatedAt: NOW.toISOString(),
      };

      expect(canUserInteractWithService("user", level2Service, "contact", NOW)).toBe(true);
      expect(canUserInteractWithService("user", level2Service, "review", NOW)).toBe(true);
      expect(canUserInteractWithService("guest", level2Service, "review", NOW)).toBe(false); // Invitado no puede reseñar
    });

    it("permite reservas directas solo en Nivel 3", () => {
      const level3Service: ServiceItem = {
        ...baseService,
        confidenceScore: 100,
        verificationStatus: "verified_official",
        isClaimed: true,
        claimedByUid: "manager_123",
        lastValidatedAt: NOW.toISOString(),
      };

      expect(canUserInteractWithService("user", level3Service, "book", NOW)).toBe(true);
      expect(canUserInteractWithService("guest", level3Service, "book", NOW)).toBe(false);
    });
  });

  describe("Seguridad Estricta de Edición (isAuthorizedToEdit)", () => {
    it("permite siempre acceso al rol admin", () => {
      expect(isAuthorizedToEdit("admin-123", "admin", baseService)).toBe(true);
    });

    it("permite al manager editar SOLO si es el titular legítimo asignado", () => {
      expect(isAuthorizedToEdit("manager-owner", "manager", baseService, "manager-owner")).toBe(true);
      expect(isAuthorizedToEdit("manager-intruder", "manager", baseService, "manager-owner")).toBe(false);

      // Si claimedByUid coincide con isClaimed = true
      const claimedService: ServiceItem = {
        ...baseService,
        isClaimed: true,
        claimedByUid: "manager-claimed",
      };
      expect(isAuthorizedToEdit("manager-claimed", "manager", claimedService)).toBe(true);
      expect(isAuthorizedToEdit("other-manager", "manager", claimedService)).toBe(false);

      // Si managerUid estático coincide
      const managerStaticService = {
        ...baseService,
        managerUid: "manager-static-1",
      };
      expect(isAuthorizedToEdit("manager-static-1", "manager", managerStaticService as any)).toBe(true);
      expect(isAuthorizedToEdit("other-manager", "manager", managerStaticService as any)).toBe(false);
    });

    it("rechaza peticiones de edición de usuarios normales o invitados", () => {
      expect(isAuthorizedToEdit("user-456", "user", baseService, "user-456")).toBe(false);
      expect(isAuthorizedToEdit(undefined, "guest", baseService)).toBe(false);
    });
  });
});
