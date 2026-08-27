import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { UsuarioDoc, TipoUsuario, GoogleAuthUser } from '../types';

/**
 * Sync or create user document in Firestore 'usuarios' collection
 */
export async function syncUserDocument(
  user: User,
  preferredRole?: TipoUsuario,
  extraData?: Partial<UsuarioDoc>
): Promise<UsuarioDoc> {
  const userRef = doc(db, 'usuarios', user.uid);
  const userSnap = await getDoc(userRef);

  const now = new Date().toISOString();

  if (userSnap.exists()) {
    const existingData = userSnap.data() as UsuarioDoc;
    // Do not allow changing to admin unless already admin
    const roleToUse = existingData.tipo || preferredRole || 'cliente';

    const updatePayload: Partial<UsuarioDoc> = {
      nome: user.displayName || existingData.nome || user.email?.split('@')[0] || 'Usuário',
      email: user.email || existingData.email || '',
      foto: user.photoURL || existingData.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=ea580c&color=ffffff&bold=true`,
      atualizadoEm: now,
      ...extraData
    };

    // Protect admin role from unauthorized override
    if (extraData?.tipo && existingData.tipo !== 'admin' && extraData.tipo === 'admin') {
      delete updatePayload.tipo;
    }

    await updateDoc(userRef, updatePayload as Record<string, any>);
    return {
      ...existingData,
      ...updatePayload
    };
  } else {
    // New user creation
    const initialRole: TipoUsuario = preferredRole === 'admin' ? 'cliente' : (preferredRole || 'cliente');
    const newUser: UsuarioDoc = {
      uid: user.uid,
      nome: user.displayName || extraData?.nome || user.email?.split('@')[0] || (initialRole === 'cliente' ? 'Cliente Residencial' : 'Profissional PRO'),
      email: user.email || extraData?.email || '',
      foto: user.photoURL || extraData?.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=${initialRole === 'cliente' ? 'ea580c' : '16a34a'}&color=ffffff&bold=true`,
      telefone: user.phoneNumber || extraData?.telefone || '',
      tipo: initialRole,
      cidade: extraData?.cidade || 'São Paulo',
      bairro: extraData?.bairro || 'Centro',
      criadoEm: now,
      atualizadoEm: now,
      ...extraData
    };

    await setDoc(userRef, newUser);
    return newUser;
  }
}

/**
 * Get user document from Firestore
 */
export async function getUserProfile(uid: string): Promise<UsuarioDoc | null> {
  try {
    const userRef = doc(db, 'usuarios', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UsuarioDoc;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile from Firestore:', error);
    return null;
  }
}

/**
 * Update user document in Firestore
 */
export async function updateUserProfile(
  uid: string,
  data: Partial<UsuarioDoc>
): Promise<boolean> {
  try {
    const userRef = doc(db, 'usuarios', uid);
    const payload = {
      ...data,
      atualizadoEm: new Date().toISOString()
    };
    // Ensure uid is not changed
    delete (payload as any).uid;
    // Don't allow setting admin if unauthorized
    if (payload.tipo === 'admin') {
      delete payload.tipo;
    }
    await updateDoc(userRef, payload as Record<string, any>);
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
}

/**
 * Google Sign-In with Firebase Authentication
 */
export async function loginWithGoogle(
  preferredRole: TipoUsuario = 'cliente'
): Promise<{ user: GoogleAuthUser; usuarioDoc: UsuarioDoc } | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const usuarioDoc = await syncUserDocument(user, preferredRole);

    const googleUser: GoogleAuthUser = {
      id: user.uid,
      email: user.email || '',
      name: usuarioDoc.nome,
      picture: usuarioDoc.foto,
      verifiedEmail: user.emailVerified,
      role: usuarioDoc.tipo === 'profissional' ? 'prestador' : usuarioDoc.tipo,
      tipo: usuarioDoc.tipo,
      authProvider: 'google',
      connectedAt: new Date().toISOString()
    };

    return { user: googleUser, usuarioDoc };
  } catch (error: any) {
    console.error('Firebase Google Sign-In error:', error);
    throw error;
  }
}

/**
 * Email/Password Registration
 */
export async function registerWithEmailPassword(
  email: string,
  pass: string,
  nome: string,
  tipo: TipoUsuario = 'cliente',
  extra?: Partial<UsuarioDoc>
): Promise<{ user: GoogleAuthUser; usuarioDoc: UsuarioDoc }> {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  const user = result.user;

  if (nome) {
    await updateProfile(user, { displayName: nome });
  }

  const usuarioDoc = await syncUserDocument(user, tipo, { nome, ...extra });

  const authUser: GoogleAuthUser = {
    id: user.uid,
    email: user.email || email,
    name: usuarioDoc.nome,
    picture: usuarioDoc.foto,
    verifiedEmail: user.emailVerified,
    role: usuarioDoc.tipo === 'profissional' ? 'prestador' : usuarioDoc.tipo,
    tipo: usuarioDoc.tipo,
    authProvider: 'email',
    connectedAt: new Date().toISOString()
  };

  return { user: authUser, usuarioDoc };
}

/**
 * Email/Password Sign-In
 */
export async function loginWithEmailPassword(
  email: string,
  pass: string
): Promise<{ user: GoogleAuthUser; usuarioDoc: UsuarioDoc }> {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  const user = result.user;
  let usuarioDoc = await getUserProfile(user.uid);

  if (!usuarioDoc) {
    usuarioDoc = await syncUserDocument(user, 'cliente');
  }

  const authUser: GoogleAuthUser = {
    id: user.uid,
    email: user.email || email,
    name: usuarioDoc.nome,
    picture: usuarioDoc.foto,
    verifiedEmail: user.emailVerified,
    role: usuarioDoc.tipo === 'profissional' ? 'prestador' : usuarioDoc.tipo,
    tipo: usuarioDoc.tipo,
    authProvider: 'email',
    connectedAt: new Date().toISOString()
  };

  return { user: authUser, usuarioDoc };
}

/**
 * Send password reset email via Firebase Authentication
 */
export async function sendPasswordResetLink(email: string): Promise<void> {
  const cleanEmail = email.trim();
  if (!cleanEmail) {
    throw new Error('Informe um e-mail válido.');
  }
  await sendPasswordResetEmail(auth, cleanEmail);
}

/**
 * Logout from Firebase Auth
 */
export async function logoutFirebaseAuth(): Promise<void> {
  await signOut(auth);
}

/**
 * Listen to auth state changes
 */
export function onFirebaseAuthStateChanged(
  callback: (user: User | null, usuarioDoc: UsuarioDoc | null) => void
): () => void {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const profile = await getUserProfile(firebaseUser.uid);
      callback(firebaseUser, profile);
    } else {
      callback(null, null);
    }
  });
}

export const getUserDoc = getUserProfile;

