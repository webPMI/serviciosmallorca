import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  writeBatch,
  arrayUnion,
  type Firestore,
} from "firebase/firestore";
import { reportClientFailure } from "./clientTelemetry";
import { buildClaimedOverridePayload, getServiceOverrideFresh } from "./serviceOverrides";
import { slugify } from "./ownershipValidation";

export type RequestStatus = "pending" | "approved" | "rejected" | "processed";

/** Códigos de error de negocio del flujo de solicitudes (nunca mensajes ambiguos). */
export type ServiceRequestErrorCode =
  "duplicate_claim" | "already_claimed" | "missing_business" | "claim_not_found" | "ownership_conflict";

/**
 * Error tipado de las solicitudes de titularidad. La UI lo traduce a un mensaje
 * claro y la telemetría registra el intento (GR-15).
 */
export class ServiceRequestError extends Error {
  constructor(
    public readonly code: ServiceRequestErrorCode,
    message: string,
    public readonly metadata?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ServiceRequestError";
    reportClientFailure(`service_request:${code}`, this, {
      level: "SECURITY",
      category: "AUTH",
      metadata,
    });
  }
}

/**
 * ID determinista de reclamación: un usuario solo puede tener **una** solicitud
 * por negocio (INV-04). Hace la deduplicación inmune a reintentos y dobles clics.
 */
export function buildClaimId(serviceId: string, applicantUid: string): string {
  return `claim-${serviceId}-${applicantUid}`.replace(/[^\w-]/g, "_").slice(0, 500);
}

export interface ServiceClaim {
  id: string;
  serviceId: string;
  /** Slug canónico de la ficha (para localizar el override sin ambigüedad). */
  serviceSlug?: string;
  serviceName: string;
  applicantUid: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  verificationProof: string;
  /** NIF/CIF/NIE declarado por el solicitante (INV-08 · GR-11). */
  businessTaxId?: string;
  /** Método con el que se acredita la titularidad (INV-01). */
  verificationMethod?: "official_document" | "corporate_email" | "phone_sms_otp" | "manual_notarial";
  /** Enlace https:// al documento acreditativo. */
  documentUrl?: string;
  /** Puntuación del motor de seguridad en el momento de la solicitud. */
  securityScore?: number;
  status: RequestStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  decisionNotes?: string;
  createdAt: any;
  updatedAt?: any;
}

export interface ServiceSubmission {
  id: string;
  applicantUid: string;
  applicantName: string;
  applicantEmail: string;
  name: string;
  category: string;
  zone: string;
  address: string;
  phone: string;
  website: string;
  description: string;
  status: RequestStatus;
  createdAt: any;
  updatedAt?: any;
}

export interface ServiceDeletionRequest {
  id: string;
  serviceId: string;
  serviceName: string;
  applicantUid: string;
  applicantEmail: string;
  reason: string;
  status: RequestStatus;
  createdAt: any;
  updatedAt?: any;
}

export type ReportCategory =
  "horario_incorrecto" | "ubicacion_erronea" | "contacto_invalido" | "negocio_cerrado" | "sugerencia_cambio" | "otro";

export interface ServiceReport {
  id: string;
  serviceId: string;
  serviceName: string;
  reporterUid?: string;
  reporterEmail?: string;
  category: ReportCategory;
  description: string;
  status: RequestStatus;
  createdAt: any;
  updatedAt?: any;
}

// -----------------------------------------------------------------------------
// SERVICE CLAIMS (Reclamación de negocio con persistencia híbrida Firestore + LocalStorage)
// -----------------------------------------------------------------------------
const CLAIMS_STORAGE_KEY = "sm_service_claims";

function getLocalClaims(): ServiceClaim[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(CLAIMS_STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    // CORRECCIÓN MEDIA #5: Mejorar manejo de errores de LocalStorage
    if (err instanceof DOMException && (err.name === "QuotaExceededError" || err.name === "SecurityError")) {
      console.warn("LocalStorage access denied or quota exceeded:", err.name);
    } else {
      console.warn("Could not parse local claims:", err);
    }
    return [];
  }
}

