import { describe, it, expect } from "vitest";
import {
  translateText,
  generateTrilingualField,
  generateTrilingualArray,
  autoTranslateTrilingualBusinessData,
} from "../../src/lib/translator.ts";

describe("Automated Translation Engine (Zero-Token)", () => {
  it("translates Spanish text into English and Catalan accurately", async () => {
    const input = "Restaurante de cocina mediterránea tradicional en Mallorca";
    const en = await translateText(input, "en");
    const ca = await translateText(input, "ca");

    expect(en).toBeDefined();
    expect(en.length).toBeGreaterThan(0);
    expect(en.toLowerCase()).toContain("restaurant");

    expect(ca).toBeDefined();
    expect(ca.length).toBeGreaterThan(0);
    expect(ca.toLowerCase()).toContain("restaurant");
  }, 10000);

  it("generates trilingual fields seamlessly", async () => {
    const res = await generateTrilingualField("Servicio profesional de fontanería y reformas en Palma");
    expect(res.es).toBe("Servicio profesional de fontanería y reformas en Palma");
    expect(res.en.length).toBeGreaterThan(0);
    expect(res.ca.length).toBeGreaterThan(0);
  }, 10000);

  it("translates arrays of specialties and highlights", async () => {
    const list = ["Tatuajes realistas", "Piercing en titanio"];
    const res = await generateTrilingualArray(list);

    expect(res.es).toEqual(list);
    expect(res.en.length).toBe(2);
    expect(res.ca.length).toBe(2);
  }, 10000);

  it("enriches draft business data into complete 3-language structure", async () => {
    const draft = {
      shortDescriptionEs: "Estudio de arte y tatuajes en Palma.",
      specialtiesEs: ["Blackwork", "Fine Line"],
      highlightsEs: ["Más de 10 años de experiencia en Baleares"],
    };

    const enriched = await autoTranslateTrilingualBusinessData(draft);
    expect(enriched.shortDescription.es).toBe("Estudio de arte y tatuajes en Palma.");
    expect(enriched.shortDescription.en.length).toBeGreaterThan(0);
    expect(enriched.shortDescription.ca.length).toBeGreaterThan(0);
    expect(enriched.specialties.en.length).toBe(2);
    expect(enriched.highlights.ca.length).toBe(1);
  }, 15000);
});
