/**
 * directoryIntents.test.ts
 *
 * 🎯 Tests de los filtros de intención del directorio, ahora resueltos en el SERVIDOR.
 * Antes vivían duplicados en el script inline y en los data-* de cada tarjeta.
 */
import { describe, it, expect } from "vitest";
import {
  parseIntentParam,
  isOpenNow,
  isMultilingual,
  hasTerrace,
  isPetFriendly,
  isAccessible,
  filterByIntent,
  DIRECTORY_INTENTS,
} from "../../src/lib/directoryIntents";
import type { ServiceItem } from "../../src/data/services";

function svc(partial: Partial<ServiceItem> = {}): ServiceItem {
  return { slug: "x", name: "X", status: "open", ...partial } as ServiceItem;
}

describe("parseIntentParam · lista blanca (?intencion=)", () => {
  it("acepta las 5 intenciones oficiales", () => {
    for (const intent of DIRECTORY_INTENTS) {
      expect(parseIntentParam(intent)).toBe(intent);
    }
  });

  it("rechaza valores inventados o Injection", () => {
    expect(parseIntentParam("")).toBeNull();
    expect(parseIntentParam(null)).toBeNull();
    expect(parseIntentParam("todo")).toBeNull();
    expect(parseIntentParam("<script>")).toBeNull();
  });

  it("normaliza mayúsculas y espacios", () => {
    expect(parseIntentParam("  OPEN-NOW ")).toBe("open-now");
  });
});

describe("intenciones por capacidades (fuente única de verdad)", () => {
  it("multilingüe: inglés, alemán o identidad orientada", () => {
    expect(isMultilingual(svc({ languagesSpoken: ["en", "es"] }))).toBe(true);
    expect(isMultilingual(svc({ languagesSpoken: ["de"] }))).toBe(true);
    expect(isMultilingual(svc({ culturalIdentity: "german_oriented" }))).toBe(true);
    expect(isMultilingual(svc({ culturalIdentity: "british_oriented" }))).toBe(true);
    expect(isMultilingual(svc({ languagesSpoken: ["es", "ca"] }))).toBe(false);
  });

  it("terraza, pet-friendly y accesible leen capabilities o amenities", () => {
    expect(hasTerrace(svc({ capabilities: { terrace: true } }))).toBe(true);
    expect(hasTerrace(svc({ amenities: ["terrace"] }))).toBe(true);
    expect(hasTerrace(svc())).toBe(false);

    expect(isPetFriendly(svc({ capabilities: { petFriendly: true } }))).toBe(true);
    expect(isPetFriendly(svc({ amenities: ["pet_friendly"] }))).toBe(true);
    expect(isPetFriendly(svc())).toBe(false);

    expect(isAccessible(svc({ capabilities: { wheelchairAccessible: true } }))).toBe(true);
    expect(isAccessible(svc({ amenities: ["wheelchair_accessible"] }))).toBe(true);
    expect(isAccessible(svc())).toBe(false);
  });
});

describe("isOpenNow · heurística de horario en hora de Mallorca", () => {
  const wednesdayNoon = new Date("2026-09-23T12:00:00+02:00"); // miércoles
  const wednesdayNight = new Date("2026-09-23T23:30:00+02:00");
  const sundayMorning = new Date("2026-09-27T11:00:00+02:00");
  const saturdayMorning = new Date("2026-09-26T11:00:00+02:00");

  it("nunca da por abierto un negocio cerrado o en cierre estacional", () => {
    expect(isOpenNow(svc({ status: "permanently_closed", schedule: "24 horas" }))).toBe(false);
    expect(isOpenNow(svc({ status: "seasonal_closure", schedule: "24 horas" }))).toBe(false);
  });

  it("detecta 24 horas", () => {
    expect(isOpenNow(svc({ schedule: "24 horas" }), wednesdayNight)).toBe(true);
    expect(isOpenNow(svc({ schedule: "Abierto 24/7" }), wednesdayNight)).toBe(true);
  });

  it("sin horario assume activo (mismo criterio legacy)", () => {
    expect(isOpenNow(svc({ schedule: "" }), wednesdayNoon)).toBe(true);
    expect(isOpenNow(svc({ schedule: undefined }), wednesdayNoon)).toBe(true);
  });

  it("respeta la franja horaria declarada", () => {
    const service = svc({ schedule: "Lunes a Viernes: 10:00 - 14:00" });
    expect(isOpenNow(service, wednesdayNoon)).toBe(true);
    expect(isOpenNow(service, wednesdayNight)).toBe(false);
  });

  it("cierra domingos y sábados si el horario lo indica", () => {
    const weekdayOnly = svc({ schedule: "Lunes a viernes: 10:00 - 20:00" });
    expect(isOpenNow(weekdayOnly, sundayMorning)).toBe(false);
    expect(isOpenNow(weekdayOnly, saturdayMorning)).toBe(false);
  });
});

describe("filterByIntent · aplicación al catálogo", () => {
  const catalog: ServiceItem[] = [
    svc({ slug: "terraza", capabilities: { terrace: true } }),
    svc({ slug: "closed", status: "permanently_closed" }),
    svc({ slug: "inglés", languagesSpoken: ["en"] }),
  ];

  it("sin intención devuelve la lista intacta (misma referencia)", () => {
    expect(filterByIntent(catalog, null)).toBe(catalog);
  });

  it("filtra por intención seleccionada", () => {
    expect(filterByIntent(catalog, "terrace").map((s) => s.slug)).toEqual(["terraza"]);
    expect(filterByIntent(catalog, "multilingual").map((s) => s.slug)).toEqual(["inglés"]);
    expect(filterByIntent(catalog, "pet-friendly")).toEqual([]);
  });
});
