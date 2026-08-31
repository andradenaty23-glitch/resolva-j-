import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

let appInstance: FirebaseApp;
let authInstance: Auth;
let dbInstance: Firestore;

try {
  console.log('[Firebase Init] 🚀 Inicializando Firebase SDK com a configuração:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    firestoreDatabaseId: (firebaseConfig as any).firestoreDatabaseId
  });

  appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  authInstance = getAuth(appInstance);

  const customDbId = (firebaseConfig as any).firestoreDatabaseId;
  dbInstance = customDbId ? getFirestore(appInstance, customDbId) : getFirestore(appInstance);

  console.log('[Firebase Init] ✅ Firebase App, Auth e Firestore inicializados com sucesso.');
} catch (err: any) {
  console.error('[Firebase Init] ❌ Erro ao inicializar o Firebase:', err);
  throw err;
}

export const app = appInstance;
export const auth = authInstance;
export const db = dbInstance;

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

