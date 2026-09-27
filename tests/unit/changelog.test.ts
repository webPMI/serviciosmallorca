import { describe, it, expect } from "vitest";
import {
  CHANGELOG_RELEASES,
  CURRENT_PLATFORM_VERSION,
  PLATFORM_RELEASE_DATE,
  PLATFORM_LAST_BUILD_TIMESTAMP,
  getFormattedBuildTimestamp,
} from "../../src/data/changelog";

describe("🚀 Changelog & Beta v0.02 Data Integrity (GR-03, GR-04, GR-16)", () => {
  it("defines a valid semantic version and ISO 8601 build timestamp (GR-16)", () => {
    expect(CURRENT_PLATFORM_VERSION).toMatch(/^\d+\.\d+(-[a-z0-9]+)?$/);
    // No fijamos un número concreto: varios agentes suben versión a la vez y lo que
    // debe cumplirse es la COHERENCIA entre la versión de plataforma y la última entrada.
    expect(CURRENT_PLATFORM_VERSION).toBe(CHANGELOG_RELEASES[0].version);
    expect(PLATFORM_RELEASE_DATE).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(PLATFORM_LAST_BUILD_TIMESTAMP).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);

    const formattedEs = getFormattedBuildTimestamp("es");
    const formattedEn = getFormattedBuildTimestamp("en");
    const formattedCa = getFormattedBuildTimestamp("ca");
    const formattedDe = getFormattedBuildTimestamp("de");

    expect(formattedEs).toBeTruthy();
    expect(formattedEn).toBeTruthy();
    expect(formattedCa).toBeTruthy();
    expect(formattedDe).toBeTruthy();
  });

  it("contains at least one active release log with complete 4-language translations", () => {
    expect(CHANGELOG_RELEASES.length).toBeGreaterThan(0);

    const latest = CHANGELOG_RELEASES[0];
    // La entrada más reciente del changelog es la que fija la versión de plataforma (GR-16).
    expect(latest.version).toBe(CURRENT_PLATFORM_VERSION);
    expect(["MAJOR", "MINOR", "PATCH", "BETA"]).toContain(latest.type);

    // Summary i18n
    expect(latest.summary.es).toBeTruthy();
    expect(latest.summary.en).toBeTruthy();
    expect(latest.summary.ca).toBeTruthy();
    expect(latest.summary.de).toBeTruthy();

    // VersionLabel i18n
    expect(latest.versionLabel.es).toBeTruthy();
    expect(latest.versionLabel.en).toBeTruthy();
    expect(latest.versionLabel.ca).toBeTruthy();
    expect(latest.versionLabel.de).toBeTruthy();

    // Highlights i18n
    expect(latest.highlights.es.length).toBeGreaterThan(0);
    expect(latest.highlights.en.length).toBeGreaterThan(0);
    expect(latest.highlights.ca.length).toBeGreaterThan(0);
    expect(latest.highlights.de.length).toBeGreaterThan(0);
  });

  it("validates that all changelog entries have categories and localized content", () => {
    const validCategories = ["FEATURE", "FIX", "PERFORMANCE", "TAXONOMY", "SECURITY", "DOCS"];

    for (const release of CHANGELOG_RELEASES) {
      expect(release.entries.length).toBeGreaterThan(0);

      for (const entry of release.entries) {
        expect(validCategories).toContain(entry.category);
        expect(entry.title.es.trim().length).toBeGreaterThan(0);
        expect(entry.title.en.trim().length).toBeGreaterThan(0);
        expect(entry.title.ca.trim().length).toBeGreaterThan(0);
        expect(entry.title.de.trim().length).toBeGreaterThan(0);
        expect(entry.description.es.trim().length).toBeGreaterThan(0);
        expect(entry.description.en.trim().length).toBeGreaterThan(0);
        expect(entry.description.ca.trim().length).toBeGreaterThan(0);
        expect(entry.description.de.trim().length).toBeGreaterThan(0);
      }
    }
  });
});
