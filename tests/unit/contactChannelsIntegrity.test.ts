import { describe, expect, it } from "vitest";
import { SERVICES } from "../../src/data/services/index.ts";
import { formatWhatsAppLink, isValidWhatsAppNumber } from "../../src/lib/whatsappUtils.ts";
import { auditServiceContact } from "../../scripts/test-service-contacts.ts";

describe("📞 Suite de Testing Automatizado de Canales de Contacto (General e Individual)", () => {
  describe("🌐 Testing General del Catálogo Completo (811 Servicios)", () => {
    it("garantiza que NINGÚN servicio en el catálogo tiene asignado un teléfono fijo como WhatsApp", () => {
      const forbiddenLandlines: Array<{ id: string; name: string; whatsapp: string }> = [];

      for (const s of SERVICES) {
        if (s.whatsapp) {
          const isMobile = isValidWhatsAppNumber(s.whatsapp);
          if (!isMobile) {
            forbiddenLandlines.push({
              id: s.id,
              name: s.name,
              whatsapp: s.whatsapp,
            });
          }
        }
      }

      expect(forbiddenLandlines).toEqual([]);
    });

    it("verifica que todos los servicios con whatsapp generan URLs wa.me válidas sin retornar null", () => {
      const waServices = SERVICES.filter((s) => Boolean(s.whatsapp));
      expect(waServices.length).toBeGreaterThan(0);

      for (const s of waServices) {
        const link = formatWhatsAppLink(s.whatsapp, "Test");
        expect(link).not.toBeNull();
        expect(link).toMatch(/^https:\/\/wa\.me\/\d+\?text=Test$/);
      }
    });

    it("garantiza que todos los 811 servicios pasan la auditoría de contacto sin errores críticos", () => {
      const criticalErrors: Array<{ id: string; rule: string; message: string }> = [];

      for (const s of SERVICES) {
        const report = auditServiceContact(s);
        const errs = report.issues.filter((i) => i.severity === "ERROR");
        for (const e of errs) {
          criticalErrors.push({ id: s.id, rule: e.rule, message: e.message });
        }
      }

      expect(criticalErrors).toEqual([]);
    });
  });

  describe("🎯 Testing Individual de Negocios Emblemáticos", () => {
    it("Bar España (Palma) tiene teléfono fijo verificado y NO genera WhatsApp erróneo", () => {
      const barEspanya = SERVICES.find((s) => s.id === "bar-espanya-palma");
      expect(barEspanya).toBeDefined();
      expect(barEspanya?.phone).toBe("+34 971 72 42 34");
      expect(barEspanya?.whatsapp).toBeUndefined();

      const report = auditServiceContact(barEspanya!);
      expect(report.isWaMobile).toBe(false);
      expect(report.ctaType).toBe("CALL_ONLY");
      expect(report.generatedWaUrl).toBeNull();
      expect(report.issues.filter((i) => i.severity === "ERROR")).toHaveLength(0);
    });

    it("Bar Bosch (Palma) tiene teléfono fijo y CTA protegido para llamada directa", () => {
      const barBosch = SERVICES.find((s) => s.id === "bar-bosch");
      expect(barBosch).toBeDefined();
      expect(barBosch?.phone).toBe("+34 971 72 11 31");
      expect(barBosch?.whatsapp).toBeUndefined();

      const report = auditServiceContact(barBosch!);
      expect(report.isWaMobile).toBe(false);
      expect(report.ctaType).toBe("CALL_ONLY");
      expect(report.generatedWaUrl).toBeNull();
    });


    it("Urban Soul Tattoo dispone de móvil auténtico y genera CTA de WhatsApp funcional", () => {
      const urbanSoul = SERVICES.find((s) => s.id === "urban-soul-tattoo");
      expect(urbanSoul).toBeDefined();
      expect(urbanSoul?.whatsapp).toBe("+34603602480");

      const report = auditServiceContact(urbanSoul!);
      expect(report.isWaMobile).toBe(true);
      expect(report.ctaType).toBe("WHATSAPP");
      expect(report.generatedWaUrl).toContain("https://wa.me/34603602480");
    });
  });
});
