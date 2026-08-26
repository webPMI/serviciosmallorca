/**
 * src/lib/scheduleParser.ts
 *
 * Analizador y validador de horarios en tiempo real para negocios de Mallorca.
 * Determina el estado actual (Abierto, Cierra pronto, Cerrado) e indica de forma
 * inteligente cuándo vuelve a abrir el establecimiento (Next-Opening Time).
 */

import type { Locale } from "../i18n";

export interface LiveStatusResult {
  isOpen: boolean;
  statusText: string;
  statusClass: "open" | "closed" | "seasonal" | "closing_soon";
  details: string;
  disclaimer: string;
  nextOpening?: {
    type: "today" | "tomorrow" | "monday" | "custom";
    timeStr: string;
    formattedText: string;
  };
}

export const SCHEDULE_DISCLAIMER =
  "Horario orientativo según registro oficial. En festivos, vacaciones o imprevistos puede variar. Recomendamos confirmar por teléfono o WhatsApp antes de acudir.";

interface TimeRange {
  startMin: number;
  endMin: number;
  startStr: string;
  endStr: string;
}

/**
 * Extrae todos los rangos horarios de un texto (ej: "10:00 - 14:00, 17:00 - 21:00").
 */
function parseTimeRanges(scheduleText: string): TimeRange[] {
  const ranges: TimeRange[] = [];
  const regex = /(\d{1,2})[:.](\d{2})\s*(?:-|a|–)\s*(\d{1,2})[:.](\d{2})/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(scheduleText)) !== null) {
    const startHour = parseInt(match[1], 10);
    const startMinVal = parseInt(match[2], 10);
    const endHour = parseInt(match[3], 10);
    const endMinVal = parseInt(match[4], 10);

    const startMin = startHour * 60 + startMinVal;
    const endMin = endHour * 60 + endMinVal;

    const startStr = `${startHour.toString().padStart(2, "0")}:${startMinVal.toString().padStart(2, "0")}`;
    const endStr = `${endHour.toString().padStart(2, "0")}:${endMinVal.toString().padStart(2, "0")}`;

    ranges.push({ startMin, endMin, startStr, endStr });
  }

  return ranges;
}

/**
 * Formatea el texto de próxima apertura en el idioma solicitado.
 */
function formatNextOpening(type: "today" | "tomorrow" | "monday", timeStr: string, locale: Locale = "es"): string {
  switch (locale) {
    case "de":
      if (type === "today") return `Öffnet heute um ${timeStr} Uhr`;
      if (type === "tomorrow") return `Öffnet morgen um ${timeStr} Uhr`;
      return `Öffnet am Montag um ${timeStr} Uhr`;
    case "en":
      if (type === "today") return `Opens today at ${timeStr}`;
      if (type === "tomorrow") return `Opens tomorrow at ${timeStr}`;
      return `Opens Monday at ${timeStr}`;
    case "ca":
      if (type === "today") return `Obre avui a les ${timeStr}`;
      if (type === "tomorrow") return `Obre demà a les ${timeStr}`;
      return `Obre dilluns a les ${timeStr}`;
    case "es":
    default:
      if (type === "today") return `Abre hoy a las ${timeStr}`;
      if (type === "tomorrow") return `Abre mañana a las ${timeStr}`;
      return `Abre el lunes a las ${timeStr}`;
  }
}

/**
 * Evalúa si un negocio está abierto en este instante según su horario y zona horaria de Mallorca (Europe/Madrid)
 * y calcula con precisión la próxima hora de apertura cuando está cerrado.
 */
