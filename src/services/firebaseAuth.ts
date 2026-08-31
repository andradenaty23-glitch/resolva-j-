import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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
  getDocs,
  setDoc,
  updateDoc,
  collection,
  query,
  where
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { UsuarioDoc, TipoUsuario, GoogleAuthUser } from '../types';

/**
 * Search Firestore 'usuarios' collection for an existing document matching the email
 */
export async function findUserDocByEmail(email: string): Promise<{ id: string; data: UsuarioDoc } | null> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) return null;
  try {
    const colRef = collection(db, 'usuarios');
    const q = query(colRef, where('email', '==', cleanEmail));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const firstDoc = snap.docs[0];
      return { id: firstDoc.id, data: firstDoc.data() as UsuarioDoc };
    }

    // Secondary lookup using doc ID = email or lowercased email
    const docByEmailId = await getDoc(doc(db, 'usuarios', cleanEmail));
    if (docByEmailId.exists()) {
      return { id: docByEmailId.id, data: docByEmailId.data() as UsuarioDoc };
    }

    // Scan collection for case-insensitive email match or legacy document ID format
    const allSnap = await getDocs(colRef);
    for (const d of allSnap.docs) {
      const dData = d.data() as UsuarioDoc;
      if (dData?.email && dData.email.trim().toLowerCase() === cleanEmail) {
        return { id: d.id, data: dData };
      }
    }
    return null;
  } catch (err) {
    console.warn('Error searching user doc by email:', err);
    return null;
  }
}

/**
 * Sync or create user document in Firestore 'usuarios' collection
 */
export async function syncUserDocument(
  user: User,
  preferredRole?: TipoUsuario,
  extraData?: Partial<UsuarioDoc>
): Promise<UsuarioDoc> {
  const userRef = doc(db, 'usuarios', user.uid);
  const now = new Date().toISOString();

  let existingData: UsuarioDoc | null = null;
  let oldDocId: string | null = null;

  // 1. Try lookup by exact Firebase Auth UID
  try {
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      existingData = userSnap.data() as UsuarioDoc;
      oldDocId = userSnap.id;
    }
  } catch (err) {
    console.warn('Could not fetch user doc by UID:', err);
  }

  // 2. If not found by UID, search by email to connect existing Firestore records
  if (!existingData && user.email) {
    const foundByEmail = await findUserDocByEmail(user.email);
    if (foundByEmail) {
      existingData = foundByEmail.data;
      oldDocId = foundByEmail.id;
    }
  }

  const isSuperAdminEmail = user.email?.toLowerCase() === 'andradenaty23@gmail.com';

  let roleToUse: TipoUsuario = 'cliente';
  if (isSuperAdminEmail) {
    roleToUse = 'admin';
  } else if (existingData?.tipo) {
    roleToUse = existingData.tipo;
  } else if (preferredRole) {
    roleToUse = preferredRole === 'admin' ? 'cliente' : preferredRole;
  }

  const mergedDoc: UsuarioDoc = {
    ...existingData,
    uid: user.uid,
    nome:
      extraData?.nome ||
      user.displayName ||
      existingData?.nome ||
      user.email?.split('@')[0] ||
      (roleToUse === 'profissional' ? 'Profissional PRO' : 'Cliente Residencial'),
    email: user.email || extraData?.email || existingData?.email || '',
    foto:
      extraData?.foto ||
      user.photoURL ||
      existingData?.foto ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user.displayName || user.email?.split('@')[0] || 'User'
      )}&background=${roleToUse === 'profissional' ? '16a34a' : 'ea580c'}&color=ffffff&bold=true`,
    telefone: extraData?.telefone || user.phoneNumber || existingData?.telefone || '',
    tipo: roleToUse,
    cidade: extraData?.cidade || existingData?.cidade || 'São Paulo',
    bairro: extraData?.bairro || existingData?.bairro || 'Centro',
    criadoEm: existingData?.criadoEm || now,
    atualizadoEm: now,
    ...extraData
  };

  // Ensure uid and type rules are respected
  mergedDoc.uid = user.uid;
  mergedDoc.tipo = roleToUse;

  // Save/merge into usuarios/{user.uid}
  await setDoc(userRef, mergedDoc, { merge: true });

  // If there was an old legacy document ID, sync it with the new UID so references work
  if (oldDocId && oldDocId !== user.uid) {
    try {
      await setDoc(doc(db, 'usuarios', oldDocId), { ...mergedDoc, uid: user.uid }, { merge: true });
    } catch (e) {
      console.warn('Could not sync old user doc ID:', e);
    }
  }

  return mergedDoc;
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
 * Check redirect result after returning from Google redirect sign-in
 */
export async function checkRedirectResult(): Promise<{ user: GoogleAuthUser; usuarioDoc: UsuarioDoc } | null> {
  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      const user = result.user;
      const isSuperAdmin = user.email?.toLowerCase() === 'andradenaty23@gmail.com';
      const roleToUse: TipoUsuario = isSuperAdmin ? 'admin' : 'cliente';
      const usuarioDoc = await syncUserDocument(user, roleToUse);
      const token = await user.getIdToken().catch(() => undefined);
      const googleUser: GoogleAuthUser = {
        id: user.uid,
        email: user.email || '',
        name: usuarioDoc.nome || user.displayName || 'Usuário Google',
        picture: usuarioDoc.foto || user.photoURL || '',
        verifiedEmail: user.emailVerified ?? true,
        role: usuarioDoc.tipo === 'profissional' ? 'prestador' : usuarioDoc.tipo,
        tipo: usuarioDoc.tipo,
        authProvider: 'google',
        token,
        connectedAt: new Date().toISOString()
      };
      return { user: googleUser, usuarioDoc };
    }
    return null;
  } catch (error) {
    console.error('Error checking redirect result:', error);
    return null;
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
    const isSuperAdmin = user.email?.toLowerCase() === 'andradenaty23@gmail.com';
    const roleToUse: TipoUsuario = isSuperAdmin ? 'admin' : preferredRole;

    const usuarioDoc = await syncUserDocument(user, roleToUse);
    const token = await user.getIdToken().catch(() => undefined);

    const googleUser: GoogleAuthUser = {
      id: user.uid,
      email: user.email || '',
      name: usuarioDoc.nome || user.displayName || 'Usuário Google',
      picture: usuarioDoc.foto || user.photoURL || '',
      verifiedEmail: user.emailVerified ?? true,
      role: usuarioDoc.tipo === 'profissional' ? 'prestador' : usuarioDoc.tipo,
      tipo: usuarioDoc.tipo,
      authProvider: 'google',
      token,
      connectedAt: new Date().toISOString()
    };

    return { user: googleUser, usuarioDoc };
  } catch (error: any) {
    console.error('Firebase Google Sign-In error:', error);
    if (error?.code === 'auth/popup-blocked') {
      console.log('Popup blocked, attempting signInWithRedirect fallback...');
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
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
      let profile = await getUserProfile(firebaseUser.uid);
      if (!profile && firebaseUser.email) {
        const foundByEmail = await findUserDocByEmail(firebaseUser.email);
        if (foundByEmail) {
          profile = foundByEmail.data;
        }
      }
      if (!profile || profile.uid !== firebaseUser.uid) {
        profile = await syncUserDocument(firebaseUser);
      }
      callback(firebaseUser, profile);
    } else {
      callback(null, null);
    }
  });
}

export const getUserDoc = getUserProfile;

