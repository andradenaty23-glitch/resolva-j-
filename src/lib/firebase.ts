import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAg2E7AfYkV-wbi6yQLxWRLdAUXyuwb0D0",
  authDomain: "gen-lang-client-0434342550.firebaseapp.com",
  projectId: "gen-lang-client-0434342550",
  storageBucket: "gen-lang-client-0434342550.firebasestorage.app",
  messagingSenderId: "783432282572",
  appId: "1:783432282572:web:629d00cefceb4c2b29ed69",
  measurementId: "G-GJ0G94MXLT"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-resolvaj-ec52491c-2aa9-42c8-b36b-624795e773e6");

export default app;
