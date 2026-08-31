import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
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
  console.log(`[Auth Diagnostic] 🔍 Consulta por e-mail iniciada no Firestore: ${cleanEmail}`);
  try {
    const colRef = collection(db, 'usuarios');
    const q1 = query(colRef, where('email', '==', cleanEmail));
    const snap1 = await getDocs(q1);
    if (!snap1.empty) {
      const firstDoc = snap1.docs[0];
      console.log(`[Auth Diagnostic] ✅ Perfil encontrado no Firestore via query por e-mail (Doc ID: ${firstDoc.id})`);
      return { id: firstDoc.id, data: firstDoc.data() as UsuarioDoc };
    }

    if (email !== cleanEmail) {
      const q2 = query(colRef, where('email', '==', email));
      const snap2 = await getDocs(q2);
      if (!snap2.empty) {
        const firstDoc = snap2.docs[0];
        console.log(`[Auth Diagnostic] ✅ Perfil encontrado no Firestore via query por e-mail original (Doc ID: ${firstDoc.id})`);
        return { id: firstDoc.id, data: firstDoc.data() as UsuarioDoc };
      }
    }

    // Secondary lookup using doc ID = cleanEmail
    const docByEmailId = await getDoc(doc(db, 'usuarios', cleanEmail));
    if (docByEmailId.exists()) {
      console.log(`[Auth Diagnostic] ✅ Perfil encontrado no Firestore por Doc ID de e-mail (${cleanEmail})`);
      return { id: docByEmailId.id, data: docByEmailId.data() as UsuarioDoc };
    }

    // Scan collection for case-insensitive email match
    const allSnap = await getDocs(colRef);
    for (const d of allSnap.docs) {
      const dData = d.data() as UsuarioDoc;
      if (dData?.email && dData.email.trim().toLowerCase() === cleanEmail) {
        console.log(`[Auth Diagnostic] ✅ Perfil encontrado via varredura de e-mail (Doc ID: ${d.id})`);
        return { id: d.id, data: dData };
      }
    }
    console.log(`[Auth Diagnostic] ℹ️ Nenhum perfil pré-existente encontrado no Firestore para o e-mail: ${cleanEmail}`);
    return null;
  } catch (err) {
    console.warn('[Auth Diagnostic] ⚠️ Erro durante busca por e-mail no Firestore:', err);
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

  console.log(`[Auth Diagnostic] 📄 Iniciando sincronização no Firestore para UID: ${user.uid}`);

  let existingData: UsuarioDoc | null = null;
  let oldDocId: string | null = null;

  // 1. Try lookup by exact Firebase Auth UID
  try {
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      existingData = userSnap.data() as UsuarioDoc;
      oldDocId = userSnap.id;
      console.log(`[Auth Diagnostic] ✅ Perfil diretamente localizado no Firestore por UID: ${user.uid}`);
    }
  } catch (err) {
    console.warn('[Auth Diagnostic] ⚠️ Não foi possível consultar o documento diretamente pelo UID:', err);
  }

  // 2. If not found by UID, search by email to connect existing Firestore records
  if (!existingData && user.email) {
    console.log(`[Auth Diagnostic] 🔍 Buscando se existe histórico do e-mail (${user.email}) no Firestore...`);
    const foundByEmail = await findUserDocByEmail(user.email);
    if (foundByEmail) {
      existingData = foundByEmail.data;
      oldDocId = foundByEmail.id;
      console.log(`[Auth Diagnostic] 🔗 Conectando dados do perfil existente (Doc ID: ${oldDocId}) ao novo UID do Firebase Auth (${user.uid})`);
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
  console.log('[GOOGLE LOGIN] Clique recebido');
  console.log('[GOOGLE LOGIN] Criando GoogleAuthProvider');
  
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account'
  });

  // Timeout safeguard to prevent infinite hanging when popup is blocked silently by the browser
  const timeoutMs = 20000;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      const err: any = new Error('O login do Google demorou muito para responder. O navegador pode ter bloqueado o pop-up.');
      err.code = 'auth/popup-timeout';
      reject(err);
    }, timeoutMs);
  });

  try {
    console.log('[GOOGLE LOGIN] Chamando signInWithPopup');
    const popupPromise = signInWithPopup(auth, provider);
    const result = await Promise.race([popupPromise, timeoutPromise]);
    if (timeoutId) clearTimeout(timeoutId);

    console.log('[GOOGLE LOGIN] Popup retornou');
    const user = result.user;

    console.log('[GOOGLE LOGIN] Firebase User recebido');
    console.log(`[GOOGLE LOGIN] UID recebido: ${user.uid}`);
    console.log(`[Auth Diagnostic] 📧 E-mail: ${user.email}`);
    console.log(`[Auth Diagnostic] 👤 Nome: ${user.displayName || 'Sem nome público'}`);

    const isSuperAdmin = user.email?.toLowerCase() === 'andradenaty23@gmail.com';
    const roleToUse: TipoUsuario = isSuperAdmin ? 'admin' : preferredRole;

    console.log('[GOOGLE LOGIN] Consulta Firestore iniciada');
    const usuarioDoc = await syncUserDocument(user, roleToUse);
    console.log('[GOOGLE LOGIN] Consulta Firestore concluída');
    console.log(`[Auth Diagnostic] 🎉 Perfil ativo: "${usuarioDoc.nome}" (${usuarioDoc.tipo})`);

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
    if (timeoutId) clearTimeout(timeoutId);
    console.error('[GOOGLE LOGIN] ❌ Erro durante o login com Google:', error?.code, error?.message, error);
    if (error?.code === 'auth/popup-blocked') {
      console.log('[GOOGLE LOGIN] ⚠️ Popup bloqueado. Tentando redirecionar via signInWithRedirect...');
      try {
        await signInWithRedirect(auth, provider);
        return null;
      } catch (redirectErr: any) {
        console.error('[GOOGLE LOGIN] ❌ Fallback para signInWithRedirect falhou:', redirectErr?.code, redirectErr?.message);
        throw error;
      }
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
      console.log(`[Auth State Change] 🟢 Firebase Auth determinou sessão ativa para UID: ${firebaseUser.uid} (${firebaseUser.email})`);
      let profile = await getUserProfile(firebaseUser.uid);
      if (!profile && firebaseUser.email) {
        console.log(`[Auth State Change] 🔍 Perfil não encontrado por UID direto. Buscando por e-mail (${firebaseUser.email})...`);
        const foundByEmail = await findUserDocByEmail(firebaseUser.email);
        if (foundByEmail) {
          profile = foundByEmail.data;
        }
      }
      if (!profile || profile.uid !== firebaseUser.uid) {
        profile = await syncUserDocument(firebaseUser);
      }
      console.log(`[Auth State Change] ✅ Perfil carregado com sucesso: "${profile.nome}" | Tipo: ${profile.tipo}`);
      callback(firebaseUser, profile);
    } else {
      console.log('[Auth State Change] ⚪ Nenhuma sessão ativa no Firebase Auth.');
      callback(null, null);
    }
  });
}

export const getUserDoc = getUserProfile;

