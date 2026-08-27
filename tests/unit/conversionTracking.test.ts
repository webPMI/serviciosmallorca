/**
 * Tests para src/lib/conversionTracking.ts
 *
 * Telemetría de conversión sin bloquear navegación:
 *   - sendBeacon como canal principal; fetch keepalive como fallback
 *   - Delegación automática de clicks vía data-track-event / data-service-id
 *   - Guards en entornos sin window o sin serviceId
 */
// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { trackConversion, initAutomaticClickTracking } from "../../src/lib/conversionTracking";

const beaconCalls: Array<{ url: string; blob: Blob }> = [];

beforeEach(() => {
  beaconCalls.length = 0;
  // happy-dom puede no implementar sendBeacon → lo inyectamos siempre espiado
  Object.defineProperty(window.navigator, "sendBeacon", {
    configurable: true,
    value: vi.fn((url: string, blob: Blob) => {
      beaconCalls.push({ url, blob });
      return true;
    }),
  });
});

afterEach(() => {
  // @ts-expect-error limpiar el stub inyectado
  delete window.navigator.sendBeacon;
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

async function lastBeaconPayload(): Promise<Record<string, unknown>> {
  expect(beaconCalls.length).toBeGreaterThan(0);
  return JSON.parse(await beaconCalls[beaconCalls.length - 1].blob.text());
}

describe("trackConversion · canal de envío", () => {
  it("envía beacon JSON a /api/track-conversion con payload completo", async () => {
    trackConversion("good-luck-tattoo-palma", "whatsapp_click", { source: "sticky_bar" });

    const payload = await lastBeaconPayload();
    expect(beaconCalls[0].url).toBe("/api/track-conversion");
    expect(payload).toMatchObject({
      serviceId: "good-luck-tattoo-palma",
      eventType: "whatsapp_click",
      metadata: { source: "sticky_bar" },
    });
    expect(typeof payload.timestamp).toBe("string");
    expect(new Date(payload.timestamp as string).getTime()).not.toBeNaN();
    // locale del documento (happy-dom por defecto)
    expect(typeof payload.locale).toBe("string");
  });

  it("sin serviceId no emite nada", async () => {
    trackConversion("", "phone_click");
    expect(beaconCalls.length).toBe(0);
  });

  it("fallback: sin sendBeacon usa fetch POST keepalive y traga fallos de red", async () => {
    Object.defineProperty(window.navigator, "sendBeacon", {
      configurable: true,
      value: undefined,
    });

    const fetchMock = vi.fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>(() =>
      Promise.reject(new Error("network down")),
    );
    vi.stubGlobal("fetch", fetchMock);

    expect(() => trackConversion("svc-fallback", "directions_click")).not.toThrow();
    await Promise.resolve().catch(() => {}); // drenar microtareas del .catch interno

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/track-conversion");
    expect(init?.method).toBe("POST");
    expect(init?.keepalive).toBe(true);
    expect(JSON.parse(String(init?.body))).toMatchObject({
      serviceId: "svc-fallback",
      eventType: "directions_click",
    });
  });
});

describe("initAutomaticClickTracking · delegación DOM", () => {
  it("captura clicks en [data-track-event] y extrae metadata elementId + href", async () => {
    initAutomaticClickTracking();

    const anchor = document.createElement("a");
    anchor.id = "cta-whatsapp";
    anchor.href = "https://wa.me/34600000000";
    anchor.setAttribute("data-track-event", "whatsapp_click");
    anchor.setAttribute("data-service-id", "pura-vida-surf-school-colonia");
    document.body.appendChild(anchor);

    anchor.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));

    const payload = await lastBeaconPayload();
    expect(payload).toMatchObject({
      serviceId: "pura-vida-surf-school-colonia",
      eventType: "whatsapp_click",
      metadata: { elementId: "cta-whatsapp", href: "https://wa.me/34600000000" },
    });
  });

  it("ignora elementos sin par completo de atributos de tracking", async () => {
    initAutomaticClickTracking();

    const callsBefore = beaconCalls.length;

    const incomplete = document.createElement("button");
    incomplete.setAttribute("data-track-event", "share_click"); // falta data-service-id
    document.body.appendChild(incomplete);
    incomplete.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    const outside = document.createElement("div"); // fuera del sistema de tracking
    document.body.appendChild(outside);
    outside.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(beaconCalls.length).toBe(callsBefore);
  });

  it("múltiples init registran UN solo listener → un único beacon por click (anti-duplicación)", async () => {
    // Regresión del hallazgo R2-01: antes del guard, cada llamada acumulaba
    // otro listener de documento y disparaba N beacons por el mismo click.
    initAutomaticClickTracking();
    initAutomaticClickTracking();
    initAutomaticClickTracking();

    const anchor = document.createElement("a");
    anchor.href = "https://wa.me/34600000001";
    anchor.setAttribute("data-track-event", "whatsapp_click");
    anchor.setAttribute("data-service-id", "stress-idempotency-service");
    document.body.appendChild(anchor);
    anchor.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));

    const payload = await lastBeaconPayload();
    expect(payload.serviceId).toBe("stress-idempotency-service");
    expect(beaconCalls.filter((b) => b.url === "/api/track-conversion")).toHaveLength(1);

    // Click adicional tras los init redundantes: sigue siendo exactamente 1 beacon
    anchor.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    await Promise.resolve();
    expect(beaconCalls.filter((b) => b.url === "/api/track-conversion")).toHaveLength(2);
  });
});
