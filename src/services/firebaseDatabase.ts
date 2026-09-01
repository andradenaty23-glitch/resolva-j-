import { db, auth } from '../lib/firebase';
import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, 
  query, where, orderBy, onSnapshot, limit, getDocFromServer
} from 'firebase/firestore';
import { UsuarioDoc, isMasterAdmin } from './firebaseAuth';
import { sanitizeInput, generateSecurityPIN } from '../utils/security';

// Tipos
export interface CategoriaDoc { id: string; nome: string; descricao?: string; icone?: string; ativa?: boolean; criadoEm?: string; }
export interface ServicoDoc { id: string; profissionalId: string; profissionalNome: string; profissionalFoto?: string; nome: string; descricao: string; categoriaId: string; categoriaNome: string; preco: number; cidade: string; bairro?: string; endereco?: string; telefone?: string; whatsapp?: string; imagem?: string; ativo?: boolean; avaliacaoMedia?: number; totalAvaliacoes?: number; criadoEm?: string; atualizadoEm?: string; }
export interface SolicitacaoDoc {
  id: string;
  servicoId: string;
  servicoNome: string;
  categoriaId?: string;
  categoriaNome?: string;
  clienteId: string;
  clienteNome?: string;
  clienteEmail?: string;
  clienteTelefone?: string;
  clienteFoto?: string;
  profissionalId: string;
  profissionalNome?: string;
  profissionalFoto?: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  data?: string;
  horario?: string;
  dataSolicitacao?: string;
  descricao: string;
  valorEstimado?: number;
  valor?: number;
  status: 'pendente' | 'aceita' | 'em_andamento' | 'concluida' | 'cancelada' | 'recusada';
  observacao?: string;
  criadoEm?: string;
  atualizadoEm?: string;
}
export interface AvaliacaoDoc { id: string; solicitacaoId: string; servicoId: string; profissionalId: string; clienteId: string; clienteNome: string; clienteFoto?: string; nota: number; comentario?: string; criadoEm?: string; }
export interface FavoritoDoc { id: string; usuarioId: string; servicoId: string; criadoEm?: string; }
export interface NotificacaoDoc { id: string; usuarioId: string; titulo: string; mensagem: string; lida: boolean; linkAcao?: string; tipo?: 'info' | 'sucesso' | 'alerta' | 'erro' | 'success' | 'alert' | 'warning'; criadoEm?: string; }

// Error Logging & Handling conforming to Firebase Integration Standard
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): FirestoreErrorInfo {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('[Firestore Log]:', JSON.stringify(errInfo));
  return errInfo;
}

// Test Connection Helper
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'categorias', 'ping'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or network is reconnecting.');
    }
    return false;
  }
}

