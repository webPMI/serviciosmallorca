import { describe, it, expect, vi, beforeEach } from "vitest";
import { SERVICES } from "../../src/data/services";
import { resolveServiceWithOverrides, type ServiceOverride } from "../../src/lib/serviceOverrides";
import { generateServiceJsonLd } from "../../src/lib/jsonLdGenerator";

const fb = vi.hoisted(() => ({
  doc: vi.fn((_db: unknown, name: string, id: string) => ({ kind: "doc", name, id })),
  getDoc: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  doc: fb.doc,
  getDoc: fb.getDoc,
}));

describe("Integration: SSR Service Dynamic Merge & JSON-LD Synchronization", () => {
  const sampleService = SERVICES[0];

  beforeEach(() => {
    fb.getDoc.mockReset();
  });

  it("consumes dynamic overrides over real catalog service and updates Schema.org JSON-LD", async () => {
    const mockOverride: ServiceOverride = {
      phone: "+34971000999",
      email: "actualizado@empresa.es",
      website: "https://empresa-actualizada.es",
      schedule: "Lunes a Domingo 08:00 - 22:00",
      status: "seasonal_closure",
      highlights: {
        es: ["Terraza climatizada 360°"],
        en: ["Heated 360° terrace"],
        ca: ["Terrassa climatitzada 360°"],
        de: ["Klimatisierte 360°-Terrasse"],
      },
      servicesProvided: {
        es: ["Servicio VIP", "Parking privado"],
        en: ["VIP Service", "Private Parking"],
        ca: ["Servei VIP", "Aparcament privat"],
        de: ["VIP-Service", "Privatparkplatz"],
      },
    };

    fb.getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => mockOverride,
    });

    const dbLike = { kind: "db" };
    const merged = await resolveServiceWithOverrides(dbLike as never, `int-test-${sampleService.slug}`, sampleService);

    // 1. Verify that merged service has overridden fields
    expect(merged.phone).toBe("+34971000999");
    expect(merged.email).toBe("actualizado@empresa.es");
    expect(merged.website).toBe("https://empresa-actualizada.es");
    expect(merged.schedule).toBe("Lunes a Domingo 08:00 - 22:00");
    expect(merged.status).toBe("seasonal_closure");
    expect(merged.highlights?.es).toContain("Terraza climatizada 360°");
    expect(merged.servicesProvided?.de).toContain("VIP-Service");

    // 2. Non-overridden fields are preserved from static catalog
    expect(merged.name).toBe(sampleService.name);
    expect(merged.category).toBe(sampleService.category);
    expect(merged.zone).toBe(sampleService.zone);
    expect(merged.address).toBe(sampleService.address);

    // 3. Schema.org JSON-LD reflects the merged state (critical for SEO / Crawlers)
    const jsonLd = generateServiceJsonLd(merged, "es", "https://serviciosmallorca.com");
    expect(jsonLd.telephone).toBe("+34971000999");
    expect(jsonLd.email).toBe("actualizado@empresa.es");
    expect(jsonLd.sameAs).toContain("https://empresa-actualizada.es");
  });

  it("gracefully falls back to static service when Firestore throws or is unavailable", async () => {
    fb.getDoc.mockRejectedValueOnce(new Error("Firestore connection dropped"));

    const dbLike = { kind: "db" };
    const merged = await resolveServiceWithOverrides(dbLike as never, `fallback-${sampleService.slug}`, sampleService);

    // Must be identical to static catalog service
    expect(merged.phone).toBe(sampleService.phone);
    expect(merged.email).toBe(sampleService.email);
    expect(merged.status).toBe(sampleService.status);
    expect(merged.name).toBe(sampleService.name);
  });
});
