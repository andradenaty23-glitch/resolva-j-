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

export const MASTER_ADMIN_EMAIL = 'andradenaty23@gmail.com';

export function isMasterAdmin(emailOrUser?: string | { email?: string; tipo?: string } | null): boolean {
  if (!emailOrUser) return false;
  if (typeof emailOrUser === 'string') {
    return emailOrUser.toLowerCase().trim() === MASTER_ADMIN_EMAIL;
  }
  const email = emailOrUser.email?.toLowerCase().trim();
  return email === MASTER_ADMIN_EMAIL;
}

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
  const rawEmail = user.email || '';
  const email = rawEmail.toLowerCase().trim();
  const nome = user.displayName || user.name || (email ? email.split('@')[0] : 'Usuário');
  const foto = user.photoURL || user.picture || '';

  const isMaster = email === MASTER_ADMIN_EMAIL;
  const safeTipo: TipoUsuario = isMaster
    ? 'admin'
    : (tipoOverride === 'profissional' ? 'profissional' : 'cliente');

  const existing = await getFirebaseUserDoc(uid);

  if (existing) {
    const forcedTipo: TipoUsuario = isMaster
      ? 'admin'
      : (existing.tipo === 'admin' ? 'cliente' : (tipoOverride === 'profissional' ? 'profissional' : existing.tipo || 'cliente'));

    const updates: Partial<UsuarioDoc> = {
      atualizadoEm: new Date().toISOString(),
      ...(nome && !existing.nome ? { nome } : {}),
      ...(foto && !existing.foto ? { foto } : {}),
      ...(extraFields ? { ...extraFields } : {}),
      tipo: forcedTipo
    };

    const ref = doc(db, 'usuarios', uid);
    await updateDoc(ref, updates);
    return { ...existing, ...updates, tipo: forcedTipo };
  }

  const newUserDoc: UsuarioDoc = {
    uid,
    nome,
    email: rawEmail || email,
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
    role: userDoc.tipo === 'profissional' ? 'prestador' : 'cliente',
    tipo: userDoc.tipo,
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

export interface FormattedAuthError {
  title: string;
  message: string;
  code: string;
  isEmailInUse: boolean;
  isWrongPassword: boolean;
}

export function formatFirebaseAuthError(err: any): FormattedAuthError {
  const code = err?.code || (typeof err?.message === 'string' ? (err.message.match(/auth\/[a-z0-9-]+/i)?.[0] || '') : '');
  const messageStr = err?.message || '';

  if (code === 'auth/email-already-in-use' || messageStr.includes('email-already-in-use') || messageStr.includes('already registered')) {
    return {
      title: 'E-mail Já Cadastrado',
      message: 'Este endereço de e-mail já possui uma conta no Resolva Já. Você pode fazer login direto com sua senha ou redefini-la.',
      code: 'auth/email-already-in-use',
      isEmailInUse: true,
      isWrongPassword: false
    };
  }
  if (code === 'auth/weak-password' || messageStr.includes('weak-password')) {
    return {
      title: 'Senha Muito Curta',
      message: 'A senha deve ter no mínimo 6 caracteres para garantir a segurança da sua conta.',
      code: 'auth/weak-password',
      isEmailInUse: false,
      isWrongPassword: false
    };
  }
  if (code === 'auth/invalid-email' || messageStr.includes('invalid-email')) {
    return {
      title: 'E-mail Inválido',
      message: 'Por favor, digite um formato de e-mail válido (ex: seu.nome@email.com).',
      code: 'auth/invalid-email',
      isEmailInUse: false,
      isWrongPassword: false
    };
  }
  if (
    code === 'auth/invalid-credential' ||
    code === 'auth/user-not-found' ||
    code === 'auth/wrong-password' ||
    messageStr.includes('invalid-credential') ||
    messageStr.includes('user-not-found') ||
    messageStr.includes('wrong-password')
  ) {
    return {
      title: 'Credenciais Incorretas',
      message: 'E-mail ou senha inválidos. Verifique suas informações e tente novamente.',
      code: 'auth/invalid-credential',
      isEmailInUse: false,
      isWrongPassword: true
    };
  }
  if (code === 'auth/too-many-requests' || messageStr.includes('too-many-requests')) {
    return {
      title: 'Muitas Tentativas',
      message: 'O acesso a esta conta foi bloqueado temporariamente por excesso de tentativas. Tente novamente em instantes ou redefina a senha.',
      code: 'auth/too-many-requests',
      isEmailInUse: false,
      isWrongPassword: false
    };
  }
  if (code === 'auth/popup-closed-by-user' || messageStr.includes('popup-closed-by-user')) {
    return {
      title: 'Login Cancelado',
      message: 'A janela de login com o Google foi fechada antes da conclusão.',
      code: 'auth/popup-closed-by-user',
      isEmailInUse: false,
      isWrongPassword: false
    };
  }
  if (code === 'auth/network-request-failed' || messageStr.includes('network-request-failed')) {
    return {
      title: 'Erro de Conexão',
      message: 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
      code: 'auth/network-request-failed',
      isEmailInUse: false,
      isWrongPassword: false
    };
  }

  const cleanMessage = err?.message
    ? err.message.replace(/^Firebase:\s*/i, '').replace(/Error\s*\([a-z0-9\/-]+\):?/i, '').trim()
    : 'Ocorreu um erro ao processar sua solicitação.';

  return {
    title: 'Erro na Operação',
    message: cleanMessage || 'Verifique seus dados e tente novamente.',
    code: code || 'unknown',
    isEmailInUse: false,
    isWrongPassword: false
  };
}
