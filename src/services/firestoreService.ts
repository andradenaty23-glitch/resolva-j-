import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  CategoriaDoc,
  ServicoDoc,
  SolicitacaoDoc,
  AvaliacaoDoc,
  FavoritoDoc,
  NotificacaoDoc,
  UsuarioDoc,
  StatusSolicitacao
} from '../types';

// ==========================================
// 1. CATEGORIAS (coleção: categorias)
// ==========================================

export const DEFAULT_CATEGORIES: Array<Omit<CategoriaDoc, 'id' | 'criadoEm'>> = [
  { nome: 'Eletricista', descricao: 'Instalações, quadros de luz, tomadas e reparos elétricos', icone: 'Zap', ativa: true },
  { nome: 'Encanador', descricao: 'Vazamentos, desentupimentos, torneiras e encanamento predial', icone: 'Droplets', ativa: true },
  { nome: 'Pedreiro', descricao: 'Alvenaria, pisos, reboco, reformas e pequenas construções', icone: 'Hammer', ativa: true },
  { nome: 'Pintor', descricao: 'Pintura residencial, texturas, impermeabilização e acabamento', icone: 'Paintbrush', ativa: true },
  { nome: 'Diarista', descricao: 'Limpeza residencial, faxina pesada e higienização geral', icone: 'Sparkles', ativa: true },
  { nome: 'Manutenção', descricao: 'Marido de aluguel, pequenos reparos e instalações gerais', icone: 'Wrench', ativa: true },
  { nome: 'Jardinagem', descricao: 'Corte de grama, poda de árvores, paisagismo e manutenção verde', icone: 'Flower2', ativa: true },
  { nome: 'Informática', descricao: 'Redes, computadores, suporte técnico e configuração de roteador', icone: 'Cpu', ativa: true },
  { nome: 'Beleza', descricao: 'Cabelo, manicure, estética domiciliar e cuidados pessoais', icone: 'Scissors', ativa: true },
  { nome: 'Costura', descricao: 'Ajustes, bainhas, consertos de roupas e reformas têxteis', icone: 'CheckCircle2', ativa: true },
  { nome: 'Outros', descricao: 'Demais especialidades e serviços residenciais sob demanda', icone: 'Layers', ativa: true }
];

export async function seedDefaultCategoriasIfEmpty(): Promise<void> {
  try {
    const catCol = collection(db, 'categorias');
    const snap = await getDocs(catCol);
    if (snap.empty) {
      const now = new Date().toISOString();
      for (const cat of DEFAULT_CATEGORIES) {
        const newDocRef = doc(catCol);
        await setDoc(newDocRef, {
          ...cat,
          id: newDocRef.id,
          criadoEm: now
        });
      }
    }
  } catch (error) {
    console.warn('Could not auto-seed categories (may require permissions):', error);
  }
}

export function subscribeCategorias(callback: (categorias: CategoriaDoc[]) => void): () => void {
  const catCol = collection(db, 'categorias');
  return onSnapshot(
    catCol,
    (snapshot) => {
      if (snapshot.empty) {
        // Fallback to defaults if empty
        const fallback = DEFAULT_CATEGORIES.map((c, i) => ({
          ...c,
          id: `cat-${i + 1}`,
          criadoEm: new Date().toISOString()
        }));
        callback(fallback);
      } else {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as CategoriaDoc));
        callback(list.filter((c) => c.ativa !== false));
      }
    },
    (err) => {
      console.warn('Categorias snapshot listener error, using defaults:', err);
      callback(
        DEFAULT_CATEGORIES.map((c, i) => ({
          ...c,
          id: `cat-${i + 1}`,
          criadoEm: new Date().toISOString()
        }))
      );
    }
  );
}

export async function addCategoria(categoria: Omit<CategoriaDoc, 'id' | 'criadoEm'>): Promise<string> {
  const catRef = doc(collection(db, 'categorias'));
  await setDoc(catRef, {
    ...categoria,
    id: catRef.id,
    criadoEm: new Date().toISOString()
  });
  return catRef.id;
}

// ==========================================
// 2. SERVICOS (coleção: servicos)
// ==========================================

