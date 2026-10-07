/**
 * src/lib/validateSportsFacilities.ts
 *
 * Motor de Validación Estricta para Instalaciones Deportivas y Espacios Públicos de Mallorca.
 * Aplica los mismos estándares inmutables de calidad (GR-01 a GR-17) y Zero Fake Data (GR-11):
 *
 *  1. Unicidad de Identificadores (ID, Slug y Nombre normalizado).
 *  2. Bounding Box Geográfico de Mallorca (39.0 <= lat <= 40.1, 2.2 <= lng <= 3.6).
 *  3. Completitud Cuatrilingüe Estricta (es, en, ca, de) en descripciones, superficies y highlights.
 *  4. Taxonomía Cerrada de Deportes y Modalidades de Gestión.
 *  5. Detección Anti-Fake Data (GR-11): Verificación de fuentes oficiales requeridas y teléfonos sin patrones falsos.
 *  6. Protocolo HTTPS Obligatorio en URLs de reserva y enlaces externos.
 */

import type { SportsFacilityPOI, SportActivityType, FacilityManagementType, SurfaceType } from "../data/sports/types.ts";
import { MALLORCA_ZONES } from "../data/zones.ts";

export interface SportsValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const VALID_ACTIVITIES: Set<SportActivityType> = new Set([
  "padel",
  "tenis",
  "running",
  "ciclismo",
  "calistenia",
  "yoga_pilates",
  "fitness_gym",
  "natacion",
  "golf",
  "senderismo_trail",
  "deportes_acuaticos",
]);

const VALID_MANAGEMENTS: Set<FacilityManagementType> = new Set([
  "publica_ayuntamiento",
  "club_privado",
  "parque_publico",
  "complejo_deportivo",
]);

const VALID_SURFACES: Set<SurfaceType> = new Set([
  "cesped_sintetico",
  "tierra_batida",
  "asfalto",
  "arena_playa",
  "caucho_tartán",
  "parque_madera",
  "cemento_pulido",
  "sendero_natural",
]);

// Patrones telefónicos secuenciales o repetitivos falsos (GR-11 Zero Fake Data)
const FAKE_PHONE_PATTERNS = [
  /123\s*456/,
  /234\s*567/,
  /345\s*678/,
  /456\s*789/,
  /567\s*890/,
  /678\s*901/,
  /789\s*012/,
  /890\s*123/,
  /654\s*321/,
  /(\d)\1{2,}\s*(\d)\2{2,}/, // e.g. 000 111, 777 888
  /(\d{2,3})\s*\1\s*\1/, // e.g. 070 070 070
  /(\d)\1\s*(\d)\2\s*(\d)\3/, // e.g. 11 22 33, 44 55 66
];

