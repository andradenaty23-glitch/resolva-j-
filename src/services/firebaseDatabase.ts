import { db } from '../lib/firebase';
import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, 
  query, where, orderBy, onSnapshot, limit
} from 'firebase/firestore';
import { UsuarioDoc } from './firebaseAuth';

// Tipos
export interface CategoriaDoc { id: string; nome: string; descricao?: string; icone?: string; ativa?: boolean; criadoEm?: string; }
export interface ServicoDoc { id: string; profissionalId: string; profissionalNome: string; profissionalFoto?: string; nome: string; descricao: string; categoriaId: string; categoriaNome: string; preco: number; cidade: string; bairro?: string; endereco?: string; telefone?: string; whatsapp?: string; imagem?: string; ativo?: boolean; avaliacaoMedia?: number; totalAvaliacoes?: number; criadoEm?: string; atualizadoEm?: string; }
export interface SolicitacaoDoc { id: string; servicoId: string; servicoNome: string; categoriaId: string; categoriaNome: string; clienteId: string; clienteNome: string; clienteEmail: string; clienteTelefone?: string; clienteFoto?: string; profissionalId: string; profissionalNome: string; endereco: string; bairro?: string; cidade: string; data: string; horario: string; descricao: string; valorEstimado: number; status: 'pendente' | 'aceita' | 'em_andamento' | 'concluida' | 'cancelada' | 'recusada'; observacao?: string; criadoEm?: string; atualizadoEm?: string; }
export interface AvaliacaoDoc { id: string; solicitacaoId: string; servicoId: string; profissionalId: string; clienteId: string; clienteNome: string; clienteFoto?: string; nota: number; comentario?: string; criadoEm?: string; }
export interface FavoritoDoc { id: string; usuarioId: string; servicoId: string; criadoEm?: string; }
export interface NotificacaoDoc { id: string; usuarioId: string; titulo: string; mensagem: string; lida: boolean; linkAcao?: string; tipo?: 'info' | 'sucesso' | 'alerta' | 'erro' | 'success' | 'alert' | 'warning'; criadoEm?: string; }

// Categorias
export function subscribeCategorias(callback: (categorias: CategoriaDoc[]) => void): () => void {
  const q = query(collection(db, 'categorias'), orderBy('nome', 'asc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => d.data() as CategoriaDoc));
  });
}

