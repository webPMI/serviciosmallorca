/**
 * Tests unitarios para src/lib/serviceActions.ts
 *
 * Cubre el ciclo de vida completo de las 4 colecciones de moderación:
 *   - service_claims           (reclamación de negocio)
 *   - service_submissions      (alta de negocio nuevo)
 *   - service_deletion_requests (baja / RGPD derecho de supresión)
 *   - service_reports          (reportes de datos incorrectos)
 *
 * Estrategia: firebase/firestore se mockea por completo para probar contratos,
 * ordenamientos en memoria y ruta de error sin red.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

const fb = vi.hoisted(() => {
  const batch = { update: vi.fn(), set: vi.fn(), commit: vi.fn().mockResolvedValue(undefined) };
  return {
    setDoc: vi.fn(),
    updateDoc: vi.fn(),
    getDocs: vi.fn(),
    getDoc: vi.fn(),
    batch,
    writeBatch: vi.fn(() => batch),
    arrayUnion: vi.fn((...items: unknown[]) => ({ arrayUnion: items })),
  };
});

/** Capa de overrides: se conserva el generador real y se aísla solo la lectura fresca. */
const overrides = vi.hoisted(() => ({ getServiceOverrideFresh: vi.fn().mockResolvedValue(null) }));

/** Telemetría: mockeada para poder afirmar que ningún fallo queda silencioso (GR-15). */
const telemetry = vi.hoisted(() => ({ reportClientFailure: vi.fn() }));

vi.mock("firebase/firestore", () => ({
  collection: (_db: unknown, name: string) => ({ kind: "collection", name }),
  doc: (_db: unknown, name: string, id?: string) => ({ kind: "doc", name, id }),
  query: (...parts: unknown[]) => ({ kind: "query", parts }),
  where: (...args: unknown[]) => args,
  orderBy: (...args: unknown[]) => args,
  serverTimestamp: () => ({ serverTimestamp: true }),
  arrayUnion: fb.arrayUnion,
  writeBatch: fb.writeBatch,
  setDoc: fb.setDoc,
  updateDoc: fb.updateDoc,
  getDocs: fb.getDocs,
  getDoc: fb.getDoc,
}));

vi.mock("../../src/lib/clientTelemetry", () => ({
  reportClientFailure: telemetry.reportClientFailure,
  resetTelemetryDedupeWindow: vi.fn(),
  TELEMETRY_DEDUPE_WINDOW_MS: 300000,
}));

vi.mock("../../src/lib/serviceOverrides", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../src/lib/serviceOverrides")>();
  return { ...actual, getServiceOverrideFresh: overrides.getServiceOverrideFresh };
});

import {
  createServiceClaim,
  buildClaimId,
  getUserClaims,
  getAllClaims,
  updateClaimStatus,
  ServiceRequestError,
  createServiceSubmission,
  getUserSubmissions,
  getAllSubmissions,
  updateSubmissionStatus,
  createServiceDeletionRequest,
  getUserDeletionRequests,
  getAllDeletionRequests,
  updateDeletionRequestStatus,
  createServiceReport,
  getAllReports,
  updateReportStatus,
} from "../../src/lib/serviceActions";
import type { Firestore } from "firebase/firestore";

const fakeDb = {} as Firestore;

/** Snapshot no existente por defecto: cada test decide qué documentos existen. */
function missingDoc() {
  return { exists: () => false, data: () => undefined };
}

/** Snapshot existente con datos. */
function existingDoc(data: Record<string, unknown>) {
  return { exists: () => true, data: () => data };
}

function snapOf(rows: Array<{ id: string; data: Record<string, unknown> }>) {
  return { docs: rows.map((r) => ({ id: r.id, data: () => r.data })) };
}

const claimFixture = {
  id: "claim-1",
  serviceId: "svc-tattoo-1",
  serviceName: "Studio Ink Mallorca",
  applicantUid: "user-1",
  applicantName: "Ana Bonet",
  applicantEmail: "ana@example.com",
  applicantPhone: "+34600111222",
  verificationProof: "https://drive.example.com/proof.pdf",
};

import { resetRateLimitBuckets } from "../../src/lib/managerSecurityEngine";