function saveLocalClaim(claim: ServiceClaim): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalClaims();
    const filtered = existing.filter((c) => c.id !== claim.id);
    filtered.unshift(claim);

    // CORRECCIÓN MEDIA #5: Verificar cuota antes de guardar
    const data = JSON.stringify(filtered);
    localStorage.setItem(CLAIMS_STORAGE_KEY, data);
  } catch (err) {
    // CORRECCIÓN MEDIA #5: Manejo específico de errores de cuota y seguridad
    if (err instanceof DOMException) {
      if (err.name === "QuotaExceededError") {
        console.warn("LocalStorage quota exceeded, attempting to clear old claims");
        try {
          const existing = getLocalClaims();
          const reduced = existing.slice(0, 10); // Mantener solo los 10 más recientes
          localStorage.setItem(CLAIMS_STORAGE_KEY, JSON.stringify(reduced));
        } catch (retryErr) {
          console.warn("Failed to save claim even after cleanup:", retryErr);
        }
      } else if (err.name === "SecurityError") {
        console.warn("LocalStorage access denied (private mode):", err);
      } else {
        console.warn("LocalStorage error:", err);
      }
    } else {
      console.warn("Could not save claim locally:", err);
    }
  }
}

/**
 * Crea una reclamación de titularidad con **deduplicación real** (INV-04):
 *  1. El ID es determinista (`serviceId` + `uid`), así un reintento no genera duplicados.
 *  2. Se comprueba que el usuario no tenga ya una solicitud para ese negocio.
 *  3. Se comprueba que la ficha no esté ya gestionada por otro titular.
 *
 * @throws {ServiceRequestError} `duplicate_claim` | `already_claimed`
 */
