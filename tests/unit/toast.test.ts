/**
 * Tests for the Global Toast Notification System.
 *
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { showToast, toast, type ToastDetail } from "../../src/lib/toast";

describe("Global Toast Notification System", () => {
  let dispatchedEvents: CustomEvent<ToastDetail>[] = [];

  beforeEach(() => {
    dispatchedEvents = [];
    vi.spyOn(window, "dispatchEvent").mockImplementation((event: Event) => {
      dispatchedEvents.push(event as CustomEvent<ToastDetail>);
      return true;
    });
  });

  it("dispatches app:toast event with string message and default info type", () => {
    showToast("Hola mundo");

    expect(window.dispatchEvent).toHaveBeenCalled();
    expect(dispatchedEvents.length).toBe(1);
    expect(dispatchedEvents[0].type).toBe("app:toast");
    expect(dispatchedEvents[0].detail.message).toBe("Hola mundo");
    expect(dispatchedEvents[0].detail.type).toBe("info");
    expect(dispatchedEvents[0].detail.duration).toBe(4000);
    expect(dispatchedEvents[0].detail.id).toBeDefined();
  });

  it("toast.success() dispatches event with type 'success'", () => {
    toast.success("¡Operación completada!");

    expect(dispatchedEvents.length).toBe(1);
    const detail = dispatchedEvents[0].detail;
    expect(detail.message).toBe("¡Operación completada!");
    expect(detail.type).toBe("success");
    expect(detail.icon).toBe("✅");
  });

  it("toast.error() dispatches event with type 'error'", () => {
    toast.error("Error al cargar datos", { title: "Fallo" });

    expect(dispatchedEvents.length).toBe(1);
    const detail = dispatchedEvents[0].detail;
    expect(detail.message).toBe("Error al cargar datos");
    expect(detail.title).toBe("Fallo");
    expect(detail.type).toBe("error");
    expect(detail.icon).toBe("❌");
  });

  it("toast.warning() dispatches event with custom duration", () => {
    toast.warning("Cuidado con el cambio", { duration: 6000 });

    expect(dispatchedEvents.length).toBe(1);
    const detail = dispatchedEvents[0].detail;
    expect(detail.message).toBe("Cuidado con el cambio");
    expect(detail.type).toBe("warning");
    expect(detail.duration).toBe(6000);
    expect(detail.icon).toBe("⚠️");
  });

  it("toast.info() dispatches event with custom icon", () => {
    toast.info("Actualización lista", { icon: "🚀" });

    expect(dispatchedEvents.length).toBe(1);
    const detail = dispatchedEvents[0].detail;
    expect(detail.message).toBe("Actualización lista");
    expect(detail.type).toBe("info");
    expect(detail.icon).toBe("🚀");
  });

  it("showToast soporta objeto con duration: 0 (persistente) y type heredado", () => {
    showToast({ message: "Mensaje persistente", duration: 0, type: "warning" });

    expect(dispatchedEvents.length).toBe(1);
    const detail = dispatchedEvents[0].detail;
    expect(detail.message).toBe("Mensaje persistente");
    expect(detail.duration).toBe(0);
    expect(detail.type).toBe("warning");
    expect(detail.icon).toBe("⚠️");
  });
});
