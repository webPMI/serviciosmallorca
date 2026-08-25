import { describe, it, expect } from "vitest";
import { trackConversion, initAutomaticClickTracking } from "../../src/lib/conversionTracking";

describe("Conversion Tracking & Telemetry Engine", () => {
  it("does not throw in non-browser or missing ID environments", () => {
    expect(() => trackConversion("", "whatsapp_click")).not.toThrow();
  });

  it("handles trackConversion safely with metadata", () => {
    expect(() => trackConversion("el-camino-palma", "whatsapp_click", { source: "hero_button" })).not.toThrow();
  });

  it("initializes automatic click tracking safely", () => {
    expect(() => initAutomaticClickTracking()).not.toThrow();
  });
});