export function getLiveBusinessStatus(
  scheduleText?: string,
  serviceStatus: "open" | "seasonal_closure" | "permanently_closed" | "incomplete_admin_only" | undefined = "open",
  now: Date = new Date(),
  locale: Locale = "es",
): LiveStatusResult {
  if (serviceStatus === "permanently_closed") {
    const closedLabels = {
      es: "Permanentemente Cerrado",
      en: "Permanently Closed",
      ca: "Tancat Permanentment",
      de: "Dauerhaft geschlossen",
    };
    return {
      isOpen: false,
      statusText: closedLabels[locale] || closedLabels.es,
      statusClass: "closed",
      details: "Este establecimiento ha cesado su actividad.",
      disclaimer: SCHEDULE_DISCLAIMER,
    };
  }

  if (serviceStatus === "seasonal_closure") {
    const seasonalLabels = {
      es: "Cierre por Temporada / Vacaciones",
      en: "Seasonal Closure / Holiday",
      ca: "Tancat per Temporada / Vacances",
      de: "Saisonale Schließung / Urlaub",
    };
    return {
      isOpen: false,
      statusText: seasonalLabels[locale] || seasonalLabels.es,
      statusClass: "seasonal",
      details: "Cerrado temporalmente por fin de temporada o vacaciones.",
      disclaimer: SCHEDULE_DISCLAIMER,
    };
  }

  if (!scheduleText || scheduleText.trim() === "") {
    const consultLabels = {
      es: "Consultar Horario",
      en: "Check Schedule",
      ca: "Consultar Horari",
      de: "Öffnungszeiten erfragen",
    };
    return {
      isOpen: false,
      statusText: consultLabels[locale] || consultLabels.es,
      statusClass: "closed",
      details: "Horario no especificado.",
      disclaimer: SCHEDULE_DISCLAIMER,
    };
  }

  const raw = scheduleText.toLowerCase();

  // 24 Horas
  if (raw.includes("24 horas") || raw.includes("24h") || raw.includes("24/7")) {
    const open24Labels = {
      es: "Abierto 24 Horas",
      en: "Open 24 Hours",
      ca: "Obert 24 Hores",
      de: "Rund um die Uhr geöffnet",
    };
    return {
      isOpen: true,
      statusText: open24Labels[locale] || open24Labels.es,
      statusClass: "open",
      details: "Servicio ininterrumpido.",
      disclaimer: SCHEDULE_DISCLAIMER,
    };
  }

  // Obtener día de la semana y hora en horario de España (Europe/Madrid)
  const formatterDay = new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    weekday: "short",
  });
  const formatterHour = new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  const currentDayShort = formatterDay.format(now).toLowerCase(); // "lun.", "mar.", "dom.", etc.
  const [currentHourStr, currentMinStr] = formatterHour.format(now).split(":");
  const currentMinutesOfDay = parseInt(currentHourStr, 10) * 60 + parseInt(currentMinStr || "0", 10);

  const ranges = parseTimeRanges(scheduleText);
  const earliestStartStr = ranges.length > 0 ? ranges[0].startStr : "09:00";

  // Detección de días de cierre típicos
  const isSunday = currentDayShort.startsWith("dom") || currentDayShort.startsWith("sun");
  const isSaturday =
    currentDayShort.startsWith("sáb") || currentDayShort.startsWith("sab") || currentDayShort.startsWith("sat");

  // Caso: Domingo cerrado
  if (
    isSunday &&
    (raw.includes("lun - sáb") ||
      raw.includes("lun-sab") ||
      raw.includes("lunes a viernes") ||
      raw.includes("lun - vie") ||
      raw.includes("domingo cerrado") ||
      raw.includes("dom: cerrado"))
  ) {
    const nextOpeningText = formatNextOpening("monday", earliestStartStr, locale);
    const closedBase = {
      es: `Cerrado · ${nextOpeningText}`,
      en: `Closed · ${nextOpeningText}`,
      ca: `Tancat · ${nextOpeningText}`,
      de: `Geschlossen · ${nextOpeningText}`,
    };
    return {
      isOpen: false,
      statusText: closedBase[locale] || closedBase.es,
      statusClass: "closed",
      details: `Horario habitual: ${scheduleText}`,
      disclaimer: SCHEDULE_DISCLAIMER,
      nextOpening: {
        type: "monday",
        timeStr: earliestStartStr,
        formattedText: nextOpeningText,
      },
    };
  }

  // Caso: Sábado cerrado
  if (
    isSaturday &&
    (raw.includes("lunes a viernes") ||
      raw.includes("lun - vie") ||
      raw.includes("lun-vie") ||
      raw.includes("sáb: cerrado") ||
      raw.includes("sab: cerrado"))
  ) {
    const nextOpeningText = formatNextOpening("monday", earliestStartStr, locale);
    const closedBase = {
      es: `Cerrado · ${nextOpeningText}`,
      en: `Closed · ${nextOpeningText}`,
      ca: `Tancat · ${nextOpeningText}`,
      de: `Geschlossen · ${nextOpeningText}`,
    };
    return {
      isOpen: false,
      statusText: closedBase[locale] || closedBase.es,
      statusClass: "closed",
      details: `Horario habitual: ${scheduleText}`,
      disclaimer: SCHEDULE_DISCLAIMER,
      nextOpening: {
        type: "monday",
        timeStr: earliestStartStr,
        formattedText: nextOpeningText,
      },
    };
  }

  // Evaluación de rangos horarios del día
  if (ranges.length > 0) {
    let isOpenNow = false;
    let closingSoon = false;

    for (const range of ranges) {
      if (currentMinutesOfDay >= range.startMin && currentMinutesOfDay < range.endMin) {
        isOpenNow = true;
        if (range.endMin - currentMinutesOfDay <= 45) {
          closingSoon = true;
        }
        break;
      }
    }

    if (isOpenNow) {
      const openLabels = {
        es: closingSoon ? "Cierra pronto" : "Abierto ahora",
        en: closingSoon ? "Closing soon" : "Open now",
        ca: closingSoon ? "Tanca aviat" : "Obert ara",
        de: closingSoon ? "Schließt bald" : "Jetzt geöffnet",
      };
      return {
        isOpen: true,
        statusText: openLabels[locale] || openLabels.es,
        statusClass: closingSoon ? "closing_soon" : "open",
        details: `Horario habitual: ${scheduleText}`,
        disclaimer: SCHEDULE_DISCLAIMER,
      };
    }

    // Está cerrado en este momento. Calculamos cuándo abre a continuación:
    // 1. ¿Abre más tarde hoy? (ej. turno de tarde)
    const upcomingShiftToday = ranges.find((r) => r.startMin > currentMinutesOfDay);

    if (upcomingShiftToday) {
      const nextOpeningText = formatNextOpening("today", upcomingShiftToday.startStr, locale);
      const closedBase = {
        es: `Cerrado · ${nextOpeningText}`,
        en: `Closed · ${nextOpeningText}`,
        ca: `Tancat · ${nextOpeningText}`,
        de: `Geschlossen · ${nextOpeningText}`,
      };
      return {
        isOpen: false,
        statusText: closedBase[locale] || closedBase.es,
        statusClass: "closed",
        details: `Horario habitual: ${scheduleText}`,
        disclaimer: SCHEDULE_DISCLAIMER,
        nextOpening: {
          type: "today",
          timeStr: upcomingShiftToday.startStr,
          formattedText: nextOpeningText,
        },
      };
    }

    // 2. Ya terminaron los turnos de hoy. ¿Abre mañana o el lunes?
    const isNextDayMonday = isSaturday && (raw.includes("domingo cerrado") || raw.includes("dom: cerrado"));
    const openingType = isNextDayMonday ? "monday" : "tomorrow";
    const nextOpeningText = formatNextOpening(openingType, earliestStartStr, locale);

    const closedBase = {
      es: `Cerrado · ${nextOpeningText}`,
      en: `Closed · ${nextOpeningText}`,
      ca: `Tancat · ${nextOpeningText}`,
      de: `Geschlossen · ${nextOpeningText}`,
    };

    return {
      isOpen: false,
      statusText: closedBase[locale] || closedBase.es,
      statusClass: "closed",
      details: `Horario habitual: ${scheduleText}`,
      disclaimer: SCHEDULE_DISCLAIMER,
      nextOpening: {
        type: openingType,
        timeStr: earliestStartStr,
        formattedText: nextOpeningText,
      },
    };
  }

  // Fallback por defecto si no se pueden parsear horas exactas
  const defaultLabels = {
    es: "Abierto (Horario habitual)",
    en: "Open (Regular hours)",
    ca: "Obert (Horari habitual)",
    de: "Geöffnet (Reguläre Zeiten)",
  };

  return {
    isOpen: true,
    statusText: defaultLabels[locale] || defaultLabels.es,
    statusClass: "open",
    details: scheduleText,
    disclaimer: SCHEDULE_DISCLAIMER,
  };
}
