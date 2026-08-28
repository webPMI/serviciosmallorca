/**
 * scheduleParser.branches.test.ts
 *
 * ⏰ COBERTURA DE RAMAS DEL ANALIZADOR DE HORARIOS EN VIVO (GR-12 fidelidad de datos)
 *
 * El test base cubría los caminos felices. Esta suite ataca las ramas que faltaban:
 *  1. permanently_closed / seasonal_closure con etiquetas 4-idiomas + fallback es.
 *  2. Horario ausente/vacío → "Consultar Horario"; incomplete_admin_only NO cortocircuita.
 *  3. Variantes "24h" y "24/7"; parser con separador "a" y formato con puntos (10.00).
 *  4. closing_soon (≤45 min); sábado cerrado → lunes; domingo "dom: cerrado" en catalán.
 *  5. Sin rangos parseables → fallback "Abierto (Horario habitual)".
 *
 * Zona horaria: agosto 2026 en Europe/Madrid = CEST (UTC+2).
 * Lunes 24/08, sábado 29/08, domingo 30/08.
 */

import { describe, it, expect } from "vitest";
import { getLiveBusinessStatus } from "../../src/lib/scheduleParser.ts";

describe("⏰ estados de servicio explícitos", () => {
  it("permanently_closed: etiquetas 4-idiomas con fallback a es", () => {
    const es = getLiveBusinessStatus("10:00 - 20:00", "permanently_closed", undefined, "es");
    expect(es.statusText).toBe("Permanentemente Cerrado");
    expect(es.isOpen).toBe(false);
    expect(es.statusClass).toBe("closed");
    expect(es.details).toContain("ha cesado su actividad");
    expect(getLiveBusinessStatus("10:00 - 20:00", "permanently_closed", undefined, "en").statusText).toBe(
      "Permanently Closed",
    );
    expect(getLiveBusinessStatus("10:00 - 20:00", "permanently_closed", undefined, "ca").statusText).toBe(
      "Tancat Permanentment",
    );
    expect(getLiveBusinessStatus("10:00 - 20:00", "permanently_closed", undefined, "de").statusText).toBe(
      "Dauerhaft geschlossen",
    );
    expect(getLiveBusinessStatus("10:00 - 20:00", "permanently_closed", undefined, "fr" as any).statusText).toBe(
      "Permanentemente Cerrado",
    );
  });

  it("seasonal_closure: etiqueta en inglés y statusClass seasonal", () => {
    const res = getLiveBusinessStatus("10:00 - 20:00", "seasonal_closure", undefined, "en");
    expect(res.statusText).toBe("Seasonal Closure / Holiday");
    expect(res.isOpen).toBe(false);
    expect(res.statusClass).toBe("seasonal");
  });

  it("horario ausente, vacío o en blanco → 'Consultar Horario' cerrado", () => {
    for (const schedule of [undefined, "", "   "] as const) {
      const res = getLiveBusinessStatus(schedule, "open");
      expect(res.isOpen).toBe(false);
      expect(res.statusText).toBe("Consultar Horario");
      expect(res.details).toBe("Horario no especificado.");
    }
  });

  it("incomplete_admin_only NO cortocircuita: se evalúa el horario normalmente", () => {
    const mondayNoon = new Date("2026-08-24T10:00:00Z"); // 12:00 Madrid
    const res = getLiveBusinessStatus("10:00 - 20:00", "incomplete_admin_only", mondayNoon, "es");
    expect(res.isOpen).toBe(true);
    expect(res.statusClass).toBe("open");
  });
});

describe("⏰ variantes 24 horas y parser de rangos", () => {
  it("reconoce '24h' y '24/7' como servicio ininterrumpido", () => {
    expect(getLiveBusinessStatus("Abierto 24h todos los días").statusText).toBe("Abierto 24 Horas");
    const res = getLiveBusinessStatus("24/7");
    expect(res.isOpen).toBe(true);
    expect(res.details).toBe("Servicio ininterrumpido.");
  });

  it("parsea separador 'a' y formato con puntos (10.00 a 14.00)", () => {
    const mondayNoon = new Date("2026-08-24T10:00:00Z"); // 12:00 Madrid
    const res = getLiveBusinessStatus("Horario: 10.00 a 14.00", "open", mondayNoon, "es");
    expect(res.isOpen).toBe(true);
    expect(res.statusText).toBe("Abierto ahora");
    expect(res.details).toContain("10.00 a 14.00");
  });
});

describe("⏰ cierre próximo, sábados/domingos y fallback", () => {
  it("closing_soon cuando quedan ≤45 min para cerrar (19:20, cierre 20:00)", () => {
    const casiCierre = new Date("2026-08-24T17:20:00Z"); // 19:20 Madrid
    const res = getLiveBusinessStatus("10:00 - 20:00", "open", casiCierre, "es");
    expect(res.isOpen).toBe(true);
    expect(res.statusText).toBe("Cierra pronto");
    expect(res.statusClass).toBe("closing_soon");
  });

  it("sábado cerrado por 'lunes a viernes' → próxima apertura el lunes", () => {
    const sabado = new Date("2026-08-29T09:00:00Z"); // 11:00 Madrid, sábado
    const res = getLiveBusinessStatus("Lunes a viernes: 09:00 - 18:00", "open", sabado, "es");
    expect(res.isOpen).toBe(false);
    expect(res.statusText).toBe("Cerrado · Abre el lunes a las 09:00");
    expect(res.nextOpening?.type).toBe("monday");
    expect(res.nextOpening?.timeStr).toBe("09:00");
  });

  it("domingo con 'dom: cerrado' en catalán → 'Obre dilluns a les 10:00'", () => {
    const domingo = new Date("2026-08-30T09:00:00Z"); // 11:00 Madrid, domingo
    const res = getLiveBusinessStatus("Lun - Sáb: 10:00 - 20:00, dom: cerrado", "open", domingo, "ca");
    expect(res.isOpen).toBe(false);
    expect(res.statusText).toBe("Tancat · Obre dilluns a les 10:00");
    expect(res.nextOpening?.type).toBe("monday");
  });

  it("sin rangos parseables → fallback abierto con horario habitual intacto", () => {
    const res = getLiveBusinessStatus("Visitas únicamente con cita previa", "open");
    expect(res.isOpen).toBe(true);
    expect(res.statusText).toBe("Abierto (Horario habitual)");
    expect(res.details).toBe("Visitas únicamente con cita previa");
  });

  it("inglés: cerrado antes de abrir hoy → 'Opens today at 10:00'", () => {
    const mananaLunes = new Date("2026-08-24T06:00:00Z"); // 08:00 Madrid, antes de abrir
    const res = getLiveBusinessStatus("10:00 - 20:00", "open", mananaLunes, "en");
    expect(res.isOpen).toBe(false);
    expect(res.statusText).toBe("Closed · Opens today at 10:00");
    expect(res.nextOpening?.type).toBe("today");
  });
});