// Serviços
export function subscribeServicos(callback: (servicos: ServicoDoc[]) => void): () => void {
  const q = query(collection(db, 'servicos'), orderBy('criadoEm', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => d.data() as ServicoDoc));
  });
}
export function subscribeServicosRecentes(limite: number = 6, callback: (servicos: ServicoDoc[]) => void): () => void {
  const q = query(collection(db, 'servicos'), where('ativo', '==', true), orderBy('criadoEm', 'desc'), limit(limite));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => d.data() as ServicoDoc));
  });
}
export function subscribeServicosByProfissional(profissionalId: string, callback: (servicos: ServicoDoc[]) => void): () => void {
  const q = query(collection(db, 'servicos'), where('profissionalId', '==', profissionalId), orderBy('criadoEm', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => d.data() as ServicoDoc));
  });
}
export async function addServico(servico: Omit<ServicoDoc, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<string> {
  const id = `srv-${Date.now()}`;
  const docRef = doc(db, 'servicos', id);
  await setDoc(docRef, { ...servico, id, criadoEm: new Date().toISOString(), atualizadoEm: new Date().toISOString() });
  return id;
}
export async function updateServico(id: string, updates: Partial<ServicoDoc>): Promise<void> {
  const docRef = doc(db, 'servicos', id);
  await updateDoc(docRef, { ...updates, atualizadoEm: new Date().toISOString() });
}
export async function deleteServico(id: string): Promise<void> {
  await deleteDoc(doc(db, 'servicos', id));
}

// Solicitações
export function subscribeSolicitacoes(
  usuarioId: string,
  tipo: 'cliente' | 'profissional' | 'admin',
  callback: (solicitacoes: SolicitacaoDoc[]) => void
): () => void {
  if (tipo === 'admin') {
    const q = query(collection(db, 'solicitacoes'), orderBy('criadoEm', 'desc'));
    return onSnapshot(q, snap => callback(snap.docs.map(d => d.data() as SolicitacaoDoc)));
  }
  const field = tipo === 'cliente' ? 'clienteId' : 'profissionalId';
  const q = query(collection(db, 'solicitacoes'), where(field, '==', usuarioId), orderBy('criadoEm', 'desc'));
  return onSnapshot(q, snap => callback(snap.docs.map(d => d.data() as SolicitacaoDoc)));
}
export async function createSolicitacao(data: Omit<SolicitacaoDoc, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<string> {
  const id = `sol-${Date.now()}`;
  await setDoc(doc(db, 'solicitacoes', id), { ...data, id, criadoEm: new Date().toISOString(), atualizadoEm: new Date().toISOString() });
  return id;
}
export async function updateSolicitacaoStatus(id: string, status: SolicitacaoDoc['status'], observacao?: string): Promise<void> {
  const updates: any = { status, atualizadoEm: new Date().toISOString() };
  if (observacao !== undefined) updates.observacao = observacao;
  await updateDoc(doc(db, 'solicitacoes', id), updates);
}
export async function updateSolicitacao(id: string, updates: Partial<SolicitacaoDoc>): Promise<void> {
  await updateDoc(doc(db, 'solicitacoes', id), { ...updates, atualizadoEm: new Date().toISOString() });
}

// Avaliações
export function subscribeAvaliacoes(servicoId: string, callback: (avaliacoes: AvaliacaoDoc[]) => void): () => void {
  const q = query(collection(db, 'avaliacoes'), where('servicoId', '==', servicoId), orderBy('criadoEm', 'desc'));
  return onSnapshot(q, snap => callback(snap.docs.map(d => d.data() as AvaliacaoDoc)));
}
export async function addAvaliacao(data: Omit<AvaliacaoDoc, 'id' | 'criadoEm'>): Promise<string> {
  const id = `av-${Date.now()}`;
  await setDoc(doc(db, 'avaliacoes', id), { ...data, id, criadoEm: new Date().toISOString() });
  return id;
}

// Favoritos
export function subscribeFavoritos(usuarioId: string, callback: (favoritos: FavoritoDoc[]) => void): () => void {
  const q = query(collection(db, 'favoritos'), where('usuarioId', '==', usuarioId));
  return onSnapshot(q, snap => callback(snap.docs.map(d => d.data() as FavoritoDoc)));
}
export async function toggleFavorito(usuarioId: string, servicoId: string): Promise<boolean> {
  const q = query(collection(db, 'favoritos'), where('usuarioId', '==', usuarioId), where('servicoId', '==', servicoId));
  const snap = await getDocs(q);
  if (!snap.empty) {
    await deleteDoc(snap.docs[0].ref);
    return false;
  }
  const id = `fav-${Date.now()}`;
  await setDoc(doc(db, 'favoritos', id), { id, usuarioId, servicoId, criadoEm: new Date().toISOString() });
  return true;
}

// Notificações
export function subscribeNotificacoes(usuarioId: string, callback: (notificacoes: NotificacaoDoc[]) => void): () => void {
  const q = query(collection(db, 'notificacoes'), where('usuarioId', '==', usuarioId), orderBy('criadoEm', 'desc'));
  return onSnapshot(q, snap => callback(snap.docs.map(d => d.data() as NotificacaoDoc)));
}
export async function createNotificacao(data: Omit<NotificacaoDoc, 'id' | 'criadoEm' | 'lida'>): Promise<string> {
  const id = `notif-${Date.now()}`;
  await setDoc(doc(db, 'notificacoes', id), { ...data, id, lida: false, criadoEm: new Date().toISOString() });
  return id;
}
export const addNotificacao = createNotificacao;
export async function marcarNotificacaoLida(id: string): Promise<void> {
  await updateDoc(doc(db, 'notificacoes', id), { lida: true });
}
export async function marcarTodasNotificacoesLidas(usuarioId: string): Promise<void> {
  const q = query(collection(db, 'notificacoes'), where('usuarioId', '==', usuarioId), where('lida', '==', false));
  const snap = await getDocs(q);
  const batch = snap.docs.map(d => updateDoc(d.ref, { lida: true }));
  await Promise.all(batch);
}

// Admin
export function subscribeAllUsuarios(callback: (usuarios: UsuarioDoc[]) => void): () => void {
  const q = query(collection(db, 'usuarios'), orderBy('criadoEm', 'desc'));
  return onSnapshot(q, snap => callback(snap.docs.map(d => d.data() as UsuarioDoc)));
}
export function subscribeAllServicosAdmin(callback: (servicos: ServicoDoc[]) => void): () => void {
  const q = query(collection(db, 'servicos'), orderBy('criadoEm', 'desc'));
  return onSnapshot(q, snap => callback(snap.docs.map(d => d.data() as ServicoDoc)));
}
export function subscribeAllSolicitacoesAdmin(callback: (solicitacoes: SolicitacaoDoc[]) => void): () => void {
  const q = query(collection(db, 'solicitacoes'), orderBy('criadoEm', 'desc'));
  return onSnapshot(q, snap => callback(snap.docs.map(d => d.data() as SolicitacaoDoc)));
}
export async function deleteUsuario(uid: string): Promise<void> {
  await deleteDoc(doc(db, 'usuarios', uid));
}
export async function deleteUsuarioByEmail(email: string): Promise<{ success: boolean; message: string; deletedCount: number }> {
  // To avoid complexity, just search users
  const q = query(collection(db, 'usuarios'), where('email', '==', email.trim().toLowerCase()));
  const snap = await getDocs(q);
  let deletedCount = 0;
  if (!snap.empty) {
    for (const d of snap.docs) {
      await deleteDoc(d.ref);
      deletedCount++;
    }
  }
  return { success: true, message: 'Usuário deletado', deletedCount };
}
export const purgeAllDataByEmail = deleteUsuarioByEmail;

export async function addCategoria(cat: Omit<CategoriaDoc, 'id' | 'criadoEm'>): Promise<string> {
  const id = `cat-${Date.now()}`;
  await setDoc(doc(db, 'categorias', id), { ...cat, id, criadoEm: new Date().toISOString() });
  return id;
}
export async function seedDefaultCategoriasIfEmpty(): Promise<void> {
  const q = query(collection(db, 'categorias'), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) {
    await addCategoria({ nome: 'Elétrica', ativa: true });
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
