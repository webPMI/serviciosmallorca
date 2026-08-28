import { describe, it, expect } from "vitest";
import {
  auditSecurity,
  auditDataIntegrity,
  auditHistoricalEvolution,
  auditHonorBoard,
  auditPerformance,
  runFullCatalogAudit,
  generateMarkdownAuditReport,
} from "../../src/lib/multiAuditorEngine";
import type { ServiceItem } from "../../src/data/services";

const pristineService: ServiceItem = {
  id: "bodega-son-prim-sencelles",
  slug: "bodega-son-prim-sencelles",
  name: "Bodega Son Prim Sencelles",
  category: "gastronomia-restaurantes",
  zone: "sencelles",
  address: "Carretera Inca-Sencelles Km 4.9, 07140 Sencelles",
  coordinates: { lat: 39.65, lng: 2.9 },
  rating: 4.9,
  reviewCount: 140,
  priceRange: "€€",
  verified: true,
  featured: true,
  status: "open",
  confidenceScore: 95,
  lastValidatedAt: new Date().toISOString(),
  googleMapsUrl: "https://maps.google.com/?id=1",
  appleMapsUrl: "https://maps.apple.com/?id=1",
  bingMapsUrl: "https://bing.com/maps/?id=1",
  phone: "+34971872870",
  whatsapp: "+34971872870",
  email: "info@sonprim.com",
  website: "https://sonprim.com",
  tags: ["Bodega", "Vino"],
  shortDescription: { es: "Bodega familiar", en: "Family winery", ca: "Celler familiar", de: "Familienweingut" },
  fullDescription: { es: "Descripción", en: "Description", ca: "Descripció", de: "Beschreibung" },
  image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80",
  schedule: "L-V 09:00-18:00",
};

describe("multiAuditorEngine · Sistema Multi-Auditor Blindado", () => {
  describe("🛡️ SecurityAuditor", () => {
    it("otorga 100% de cumplimiento a servicios con teléfono y correo seguros", () => {
      const result = auditSecurity([pristineService]);
      expect(result.stats.complianceScore).toBe(100);
      expect(result.findings).toHaveLength(0);
    });

    it("detecta correos desechables y teléfonos malformados", () => {
      const badService: ServiceItem = {
        ...pristineService,
        email: "fake@mailinator.com",
        phone: "12345",
      };
      const result = auditSecurity([badService]);
      expect(result.stats.criticalCount).toBe(1);
      expect(result.stats.warningCount).toBe(1);
      expect(result.stats.complianceScore).toBeLessThan(100);
    });
  });

  describe("📊 DataIntegrityAuditor (GR-11)", () => {
    it("detecta coordenadas fuera de Mallorca (Bounding Box)", () => {
      const outOfBoundsService: ServiceItem = {
        ...pristineService,
        coordinates: { lat: 41.38, lng: 2.17 }, // Coordenadas de Barcelona
      };
      const result = auditDataIntegrity([outOfBoundsService]);
      expect(result.findings.some((f) => f.code === "DATA_GEO_OUT_OF_BOUNDS")).toBe(true);
    });

    it("advierte si faltan traducciones oficiales obligatorias", () => {
      const incompleteI18n: ServiceItem = {
        ...pristineService,
        shortDescription: { es: "Solo en español", en: "", ca: "" },
      };
      const result = auditDataIntegrity([incompleteI18n]);
      expect(result.findings.some((f) => f.code === "DATA_INCOMPLETE_I18N")).toBe(true);
    });
  });

  describe("🏛️ HistoricalEvolutionAuditor", () => {
    it("detecta entradas con purge_erroneous para evitar polución de fake data", () => {
      const serviceWithUnpurgedError: ServiceItem = {
        ...pristineService,
        evolutionHistory: [
          {
            date: "2026-08",
            type: "correction_purged",
            action: "purge_erroneous",
            title: { es: "Error de teléfono", en: "Error", ca: "Error", de: "Fehler" },
            description: { es: "Borrado", en: "Deleted", ca: "Esborrat", de: "Gelöscht" },
          },
        ],
      };
      const result = auditHistoricalEvolution([serviceWithUnpurgedError]);
      expect(result.findings.some((f) => f.code === "HIST_UNPURGED_ERROR")).toBe(true);
    });
  });

  describe("👑 HonorBoardAuditor", () => {
    it("valida la integridad del Cuadro de Honor por defecto", () => {
      const result = auditHonorBoard([pristineService]);
      expect(result.stats.criticalCount).toBe(0);
      expect(result.stats.complianceScore).toBeGreaterThanOrEqual(90);
    });
  });

  describe("⚡ PerformanceAuditor", () => {
    it("advierte sobre imágenes sin SSL (HTTP inseguro)", () => {
      const insecureImgService: ServiceItem = {
        ...pristineService,
        image: "http://insecure.com/photo.jpg",
      };
      const result = auditPerformance([insecureImgService]);
      expect(result.findings.some((f) => f.code === "PERF_INSECURE_IMAGE_URL")).toBe(true);
    });
  });

  describe("Orquestador Maestro y Generación de Reportes", () => {
    it("ejecuta la auditoría global y genera un informe en Markdown estructurado", () => {
      const report = runFullCatalogAudit([pristineService]);
      expect(report.overallComplianceScore).toBeGreaterThanOrEqual(90);
      expect(report.overallStatus).toBe("BLINDADO_OPTIMO");

      const md = generateMarkdownAuditReport(report);
      expect(md).toContain("# 🛡️ Informe de Inteligencia y Auditoría Multi-Agente");
      expect(md).toContain("Puntaje Global de Cumplimiento");
      expect(md).toContain("Seguridad & Acceso");
    });
  });
});
