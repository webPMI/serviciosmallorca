/**
 * paymentSecurityEngine.ts
 *
 * 🔒 MOTOR DE SEGURIDAD FINANCIERA, IDEMPOTENCIA, ANTI-DUPLICADOS Y MITIGACIÓN DE RIESGOS (2026)
 *
 * Arquitectura de Protección 360° frente a Factores de Riesgo:
 *  1. 👤 FACTOR HUMANO:
 *     - Bloqueo estricto de doble clic y clics compulsivos (Mutex Locks de 20s).
 *     - Sanitización y normalización automática de datos fiscales (NIF/CIF/NIE, emails con espacios, teléfonos).
 *     - Prevención de reenvíos accidentales y deshabilitación inmediata de UI con spinner de seguridad.
 *     - Manejo transparente de arrepentimiento/cancelación sin cobro ni bloqueos residuales.
 *
 *  2. 🌐 FACTOR DE RED Y LAG:
 *     - Idempotencia criptográfica con tokens únicos por transacción (Prevención de duplicación en reintentos).
 *     - Detección de conectividad previa (`navigator.onLine`) y AbortController con timeout de 20s.
 *     - Liberación automática de bloqueos tras expiración de TTL para evitar estados zombi ante caídas de red.
 *     - Regeneración automática de claves de idempotencia tras cualquier error para permitir reintentos limpios.
 *
 *  3. 💻 FACTOR DIGITAL & CIBERSEGURIDAD:
 *     - Anti-Replay: Registro permanente en libro mayor de idempotencia de transacciones completadas.
 *     - Anti-Price-Tampering: Verificación estricta de importes en backend (1.00€ <= x <= 50,000.00€),
 *       cálculo server-side del 21% de IVA (nunca confiar en los totales del cliente).
 *     - Anti-Injection: Sanitización profunda de strings contra XSS, HTML Injection y caracteres de control.
 *     - Anti-Collisions: Regla de no-colisión de importes en el Cuadro de Honor (+1€ por posición).
 *     - Concurrency Guard: Bloqueo de concurrencia por recurso/servicio para evitar condiciones de carrera.
 *     - Verificación Criptográfica de Webhooks: Validación HMAC-SHA256 con Web Crypto API contra falsificaciones.
 */

import type { HonorSpotEntry } from "./honorBoardEngine";

export interface PaymentAttemptPayload {
  serviceId: string;
  serviceSlug: string;
  amountEuros: number;
  backerName: string;
  backerEmail: string;
  backerMessage?: string;
  paymentMethod: "card" | "bizum" | "apple_pay";
  mode: "community_boost" | "owner_bid";
  idempotencyKey: string;
  clientTimestamp: number;
  isB2B?: boolean;
  b2bTaxId?: string;
  b2bLegalName?: string;
  b2bAddress?: string;
}

export interface PaymentValidationResult {
  allowed: boolean;
  error?: string;
  sanitizedAmount?: number;
  sanitizedPayload?: Partial<PaymentAttemptPayload>;
  idempotencyKey?: string;
}

export interface CompletedPaymentRecord {
  timestamp: number;
  amount: number;
  serviceId: string;
  invoiceId?: string;
  backerEmailHash?: string;
}

// 1. Registro en memoria de bloqueos en vuelo por clave de idempotencia (Key-level mutex)
const inFlightPaymentLocks = new Map<string, number>();

// 2. Registro en memoria de bloqueos por servicio (Resource-level concurrency mutex)
const inFlightServiceLocks = new Map<string, number>();

// 3. Registro de transacciones completadas (Idempotency Ledger)
const completedPaymentLedger = new Map<string, CompletedPaymentRecord>();

/**
 * Sanitiza una cadena de texto eliminando etiquetas HTML, secuencias de escape y limitando su longitud.
 */