export function subscribeServicos(
  callback: (servicos: ServicoDoc[]) => void,
  filters?: { categoriaId?: string; cidade?: string; bairro?: string; busca?: string }
): () => void {
  const servCol = collection(db, 'servicos');
  return onSnapshot(
    servCol,
    (snapshot) => {
      let list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ServicoDoc));

      // Filter available services
      list = list.filter((s) => s.disponivel !== false);

      if (filters?.categoriaId && filters.categoriaId !== 'todas') {
        list = list.filter(
          (s) =>
            s.categoriaId?.toLowerCase() === filters.categoriaId?.toLowerCase() ||
            s.categoriaNome?.toLowerCase() === filters.categoriaId?.toLowerCase()
        );
      }

      if (filters?.cidade && filters.cidade.trim()) {
        const qCid = filters.cidade.toLowerCase();
        list = list.filter((s) => s.cidade?.toLowerCase().includes(qCid));
      }

      if (filters?.bairro && filters.bairro.trim()) {
        const qBai = filters.bairro.toLowerCase();
        list = list.filter((s) => s.bairro?.toLowerCase().includes(qBai));
      }

      if (filters?.busca && filters.busca.trim()) {
        const q = filters.busca.toLowerCase();
        list = list.filter(
          (s) =>
            s.nome?.toLowerCase().includes(q) ||
            s.descricao?.toLowerCase().includes(q) ||
            s.categoriaNome?.toLowerCase().includes(q) ||
            s.profissionalNome?.toLowerCase().includes(q)
        );
      }

      callback(list);
    },
    (err) => {
      console.warn('Servicos listener warning:', err);
      callback([]);
    }
  );
}

export function subscribeServicosByProfissional(
  profissionalId: string,
  callback: (servicos: ServicoDoc[]) => void
): () => void {
  const servCol = collection(db, 'servicos');
  const q = query(servCol, where('profissionalId', '==', profissionalId));

  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ServicoDoc));
      callback(list);
    },
    (err) => {
      console.warn('Profissional servicos listener error:', err);
      callback([]);
    }
  );
}

export async function addServico(
  servico: Omit<ServicoDoc, 'id' | 'criadoEm' | 'atualizadoEm'>
): Promise<string> {
  const servRef = doc(collection(db, 'servicos'));
  const now = new Date().toISOString();

  const payload: ServicoDoc = {
    ...servico,
    id: servRef.id,
    disponivel: servico.disponivel !== false,
    criadoEm: now,
    atualizadoEm: now
  };

  await setDoc(servRef, payload);
  return servRef.id;
}

export async function updateServico(id: string, servico: Partial<ServicoDoc>): Promise<void> {
  const servRef = doc(db, 'servicos', id);
  await updateDoc(servRef, {
    ...servico,
    atualizadoEm: new Date().toISOString()
  });
}

export async function deleteServico(id: string): Promise<void> {
  const servRef = doc(db, 'servicos', id);
  await deleteDoc(servRef);
}

export async function toggleDisponibilidadeServico(id: string, disponivel: boolean): Promise<void> {
  const servRef = doc(db, 'servicos', id);
  await updateDoc(servRef, {
    disponivel,
    atualizadoEm: new Date().toISOString()
  });
}

// ==========================================
// 3. SOLICITACOES (coleção: solicitacoes)
// ==========================================

export function subscribeSolicitacoesCliente(
  clienteId: string,
  callback: (solicitacoes: SolicitacaoDoc[]) => void
): () => void {
  const solCol = collection(db, 'solicitacoes');
  const q = query(solCol, where('clienteId', '==', clienteId));

  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as SolicitacaoDoc));
      // Sort newest first
      list.sort((a, b) => new Date(b.criadoEm || 0).getTime() - new Date(a.criadoEm || 0).getTime());
      callback(list);
    },
    (err) => {
      console.warn('Solicitacoes cliente listener warning:', err);
      callback([]);
    }
  );
}

export function subscribeSolicitacoesProfissional(
  profissionalId: string,
  callback: (solicitacoes: SolicitacaoDoc[]) => void
): () => void {
  const solCol = collection(db, 'solicitacoes');
  const q = query(solCol, where('profissionalId', '==', profissionalId));

  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as SolicitacaoDoc));
      list.sort((a, b) => new Date(b.criadoEm || 0).getTime() - new Date(a.criadoEm || 0).getTime());
      callback(list);
    },
    (err) => {
      console.warn('Solicitacoes profissional listener warning:', err);
      callback([]);
    }
  );
}