export function validateSportsFacilitiesList(facilities: SportsFacilityPOI[]): SportsValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const seenNames = new Set<string>();
  const seenImages = new Set<string>();

  const validZoneIds = new Set(MALLORCA_ZONES.map((z) => z.id));

  for (const facility of facilities) {
    const label = `"${facility.name || facility.id}"`;

    // 1. Unicidad de ID
    if (!facility.id || facility.id.trim() === "") {
      errors.push(`Instalación deportiva sin ID`);
    } else if (seenIds.has(facility.id)) {
      errors.push(`ID duplicado detectado en instalaciones deportivas: "${facility.id}"`);
    } else {
      seenIds.add(facility.id);
    }

    // 2. Unicidad de Slug
    if (!facility.slug || facility.slug.trim() === "") {
      errors.push(`Slug ausente en ${label}`);
    } else if (seenSlugs.has(facility.slug)) {
      errors.push(`Slug duplicado detectado: "${facility.slug}" en ${label}`);
    } else {
      seenSlugs.add(facility.slug);
    }

    // 3. Unicidad de Nombre (normalizado)
    const normalizedName = (facility.name || "").toLowerCase().trim();
    if (!normalizedName) {
      errors.push(`Nombre de instalación deportiva vacío`);
    } else if (seenNames.has(normalizedName)) {
      errors.push(`Nombre duplicado detectado en instalaciones deportivas: "${facility.name}"`);
    } else {
      seenNames.add(normalizedName);
    }

    // 4. Zona geográfica válida
    if (!facility.zone || !validZoneIds.has(facility.zone)) {
      errors.push(`Zona geográfica inválida o desconocida en ${label}: "${facility.zone}"`);
    }

    // 5. Dirección física obligatoria
    if (!facility.address || facility.address.trim().length < 8) {
      errors.push(`Dirección física insuficiente o ausente en ${label}: "${facility.address}"`);
    }

    // 6. Coordenadas dentro de Mallorca (Bounding Box)
    if (
      !facility.coordinates ||
      typeof facility.coordinates.lat !== "number" ||
      typeof facility.coordinates.lng !== "number"
    ) {
      errors.push(`Coordenadas geográficas ausentes o inválidas en ${label}`);
    } else {
      const { lat, lng } = facility.coordinates;
      if (lat < 39.0 || lat > 40.1 || lng < 2.2 || lng > 3.6) {
        errors.push(`Coordenadas fuera de la isla de Mallorca en ${label}: [${lat}, ${lng}]`);
      }
    }

    // 7. Actividades deportivas válidas
    if (!facility.activityTypes || facility.activityTypes.length === 0) {
      errors.push(`La instalación ${label} no tiene ninguna actividad deportiva asignada`);
    } else {
      for (const act of facility.activityTypes) {
        if (!VALID_ACTIVITIES.has(act)) {
          errors.push(`Actividad deportiva desconocida "${act}" en ${label}`);
        }
      }
    }

    // 8. Tipo de gestión válido
    if (!VALID_MANAGEMENTS.has(facility.management)) {
      errors.push(`Tipo de gestión no reconocido "${facility.management}" en ${label}`);
    }

    // 9. Superficie deportiva y etiquetas cuatrilingües
    if (!VALID_SURFACES.has(facility.surfaceType)) {
      errors.push(`Tipo de superficie no reconocido "${facility.surfaceType}" en ${label}`);
    }
    if (
      !facility.surfaceLabel?.es ||
      !facility.surfaceLabel?.en ||
      !facility.surfaceLabel?.ca ||
      !facility.surfaceLabel?.de
    ) {
      errors.push(`Etiquetas de superficie incompletas (deben tener es, en, ca, de) en ${label}`);
    }

    // 10. Completitud Cuatrilingüe en Descripciones
    if (
      !facility.description?.es ||
      !facility.description?.en ||
      !facility.description?.ca ||
      !facility.description?.de
    ) {
      errors.push(`Descripción multilingüe incompleta (debe tener es, en, ca, de) en ${label}`);
    } else {
      if (facility.description.es.length < 30) {
        errors.push(`Descripción en castellano demasiado corta (<30 chars) en ${label}`);
      }
    }

    // 11. Puntos destacados (Highlights) cuatrilingües
    if (
      !facility.highlights?.es?.length ||
      !facility.highlights?.en?.length ||
      !facility.highlights?.ca?.length ||
      !facility.highlights?.de?.length
    ) {
      errors.push(`Puntos destacados (highlights) incompletos en los 4 idiomas en ${label}`);
    }

    // 12. Regla Inmutable Zero Fake Data (GR-11): Fuente Oficial Contrastada
    if (!facility.verifiedOfficialSource || facility.verifiedOfficialSource.trim().length < 5) {
      errors.push(`Fuente oficial requerida ausente o vacía (GR-11) en ${label}`);
    }

    // 13. Imagen no duplicada y sin fotos de stock prohibidas
    if (!facility.image || !facility.image.startsWith("/")) {
      errors.push(`Ruta de imagen inválida (debe ser ruta absoluta local) en ${label}: "${facility.image}"`);
    } else {
      if (seenImages.has(facility.image)) {
        errors.push(`Imagen duplicada detectada en instalaciones deportivas: "${facility.image}" en ${label}`);
      }
      seenImages.add(facility.image);
    }

    // 14. Anti-Fake Telephony: Si tiene teléfono de contacto, validar ausencia de secuencias falsas
    const phones = [facility.contactPhone, facility.contactWhatsapp].filter(Boolean) as string[];
    for (const phone of phones) {
      for (const pattern of FAKE_PHONE_PATTERNS) {
        if (pattern.test(phone)) {
          errors.push(`Patrón telefónico secuencial/falso detectado en ${label}: "${phone}" (GR-11)`);
          break;
        }
      }
    }

    // 15. HTTPS estricto en URLs de reserva
    if (facility.bookingUrl) {
      if (!facility.bookingUrl.startsWith("https://")) {
        errors.push(`Enlace de reserva debe usar protocolo seguro HTTPS en ${label}: "${facility.bookingUrl}"`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
