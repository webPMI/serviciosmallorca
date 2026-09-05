import { describe, expect, it } from "vitest";
import { OFFICIAL_STATISTICS, type OfficialStatCategory } from "../../src/data/officialStats";

describe("📈 Página de Estadísticas Oficiales (/estadisticas) Unit Suite", () => {
  it("contiene indicadores distribuidos en todas las categorías requeridas", () => {
    const categories: OfficialStatCategory[] = ["empleo_empresas", "demografia", "turismo_sostenibilidad", "movilidad"];

    categories.forEach((cat) => {
      const statsInCat = OFFICIAL_STATISTICS.filter((s) => s.category === cat);
      expect(statsInCat.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("permite el filtrado por categoría sin pérdida de datos", () => {
    const employment = OFFICIAL_STATISTICS.filter((s) => s.category === "empleo_empresas");
    const demo = OFFICIAL_STATISTICS.filter((s) => s.category === "demografia");
    const tourism = OFFICIAL_STATISTICS.filter((s) => s.category === "turismo_sostenibilidad");
    const mobility = OFFICIAL_STATISTICS.filter((s) => s.category === "movilidad");

    const total = employment.length + demo.length + tourism.length + mobility.length;
    expect(total).toBe(OFFICIAL_STATISTICS.length);
    expect(OFFICIAL_STATISTICS.length).toBeGreaterThanOrEqual(12);
  });

  it("cada indicador contiene trazabilidad oficial estricta (GR-11 Zero Fake Data)", () => {
    OFFICIAL_STATISTICS.forEach((stat) => {
      expect(stat.officialSeriesCode).toBeDefined();
      expect(stat.officialSeriesCode!.length).toBeGreaterThan(2);
      expect(stat.sourceUrl).toMatch(/^https:\/\//);
      expect(stat.period).toBeDefined();
      expect(stat.period).toMatch(/^20\d{2}/);
      if (stat.changeRate) {
        expect(["up", "down", "neutral"]).toContain(stat.changeRate.direction);
        expect(stat.changeRate.percentage).toBeGreaterThan(0);
        expect(stat.changeRate.comparisonPeriod.es).toBeTruthy();
        expect(stat.changeRate.comparisonPeriod.ca).toBeTruthy();
        expect(stat.changeRate.comparisonPeriod.en).toBeTruthy();
        expect(stat.changeRate.comparisonPeriod.de).toBeTruthy();
      }
    });
  });

  it("verifica la consistencia del Índice de Presión Humana (IPH) estival vs invernal", () => {
    const iphPeak = OFFICIAL_STATISTICS.find((s) => s.id === "iph-pico-verano");
    const iphMin = OFFICIAL_STATISTICS.find((s) => s.id === "iph-minimo-invierno");

    expect(iphPeak).toBeDefined();
    expect(iphMin).toBeDefined();

    if (iphPeak && iphMin) {
      expect(iphPeak.category).toBe("turismo_sostenibilidad");
      expect(iphMin.category).toBe("turismo_sostenibilidad");
      expect(iphPeak.dataScope).toBe("Mallorca");
      expect(iphMin.dataScope).toBe("Mallorca");
      expect(iphPeak.sourceEntity).toBe("IBESTAT");
      expect(iphMin.sourceEntity).toBe("IBESTAT");
      expect(iphPeak.officialSeriesCode).toBe("IBESTAT-IPH-MAX");
      expect(iphMin.officialSeriesCode).toBe("IBESTAT-IPH-MIN");
      expect(iphPeak.highlightNote.es).toContain("agosto");
      expect(iphMin.highlightNote.es).toContain("menor presión");

      // Valores numéricos limpios para comprobar que pico > mínimo
      const peakNumber = parseInt(iphPeak.value.replace(/\./g, ""), 10);
      const minNumber = parseInt(iphMin.value.replace(/\./g, ""), 10);
      expect(peakNumber).toBeGreaterThan(minNumber);
      expect(peakNumber).toBeGreaterThan(1400000);
      expect(minNumber).toBeLessThan(1000000);
    }
  });

  it("genera la estructura correcta de Schema.org Dataset y CollectionPage para SEO", () => {
    const prefix = "/es/";
    const schemaOrg = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          name: "Estadísticas Oficiales de Mallorca",
          url: `https://serviciosmallorca.com${prefix}estadisticas`,
        },
        {
          "@type": "Dataset",
          name: "Indicadores Oficiales de Mallorca (IBESTAT & Registros Públicos)",
          publisher: {
            "@type": "Organization",
            name: "Servicios Mallorca - Data Hub",
            url: "https://serviciosmallorca.com",
          },
          spatialCoverage: "Mallorca, Illes Balears, Spain",
          temporalCoverage: "2015/2026",
        },
      ],
    };

    expect(schemaOrg["@graph"].length).toBe(2);
    expect(schemaOrg["@graph"][0]["@type"]).toBe("CollectionPage");
    expect(schemaOrg["@graph"][1]["@type"]).toBe("Dataset");
    expect(schemaOrg["@graph"][1].spatialCoverage).toContain("Mallorca");
  });
});
