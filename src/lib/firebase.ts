import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

/**
 * Configuración Firebase — SOLO vía variables de entorno públicas (GR-13 / .clinerules).
 * Los valores se inyectan en build desde `.env` (local, gitignored) o desde el entorno de
 * build de Cloudflare. NUNCA hardcodear literales aquí: `npm run audit:security` lo bloquea.
 * Nota: las claves Web de Firebase no son secretas por diseño; la protección real vive en
 * firestore.rules, dominios autorizados y (recomendado) App Check.
 */
const env = (import.meta as any).env || {};
const firebaseConfig = {
  apiKey: env.PUBLIC_FIREBASE_API_KEY as string | undefined,
  authDomain: env.PUBLIC_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: env.PUBLIC_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: env.PUBLIC_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: env.PUBLIC_FIREBASE_APP_ID as string | undefined,
  measurementId: env.PUBLIC_FIREBASE_MEASUREMENT_ID as string | undefined,
};

/** True si la configuración mínima está presente (apiKey + projectId + appId). */
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);

// Initialize Firebase only once
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
if (typeof document !== "undefined") {
  auth.languageCode = document.documentElement.lang || "es";
}
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Safe Analytics initialization (Client-side only)
export let analytics: any = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}
