/**
 * Tests para src/lib/smartCtaEngine.ts
 *
 * Motor de CTAs inteligentes por vertical (i18n completo es/en/ca/de):
 *   - Prioridad gastronómica: Carta > Reserva WhatsApp > genérico
 *   - Verticals especializados (tattoo/spa/chárter/deporte) con su trackingEvent
 *   - Fallbacks progresivos: WhatsApp directo > Web oficial > Ver detalles
 *   - Normalización numérica de teléfono/WhatsApp (tolerante a espacios/+34)
 */
import { describe, it, expect } from "vitest";
import { getSmartActionCta } from "../../src/lib/smartCtaEngine";

describe("getSmartActionCta · Gastronomía", () => {
  it("prioriza la carta digital sobre cualquier otro canal", () => {
    const cta = getSmartActionCta(
      "gastronomia-restaurantes",
      "Can Pedro",
      "es",
      "+34971000000",
      "",
      "",
      "https://carta.example.com",
    );
    expect(cta.trackingEvent).toBe("cta_view_menu");
    expect(cta.url).toBe("https://carta.example.com");
    expect(cta.label).toBe("Ver Carta / Menú");
    expect(cta.icon).toBe("🍽️");
  });

  it("sin carta reserva mesa vía WhatsApp con mensaje localizado e URL-encoded", () => {
    const cta = getSmartActionCta("restaurante-mallorquin", "S'esporles", "de", undefined, "+34 611 222 333");
    expect(cta.trackingEvent).toBe("cta_book_table_whatsapp");
    expect(cta.url).toContain("https://wa.me/34611222333?");
    expect(cta.url).toContain(encodeURIComponent("Hallo S'esporles"));
    expect(cta.waMessage).toContain("S'esporles");
    expect(cta.isExternal).toBe(true);
  });
});

describe("getSmartActionCta · verticales especializados", () => {
  it("tatuaje → presupuesto vía WhatsApp (✒️)", () => {
    const cta = getSmartActionCta("arte-tatuajes", "Ink Studio", "ca", "", "600999888");
    expect(cta.trackingEvent).toBe("cta_request_quote_tattoo");
    expect(cta.icon).toBe("✒️");
    expect(cta.label).toBe("Demanar Pressupost");
  });

  it("spa/bienestar → cita de tratamiento con teléfono como canal alternativo", () => {
    const cta = getSmartActionCta("spa-belleza", "Zen Palma", "en", "971 555 000");
    expect(cta.trackingEvent).toBe("cta_book_spa_treatment");
    expect(cta.url).toContain("https://wa.me/971555000"); // hereda dígitos del phone
    expect(cta.label).toBe("Book Treatment");
  });

  it("náutica/chárter → consulta de chárter (⛵)", () => {
    const cta = getSmartActionCta("nautica-charter", "Blue Sea", "es", "+34600123456");
    expect(cta.trackingEvent).toBe("cta_charter_inquiry");
    expect(cta.icon).toBe("⛵");
  });

  it("deportes/fitness → reservar pista o sesión (🎾)", () => {
    const cta = getSmartActionCta("deportes-fitness", "Padel Club", "en", "600111222");
    expect(cta.trackingEvent).toBe("cta_book_sports");
    expect(cta.label).toBe("Book Session");
  });
});

describe("getSmartActionCta · cadena de fallbacks generales", () => {
  it("vertical desconocido con WhatsApp → contacto genérico 💬", () => {
    const cta = getSmartActionCta("hogar-jardines", "Negocio Neutro", "es", "600000111");
    expect(cta.trackingEvent).toBe("cta_contact_whatsapp_generic");
    expect(cta.icon).toBe("💬");
  });

  it("sin WhatsApp pero con web → visitar web oficial 🌐", () => {
    const cta = getSmartActionCta(
      "profesionales-servicios",
      "Legal Mallorca",
      "en",
      undefined,
      undefined,
      "https://legal.example.com",
    );
    expect(cta.trackingEvent).toBe("cta_visit_website_generic");
    expect(cta.url).toBe("https://legal.example.com");
    expect(cta.icon).toBe("🌐");
  });

  it("sin ningún canal de contacto → ver detalles interno (#)", () => {
    const cta = getSmartActionCta("cualquiera", "Solo Ficha", "de");
    expect(cta.trackingEvent).toBe("cta_view_details");
    expect(cta.url).toBe("#");
    expect(cta.isExternal).toBe(false);
    expect(cta.label).toBe("Details ansehen");
  });

  it("locale desconocido cae al español en todas las ramas", () => {
    const cta = getSmartActionCta("gastronomia-x", "X", "fr-FR" as never, "6001");
    expect(cta.waMessage?.startsWith("Hola X")).toBe(true);
  });
});