export async function createSolicitacao(
  data: Omit<SolicitacaoDoc, 'id' | 'status' | 'criadoEm' | 'atualizadoEm'>
): Promise<string> {
  const solRef = doc(collection(db, 'solicitacoes'));
  const now = new Date().toISOString();

  const payload: SolicitacaoDoc = {
    ...data,
    id: solRef.id,
    status: 'pendente',
    criadoEm: now,
    atualizadoEm: now
  };

  await setDoc(solRef, payload);

  // Trigger Notification for the Professional
  if (data.profissionalId) {
    await enviarNotificacao({
      usuarioId: data.profissionalId,
      titulo: 'Nova Solicitação Recebida!',
      mensagem: `${data.clienteNome || 'Um cliente'} solicitou atendimento para: "${data.servicoNome}".`,
      tipo: 'alert',
      referenciaId: solRef.id
    });
  }

  return solRef.id;
}

export async function updateSolicitacaoStatus(
  id: string,
  status: StatusSolicitacao,
  observacao?: string,
  metadata?: {
    clienteId?: string;
    profissionalId?: string;
    servicoNome?: string;
    profissionalNome?: string;
  }
): Promise<void> {
  const solRef = doc(db, 'solicitacoes', id);
  const now = new Date().toISOString();

  const updateData: Record<string, any> = {
    status,
    atualizadoEm: now
  };
  if (observacao !== undefined) {
    updateData.observacao = observacao;
  }

  await updateDoc(solRef, updateData);

  // Send contextual notification based on status
  if (metadata?.clienteId) {
    let titulo = '';
    let mensagem = '';
    let tipo: 'info' | 'success' | 'alert' | 'warning' = 'info';

    switch (status) {
      case 'aceita':
        titulo = 'Solicitação Aceita!';
        mensagem = `O profissional ${metadata.profissionalNome || 'escolhido'} aceitou seu chamado para "${metadata.servicoNome || 'o serviço'}".`;
        tipo = 'success';
        break;
      case 'recusada':
        titulo = 'Solicitação Recusada';
        mensagem = `Infelizmente seu chamado para "${metadata.servicoNome || 'o serviço'}" não pôde ser atendido neste momento.`;
        tipo = 'warning';
        break;
      case 'em_andamento':
        titulo = 'Profissional a Caminho!';
        mensagem = `O atendimento para "${metadata.servicoNome || 'o serviço'}" está em andamento.`;
        tipo = 'alert';
        break;
      case 'concluida':
        titulo = 'Serviço Concluído!';
        mensagem = `O serviço "${metadata.servicoNome || 'solicitado'}" foi finalizado. Por favor, deixe sua avaliação!`;
        tipo = 'success';
        break;
      case 'cancelada':
        titulo = 'Solicitação Cancelada';
        mensagem = `O chamado para "${metadata.servicoNome || 'o serviço'}" foi cancelado.`;
        tipo = 'info';
        break;
    }

    if (titulo) {
      await enviarNotificacao({
        usuarioId: metadata.clienteId,
        titulo,
        mensagem,
        tipo,
        referenciaId: id
      });
    }
  }
}

export async function cancelSolicitacao(id: string, observacao?: string): Promise<void> {
  await updateSolicitacaoStatus(id, 'cancelada', observacao || 'Cancelado pelo usuário');
}

// ==========================================
// 4. AVALIACOES (coleção: avaliacoes)
// ==========================================

export function subscribeAvaliacoesProfissional(
  profissionalId: string,
  callback: (avaliacoes: AvaliacaoDoc[]) => void
): () => void {
  const colRef = collection(db, 'avaliacoes');
  const q = query(colRef, where('profissionalId', '==', profissionalId));

  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as AvaliacaoDoc));
      callback(list);
    },
    (err) => {
      console.warn('Avaliacoes listener warning:', err);
      callback([]);
    }
  );
}