beforeEach(() => {
  resetRateLimitBuckets();
  fb.setDoc.mockReset();
  fb.updateDoc.mockReset();
  fb.getDocs.mockReset();
  fb.getDoc.mockReset();
  fb.getDoc.mockResolvedValue(missingDoc());
  fb.batch.update.mockReset();
  fb.batch.set.mockReset();
  fb.batch.commit.mockReset();
  fb.batch.commit.mockResolvedValue(undefined);
  overrides.getServiceOverrideFresh.mockReset();
  overrides.getServiceOverrideFresh.mockResolvedValue(null);
  telemetry.reportClientFailure.mockReset();
});

describe("ServiceActions · Claims (reclamación de negocio)", () => {
  it("createServiceClaim persiste como 'pending' con serverTimestamp y devuelve el ID", async () => {
    const claimId = await createServiceClaim(fakeDb, claimFixture);

    expect(claimId).toBe("claim-1");
    expect(fb.setDoc).toHaveBeenCalledTimes(1);
    const [ref, payload] = fb.setDoc.mock.calls[0];
    expect(ref).toMatchObject({ kind: "doc", name: "service_claims", id: "claim-1" });
    expect(payload).toMatchObject({
      ...claimFixture,
      id: "claim-1",
      status: "pending",
      createdAt: { serverTimestamp: true },
    });
  });

  it("createServiceClaim deriva un ID determinista cuando el cliente no lo envía (INV-04)", async () => {
    const claimId = await createServiceClaim(fakeDb, { ...claimFixture, id: "" });

    expect(claimId).toBe(buildClaimId(claimFixture.serviceId, claimFixture.applicantUid));
    expect(claimId).toBe(`claim-${claimFixture.serviceId}-${claimFixture.applicantUid}`);
    expect(fb.setDoc.mock.calls[0][0].id).toBe(claimId);
  });

  it("createServiceClaim bloquea reclamaciones duplicadas sin volver a escribir (INV-04)", async () => {
    fb.getDoc.mockResolvedValue(existingDoc({ id: "claim-1", status: "pending" }));

    await expect(createServiceClaim(fakeDb, claimFixture)).rejects.toThrowError(ServiceRequestError);
    await expect(createServiceClaim(fakeDb, claimFixture)).rejects.toMatchObject({ code: "duplicate_claim" });
    expect(fb.setDoc).not.toHaveBeenCalled();
  });

  it("createServiceClaim rechaza fichas ya gestionadas por otro titular (INV-04 · P0-3)", async () => {
    overrides.getServiceOverrideFresh.mockResolvedValue({ ownerUid: "otro-uid", claimedByUid: "otro-uid" });

    await expect(createServiceClaim(fakeDb, claimFixture)).rejects.toMatchObject({ code: "already_claimed" });
    expect(fb.setDoc).not.toHaveBeenCalled();
  });

  it("createServiceClaim bloquea si se supera el rate limit (P2-6 / rate_limited)", async () => {
    for (let i = 0; i < 5; i++) {
      await createServiceClaim(fakeDb, { ...claimFixture, id: `claim-rl-${i}` });
    }
    await expect(createServiceClaim(fakeDb, { ...claimFixture, id: "claim-rl-over" })).rejects.toMatchObject({
      code: "rate_limited",
    });
  });

  it("getUserClaims ordena descendente priorizando toMillis sobre seconds", async () => {
    fb.getDocs.mockResolvedValue(
      snapOf([
        { id: "old", data: { applicantUid: "u1", createdAt: { seconds: 10 } } }, // 10s
        { id: "newest", data: { applicantUid: "u1", createdAt: { toMillis: () => 3000 } } },
        { id: "mid", data: { applicantUid: "u1", createdAt: { seconds: 50 } } },
        { id: "orphan", data: { applicantUid: "u1" } }, // sin createdAt → 0
      ]),
    );

    const claims = await getUserClaims(fakeDb, "u1");
    expect(claims.map((c) => c.id)).toEqual(["newest", "mid", "old", "orphan"]);
  });

  it("getUserClaims devuelve la copia local y reporta el fallo a telemetría (GR-15)", async () => {
    fb.getDocs.mockRejectedValue(new Error("offline"));
    const claims = await getUserClaims(fakeDb, "any");
    expect(claims).toEqual([]);
    expect(telemetry.reportClientFailure).toHaveBeenCalled();
  });

  it("getAllClaims mapea los documentos respetando el orden remoto", async () => {
    fb.getDocs.mockResolvedValue(
      snapOf([
        { id: "a", data: { applicantEmail: "a@x.com" } },
        { id: "b", data: { applicantEmail: "b@x.com" } },
      ]),
    );
    const rows = await getAllClaims(fakeDb);
    expect(rows.map((r) => r.id)).toEqual(["a", "b"]);
    expect(rows[0].applicantEmail).toBe("a@x.com");
  });

  it("getAllClaims devuelve [] ante fallo", async () => {
    fb.getDocs.mockRejectedValue(new Error("permission denied"));
    expect(await getAllClaims(fakeDb)).toEqual([]);
  });

  it("updateClaimStatus rechazado: solo toca la solicitud, con revisor y fecha (INV-03/INV-08)", async () => {
    await updateClaimStatus(fakeDb, "claim-9", "rejected", { reviewerUid: "admin-1" });

    expect(fb.updateDoc).toHaveBeenCalledTimes(1);
    expect(fb.updateDoc.mock.calls[0][0]).toMatchObject({
      kind: "doc",
      name: "service_claims",
      id: "claim-9",
    });
    expect(fb.updateDoc.mock.calls[0][1]).toMatchObject({
      status: "rejected",
      reviewedBy: "admin-1",
      updatedAt: { serverTimestamp: true },
    });
    expect(typeof fb.updateDoc.mock.calls[0][1].reviewedAt).toBe("string");
    expect(fb.batch.commit).not.toHaveBeenCalled();
  });

  it("updateClaimStatus nunca aprueba sin negocio asignado (INV-03 · P0-5)", async () => {
    await expect(updateClaimStatus(fakeDb, "claim-1", "approved", { applicantUid: "user-42" })).rejects.toMatchObject({
      code: "missing_business",
    });

    expect(fb.updateDoc).not.toHaveBeenCalled();
    expect(fb.batch.set).not.toHaveBeenCalled();
    expect(fb.batch.commit).not.toHaveBeenCalled();
  });

  it("updateClaimStatus aprueba en un batch atómico: rol + negocio + titularidad sellada (INV-02/INV-03/INV-05)", async () => {
    fb.getDoc.mockImplementation(async (ref: { name: string }) =>
      ref.name === "service_claims"
        ? existingDoc({
            id: "claim-1",
            applicantUid: "user-42",
            serviceId: "svc-bar-1",
            serviceSlug: "bar-sant-any",
            verificationProof: "https://drive.example.com/iae036.pdf",
            businessTaxId: "B07000000",
            verificationMethod: "official_document",
          })
        : existingDoc({ role: "user", managedServices: [] }),
    );

    await updateClaimStatus(fakeDb, "claim-1", "approved", {
      applicantUid: "user-42",
      serviceId: "svc-bar-1",
      reviewerUid: "admin-1",
      notes: "CIF contrastado con el IAE 036",
    });

    // 1) La solicitud queda resuelta
    const [claimRef, claimPayload] = fb.batch.update.mock.calls[0];
    expect(claimRef).toMatchObject({ kind: "doc", name: "service_claims", id: "claim-1" });
    expect(claimPayload).toMatchObject({
      status: "approved",
      reviewedBy: "admin-1",
      decisionNotes: "CIF contrastado con el IAE 036",
    });

    // 2) El rol manager viaja SIEMPRE con el negocio asignado
    const [userRef, userPayload, userOpts] = fb.batch.set.mock.calls[0];
    expect(userRef).toMatchObject({ kind: "doc", name: "users", id: "user-42" });
    expect(userPayload.role).toBe("manager");
    expect(userPayload.managedServices).toEqual({ arrayUnion: ["svc-bar-1"] });
    expect(userOpts).toEqual({ merge: true });

    // 3) Titularidad al solicitante y sello firmado por el admin con evidencia real
    const [overrideRef, overridePayload] = fb.batch.set.mock.calls[1];
    expect(overrideRef).toMatchObject({ kind: "doc", name: "service_overrides", id: "bar-sant-any" });
    expect(overridePayload).toMatchObject({
      ownerUid: "user-42",
      claimedByUid: "user-42",
      isClaimed: true,
      verified: true,
      verificationStatus: "verified_official",
      verificationMethod: "official_document",
      documentUrl: "https://drive.example.com/iae036.pdf",
      verifiedByUid: "admin-1",
      verifiedByRole: "admin",
    });
    expect(overridePayload).not.toHaveProperty("ownerUid", "admin-1");

    // 4) Un único commit atómico
    expect(fb.batch.commit).toHaveBeenCalledTimes(1);
  });

  it("updateClaimStatus conserva el rol admin del solicitante (nunca degrada privilegios)", async () => {
    fb.getDoc.mockImplementation(async (ref: { name: string }) =>
      ref.name === "service_claims"
        ? existingDoc({ id: "claim-1", applicantUid: "admin-9", serviceId: "svc-bar-1", serviceSlug: "bar-sant-any" })
        : existingDoc({ role: "admin" }),
    );

    await updateClaimStatus(fakeDb, "claim-1", "approved", {
      applicantUid: "admin-9",
      serviceId: "svc-bar-1",
      reviewerUid: "admin-1",
    });

    expect(fb.batch.set.mock.calls[0][1].role).toBe("admin");
  });

  it("updateClaimStatus bloquea reasignar una ficha de otro titular (INV-02)", async () => {
    fb.getDoc.mockImplementation(async (ref: { name: string }) =>
      ref.name === "service_claims"
        ? existingDoc({ id: "claim-1", applicantUid: "user-42", serviceId: "svc-bar-1", serviceSlug: "bar-sant-any" })
        : existingDoc({ role: "user" }),
    );
    overrides.getServiceOverrideFresh.mockResolvedValue({ ownerUid: "titular-real", claimedByUid: "titular-real" });

    await expect(
      updateClaimStatus(fakeDb, "claim-1", "approved", {
        applicantUid: "user-42",
        serviceId: "svc-bar-1",
        reviewerUid: "admin-1",
      }),
    ).rejects.toMatchObject({ code: "ownership_conflict" });
    expect(fb.batch.commit).not.toHaveBeenCalled();
  });

  it("updateClaimStatus propaga y reporta el fallo del batch: nunca éxito falso (GR-15)", async () => {
    fb.getDoc.mockImplementation(async (ref: { name: string }) =>
      ref.name === "service_claims"
        ? existingDoc({ id: "claim-1", applicantUid: "user-42", serviceId: "svc-bar-1", serviceSlug: "bar-sant-any" })
        : existingDoc({ role: "user" }),
    );
    fb.batch.commit.mockRejectedValueOnce(new Error("network error"));

    await expect(
      updateClaimStatus(fakeDb, "claim-1", "approved", {
        applicantUid: "user-42",
        serviceId: "svc-bar-1",
        reviewerUid: "admin-1",
      }),
    ).rejects.toThrow("network error");
    expect(telemetry.reportClientFailure).toHaveBeenCalled();
  });
});

