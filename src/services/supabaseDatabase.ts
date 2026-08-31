import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  CategoriaDoc,
  ServicoDoc,
  SolicitacaoDoc,
  AvaliacaoDoc,
  FavoritoDoc,
  NotificacaoDoc,
  StatusSolicitacao,
  UsuarioDoc
} from '../types';

/**
 * RESOLVA JÁ - Camada de Banco de Dados Supabase (PostgreSQL) Real
 * 
 * Conexão direta com as tabelas do PostgreSQL no Supabase.
 * Sem bancos fictícios ou mocks mascaradores.
 */

/* =========================================================================
   1. CATEGORIAS
========================================================================= */

export const DEFAULT_CATEGORIAS: Omit<CategoriaDoc, 'criadoEm'>[] = [
  { id: 'eletrica', nome: 'Elétrica', descricao: 'Instalação de tomadas, disjuntores, chuveiros, fiação e iluminação', icone: 'Zap', ativa: true },
  { id: 'hidraulica', nome: 'Hidráulica', descricao: 'Vazamentos, torneiras, registros, desentupimentos e encanamentos', icone: 'Droplets', ativa: true },
  { id: 'ar_condicionado', nome: 'Ar-Condicionado', descricao: 'Higienização, recarga de gás, manutenção e instalação de Split', icone: 'Fan', ativa: true },
  { id: 'montagem_moveis', nome: 'Montagem de Móveis', descricao: 'Montagem e desmontagem de armários, mesas, camas e estantes', icone: 'Hammer', ativa: true },
  { id: 'pintura', nome: 'Pintura', descricao: 'Pintura residencial, aplicação de massa corrida, textura e verniz', icone: 'Paintbrush', ativa: true },
  { id: 'marcenaria', nome: 'Marcenaria & Reparos', descricao: 'Ajuste de portas, troca de dobradiças, trilhos e móveis sob medida', icone: 'Wrench', ativa: true },
  { id: 'alvenaria', nome: 'Alvenaria & Pequenas Obras', descricao: 'Pisos, azulejos, reboco, conserto de trincas e furos em paredes', icone: 'Building2', ativa: true },
  { id: 'limpeza_pos_obra', nome: 'Diarista & Limpeza', descricao: 'Faxina pesada, limpeza pós-obra e higienização residencial', icone: 'Sparkles', ativa: true }
];

export async function seedDefaultCategoriasIfEmpty(): Promise<void> {
  if (!isSupabaseConfigured) return;

  try {
    const { count, error } = await supabase
      .from('categorias')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.warn('[Supabase DB] Verificação de categorias:', error.message);
      return;
    }

    if (count === 0) {
      console.info('[Supabase DB] Populando categorias padrão no PostgreSQL...');
      const payload = DEFAULT_CATEGORIAS.map((cat) => ({
        ...cat,
        criadoEm: new Date().toISOString()
      }));
      await supabase.from('categorias').insert(payload);
    }
  } catch (err) {
    console.error('[Supabase DB] Erro ao popular categorias:', err);
  }
}

