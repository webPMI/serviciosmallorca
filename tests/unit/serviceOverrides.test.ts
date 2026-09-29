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
  collection: vi.fn((_db: unknown, name: string) => ({ kind: "collection", name })),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  setDoc: vi.fn(),
  serverTimestamp: vi.fn(() => ({ serverTimestamp: true })),
}));

vi.mock("firebase/firestore", () => ({
  doc: fb.doc,
  collection: fb.collection,
  getDoc: fb.getDoc,
  getDocs: fb.getDocs,
  setDoc: fb.setDoc,
  serverTimestamp: fb.serverTimestamp,
}));

/** Telemetría mockeada: se afirma que ningún fallo queda silencioso (GR-15). */
const telemetry = vi.hoisted(() => ({ reportClientFailure: vi.fn() }));

vi.mock("../../src/lib/clientTelemetry", () => ({
  reportClientFailure: telemetry.reportClientFailure,
  resetTelemetryDedupeWindow: vi.fn(),
  TELEMETRY_DEDUPE_WINDOW_MS: 300000,
}));

import {
  getServiceOverride,
  getServiceOverrideFresh,
  mergeServiceWithOverride,
  saveServiceOverride,
  verifyBusinessAsAdmin,
  buildClaimedOverridePayload,
  stripVerificationFields,
  resolveOwnerUid,
  VERIFICATION_FIELDS,
  OverrideGuardError,
  getAllServiceOverrides,
  resolveServiceWithOverrides,
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
  fb.getDoc.mockResolvedValue({ exists: () => false, data: () => undefined });
  fb.setDoc.mockReset();
  telemetry.reportClientFailure.mockReset();
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
    expect(merged.fullDescription?.es).toBe("nuevo-es");
    expect(merged.fullDescription?.de).toBe("desc-de"); // caída al estático
    expect(merged.highlights?.es).toEqual(["Highlight nuevo"]);
    expect(merged.highlights?.en).toEqual([]); // fallback a default []
    expect(merged.servicesProvided?.es).toEqual([]);
  });

  it("soporta merge cuando el servicio estático no tiene fullDescription definida", () => {
    const serviceWithoutDesc = {
      ...staticService,
      fullDescription: undefined,
    } as unknown as ServiceItem;

    const merged = mergeServiceWithOverride(serviceWithoutDesc, {
      ownerUid: "u1",
      fullDescription: { es: "desc-from-override", en: "desc-en" },
    });

    expect(merged.fullDescription?.es).toBe("desc-from-override");
    expect(merged.fullDescription?.en).toBe("desc-en");
    expect(merged.fullDescription?.ca).toBe("");
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

describe("saveServiceOverride · Escritura blindada + auditoría", () => {
  it("guarda con merge:true, titularidad del manager y serverTimestamp, y refresca la caché local", async () => {
    const dbLike = { kind: "db" };
    await saveServiceOverride(
      dbLike as never,
      "negocio-base-palma",
      { uid: "manager-77", role: "manager" },
      {
        phone: "+34900000000",
        schedule: "L-D 10:00-20:00",
      },
    );

    const [ref, payload, opts] = fb.setDoc.mock.calls[0];
    expect(ref).toMatchObject({ kind: "doc", name: "service_overrides", id: "negocio-base-palma" });
    expect(payload.ownerUid).toBe("manager-77");
    expect(payload.phone).toBe("+34900000000");
    expect(payload.updatedAt).toEqual({ serverTimestamp: true });
    expect(opts).toEqual({ merge: true });

    // La lectura posterior NO vuelve a golpear Firestore (caché ya refrescada)
    fb.getDoc.mockClear();
    const cached = await getServiceOverride(dbLike as never, "negocio-base-palma");
    expect(fb.getDoc).not.toHaveBeenCalled();
    expect(cached).toMatchObject({ phone: "+34900000000" });
  });

  it("un manager NO puede escribir campos de verificación: se filtran antes de persistir (INV-01)", async () => {
    await saveServiceOverride({ kind: "db" } as never, "slug-shield-manager", { uid: "manager-1", role: "manager" }, {
      phone: "+34971111222",
      verified: true,
      verificationStatus: "verified_official",
      confidenceScore: 98,
      isClaimed: true,
      claimedByUid: "manager-1",
    } as never);

    const [, payload] = fb.setDoc.mock.calls[0];
    expect(payload.phone).toBe("+34971111222");
    for (const field of VERIFICATION_FIELDS) {
      expect(payload).not.toHaveProperty(field);
    }
  });

  it("NUNCA sobrescribe el ownerUid existente: el admin no se apropia la ficha (INV-02 · P0-4)", async () => {
    fb.getDoc.mockResolvedValueOnce({
      exists: true,
      data: () => ({ ownerUid: "titular-real", phone: "+34970000000" }),
    });

    await saveServiceOverride({ kind: "db" } as never, "slug-owner-keep", { uid: "admin-1", role: "admin" }, {
      verified: true,
      verificationStatus: "verified_official",
      verificationMethod: "manual_notarial",
      documentUrl: "https://example.com/iae.pdf",
      confidenceScore: 95,
      verifiedByUid: "admin-1",
      verifiedByRole: "admin",
    } as never);

    const [, payload] = fb.setDoc.mock.calls[0];
    expect(payload).not.toHaveProperty("ownerUid");
    expect(payload.verified).toBe(true);
  });

  it("registra auditoría con autor, campos y valores anterior/nuevo (INV-08)", async () => {
    fb.getDoc.mockResolvedValueOnce({
      exists: true,
      data: () => ({ ownerUid: "manager-1", phone: "+34970000000", auditTrail: [] }),
    });

    await saveServiceOverride(
      { kind: "db" } as never,
      "slug-audit",
      { uid: "manager-1", role: "manager" },
      { phone: "+34971119999" },
      { reason: "Nuevo teléfono verificado" },
    );

    const [, payload] = fb.setDoc.mock.calls[0];
    expect(payload.auditTrail).toHaveLength(1);
    expect(payload.auditTrail[0]).toMatchObject({
      action: "updated",
      fieldChanged: "phone",
      oldValue: { phone: "+34970000000" },
      newValue: { phone: "+34971119999" },
      authorRole: "manager",
      authorUid: "manager-1",
      reason: "Nuevo teléfono verificado",
    });
  });

  it("el histórico de auditoría NUNCA se acepta desde el cliente: se reconstruye (INV-08)", async () => {
    await saveServiceOverride({ kind: "db" } as never, "slug-audit-forgery", { uid: "manager-1", role: "manager" }, {
      phone: "+34971110000",
      auditTrail: [
        { id: "fake", timestamp: "2020-01-01", action: "verified", authorRole: "admin", authorUid: "ghost" },
      ],
    } as never);

    const [, payload] = fb.setDoc.mock.calls[0];
    expect(payload.auditTrail).toHaveLength(1);
    expect(payload.auditTrail[0]).toMatchObject({ action: "created", authorRole: "manager", authorUid: "manager-1" });
    expect(JSON.stringify(payload.auditTrail)).not.toContain("ghost");
  });

  it("rechaza actores sin rol válido con error tipado (nunca escritura anónima)", async () => {
    await expect(
      saveServiceOverride({ kind: "db" } as never, "slug-x", { uid: "", role: "manager" }, { phone: "+34971000000" }),
    ).rejects.toBeInstanceOf(OverrideGuardError);
    expect(fb.setDoc).not.toHaveBeenCalled();
  });

  it("bloquea la transferencia de titularidad sobre una ficha ya gestionada", async () => {
    fb.getDoc.mockResolvedValueOnce({ exists: true, data: () => ({ ownerUid: "titular-real" }) });

    await expect(
      saveServiceOverride(
        { kind: "db" } as never,
        "slug-y",
        { uid: "admin-1", role: "admin" },
        { phone: "+34971000000" },
        { transferOwnershipTo: "otro-uid" },
      ),
    ).rejects.toMatchObject({ code: "ownership_conflict" });
    expect(fb.setDoc).not.toHaveBeenCalled();
  });
});

describe("mergeServiceWithOverride · Fusión estático + dinámico", () => {
  it("mergeServiceWithOverride fusiona campos de verificación y titularidad reclamada", () => {
    const override: ServiceOverride = {
      ownerUid: "titular-123",
      verified: true,
      verificationStatus: "verified_official",
      confidenceScore: 98,
      trustLevel: "level_3_official",
      isClaimed: true,
      claimedByUid: "titular-123",
      claimedAt: "2026-09-27T10:00:00Z",
    };

    const merged = mergeServiceWithOverride(staticService, override);
    expect(merged.verified).toBe(true);
    expect(merged.confidenceScore).toBe(98);
    expect(merged.verificationStatus).toBe("verified_official");
    expect(merged.trustLevel).toBe("level_3_official");
    expect(merged.isClaimed).toBe(true);
    expect(merged.claimedByUid).toBe("titular-123");
    expect(merged.claimedAt).toBe("2026-09-27T10:00:00Z");
  });

  it("getAllServiceOverrides carga todos los overrides y los pre-puebla en caché", async () => {
    const dbLike = { kind: "db" };
    const mockSnap = [
      { id: "slug-1", data: () => ({ ownerUid: "u1", verified: true, confidenceScore: 95 }) },
      { id: "slug-2", data: () => ({ ownerUid: "u2", phone: "+34971222333" }) },
    ];
    fb.getDocs.mockResolvedValueOnce(mockSnap);

    const all = await getAllServiceOverrides(dbLike as never);
    expect(Object.keys(all)).toEqual(["slug-1", "slug-2"]);
    expect(all["slug-1"].verified).toBe(true);

    // Lectura posterior se atiende directamente desde caché sin consultar getDoc
    fb.getDoc.mockReset();
    const cached = await getServiceOverride(dbLike as never, "slug-1");
    expect(fb.getDoc).not.toHaveBeenCalled();
    expect(cached?.verified).toBe(true);
  });
});

describe("verifyBusinessAsAdmin · Sello oficial con evidencia y sin apropiación (INV-01/INV-02)", () => {
  it("sella con método + documento https y NO se apropia de la titularidad", async () => {
    const dbLike = { kind: "db" };
    const res = await verifyBusinessAsAdmin(dbLike as never, "bodega-mallorca", "admin-1", {
      verificationMethod: "official_document",
      documentUrl: "https://example.com/iae036-bodega.pdf",
    });

    expect(res.verified).toBe(true);
    expect(res.confidenceScore).toBe(95);
    expect(res.verificationStatus).toBe("verified_official");
    expect(res.trustLevel).toBe("level_3_official");
    expect(res.ownerUid).toBeUndefined();

    const [ref, payload] = fb.setDoc.mock.calls.at(-1)!;
    expect(ref.id).toBe("bodega-mallorca");
    expect(payload).toMatchObject({
      verified: true,
      verificationMethod: "official_document",
      documentUrl: "https://example.com/iae036-bodega.pdf",
      verifiedByUid: "admin-1",
      verifiedByRole: "admin",
    });
    expect(payload).not.toHaveProperty("ownerUid");
  });

  it("exige método y documento https: sin evidencia real no hay sello (P0-2 · GR-11)", async () => {
    await expect(
      verifyBusinessAsAdmin({ kind: "db" } as never, "bodega-sin-prueba", "admin-1", {}),
    ).rejects.toMatchObject({
      code: "missing_evidence",
    });

    await expect(
      verifyBusinessAsAdmin({ kind: "db" } as never, "bodega-sin-prueba", "admin-1", {
        verificationMethod: "manual_notarial",
        documentUrl: "http://insecure.local/x.pdf",
      }),
    ).rejects.toMatchObject({ code: "missing_evidence" });

    expect(fb.setDoc).not.toHaveBeenCalled();
  });

  it("revocar la verificación no exige documento y baja la confianza", async () => {
    const res = await verifyBusinessAsAdmin({ kind: "db" } as never, "bodega-revocada", "admin-1", {
      verified: false,
      verificationStatus: "unverified",
    });

    expect(res.verified).toBe(false);
    expect(res.trustLevel).toBe("level_1_discovery");
    expect(res.confidenceScore).toBe(70);
  });
});

describe("Bloque vinculante · utilidades puras", () => {
  it("stripVerificationFields elimina todo campo de verificación sin tocar los de negocio", () => {
    const stripped = stripVerificationFields({
      phone: "+34971000000",
      schedule: "L-V",
      verified: true,
      claimedByUid: "x",
      confidenceScore: 99,
    });

    expect(stripped).toEqual({ phone: "+34971000000", schedule: "L-V" });
  });

  it("resolveOwnerUid: el manager nuevo se apropia, el admin nunca, y el dueño existente es intocable", () => {
    expect(resolveOwnerUid(null, { uid: "manager-1", role: "manager" })).toBe("manager-1");
    expect(resolveOwnerUid(null, { uid: "admin-1", role: "admin" })).toBeUndefined();
    expect(resolveOwnerUid({ ownerUid: "titular-real" }, { uid: "admin-1", role: "admin" })).toBeUndefined();
    expect(
      resolveOwnerUid(
        { ownerUid: "titular-real" },
        { uid: "admin-1", role: "admin" },
        { transferOwnershipTo: "nuevo" },
      ),
    ).toBe("nuevo");
  });

  it("buildClaimedOverridePayload firma la titularidad con la evidencia aportada (INV-01/INV-08)", () => {
    const payload = buildClaimedOverridePayload({
      applicantUid: "user-42",
      reviewerUid: "admin-1",
      serviceId: "svc-bar-1",
      businessTaxId: "https://drive.example.com/iae036.pdf",
      existingAuditTrail: [],
    });

    expect(payload).toMatchObject({
      ownerUid: "user-42",
      claimedByUid: "user-42",
      isClaimed: true,
      verifiedByUid: "admin-1",
      verifiedByRole: "admin",
      verificationMethod: "manual_notarial",
      documentUrl: "https://drive.example.com/iae036.pdf",
    });
    expect(payload.auditTrail?.[0]).toMatchObject({ action: "claimed", authorRole: "admin", authorUid: "admin-1" });
  });

  it("getServiceOverrideFresh ignora la caché y reporta el fallo de lectura (INV-02 · GR-15)", async () => {
    const dbLike = { kind: "db" };
    fb.getDoc.mockResolvedValueOnce({ exists: true, data: () => ({ ownerUid: "titular-real" }) });

    const fresh = await getServiceOverrideFresh(dbLike as never, "slug-fresco");
    expect(fresh?.ownerUid).toBe("titular-real");

    fb.getDoc.mockRejectedValueOnce(new Error("permission-denied"));
    expect(await getServiceOverrideFresh(dbLike as never, "slug-error")).toBeNull();
    expect(telemetry.reportClientFailure).toHaveBeenCalled();
  });

  it("getServiceOverrideFresh no consulta Firestore sin base de datos (SSR-safe)", async () => {
    expect(await getServiceOverrideFresh(undefined, "cualquiera")).toBeNull();
    expect(fb.getDoc).not.toHaveBeenCalled();
  });
});

describe("resolveServiceWithOverrides · SSR Resilient Dynamic Overlay", () => {
  it("devuelve el servicio estático si db es undefined (SSR-safe)", async () => {
    const result = await resolveServiceWithOverrides(undefined, "test-slug", staticService);
    expect(result).toBe(staticService);
  });

  it("devuelve el servicio estático si el slug está vacío", async () => {
    const result = await resolveServiceWithOverrides({ kind: "db" } as never, "", staticService);
    expect(result).toBe(staticService);
  });

  it("fusiona datos dinámicos cuando existe override en Firestore", async () => {
    const dbLike = { kind: "db" };
    fb.getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        phone: "+34971999888",
        email: "nuevo@example.com",
        status: "seasonal_closure",
        highlights: { es: ["Nuevo destacado SSR"] },
      }),
    });

    const result = await resolveServiceWithOverrides(dbLike as never, "test-slug", staticService);
    expect(result.phone).toBe("+34971999888");
    expect(result.email).toBe("nuevo@example.com");
    expect(result.status).toBe("seasonal_closure");
    expect(result.highlights?.es).toEqual(["Nuevo destacado SSR"]);
    // Campos no modificados se preservan del estático
    expect(result.schedule).toBe(staticService.schedule);
  });

  it("retorna el servicio estático si la consulta a Firestore falla (cero crash en SSR)", async () => {
    const dbLike = { kind: "db" };
    fb.getDoc.mockRejectedValueOnce(new Error("Firestore network timeout"));

    const result = await resolveServiceWithOverrides(dbLike as never, "slug-error-network", staticService);
    expect(result).toBe(staticService);
  });

  it("retorna el servicio estático si la base de datos está deshabilitada", async () => {
    setAllowDatabaseOverrides(false);
    try {
      const dbLike = { kind: "db" };
      const result = await resolveServiceWithOverrides(dbLike as never, "test-slug", staticService);
      expect(result).toBe(staticService);
      expect(fb.getDoc).not.toHaveBeenCalled();
    } finally {
      setAllowDatabaseOverrides(true);
    }
  });
});
