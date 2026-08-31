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

const fb = vi.hoisted(() => ({
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  getDocs: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  collection: (_db: unknown, name: string) => ({ kind: "collection", name }),
  doc: (_db: unknown, name: string, id?: string) => ({ kind: "doc", name, id }),
  query: (...parts: unknown[]) => ({ kind: "query", parts }),
  where: (...args: unknown[]) => args,
  orderBy: (...args: unknown[]) => args,
  serverTimestamp: () => ({ serverTimestamp: true }),
  setDoc: fb.setDoc,
  updateDoc: fb.updateDoc,
  getDocs: fb.getDocs,
}));

import {
  createServiceClaim,
  getUserClaims,
  getAllClaims,
  updateClaimStatus,
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

beforeEach(() => {
  fb.setDoc.mockReset();
  fb.updateDoc.mockReset();
  fb.getDocs.mockReset();
});

describe("ServiceActions · Claims (reclamación de negocio)", () => {
  it("createServiceClaim persiste con estado 'pending' y serverTimestamp", async () => {
    await createServiceClaim(fakeDb, claimFixture);

    expect(fb.setDoc).toHaveBeenCalledTimes(1);
    const [ref, payload] = fb.setDoc.mock.calls[0];
    expect(ref).toMatchObject({ kind: "doc", name: "service_claims", id: "claim-1" });
    expect(payload).toMatchObject({
      ...claimFixture,
      status: "pending",
      createdAt: { serverTimestamp: true },
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

  it("getUserClaims devuelve [] ante fallo de Firestore (swallow silencioso)", async () => {
    fb.getDocs.mockRejectedValue(new Error("offline"));
    const claims = await getUserClaims(fakeDb, "any");
    expect(claims).toEqual([]);
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

  it("updateClaimStatus escribe status + updatedAt sin tocar users", async () => {
    await updateClaimStatus(fakeDb, "claim-9", "rejected");
    expect(fb.updateDoc).toHaveBeenCalledTimes(1);
    expect(fb.updateDoc.mock.calls[0][0]).toMatchObject({
      kind: "doc",
      name: "service_claims",
      id: "claim-9",
    });
    expect(fb.updateDoc.mock.calls[0][1]).toEqual({
      status: "rejected",
      updatedAt: { serverTimestamp: true },
    });
  });

  it("aprobación con targetUserUid escala al usuario a rol 'manager'", async () => {
    await updateClaimStatus(fakeDb, "claim-1", "approved", "user-42");
    expect(fb.updateDoc).toHaveBeenCalledTimes(2);
    expect(fb.updateDoc.mock.calls[1][0]).toMatchObject({
      kind: "doc",
      name: "users",
      id: "user-42",
    });
    expect(fb.updateDoc.mock.calls[1][1].role).toBe("manager");
  });

  it("aprobación con serviceId vincula el negocio al usuario mediante assignBusinessToUser", async () => {
    await updateClaimStatus(fakeDb, "claim-1", "approved", "user-42", "svc-bar-1");
    expect(fb.updateDoc).toHaveBeenCalled();
  });

  it("updateClaimStatus tolera errores de Firestore de forma segura", async () => {
    fb.updateDoc.mockRejectedValueOnce(new Error("network error"));
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    await expect(updateClaimStatus(fakeDb, "claim-1", "approved")).resolves.not.toThrow();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
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

  it("updateSubmissionStatus escribe en la colección correcta", async () => {
    await updateSubmissionStatus(fakeDb, "sub-7", "approved");
    expect(fb.updateDoc.mock.calls[0][0]).toMatchObject({
      kind: "doc",
      name: "service_submissions",
      id: "sub-7",
    });
    expect(fb.updateDoc.mock.calls[0][1].status).toBe("approved");
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
