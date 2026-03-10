import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getAuth } from 'firebase/auth';

// TODO: Replace with your actual Firebase Project keys from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSy_MOCK_KEY_FOR_DEV",
  authDomain: "petzeno-app.firebaseapp.com",
  projectId: "petzeno-app",
  storageBucket: "petzeno-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123"
};

// Initialize Firebase (using web SDK compatibility in React Native for rapid prototyping)
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const auth = getAuth(app);
