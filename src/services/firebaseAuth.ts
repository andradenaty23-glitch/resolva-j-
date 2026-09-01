import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup, 
  sendPasswordResetEmail 
} from 'firebase/auth';

export type TipoUsuario = 'cliente' | 'profissional' | 'admin';

export interface GoogleAuthUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  role: 'cliente' | 'prestador';
  authProvider: 'google' | 'email';
  verifiedEmail: boolean;
  connectedAt: string;
  tipo?: TipoUsuario;
}

export interface UsuarioDoc {
  uid: string;
  nome: string;
  email: string;
  foto?: string;
  telefone?: string;
  tipo: TipoUsuario;
  cidade?: string;
  bairro?: string;
  endereco?: string;
  cep?: string;
  cpf?: string;
  bio?: string;
  especialidades?: string[];
  raioKm?: number;
  valorBase?: number;
  chavePix?: string;
  avaliacaoMedia?: number;
  totalAvaliacoes?: number;
  criadoEm?: string;
  atualizadoEm?: string;
}

export async function getFirebaseUserDoc(uid: string): Promise<UsuarioDoc | null> {
  const ref = doc(db, 'usuarios', uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data() as UsuarioDoc;
  }
  return null;
}

export async function syncUserDocument(
  user: any,
  tipoOverride?: TipoUsuario,
  extraFields?: Partial<UsuarioDoc>
): Promise<UsuarioDoc> {
  const uid = user.uid || user.id;
  const email = user.email || '';
  const nome = user.displayName || email.split('@')[0] || 'Usuário';
  const foto = user.photoURL || '';

  const existing = await getFirebaseUserDoc(uid);
  
  const safeTipo: TipoUsuario = (tipoOverride === 'profissional' || tipoOverride === 'admin') 
    ? (tipoOverride === 'admin' ? (existing?.tipo === 'admin' ? 'admin' : 'cliente') : tipoOverride)
    : 'cliente';

  if (existing) {
    const updates: Partial<UsuarioDoc> = {
      atualizadoEm: new Date().toISOString(),
      ...(nome && !existing.nome ? { nome } : {}),
      ...(foto && !existing.foto ? { foto } : {}),
      ...(extraFields ? { ...extraFields } : {})
    };
    if (updates.tipo && updates.tipo === 'admin' && existing.tipo !== 'admin') {
      delete updates.tipo;
    }
    const ref = doc(db, 'usuarios', uid);
    await updateDoc(ref, updates);
    return { ...existing, ...updates };
  }

  const newUserDoc: UsuarioDoc = {
    uid,
    nome,
    email,
    foto,
    telefone: extraFields?.telefone || '',
    tipo: safeTipo,
    cidade: extraFields?.cidade || 'São Paulo',
    bairro: extraFields?.bairro || '',
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
    avaliacaoMedia: 5.0,
    totalAvaliacoes: 0,
    ...(extraFields || {})
  };

  const ref = doc(db, 'usuarios', uid);
  await setDoc(ref, newUserDoc);
  return newUserDoc;
}

export async function loginWithGoogle(tipo: TipoUsuario = 'cliente'): Promise<{ user: GoogleAuthUser; userDoc: UsuarioDoc } | null> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const userDoc = await syncUserDocument(user, tipo);
  
  const authUser: GoogleAuthUser = {
    id: user.uid,
    email: user.email || '',
    name: user.displayName || user.email?.split('@')[0] || 'Usuário',
    picture: user.photoURL || '',
    role: userDoc.tipo === 'profissional' ? 'prestador' : 'cliente',
    tipo: userDoc.tipo,
    authProvider: 'google',
    verifiedEmail: user.emailVerified,
    connectedAt: new Date().toISOString()
  };
  return { user: authUser, userDoc };
}

export async function registerWithEmailPassword(
  email: string,
  password: string,
  nome: string,
  tipo: TipoUsuario = 'cliente',
  extraFields?: Partial<UsuarioDoc>
): Promise<{ user: GoogleAuthUser; userDoc: UsuarioDoc; usuarioDoc: UsuarioDoc }> {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  // Add displayName to user artificially for sync
  const user = result.user;
  const userDoc = await syncUserDocument({ ...user, displayName: nome }, tipo, extraFields);
  
  const authUser: GoogleAuthUser = {
    id: user.uid,
    email: user.email || email,
    name: nome,
    picture: '',
    role: tipo === 'profissional' ? 'prestador' : 'cliente',
    tipo,
    authProvider: 'email',
    verifiedEmail: user.emailVerified,
    connectedAt: new Date().toISOString()
  };
  return { user: authUser, userDoc, usuarioDoc: userDoc };
}

export async function loginWithEmailPassword(
  email: string,
  password: string
): Promise<{ user: GoogleAuthUser; userDoc: UsuarioDoc; usuarioDoc: UsuarioDoc }> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const user = result.user;
  const userDoc = await syncUserDocument(user);
  
  const authUser: GoogleAuthUser = {
    id: user.uid,
    email: user.email || email,
    name: userDoc.nome || user.email?.split('@')[0] || 'Usuário',
    picture: userDoc.foto || '',
    role: userDoc.tipo === 'profissional' ? 'prestador' : 'cliente',
    tipo: userDoc.tipo,
    authProvider: 'email',
    verifiedEmail: user.emailVerified,
    connectedAt: new Date().toISOString()
  };
  return { user: authUser, userDoc, usuarioDoc: userDoc };
}

export async function sendPasswordResetLink(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function logoutFirebaseAuth(): Promise<void> {
  await signOut(auth);
}

export function onFirebaseAuthStateChanged(
  callback: (user: any | null, userDoc: UsuarioDoc | null) => void
): () => void {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      const doc = await syncUserDocument(user);
      callback(user, doc);
    } else {
      callback(null, null);
    }
  });
  return unsubscribe;
}

export async function updateUsuarioDoc(
  uid: string,
  updates: Partial<UsuarioDoc>
): Promise<UsuarioDoc | null> {
  const payload = {
    ...updates,
    atualizadoEm: new Date().toISOString()
  };
  const ref = doc(db, 'usuarios', uid);
  await updateDoc(ref, payload);
  const snap = await getDoc(ref);
  return snap.data() as UsuarioDoc;
}
