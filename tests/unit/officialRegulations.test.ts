import { describe, it, expect } from "vitest";
import {
  OFFICIAL_REGULATIONS,
  getAllRegulations,
  getRegulationBySlug,
  getRegulationsByCategory,
} from "../../src/data/officialRegulations";
import { CITIZEN_GUIDES } from "../../src/data/citizenGuides";
import { OFFICIAL_STATISTICS } from "../../src/data/officialStats";

describe("Catálogo Canónico de Normativas Oficiales del BOIB (officialRegulations)", () => {
  it("debe contener al menos 5 normativas canónicas vigentes contrastadas", () => {
    const regs = getAllRegulations();
    expect(regs.length).toBeGreaterThanOrEqual(5);
  });

  it("cada normativa debe cumplir con los campos de integridad, trazabilidad y fechas válidas", () => {
    const validAuthorities = [
      "Govern de les Illes Balears",
      "Consell Insular de Mallorca",
      "Ajuntament de Palma",
      "Agencia Tributaria de les Illes Balears (ATIB)",
      "SOIB",
    ];

    OFFICIAL_REGULATIONS.forEach((reg) => {
      expect(reg.id).toBeTruthy();
      expect(reg.slug).toBeTruthy();
      expect(reg.officialBoibNumber).toMatch(/BOIB|SOIB|Decreto|Resolución|Texto|D\.L\.|Ley/i);
      expect(validAuthorities).toContain(reg.authority);
      expect(reg.officialSourceUrl).toMatch(/^https:\/\//);

      // Verificación de formato ISO de fechas (YYYY-MM-DD)
      expect(reg.publicationDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(reg.effectiveDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);

      // Verificación de integridad cuatrilingüe (GR-04)
      const locales = ["es", "ca", "en", "de"] as const;
      locales.forEach((l) => {
        expect(reg.title[l]).toBeTruthy();
        expect(reg.title[l].length).toBeGreaterThan(10);
        expect(reg.summary[l]).toBeTruthy();
        expect(reg.summary[l].length).toBeGreaterThan(20);
        expect(reg.benefitsSummary[l]).toBeTruthy();
      });

      // Puntos clave
      expect(reg.keyPoints.length).toBeGreaterThanOrEqual(2);
      reg.keyPoints.forEach((kp) => {
        locales.forEach((l) => {
          expect(kp.title[l]).toBeTruthy();
          expect(kp.description[l]).toBeTruthy();
        });
      });
    });
  });

  it("getRegulationBySlug debe encontrar la normativa o devolver undefined", () => {
    const found = getRegulationBySlug("bonificacion-itp-jovenes-mallorca");
    expect(found).toBeDefined();
    expect(found?.category).toBe("vivienda");
    expect(found?.calculatorType).toBe("itp_joven");

    const notFound = getRegulationBySlug("normativa-inexistente-xyz");
    expect(notFound).toBeUndefined();
  });

  it("getRegulationsByCategory debe filtrar correctamente por categoría", () => {
    const vivienda = getRegulationsByCategory("vivienda");
    expect(vivienda.length).toBeGreaterThanOrEqual(1);
    expect(vivienda.every((r) => r.category === "vivienda")).toBe(true);

    const empresas = getRegulationsByCategory("empresas_autonomos");
    expect(empresas.length).toBeGreaterThanOrEqual(1);
    expect(empresas.every((r) => r.category === "empresas_autonomos")).toBe(true);
  });

  it("las guías relacionadas referenciadas deben existir estrictamente en citizenGuides", () => {
    const existingGuideSlugs = new Set(CITIZEN_GUIDES.map((g) => g.slug));

    OFFICIAL_REGULATIONS.forEach((reg) => {
      if (reg.relatedGuideSlugs && reg.relatedGuideSlugs.length > 0) {
        reg.relatedGuideSlugs.forEach((slug) => {
          expect(
            existingGuideSlugs.has(slug),
            `La normativa ${reg.id} referencia una guía inexistente: ${slug}`
          ).toBe(true);
        });
      }
    });
  });

  it("las estadísticas relacionadas referenciadas deben existir estrictamente en officialStats", () => {
    const existingStatIds = new Set(OFFICIAL_STATISTICS.map((s) => s.id));

    OFFICIAL_REGULATIONS.forEach((reg) => {
      if (reg.relatedStatIds && reg.relatedStatIds.length > 0) {
        reg.relatedStatIds.forEach((statId) => {
          expect(
            existingStatIds.has(statId),
            `La normativa ${reg.id} referencia una estadística inexistente: ${statId}`
          ).toBe(true);
        });
      }
    });
  });
});
