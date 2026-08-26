import { describe, it, expect } from "vitest";
import { getSmartActionCta } from "../../src/lib/smartCtaEngine";

describe("Smart-Action Direct Conversion Engine (CTAs)", () => {
  it("provides restaurant specific actions (View Menu or Book Table) with prefilled message", () => {
    const restoCta = getSmartActionCta(
      "gastronomia-catering",
      "El Camino Palma",
      "es",
      "+34 971 00 00 00",
      "+34 971 00 00 00",
      "https://elcaminopalma.com",
      "https://elcaminopalma.com/menu",
    );

    expect(restoCta.label).toBe("Ver Carta / Menú");
    expect(restoCta.url).toBe("https://elcaminopalma.com/menu");
    expect(restoCta.icon).toBe("🍽️");
  });

  it("provides tattoo specific action (Pedir Presupuesto / Angebot anfordern) in German and Spanish", () => {
    const tattooEs = getSmartActionCta(
      "arte-tatuajes",
      "Good Luck Tattoo",
      "es",
      "+34 600 00 00 00",
      "+34 600 00 00 00",
    );
    expect(tattooEs.label).toBe("Pedir Presupuesto");
    expect(tattooEs.url).toContain("wa.me");
    expect(tattooEs.waMessage).toContain("pedir presupuesto");

    const tattooDe = getSmartActionCta(
      "arte-tatuajes",
      "Good Luck Tattoo",
      "de",
      "+34 600 00 00 00",
      "+34 600 00 00 00",
    );
    expect(tattooDe.label).toBe("Angebot anfordern");
    expect(tattooDe.waMessage).toContain("Angebot anfordern");
  });

  it("provides spa specific action (Reservar Tratamiento / Behandlung buchen)", () => {
    const spaDe = getSmartActionCta("spas-bienestar", "Arabella Spa", "de", "+34 971 11 22 33", "+34 971 11 22 33");
    expect(spaDe.label).toBe("Behandlung buchen");
    expect(spaDe.icon).toBe("✨");
    expect(spaDe.waMessage).toContain("Behandlungen");
  });

  it("provides nautical charter inquiry action", () => {
    const yachtEn = getSmartActionCta(
      "nautica-charter",
      "Oasis Catamaran",
      "en",
      "+34 672 10 04 24",
      "+34 672 10 04 24",
    );
    expect(yachtEn.label).toBe("Charter Inquiry");
    expect(yachtEn.icon).toBe("⛵");
  });
});
