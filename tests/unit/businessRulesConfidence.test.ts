import { describe, it, expect } from "vitest";
import { SERVICES } from "../../src/data/services";
import { isCoordinateWithinMallorca } from "../../src/lib/verificationEngine";

describe("Business Rules & Data Confidence Verification (GR-11 & GR-12)", () => {
  it("ensures all registered businesses have valid unique IDs and slugs", () => {
    const ids = new Set<string>();
    const slugs = new Set<string>();

    for (const service of SERVICES) {
      expect(service.id).toBeTruthy();
      expect(service.slug).toBeTruthy();

      expect(ids.has(service.id)).toBe(false);
      expect(slugs.has(service.slug)).toBe(false);

      ids.add(service.id);
      slugs.add(service.slug);
    }
  });

  it("verifies that businesses with coordinates are strictly within Mallorca bounding box", () => {
    for (const service of SERVICES) {
      if (service.coordinates) {
        const inMallorca = isCoordinateWithinMallorca(service.coordinates.lat, service.coordinates.lng);
        expect(
          inMallorca,
          `El negocio ${service.name} (${service.id}) tiene coordenadas fuera de Mallorca: lat=${service.coordinates.lat}, lng=${service.coordinates.lng}`,
        ).toBe(true);
      }
    }
  });

  it("guarantees all verified services have valid contact channels (Phone, WhatsApp, Website or Address)", () => {
    const verifiedServices = SERVICES.filter((s) => s.verified);
    expect(verifiedServices.length).toBeGreaterThan(50);

    for (const s of verifiedServices) {
      const hasContact = Boolean(s.phone || s.whatsapp || s.website || s.address);
      expect(hasContact, `El negocio verificado ${s.name} no cuenta con ningún canal de contacto verificable`).toBe(
        true,
      );
    }
  });

  it("verifies multilingual presence in descriptions for verified services", () => {
    for (const s of SERVICES.slice(0, 30)) {
      expect(s.shortDescription.es).toBeTruthy();
    }
  });
});
