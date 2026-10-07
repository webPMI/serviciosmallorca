import { describe, expect, it } from "vitest";
import { formatWhatsAppLink, isValidWhatsAppNumber } from "../../src/lib/whatsappUtils";

describe("💬 FloatingWhatsAppCTA & WhatsApp Utilities Suite", () => {
  it("valida números móviles españoles y rechaza tajantemente teléfonos fijos", () => {
    // Móviles válidos (6xx, 7xx)
    expect(isValidWhatsAppNumber("612 34 56 78")).toBe(true);
    expect(isValidWhatsAppNumber("+34 612 345 678")).toBe(true);
    expect(isValidWhatsAppNumber("712345678")).toBe(true);
    expect(isValidWhatsAppNumber("+34 722 11 22 33")).toBe(true);

    // Teléfonos fijos de Baleares y resto de España (971, 871, 9xx, 8xx) deben ser RECHAZADOS
    expect(isValidWhatsAppNumber("971 12 34 56")).toBe(false);
    expect(isValidWhatsAppNumber("+34 971 72 42 34")).toBe(false);
    expect(isValidWhatsAppNumber("871 90 12 34")).toBe(false);
    expect(isValidWhatsAppNumber("+34 91 123 45 67")).toBe(false);
    expect(isValidWhatsAppNumber("93 456 78 90")).toBe(false);
  });

  it("acepta números internacionales legítimos con longitud válida", () => {
    expect(isValidWhatsAppNumber("+49 170 1234567")).toBe(true);
    expect(isValidWhatsAppNumber("+44 7911 123456")).toBe(true);
    expect(isValidWhatsAppNumber("+1 555 123 4567")).toBe(true);
  });

  it("rechaza entradas vacías, undefined o con longitud insuficiente", () => {
    expect(isValidWhatsAppNumber(undefined)).toBe(false);
    expect(isValidWhatsAppNumber("")).toBe(false);
    expect(isValidWhatsAppNumber("   ")).toBe(false);
    expect(isValidWhatsAppNumber("12345")).toBe(false);
  });

  it("formatWhatsAppLink genera URL limpia wa.me solo para números válidos y retorna null para fijos", () => {
    const serviceName = "Urban Soul Tattoo";
    const textEs = `Hola, he visto ${serviceName} en Servicios Mallorca y me gustaría solicitar información.`;

    // Con móvil
    const urlMobile = formatWhatsAppLink("+34 654 321 987", textEs);
    expect(urlMobile).toBe(`https://wa.me/34654321987?text=${encodeURIComponent(textEs)}`);

    // Con fijo (ej: Bar España) debe retornar null para evitar enlaces rotos
    const urlLandline = formatWhatsAppLink("+34 971 72 42 34", textEs);
    expect(urlLandline).toBeNull();

    // Sin número
    expect(formatWhatsAppLink(undefined, textEs)).toBeNull();
  });
});

