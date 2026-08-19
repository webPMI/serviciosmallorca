import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBRDBaaSYufdiT92d2NO59ye4XMIW0kems",
  authDomain: "test-app-ea107.firebaseapp.com",
  projectId: "test-app-ea107",
  storageBucket: "test-app-ea107.firebasestorage.app",
  messagingSenderId: "335807990622",
  appId: "1:335807990622:web:d98815d9a0aabc526a9dcf",
  measurementId: "G-93WD7Y7CG2",
};

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export { app };
export const auth = getAuth(app);
auth.languageCode = "es"; // Idioma por defecto para correos y flujos de auth
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);