export async function addAvaliacao(
  data: Omit<AvaliacaoDoc, 'id' | 'criadoEm'>
): Promise<string> {
  // Check if evaluation already exists for this solicitation to prevent duplicates
  const colRef = collection(db, 'avaliacoes');
  const q = query(colRef, where('solicitacaoId', '==', data.solicitacaoId));
  const snap = await getDocs(q);

  if (!snap.empty) {
    throw new Error('Esta solicitação já foi avaliada anteriormente.');
  }

  const avalRef = doc(collection(db, 'avaliacoes'));
  const now = new Date().toISOString();

  const payload: AvaliacaoDoc = {
    ...data,
    id: avalRef.id,
    nota: Math.min(5, Math.max(1, data.nota)),
    criadoEm: now
  };

  await setDoc(avalRef, payload);

  // Recalculate average rating for professional
  try {
    const profReviewsSnap = await getDocs(query(colRef, where('profissionalId', '==', data.profissionalId)));
    const reviews = profReviewsSnap.docs.map((d) => d.data() as AvaliacaoDoc);
    const total = reviews.length;
    const media = total > 0 ? Number((reviews.reduce((acc, r) => acc + (r.nota || 5), 0) / total).toFixed(1)) : 5.0;

    const userDocRef = doc(db, 'usuarios', data.profissionalId);
    await updateDoc(userDocRef, {
      avaliacaoMedia: media,
      totalAvaliacoes: total,
      atualizadoEm: now
    });
  } catch (err) {
    console.warn('Could not update professional average rating document:', err);
  }

  // Notify the professional
  await enviarNotificacao({
    usuarioId: data.profissionalId,
    titulo: `Nova Avaliação: ${data.nota} Estrelas! ⭐`,
    mensagem: `${data.clienteNome || 'Um cliente'} avaliou seu atendimento: "${data.comentario || 'Ótimo serviço!'}"`,
    tipo: 'success',
    referenciaId: data.solicitacaoId
  });

  return avalRef.id;
}

// ==========================================
// 5. FAVORITOS (coleção: favoritos)
// ==========================================

export function subscribeFavoritos(
  usuarioId: string,
  callback: (favoritos: FavoritoDoc[]) => void
): () => void {
  const colRef = collection(db, 'favoritos');
  const q = query(colRef, where('usuarioId', '==', usuarioId));

  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as FavoritoDoc));
      callback(list);
    },
    (err) => {
      console.warn('Favoritos listener warning:', err);
      callback([]);
    }
  );
}

export async function toggleFavorito(usuarioId: string, servicoId: string): Promise<boolean> {
  const colRef = collection(db, 'favoritos');
  const q = query(colRef, where('usuarioId', '==', usuarioId), where('servicoId', '==', servicoId));
  const snap = await getDocs(q);

  if (!snap.empty) {
    // Remove favorite
    for (const docItem of snap.docs) {
      await deleteDoc(doc(db, 'favoritos', docItem.id));
    }
    return false; // Not favorited anymore
  } else {
    // Add favorite
    const favRef = doc(collection(db, 'favoritos'));
    await setDoc(favRef, {
      id: favRef.id,
      usuarioId,
      servicoId,
      criadoEm: new Date().toISOString()
    });
    return true; // Favorited
  }
}

// ==========================================
// 6. NOTIFICACOES (coleção: notificacoes)
// ==========================================

export function subscribeNotificacoes(
  usuarioId: string,
  callback: (notificacoes: NotificacaoDoc[]) => void
): () => void {
  const colRef = collection(db, 'notificacoes');
  const q = query(colRef, where('usuarioId', '==', usuarioId));

  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as NotificacaoDoc));
      list.sort((a, b) => new Date(b.criadoEm || 0).getTime() - new Date(a.criadoEm || 0).getTime());
      callback(list);
    },
    (err) => {
      console.warn('Notificacoes listener warning:', err);
      callback([]);
    }
  );
}

export async function enviarNotificacao(
  data: Omit<NotificacaoDoc, 'id' | 'lida' | 'criadoEm'>
): Promise<string> {
  try {
    const notifRef = doc(collection(db, 'notificacoes'));
    const payload: NotificacaoDoc = {
      ...data,
      id: notifRef.id,
      lida: false,
      criadoEm: new Date().toISOString()
    };
    await setDoc(notifRef, payload);
    return notifRef.id;
  } catch (error) {
    console.warn('Failed to send notification in Firestore:', error);
    return '';
  }
}

export async function marcarNotificacaoLida(id: string): Promise<void> {
  try {
    const notifRef = doc(db, 'notificacoes', id);
    await updateDoc(notifRef, { lida: true });
  } catch (err) {
    console.warn('Failed to mark notification read:', err);
  }
}

