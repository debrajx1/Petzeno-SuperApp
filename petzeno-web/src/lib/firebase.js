import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getAuth } from 'firebase/auth';

// TODO: Replace with your actual Firebase Project keys from the Firebase Console
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSy_MOCK_KEY_FOR_DEV",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "petzeno-app.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "petzeno-app",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "petzeno-app.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const auth = getAuth(app);
