import { describe, it, expect } from "vitest";
import { CHANGELOG_RELEASES, CURRENT_PLATFORM_VERSION, PLATFORM_RELEASE_DATE } from "../../src/data/changelog";

describe("🚀 Changelog & Beta v0.01 Data Integrity (GR-03, GR-04)", () => {
  it("defines a valid semantic version for the current platform", () => {
    expect(CURRENT_PLATFORM_VERSION).toMatch(/^\d+\.\d+(-[a-z0-9]+)?$/);
    expect(CURRENT_PLATFORM_VERSION).toBe("0.01-beta");
    expect(PLATFORM_RELEASE_DATE).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("contains at least one active release log with complete 4-language translations", () => {
    expect(CHANGELOG_RELEASES.length).toBeGreaterThan(0);

    const latest = CHANGELOG_RELEASES[0];
    expect(latest.version).toBe("0.01");
    expect(latest.type).toBe("BETA");

    // Summary i18n
    expect(latest.summary.es).toBeTruthy();
    expect(latest.summary.en).toBeTruthy();
    expect(latest.summary.ca).toBeTruthy();
    expect(latest.summary.de).toBeTruthy();

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
