/**
 * Tests unitarios para src/lib/serviceOverrides.ts
 *
 * Capa híbrida estático-dinámica con caché en memoria (TTL 5 min):
 *   - getServiceOverride: guard clauses, caché hit/miss/expiry, swallow de errores
 *   - mergeServiceWithOverride: merge parcial sin mutar el registro estático
 *   - saveServiceOverride: escritura Firestore (merge:true) + invalidación de caché
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const fb = vi.hoisted(() => ({
  doc: vi.fn((_db: unknown, name: string, id: string) => ({ kind: "doc", name, id })),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  serverTimestamp: vi.fn(() => ({ serverTimestamp: true })),
}));

vi.mock("firebase/firestore", () => ({
  doc: fb.doc,
  getDoc: fb.getDoc,
  setDoc: fb.setDoc,
  serverTimestamp: fb.serverTimestamp,
}));

import {
  getServiceOverride,
  mergeServiceWithOverride,
  saveServiceOverride,
  setAllowDatabaseOverrides,
  isDatabaseOverridesEnabled,
} from "../../src/lib/serviceOverrides";
import type { ServiceItem } from "../../src/data/services";
import type { ServiceOverride } from "../../src/lib/serviceOverrides";

const staticService = {
  slug: "negocio-base-palma",
  name: "Negocio Base",
  phone: "+34971111000",
  whatsapp: "",
  email: "",
  website: "",
  schedule: "L-V 09:00-17:00",
  status: "open",
  image: "/images/base.jpg",
  gallery: ["/images/g1.jpg"],
  fullDescription: { es: "desc-es", en: "desc-en", ca: "desc-ca", de: "desc-de" },
} as unknown as ServiceItem;

beforeEach(() => {
  fb.getDoc.mockReset();
  fb.setDoc.mockReset();
});

describe("getServiceOverride · Caché TTL 5 minutos", () => {
  afterEach(() => vi.useRealTimers());

  it("sin base de datos devuelve null inmediatamente (SSR-friendly)", async () => {
    const result = await getServiceOverride(undefined, "cualquier-slug");
    expect(result).toBeNull();
    expect(fb.getDoc).not.toHaveBeenCalled();
  });

  it("fetch miss → cachea null (evita relecturas innecesarias de Firestore)", async () => {
    vi.useFakeTimers({ now: new Date("2026-01-01T00:00:00Z"), toFake: ["Date"] });

    fb.getDoc.mockResolvedValueOnce({ exists: false, data: () => undefined });

    const first = await getServiceOverride({ kind: "db" } as never, "slug-miss");
    const second = await getServiceOverride({ kind: "db" } as never, "slug-miss");

    expect(first).toBeNull();
    expect(second).toBeNull();
    expect(fb.getDoc).toHaveBeenCalledTimes(1); // segunda llamada desde caché
  });

  it("fetch hit → devuelve datos y sirve desde caché en lecturas repetidas", async () => {
    vi.useFakeTimers({ now: new Date("2026-01-01T00:00:00Z"), toFake: ["Date"] });

    const stored: ServiceOverride = { ownerUid: "u1", phone: "+34600000001" };
    fb.getDoc.mockResolvedValueOnce({ exists: true, data: () => stored });

    const result = await getServiceOverride({ kind: "db" } as never, "slug-hit");
    const cached = await getServiceOverride({ kind: "db" } as never, "slug-hit");

    expect(result).toMatchObject({ ownerUid: "u1", phone: "+34600000001" });
    expect(cached).toEqual(result);
    expect(fb.getDoc).toHaveBeenCalledTimes(1);
  });

  it("expira tras el TTL (>5 min) y refresca desde Firestore", async () => {
    const BASE = Date.parse("2026-02-01T10:00:00Z");
    vi.useFakeTimers({ now: BASE, toFake: ["Date"] });

    fb.getDoc.mockResolvedValue({ exists: true, data: () => ({ ownerUid: "u2", email: "fresh@x.com" }) });

    await getServiceOverride({ kind: "db" } as never, "slug-ttl");
    expect(fb.getDoc).toHaveBeenCalledTimes(1);

    // +4 min → sigue fresco
    vi.setSystemTime(BASE + 4 * 60_000);
    await getServiceOverride({ kind: "db" } as never, "slug-ttl");
    expect(fb.getDoc).toHaveBeenCalledTimes(1);

    // +2 min más (total > 5 min) → refetch
    vi.setSystemTime(BASE + 6 * 60_000);
    await getServiceOverride({ kind: "db" } as never, "slug-ttl");
    expect(fb.getDoc).toHaveBeenCalledTimes(2);
  });

  it("error de Firestore → null silencioso (fallback al catálogo estático)", async () => {
    fb.getDoc.mockRejectedValue(new Error("unavailable"));
    expect(await getServiceOverride({ kind: "db" } as never, "slug-error")).toBeNull();
  });
});

describe("mergeServiceWithOverride · Merge parcial overlay", () => {
  it("override null devuelve el servicio estático intacto (misma referencia)", () => {
    expect(mergeServiceWithOverride(staticService, null)).toBe(staticService);
  });

  it("los campos vacíos del overlay NO pisan datos verificados estáticos", () => {
    const merged = mergeServiceWithOverride(staticService, {
      ownerUid: "u1",
      phone: "",
      whatsapp: "",
      website: "",
      schedule: "",
      image: "",
      gallery: [],
    });
    expect(merged.phone).toBe("+34971111000");
    expect(merged.schedule).toBe("L-V 09:00-17:00");
    expect(merged.image).toBe("/images/base.jpg");
    expect(merged.gallery).toEqual(["/images/g1.jpg"]);
  });

  it("campos completos sustituyen y los arrays multi-idioma hacen fallback seguro", () => {
    const merged = mergeServiceWithOverride(staticService, {
      ownerUid: "u1",
      phone: "+34622333444",
      fullDescription: { es: "nuevo-es" },
      highlights: { es: ["Highlight nuevo"] },
    });
    expect(merged.phone).toBe("+34622333444");
    expect(merged.fullDescription.es).toBe("nuevo-es");
    expect(merged.fullDescription.de).toBe("desc-de"); // caída al estático
    expect(merged.highlights?.es).toEqual(["Highlight nuevo"]);
    expect(merged.highlights?.en).toEqual([]); // fallback a default []
    expect(merged.servicesProvided?.es).toEqual([]);
  });

  it("el merge no muta el objeto estático original", () => {
    const before = JSON.stringify(staticService);
    mergeServiceWithOverride(staticService, {
      ownerUid: "u1",
      phone: "+34000000000",
      fullDescription: { es: "overwritten" },
    });
    expect(JSON.stringify(staticService)).toBe(before);
  });

  it("respeta la variable ALLOW_DATABASE_OVERRIDES cuando está desactivada", () => {
    setAllowDatabaseOverrides(false);
    expect(isDatabaseOverridesEnabled()).toBe(false);

    const merged = mergeServiceWithOverride(staticService, {
      ownerUid: "u1",
      phone: "+34699999999",
    });
    expect(merged.phone).toBe("+34971111000"); // conserva el estático porque está deshabilitado

    // Restaurar a activo
    setAllowDatabaseOverrides(true);
    expect(isDatabaseOverridesEnabled()).toBe(true);

    const mergedActive = mergeServiceWithOverride(staticService, {
      ownerUid: "u1",
      phone: "+34699999999",
    });
    expect(mergedActive.phone).toBe("+34699999999");
  });

  it("archiva datos obsoletos en evolutionHistory y purga datos erróneos (Zero Fake Data)", () => {
    const override = {
      ownerUid: "u1",
      phone: "+34971999888",
      evolutionHistory: [
        {
          date: "2026-08",
          type: "address_change" as const,
          action: "preserve_history" as const,
          title: {
            es: "Traslado de taller",
            en: "Workshop relocation",
            ca: "Trasllat de taller",
            de: "Werkstattumzug",
          },
          description: {
            es: "Ampliación a nuevo local en Palma",
            en: "Expansion to new Palma shop",
            ca: "Ampliació a nou local",
            de: "Erweiterung",
          },
          previousValue: "Carrer Antic 12",
          newValue: "Avinguda Nova 45",
          isObsoleteHistorical: true,
        },
        {
          date: "2026-08",
          type: "correction_purged" as const,
          action: "purge_erroneous" as const,
          title: {
            es: "Dato falso eliminado",
            en: "Purged fake entry",
            ca: "Dada falsa purgada",
            de: "Gelöschter Fehleintrag",
          },
          description: {
            es: "Teléfono incorrecto eliminado",
            en: "Purged phone",
            ca: "Telèfon purgat",
            de: "Gelöscht",
          },
        },
      ],
    };

    const merged = mergeServiceWithOverride(staticService, override);
    expect(merged.phone).toBe("+34971999888");
    expect(merged.evolutionHistory).toHaveLength(1);
    expect(merged.evolutionHistory?.[0].type).toBe("address_change");
    expect(merged.evolutionHistory?.[0].isObsoleteHistorical).toBe(true);
    // Verifica que el registro erróneo no fue archivado
    expect(merged.evolutionHistory?.some((e) => e.action === "purge_erroneous")).toBe(false);
  });
});

describe("saveServiceOverride · Escritura + actualización de caché", () => {
  it("guarda con merge:true, ownerUid y serverTimestamp, y refresca la caché local", async () => {
    const dbLike = { kind: "db" };
    await saveServiceOverride(dbLike as never, "negocio-base-palma", "manager-77", {
      phone: "+34900000000",
      schedule: "L-D 10:00-20:00",
    });

    const [ref, payload, opts] = fb.setDoc.mock.calls[0];
    expect(ref).toMatchObject({ kind: "doc", name: "service_overrides", id: "negocio-base-palma" });
    expect(payload.ownerUid).toBe("manager-77");
    expect(payload.phone).toBe("+34900000000");
    expect(payload.updatedAt).toEqual({ serverTimestamp: true });
    expect(opts).toEqual({ merge: true });

    // La lectura posterior NO vuelve a golpear Firestore (caché ya refrescada)
    const cached = await getServiceOverride(dbLike as never, "negocio-base-palma");
    expect(fb.getDoc).not.toHaveBeenCalled();
    expect(cached).toMatchObject({ phone: "+34900000000" });
  });
});
