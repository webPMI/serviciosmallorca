import { describe, it, expect } from "vitest";
import {
  getLocaleFromUrl,
  getLangPrefix,
  loadTranslations,
  loadNamespace,
  detectUserLocale,
  LOCALES,
} from "../../src/i18n";

describe("i18n utility module", () => {
  describe("getLocaleFromUrl", () => {
    it('returns "es" by default when no locale in path', () => {
      const url = new URL("https://campfit.app/");
      expect(getLocaleFromUrl(url)).toBe("es");
    });

    it("detects valid locales from URL path", () => {
      expect(getLocaleFromUrl(new URL("https://campfit.app/en"))).toBe("en");
      expect(getLocaleFromUrl(new URL("https://campfit.app/ca/register"))).toBe("ca");
      expect(getLocaleFromUrl(new URL("https://campfit.app/de/servicios"))).toBe("de");
      expect(getLocaleFromUrl(new URL("https://campfit.app/es/login"))).toBe("es");
    });

    it('falls back to "es" for unsupported locale segments', () => {
      const url = new URL("https://campfit.app/fr/dashboard");
      expect(getLocaleFromUrl(url)).toBe("es");
    });
  });

  describe("getLangPrefix", () => {
    it("generates correct language route prefix", () => {
      expect(getLangPrefix("es")).toBe("/es/");
      expect(getLangPrefix("en")).toBe("/en/");
      expect(getLangPrefix("ca")).toBe("/ca/");
      expect(getLangPrefix("de")).toBe("/de/");
    });
  });

  describe("detectUserLocale", () => {
    it("detects locale from cookie first", () => {
      const req = new Request("https://campfit.app/", {
        headers: { cookie: "locale=en; other=123" },
      });
      expect(detectUserLocale(req)).toBe("en");
    });

    it("detects German locale from cookie", () => {
      const req = new Request("https://campfit.app/", {
        headers: { cookie: "locale=de; other=123" },
      });
      expect(detectUserLocale(req)).toBe("de");
    });

    it("detects German locale from Geo-Targeting IP Country header (DE, AT, CH)", () => {
      const reqDE = new Request("https://serviciosmallorca.com/", {
        headers: { "cf-ipcountry": "DE" },
      });
      expect(detectUserLocale(reqDE)).toBe("de");

      const reqAT = new Request("https://serviciosmallorca.com/", {
        headers: { "x-country-code": "AT" },
      });
      expect(detectUserLocale(reqAT)).toBe("de");
    });

    it("detects English locale from Geo-Targeting IP Country header (GB, US)", () => {
      const reqGB = new Request("https://serviciosmallorca.com/", {
        headers: { "cf-ipcountry": "GB" },
      });
      expect(detectUserLocale(reqGB)).toBe("en");
    });

    it("prioritizes explicit cookie over Geo-Targeting header", () => {
      const req = new Request("https://serviciosmallorca.com/", {
        headers: {
          "cf-ipcountry": "DE",
          cookie: "locale=es",
        },
      });
      expect(detectUserLocale(req)).toBe("es");
    });

    it('defaults to "es" when no header or cookie matches', () => {
      const req = new Request("https://serviciosmallorca.com/");
      expect(detectUserLocale(req)).toBe("es");
    });
  });

  describe("loadTranslations, loadNamespace and modular parity", () => {
    it("loads non-empty translations for all supported locales", async () => {
      for (const locale of LOCALES) {
        const trans = await loadTranslations(locale);
        expect(trans).toBeDefined();
        expect(Object.keys(trans).length).toBe(531);
        expect(trans["site.title"]).toBe("Servicios Mallorca");
      }
    });

    it("ensures key parity between es, en, ca, and de locale files", async () => {
      const es = await loadTranslations("es");
      const en = await loadTranslations("en");
      const ca = await loadTranslations("ca");
      const de = await loadTranslations("de");

      const esKeys = Object.keys(es).sort();
      const enKeys = Object.keys(en).sort();
      const caKeys = Object.keys(ca).sort();
      const deKeys = Object.keys(de).sort();

      expect(enKeys).toEqual(esKeys);
      expect(caKeys).toEqual(esKeys);
      expect(deKeys).toEqual(esKeys);
    });

    it("loads individual namespaces independently and verifies exact parity", async () => {
      const namespaces = [
        "common",
        "home",
        "services",
        "sports",
        "heritage",
        "community",
        "blog",
        "honor",
        "auth",
        "legal",
      ] as const;

      for (const ns of namespaces) {
        const esNs = await loadNamespace("es", ns);
        const enNs = await loadNamespace("en", ns);
        const caNs = await loadNamespace("ca", ns);
        const deNs = await loadNamespace("de", ns);

        expect(Object.keys(esNs).length).toBeGreaterThan(0);
        expect(Object.keys(enNs).sort()).toEqual(Object.keys(esNs).sort());
        expect(Object.keys(caNs).sort()).toEqual(Object.keys(esNs).sort());
        expect(Object.keys(deNs).sort()).toEqual(Object.keys(esNs).sort());
      }
    });

    it("allows loading a subset of namespaces on demand", async () => {
      const subset = await loadTranslations("es", ["sports", "heritage"]);
      expect(subset["sports.badge"]).toBeDefined();
      expect(subset["heritage.timeline.title"]).toBeDefined();
      expect(subset["legal.privacy.title"]).toBeUndefined();
    });
  });
});