describe("ServiceActions · Submissions (alta de negocio)", () => {
  const submissionFixture = {
    id: "sub-1",
    applicantUid: "user-2",
    applicantName: "Joan",
    applicantEmail: "joan@example.com",
    name: "Ca'n Pages Bar",
    category: "gastronomia-restaurantes",
    zone: "llevant",
    address: "Carrer Major 1, Manacor",
    phone: "+34971555666",
    website: "https://canpages.example.com",
    description: "Bar de pueblo auténtico.",
  };

  it("createServiceSubmission persiste como 'pending'", async () => {
    await createServiceSubmission(fakeDb, submissionFixture);
    const [ref, payload] = fb.setDoc.mock.calls[0];
    expect(ref).toMatchObject({ kind: "doc", name: "service_submissions", id: "sub-1" });
    expect(payload.status).toBe("pending");
  });

  it("createServiceSubmission bloquea si se supera el rate limit (P2-6 / rate_limited)", async () => {
    for (let i = 0; i < 5; i++) {
      await createServiceSubmission(fakeDb, { ...submissionFixture, id: `sub-rl-${i}` });
    }
    await expect(createServiceSubmission(fakeDb, { ...submissionFixture, id: "sub-rl-over" })).rejects.toMatchObject({
      code: "rate_limited",
    });
  });

  it("getUserSubmissions ordena desc por seconds y devuelve [] ante fallo", async () => {
    fb.getDocs.mockResolvedValueOnce(
      snapOf([
        { id: "old", data: { name: "A", createdAt: { seconds: 5 } } },
        { id: "new", data: { name: "B", createdAt: { seconds: 99 } } },
      ]),
    );
    let rows = await getUserSubmissions(fakeDb, "user-2");
    expect(rows.map((r) => r.id)).toEqual(["new", "old"]);

    fb.getDocs.mockRejectedValue(new Error("boom"));
    rows = await getUserSubmissions(fakeDb, "user-2");
    expect(rows).toEqual([]);
  });

  it("getAllSubmissions mapea y tolera fallos devolviendo []", async () => {
    fb.getDocs.mockResolvedValueOnce(snapOf([{ id: "s1", data: { status: "pending" } }]));
    expect((await getAllSubmissions(fakeDb)).map((s) => s.id)).toEqual(["s1"]);

    fb.getDocs.mockRejectedValue(new Error("x"));
    expect(await getAllSubmissions(fakeDb)).toEqual([]);
  });

  it("updateSubmissionStatus con 'rejected' actualiza el documento de solicitud", async () => {
    fb.getDoc.mockResolvedValueOnce(existingDoc({ ...submissionFixture, id: "sub-7" }));
    await updateSubmissionStatus(fakeDb, "sub-7", "rejected");
    expect(fb.updateDoc.mock.calls[0][0]).toMatchObject({
      kind: "doc",
      name: "service_submissions",
      id: "sub-7",
    });
    expect(fb.updateDoc.mock.calls[0][1].status).toBe("rejected");
  });

  it("updateSubmissionStatus con 'approved' ejecuta writeBatch atómico creando override y asignando rol manager", async () => {
    fb.getDoc.mockResolvedValueOnce(
      existingDoc({
        ...submissionFixture,
        id: "sub-8",
        applicantUid: "user-creator",
        name: "Restaurante Ses Salines",
        phone: "+34 971 65 00 00",
        website: "https://sessalines.com",
        description: "Pescados frescos del sur de Mallorca",
      }),
    );

    const result = await updateSubmissionStatus(fakeDb, "sub-8", "approved", "admin-1");
    expect(result).toEqual({ slug: "restaurante-ses-salines" });

    // Verifica batch updates y sets
    expect(fb.batch.update).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "doc", name: "service_submissions", id: "sub-8" }),
      expect.objectContaining({ status: "approved", approvedSlug: "restaurante-ses-salines" }),
    );
    expect(fb.batch.set).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "doc", name: "service_overrides", id: "restaurante-ses-salines" }),
      expect.objectContaining({
        ownerUid: "user-creator",
        isClaimed: true,
        claimedByUid: "user-creator",
        status: "open",
      }),
      { merge: true },
    );
    expect(fb.batch.set).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "doc", name: "users", id: "user-creator" }),
      expect.objectContaining({
        role: "manager",
        managedServices: expect.objectContaining({ arrayUnion: ["restaurante-ses-salines"] }),
      }),
      { merge: true },
    );
    expect(fb.batch.commit).toHaveBeenCalled();
  });
});