export function subscribeCategorias(callback: (categorias: CategoriaDoc[]) => void): () => void {
  if (!isSupabaseConfigured) {
    callback(DEFAULT_CATEGORIAS.map(c => ({ ...c, criadoEm: new Date().toISOString() })));
    return () => {};
  }

  const fetchCategorias = async () => {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('ativa', true)
        .order('nome', { ascending: true });

      if (error) {
        console.error('[Supabase DB] Erro ao buscar categorias:', error.message);
        return;
      }

      if (data && data.length > 0) {
        callback(data as CategoriaDoc[]);
      } else {
        // Se vazia, popula e repete a busca
        await seedDefaultCategoriasIfEmpty();
        const { data: retryData } = await supabase
          .from('categorias')
          .select('*')
          .eq('ativa', true)
          .order('nome', { ascending: true });
        if (retryData) callback(retryData as CategoriaDoc[]);
      }
    } catch (err) {
      console.error('[Supabase DB] Exceção ao buscar categorias:', err);
    }
  };

  fetchCategorias();

  // Inscrição em Tempo Real via Realtime Channel
  const channel = supabase
    .channel('public:categorias')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'categorias' }, () => {
      fetchCategorias();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export async function addCategoria(categoria: Omit<CategoriaDoc, 'criadoEm'>): Promise<string> {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const payload = {
    ...categoria,
    criadoEm: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('categorias')
    .insert([payload])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data.id;
}

export async function updateCategoria(id: string, updates: Partial<CategoriaDoc>): Promise<void> {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const { error } = await supabase
    .from('categorias')
    .update(updates)
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export async function deleteCategoria(id: string): Promise<void> {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const { error } = await supabase
    .from('categorias')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

/* =========================================================================
   2. SERVIÇOS
========================================================================= */

export function subscribeServicos(callback: (servicos: ServicoDoc[]) => void): () => void {
  if (!isSupabaseConfigured) {
    callback([]);
    return () => {};
  }

  const fetchServicos = async () => {
    try {
      const { data, error } = await supabase
        .from('servicos')
        .select('*')
        .eq('ativo', true)
        .order('criadoEm', { ascending: false });

      if (error) {
        console.error('[Supabase DB] Erro ao buscar serviços:', error.message);
        return;
      }

      callback((data as ServicoDoc[]) || []);
    } catch (err) {
      console.error('[Supabase DB] Exceção ao buscar serviços:', err);
    }
  };

  fetchServicos();

  const channel = supabase
    .channel('public:servicos')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'servicos' }, () => {
      fetchServicos();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeServicosProfissional(
  profissionalId: string,
  callback: (servicos: ServicoDoc[]) => void
): () => void {
  if (!isSupabaseConfigured) {
    callback([]);
    return () => {};
  }

  const fetchServicos = async () => {
    try {
      const { data, error } = await supabase
        .from('servicos')
        .select('*')
        .eq('profissionalId', profissionalId)
        .order('criadoEm', { ascending: false });

      if (error) {
        console.error('[Supabase DB] Erro ao buscar serviços do profissional:', error.message);
        return;
      }

      callback((data as ServicoDoc[]) || []);
    } catch (err) {
      console.error('[Supabase DB] Exceção ao buscar serviços do profissional:', err);
    }
  };

  fetchServicos();

  const channel = supabase
    .channel(`public:servicos:prof:${profissionalId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'servicos', filter: `profissionalId=eq.${profissionalId}` }, () => {
      fetchServicos();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export async function addServico(data: Omit<ServicoDoc, 'id' | 'criadoEm' | 'atualizadoEm' | 'ativo' | 'avaliacaoMedia' | 'totalAvaliacoes'>): Promise<string> {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const id = `serv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const payload: ServicoDoc = {
    ...data,
    id,
    ativo: true,
    avaliacaoMedia: 5.0,
    totalAvaliacoes: 0,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString()
  };

  const { data: created, error } = await supabase
    .from('servicos')
    .insert([payload])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return created.id;
}

export async function updateServico(id: string, updates: Partial<ServicoDoc>): Promise<void> {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const payload = {
    ...updates,
    atualizadoEm: new Date().toISOString()
  };

  const { error } = await supabase
    .from('servicos')
    .update(payload)
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export async function deleteServico(id: string): Promise<void> {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const { error } = await supabase
    .from('servicos')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

/* =========================================================================
   3. SOLICITAÇÕES / CHAMADOS
========================================================================= */

export function subscribeSolicitacoesCliente(
  clienteId: string,
  callback: (solicitacoes: SolicitacaoDoc[]) => void
): () => void {
  if (!isSupabaseConfigured || !clienteId) {
    callback([]);
    return () => {};
  }

  const fetchSolicitacoes = async () => {
    try {
      const { data, error } = await supabase
        .from('solicitacoes')
        .select('*')
        .eq('clienteId', clienteId)
        .order('criadoEm', { ascending: false });

      if (error) {
        console.error('[Supabase DB] Erro ao buscar solicitações do cliente:', error.message);
        return;
      }

      callback((data as SolicitacaoDoc[]) || []);
    } catch (err) {
      console.error('[Supabase DB] Exceção ao buscar solicitações do cliente:', err);
    }
  };

  fetchSolicitacoes();

  const channel = supabase
    .channel(`public:solicitacoes:cli:${clienteId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'solicitacoes', filter: `clienteId=eq.${clienteId}` }, () => {
      fetchSolicitacoes();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeSolicitacoesProfissional(
  profissionalId: string,
  callback: (solicitacoes: SolicitacaoDoc[]) => void
): () => void {
  if (!isSupabaseConfigured || !profissionalId) {
    callback([]);
    return () => {};
  }

  const fetchSolicitacoes = async () => {
    try {
      const { data, error } = await supabase
        .from('solicitacoes')
        .select('*')
        .eq('profissionalId', profissionalId)
        .order('criadoEm', { ascending: false });

      if (error) {
        console.error('[Supabase DB] Erro ao buscar chamados do profissional:', error.message);
        return;
      }

      callback((data as SolicitacaoDoc[]) || []);
    } catch (err) {
      console.error('[Supabase DB] Exceção ao buscar chamados do profissional:', err);
    }
  };

  fetchSolicitacoes();

  const channel = supabase
    .channel(`public:solicitacoes:prof:${profissionalId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'solicitacoes', filter: `profissionalId=eq.${profissionalId}` }, () => {
      fetchSolicitacoes();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export async function createSolicitacao(
  data: Omit<SolicitacaoDoc, 'id' | 'status' | 'criadoEm' | 'atualizadoEm'>
): Promise<string> {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const id = `solic-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const payload: SolicitacaoDoc = {
    ...data,
    id,
    status: 'pendente',
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString()
  };

  const { data: created, error } = await supabase
    .from('solicitacoes')
    .insert([payload])
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Envia notificação ao prestador
  try {
    await enviarNotificacao({
      usuarioId: data.profissionalId,
      titulo: 'Novo Chamado Recebido!',
      mensagem: `${data.clienteNome || 'Cliente'} solicitou o serviço "${data.servicoNome}".`,
      tipo: 'info',
      referenciaId: created.id
    });
  } catch (notifErr) {
    console.warn('[Supabase DB] Notificação ao prestador falhou silenciosamente:', notifErr);
  }

  return created.id;
}

export async function updateSolicitacaoStatus(
  id: string,
  status: StatusSolicitacao,
  observacao?: string,
  metadata?: Partial<SolicitacaoDoc>
): Promise<void> {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const payload: Partial<SolicitacaoDoc> = {
    status,
    atualizadoEm: new Date().toISOString(),
    ...(observacao !== undefined && { observacao }),
    ...metadata
  };

  const { error } = await supabase
    .from('solicitacoes')
    .update(payload)
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export async function cancelSolicitacao(id: string, observacao?: string): Promise<void> {
  await updateSolicitacaoStatus(id, 'cancelada', observacao);
}

/* =========================================================================
   4. AVALIAÇÕES
========================================================================= */

export function subscribeAvaliacoesProfissional(
  profissionalId: string,
  callback: (avaliacoes: AvaliacaoDoc[]) => void
): () => void {
  if (!isSupabaseConfigured || !profissionalId) {
    callback([]);
    return () => {};
  }

  const fetchAvaliacoes = async () => {
    try {
      const { data, error } = await supabase
        .from('avaliacoes')
        .select('*')
        .eq('profissionalId', profissionalId)
        .order('criadoEm', { ascending: false });

      if (error) {
        console.error('[Supabase DB] Erro ao buscar avaliações:', error.message);
        return;
      }

      callback((data as AvaliacaoDoc[]) || []);
    } catch (err) {
      console.error('[Supabase DB] Exceção ao buscar avaliações:', err);
    }
  };

  fetchAvaliacoes();

  const channel = supabase
    .channel(`public:avaliacoes:${profissionalId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'avaliacoes', filter: `profissionalId=eq.${profissionalId}` }, () => {
      fetchAvaliacoes();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export async function addAvaliacao(data: Omit<AvaliacaoDoc, 'id' | 'criadoEm'>): Promise<string> {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const id = `aval-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const payload: AvaliacaoDoc = {
    ...data,
    id,
    criadoEm: new Date().toISOString()
  };

  const { data: created, error } = await supabase
    .from('avaliacoes')
    .insert([payload])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return created.id;
}

/* =========================================================================
   5. FAVORITOS
========================================================================= */

export function subscribeFavoritos(
  usuarioId: string,
  callback: (favoritos: FavoritoDoc[]) => void
): () => void {
  if (!isSupabaseConfigured || !usuarioId) {
    callback([]);
    return () => {};
  }

  const fetchFavoritos = async () => {
    try {
      const { data, error } = await supabase
        .from('favoritos')
        .select('*')
        .eq('usuarioId', usuarioId);

      if (error) {
        console.error('[Supabase DB] Erro ao buscar favoritos:', error.message);
        return;
      }

      callback((data as FavoritoDoc[]) || []);
    } catch (err) {
      console.error('[Supabase DB] Exceção ao buscar favoritos:', err);
    }
  };

  fetchFavoritos();

  const channel = supabase
    .channel(`public:favoritos:${usuarioId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'favoritos', filter: `usuarioId=eq.${usuarioId}` }, () => {
      fetchFavoritos();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export async function toggleFavorito(usuarioId: string, servicoId: string): Promise<boolean> {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const { data: existing } = await supabase
    .from('favoritos')
    .select('*')
    .eq('usuarioId', usuarioId)
    .eq('servicoId', servicoId)
    .maybeSingle();

  if (existing) {
    await supabase.from('favoritos').delete().eq('id', existing.id);
    return false;
  } else {
    const id = `fav-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    await supabase.from('favoritos').insert([{
      id,
      usuarioId,
      servicoId,
      criadoEm: new Date().toISOString()
    }]);
    return true;
  }
}

/* =========================================================================
   6. NOTIFICAÇÕES
========================================================================= */

export function subscribeNotificacoes(
  usuarioId: string,
  callback: (notificacoes: NotificacaoDoc[]) => void
): () => void {
  if (!isSupabaseConfigured || !usuarioId) {
    callback([]);
    return () => {};
  }

  const fetchNotificacoes = async () => {
    try {
      const { data, error } = await supabase
        .from('notificacoes')
        .select('*')
        .eq('usuarioId', usuarioId)
        .order('criadoEm', { ascending: false });

      if (error) {
        console.error('[Supabase DB] Erro ao carregar notificações:', error.message);
        return;
      }

      callback((data as NotificacaoDoc[]) || []);
    } catch (err) {
      console.error('[Supabase DB] Exceção ao carregar notificações:', err);
    }
  };

  fetchNotificacoes();

  const channel = supabase
    .channel(`public:notificacoes:${usuarioId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'notificacoes', filter: `usuarioId=eq.${usuarioId}` }, () => {
      fetchNotificacoes();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export async function enviarNotificacao(
  data: Omit<NotificacaoDoc, 'id' | 'criadoEm' | 'lida'>
): Promise<string> {
  if (!isSupabaseConfigured) return '';

  const id = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const payload: NotificacaoDoc = {
    ...data,
    id,
    lida: false,
    criadoEm: new Date().toISOString()
  };

  const { data: created, error } = await supabase
    .from('notificacoes')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.warn('[Supabase DB] Erro ao enviar notificação:', error.message);
    return '';
  }

  return created.id;
}

export const createNotificacao = enviarNotificacao;
export const addNotificacao = enviarNotificacao;

export async function marcarNotificacaoLida(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  await supabase
    .from('notificacoes')
    .update({ lida: true })
    .eq('id', id);
}

export async function marcarTodasNotificacoesLidas(usuarioId: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  await supabase
    .from('notificacoes')
    .update({ lida: true })
    .eq('usuarioId', usuarioId);
}

/* =========================================================================
   7. ADMIN & GESTÃO MASTER
========================================================================= */

export function subscribeAllUsuarios(callback: (usuarios: UsuarioDoc[]) => void): () => void {
  if (!isSupabaseConfigured) {
    callback([]);
    return () => {};
  }

  const fetchUsuarios = async () => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('criadoEm', { ascending: false });

      if (error) {
        console.error('[Supabase DB] Erro ao buscar usuários no admin:', error.message);
        return;
      }

      callback((data as UsuarioDoc[]) || []);
    } catch (err) {
      console.error('[Supabase DB] Exceção ao buscar usuários no admin:', err);
    }
  };

  fetchUsuarios();

  const channel = supabase
    .channel('public:admin:usuarios')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'usuarios' }, () => {
      fetchUsuarios();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeAllServicosAdmin(callback: (servicos: ServicoDoc[]) => void): () => void {
  if (!isSupabaseConfigured) {
    callback([]);
    return () => {};
  }

  const fetchServicos = async () => {
    try {
      const { data, error } = await supabase
        .from('servicos')
        .select('*')
        .order('criadoEm', { ascending: false });

      if (error) {
        console.error('[Supabase DB] Erro ao buscar serviços admin:', error.message);
        return;
      }

      callback((data as ServicoDoc[]) || []);
    } catch (err) {
      console.error('[Supabase DB] Exceção ao buscar serviços admin:', err);
    }
  };

  fetchServicos();

  const channel = supabase
    .channel('public:admin:servicos')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'servicos' }, () => {
      fetchServicos();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeAllSolicitacoesAdmin(callback: (solicitacoes: SolicitacaoDoc[]) => void): () => void {
  if (!isSupabaseConfigured) {
    callback([]);
    return () => {};
  }

  const fetchSolicitacoes = async () => {
    try {
      const { data, error } = await supabase
        .from('solicitacoes')
        .select('*')
        .order('criadoEm', { ascending: false });

      if (error) {
        console.error('[Supabase DB] Erro ao buscar solicitações admin:', error.message);
        return;
      }

      callback((data as SolicitacaoDoc[]) || []);
    } catch (err) {
      console.error('[Supabase DB] Exceção ao buscar solicitações admin:', err);
    }
  };

  fetchSolicitacoes();

  const channel = supabase
    .channel('public:admin:solicitacoes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'solicitacoes' }, () => {
      fetchSolicitacoes();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export async function deleteUsuario(uid: string): Promise<void> {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const { error } = await supabase
    .from('usuarios')
    .delete()
    .eq('uid', uid);

  if (error) throw new Error(error.message);
}

export async function deleteUsuarioByEmail(
  email: string
): Promise<{ success: boolean; message: string; deletedCount: number }> {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const cleanEmail = email.trim().toLowerCase();
  let deletedCount = 0;

  const { data: user } = await supabase
    .from('usuarios')
    .select('uid')
    .ilike('email', cleanEmail)
    .maybeSingle();

  if (user) {
    await supabase.from('usuarios').delete().eq('uid', user.uid);
    await supabase.from('servicos').delete().eq('profissionalId', user.uid);
    await supabase.from('solicitacoes').delete().or(`clienteId.eq.${user.uid},profissionalId.eq.${user.uid}`);
    await supabase.from('favoritos').delete().eq('usuarioId', user.uid);
    await supabase.from('notificacoes').delete().eq('usuarioId', user.uid);
    deletedCount++;
  }

  return {
    success: true,
    message: `Dados vinculados a ${email} foram removidos do Supabase com sucesso.`,
    deletedCount
  };
}

export const purgeAllDataByEmail = deleteUsuarioByEmail;
