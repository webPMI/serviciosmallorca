/**
 * User Profile — Firestore ficha de usuario.
 *
 * Every authenticated user gets a document at `users/{uid}` that stores:
 *   - role (assigned at registration, default "user")
 *   - displayName, email, timestamps
 *   - extensible metadata for future fields
 *
 * This module provides type-safe create & read helpers.
 */

import { doc, getDoc, setDoc, updateDoc, serverTimestamp, type Firestore } from "firebase/firestore";
import type { UserRole } from "./authStore";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UserProfile {
  role: UserRole;
  displayName: string;
  email: string;
  photoURL: string | null;
  managedServices?: string[];
  createdAt: ReturnType<typeof serverTimestamp>;
  updatedAt: ReturnType<typeof serverTimestamp>;
}

// Minimum fields required to create a profile
export interface CreateProfileInput {
  uid: string;
  email: string;
  displayName: string;
  role?: UserRole; // default "user"
  photoURL?: string | null;
}

// Fields that can be updated by the user
export interface UpdateProfileInput {
  displayName?: string;
  photoURL?: string | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Create (or overwrite) a user profile document in Firestore.
 * Called right after Firebase Auth registration.
 */
export async function createUserProfile(db: Firestore, input: CreateProfileInput): Promise<void> {
  const now = serverTimestamp();
  await setDoc(doc(db, "users", input.uid), {
    role: input.role ?? "user",
    displayName: input.displayName,
    email: input.email,
    photoURL: input.photoURL ?? null,
    createdAt: now,
    updatedAt: now,
  });
}

/**
 * Fetch a user's profile from Firestore by UID.
 * Returns `null` when the document doesn't exist.
 */
export async function getUserProfile(db: Firestore, uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

/**
 * Update user profile fields in Firestore (displayName, photoURL).
 * Keeps role and email intact and refreshes `updatedAt`.
 */
export async function updateUserProfile(db: Firestore, uid: string, data: UpdateProfileInput): Promise<void> {
  const updateData: Record<string, any> = {
    updatedAt: serverTimestamp(),
  };

  if (data.displayName !== undefined) {
    updateData.displayName = data.displayName;
  }
  if (data.photoURL !== undefined) {
    updateData.photoURL = data.photoURL;
  }

  await updateDoc(doc(db, "users", uid), updateData);
}

/**
 * Fetch all user profiles from Firestore (Admin only).
 */
export async function getAllUsers(db: Firestore): Promise<Array<UserProfile & { uid: string }>> {
  try {
    const { getDocs, collection } = await import("firebase/firestore");
    const snap = await getDocs(collection(db, "users"));
    return snap.docs.map((d) => ({ uid: d.id, ...d.data() }) as UserProfile & { uid: string });
  } catch {
    return [];
  }
}

/**
 * Update a user's role in Firestore (Admin only).
 */
export async function updateUserRole(db: Firestore, uid: string, role: UserRole): Promise<void> {
  await updateDoc(doc(db, "users", uid), {
    role,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Assign a business to a user, upgrading role to manager if needed.
 */
export async function assignBusinessToUser(db: Firestore, uid: string, serviceId: string): Promise<void> {
  const profile = await getUserProfile(db, uid);
  const currentServices = profile?.managedServices || [];
  const updatedServices = Array.from(new Set([...currentServices, serviceId]));

  const newRole = profile?.role === "admin" ? "admin" : "manager";

  await updateDoc(doc(db, "users", uid), {
    role: newRole,
    managedServices: updatedServices,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Remove a business from a user's managed services.
 */
export async function removeBusinessFromUser(db: Firestore, uid: string, serviceId: string): Promise<void> {
  const profile = await getUserProfile(db, uid);
  if (!profile) return;
  const currentServices = profile.managedServices || [];
  const updatedServices = currentServices.filter((s) => s !== serviceId);

  await updateDoc(doc(db, "users", uid), {
    managedServices: updatedServices,
    updatedAt: serverTimestamp(),
  });
}