describe("ServiceActions · Deletion Requests (RGPD supresión)", () => {
  const deletionFixture = {
    id: "del-1",
    serviceId: "svc-del",
    serviceName: "Negocio a borrar",
    applicantUid: "user-3",
    applicantEmail: "owner@example.com",
    reason: "He cerrado el negocio",
  };

  it("createServiceDeletionRequest persiste como 'pending'", async () => {
    await createServiceDeletionRequest(fakeDb, deletionFixture);
    const [ref, payload] = fb.setDoc.mock.calls[0];
    expect(ref).toMatchObject({ kind: "doc", name: "service_deletion_requests", id: "del-1" });
    expect(payload.status).toBe("pending");
  });

  it("createServiceDeletionRequest bloquea si se supera el rate limit (P2-6 / rate_limited)", async () => {
    for (let i = 0; i < 3; i++) {
      await createServiceDeletionRequest(fakeDb, { ...deletionFixture, id: `del-rl-${i}` });
    }
    await expect(createServiceDeletionRequest(fakeDb, { ...deletionFixture, id: "del-rl-over" })).rejects.toMatchObject(
      { code: "rate_limited" },
    );
  });

  it("getUserDeletionRequests ordena y traga errores", async () => {
    fb.getDocs.mockResolvedValueOnce(
      snapOf([
        { id: "d1", data: { reason: "a", createdAt: { seconds: 20 } } },
        { id: "d2", data: { reason: "b", createdAt: { toMillis: () => 50000 } } },
        { id: "d3", data: { reason: "c" } },
      ]),
    );
    const sorted = await getUserDeletionRequests(fakeDb, "user-3");
    expect(sorted.map((r) => r.id)).toEqual(["d2", "d1", "d3"]);

    fb.getDocs.mockRejectedValue(new Error("denied"));
    expect(await getUserDeletionRequests(fakeDb, "user-3")).toEqual([]);
  });

  it("getAllDeletionRequests + updateDeletionRequestStatus operan sobre su colección y manejan fallos", async () => {
    fb.getDocs.mockResolvedValueOnce(
      snapOf([
        { id: "dx", data: {} },
        { id: "dy", data: {} },
      ]),
    );
    expect((await getAllDeletionRequests(fakeDb)).length).toBe(2);

    fb.getDocs.mockRejectedValueOnce(new Error("network failure"));
    expect(await getAllDeletionRequests(fakeDb)).toEqual([]);

    await updateDeletionRequestStatus(fakeDb, "dx", "processed");
    expect(fb.updateDoc.mock.calls[0][0]).toMatchObject({
      kind: "doc",
      name: "service_deletion_requests",
      id: "dx",
    });
  });
});

