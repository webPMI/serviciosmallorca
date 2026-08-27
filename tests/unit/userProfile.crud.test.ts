/**
 * Tests para src/lib/userProfile.ts
 *
 * CRUD tipado del documento users/{uid} en Firestore (mockeado):
 *   - createUserProfile con defaults seguros (rol "user", photoURL null)
 *   - getUserProfile null-safe, updateData selectivo y actualización de rol admin
 *   - getAllUsers tolerante a fallos (admins) vía import dinámico del SDK
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

const fb = vi.hoisted(() => ({
  setDoc: vi.fn(),
  getDoc: vi.fn(),
  updateDoc: vi.fn(),
  getDocs: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  doc: (_db: unknown, name: string, id?: string) => ({ kind: "doc", name, id }),
  collection: (_db: unknown, name: string) => ({ kind: "collection", name }),
  serverTimestamp: () => ({ __serverTimestamp: true }),
  setDoc: fb.setDoc,
  getDoc: fb.getDoc,
  updateDoc: fb.updateDoc,
  getDocs: fb.getDocs,
}));

import {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  updateUserRole,
} from "../../src/lib/userProfile";
import type { Firestore } from "firebase/firestore";

const db = {} as Firestore;

beforeEach(() => {
  [fb.setDoc, fb.updateDoc, fb.getDoc, fb.getDocs].forEach((m) => m.mockReset());
});

describe("createUserProfile", () => {
  it("aplica defaults: rol 'user', photoURL null y ambos timestamps server-side", async () => {
    await createUserProfile(db, { uid: "u-1", email: "a@b.c", displayName: "Ana" });

    expect(fb.setDoc).toHaveBeenCalledTimes(1);
    const [ref, payload] = fb.setDoc.mock.calls[0];
    expect(ref).toMatchObject({ kind: "doc", name: "users", id: "u-1" });
    expect(payload).toEqual({
      role: "user",
      displayName: "Ana",
      email: "a@b.c",
      photoURL: null,
      createdAt: { __serverTimestamp: true },
      updatedAt: { __serverTimestamp: true },
    });
  });

  it("respeta rol explícito y foto proporcionados en el registro", async () => {
    await createUserProfile(db, {
      uid: "manager-x",
      email: "m@b.c",
      displayName: "Manager",
      role: "manager",
      photoURL: "/avatars/m.png",
    });
    const payload = fb.setDoc.mock.calls[0][1];
    expect(payload.role).toBe("manager");
    expect(payload.photoURL).toBe("/avatars/m.png");
  });
});

describe("getUserProfile / updateUserProfile", () => {
  it("devuelve null si el usuario aún no tiene ficha", async () => {
    fb.getDoc.mockResolvedValue({ exists: () => false, data: () => undefined });
    expect(await getUserProfile(db, "ghost")).toBeNull();
  });

  it("mapea el snapshot tal cual existe (cast tipado del contrato)", async () => {
    const stored = { role: "admin", displayName: "Root", email: "r@x.y", photoURL: null };
    fb.getDoc.mockResolvedValue({ exists: () => true, data: () => stored });
    expect(await getUserProfile(db, "root")).toEqual(stored);
  });

  it("updateUserProfile solo envía campos presentes + updatedAt fresco", async () => {
    await updateUserProfile(db, "u-2", { displayName: "Nuevo Nombre" });
    const [ref, payload] = fb.updateDoc.mock.calls[0];
    expect(ref).toMatchObject({ kind: "doc", name: "users", id: "u-2" });
    expect(payload).toEqual({
      displayName: "Nuevo Nombre",
      updatedAt: { __serverTimestamp: true },
    });

    await updateUserProfile(db, "u-2", {});
    expect(fb.updateDoc.mock.calls[1][1]).toEqual({ updatedAt: { __serverTimestamp: true } });

    await updateUserProfile(db, "u-2", { photoURL: null }); // borrado explícito permitido
    expect(fb.updateDoc.mock.calls[2][1].photoURL).toBeNull();
  });

  it("updateUserRole persiste el nuevo rol con timestamp", async () => {
    await updateUserRole(db, "u-3", "manager");
    const [ref, payload] = fb.updateDoc.mock.calls[0];
    expect(ref).toMatchObject({ kind: "doc", name: "users", id: "u-3" });
    expect(payload.role).toBe("manager");
  });
});

describe("getAllUsers (vista admin)", () => {
  it("adjunta el uid del documento a cada perfil listado", async () => {
    fb.getDocs.mockResolvedValue({
      docs: [
        { id: "a", data: () => ({ role: "user", displayName: "A" }) },
        { id: "b", data: () => ({ role: "manager", displayName: "B" }) },
      ],
    });
    const rows = await getAllUsers(db);
    expect(rows.map((r) => r.uid)).toEqual(["a", "b"]);
    expect(rows[1].role).toBe("manager");
  });

  it("devuelve [] silenciosamente si la vista admin falla (RLS)", async () => {
    fb.getDocs.mockRejectedValue(new Error("permission-denied"));
    expect(await getAllUsers(db)).toEqual([]);
  });
});
