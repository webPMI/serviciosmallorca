import { describe, it, expect } from "vitest";
import {
  auditBusinessData,
  isCoordinateWithinMallorca,
  validateImageQuality,
  normalizePhoneNumber,
} from "../../src/lib/verificationEngine";
import { detectBusinessCategory } from "../../src/lib/scrapers/orchestrator";

describe("Curation & Data Integrity Stress Tests (Toxic Data & Edge Cases)", () => {
  it("rejects coordinates outside the island of Mallorca (Ocean, Madrid, etc.)", () => {
    // Madrid
    expect(isCoordinateWithinMallorca(40.4168, -3.7038)).toBe(false);
    // Barcelona
    expect(isCoordinateWithinMallorca(41.3879, 2.1699)).toBe(false);
    // Océano Atlántico
    expect(isCoordinateWithinMallorca(0, 0)).toBe(false);
    // Valores nulos o indefinidos
    expect(isCoordinateWithinMallorca(undefined, undefined)).toBe(false);
    // Mallorca Válido (Palma, Inca, Alcúdia)
    expect(isCoordinateWithinMallorca(39.5696, 2.6502)).toBe(true);
    expect(isCoordinateWithinMallorca(39.7214, 2.9114)).toBe(true);
  });

  it("handles malformed, toxic and empty input in auditBusinessData without crashing", () => {
    const toxicInput = {
      name: "<script>alert('xss')</script> Negocio Tóxico",
      category: "categoria_inexistente_999",
      zone: "zona_desconocida",
      address: "Sin dirección válida en alta mar",
      coordinates: { lat: -999, lng: 999 },
      website: "http://dominio-invalido-y-roto-12345.xyz",
      phone: "telefono_invalido_letras",
      whatsapp: undefined,
      socialLinks: {},
      webHttpStatus: 500,
      webAccessibility: "server_error" as const,
    };

    const report = auditBusinessData(toxicInput);
    expect(report).toBeDefined();
    expect(report.confidenceScore).toBeLessThan(50);
    expect(report.status).toBe("needs_manual_review");
    expect(report.warnings.length).toBeGreaterThan(0);
    expect(report.crossReference.addressInMallorca).toBe(false);
  });

  it("rejects stock image URLs and placeholder assets (GR-11 Zero Fake)", () => {
    expect(validateImageQuality("https://images.unsplash.com/photo-12345").isValid).toBe(false);
    expect(validateImageQuality("https://www.freepik.com/vectors/banner.jpg").isValid).toBe(false);
    expect(validateImageQuality("https://static.pexels.com/photos/123.jpg").isValid).toBe(false);
    expect(validateImageQuality("https://ejemplo.com/assets/img/spinner.gif").isValid).toBe(false);

    // Imagen legítima de dominio propio
    expect(validateImageQuality("https://elcaminopalma.com/img/plato-principal.jpg").isValid).toBe(true);
  });

  it("robustly normalizes diverse Spanish and Balearic phone formats", () => {
    expect(normalizePhoneNumber("+34 971 12 34 56")).toBe("971123456");
    expect(normalizePhoneNumber("0034 612 345 678")).toBe("612345678");
    expect(normalizePhoneNumber("34971234567")).toBe("971234567");
    expect(normalizePhoneNumber("971-12-34-56")).toBe("971123456");
    expect(normalizePhoneNumber("")).toBe("");
  });

  it("detects business categories accurately even with messy raw HTML", () => {
    const rawPadelHtml = `
      <html>
        <head><title>Club de Pádel & Tenis Palma</title></head>
        <body>
          <h1>Reserva tu pista de pádel en Mallorca</h1>
          <p>Instalaciones con iluminación LED y alquiler de palas.</p>
        </body>
      </html>
    `;
    const cat = detectBusinessCategory("Club Padel Palma", rawPadelHtml);
    expect(
      ["deportes-aire-libre", "gimnasios-fitness", "centros-deportivos"].some(
        (c) => cat.includes(c) || cat.includes("deport"),
      ),
    ).toBe(true);
  });
});
