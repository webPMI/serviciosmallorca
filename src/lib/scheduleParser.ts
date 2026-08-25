/**
 * src/lib/scheduleParser.ts
 *
 * Analizador y validador de horarios en tiempo real para negocios de Mallorca.
 * Determina el estado actual con aviso de verificación humana (festivos/vacaciones).
 */

export interface LiveStatusResult {
  isOpen: boolean;
  statusText: string;
  statusClass: "open" | "closed" | "seasonal" | "closing_soon";
  details: string;
  disclaimer: string;
}

export const SCHEDULE_DISCLAIMER =
  "Horario orientativo según registro oficial. En festivos, vacaciones o imprevistos puede variar. Recomendamos confirmar por teléfono o WhatsApp antes de acudir.";

/**
 * Evalúa si un negocio está abierto en este instante según su texto de horario y zona horaria de Mallorca (Europe/Madrid).
 */
export function getLiveBusinessStatus(
  scheduleText?: string,
  serviceStatus: "open" | "seasonal_closure" | "permanently_closed" = "open",
  now: Date = new Date(),
): LiveStatusResult {
  if (serviceStatus === "permanently_closed") {
    return {
      isOpen: false,
      statusText: "Permanentemente Cerrado",
      statusClass: "closed",
      details: "Este establecimiento ha cesado su actividad.",
      disclaimer: SCHEDULE_DISCLAIMER,
    };
  }

  if (serviceStatus === "seasonal_closure") {
    return {
      isOpen: false,
      statusText: "Cierre por Temporada / Vacaciones",
      statusClass: "seasonal",
      details: "Cerrado temporalmente por fin de temporada o vacaciones.",
      disclaimer: SCHEDULE_DISCLAIMER,
    };
  }

  if (!scheduleText || scheduleText.trim() === "") {
    return {
      isOpen: false,
      statusText: "Consultar Horario",
      statusClass: "closed",
      details: "Horario no especificado.",
      disclaimer: SCHEDULE_DISCLAIMER,
    };
  }

  const raw = scheduleText.toLowerCase();

  // 24 Horas
  if (raw.includes("24 horas") || raw.includes("24h") || raw.includes("24/7")) {
    return {
      isOpen: true,
      statusText: "Abierto 24 Horas",
      statusClass: "open",
      details: "Servicio ininterrumpido.",
      disclaimer: SCHEDULE_DISCLAIMER,
    };
  }

  // Obtener día de la semana en horario de España (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
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

  const currentDayShort = formatterDay.format(now).toLowerCase(); // ej. "lun.", "mar.", "dom."
  const [currentHourStr, currentMinStr] = formatterHour.format(now).split(":");
  const currentMinutesOfDay = parseInt(currentHourStr, 10) * 60 + parseInt(currentMinStr || "0", 10);

  // Extraer rangos horarios (ej. "10:00 - 20:00" o "10:00-14:00, 16:00-20:00")
  const timeRangesMatches = raw.match(/(\d{1,2})[:.](\d{2})\s*(?:-|a|–)\s*(\d{1,2})[:.](\d{2})/g);

  // Detección de días de cierre típicos (ej: "domingos cerrado", "lun-vie", etc.)
  const isSunday = currentDayShort.startsWith("dom") || currentDayShort.startsWith("sun");
  const isSaturday =
    currentDayShort.startsWith("sáb") || currentDayShort.startsWith("sab") || currentDayShort.startsWith("sat");

  if (
    isSunday &&
    (raw.includes("lun - sáb") ||
      raw.includes("lun-sab") ||
      raw.includes("lunes a viernes") ||
      raw.includes("domingo cerrado") ||
      raw.includes("dom: cerrado"))
  ) {
    return {
      isOpen: false,
      statusText: "Cerrado hoy (Domingo)",
      statusClass: "closed",
      details: `Horario habitual: ${scheduleText}`,
      disclaimer: SCHEDULE_DISCLAIMER,
    };
  }

  if (
    isSaturday &&
    (raw.includes("lunes a viernes") ||
      raw.includes("lun - vie") ||
      raw.includes("lun-vie") ||
      raw.includes("sáb: cerrado"))
  ) {
    return {
      isOpen: false,
      statusText: "Cerrado hoy (Fin de semana)",
      statusClass: "closed",
      details: `Horario habitual: ${scheduleText}`,
      disclaimer: SCHEDULE_DISCLAIMER,
    };
  }

  if (timeRangesMatches && timeRangesMatches.length > 0) {
    let isOpenNow = false;
    let closingSoon = false;

    for (const range of timeRangesMatches) {
      const parts = range.match(/(\d{1,2})[:.](\d{2})\s*(?:-|a|–)\s*(\d{1,2})[:.](\d{2})/);
      if (parts) {
        const startMin = parseInt(parts[1], 10) * 60 + parseInt(parts[2], 10);
        const endMin = parseInt(parts[3], 10) * 60 + parseInt(parts[4], 10);

        if (currentMinutesOfDay >= startMin && currentMinutesOfDay < endMin) {
          isOpenNow = true;
          if (endMin - currentMinutesOfDay <= 45) {
            closingSoon = true;
          }
          break;
        }
      }
    }

    if (isOpenNow) {
      if (closingSoon) {
        return {
          isOpen: true,
          statusText: "Cierra pronto",
          statusClass: "closing_soon",
          details: `Horario habitual: ${scheduleText}`,
          disclaimer: SCHEDULE_DISCLAIMER,
        };
      }
      return {
        isOpen: true,
        statusText: "Abierto ahora",
        statusClass: "open",
        details: `Horario habitual: ${scheduleText}`,
        disclaimer: SCHEDULE_DISCLAIMER,
      };
    } else {
      return {
        isOpen: false,
        statusText: "Cerrado en este momento",
        statusClass: "closed",
        details: `Horario habitual: ${scheduleText}`,
        disclaimer: SCHEDULE_DISCLAIMER,
      };
    }
  }

  // Si no se pueden parsear horas exactas, mostrar estado neutro
  return {
    isOpen: true,
    statusText: "Abierto (Horario habitual)",
    statusClass: "open",
    details: scheduleText,
    disclaimer: SCHEDULE_DISCLAIMER,
  };
}