describe("ServiceActions · Reports (reportes de datos)", () => {
  it("createServiceReport persiste como 'pending' con serverTimestamp", async () => {
    await createServiceReport(fakeDb, {
      id: "rep-1",
      serviceId: "svc-r",
      serviceName: "Restaurante X",
      reporterUid: "u9",
      reporterEmail: "rep@example.com",
      category: "horario_incorrecto",
      description: "Cierra los lunes y no lo indica",
    });
    const [ref, payload] = fb.setDoc.mock.calls[0];
    expect(ref).toMatchObject({ kind: "doc", name: "service_reports", id: "rep-1" });
    expect(payload.status).toBe("pending");
    expect(payload.createdAt).toEqual({ serverTimestamp: true });
  });

  it("createServiceReport bloquea si se supera el rate limit (P2-6 / rate_limited)", async () => {
    const reportData = {
      serviceId: "svc-r",
      serviceName: "Restaurante X",
      reporterUid: "u-rate-limit",
      reporterEmail: "rep@example.com",
      category: "horario_incorrecto" as const,
      description: "Cierra los lunes",
    };
    for (let i = 0; i < 5; i++) {
      await createServiceReport(fakeDb, { ...reportData, id: `rep-rl-${i}` });
    }
    await expect(createServiceReport(fakeDb, { ...reportData, id: "rep-rl-over" })).rejects.toMatchObject({
      code: "rate_limited",
    });
  });

  it("getAllReports mapea documentos y devuelve [] ante fallo", async () => {
    fb.getDocs.mockResolvedValueOnce(
      snapOf([
        { id: "r1", data: { category: "otro" } },
        { id: "r2", data: { category: "otro" } },
      ]),
    );
    const rows = await getAllReports(fakeDb);
    expect(rows.length).toBe(2);
    expect(rows.every((r) => typeof r.category === "string")).toBe(true);

    fb.getDocs.mockRejectedValue(new Error("nope"));
    expect(await getAllReports(fakeDb)).toEqual([]);
  });

  it("updateReportStatus escribe en service_reports/{id}", async () => {
    await updateReportStatus(fakeDb, "rep-3", "processed");
    expect(fb.updateDoc.mock.calls[0][0]).toMatchObject({
      kind: "doc",
      name: "service_reports",
      id: "rep-3",
    });
  });
});
