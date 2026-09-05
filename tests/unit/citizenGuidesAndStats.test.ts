import { describe, expect, it } from "vitest";
import { CITIZEN_GUIDES } from "../../src/data/citizenGuides";
import { OFFICIAL_STATISTICS } from "../../src/data/officialStats";

describe("🏛️ Citizen Guides & Official Intelligence Suite", () => {
  it("contiene guías ciudadanas y cada una tiene slug e ID únicos", () => {
    expect(CITIZEN_GUIDES.length).toBeGreaterThanOrEqual(6);
    const slugs = CITIZEN_GUIDES.map((g) => g.slug);
    const ids = CITIZEN_GUIDES.map((g) => g.id);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("cumple con paridad estricta en 4 idiomas (ES, CA, EN, DE) en títulos y resúmenes (GR-04)", () => {
    CITIZEN_GUIDES.forEach((guide) => {
      expect(guide.title.es.trim().length).toBeGreaterThan(5);
      expect(guide.title.ca.trim().length).toBeGreaterThan(5);
      expect(guide.title.en.trim().length).toBeGreaterThan(5);
      expect(guide.title.de.trim().length).toBeGreaterThan(5);

      expect(guide.summary.es.trim().length).toBeGreaterThan(15);
      expect(guide.summary.ca.trim().length).toBeGreaterThan(15);
      expect(guide.summary.en.trim().length).toBeGreaterThan(15);
      expect(guide.summary.de.trim().length).toBeGreaterThan(15);
    });
  });

  it("cada guía posee pasos numerados y documentos con traducciones completas", () => {
    CITIZEN_GUIDES.forEach((guide) => {
      expect(guide.steps.length).toBeGreaterThanOrEqual(2);
      guide.steps.forEach((step, idx) => {
        expect(step.stepNumber).toBe(idx + 1);
        expect(step.title.es).toBeTruthy();
        expect(step.title.ca).toBeTruthy();
        expect(step.title.en).toBeTruthy();
        expect(step.title.de).toBeTruthy();
        expect(step.description.es).toBeTruthy();
      });

      expect(guide.documents.length).toBeGreaterThanOrEqual(1);
      guide.documents.forEach((doc) => {
        expect(doc.id).toBeTruthy();
        expect(doc.name.es).toBeTruthy();
        expect(doc.name.ca).toBeTruthy();
        expect(doc.name.en).toBeTruthy();
        expect(doc.name.de).toBeTruthy();
      });
    });
  });

  it("todas las oficinas físicas tienen coordenadas GPS reales en la isla de Mallorca (GR-12)", () => {
    CITIZEN_GUIDES.forEach((guide) => {
      expect(guide.offices.length).toBeGreaterThanOrEqual(1);
      guide.offices.forEach((office) => {
        expect(office.name).toBeTruthy();
        expect(office.address).toBeTruthy();
        expect(office.phone).toMatch(/^\+34\s[89]\d{2}/);

        // Bounding box de Mallorca: lat 39.15 - 40.0, lng 2.25 - 3.55
        expect(office.coordinates.lat).toBeGreaterThanOrEqual(39.15);
        expect(office.coordinates.lat).toBeLessThanOrEqual(40.0);
        expect(office.coordinates.lng).toBeGreaterThanOrEqual(2.25);
        expect(office.coordinates.lng).toBeLessThanOrEqual(3.55);
      });
    });
  });

  it("todas las fuentes oficiales enlazan a dominios institucionales seguros HTTPS (GR-11 & GR-13)", () => {
    const validOfficialDomains = [
      "palma.cat",
      "caib.es",
      "conselldemallorca.cat",
      "ibsalut.es",
      "gob.es",
      "emtpalma.cat",
      "tib.org",
    ];

    CITIZEN_GUIDES.forEach((guide) => {
      expect(guide.officialSourceUrl).toMatch(/^https:\/\//);
      const isOfficial = validOfficialDomains.some((dom) => guide.officialSourceUrl.includes(dom));
      expect(isOfficial).toBe(true);
    });
  });
});

describe("📊 Official Statistics Suite (IBESTAT & Open Data)", () => {
  it("contiene estadísticas oficiales con métricas válidas", () => {
    expect(OFFICIAL_STATISTICS.length).toBeGreaterThanOrEqual(4);
    OFFICIAL_STATISTICS.forEach((stat) => {
      expect(stat.id).toBeTruthy();
      expect(stat.value).toBeTruthy();
      expect(stat.sourceUrl).toMatch(/^https:\/\//);
      expect([
        "IBESTAT",
        "Consell de Mallorca",
        "Govern CAIB",
        "EMT Palma",
        "TIB",
        "Registro Mercantil",
        "SOIB",
        "Ajuntament de Palma",
        "Seguridad Social",
        "INE",
        "AENA",
      ]).toContain(stat.sourceEntity);
      expect(stat.officialSeriesCode).toBeTruthy();
      expect(["Mallorca", "Palma", "Illes Balears"]).toContain(stat.dataScope);
    });
  });

  it("cumple con paridad en 4 idiomas en títulos y notas destacadas (GR-04)", () => {
    OFFICIAL_STATISTICS.forEach((stat) => {
      expect(stat.title.es).toBeTruthy();
      expect(stat.title.ca).toBeTruthy();
      expect(stat.title.en).toBeTruthy();
      expect(stat.title.de).toBeTruthy();

      expect(stat.unit.es).toBeTruthy();
      expect(stat.unit.ca).toBeTruthy();
      expect(stat.unit.en).toBeTruthy();
      expect(stat.unit.de).toBeTruthy();

      expect(stat.highlightNote.es).toBeTruthy();
      expect(stat.highlightNote.ca).toBeTruthy();
      expect(stat.highlightNote.en).toBeTruthy();
      expect(stat.highlightNote.de).toBeTruthy();
    });
  });
});
