import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { auth } from "./firebase";

export type UserRole = "guest" | "user" | "manager" | "admin";

export interface AuthState {
  user: User | null;
  role: UserRole;
  loading: boolean;
}

type AuthListener = (state: AuthState) => void;

class AuthStore {
  private listeners: Set<AuthListener> = new Set();
  private db = getFirestore();
  private state: AuthState = {
    user: null,
    role: "guest",
    loading: true,
  };

  constructor() {
    if (typeof window !== "undefined") {
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          this.state = { user: null, role: "guest", loading: false };
          this.notify();
          return;
        }

        // Fetch User Role from Firestore (or fallback logic)
        let role: UserRole = "user";
        try {
          // Check Custom Claims or Firestore Document
          const tokenResult = await user.getIdTokenResult();
          if (tokenResult.claims.role) {
            role = tokenResult.claims.role as UserRole;
          } else {
            const userDoc = await getDoc(doc(this.db, "users", user.uid));
            const exists = typeof userDoc.exists === "function" ? userDoc.exists() : Boolean(userDoc.exists);
            const data = userDoc.data();
            if (exists && data?.role) {
              role = data.role as UserRole;
            }
          }
        } catch (e) {
          console.warn("Could not fetch user role, defaulting to 'user':", e);
        }

        this.state = {
          user,
          role,
          loading: false,
        };
        this.notify();
      });
    }
  }

  public getState(): AuthState {
    return this.state;
  }

  public subscribe(listener: AuthListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public async logout(): Promise<void> {
    await signOut(auth);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }
}

export const authStore = new AuthStore();
