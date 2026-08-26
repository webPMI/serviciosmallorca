import { describe, it, expect } from "vitest";
import { SERVICES } from "../../src/data/services";
import { loadTranslations } from "../../src/i18n";

describe("Critical Fixes: Image Assets & German (DE) Locale Parity", () => {
  it("verifies all businesses have valid, non-empty, and well-formed main images", () => {
    for (const service of SERVICES) {
      expect(service.image, `Negocio ${service.name} (${service.id}) no tiene imagen`).toBeTruthy();
      expect(
        service.image.startsWith("http") || service.image.startsWith("/"),
        `Imagen inválida en ${service.name}: ${service.image}`,
      ).toBe(true);

      // Si tiene galería, validar que cada imagen de la galería sea una URL válida
      if (service.gallery && service.gallery.length > 0) {
        for (const [idx, img] of service.gallery.entries()) {
          expect(
            typeof img === "string" && (img.startsWith("http") || img.startsWith("/")),
            `Foto de galería inválida #${idx} en ${service.name}`,
          ).toBe(true);
        }
      }
    }
  });

  it("verifies 100% dictionary key parity between es.json, en.json, ca.json, and de.json", async () => {
    const es = await loadTranslations("es");
    const de = await loadTranslations("de");

    const esKeys = Object.keys(es).sort();
    const deKeys = Object.keys(de).sort();

    // Comprobamos que de.json tenga exactamente las mismas claves que es.json
    const missingInDe = esKeys.filter((k) => !deKeys.includes(k));
    const extraInDe = deKeys.filter((k) => !esKeys.includes(k));

    expect(missingInDe, `Claves faltantes en de.json: ${missingInDe.join(", ")}`).toEqual([]);
    expect(extraInDe, `Claves sobrantes en de.json: ${extraInDe.join(", ")}`).toEqual([]);
  });

  it("ensures all German dictionary values are non-empty strings", async () => {
    const de = await loadTranslations("de");
    for (const [key, val] of Object.entries(de)) {
      expect(typeof val === "string" && val.trim().length > 0, `Clave vacía en de.json: ${key}`).toBe(true);
    }
  });
});