export async function marcarTodasNotificacoesLidas(usuarioId: string): Promise<void> {
  try {
    const colRef = collection(db, 'notificacoes');
    const q = query(colRef, where('usuarioId', '==', usuarioId), where('lida', '==', false));
    const snap = await getDocs(q);
    for (const d of snap.docs) {
      await updateDoc(doc(db, 'notificacoes', d.id), { lida: true });
    }
  } catch (err) {
    console.warn('Failed to mark all notifications read:', err);
  }
}

// ==========================================
// 7. ADMIN DASHBOARD QUERIES
// ==========================================

export function subscribeAllUsuarios(callback: (usuarios: UsuarioDoc[]) => void): () => void {
  const colRef = collection(db, 'usuarios');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({ uid: d.id, ...d.data() } as UsuarioDoc));
      callback(list);
    },
    (err) => {
      console.warn('Admin all usuarios listener error:', err);
      callback([]);
    }
  );
}

export function subscribeAllServicosAdmin(callback: (servicos: ServicoDoc[]) => void): () => void {
  const colRef = collection(db, 'servicos');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ServicoDoc));
      callback(list);
    },
    (err) => {
      console.warn('Admin all servicos listener error:', err);
      callback([]);
    }
  );
}

export function subscribeAllSolicitacoesAdmin(callback: (solicitacoes: SolicitacaoDoc[]) => void): () => void {
  const colRef = collection(db, 'solicitacoes');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as SolicitacaoDoc));
      list.sort((a, b) => new Date(b.criadoEm || 0).getTime() - new Date(a.criadoEm || 0).getTime());
      callback(list);
    },
    (err) => {
      console.warn('Admin all solicitacoes listener error:', err);
      callback([]);
    }
  );
}

export async function deleteUsuario(uid: string): Promise<void> {
  const userRef = doc(db, 'usuarios', uid);
  await deleteDoc(userRef);

  // Clean up user's favorites
  try {
    const favsSnap = await getDocs(query(collection(db, 'favoritos'), where('usuarioId', '==', uid)));
    for (const d of favsSnap.docs) {
      await deleteDoc(doc(db, 'favoritos', d.id));
    }
  } catch (err) {
    console.warn('Could not clean up user favorites:', err);
  }

  // Clean up user's notifications
  try {
    const notifsSnap = await getDocs(query(collection(db, 'notificacoes'), where('usuarioId', '==', uid)));
    for (const d of notifsSnap.docs) {
      await deleteDoc(doc(db, 'notificacoes', d.id));
    }
  } catch (err) {
    console.warn('Could not clean up user notifications:', err);
  }
}

export async function deleteUsuarioByEmail(email: string): Promise<{ deletedCount: number; message: string }> {
  const targetEmail = email.trim().toLowerCase();
  if (!targetEmail) {
    return { deletedCount: 0, message: 'E-mail inválido.' };
  }

  let deletedCount = 0;

  try {
    const usersCol = collection(db, 'usuarios');
    const snap = await getDocs(usersCol);

    for (const userDocItem of snap.docs) {
      const data = userDocItem.data() as UsuarioDoc;
      if (data.email && data.email.trim().toLowerCase() === targetEmail) {
        await deleteUsuario(userDocItem.id);
        deletedCount++;
      }
    }

    // Also check local storage for this email and purge if stored
    try {
      const clientAuth = localStorage.getItem('resolva_ja_auth_cliente_v2');
      if (clientAuth && JSON.parse(clientAuth)?.email?.toLowerCase() === targetEmail) {
        localStorage.removeItem('resolva_ja_auth_cliente_v2');
        localStorage.removeItem('resolva_ja_profile_cliente_v2');
      }
      const providerAuth = localStorage.getItem('resolva_ja_auth_prestador_v2');
      if (providerAuth && JSON.parse(providerAuth)?.email?.toLowerCase() === targetEmail) {
        localStorage.removeItem('resolva_ja_auth_prestador_v2');
        localStorage.removeItem('resolva_ja_profile_prestador_v2');
      }
    } catch {
      // ignore localStorage errors
    }

    return {
      deletedCount,
      message: deletedCount > 0
        ? `Perfil associado ao e-mail ${targetEmail} foi excluído com sucesso (${deletedCount} registro(s) removido(s)).`
        : `Nenhum perfil encontrado com o e-mail ${targetEmail}.`
    };
  } catch (error: any) {
    console.error('Error deleting user by email:', error);
    throw error;
  }
}

export const createNotificacao = enviarNotificacao;
export const addNotificacao = enviarNotificacao;


