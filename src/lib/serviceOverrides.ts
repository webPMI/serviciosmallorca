import type {
  ServiceItem,
  ServiceStatus,
  ServiceEvolutionEntry,
  ExtendedVerificationStatus,
  TrustLevel,
} from "../data/services";
import type { Firestore } from "firebase/firestore";

/**
 * Variable global configurable que controla si se permite editar y sobreescribir contenido
 * dinámicamente desde la base de datos (Firestore / Manager Console).
 */
let ALLOW_DATABASE_OVERRIDES = true;

export function setAllowDatabaseOverrides(enabled: boolean): void {
  ALLOW_DATABASE_OVERRIDES = enabled;
}

export function isDatabaseOverridesEnabled(): boolean {
  return ALLOW_DATABASE_OVERRIDES;
}

export interface ServiceOverride {
  ownerUid: string;
  updatedAt?: any;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  schedule?: string;
  status?: ServiceStatus;
  isObsolete?: boolean;
  evolutionHistory?: ServiceEvolutionEntry[];
  fullDescription?: {
    es?: string;
    en?: string;
    ca?: string;
    de?: string;
  };
  highlights?: {
    es?: string[];
    en?: string[];
    ca?: string[];
    de?: string[];
  };
  servicesProvided?: {
    es?: string[];
    en?: string[];
    ca?: string[];
    de?: string[];
  };
  gallery?: string[];
  image?: string;
  verified?: boolean;
  verificationStatus?: ExtendedVerificationStatus | "verified";
  trustLevel?: TrustLevel;
  confidenceScore?: number;
  lastVerifiedAt?: string;
  isClaimed?: boolean;
  claimedByUid?: string;
  claimedAt?: string;
}

// -----------------------------------------------------------------------------
// In-Memory Cache Layer (Cero coste en lecturas repetidas de Firebase)
// -----------------------------------------------------------------------------
interface CacheEntry {
  override: ServiceOverride | null;
  cachedAt: number;
}

const OVERRIDES_CACHE = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos TTL

export async function getServiceOverride(db: Firestore | undefined, slug: string): Promise<ServiceOverride | null> {
  if (!db) return null;

  // 1. Check in-memory cache
  const cached = OVERRIDES_CACHE.get(slug);
  const now = Date.now();
  if (cached && now - cached.cachedAt < CACHE_TTL_MS) {
    return cached.override;
  }

  // 2. Fetch from Firestore
  try {
    const { doc, getDoc } = await import("firebase/firestore");
    const snap = await getDoc(doc(db, "service_overrides", slug));
    const exists = typeof snap.exists === "function" ? snap.exists() : Boolean(snap.exists);
    const override = exists ? (snap.data() as ServiceOverride) : null;

    // Save to cache
    OVERRIDES_CACHE.set(slug, { override, cachedAt: now });
    return override;
  } catch {
    return null;
  }
}

/**
 * Combina un servicio estático con su superposición dinámica (si existe).
 * Gestiona el archivo de contenido obsoleto en la evolución histórica y la purga de errores.
 */
