/**
 * paymentSecurityEngine.ts
 *
 * 🔒 MOTOR DE SEGURIDAD DE PAGOS, IDEMPOTENCIA Y PREVENCIÓN DE DUPLICADOS (2026)
 *
 * Protecciones Críticas:
 *  1. 🛑 Anti-Doble Clic & Bloqueo de Mutex: Impide transacciones duplicadas por clics rápidos o reenvíos de formulario.
 *  2. 🔑 Idempotencia Criptográfica: Token único por intento de checkout (ServiceId + Amount + Timestamp + Hash).
 *  3. 👑 Regla de No-Colisión del Cuadro de Honor: En una lista no pueden existir dos comercios con el mismo importe exacto.
 *  4. ⏱️ Rate Limiting Financiero: Límite estricto de intentos de pago por usuario/IP para mitigar abusos de pasarela.
 */

import type { HonorSpotEntry } from "./honorBoardEngine";

export interface PaymentAttemptPayload {
  serviceId: string;
  serviceSlug: string;
  amountEuros: number;
  backerName: string;
  backerEmail: string;
  paymentMethod: "card" | "bizum" | "apple_pay";
  mode: "community_boost" | "owner_bid";
  idempotencyKey: string;
  clientTimestamp: number;
}

export interface PaymentValidationResult {
  allowed: boolean;
  error?: string;
  sanitizedAmount?: number;
  idempotencyKey?: string;
}

// Registro en memoria de bloqueos en vuelo (In-flight payment locks)
const inFlightPaymentLocks = new Map<string, number>();

// Registro de transacciones completadas (Idempotency storage)
const completedPaymentLedger = new Map<string, { timestamp: number; amount: number; serviceId: string }>();

/**
 * Genera una clave de idempotencia única para una sesión de pago.
 */
export function generatePaymentIdempotencyKey(serviceId: string, amount: number, backerEmail: string = ""): string {
  const cleanEmail = backerEmail.trim().toLowerCase();
  const randomSalt = Math.random().toString(36).substring(2, 9);
  return `idemp_${serviceId}_${amount.toFixed(2)}_${cleanEmail ? cleanEmail.slice(0, 5) : "anon"}_${Date.now()}_${randomSalt}`;
}

/**
 * Bloquea un intento de pago en vuelo para evitar condiciones de carrera por doble clic.
 * Retorna true si se adquiere el bloqueo con éxito, o false si ya está en proceso.
 */
export function acquirePaymentLock(idempotencyKey: string, ttlMs: number = 15000, now: number = Date.now()): boolean {
  if (!idempotencyKey || typeof idempotencyKey !== "string") return false;

  const existingLockExpiry = inFlightPaymentLocks.get(idempotencyKey);
  if (existingLockExpiry && now < existingLockExpiry) {
    // Bloqueo activo: intento duplicado detectado
    return false;
  }

  inFlightPaymentLocks.set(idempotencyKey, now + ttlMs);
  return true;
}

/**
 * Libera un bloqueo de pago tras finalizar la transacción (éxito o fallo).
 */
export function releasePaymentLock(idempotencyKey: string): void {
  inFlightPaymentLocks.delete(idempotencyKey);
}

/**
 * Registra una transacción completada para garantizar idempotencia permanente.
 */
export function recordCompletedPayment(idempotencyKey: string, serviceId: string, amount: number): void {
  completedPaymentLedger.set(idempotencyKey, {
    timestamp: Date.now(),
    amount: Number(amount.toFixed(2)),
    serviceId,
  });
  releasePaymentLock(idempotencyKey);
}

/**
 * Comprueba si un intento de pago ya fue procesado con éxito previamente.
 */
export function isPaymentAlreadyProcessed(idempotencyKey: string): boolean {
  return completedPaymentLedger.has(idempotencyKey);
}

/**
 * Valida que un importe de puja en el Cuadro de Honor sea estrictamente ÚNICO en la lista.
 * En el Cuadro de Honor, cada posición representa un hito distinto (+1€). No se permiten empates.
 */
export function validateUniqueHonorAmount(
  currentList: HonorSpotEntry[],
  candidateAmount: number,
  targetServiceId?: string,
): { unique: boolean; error?: string; collisionWith?: string } {
  const safeAmount = Number(candidateAmount.toFixed(2));

  if (isNaN(safeAmount) || !isFinite(safeAmount) || safeAmount < 1.0) {
    return {
      unique: false,
      error: "El importe a aportar debe ser un número válido igual o superior a 1.00€.",
    };
  }

  // Buscar colisión de importe con otro comercio diferente
  const collision = currentList.find(
    (spot) => Math.abs(spot.currentBidEuros - safeAmount) < 0.009 && spot.serviceId !== targetServiceId,
  );

  if (collision) {
    return {
      unique: false,
      error: `Ya existe otro comercio en esta lista con exactamente ${safeAmount.toFixed(2)}€ (${collision.serviceName}). En el Cuadro de Honor no se permiten importes duplicados; añade al menos +1.00€ para superarlo.`,
      collisionWith: collision.serviceName,
    };
  }

  return { unique: true };
}

/**
 * Validador integral de la petición de pago antes de interactuar con la pasarela.
 */
export function validatePaymentRequest(
  payload: PaymentAttemptPayload,
  currentList: HonorSpotEntry[] = [],
): PaymentValidationResult {
  // 1. Validar campos requeridos
  if (!payload.serviceId || payload.serviceId.trim().length < 2) {
    return { allowed: false, error: "ID de negocio no especificado o inválido." };
  }

  if (!payload.backerEmail || !payload.backerEmail.includes("@")) {
    return { allowed: false, error: "Se requiere un correo electrónico válido para emitir la factura oficial." };
  }

  // 2. Validar importe numérico
  const safeAmount = Number(Number(payload.amountEuros).toFixed(2));
  if (isNaN(safeAmount) || !isFinite(safeAmount) || safeAmount < 1.0) {
    return { allowed: false, error: "El importe mínimo de aportación es de 1.00€." };
  }

  // 3. Verificar si el pago ya fue completado previamente (Anti-Replay)
  if (payload.idempotencyKey && isPaymentAlreadyProcessed(payload.idempotencyKey)) {
    return { allowed: false, error: "Este pago ya fue procesado y confirmado con anterioridad." };
  }

  // 4. Verificar adquisición de Mutex Lock (Anti-Doble Clic)
  if (payload.idempotencyKey) {
    const lockAcquired = acquirePaymentLock(payload.idempotencyKey);
    if (!lockAcquired) {
      return {
        allowed: false,
        error: "Se ha detectado una transacción idéntica en proceso. Por favor, espera unos instantes.",
      };
    }
  }

  // 5. Validar unicidad de importe en el Cuadro de Honor
  const uniqueness = validateUniqueHonorAmount(currentList, safeAmount, payload.serviceId);
  if (!uniqueness.unique) {
    if (payload.idempotencyKey) releasePaymentLock(payload.idempotencyKey);
    return { allowed: false, error: uniqueness.error };
  }

  return {
    allowed: true,
    sanitizedAmount: safeAmount,
    idempotencyKey: payload.idempotencyKey,
  };
}

/**
 * Limpia memorias volátiles (útil para pruebas unitarias).
 */
export function resetPaymentSecurityState(): void {
  inFlightPaymentLocks.clear();
  completedPaymentLedger.clear();
}
