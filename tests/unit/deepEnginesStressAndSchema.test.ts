/**
 * tests/unit/deepEnginesStressAndSchema.test.ts
 *
 * Suite de estrés y validación exhaustiva de Schema.org, Notificaciones de Desplazamiento,
 * Motores de CTA Inteligentes y Analizadores de Horarios Complejos (Zero Fake Data).
 *
 * @vitest-environment happy-dom
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { generateServiceJsonLd, generateHomepageJsonLd } from "../../src/lib/jsonLdGenerator";
import {
  createDisplacementAlert,
  getActiveDisplacementAlerts,
  markDisplacementAlertAsRead,
} from "../../src/lib/displacementNotificationEngine";
import { getSmartActionCta } from "../../src/lib/smartCtaEngine";
import { getLiveBusinessStatus } from "../../src/lib/scheduleParser";
import type { ServiceItem } from "../../src/data/services/types";

const baseService: ServiceItem = {
  id: "test-stress-service",
  slug: "test-stress-service",
  name: "Test Stress Service",
  category: "gastronomia-restaurantes",
  zone: "palma",
  address: "Carrer Sant Miquel 20, Palma",
  coordinates: { lat: 39.571, lng: 2.651 },
  rating: 4.9,
  reviewCount: 150,
  priceRange: "€€€",
  verified: true,
  featured: true,
  status: "open",
  phone: "+34971222333",
  whatsapp: "+34971222333",
  email: "contacto@stress.com",
  website: "https://stress.com",
  googleMapsUrl: "https://maps.google.com/?id=stress",
  appleMapsUrl: "https://maps.apple.com/?id=stress",
  bingMapsUrl: "https://bing.com/maps/?id=stress",
  image: "/images/stress.jpg",
  images: ["/images/s1.jpg", "/images/s2.jpg"],
  schedule: "L-V 09:00-14:00, 17:00-21:00",
  founderName: "Bernat Font",
  foundedYear: 1985,
  tags: ["product:lujo"],
  specialties: {
    es: ["Cocina de autor", "Pescado salvaje"],
    en: ["Signature cuisine", "Wild fish"],
    ca: ["Cuina d'autor", "Peix salvatge"],
    de: ["Autorenküche", "Wilder Fisch"],
  },
  servicesProvided: {
    es: ["Cenas privadas", "Eventos corporativos"],
    en: ["Private dining", "Corporate events"],
    ca: ["Sopars privats", "Esdeveniments corporatius"],
    de: ["Private Dinner", "Firmenevents"],
  },
  reviews: [
    {
      id: "rev-stress-1",
      authorName: "Laura Pons",
      rating: 5,
      comment: "Insuperable experiencia gastronómica en Palma.",
      date: "2026-08-15",
      platform: "google_maps",
      language: "es",
    },
  ],
  shortDescription: { es: "Excelente", en: "Excellent", ca: "Excel·lent", de: "Ausgezeichnet" },
  fullDescription: { es: "Descripción", en: "Description", ca: "Descripció", de: "Beschreibung" },
  confidenceScore: 98,
};

describe("Deep Engines Stress & Schema Suite", () => {
  describe("src/lib/jsonLdGenerator.ts · Esquemas Schema.org", () => {
    it("genera Homepage JSON-LD enriquecido para todos los idiomas (es, en, ca, de)", () => {
      const locales = ["es", "en", "ca", "de"] as const;
      for (const loc of locales) {
        const schemas = generateHomepageJsonLd(loc, `https://serviciosmallorca.com/${loc}`);
        expect(schemas.length).toBe(2);
        expect(schemas[0]["@type"]).toBe("WebSite");
        expect(schemas[0].inLanguage).toBe(loc);
        expect(schemas[1]["@type"]).toBe("Organization");
        expect(schemas[1].knowsAbout.length).toBeGreaterThan(0);
      }
    });

    it("asigna los tipos semánticos específicos de Schema.org según sector y categoría", () => {
      const testCategories: Array<{ category: string; sectorId?: string; expectedType: string | string[] }> = [
        { category: "arte-tatuajes", expectedType: ["LocalBusiness", "TattooParlor"] },
        { category: "gastronomia-restaurantes", expectedType: "Restaurant" },
        { category: "inmobiliaria-villas", expectedType: "RealEstateAgent" },
        { category: "motor-transporte", expectedType: ["LocalBusiness", "AutoRental"] },
        { category: "servicios-profesionales", sectorId: "servicios-legal", expectedType: "LegalService" },
        { category: "servicios-profesionales", sectorId: "servicios-contable", expectedType: "AccountingService" },
        { category: "servicios-profesionales", expectedType: "ProfessionalService" },
        { category: "spas-bienestar", expectedType: ["LocalBusiness", "DaySpa", "HealthAndBeautyBusiness"] },
        {
          category: "reformas-construccion",
          expectedType: ["LocalBusiness", "HomeAndConstructionBusiness", "GeneralContractor"],
        },
        { category: "jardineria-piscinas", expectedType: ["LocalBusiness", "Florist", "HomeAndConstructionBusiness"] },
        { category: "tecnologia-seguridad", expectedType: ["LocalBusiness", "SecurityService"] },
        { category: "gimnasios-fitness", expectedType: ["SportsActivityLocation", "ExerciseGym", "HealthClub"] },
        { category: "entrenamiento-personal", expectedType: ["SportsActivityLocation", "PersonalTrainer"] },
        { category: "estudios-cuerpo-mente", expectedType: ["HealthClub", "SportsActivityLocation"] },
        { category: "artes-marciales-boxeo", expectedType: ["SportsActivityLocation"] },
        { category: "padel-tenis-raqueta", expectedType: ["SportsActivityLocation", "TennisComplex"] },
        { category: "natacion-deportes-acuaticos", expectedType: ["SportsActivityLocation", "SwimmingPool"] },
        { category: "ciclismo-running-trail", expectedType: ["SportsActivityLocation", "LocalBusiness"] },
        { category: "golf", expectedType: ["GolfCourse", "SportsActivityLocation"] },
        { category: "equitacion-hipica", expectedType: ["LocalBusiness", "SportsActivityLocation"] },
        { category: "deportes-montana-aventura", expectedType: ["SportsActivityLocation", "TouristInformationCenter"] },
        { category: "clubes-escuelas-deportivas", expectedType: ["SportsClub", "SportsActivityLocation"] },
        { category: "espacios-deportivos-publicos", expectedType: ["TouristAttraction", "SportsActivityLocation"] },
        { category: "categoria-desconocida", expectedType: "LocalBusiness" },
      ];

      for (const tc of testCategories) {
        const item: ServiceItem = {
          ...baseService,
          category: tc.category,
          sectorId: tc.sectorId,
        };
        const jsonLd = generateServiceJsonLd(item, "es");
        expect(jsonLd["@type"]).toEqual(tc.expectedType);
      }
    });

    it("genera catálogo de ofertas, fundador, año de fundación y reseñas enriquecidas", () => {
      const jsonLd = generateServiceJsonLd(baseService, "en", "https://serviciosmallorca.com/en/restaurante-stress");
      expect(jsonLd.founder).toEqual({ "@type": "Person", name: "Bernat Font" });
      expect(jsonLd.foundingDate).toBe("1985");
      expect(jsonLd.hasOfferCatalog).toBeDefined();
      expect(jsonLd.hasOfferCatalog.itemListElement.length).toBe(4);
      expect(jsonLd.review.length).toBe(1);
      expect(jsonLd.aggregateRating.ratingValue).toBe(4.9);
    });
  });

  describe("src/lib/displacementNotificationEngine.ts · Notificaciones en LocalStorage", () => {
    const memoryStorage = new Map<string, string>();
    const localStorageMock = {
      getItem: (k: string) => memoryStorage.get(k) || null,
      setItem: (k: string, v: string) => memoryStorage.set(k, v),
      removeItem: (k: string) => memoryStorage.delete(k),
      clear: () => memoryStorage.clear(),
    };

    beforeEach(() => {
      memoryStorage.clear();
      vi.stubGlobal("localStorage", localStorageMock);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("crea, almacena y filtra alertas de desplazamiento por negocio", () => {
      const alert1 = createDisplacementAlert({
        category: "gastronomia-restaurantes",
        categoryTitle: "Restaurantes",
        displacedServiceId: "rest-1",
        displacedServiceName: "Restaurante Uno",
        newLeaderServiceId: "rest-2",
        newLeaderServiceName: "Restaurante Dos",
        newLeaderBidEuros: 25,
      });

      const alert2 = createDisplacementAlert({
        category: "nautica-charter",
        categoryTitle: "Chárter Náutico",
        displacedServiceId: "boat-1",
        displacedServiceName: "Barco Uno",
        newLeaderServiceId: "boat-2",
        newLeaderServiceName: "Barco Dos",
        newLeaderBidEuros: 40,
      });

      expect(alert1.id).toBeDefined();
      expect(alert2.id).toBeDefined();
      expect(alert1.counterBidPriceEuros).toBe(26);

      const all = getActiveDisplacementAlerts();
      expect(all.length).toBe(2);

      const filtered = getActiveDisplacementAlerts("rest-1");
      expect(filtered.length).toBe(1);
      expect(filtered[0].displacedServiceName).toBe("Restaurante Uno");
    });

    it("marca alerta como leída y actualiza el almacenamiento", () => {
      const alert = createDisplacementAlert({
        category: "spas-bienestar",
        categoryTitle: "Spas",
        displacedServiceId: "spa-1",
        displacedServiceName: "Spa Uno",
        newLeaderServiceId: "spa-2",
        newLeaderServiceName: "Spa Dos",
        newLeaderBidEuros: 15,
      });

      expect(alert.read).toBe(false);
      markDisplacementAlertAsRead(alert.id);

      const alerts = getActiveDisplacementAlerts("spa-1");
      expect(alerts[0].read).toBe(true);
    });

    it("tolera excepciones ante JSON corrupto en localStorage", () => {
      memoryStorage.set("mallorca_displacement_alerts", "{ corrupt-json ");
      expect(getActiveDisplacementAlerts()).toEqual([]);
    });
  });

  describe("src/lib/smartCtaEngine.ts · Ruteo de intenciones y acciones", () => {
    it("resuelve CTA de menú o reserva de mesa según datos disponibles", () => {
      const ctaMenu = getSmartActionCta(
        "gastronomia-restaurantes",
        "Restaurante Stress",
        "es",
        "+34971222333",
        "+34971222333",
        "https://stress.com",
        "https://stress.com/menu.pdf",
      );
      expect(ctaMenu).toBeDefined();
      expect(ctaMenu.trackingEvent).toBe("cta_view_menu");
      expect(ctaMenu.url).toBe("https://stress.com/menu.pdf");

      const ctaWa = getSmartActionCta(
        "gastronomia-restaurantes",
        "Restaurante Stress",
        "es",
        undefined,
        "+34971222333",
        "https://stress.com",
        undefined,
      );
      expect(ctaWa.trackingEvent).toBe("cta_book_table_whatsapp");
      expect(ctaWa.url).toContain("wa.me");
    });
  });

  describe("src/lib/scheduleParser.ts · Análisis de horarios complejos y turnos partidos", () => {
    it("evalúa estado en vivo de negocio 24 horas y con cierre estacional", () => {
      const fixedNow = new Date("2026-08-31T12:00:00Z");
      const status24h = getLiveBusinessStatus("L-D 24h", "open", fixedNow, "es");
      expect(status24h.isOpen).toBe(true);
      expect(status24h.statusText).toBe("Abierto 24 Horas");

      const statusSeasonal = getLiveBusinessStatus("L-D 10:00-20:00", "seasonal_closure", fixedNow, "es");
      expect(statusSeasonal.isOpen).toBe(false);
      expect(statusSeasonal.statusClass).toBe("seasonal");

      const statusClosed = getLiveBusinessStatus("L-D 10:00-20:00", "permanently_closed", fixedNow, "es");
      expect(statusClosed.isOpen).toBe(false);
      expect(statusClosed.statusClass).toBe("closed");
    });
  });
});
