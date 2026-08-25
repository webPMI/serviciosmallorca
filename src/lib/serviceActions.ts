import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  type Firestore,
} from "firebase/firestore";

export type RequestStatus = "pending" | "approved" | "rejected" | "processed";

export interface ServiceClaim {
  id: string;
  serviceId: string;
  serviceName: string;
  applicantUid: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  verificationProof: string;
  status: RequestStatus;
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
// SERVICE CLAIMS (Reclamación de negocio)
// -----------------------------------------------------------------------------
export async function createServiceClaim(
  db: Firestore,
  claim: Omit<ServiceClaim, "status" | "createdAt">,
): Promise<void> {
  const claimRef = doc(db, "service_claims", claim.id);
  await setDoc(claimRef, {
    ...claim,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

export async function getUserClaims(db: Firestore, uid: string): Promise<ServiceClaim[]> {
  try {
    const q = query(collection(db, "service_claims"), where("applicantUid", "==", uid));
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as ServiceClaim);
    return items.sort((a, b) => {
      const timeA = (a.createdAt as any)?.toMillis?.() || (a.createdAt as any)?.seconds || 0;
      const timeB = (b.createdAt as any)?.toMillis?.() || (b.createdAt as any)?.seconds || 0;
      return timeB - timeA;
    });
  } catch {
    return [];
  }
}

export async function getAllClaims(db: Firestore): Promise<ServiceClaim[]> {
  try {
    const q = query(collection(db, "service_claims"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as ServiceClaim);
  } catch {
    return [];
  }
}

export async function updateClaimStatus(
  db: Firestore,
  claimId: string,
  status: RequestStatus,
  targetUserUid?: string,
): Promise<void> {
  const claimRef = doc(db, "service_claims", claimId);
  await updateDoc(claimRef, {
    status,
    updatedAt: serverTimestamp(),
  });

  // Si se aprueba, escalamos al usuario a rol 'manager'
  if (status === "approved" && targetUserUid) {
    const userRef = doc(db, "users", targetUserUid);
    await updateDoc(userRef, {
      role: "manager",
      updatedAt: serverTimestamp(),
    });
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
  } catch {
    return [];
  }
}

export async function getAllSubmissions(db: Firestore): Promise<ServiceSubmission[]> {
  try {
    const q = query(collection(db, "service_submissions"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as ServiceSubmission);
  } catch {
    return [];
  }
}

export async function updateSubmissionStatus(
  db: Firestore,
  submissionId: string,
  status: RequestStatus,
): Promise<void> {
  const subRef = doc(db, "service_submissions", submissionId);
  await updateDoc(subRef, {
    status,
    updatedAt: serverTimestamp(),
  });
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
  } catch {
    return [];
  }
}

export async function getAllDeletionRequests(db: Firestore): Promise<ServiceDeletionRequest[]> {
  try {
    const q = query(collection(db, "service_deletion_requests"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as ServiceDeletionRequest);
  } catch {
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
  } catch {
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