export async function createServiceClaim(
  db: Firestore,
  claim: Omit<ServiceClaim, "status" | "createdAt">,
): Promise<string> {
  const claimId = claim.id?.trim() ? claim.id : buildClaimId(claim.serviceId, claim.applicantUid);
  const fullClaim: ServiceClaim = {
    ...claim,
    id: claimId,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  // 1) Deduplicación: ¿ya existe una solicitud con este ID determinista?
  let existingClaim: ServiceClaim | null = null;
  try {
    const snap = await getDoc(doc(db, "service_claims", claimId));
    const exists = typeof snap.exists === "function" ? snap.exists() : Boolean(snap.exists);
    existingClaim = exists ? ((snap.data() as ServiceClaim) ?? null) : null;
  } catch (error) {
    reportClientFailure("createServiceClaim/preflight", error, {
      category: "DATABASE",
      resource: claimId,
    });
    throw error;
  }

  if (existingClaim) {
    throw new ServiceRequestError(
      "duplicate_claim",
      "Ya existe una solicitud de titularidad para este negocio con tu cuenta. Espera la resolución del equipo antes de volver a reclamarlo.",
      { claimId, status: existingClaim.status },
    );
  }

  // 2) ¿La ficha pertenece ya a otro titular verificado?
  const slug = claim.serviceSlug || claim.serviceId;
  const override = await getServiceOverrideFresh(db, slug);
  if (override?.claimedByUid && override.claimedByUid !== claim.applicantUid) {
    throw new ServiceRequestError(
      "already_claimed",
      "Esta ficha ya está gestionada por su titular verificado. Si eres el titular legítimo, contacta con el equipo para impugnar la titularidad.",
      { slug, claimedByUid: override.claimedByUid },
    );
  }

  // 3) Resiliencia offline: la copia local permite reintentar sin perder los datos.
  saveLocalClaim(fullClaim);

  try {
    await setDoc(doc(db, "service_claims", claimId), {
      ...claim,
      id: claimId,
      status: "pending",
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    reportClientFailure("createServiceClaim/write", error, {
      category: "DATABASE",
      resource: claimId,
    });
  }

  return claimId;
}

export async function getUserClaims(db: Firestore, uid: string): Promise<ServiceClaim[]> {
  const localClaims = getLocalClaims().filter((c) => c.applicantUid === uid || !c.applicantUid);
  try {
    const q = query(collection(db, "service_claims"), where("applicantUid", "==", uid));
    const snapshot = await getDocs(q);
    const remoteItems = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as ServiceClaim);

    // Unir locales y remotos deduplicando por ID
    const map = new Map<string, ServiceClaim>();
    localClaims.forEach((c) => map.set(c.id, c));
    remoteItems.forEach((c) => map.set(c.id, c));

    return Array.from(map.values()).sort((a, b) => {
      const timeA =
        (a.createdAt as any)?.toMillis?.() ||
        (a.createdAt as any)?.seconds ||
        (typeof a.createdAt === "string" ? new Date(a.createdAt).getTime() : 0);
      const timeB =
        (b.createdAt as any)?.toMillis?.() ||
        (b.createdAt as any)?.seconds ||
        (typeof b.createdAt === "string" ? new Date(b.createdAt).getTime() : 0);
      return timeB - timeA;
    });
  } catch (error) {
    reportClientFailure("getClaims/read", error, { category: "DATABASE" });
    return localClaims;
  }
}

export async function getAllClaims(db: Firestore): Promise<ServiceClaim[]> {
  const localClaims = getLocalClaims();
  try {
    const q = query(collection(db, "service_claims"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const remoteItems = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as ServiceClaim);

    const map = new Map<string, ServiceClaim>();
    localClaims.forEach((c) => map.set(c.id, c));
    remoteItems.forEach((c) => map.set(c.id, c));

    return Array.from(map.values()).sort((a, b) => {
      const timeA =
        (a.createdAt as any)?.toMillis?.() ||
        (a.createdAt as any)?.seconds ||
        (typeof a.createdAt === "string" ? new Date(a.createdAt).getTime() : 0);
      const timeB =
        (b.createdAt as any)?.toMillis?.() ||
        (b.createdAt as any)?.seconds ||
        (typeof b.createdAt === "string" ? new Date(b.createdAt).getTime() : 0);
      return timeB - timeA;
    });
  } catch (error) {
    reportClientFailure("getClaims/read", error, { category: "DATABASE" });
    return localClaims;
  }
}

/**
 * Decisión del administrador sobre una reclamación.
 * Al aprobar, `applicantUid` y `serviceId` son **obligatorios**: es imposible
 * ascender a `manager` sin negocio asignado (INV-03 · P0-5).
 */
export interface ClaimDecision {
  applicantUid?: string;
  serviceId?: string;
  serviceSlug?: string;
  /** UID del administrador que decide (trazabilidad INV-08). */
  reviewerUid?: string;
  /** Notas internas de la decisión. */
  notes?: string;
  /** Reasignar una ficha ya gestionada por otro titular (por defecto, se bloquea). */
  force?: boolean;
}

/** Resuelve el slug canónico de una ficha sin importar el catálogo.
 *
 * Importar `data/services` desde aquí arrastraba el catálogo completo (~6 MB) al bundle
 * de cliente de las fichas de detalle y de /servicios/nuevo. La información necesaria
 * viaja en la propia solicitud (`serviceSlug`) y, si faltara, se degrada al `serviceId`.
 */
function resolveServiceSlug(claim: ServiceClaim, serviceId: string, explicitSlug?: string): string {
  return explicitSlug || claim.serviceSlug || serviceId;
}

/**
 * Resuelve una reclamación.
 *
 * Aprobación (INV-02/INV-03/INV-05/INV-08): se aplica en **un batch atómico** que
 *  - marca la solicitud como aprobada con revisor y fecha,
 *  - asigna el rol `manager` **junto al negocio** en `managedServices` (nunca vacío, nunca degrada a un admin),
 *  - transfiere la titularidad del override al solicitante con el sello firmado por el admin
 *    y la evidencia real aportada (`businessTaxId` + `documentUrl`).
 *
 * Rechazo: solo actualiza la solicitud, sin efectos sobre el rol ni la ficha.
 *
 * @throws {ServiceRequestError} `missing_business` | `claim_not_found` | `ownership_conflict`
 */
export async function updateClaimStatus(
  db: Firestore,
  claimId: string,
  status: RequestStatus,
  decision: ClaimDecision = {},
): Promise<void> {
  // Actualizar en LocalStorage (respuesta inmediata en UI)
  if (typeof window !== "undefined") {
    try {
      const all = getLocalClaims();
      const match = all.find((c) => c.id === claimId);
      if (match) {
        match.status = status;
        match.updatedAt = new Date().toISOString();
        localStorage.setItem(CLAIMS_STORAGE_KEY, JSON.stringify(all));
      }
    } catch (error) {
      reportClientFailure("updateClaimStatus/localStorage", error, { category: "CLIENT_JS", resource: claimId });
    }
  }

  if (status !== "approved") {
    await updateDoc(doc(db, "service_claims", claimId), {
      status,
      reviewedBy: decision.reviewerUid ?? null,
      reviewedAt: new Date().toISOString(),
      ...(decision.notes ? { decisionNotes: decision.notes } : {}),
      updatedAt: serverTimestamp(),
    });
    return;
  }

  // ── Aprobación: el negocio y el solicitante son obligatorios ───────────────
  const applicantUid = decision.applicantUid?.trim();
  const serviceId = decision.serviceId?.trim();
  if (!applicantUid || !serviceId) {
    throw new ServiceRequestError(
      "missing_business",
      "No se puede aprobar una reclamación sin solicitante y negocio identificados: nunca se otorga el rol manager sin ficha asignada.",
      { claimId },
    );
  }

  const claimSnap = await getDoc(doc(db, "service_claims", claimId));
  const claimExists = typeof claimSnap.exists === "function" ? claimSnap.exists() : Boolean(claimSnap.exists);
  if (!claimExists) {
    throw new ServiceRequestError("claim_not_found", `La reclamación ${claimId} no existe o fue eliminada.`, {
      claimId,
    });
  }
  const claim = claimSnap.data() as ServiceClaim;

  const slug = resolveServiceSlug(claim, serviceId, decision.serviceSlug);
  const [existingOverride, userSnap] = await Promise.all([
    getServiceOverrideFresh(db, slug),
    getDoc(doc(db, "users", applicantUid)),
  ]);

  if (existingOverride?.claimedByUid && existingOverride.claimedByUid !== applicantUid && !decision.force) {
    throw new ServiceRequestError(
      "ownership_conflict",
      "La ficha ya está asignada a otro titular verificado. Revoca esa titularidad antes de reasignarla.",
      { slug, claimedByUid: existingOverride.claimedByUid },
    );
  }

  const userExists = typeof userSnap.exists === "function" ? userSnap.exists() : Boolean(userSnap.exists);
  const applicantProfile = userExists ? (userSnap.data() as { role?: string }) : undefined;
  const reviewedAt = new Date().toISOString();
  const reviewerUid = decision.reviewerUid ?? "";

  const batch = writeBatch(db);

  batch.update(doc(db, "service_claims", claimId), {
    status: "approved",
    reviewedBy: reviewerUid || null,
    reviewedAt,
    ...(decision.notes ? { decisionNotes: decision.notes } : {}),
    updatedAt: serverTimestamp(),
  });

  batch.set(
    doc(db, "users", applicantUid),
    {
      role: applicantProfile?.role === "admin" ? "admin" : "manager",
      managedServices: arrayUnion(serviceId),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  batch.set(
    doc(db, "service_overrides", slug),
    buildClaimedOverridePayload({
      applicantUid,
      reviewerUid,
      serviceId,
      businessTaxId: claim.businessTaxId || claim.verificationProof || "",
      documentUrl:
        claim.documentUrl || (claim.verificationProof?.startsWith("https://") ? claim.verificationProof : undefined),
      verificationMethod: claim.verificationMethod,
      claimedAt: reviewedAt,
      existingAuditTrail: existingOverride?.auditTrail,
    }),
    { merge: true },
  );

  try {
    await batch.commit();
  } catch (error) {
    reportClientFailure("updateClaimStatus/approve", error, {
      level: "SECURITY",
      category: "DATABASE",
      resource: claimId,
    });
    throw error;
  }
}

// -----------------------------------------------------------------------------
// SERVICE SUBMISSIONS (Alta de nuevo negocio)
// -----------------------------------------------------------------------------
export async function createServiceSubmission(
  db: Firestore,
  submission: Omit<ServiceSubmission, "status" | "createdAt">,
): Promise<void> {
  const subRef = doc(db, "service_submissions", submission.id);
  await setDoc(subRef, {
    ...submission,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

export async function getUserSubmissions(db: Firestore, uid: string): Promise<ServiceSubmission[]> {
  try {
    const q = query(collection(db, "service_submissions"), where("applicantUid", "==", uid));
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as ServiceSubmission);
    return items.sort((a, b) => {
      const timeA = (a.createdAt as any)?.toMillis?.() || (a.createdAt as any)?.seconds || 0;
      const timeB = (b.createdAt as any)?.toMillis?.() || (b.createdAt as any)?.seconds || 0;
      return timeB - timeA;
    });
  } catch (error) {
    reportClientFailure("readCollection", error, { category: "DATABASE" });
    return [];
  }
}

export async function getAllSubmissions(db: Firestore): Promise<ServiceSubmission[]> {
  try {
    const q = query(collection(db, "service_submissions"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as ServiceSubmission);
  } catch (error) {
    reportClientFailure("readCollection", error, { category: "DATABASE" });
    return [];
  }
}

export async function updateSubmissionStatus(
  db: Firestore,
  submissionId: string,
  status: RequestStatus,
  reviewerUid?: string,
): Promise<{ slug?: string } | void> {
  const subRef = doc(db, "service_submissions", submissionId);
  const snap = await getDoc(subRef);
  if (!snap.exists()) {
    throw new Error(`Solicitud de alta ${submissionId} no encontrada`);
  }
  const submission = snap.data() as ServiceSubmission;

  if (status !== "approved") {
    await updateDoc(subRef, {
      status,
      updatedAt: serverTimestamp(),
      ...(reviewerUid ? { reviewedBy: reviewerUid } : {}),
    });
    return;
  }

  // Generar slug canónico a partir del nombre comercial (Vía B · INV-02)
  const baseSlug = slugify(submission.name || "nuevo-negocio");
  const slug = baseSlug || `negocio-${submission.id}`;
  const nowIso = new Date().toISOString();

  const batch = writeBatch(db);

  // 1. Actualizar estado de la solicitud con el slug aprobado
  batch.update(subRef, {
    status: "approved",
    approvedSlug: slug,
    reviewedBy: reviewerUid || undefined,
    reviewedAt: nowIso,
    updatedAt: serverTimestamp(),
  });

  // 2. Crear override base para que el titular comience a gestionar su ficha (INV-02)
  batch.set(
    doc(db, "service_overrides", slug),
    {
      ownerUid: submission.applicantUid,
      isClaimed: true,
      claimedByUid: submission.applicantUid,
      claimedAt: nowIso,
      phone: submission.phone || undefined,
      website: submission.website || undefined,
      fullDescription: {
        es: submission.description || "",
      },
      status: "open",
      updatedAt: serverTimestamp(),
      auditTrail: [
        {
          id: `audit-${Date.now()}`,
          timestamp: nowIso,
          action: "created",
          fieldChanged: "status,ownerUid,isClaimed",
          newValue: { status: "open", ownerUid: submission.applicantUid, isClaimed: true },
          authorRole: "admin",
          authorUid: reviewerUid || "system_admin",
          reason: `Propuesta de alta aprobada (solicitud ${submissionId})`,
        },
      ],
    },
    { merge: true },
  );

  // 3. Asignar rol manager al solicitante y vincular la ficha aprobada a managedServices (INV-03)
  if (submission.applicantUid) {
    batch.set(
      doc(db, "users", submission.applicantUid),
      {
        role: "manager",
        managedServices: arrayUnion(slug),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }

  try {
    await batch.commit();
    return { slug };
  } catch (error) {
    reportClientFailure("updateSubmissionStatus/approve", error, {
      level: "SECURITY",
      category: "DATABASE",
      resource: submissionId,
    });
    throw error;
  }
}

// -----------------------------------------------------------------------------
// SERVICE DELETIONS (Solicitud de baja / derecho de supresión)
// -----------------------------------------------------------------------------
export async function createServiceDeletionRequest(
  db: Firestore,
  request: Omit<ServiceDeletionRequest, "status" | "createdAt">,
): Promise<void> {
  const delRef = doc(db, "service_deletion_requests", request.id);
  await setDoc(delRef, {
    ...request,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

export async function getUserDeletionRequests(db: Firestore, uid: string): Promise<ServiceDeletionRequest[]> {
  try {
    const q = query(collection(db, "service_deletion_requests"), where("applicantUid", "==", uid));
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as ServiceDeletionRequest);
    return items.sort((a, b) => {
      const timeA = (a.createdAt as any)?.toMillis?.() || (a.createdAt as any)?.seconds || 0;
      const timeB = (b.createdAt as any)?.toMillis?.() || (b.createdAt as any)?.seconds || 0;
      return timeB - timeA;
    });
  } catch (error) {
    reportClientFailure("readCollection", error, { category: "DATABASE" });
    return [];
  }
}

export async function getAllDeletionRequests(db: Firestore): Promise<ServiceDeletionRequest[]> {
  try {
    const q = query(collection(db, "service_deletion_requests"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as ServiceDeletionRequest);
  } catch (error) {
    reportClientFailure("readCollection", error, { category: "DATABASE" });
    return [];
  }
}

export async function updateDeletionRequestStatus(
  db: Firestore,
  requestId: string,
  status: RequestStatus,
): Promise<void> {
  const reqRef = doc(db, "service_deletion_requests", requestId);
  await updateDoc(reqRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}

// -----------------------------------------------------------------------------
// SERVICE REPORTS & SUGGESTIONS (Reportes de datos y sugerencias de cambio)
// -----------------------------------------------------------------------------

export async function createServiceReport(
  db: Firestore,
  data: Omit<ServiceReport, "status" | "createdAt" | "updatedAt">,
): Promise<void> {
  const docRef = doc(db, "service_reports", data.id);
  await setDoc(docRef, {
    ...data,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

export async function getAllReports(db: Firestore): Promise<ServiceReport[]> {
  try {
    const q = query(collection(db, "service_reports"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as ServiceReport);
  } catch (error) {
    reportClientFailure("readCollection", error, { category: "DATABASE" });
    return [];
  }
}

export async function updateReportStatus(db: Firestore, reportId: string, status: RequestStatus): Promise<void> {
  const repRef = doc(db, "service_reports", reportId);
  await updateDoc(repRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}
