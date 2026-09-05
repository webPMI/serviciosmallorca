import { describe, expect, it } from "vitest";

describe("💬 FloatingWhatsAppCTA Component & Normalization Suite", () => {
  function getCleanPhone(rawPhone?: string): string {
    let clean = rawPhone ? rawPhone.replace(/[^0-9]/g, "") : "";
    if (clean.length === 9 && /^[6789]/.test(clean)) {
      clean = "34" + clean;
    }
    return clean;
  }

  function getWaUrl(phone: string, text: string): string {
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }

  it("normaliza números locales españoles de 9 dígitos anteponiendo el código de país 34", () => {
    expect(getCleanPhone("971 12 34 56")).toBe("34971123456");
    expect(getCleanPhone("612 34 56 78")).toBe("34612345678");
    expect(getCleanPhone("712345678")).toBe("34712345678");
    expect(getCleanPhone("871 90 12 34")).toBe("34871901234");
  });

  it("mantiene intactos números con prefijo internacional ya incluido", () => {
    expect(getCleanPhone("+34 971 12 34 56")).toBe("34971123456");
    expect(getCleanPhone("0034 612 345 678")).toBe("0034612345678");
    expect(getCleanPhone("+49 170 1234567")).toBe("491701234567");
    expect(getCleanPhone("+44 7911 123456")).toBe("447911123456");
  });

  it("retorna string vacío si el teléfono es undefined o vacío sin causar excepciones", () => {
    expect(getCleanPhone(undefined)).toBe("");
    expect(getCleanPhone("")).toBe("");
    expect(getCleanPhone("   ")).toBe("");
  });

  it("genera la URL de WhatsApp wa.me con codificación de texto limpia para cada idioma", () => {
    const serviceName = "Can Joan de S'Aigo";
    const templates = {
      es: `Hola, he visto ${serviceName} en Servicios Mallorca y me gustaría solicitar información.`,
      en: `Hello, I saw ${serviceName} on Servicios Mallorca and would like to request information.`,
      ca: `Hola, he vist ${serviceName} a Servicios Mallorca i voldria demanar informació.`,
      de: `Hallo, ich habe ${serviceName} auf Servicios Mallorca gesehen und möchte gerne Informationen anfragen.`,
    };

    const phone = getCleanPhone("971712649");
    expect(phone).toBe("34971712649");

    const urlEs = getWaUrl(phone, templates.es);
    expect(urlEs).toContain("https://wa.me/34971712649?text=");
    expect(urlEs).toContain(encodeURIComponent(serviceName));

    const urlDe = getWaUrl(phone, templates.de);
    expect(urlDe).toContain(encodeURIComponent("Hallo"));
  });
});
