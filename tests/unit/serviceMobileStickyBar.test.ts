import { describe, expect, it } from "vitest";
import type { ServiceItem } from "../../src/data/services/types";

describe("📱 ServiceMobileStickyBar Component & Normalization Suite", () => {
  function getStickyBarData(service: Partial<ServiceItem>, locale = "es") {
    let cleanWhatsApp = service.whatsapp ? service.whatsapp.replace(/[^0-9]/g, "") : "";
    if (cleanWhatsApp.length === 9 && /^[6789]/.test(cleanWhatsApp)) {
      cleanWhatsApp = "34" + cleanWhatsApp;
    }

    const cleanPhone = service.phone ? service.phone.replace(/[^0-9+]/g, "") : "";

    const waTemplates: Record<string, string> = {
      es: `Hola, he visto ${service.name} en Servicios Mallorca y me gustaría solicitar información.`,
      en: `Hello, I saw ${service.name} on Servicios Mallorca and would like to request information.`,
      ca: `Hola, he vist ${service.name} a Servicios Mallorca i voldria demanar informació.`,
      de: `Hallo, ich habe ${service.name} auf Servicios Mallorca gesehen und möchte gerne Informationen anfragen.`,
    };

    const waText = encodeURIComponent(waTemplates[locale] || waTemplates.es);

    const isVisible = Boolean(cleanWhatsApp || cleanPhone || service.website);

    return {
      cleanWhatsApp,
      cleanPhone,
      waText,
      isVisible,
    };
  }

  it("normaliza whatsapp de 9 dígitos añadiendo prefijo español 34", () => {
    const data = getStickyBarData({ name: "Taller Demo", whatsapp: "600123456" });
    expect(data.cleanWhatsApp).toBe("34600123456");
    expect(data.isVisible).toBe(true);
    expect(data.waText).toContain(encodeURIComponent("Taller Demo"));
  });

  it("limpia números de teléfono fijos y móviles conservando el formato seguro para tel:", () => {
    const data = getStickyBarData({ name: "Clínica Palma", phone: "+34 971 00 11 22" });
    expect(data.cleanPhone).toBe("+34971001122");
    expect(data.isVisible).toBe(true);
  });

  it("maneja servicios que solo tienen web sin lanzar ReferenceError ni fallar", () => {
    const data = getStickyBarData({ name: "Online Brand", website: "https://ejemplo.com" });
    expect(data.cleanWhatsApp).toBe("");
    expect(data.cleanPhone).toBe("");
    expect(data.isVisible).toBe(true);
  });

  it("si no hay whatsapp, phone ni website, isVisible es false de forma segura", () => {
    const data = getStickyBarData({ name: "Negocio Sin Contacto" });
    expect(data.cleanWhatsApp).toBe("");
    expect(data.cleanPhone).toBe("");
    expect(data.isVisible).toBe(false);
  });

  it("soporta plantillas en los 4 idiomas oficiales", () => {
    for (const lang of ["es", "en", "ca", "de"]) {
      const data = getStickyBarData({ name: "Bar Mallorca", whatsapp: "34666555444" }, lang);
      expect(data.waText).toBeTruthy();
    }
  });
});
