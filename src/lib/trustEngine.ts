/**
 * trustEngine.ts
 *
 * Motor de Seguridad, Niveles de Confianza (Trust Levels) y Caducidad Dinámica.
 * Implementa la arquitectura de "Veracidad Progresiva" para garantizar que solo
 * los datos reales y verificados otorguen control y capacidades interactivas.
 */

import type { ServiceItem, TrustLevel } from "../data/services";
import type { UserRole } from "./authStore";

export interface TrustEvaluation {
  trustLevel: TrustLevel;
  effectiveScore: number;
  isDecayed: boolean;
  daysSinceLastValidation: number;
  statusBadge: {
    label: { es: string; en: string; ca: string; de: string };
    variant: "info" | "success" | "warning" | "premium";
  };
  allowedActions: {
    canViewDetails: boolean;
    canDirectContact: boolean;
    canDirectBook: boolean;
    canSubmitReviews: boolean;
    canReportQuality: boolean;
  };
}

const SIX_MONTHS_DAYS = 180;
const ONE_YEAR_DAYS = 365;

/**
 * Calcula los días transcurridos desde la última validación activa.
 */
export function getDaysSinceValidation(lastValidatedAt?: string, currentDate: Date = new Date()): number {
  if (!lastValidatedAt) return 999; // Si nunca ha sido validado, se considera caducado
  const validatedTime = new Date(lastValidatedAt).getTime();
  if (isNaN(validatedTime)) return 999;

  const diffMs = currentDate.getTime() - validatedTime;
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

/**
 * Calcula el puntaje de confianza dinámico con degradación temporal por obsolescencia.
 * Si un negocio no se audita en 6 meses (>180 días), su puntaje baja un 30%.
 * Si supera 1 año (>365 días), su puntaje baja un 50%.
 */
export function calculateDecayedConfidenceScore(service: ServiceItem, currentDate: Date = new Date()): number {
  const baseScore = service.confidenceScore ?? (service.verified ? 90 : 50);
  const days = getDaysSinceValidation(service.lastValidatedAt, currentDate);

  if (days > ONE_YEAR_DAYS) {
    return Math.max(20, Math.round(baseScore * 0.5));
  } else if (days > SIX_MONTHS_DAYS) {
    return Math.max(40, Math.round(baseScore * 0.7));
  }

  return baseScore;
}

/**
 * Determina el Nivel de Confianza (Trust Level) de un negocio en base a su verificación y score dinámico.
 */
export function calculateTrustLevel(service: ServiceItem, currentDate: Date = new Date()): TrustLevel {
  const effectiveScore = calculateDecayedConfidenceScore(service, currentDate);
  const status = service.verificationStatus;

  // Nivel 3 (Verificación Oficial): Estatus oficial y titular verificado con 100% de confianza
  if (
    status === "verified_official" ||
    (service.verified && service.sourceCrossReference?.taxIdVerified && effectiveScore >= 95)
  ) {
    return "level_3_official";
  }

  // Nivel 2 (Verificación Comunitaria): Puntaje efectivo >= 80%
  if (effectiveScore >= 80 && status !== "needs_review" && status !== "needs_manual_review") {
    return "level_2_community";
  }

  // Nivel 1 (Modo Descubrimiento / Observación): Datos iniciales o en revisión
  return "level_1_discovery";
}

/**
 * Evalúa integralmente la confianza, acciones permitidas y badges del servicio.
 */
export function evaluateServiceTrust(service: ServiceItem, currentDate: Date = new Date()): TrustEvaluation {
  const days = getDaysSinceValidation(service.lastValidatedAt, currentDate);
  const effectiveScore = calculateDecayedConfidenceScore(service, currentDate);
  const trustLevel = calculateTrustLevel(service, currentDate);
  const isDecayed = days > SIX_MONTHS_DAYS;

  let statusBadge: TrustEvaluation["statusBadge"];
  let allowedActions: TrustEvaluation["allowedActions"];

  switch (trustLevel) {
    case "level_3_official":
      statusBadge = {
        label: {
          es: "Verificado Oficial (Titular Acreditado)",
          en: "Officially Verified (Owner Accredited)",
          ca: "Verificat Oficial (Titular Acreditat)",
          de: "Offiziell Verifiziert (Inhaber Bestätigt)",
        },
        variant: "premium",
      };
      allowedActions = {
        canViewDetails: true,
        canDirectContact: true,
        canDirectBook: true,
        canSubmitReviews: true,
        canReportQuality: true,
      };
      break;

    case "level_2_community":
      statusBadge = {
        label: isDecayed
          ? {
              es: "Verificación Comunitaria (Pendiente de Actualización)",
              en: "Community Verified (Update Pending)",
              ca: "Verificació Comunitària (Pendent d'Actualització)",
              de: "Community-Verifiziert (Aktualisierung Ausstehend)",
            }
          : {
              es: "Verificado por la Comunidad",
              en: "Community Verified",
              ca: "Verificat per la Comunitat",
              de: "Community-Verifiziert",
            },
        variant: isDecayed ? "warning" : "success",
      };
      allowedActions = {
        canViewDetails: true,
        canDirectContact: true,
        canDirectBook: false,
        canSubmitReviews: true,
        canReportQuality: true,
      };
      break;

    case "level_1_discovery":
    default:
      statusBadge = {
        label: {
          es: "En Fase de Validación (Modo Observación)",
          en: "Under Validation (Discovery Mode)",
          ca: "En Fase de Validació (Mode Observació)",
          de: "In Validierungsphase (Beobachtungsmodus)",
        },
        variant: "info",
      };
      allowedActions = {
        canViewDetails: true,
        canDirectContact: false, // Bloqueado con aviso informativo
        canDirectBook: false,
        canSubmitReviews: false,
        canReportQuality: true,
      };
      break;
  }

  return {
    trustLevel,
    effectiveScore,
    isDecayed,
    daysSinceLastValidation: days,
    statusBadge,
    allowedActions,
  };
}

/**
 * Control de Permisos de Interacción por Rol de Usuario y Nivel de Confianza.
 */
export function canUserInteractWithService(
  userRole: UserRole,
  service: ServiceItem,
  action: "view" | "contact" | "book" | "review" | "edit",
  currentDate: Date = new Date(),
): boolean {
  if (userRole === "admin") return true;

  const trust = evaluateServiceTrust(service, currentDate);

  switch (action) {
    case "view":
      return trust.allowedActions.canViewDetails;

    case "contact":
      return trust.allowedActions.canDirectContact;

    case "book":
      return userRole !== "guest" && trust.allowedActions.canDirectBook;

    case "review":
      return userRole !== "guest" && trust.allowedActions.canSubmitReviews;

    case "edit":
      return userRole === "manager";

    default:
      return false;
  }
}

/**
 * Barrera de Seguridad Estricta: Comprueba si un usuario está autorizado a editar una ficha.
 * Solo el Administrador o el Gestor Titular Verificado pueden modificar datos.
 */
export function isAuthorizedToEdit(
  userUid: string | undefined,
  userRole: UserRole,
  service: ServiceItem,
  overrideOwnerUid?: string,
): boolean {
  if (!userUid) return false;
  if (userRole === "admin") return true;

  if (userRole === "manager") {
    // Si hay un titular asignado en base de datos, debe coincidir exactamente
    if (overrideOwnerUid && overrideOwnerUid === userUid) {
      return true;
    }
    // Si la ficha estática tiene asignado un UID de gestor
    if ((service as any).managerUid && (service as any).managerUid === userUid) {
      return true;
    }
  }

  return false;
}
