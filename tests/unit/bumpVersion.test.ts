/**
 * tests/unit/bumpVersion.test.ts
 *
 * 🧪 PRUEBAS UNITARIAS PARA EL SISTEMA DE AUTO-BUMP DE VERSIÓN (GR-16)
 */

import { describe, it, expect } from "vitest";
import { bumpVersion } from "../../scripts/bump-version";
import fs from "node:fs";
import path from "node:path";

describe("🏷️ Version Auto-Bumping Engine (GR-16)", () => {
  it("exports bumpVersion function", () => {
    expect(typeof bumpVersion).toBe("function");
  });

  it("package.json and changelog.ts version references exist and are valid semver", () => {
    const pkgPath = path.resolve(process.cwd(), "package.json");
    const changelogPath = path.resolve(process.cwd(), "src/data/changelog.ts");

    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    const changelog = fs.readFileSync(changelogPath, "utf-8");

    expect(pkg.version).toMatch(/^\d+\.\d+\.\d+$/);

    const match = changelog.match(/export\s+const\s+CURRENT_PLATFORM_VERSION\s*=\s*["']([^"']+)["']/);
    expect(match).not.toBeNull();
    if (match) {
      expect(match[1]).toBe(pkg.version);
    }
  });

  it("scripts/ship.ts includes bumpVersion step", () => {
    const shipPath = path.resolve(process.cwd(), "scripts/ship.ts");
    const shipContent = fs.readFileSync(shipPath, "utf-8");

    expect(shipContent).toContain('import { bumpVersion } from "./bump-version.ts";');
    expect(shipContent).toContain("bumpVersion(commitMsg)");
  });

  it("scripts/autosave.ts includes bumpVersion step", () => {
    const autosavePath = path.resolve(process.cwd(), "scripts/autosave.ts");
    const autosaveContent = fs.readFileSync(autosavePath, "utf-8");

    expect(autosaveContent).toContain('import { bumpVersion } from "./bump-version.ts";');
    expect(autosaveContent).toContain("bumpVersion(");
  });
});
