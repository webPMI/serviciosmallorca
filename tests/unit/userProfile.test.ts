import { describe, it, expect, vi, beforeEach } from "vitest";
import { createUserProfile, getUserProfile, updateUserProfile } from "../../src/lib/userProfile";
import * as firestore from "firebase/firestore";

vi.mock("firebase/firestore", () => ({
  doc: vi.fn((_db, collection, id) => ({ path: `${collection}/${id}` })),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  serverTimestamp: vi.fn(() => "MOCK_TIMESTAMP"),
}));

describe("userProfile utility module", () => {
  const mockDb = {} as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createUserProfile", () => {
    it("creates a document with default 'user' role and timestamp", async () => {
      await createUserProfile(mockDb, {
        uid: "user-123",
        email: "test@example.com",
        displayName: "Test User",
      });

      expect(firestore.doc).toHaveBeenCalledWith(mockDb, "users", "user-123");
      expect(firestore.setDoc).toHaveBeenCalledWith(
        { path: "users/user-123" },
        expect.objectContaining({
          role: "user",
          displayName: "Test User",
          email: "test@example.com",
          photoURL: null,
          createdAt: "MOCK_TIMESTAMP",
          updatedAt: "MOCK_TIMESTAMP",
        }),
      );
    });

    it("preserves custom role and photoURL if provided", async () => {
      await createUserProfile(mockDb, {
        uid: "admin-456",
        email: "admin@example.com",
        displayName: "Admin User",
        role: "admin",
        photoURL: "https://example.com/avatar.jpg",
      });

      expect(firestore.setDoc).toHaveBeenCalledWith(
        { path: "users/admin-456" },
        expect.objectContaining({
          role: "admin",
          displayName: "Admin User",
          email: "admin@example.com",
          photoURL: "https://example.com/avatar.jpg",
        }),
      );
    });
  });

  describe("getUserProfile", () => {
    it("returns user profile data when document exists", async () => {
      const mockData = {
        role: "user",
        displayName: "Test User",
        email: "test@example.com",
        photoURL: null,
        createdAt: "MOCK_TIMESTAMP",
        updatedAt: "MOCK_TIMESTAMP",
      };

      vi.mocked(firestore.getDoc).mockResolvedValueOnce({
        exists: () => true,
        data: () => mockData,
      } as any);

      const result = await getUserProfile(mockDb, "user-123");
      expect(result).toEqual(mockData);
    });

    it("returns null when document does not exist", async () => {
      vi.mocked(firestore.getDoc).mockResolvedValueOnce({
        exists: () => false,
      } as any);

      const result = await getUserProfile(mockDb, "non-existent");
      expect(result).toBeNull();
    });
  });

  describe("updateUserProfile", () => {
    it("updates displayName and photoURL with new updatedAt timestamp", async () => {
      await updateUserProfile(mockDb, "user-123", {
        displayName: "Updated Name",
        photoURL: "🚀",
      });

      expect(firestore.doc).toHaveBeenCalledWith(mockDb, "users", "user-123");
      expect(firestore.updateDoc).toHaveBeenCalledWith(
        { path: "users/user-123" },
        {
          updatedAt: "MOCK_TIMESTAMP",
          displayName: "Updated Name",
          photoURL: "🚀",
        },
      );
    });

    it("updates only displayName if photoURL is not provided", async () => {
      await updateUserProfile(mockDb, "user-123", {
        displayName: "Only Name",
      });

      expect(firestore.updateDoc).toHaveBeenCalledWith(
        { path: "users/user-123" },
        {
          updatedAt: "MOCK_TIMESTAMP",
          displayName: "Only Name",
        },
      );
    });
  });

  describe("assignBusinessToUser & removeBusinessFromUser", () => {
    it("assigns a business, elevates user role to manager and updates managedServices", async () => {
      const { assignBusinessToUser } = await import("../../src/lib/userProfile");

      vi.mocked(firestore.getDoc).mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ role: "user", displayName: "Owner", managedServices: [] }),
      } as any);

      await assignBusinessToUser(mockDb, "user-owner-1", "restaurante-el-camino");

      expect(firestore.updateDoc).toHaveBeenCalledWith(
        { path: "users/user-owner-1" },
        {
          role: "manager",
          managedServices: ["restaurante-el-camino"],
          updatedAt: "MOCK_TIMESTAMP",
        },
      );
    });

    it("removes a business from managedServices", async () => {
      const { removeBusinessFromUser } = await import("../../src/lib/userProfile");

      vi.mocked(firestore.getDoc).mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ role: "manager", managedServices: ["biz-1", "biz-2"] }),
      } as any);

      await removeBusinessFromUser(mockDb, "user-owner-1", "biz-1");

      expect(firestore.updateDoc).toHaveBeenCalledWith(
        { path: "users/user-owner-1" },
        {
          managedServices: ["biz-2"],
          updatedAt: "MOCK_TIMESTAMP",
        },
      );
    });
  });
});
