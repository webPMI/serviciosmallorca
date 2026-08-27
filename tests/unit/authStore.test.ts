/**
 * Tests para src/lib/authStore.ts
 *
 * Patrón singleton observable del estado de sesión:
 *   - Registro en onAuthStateChanged solo si existe window (happy-dom)
 *   - Resolución de rol prioridad: custom claims > documento users/{uid} > "user"
 *   - Suscripciones síncronas + cancelación, logout delegado a Firebase Auth
 *
 * Cada escenario reconstruye el módulo (vi.resetModules + import dinámico)
 * porque authStore es un singleton creado en tiempo de importación.
 */
// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const fakes = vi.hoisted(() => ({
  onAuthStateChanged: vi.fn(),
  signOut: vi.fn(async () => {}),
  getFirestore: vi.fn(() => ({ kind: "firestore" })),
  doc: vi.fn((_db: unknown, name: string, id: string) => ({ name, id })),
  getDoc: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: fakes.onAuthStateChanged,
  signOut: fakes.signOut,
}));

vi.mock("firebase/firestore", () => ({
  getFirestore: fakes.getFirestore,
  doc: fakes.doc,
  getDoc: fakes.getDoc,
}));

vi.mock("../../src/lib/firebase", () => ({ auth: { appName: "test-app" } }));

type Handler = (user: unknown) => Promise<void>;

function fakeUser(uid: string, claims: Record<string, unknown> = {}): never {
  return {
    uid,
    getIdTokenResult: async () => ({ claims }),
  } as never;
}

async function freshStore() {
  vi.resetModules();
  const mod = await import("../../src/lib/authStore");
  return mod.authStore;
}

function lastRegisteredHandler(): Handler {
  const calls = fakes.onAuthStateChanged.mock.calls;
  expect(calls.length).toBeGreaterThan(0);
  return calls[calls.length - 1][1] as Handler;
}

beforeEach(() => {
  fakes.onAuthStateChanged.mockReset();
  fakes.signOut.mockClear();
  fakes.getDoc.mockReset();
  fakes.onAuthStateChanged.mockImplementation((_auth: unknown, _cb: Handler) => () => undefined);
});

afterEach(() => vi.restoreAllMocks());

describe("authStore · resolución de rol", () => {
  it("estado inicial: loading=true y rol guest hasta el primer evento de auth", async () => {
    const store = await freshStore();
    expect(store.getState()).toEqual({ user: null, role: "guest", loading: true });
    // el registro ocurre porque happy-dom define window
    expect(fakes.onAuthStateChanged).toHaveBeenCalledTimes(1);
  });

  it("evento null → estado de visitante (guest, sin loading)", async () => {
    const store = await freshStore();
    await lastRegisteredHandler()(null);
    expect(store.getState()).toEqual({ user: null, role: "guest", loading: false });
  });

  it("prioridad 1: el rol llega desde custom claims del token", async () => {
    const store = await freshStore();
    const user = fakeUser("u-admin", { role: "admin" });
    await lastRegisteredHandler()(user);
    expect(store.getState().role).toBe("admin");
    expect(fakes.getDoc).not.toHaveBeenCalled(); // cortocircuito sin Firestore
  });

  it("prioridad 2: sin claims consulta users/{uid} en Firestore", async () => {
    fakes.getDoc.mockResolvedValue({ exists: true, data: () => ({ role: "manager" }) });
    const store = await freshStore();
    await lastRegisteredHandler()(fakeUser("u-2"));
    expect(store.getState().role).toBe("manager");
    expect(fakes.doc).toHaveBeenCalledWith(expect.anything(), "users", "u-2");
  });

  it("sin claims ni documento → rol 'user' por defecto", async () => {
    fakes.getDoc.mockResolvedValue({ exists: false, data: () => ({}) });
    const store = await freshStore();
    await lastRegisteredHandler()(fakeUser("u-3"));
    expect(store.getState().role).toBe("user");
  });

  it("fallo al leer el rol se degrada silenciosamente a 'user' con warning", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      const store = await freshStore();
      const brokenUser = {
        uid: "u-broken",
        getIdTokenResult: () => Promise.reject(new Error("token revoked")),
      };
      await lastRegisteredHandler()(brokenUser as never);
      expect(store.getState().role).toBe("user");
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("Could not fetch user role"), expect.anything());
    } finally {
      warnSpy.mockRestore();
    }
  });
});

describe("authStore · suscripciones y logout", () => {
  it("subscribe emite el snapshot actual y la cancelación evita futuros avisos", async () => {
    const store = await freshStore();

    const snapshots: Array<{ role: string }> = [];
    const unsubscribe = store.subscribe((s) => snapshots.push(s));
    expect(snapshots.at(-1)?.role).toBe("guest");

    await lastRegisteredHandler()(null); // dispara notify()
    expect(snapshots.length).toBeGreaterThanOrEqual(2);

    unsubscribe(); // ya no recibe más notificaciones
    await lastRegisteredHandler()(fakeUser("later-user", { role: "manager" }));
    const countAfterUnsub = snapshots.length;
    await lastRegisteredHandler()(null);
    expect(snapshots.length).toBe(countAfterUnsub);
  });

  it("logout() delega en signOut de Firebase Auth", async () => {
    const store = await freshStore();
    await store.logout();
    expect(fakes.signOut).toHaveBeenCalledTimes(1);
  });
});
