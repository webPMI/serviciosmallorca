import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  createDisplacementAlert,
  getActiveDisplacementAlerts,
  markDisplacementAlertAsRead,
} from "../../src/lib/displacementNotificationEngine";
import { processHonorBid } from "../../src/lib/honorBoardEngine";
import type { ServiceItem } from "../../src/data/services";
import fs from "fs";
import path from "path";

describe("⚡ Strategic Pillars (Rivalry Notifications, Boost Wall, B2B Invoicing & i18n)", () => {
  beforeEach(() => {
    // Setup Mock LocalStorage
    const store: Record<string, string> = {};
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        for (const k of Object.keys(store)) delete store[k];
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Pilar 2: ⚡ Notificaciones de Desplazamiento & Rivalidad Comercial", () => {
    it("genera alerta de desplazamiento con incremento exacto +1€ y URL de recuperación", () => {
      const alert = createDisplacementAlert({
        category: "artesanos-sabor",
        categoryTitle: "Artesanos del Sabor & Gastronomía",
        displacedServiceId: "forn-inca",
        displacedServiceName: "Forn Inca Tradició",
        newLeaderServiceId: "pastisseria-palma",
        newLeaderServiceName: "Pastisseria Palma",
        newLeaderBidEuros: 15.0,
        locale: "es",
      });

      expect(alert.counterBidPriceEuros).toBe(16.0);
      expect(alert.oneClickReclaimUrl).toContain("/es/cuadro-de-honor?intent=boost");
      expect(alert.oneClickReclaimUrl).toContain("serviceId=forn-inca");
      expect(alert.oneClickReclaimUrl).toContain("minBid=16");
      expect(alert.read).toBe(false);
    });

    it("persiste y recupera alertas en LocalStorage", () => {
      createDisplacementAlert({
        category: "maestros-instalaciones",
        categoryTitle: "Maestros de Instalaciones",
        displacedServiceId: "clima-balear",
        displacedServiceName: "Clima Balear",
        newLeaderServiceId: "electricitat-mallorca",
        newLeaderServiceName: "Electricitat Mallorca",
        newLeaderBidEuros: 25.0,
      });

      const alerts = getActiveDisplacementAlerts("clima-balear");
      expect(alerts.length).toBe(1);
      expect(alerts[0].displacedServiceName).toBe("Clima Balear");

      markDisplacementAlertAsRead(alerts[0].id);
      const updated = getActiveDisplacementAlerts("clima-balear");
      expect(updated[0].read).toBe(true);
    });

    it("processHonorBid genera displacementAlert automáticamente al superar al líder", () => {
      const currentList = [
        {
          id: "spot-leader",
          position: 1,
          serviceId: "forn-inca",
          serviceName: "Forn Inca Tradició",
          serviceSlug: "forn-inca",
          category: "artesanos-sabor",
          zone: "inca",
          honorTitle: { es: "Referente", en: "Top", ca: "Referent", de: "Referenz" },
          currentBidEuros: 10.0,
          sponsorName: "Toni",
          nominatedAt: "2026-08-01T00:00:00Z",
          confidenceScore: 95,
          isVerified: true,
        },
      ];

      const challengerService: ServiceItem = {
        id: "pastisseria-palma",
        name: "Pastisseria Palma",
        slug: "pastisseria-palma",
        category: "gastronomia-restaurantes",
        zone: "palma",
        rating: 4.9,
        reviewCount: 45,
        verified: true,
        confidenceScore: 92,
        status: "open",
        address: "Carrer de la Unió 4, Palma",
        phone: "+34 971 000 111",
        website: "https://pastisseriapalma.es",
        tags: ["pasteleria", "dulces"],
      } as unknown as ServiceItem;

      const res = processHonorBid(
        currentList,
        {
          serviceId: challengerService.id,
          sponsorName: "Joan García",
          bidAmountEuros: 11.0,
          honorTitle: { es: "Referente Balear", en: "Top Benchmark", ca: "Referent Balear", de: "Top-Referenz" },
        },
        "artesanos-sabor",
        challengerService,
      );

      expect(res.success).toBe(true);
      expect(res.newPosition).toBe(1);
      expect(res.displacementAlert).toBeDefined();
      expect(res.displacementAlert?.displacedServiceName).toBe("Forn Inca Tradició");
      expect(res.displacementAlert?.counterBidPriceEuros).toBe(12.0);
    });
  });

  describe("Pilar 3: 💬 Muro de Impulsos Populares en la Ficha del Comercio", () => {
    it("debe contener el componente CommunityBoostWall en [slug].astro", () => {
      const slugPath = path.resolve(process.cwd(), "src/pages/[...locale]/servicios/[slug].astro");
      const content = fs.readFileSync(slugPath, "utf-8");

      expect(content).toContain("CommunityBoostWall");
      expect(content).toContain("serviceId={service.id}");
      expect(content).toContain("serviceSlug={service.slug}");
    });

    it("el componente CommunityBoostWall debe tener el trigger de micro-impulso y el muro de dedicatorias", () => {
      const wallPath = path.resolve(process.cwd(), "src/components/CommunityBoostWall.astro");
      const content = fs.readFileSync(wallPath, "utf-8");

      expect(content).toContain("trigger-boost-from-wall");
      expect(content).toContain("wall-dedications-list");
      expect(content).toContain("open-honor-checkout");
    });
  });

  describe("Pilar 4: 🧾 Facturación B2B para Autónomos y Empresas (21% IVA Deducible)", () => {
    it("el modal de checkout debe incluir campos B2B y recibo nominativo con desglose fiscal", () => {
      const modalPath = path.resolve(process.cwd(), "src/components/HonorCheckoutModal.astro");
      const content = fs.readFileSync(modalPath, "utf-8");

      expect(content).toContain("checkbox-b2b-invoice");
      expect(content).toContain("input-b2b-taxid");
      expect(content).toContain("input-b2b-legalname");
      expect(content).toContain("input-b2b-address");
      expect(content).toContain("receipt-b2b-row");
      expect(content).toContain("receipt-b2b-info");
    });
  });

  describe("Pilar 5: 🇩🇪 🇬🇧 🇪🇸 🏴 Catalana Internacionalización Completa", () => {
    it("los 4 idiomas deben contener todas las claves nuevas de honor.modal, profile y boostWall", () => {
      const locales = ["es", "en", "de", "ca"];
      const requiredKeys = [
        "honor.modal.b2bCheckbox",
        "honor.modal.b2bTaxId",
        "honor.modal.b2bLegalName",
        "honor.modal.b2bAddress",
        "honor.modal.b2bCustomer",
        "boostWall.kicker",
        "boostWall.title",
        "boostWall.subtitle",
        "boostWall.addBoostBtn",
        "boostWall.totalRaised",
        "boostWall.backersCount",
        "boostWall.rankStatus",
        "boostWall.topNominated",
      ];

      for (const loc of locales) {
        const filePath = path.resolve(process.cwd(), `src/i18n/${loc}.json`);
        const json = JSON.parse(fs.readFileSync(filePath, "utf-8"));

        for (const key of requiredKeys) {
          expect(json[key], `Falta la clave "${key}" en ${loc}.json`).toBeDefined();
          expect(json[key].length, `La clave "${key}" en ${loc}.json está vacía`).toBeGreaterThan(0);
        }
      }
    });
  });
});
