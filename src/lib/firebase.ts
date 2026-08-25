import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBeh-ylABQWqgiHOnnG8p85wXNlnKgL7jg",
  authDomain: "serviciosmallorca.firebaseapp.com",
  projectId: "serviciosmallorca",
  storageBucket: "serviciosmallorca.firebasestorage.app",
  messagingSenderId: "447334695021",
  appId: "1:447334695021:web:be1fb816461387666dbf64",
  measurementId: "G-PMT1ZM3WQN",
};

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
