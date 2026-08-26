import { describe, it, expect } from "vitest";
import { getLiveBusinessStatus, SCHEDULE_DISCLAIMER } from "../../src/lib/scheduleParser";

describe("scheduleParser: Live Opening Hours with Disclaimer", () => {
  it("correctly handles 24-hour services", () => {
    const res = getLiveBusinessStatus("Abierto 24 horas");
    expect(res.isOpen).toBe(true);
    expect(res.statusClass).toBe("open");
    expect(res.disclaimer).toBe(SCHEDULE_DISCLAIMER);
  });

  it("correctly detects seasonal closure", () => {
    const res = getLiveBusinessStatus("Lun - Dom: 10:00 - 22:00", "seasonal_closure");
    expect(res.isOpen).toBe(false);
    expect(res.statusClass).toBe("seasonal");
    expect(res.statusText).toContain("Temporada");
  });

  it("evaluates business hours within operational range on Monday", () => {
    // 2026-08-24 14:30 Madrid Time (Monday)
    const mondayAfternoon = new Date("2026-08-24T12:30:00Z"); // 14:30 in UTC+2 (Madrid summer time)
    const res = getLiveBusinessStatus("Lun - Sáb: 10:00 - 20:00", "open", mondayAfternoon);
    expect(res.isOpen).toBe(true);
    expect(res.statusClass).toBe("open");
  });

  it("evaluates business hours outside operational range at night and displays next opening tomorrow", () => {
    // 2026-08-24 23:30 Madrid Time (Monday)
    const mondayNight = new Date("2026-08-24T21:30:00Z");
    const res = getLiveBusinessStatus("Lun - Sáb: 10:00 - 20:00", "open", mondayNight, "es");
    expect(res.isOpen).toBe(false);
    expect(res.statusClass).toBe("closed");
    expect(res.statusText).toContain("Abre mañana a las 10:00");
    expect(res.nextOpening?.timeStr).toBe("10:00");
  });

  it("calculates next opening today during midday break", () => {
    // 2026-08-24 15:30 Madrid Time (Monday), schedule: 10:00-14:00, 17:00-21:00
    const mondayMidday = new Date("2026-08-24T13:30:00Z");
    const res = getLiveBusinessStatus("10:00 - 14:00, 17:00 - 21:00", "open", mondayMidday, "es");
    expect(res.isOpen).toBe(false);
    expect(res.statusText).toContain("Abre hoy a las 17:00");
  });

  it("calculates next opening on Monday when closed on Sunday in German", () => {
    // 2026-08-30 11:00 Madrid Time (Sunday)
    const sundayMorning = new Date("2026-08-30T09:00:00Z");
    const res = getLiveBusinessStatus("Lun - Vie: 08:30 - 19:00, Domingo cerrado", "open", sundayMorning, "de");
    expect(res.isOpen).toBe(false);
    expect(res.statusText).toContain("Öffnet am Montag um 08:30 Uhr");
  });
});