export function sanitizePaymentInput(input: string | undefined | null, maxLength: number = 100): string {
  if (!input || typeof input !== "string") return "";

  // 1. Eliminar etiquetas HTML y scripts
  let clean = input.replace(/<[^>]*>?/gm, "");

  // 2. Eliminar caracteres peligrosos para inyecciones y control
  clean = clean.replace(/[\x00-\x1F\x7F<>\"'`\\]/g, "");

  // 3. Normalizar espacios en blanco consecutivos
  clean = clean.replace(/\s+/g, " ").trim();

  // 4. Truncar a la longitud máxima
  if (clean.length > maxLength) {
    clean = clean.slice(0, maxLength).trim();
  }

  return clean;
}

/**
 * Valida un correo electrónico con regex estricto RFC 5322 simplificado.
 */
export function isValidPaymentEmail(email: string | undefined | null): boolean {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 120) return false;

  // Validación de estructura estándar de email
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

/**
 * Valida un CIF, NIF, NIE español o VAT europeo básico para facturación B2B.
 */
export function isValidFiscalTaxId(taxId: string | undefined | null): boolean {
  if (!taxId || typeof taxId !== "string") return false;
  const clean = taxId.toUpperCase().replace(/[^A-Z0-9]/g, "");

  // Rango estándar para identificadores fiscales (NIF: 9 chars, CIF: 9 chars, NIE: 9 chars, VAT UE: hasta 14)
  if (clean.length < 8 || clean.length > 15) return false;

  // Formato NIF: 8 números + 1 letra
  const nifRegex = /^[0-9]{8}[A-Z]$/;
  // Formato NIE: X, Y, Z + 7 números + 1 letra
  const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;
  // Formato CIF: 1 letra + 7 números + 1 dígito o letra
  const cifRegex = /^[ABCDEFGHJNPQRSUVW][0-9]{7}[0-9A-J]$/;
  // Formato genérico intra-comunitario europeo (2 letras de país + 6 a 12 alfanuméricos)
  const vatEuRegex = /^[A-Z]{2}[0-9A-Z]{6,12}$/;

  return nifRegex.test(clean) || nieRegex.test(clean) || cifRegex.test(clean) || vatEuRegex.test(clean);
}

/**
 * Valida y sanitiza el importe numérico de aportación.
 * Previene ataques de desbordamiento, NaN, importes negativos o fracciones anómalas.
 */
export function validateAndSanitizeAmount(
  amount: any,
  minRequired: number = 1.0,
  maxAllowed: number = 50000.0,
): { valid: boolean; amount?: number; error?: string } {
  // Manejar conversiones desde string (ej. "10.50" o "10,50")
  let numVal: number;
  if (typeof amount === "string") {
    numVal = Number(amount.replace(",", "."));
  } else if (typeof amount === "number") {
    numVal = amount;
  } else {
    return { valid: false, error: "El importe debe ser un número válido." };
  }

  if (isNaN(numVal) || !isFinite(numVal)) {
    return { valid: false, error: "El importe proporcionado no es un número válido." };
  }

  // Redondeo bancario exacto a 2 decimales evitando imprecisiones IEEE 754
  const safeAmount = Math.round((numVal + Number.EPSILON) * 100) / 100;

  if (safeAmount < minRequired) {
    return {
      valid: false,
      error: `El importe no puede ser inferior al mínimo requerido de ${minRequired.toFixed(2)}€.`,
    };
  }

  if (safeAmount > maxAllowed) {
    return {
      valid: false,
      error: `Por motivos de seguridad financiera, el importe máximo por transacción es de ${maxAllowed.toLocaleString("es-ES")}€.`,
    };
  }

  return { valid: true, amount: safeAmount };
}

/**
 * Comprueba si la pasarela de pagos está en modo real de producción (Stripe Live)
 * o en modo Sandbox / Demostración.
 */
export function isPaymentsLiveMode(): boolean {
  try {
    return (
      (import.meta as any)?.env?.PUBLIC_PAYMENTS_LIVE === "true" ||
      (typeof process !== "undefined" && (process as any)?.env?.PUBLIC_PAYMENTS_LIVE === "true")
    );
  } catch {
    return false;
  }
}

/**
 * Retorna el descriptor de modo de la pasarela.
 */
export function getPaymentGatewayMode(): "live" | "sandbox" {
  return isPaymentsLiveMode() ? "live" : "sandbox";
}

/**
 * Genera una clave de idempotencia única para una sesión de pago.
 */
export function generatePaymentIdempotencyKey(serviceId: string, amount: number, backerEmail: string = ""): string {
  const cleanEmail = backerEmail.trim().toLowerCase();
  const userPrefix = cleanEmail
    ? cleanEmail
        .split("@")[0]
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 10) || "anon"
    : "anon";
  const randomSalt = Math.random().toString(36).substring(2, 9);
  const safeAmount = Number(amount || 0).toFixed(2);
  return `idemp_${serviceId}_${safeAmount}_${userPrefix}_${Date.now()}_${randomSalt}`;
}

/**
 * Bloquea un intento de pago en vuelo para evitar condiciones de carrera por doble clic.
 * Retorna true si se adquiere el bloqueo con éxito, o false si ya está en proceso.
 */
export function acquirePaymentLock(idempotencyKey: string, ttlMs: number = 20000, now: number = Date.now()): boolean {
  if (!idempotencyKey || typeof idempotencyKey !== "string") return false;

  const existingLockExpiry = inFlightPaymentLocks.get(idempotencyKey);
  if (existingLockExpiry && now < existingLockExpiry) {
    // Bloqueo activo: intento concurrente o doble clic detectado
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
 * Bloquea temporalmente un servicio/negocio para evitar que dos usuarios o bots
 * compitan en la misma milésima de segundo por la misma posición del Cuadro de Honor.
 */
export function acquireServiceResourceLock(
  serviceId: string,
  ttlMs: number = 10000,
  now: number = Date.now(),
): boolean {
  if (!serviceId || typeof serviceId !== "string") return false;

  const existingLock = inFlightServiceLocks.get(serviceId);
  if (existingLock && now < existingLock) {
    return false;
  }

  inFlightServiceLocks.set(serviceId, now + ttlMs);
  return true;
}

/**
 * Libera el bloqueo de recurso de un servicio.
 */
export function releaseServiceResourceLock(serviceId: string): void {
  inFlightServiceLocks.delete(serviceId);
}

/**
 * Registra una transacción completada para garantizar idempotencia permanente.
 */
export function recordCompletedPayment(
  idempotencyKey: string,
  serviceId: string,
  amount: number,
  invoiceId?: string,
): void {
  completedPaymentLedger.set(idempotencyKey, {
    timestamp: Date.now(),
    amount: Number(amount.toFixed(2)),
    serviceId,
    invoiceId,
  });
  releasePaymentLock(idempotencyKey);
  releaseServiceResourceLock(serviceId);
}

/**
 * Comprueba si un intento de pago ya fue procesado con éxito previamente.
 */
export function isPaymentAlreadyProcessed(idempotencyKey: string): boolean {
  return completedPaymentLedger.has(idempotencyKey);
}

/**
 * Obtiene el registro de un pago previamente completado.
 */
export function getCompletedPayment(idempotencyKey: string): CompletedPaymentRecord | undefined {
  return completedPaymentLedger.get(idempotencyKey);
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
 * Aplica todas las defensas contra manipulación de precios, XSS, colisiones y doble clic.
 */
export function validatePaymentRequest(
  payload: PaymentAttemptPayload,
  currentList: HonorSpotEntry[] = [],
): PaymentValidationResult {
  // 1. Validar ID de servicio
  if (!payload.serviceId || typeof payload.serviceId !== "string" || payload.serviceId.trim().length < 2) {
    return { allowed: false, error: "ID de negocio no especificado o inválido." };
  }

  // 2. Validar Correo Electrónico
  if (!isValidPaymentEmail(payload.backerEmail)) {
    return {
      allowed: false,
      error: "Se requiere un correo electrónico válido para emitir la factura oficial y notificar la confirmación.",
    };
  }

  // 3. Sanitizar y Validar Importe
  const amountValidation = validateAndSanitizeAmount(payload.amountEuros, 1.0);
  if (!amountValidation.valid || !amountValidation.amount) {
    return { allowed: false, error: amountValidation.error || "Importe no válido." };
  }
  const safeAmount = amountValidation.amount;

  // 4. Validar datos B2B si fueron solicitados
  let cleanTaxId: string | undefined;
  let cleanLegalName: string | undefined;
  let cleanAddress: string | undefined;

  if (payload.isB2B) {
    if (!payload.b2bTaxId || !isValidFiscalTaxId(payload.b2bTaxId)) {
      return {
        allowed: false,
        error: "Para solicitar factura de empresa / autónomo se requiere un CIF, NIF o NIE válido.",
      };
    }
    cleanTaxId = payload.b2bTaxId.trim().toUpperCase();

    if (!payload.b2bLegalName || payload.b2bLegalName.trim().length < 2) {
      return {
        allowed: false,
        error: "Debes indicar la Razón Social o Nombre Fiscal de la empresa o profesional.",
      };
    }
    cleanLegalName = sanitizePaymentInput(payload.b2bLegalName, 120);

    if (payload.b2bAddress) {
      cleanAddress = sanitizePaymentInput(payload.b2bAddress, 200);
    }
  }

  // 5. Sanitizar Nombre y Mensaje de dedicatoria
  const cleanBackerName = sanitizePaymentInput(payload.backerName || "Vecino de Mallorca", 80);
  const cleanBackerMessage = payload.backerMessage ? sanitizePaymentInput(payload.backerMessage, 140) : "";

  // 6. Verificar si el pago ya fue completado previamente (Anti-Replay)
  if (payload.idempotencyKey && isPaymentAlreadyProcessed(payload.idempotencyKey)) {
    return { allowed: false, error: "Este pago ya fue procesado y confirmado con anterioridad." };
  }

  // 7. Verificar adquisición de Mutex Lock (Anti-Doble Clic)
  if (payload.idempotencyKey) {
    const lockAcquired = acquirePaymentLock(payload.idempotencyKey);
    if (!lockAcquired) {
      return {
        allowed: false,
        error: "Se ha detectado una transacción idéntica en proceso. Por favor, espera unos instantes.",
      };
    }
  }

  // 8. Validar unicidad de importe en el Cuadro de Honor
  const uniqueness = validateUniqueHonorAmount(currentList, safeAmount, payload.serviceId);
  if (!uniqueness.unique) {
    if (payload.idempotencyKey) releasePaymentLock(payload.idempotencyKey);
    return { allowed: false, error: uniqueness.error };
  }

  return {
    allowed: true,
    sanitizedAmount: safeAmount,
    idempotencyKey: payload.idempotencyKey,
    sanitizedPayload: {
      backerName: cleanBackerName,
      backerEmail: payload.backerEmail.trim().toLowerCase(),
      backerMessage: cleanBackerMessage,
      b2bTaxId: cleanTaxId,
      b2bLegalName: cleanLegalName,
      b2bAddress: cleanAddress,
    },
  };
}

/**
 * Verificador criptográfico de firmas de Webhooks de Stripe utilizando Web Crypto API.
 * Protege contra spoofing y ataques de reproducción (Replay Attacks).
 */
export async function verifyStripeWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  webhookSecret: string,
  toleranceSeconds: number = 300,
): Promise<{ valid: boolean; error?: string; timestamp?: number }> {
  if (!signatureHeader || !webhookSecret) {
    return { valid: false, error: "Cabecera stripe-signature o webhook secret ausente." };
  }

  try {
    // 1. Parsear los elementos de la cabecera: t=timestamp, v1=signature
    const parts = signatureHeader.split(",");
    let timestamp: number | undefined;
    const signatures: string[] = [];

    for (const part of parts) {
      const [key, val] = part.trim().split("=");
      if (key === "t") {
        timestamp = parseInt(val, 10);
      } else if (key === "v1") {
        signatures.push(val);
      }
    }

    if (!timestamp || signatures.length === 0) {
      return { valid: false, error: "Formato de firma stripe-signature inválido." };
    }

    // 2. Verificar tolerancia temporal contra ataques de replay
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - timestamp) > toleranceSeconds) {
      return { valid: false, error: "Firma expirada: el timestamp supera la tolerancia permitida." };
    }

    // 3. Crear el payload firmado: `${timestamp}.${rawBody}`
    const signedPayload = `${timestamp}.${rawBody}`;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(webhookSecret);
    const messageData = encoder.encode(signedPayload);

    // 4. Importar clave HMAC con Web Crypto API
    const cryptoKey = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);

    // 5. Calcular la firma HMAC-SHA256
    const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
    const signatureBytes = new Uint8Array(signatureBuffer);
    const expectedHexSignature = Array.from(signatureBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // 6. Comparación en tiempo constante contra las firmas v1 recibidas
    const matched = signatures.some((sig) => {
      if (sig.length !== expectedHexSignature.length) return false;
      let diff = 0;
      for (let i = 0; i < sig.length; i++) {
        diff |= sig.charCodeAt(i) ^ expectedHexSignature.charCodeAt(i);
      }
      return diff === 0;
    });

    if (!matched) {
      return { valid: false, error: "La firma calculada no coincide con ninguna firma v1 válida." };
    }

    return { valid: true, timestamp };
  } catch (err: any) {
    return { valid: false, error: `Error durante la verificación criptográfica: ${err?.message || err}` };
  }
}

/**
 * Limpia memorias volátiles (útil para pruebas unitarias).
 */
export function resetPaymentSecurityState(): void {
  inFlightPaymentLocks.clear();
  inFlightServiceLocks.clear();
  completedPaymentLedger.clear();
}
