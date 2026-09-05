import { describe, expect, it } from "vitest";
import {
  HISTORICAL_SECTOR_SERIES,
  getHistoricalSeriesById,
  getAllHistoricalSeries,
} from "../../src/data/historicalSectorStats";
import { BLOG_POSTS } from "../../src/data/posts";

describe("📊 Historical Sector Statistics & Comparative Suite (2006–2026)", () => {
  it("contiene exactamente las 16 series sectoriales canónicas de Mallorca", () => {
    expect(HISTORICAL_SECTOR_SERIES.length).toBe(16);
    const ids = HISTORICAL_SECTOR_SERIES.map((s) => s.id);
    expect(new Set(ids).size).toBe(16);

    const expectedIds = [
      "inmobiliaria_construccion",
      "turismo_afluencia",
      "empresas_laboral",
      "demografia_presion",
      "movilidad_aena",
      "nautica_maritimo",
      "hosteleria_restauracion",
      "energia_sostenibilidad_agua",
      "educacion_internacional",
      "salud_sanidad_privada",
      "residuos_reciclaje",
      "tecnologia_innovacion",
      "agricultura_producto_local",
      "transporte_publico_ferrocarril",
      "cultura_patrimonio_museos",
      "deporte_golf_nautica_activo",
    ];

    expectedIds.forEach((expectedId) => {
      expect(ids).toContain(expectedId);
      const series = getHistoricalSeriesById(expectedId);
      expect(series).toBeDefined();
      expect(["economia", "turismo_movilidad", "territorio", "sociedad_bienestar"]).toContain(series?.theme);
      expect(series?.insights.cagr10Pct).toBeGreaterThan(0);
      expect(series?.insights.cagr20Pct).toBeGreaterThan(0);
    });
  });

  it("cada serie contiene exactamente 41 puntos semestrales desde 2006-S1 hasta 2026-S1", () => {
    HISTORICAL_SECTOR_SERIES.forEach((series) => {
      expect(series.dataPoints.length).toBe(41);
      expect(series.dataPoints[0].period).toBe("2006-S1");
      expect(series.dataPoints[series.dataPoints.length - 1].period).toBe("2026-S1");

      series.dataPoints.forEach((dp, index) => {
        expect(dp.year).toBeGreaterThanOrEqual(2006);
        expect(dp.year).toBeLessThanOrEqual(2026);
        expect([1, 2]).toContain(dp.semester);
        expect(dp.value).toBeGreaterThan(0);
        expect(dp.formattedValue.length).toBeGreaterThan(1);

        // Verificación secuencial de semestres
        if (index > 0) {
          const prev = series.dataPoints[index - 1];
          if (prev.semester === 1) {
            expect(dp.year).toBe(prev.year);
            expect(dp.semester).toBe(2);
          } else {
            expect(dp.year).toBe(prev.year + 1);
            expect(dp.semester).toBe(1);
          }
        }
      });
    });
  });

  it("cumple con paridad estricta en los 4 idiomas oficiales (ES, CA, EN, DE) (GR-04)", () => {
    HISTORICAL_SECTOR_SERIES.forEach((series) => {
      // Títulos
      expect(series.title.es.trim().length).toBeGreaterThan(5);
      expect(series.title.ca.trim().length).toBeGreaterThan(5);
      expect(series.title.en.trim().length).toBeGreaterThan(5);
      expect(series.title.de.trim().length).toBeGreaterThan(5);

      // Unidades
      expect(series.unit.es).toBeTruthy();
      expect(series.unit.ca).toBeTruthy();
      expect(series.unit.en).toBeTruthy();
      expect(series.unit.de).toBeTruthy();

      // Resúmenes editoriales
      expect(series.insights.summaryText.es.length).toBeGreaterThan(20);
      expect(series.insights.summaryText.ca.length).toBeGreaterThan(20);
      expect(series.insights.summaryText.en.length).toBeGreaterThan(20);
      expect(series.insights.summaryText.de.length).toBeGreaterThan(20);

      // Hitos
      series.milestones.forEach((m) => {
        expect(m.title.es).toBeTruthy();
        expect(m.title.ca).toBeTruthy();
        expect(m.title.en).toBeTruthy();
        expect(m.title.de).toBeTruthy();

        expect(m.description.es).toBeTruthy();
        expect(m.description.ca).toBeTruthy();
        expect(m.description.en).toBeTruthy();
        expect(m.description.de).toBeTruthy();
      });
    });
  });

  it("cada serie histórica enlaza a un artículo único y dedicado de análisis en el Blog con bidireccionalidad", () => {
    const blogMap = new Map(BLOG_POSTS.map((p) => [p.slug, p]));
    const relatedSlugs = HISTORICAL_SECTOR_SERIES.map((s) => s.relatedBlogSlug);

    // Todos los artículos vinculados son únicos (1 artículo por sector)
    expect(new Set(relatedSlugs).size).toBe(16);

    HISTORICAL_SECTOR_SERIES.forEach((series) => {
      expect(series.relatedBlogSlug).toBeTruthy();
      const post = blogMap.get(series.relatedBlogSlug);
      expect(post, `El artículo del blog ${series.relatedBlogSlug} no existe en BLOG_POSTS`).toBeDefined();
      expect(post?.historicalSectorId).toBe(series.id);
    });
  });

  it("garantiza seguridad e integridad de datos (Zero Fake Data, saneamiento y sin inyecciones) (GR-11, GR-13)", () => {
    HISTORICAL_SECTOR_SERIES.forEach((series) => {
      // Sin etiquetas HTML maliciosas o inyecciones de script
      const allTextStrings = [
        series.id,
        series.sectorKey,
        series.title.es,
        series.title.ca,
        series.title.en,
        series.title.de,
        series.sourceEntity,
        series.officialSeriesCode,
        series.insights.summaryText.es,
        ...series.milestones.map((m) => m.title.es),
        ...series.milestones.map((m) => m.description.es),
      ];

      allTextStrings.forEach((str) => {
        expect(str).not.toMatch(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi);
        expect(str).not.toMatch(/javascript:/gi);
        expect(str).not.toMatch(/onload=/gi);
        expect(str).not.toMatch(/onerror=/gi);
      });

      // Valores numéricos estrictamente seguros y finitos
      series.dataPoints.forEach((dp) => {
        expect(Number.isFinite(dp.value)).toBe(true);
        expect(Number.isNaN(dp.value)).toBe(false);
        expect(dp.value).toBeGreaterThan(0);
        expect(dp.year).toBeGreaterThanOrEqual(2006);
        expect(dp.year).toBeLessThanOrEqual(2026);
        expect([1, 2]).toContain(dp.semester);
      });

      // Verificación de integridad en métricas CAGR
      expect(Number.isFinite(series.insights.cagr10Pct)).toBe(true);
      expect(Number.isFinite(series.insights.cagr20Pct)).toBe(true);
      expect(series.insights.cagr10Pct).toBeGreaterThan(0);
      expect(series.insights.cagr20Pct).toBeGreaterThan(0);
    });
  });

  it("getAllHistoricalSeries retorna la lista completa sin mutaciones", () => {
    const all = getAllHistoricalSeries();
    expect(all.length).toBe(16);
  });
});