// Categorias
export function subscribeCategorias(callback: (categorias: CategoriaDoc[]) => void): () => void {
  const path = 'categorias';
  try {
    const q = query(collection(db, path), orderBy('nome', 'asc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => d.data() as CategoriaDoc));
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return () => {};
  }
}

// Serviços
export function subscribeServicos(callback: (servicos: ServicoDoc[]) => void): () => void {
  const path = 'servicos';
  try {
    const q = query(collection(db, path), orderBy('criadoEm', 'desc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => d.data() as ServicoDoc));
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return () => {};
  }
}

export function subscribeServicosRecentes(limite: number = 6, callback: (servicos: ServicoDoc[]) => void): () => void {
  const path = 'servicos';
  try {
    const q = query(collection(db, path), where('ativo', '==', true), orderBy('criadoEm', 'desc'), limit(limite));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => d.data() as ServicoDoc));
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return () => {};
  }
}

export function subscribeServicosByProfissional(profissionalId: string, callback: (servicos: ServicoDoc[]) => void): () => void {
  const path = 'servicos';
  try {
    const q = query(collection(db, path), where('profissionalId', '==', profissionalId), orderBy('criadoEm', 'desc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => d.data() as ServicoDoc));
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return () => {};
  }
}

export function subscribeProfissionais(callback: (profissionais: UsuarioDoc[]) => void): () => void {
  const path = 'usuarios';
  try {
    const q = query(collection(db, path), where('tipo', '==', 'profissional'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => d.data() as UsuarioDoc));
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return () => {};
  }
}

export async function addServico(servico: Omit<ServicoDoc, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<string> {
  const path = 'servicos';
  try {
    const id = `srv-${Date.now()}`;
    const docRef = doc(db, path, id);
    await setDoc(docRef, { ...servico, id, criadoEm: new Date().toISOString(), atualizadoEm: new Date().toISOString() });
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    throw err;
  }
}

export async function updateServico(id: string, updates: Partial<ServicoDoc>): Promise<void> {
  const path = `servicos/${id}`;
  try {
    const docRef = doc(db, 'servicos', id);
    await updateDoc(docRef, { ...updates, atualizadoEm: new Date().toISOString() });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
    throw err;
  }
}

export async function deleteServico(id: string): Promise<void> {
  const path = `servicos/${id}`;
  try {
    await deleteDoc(doc(db, 'servicos', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
    throw err;
  }
}

// Solicitações
export function subscribeSolicitacoes(
  usuarioId: string,
  tipo: 'cliente' | 'profissional' | 'admin',
  callback: (solicitacoes: SolicitacaoDoc[]) => void
): () => void {
  const path = 'solicitacoes';
  try {
    // Only subscribe if user is signed in
    if (!auth.currentUser) {
      callback([]);
      return () => {};
    }

    if (tipo === 'admin') {
      if (!isMasterAdmin(auth.currentUser.email)) {
        callback([]);
        return () => {};
      }
      const q = query(collection(db, path), orderBy('criadoEm', 'desc'));
      return onSnapshot(q, (snap) => {
        callback(snap.docs.map(d => d.data() as SolicitacaoDoc));
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, path);
      });
    }

    const field = tipo === 'cliente' ? 'clienteId' : 'profissionalId';
    const q = query(collection(db, path), where(field, '==', usuarioId), orderBy('criadoEm', 'desc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => d.data() as SolicitacaoDoc));
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return () => {};
  }
}

export async function createSolicitacao(data: Omit<SolicitacaoDoc, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<string> {
  const path = 'solicitacoes';
  try {
    const id = `sol-${Date.now()}`;
    const securePin = generateSecurityPIN();
    const sanitizedData = {
      ...data,
      descricao: sanitizeInput(data.descricao || '', 1000),
      observacao: data.observacao ? sanitizeInput(data.observacao, 500) : '',
      endereco: data.endereco ? sanitizeInput(data.endereco, 300) : '',
      servicoNome: sanitizeInput(data.servicoNome || 'Atendimento Especializado', 150),
      codigoSeguranca: securePin,
      garantiaAtiva: true,
      custodiaProtegida: true,
      id,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    };
    await setDoc(doc(db, path, id), sanitizedData);
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    throw err;
  }
}

export async function updateSolicitacaoStatus(id: string, status: SolicitacaoDoc['status'], observacao?: string): Promise<void> {
  const path = `solicitacoes/${id}`;
  try {
    const updates: any = { status, atualizadoEm: new Date().toISOString() };
    if (observacao !== undefined) updates.observacao = sanitizeInput(observacao, 500);
    await updateDoc(doc(db, 'solicitacoes', id), updates);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
    throw err;
  }
}

export async function updateSolicitacao(id: string, updates: Partial<SolicitacaoDoc>): Promise<void> {
  const path = `solicitacoes/${id}`;
  try {
    const sanitized: any = { ...updates, atualizadoEm: new Date().toISOString() };
    if (sanitized.descricao) sanitized.descricao = sanitizeInput(sanitized.descricao, 1000);
    if (sanitized.observacao) sanitized.observacao = sanitizeInput(sanitized.observacao, 500);
    await updateDoc(doc(db, 'solicitacoes', id), sanitized);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
    throw err;
  }
}

// Avaliações
export function subscribeAvaliacoes(servicoId: string, callback: (avaliacoes: AvaliacaoDoc[]) => void): () => void {
  const path = 'avaliacoes';
  try {
    const q = query(collection(db, path), where('servicoId', '==', servicoId), orderBy('criadoEm', 'desc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => d.data() as AvaliacaoDoc));
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return () => {};
  }
}

export async function addAvaliacao(data: Omit<AvaliacaoDoc, 'id' | 'criadoEm'>): Promise<string> {
  const path = 'avaliacoes';
  try {
    const id = `av-${Date.now()}`;
    const sanitizedComment = data.comentario ? sanitizeInput(data.comentario, 1000) : '';
    const safeRating = Math.max(1, Math.min(5, Number(data.nota) || 5));
    await setDoc(doc(db, path, id), {
      ...data,
      id,
      nota: safeRating,
      comentario: sanitizedComment,
      criadoEm: new Date().toISOString()
    });
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    throw err;
  }
}

// Favoritos
export function subscribeFavoritos(usuarioId: string, callback: (favoritos: FavoritoDoc[]) => void): () => void {
  const path = 'favoritos';
  try {
    if (!auth.currentUser || (auth.currentUser.uid !== usuarioId && !isMasterAdmin(auth.currentUser.email))) {
      callback([]);
      return () => {};
    }
    const q = query(collection(db, path), where('usuarioId', '==', usuarioId));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => d.data() as FavoritoDoc));
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return () => {};
  }
}

export async function toggleFavorito(usuarioId: string, servicoId: string): Promise<boolean> {
  const path = 'favoritos';
  try {
    const q = query(collection(db, path), where('usuarioId', '==', usuarioId), where('servicoId', '==', servicoId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      await deleteDoc(snap.docs[0].ref);
      return false;
    }
    const id = `fav-${Date.now()}`;
    await setDoc(doc(db, path, id), { id, usuarioId, servicoId, criadoEm: new Date().toISOString() });
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    throw err;
  }
}

// Notificações
export function subscribeNotificacoes(usuarioId: string, callback: (notificacoes: NotificacaoDoc[]) => void): () => void {
  const path = 'notificacoes';
  try {
    if (!auth.currentUser || (auth.currentUser.uid !== usuarioId && !isMasterAdmin(auth.currentUser.email))) {
      callback([]);
      return () => {};
    }
    const q = query(collection(db, path), where('usuarioId', '==', usuarioId), orderBy('criadoEm', 'desc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => d.data() as NotificacaoDoc));
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return () => {};
  }
}

export async function createNotificacao(data: Omit<NotificacaoDoc, 'id' | 'criadoEm' | 'lida'>): Promise<string> {
  const path = 'notificacoes';
  try {
    const id = `notif-${Date.now()}`;
    await setDoc(doc(db, path, id), { ...data, id, lida: false, criadoEm: new Date().toISOString() });
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    throw err;
  }
}
export const addNotificacao = createNotificacao;

export async function marcarNotificacaoLida(id: string): Promise<void> {
  const path = `notificacoes/${id}`;
  try {
    await updateDoc(doc(db, 'notificacoes', id), { lida: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
    throw err;
  }
}

export async function marcarTodasNotificacoesLidas(usuarioId: string): Promise<void> {
  const path = 'notificacoes';
  try {
    const q = query(collection(db, path), where('usuarioId', '==', usuarioId), where('lida', '==', false));
    const snap = await getDocs(q);
    const batch = snap.docs.map(d => updateDoc(d.ref, { lida: true }));
    await Promise.all(batch);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
    throw err;
  }
}

// Admin
export function subscribeAllUsuarios(callback: (usuarios: UsuarioDoc[]) => void): () => void {
  const path = 'usuarios';
  try {
    const q = query(collection(db, path), orderBy('criadoEm', 'desc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => d.data() as UsuarioDoc));
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return () => {};
  }
}

export function subscribeAllServicosAdmin(callback: (servicos: ServicoDoc[]) => void): () => void {
  const path = 'servicos';
  try {
    const q = query(collection(db, path), orderBy('criadoEm', 'desc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => d.data() as ServicoDoc));
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return () => {};
  }
}

export function subscribeAllSolicitacoesAdmin(callback: (solicitacoes: SolicitacaoDoc[]) => void): () => void {
  const path = 'solicitacoes';
  try {
    if (!auth.currentUser || !isMasterAdmin(auth.currentUser.email)) {
      callback([]);
      return () => {};
    }
    const q = query(collection(db, path), orderBy('criadoEm', 'desc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => d.data() as SolicitacaoDoc));
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return () => {};
  }
}

export async function deleteUsuario(uid: string): Promise<void> {
  const path = `usuarios/${uid}`;
  try {
    await deleteDoc(doc(db, 'usuarios', uid));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
    throw err;
  }
}

export async function deleteUsuarioByEmail(email: string): Promise<{ success: boolean; message: string; deletedCount: number }> {
  const path = 'usuarios';
  try {
    const q = query(collection(db, path), where('email', '==', email.trim().toLowerCase()));
    const snap = await getDocs(q);
    let deletedCount = 0;
    if (!snap.empty) {
      for (const d of snap.docs) {
        await deleteDoc(d.ref);
        deletedCount++;
      }
    }
    return { success: true, message: 'Usuário deletado', deletedCount };
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
    throw err;
  }
}
export const purgeAllDataByEmail = deleteUsuarioByEmail;

export async function updateUsuarioSecurityStatus(
  uid: string,
  securityUpdates: {
    seloSeguranca?: boolean;
    cpfVerificado?: boolean;
    antecedentesVerificados?: boolean;
    identidadeVerificada?: boolean;
    statusVerificacao?: 'aprovado' | 'em_analise' | 'pendente';
    scoreSeguranca?: number;
  }
): Promise<void> {
  const path = `usuarios/${uid}`;
  try {
    await updateDoc(doc(db, 'usuarios', uid), {
      ...securityUpdates,
      atualizadoEm: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
    throw err;
  }
}

export async function addCategoria(cat: Omit<CategoriaDoc, 'id' | 'criadoEm'>): Promise<string> {
  const path = 'categorias';
  try {
    const id = `cat-${Date.now()}`;
    await setDoc(doc(db, path, id), { ...cat, id, criadoEm: new Date().toISOString() });
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    throw err;
  }
}

export async function seedDefaultCategoriasIfEmpty(): Promise<void> {
  const path = 'categorias';
  try {
    const q = query(collection(db, path), limit(1));
    const snap = await getDocs(q);
    if (snap.empty && auth.currentUser) {
      await addCategoria({ nome: 'Elétrica', ativa: true });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}

export function subscribeSolicitacoesCliente(uid: string, cb: (s: SolicitacaoDoc[]) => void) {
  return subscribeSolicitacoes(uid, 'cliente', cb);
}

export function subscribeSolicitacoesProfissional(uid: string, cb: (s: SolicitacaoDoc[]) => void) {
  return subscribeSolicitacoes(uid, 'profissional', cb);
}

export function cancelSolicitacao(id: string): Promise<void> {
  return updateSolicitacaoStatus(id, 'cancelada');
}
