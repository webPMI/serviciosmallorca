/**
 * src/lib/whatsappUtils.ts
 *
 * Validador y normalizador de canales de WhatsApp para Servicios Mallorca.
 * Garantiza que los enlaces wa.me solo se dirijan a teléfonos móviles reales (6xx / 7xx en España)
 * o internacionales válidos, previniendo errores al intentar abrir WhatsApp con líneas fijas (971 / 871).
 */

export function isValidWhatsAppNumber(raw?: string | null): boolean {
  if (!raw) return false;
  const clean = raw.replace(/[^0-9]/g, "");
  if (!clean || clean.length < 9) return false;

  // Teléfonos fijos de España: prefijos 9xx u 8xx (ej: 971, 871 en Baleares)
  // Las líneas fijas no disponen de mensajería WhatsApp por defecto.
  if (
    clean.startsWith("349") ||
    clean.startsWith("348") ||
    clean.startsWith("00349") ||
    clean.startsWith("00348") ||
    ((clean.startsWith("9") || clean.startsWith("8")) && clean.length === 9)
  ) {
    return false;
  }

  // Teléfonos móviles en España: 9 dígitos empezando por 6 o 7, o con prefijo 34
  if (
    clean.startsWith("346") ||
    clean.startsWith("347") ||
    clean.startsWith("00346") ||
    clean.startsWith("00347") ||
    ((clean.startsWith("6") || clean.startsWith("7")) && clean.length === 9)
  ) {
    return true;
  }

  // Números móviles internacionales válidos (entre 10 y 15 dígitos)
  if (clean.length >= 10 && clean.length <= 15) {
    return true;
  }

  return false;
}

export function formatWhatsAppLink(raw?: string | null, text?: string): string | null {
  if (!raw || !isValidWhatsAppNumber(raw)) return null;
  let clean = raw.replace(/[^0-9]/g, "");

  // Si tiene 00 al principio (0034...), convertir a 34...
  if (clean.startsWith("00")) {
    clean = clean.slice(2);
  }

  // Si es móvil español estándar de 9 dígitos (6xx / 7xx), anteponer 34
  if (clean.length === 9 && /^[67]/.test(clean)) {
    clean = "34" + clean;
  }

  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${clean}${query}`;
}
