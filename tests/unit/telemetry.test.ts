// @vitest-environment happy-dom
/**
 * telemetry.test.ts
 *
 * 📡 COBERTURA DE TELEMETRÍA CLIENTE (GR-15 / LOGGING_AND_QUALITY_CONTROL.md)
 *
 * src/lib/telemetry.ts estaba al 0% de cobertura. Se verifica:
 *  1. captureFrontendError envía POST /api/telemetry con payload completo
 *     (level/category/message/stack/url/userAgent/timestamp + metadata path & screenSize).
 *  2. Fallo de red → capturado con console.warn, sin romper la ejecución.
 *  3. Timeout de 3s → AbortController dispara y el fallo es tolerado.
 *  4. initTelemetry registra listeners de window.error y unhandledrejection.
 *  5. Guard de entorno no-browser (window ausente) → return temprano sin crash.
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import { captureFrontendError, initTelemetry } from "../../src/lib/telemetry.ts";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("📡 telemetry: captura de errores cliente → /api/telemetry", () => {
  it("envía el payload completo con metadata de contexto, path y screenSize", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    window.history.replaceState({}, "", "/es/pagina-test?x=1");
    Object.defineProperty(window, "innerWidth", { value: 1280, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 720, configurable: true });

    await captureFrontendError(new Error("boom-de-prueba"), { component: "TestComp" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/telemetry");
    expect(init.method).toBe("POST");
    const body = JSON.parse(String(init.body));
    expect(body.level).toBe("ERROR");
    expect(body.category).toBe("CLIENT_JS");
    expect(body.message).toBe("boom-de-prueba");
    expect(typeof body.stack).toBe("string");
    expect(body.url).toContain("/es/pagina-test");
    expect(body.userAgent).toBeTruthy();
    expect(typeof body.timestamp).toBe("string");
    expect(body.metadata.component).toBe("TestComp");
    expect(body.metadata.path).toBe("/es/pagina-test");
    expect(body.metadata.screenSize).toBe("1280x720");
  });

  it("tolera fallo de red con console.warn sin lanzar excepción", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    await expect(captureFrontendError(new Error("x"))).resolves.toBeUndefined();
    expect(warnSpy).toHaveBeenCalled();
  });

  it("aborta a los 3 segundos si el endpoint no responde y lo tolera", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn((_url: string, opts: { signal: AbortSignal }) => {
      return new Promise((_resolve, reject) => {
        opts.signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
      });
    });
    vi.stubGlobal("fetch", fetchMock);
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const pending = captureFrontendError(new Error("lento"));
    vi.advanceTimersByTime(3001);
    await pending;

    const signal = (fetchMock.mock.calls[0][1] as { signal: AbortSignal }).signal;
    expect(signal.aborted).toBe(true);
    expect(warnSpy).toHaveBeenCalled();
  });
});

describe("📡 telemetry: initTelemetry (listeners globales)", () => {
  it("registra listeners de window.error y unhandledrejection y los captura", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const addSpy = vi.spyOn(window, "addEventListener");

    initTelemetry();
    expect(addSpy.mock.calls.map((c) => c[0])).toEqual(expect.arrayContaining(["error", "unhandledrejection"]));

    window.dispatchEvent(new ErrorEvent("error", { error: new Error("window-error"), message: "window-error" }));
    const rejection = new Event("unhandledrejection");
    (rejection as unknown as { reason: string }).reason = "motivo-promise";
    window.dispatchEvent(rejection);

    await vi.waitFor(() => expect(fetchMock.mock.calls.length).toBe(2));
    const bodies = fetchMock.mock.calls.map((c) => JSON.parse((c[1] as { body: string }).body));
    expect(bodies[0].message).toBe("window-error");
    expect(bodies[0].metadata.type).toBe("window.error");
    expect(bodies[1].message).toBe("motivo-promise");
    expect(bodies[1].metadata.type).toBe("unhandled_rejection");
  });

  it("guard no-browser: sin window hace return temprano sin crash", () => {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
    try {
      delete (globalThis as unknown as { window?: unknown }).window;
      expect(() => initTelemetry()).not.toThrow();
    } finally {
      if (descriptor) Object.defineProperty(globalThis, "window", descriptor);
    }
  });
});
