/**
 * ownershipValidation.ts
 *
 * Motor Unificado de Validación y Sanitización para Titularidad, Reclamaciones,
 * Altas de Negocio y Modificaciones de Manager (GR-03, GR-11, GR-13).
 *
 * Centraliza la validación para eliminar código duplicado y expresiones regulares
 * dispersas en componentes y scripts del cliente.
 */

import { validateSpanishTaxId, validateBalearicPhone, isDisposableEmail } from "./managerSecurityEngine";
import type { ServiceStatus } from "../data/services/types";

export const VALID_SERVICE_STATUSES: readonly ServiceStatus[] = [
  "open",
  "seasonal_closure",
  "permanently_closed",
  "incomplete_admin_only",
] as const;

/**
 * Convierte un nombre de negocio o texto a un slug canónico URL-friendly.
 */
export function slugify(text: string): string {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Sanitiza texto eliminando etiquetas HTML, caracteres de control y acotando longitud.
 */
export function sanitizeText(text: unknown, maxLength = 500): string {
  if (typeof text !== "string") return "";
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
    .trim()
    .slice(0, maxLength);
}

/**
 * Valida un teléfono comercial o móvil con soporte para formato balear (+34 971 / 871 / 6xx / 7xx).
 */
export function validatePhoneInput(phone: string): { valid: boolean; error?: string } {
  const clean = sanitizeText(phone, 30);
  if (!clean || clean.length < 8) {
    return { valid: false, error: "El teléfono debe contener al menos 8 dígitos." };
  }
  if (!validateBalearicPhone(clean)) {
    // Si no es un formato estricto balear, comprobar si al menos es un formato numérico con prefijo válido
    const genericPhoneRegex = /^\+?[0-9\s().-]{8,20}$/;
    if (!genericPhoneRegex.test(clean)) {
      return { valid: false, error: "Formato de teléfono no válido. Usa prefijo (+34) o número local de 9 cifras." };
    }
  }
  return { valid: true };
}

/**
 * Valida una URL asegurando protocolo seguro HTTPS obligatorio (GR-13).
 */
export function validateHttpsUrl(url: string): { valid: boolean; error?: string } {
  const clean = sanitizeText(url, 255);
  if (!clean) return { valid: false, error: "La URL no puede estar vacía." };
  if (clean.startsWith("http://")) {
    return { valid: false, error: "Protocolo inseguro: se requiere 'https://' (GR-13)." };
  }
  try {
    const parsed = new URL(clean);
    if (parsed.protocol !== "https:") {
      return { valid: false, error: "La URL debe comenzar estrictamente con 'https://'." };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: "Formato de URL no válido." };
  }
}

/**
 * Valida un correo electrónico corporativo o personal, rechazando correos desechables.
 */
export function validateEmailInput(email: string): { valid: boolean; error?: string } {
  const clean = sanitizeText(email, 120).toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(clean)) {
    return { valid: false, error: "Formato de correo electrónico no válido." };
  }
  if (isDisposableEmail(clean)) {
    return { valid: false, error: "No se admiten correos electrónicos temporales o desechables." };
  }
  return { valid: true };
}

/**
 * Valida el estado operativo de un negocio contra los valores permitidos del catálogo.
 */
export function isValidServiceStatus(status: unknown): status is ServiceStatus {
  return typeof status === "string" && (VALID_SERVICE_STATUSES as readonly string[]).includes(status);
}

/**
 * Valida un NIF/CIF o URL de comprobación documental para solicitudes de titularidad.
 */
export function validateTaxIdOrDocument(proof: string): { valid: boolean; isUrl: boolean; error?: string } {
  const clean = sanitizeText(proof, 255);
  if (!clean || clean.length < 3) {
    return { valid: false, isUrl: false, error: "Acredita tu titularidad con CIF/NIF o URL a documento oficial." };
  }
  if (/^https:\/\//i.test(clean)) {
    const urlCheck = validateHttpsUrl(clean);
    return { valid: urlCheck.valid, isUrl: true, error: urlCheck.error };
  }
  if (validateSpanishTaxId(clean)) {
    return { valid: true, isUrl: false };
  }
  // Tolera formato inicial de CIF si tiene caracteres válidos aunque sea en revisión manual
  if (/^[A-Z0-9-]{7,12}$/i.test(clean)) {
    return { valid: true, isUrl: false };
  }
  return { valid: false, isUrl: false, error: "NIF/CIF no válido o enlace documental sin HTTPS." };
}

/**
 * Payload validado para crear una propuesta de negocio nuevo (Vía B).
 */
export interface ValidatedSubmissionInput {
  name: string;
  category: string;
  zone: string;
  address: string;
  phone: string;
  website: string;
  description: string;
}

export function validateSubmissionForm(data: Record<string, unknown>): {
  valid: boolean;
  errors: string[];
  sanitized?: ValidatedSubmissionInput;
} {
  const errors: string[] = [];
  const name = sanitizeText(data.name, 100);
  const category = sanitizeText(data.category, 60);
  const zone = sanitizeText(data.zone, 60);
  const address = sanitizeText(data.address, 200);
  const phone = sanitizeText(data.phone, 30);
  const website = sanitizeText(data.website, 255);
  const description = sanitizeText(data.description, 2000);

  if (name.length < 2) errors.push("El nombre comercial debe tener al menos 2 caracteres.");
  if (!category) errors.push("Debes seleccionar una categoría del catálogo.");
  if (!zone) errors.push("Debes seleccionar la zona o municipio de Mallorca.");
  if (address.length < 5) errors.push("La dirección debe tener al menos 5 caracteres.");

  const phoneRes = validatePhoneInput(phone);
  if (!phoneRes.valid && phoneRes.error) errors.push(phoneRes.error);

  if (website) {
    const webRes = validateHttpsUrl(website);
    if (!webRes.valid && webRes.error) errors.push(webRes.error);
  }

  if (description.length < 15) {
    errors.push("La descripción del negocio debe tener al menos 15 caracteres.");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    sanitized: {
      name,
      category,
      zone,
      address,
      phone,
      website: website || "",
      description,
    },
  };
}
