import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCjpeymBeOP49stkDkyFcy2XkFIpe3-PKE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "authentic-beauty-87.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "authentic-beauty-87",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "authentic-beauty-87.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "75444570958",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:75444570958:web:02e55a4e3401c2daa8ac1f",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-FFB6RS26V9",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export { app };

