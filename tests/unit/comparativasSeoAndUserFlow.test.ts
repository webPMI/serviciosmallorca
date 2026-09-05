import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { HISTORICAL_SECTOR_SERIES } from "../../src/data/historicalSectorStats";
import { BLOG_POSTS } from "../../src/data/posts";

describe("🌐 Observatorio Macroeconómico: User Flow & SEO Integration Suite", () => {
  it("verifica que todos los 16 sectores históricos cuentan con un artículo monográfico en el blog enlazado bidireccionalmente", () => {
    expect(HISTORICAL_SECTOR_SERIES.length).toBe(16);

    const slugTemplate = readFileSync(resolve(__dirname, "../../src/pages/[...locale]/blog/[slug].astro"), "utf-8");
    expect(slugTemplate).toContain("href={`${prefix}estadisticas/comparativas`}");
    expect(slugTemplate).toContain("Veure comparativa de 16 sectors");
    expect(slugTemplate).toContain("Ver comparativa de 16 sectores");

    for (const series of HISTORICAL_SECTOR_SERIES) {
      expect(series.relatedBlogSlug).toBeTruthy();
      const linkedPost = BLOG_POSTS.find((p) => p.slug === series.relatedBlogSlug);
      expect(linkedPost).toBeDefined();
      expect(linkedPost?.historicalSectorId).toBe(series.id);
      expect(linkedPost?.category).toBeTruthy();
    }
  });

  it("verifica que la ruta a /estadisticas/comparativas está presente en Footer.astro para todos los idiomas", () => {
    const footerFile = readFileSync(resolve(__dirname, "../../src/components/Footer.astro"), "utf-8");
    expect(footerFile).toContain("estadisticas/comparativas");
    expect(footerFile).toContain("Comparativas Históricas 20 Años");
  });

  it("verifica que la barra de navegación pública (NavbarPublic.astro) incluye acceso a /estadisticas/comparativas", () => {
    const navbarFile = readFileSync(resolve(__dirname, "../../src/components/NavbarPublic.astro"), "utf-8");
    expect(navbarFile).toContain("estadisticas/comparativas");
    expect(navbarFile).toContain("Comparatives 20 Anys");
    expect(navbarFile).toContain("20-Yr Comparisons");
    expect(navbarFile).toContain("20-Jahre-Vergleich");
  });

  it("verifica que el Data Hub principal (/estadisticas.astro) contiene el CTA destacado hacia comparativas con las 4 características clave", () => {
    const statsFile = readFileSync(resolve(__dirname, "../../src/pages/[...locale]/estadisticas.astro"), "utf-8");
    expect(statsFile).toContain("href={`${prefix}estadisticas/comparativas`}");
    expect(statsFile).toContain("16 Sectores");
    expect(statsFile).toContain("656 Puntos Semestrales");
    expect(statsFile).toContain("Curva Base 100");
    expect(statsFile).toContain("CSV RFC 4180");
  });

  it("audita que la página comparativas.astro define Schema.org enriquecido con Dataset, BreadcrumbList y CollectionPage", () => {
    const compFile = readFileSync(resolve(__dirname, "../../src/pages/[...locale]/estadisticas/comparativas.astro"), "utf-8");
    expect(compFile).toContain('"@type": "CollectionPage"');
    expect(compFile).toContain('"@type": "BreadcrumbList"');
    expect(compFile).toContain('"@type": "Dataset"');
    expect(compFile).toContain("variableMeasured");
    expect(compFile).toContain("temporalCoverage");
    expect(compFile).toContain("spatialCoverage");
  });
});