export function mergeServiceWithOverride(staticService: ServiceItem, override: ServiceOverride | null): ServiceItem {
  if (!override || !isDatabaseOverridesEnabled()) return staticService;

  // Filtrar entradas de evolución: conservar histórico legítimo y purgar datos erróneos
  const existingHistory = staticService.evolutionHistory || [];
  const overrideHistory = (override.evolutionHistory || []).filter((h) => h.action !== "purge_erroneous");
  const mergedHistory = [...existingHistory, ...overrideHistory];

  return {
    ...staticService,
    phone: override.phone || staticService.phone,
    whatsapp: override.whatsapp || staticService.whatsapp,
    email: override.email || staticService.email,
    website: override.website || staticService.website,
    schedule: override.schedule || staticService.schedule,
    status: override.status || staticService.status,
    image: override.image || staticService.image,
    gallery: override.gallery && override.gallery.length > 0 ? override.gallery : staticService.gallery,
    evolutionHistory: mergedHistory.length > 0 ? mergedHistory : undefined,
    verified: override.verified !== undefined ? override.verified : staticService.verified,
    verificationStatus: override.verificationStatus || staticService.verificationStatus,
    trustLevel: override.trustLevel || staticService.trustLevel,
    confidenceScore: override.confidenceScore !== undefined ? override.confidenceScore : staticService.confidenceScore,
    lastVerifiedAt: override.lastVerifiedAt || staticService.lastVerifiedAt,
    isClaimed: override.isClaimed !== undefined ? override.isClaimed : staticService.isClaimed,
    claimedByUid: override.claimedByUid || staticService.claimedByUid,
    claimedAt: override.claimedAt || staticService.claimedAt,
    fullDescription: staticService.fullDescription
      ? {
          es: override.fullDescription?.es || staticService.fullDescription.es || "",
          en: override.fullDescription?.en || staticService.fullDescription.en || "",
          ca: override.fullDescription?.ca || staticService.fullDescription.ca || "",
          de: override.fullDescription?.de || staticService.fullDescription.de || "",
        }
      : override.fullDescription
        ? {
            es: override.fullDescription.es || "",
            en: override.fullDescription.en || "",
            ca: override.fullDescription.ca || "",
            de: override.fullDescription.de || "",
          }
        : undefined,
    highlights: {
      es: override.highlights?.es || staticService.highlights?.es || [],
      en: override.highlights?.en || staticService.highlights?.en || [],
      ca: override.highlights?.ca || staticService.highlights?.ca || [],
      de: override.highlights?.de || staticService.highlights?.de || [],
    },
    servicesProvided: {
      es: override.servicesProvided?.es || staticService.servicesProvided?.es || [],
      en: override.servicesProvided?.en || staticService.servicesProvided?.en || [],
      ca: override.servicesProvided?.ca || staticService.servicesProvided?.ca || [],
      de: override.servicesProvided?.de || staticService.servicesProvided?.de || [],
    },
  };
}

/**
 * Guarda una modificación de negocio en Firestore y actualiza la caché local.
 */
export async function saveServiceOverride(
  db: Firestore,
  slug: string,
  managerUid: string,
  data: Partial<Omit<ServiceOverride, "ownerUid" | "updatedAt">>,
): Promise<void> {
  const { doc, setDoc, serverTimestamp } = await import("firebase/firestore");
  const overrideDoc: ServiceOverride = {
    ...data,
    ownerUid: managerUid,
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, "service_overrides", slug), overrideDoc, { merge: true });

  // Invalidate and update local cache
  OVERRIDES_CACHE.set(slug, {
    override: {
      ...overrideDoc,
      updatedAt: new Date().toISOString(),
    },
    cachedAt: Date.now(),
  });
}

/**
 * Valida o verifica formalmente un negocio por parte de un administrador.
 * Actualiza la colección 'service_overrides' con la confianza, estado y sello de verificación.
 */
export async function verifyBusinessAsAdmin(
  db: Firestore,
  slug: string,
  adminUid: string,
  options?: {
    confidenceScore?: number;
    verificationStatus?: ExtendedVerificationStatus | "verified";
    trustLevel?: TrustLevel;
    verified?: boolean;
  },
): Promise<ServiceOverride> {
  const verifiedDoc: Partial<Omit<ServiceOverride, "ownerUid" | "updatedAt">> = {
    verified: options?.verified ?? true,
    verificationStatus: options?.verificationStatus ?? "verified_official",
    trustLevel: options?.trustLevel ?? "level_3_official",
    confidenceScore: options?.confidenceScore ?? 95,
    lastVerifiedAt: new Date().toISOString(),
  };

  await saveServiceOverride(db, slug, adminUid, verifiedDoc);
  return {
    ownerUid: adminUid,
    ...verifiedDoc,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Obtiene todas las superposiciones de negocios almacenadas en Firestore.
 * Útil para hidratar el estado de verificación global en el panel de administración.
 */
export async function getAllServiceOverrides(db: Firestore | undefined): Promise<Record<string, ServiceOverride>> {
  if (!db) return {};
  try {
    const { collection, getDocs } = await import("firebase/firestore");
    const snapshot = await getDocs(collection(db, "service_overrides"));
    const results: Record<string, ServiceOverride> = {};
    snapshot.forEach((doc) => {
      const data = doc.data() as ServiceOverride;
      results[doc.id] = data;
      // Pre-poblar caché en memoria
      OVERRIDES_CACHE.set(doc.id, { override: data, cachedAt: Date.now() });
    });
    return results;
  } catch {
    return {};
  }
}
