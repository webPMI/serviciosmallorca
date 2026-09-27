/**
 * directoryIntents.ts
 *
 * 🎯 Filtros de intención del directorio `/servicios` ("Abierto ahora", "Inglés/Alemán",
 * "Con terraza", "Pet friendly", "Accesible"), ejecutados **en el servidor**.
 *
 * Antes vivían duplicados: los `data-*` de cada tarjeta (SSR) y una heurística
 * `isBusinessCurrentlyOpen()` dentro del script inline de la página. Con la paginación
 * SSR el filtro debe decidir en el servidor (si no, filtraríamos solo 48 fichas de 953),
 * así que esta es la **única implementación** de la que dependen SSR, tests y UI.
 */
import type { ServiceItem } from "../data/services";

export type DirectoryIntent = "open-now" | "multilingual" | "terrace" | "pet-friendly" | "accessible";

export const DIRECTORY_INTENTS: readonly DirectoryIntent[] = [
  "open-now",
  "multilingual",
  "terrace",
  "pet-friendly",
  "accessible",
] as const;

/** Valida el parámetro `?intencion=` contra la lista blanca. */
export function parseIntentParam(raw: string | null | undefined): DirectoryIntent | null {
  const value = (raw ?? "").trim().toLowerCase();
  return (DIRECTORY_INTENTS as readonly string[]).includes(value) ? (value as DirectoryIntent) : null;
}

export function isMultilingual(service: ServiceItem): boolean {
  return Boolean(
    service.languagesSpoken?.some((l) => l === "en" || l === "de") ||
      service.culturalIdentity === "german_oriented" ||
      service.culturalIdentity === "british_oriented",
  );
}

export function hasTerrace(service: ServiceItem): boolean {
  return Boolean(service.capabilities?.terrace || service.amenities?.includes("terrace"));
}

export function isPetFriendly(service: ServiceItem): boolean {
  return Boolean(service.capabilities?.petFriendly || service.amenities?.includes("pet_friendly"));
}

export function isAccessible(service: ServiceItem): boolean {
  return Boolean(service.capabilities?.wheelchairAccessible || service.amenities?.includes("wheelchair_accessible"));
}

function scheduleText(service: ServiceItem): string {
  const schedule = service.schedule;
  return typeof schedule === "string" ? schedule : "";
}

/**
 * Heurística "abierto ahora" sobre el texto de horario (mismo criterio que la
 * versión previa en cliente: si no hay horas explícitas, se asume activo).
 */
export function isOpenNow(service: ServiceItem, now: Date = new Date()): boolean {
  const status = service.status;
  if (status === "permanently_closed" || status === "seasonal_closure") return false;

  const text = scheduleText(service);
  if (!text || text.trim() === "" || text === "[object Object]") return true;

  const raw = text.toLowerCase();
  if (raw.includes("24 horas") || raw.includes("24h") || raw.includes("24/7")) return true;

  const hourFormatter = new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
  const dayFormatter = new Intl.DateTimeFormat("es-ES", { timeZone: "Europe/Madrid", weekday: "short" });

  const dayLabel = dayFormatter.format(now).toLowerCase();
  const [hourPart, minutePart] = hourFormatter.format(now).split(":");
  const currentMinutes = Number.parseInt(hourPart, 10) * 60 + Number.parseInt(minutePart || "0", 10);

  const isSunday = dayLabel.startsWith("dom") || dayLabel.startsWith("sun");
  if (
    isSunday &&
    (raw.includes("lun - sáb") || raw.includes("lunes a viernes") || raw.includes("domingo cerrado") || raw.includes("dom: cerrado"))
  ) {
    return false;
  }

  const isSaturday = dayLabel.startsWith("sáb") || dayLabel.startsWith("sab") || dayLabel.startsWith("sat");
  if (isSaturday && (raw.includes("lunes a viernes") || raw.includes("lun - vie") || raw.includes("sáb: cerrado"))) {
    return false;
  }

  const rangeRegex = /(\d{1,2})[:.](\d{2})\s*(?:-|a|–)\s*(\d{1,2})[:.](\d{2})/g;
  let match: RegExpExecArray | null;
  let hasRanges = false;
  while ((match = rangeRegex.exec(text)) !== null) {
    hasRanges = true;
    const startMinutes = Number.parseInt(match[1], 10) * 60 + Number.parseInt(match[2], 10);
    const endMinutes = Number.parseInt(match[3], 10) * 60 + Number.parseInt(match[4], 10);
    if (currentMinutes >= startMinutes && currentMinutes < endMinutes) return true;
  }

  return !hasRanges;
}

/** ¿La ficha cumple la intención indicada? */
export function matchesIntent(service: ServiceItem, intent: DirectoryIntent, now: Date = new Date()): boolean {
  switch (intent) {
    case "open-now":
      return isOpenNow(service, now);
    case "multilingual":
      return isMultilingual(service);
    case "terrace":
      return hasTerrace(service);
    case "pet-friendly":
      return isPetFriendly(service);
    case "accessible":
      return isAccessible(service);
    default:
      return true;
  }
}

/** Aplica la intención al conjunto de fichas del directorio. */
export function filterByIntent(services: ServiceItem[], intent: DirectoryIntent | null, now: Date = new Date()): ServiceItem[] {
  if (!intent) return services;
  return services.filter((service) => matchesIntent(service, intent, now));
}
