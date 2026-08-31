import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { GoogleAuthUser, UsuarioDoc, TipoUsuario, UserRole } from '../types';

/**
 * RESOLVA JÁ - Módulo de Autenticação Supabase Real
 * 
 * Gerencia sessões OAuth Google, E-mail/Senha e sincronização de perfis
 * na tabela PostgreSQL 'usuarios'.
 */

// 1. Obter documento do usuário no PostgreSQL
export async function getSupabaseUserDoc(uid: string): Promise<UsuarioDoc | null> {
  if (!isSupabaseConfigured) {
    console.warn('[Supabase Auth] Supabase não configurado. Não é possível buscar perfil.');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('uid', uid)
      .maybeSingle();

    if (error) {
      console.error('[Supabase Auth] Erro ao buscar documento do usuário:', error.message);
      return null;
    }

    return (data as UsuarioDoc) || null;
  } catch (err) {
    console.error('[Supabase Auth] Exceção ao buscar usuário:', err);
    return null;
  }
}

// 2. Sincronizar documento do usuário após login/cadastro
export async function syncUserDocument(
  user: { id: string; email?: string | null; user_metadata?: any },
  tipoOverride?: TipoUsuario,
  extraFields?: Partial<UsuarioDoc>
): Promise<UsuarioDoc> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não configurado. Configure as variáveis de ambiente.');
  }

  const uid = user.id;
  const email = user.email || user.user_metadata?.email || '';
  const nome = user.user_metadata?.name || user.user_metadata?.full_name || email.split('@')[0] || 'Usuário';
  const foto = user.user_metadata?.avatar_url || user.user_metadata?.picture || '';
  const existing = await getSupabaseUserDoc(uid);

  // Sanitização de tipo para novos registros (impede auto-elevação para 'admin' no frontend)
  const safeTipo: TipoUsuario = (tipoOverride === 'profissional' || tipoOverride === 'admin') 
    ? (tipoOverride === 'admin' ? (existing?.tipo === 'admin' ? 'admin' : 'cliente') : tipoOverride)
    : (user.user_metadata?.tipo === 'profissional' ? 'profissional' : 'cliente');

  if (existing) {
    // Preserva o tipo existente no banco
    const updates: Partial<UsuarioDoc> = {
      atualizadoEm: new Date().toISOString(),
      ...(nome && !existing.nome ? { nome } : {}),
      ...(foto && !existing.foto ? { foto } : {}),
      ...(extraFields ? { ...extraFields } : {})
    };

    // Remove qualquer tentativa de alteração indevida de 'tipo' pelo sync
    if (updates.tipo && updates.tipo === 'admin' && existing.tipo !== 'admin') {
      delete updates.tipo;
    }

    const { data, error } = await supabase
      .from('usuarios')
      .update(updates)
      .eq('uid', uid)
      .select()
      .single();

    if (error) {
      console.warn('[Supabase Auth] Erro ao atualizar usuário:', error.message);
      return existing;
    }

    return (data as UsuarioDoc) || existing;
  }

  // Novo usuário
  const newUserDoc: UsuarioDoc = {
    uid,
    nome,
    email,
    foto,
    telefone: extraFields?.telefone || user.user_metadata?.telefone || '',
    tipo: safeTipo,
    cidade: extraFields?.cidade || 'São Paulo',
    bairro: extraFields?.bairro || '',
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
    avaliacaoMedia: 5.0,
    totalAvaliacoes: 0,
    ...(extraFields || {})
  };

  const { data: created, error: insertError } = await supabase
    .from('usuarios')
    .insert([newUserDoc])
    .select()
    .single();

  if (insertError) {
    console.error('[Supabase Auth] Erro ao inserir novo usuário:', insertError.message);
    return newUserDoc;
  }

  return (created as UsuarioDoc) || newUserDoc;
}

// 3. Login com Google OAuth
export async function loginWithGoogle(tipo: TipoUsuario = 'cliente'): Promise<{ user: GoogleAuthUser } | null> {
  if (!isSupabaseConfigured) {
    throw new Error('É necessário configurar as variáveis de ambiente do Supabase (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY).');
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  });

  if (error) {
    throw new Error(error.message || 'Falha ao autenticar com o Google no Supabase.');
  }

  return null; // O redirecionamento ocorrerá no navegador
}

// 4. Cadastro com E-mail e Senha
export async function registerWithEmailPassword(
  email: string,
  password: string,
  nome: string,
  tipo: TipoUsuario = 'cliente',
  extraFields?: Partial<UsuarioDoc>
): Promise<{ user: GoogleAuthUser; userDoc: UsuarioDoc; usuarioDoc: UsuarioDoc }> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não configurado. Configure as variáveis de ambiente.');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: nome,
        full_name: nome,
        tipo,
        ...(extraFields || {})
      }
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Não foi possível criar o usuário no Supabase.');
  }

  const userDoc = await syncUserDocument(data.user, tipo, extraFields);

  const authUser: GoogleAuthUser = {
    id: data.user.id,
    email: data.user.email || email,
    name: nome,
    picture: '',
    role: tipo === 'profissional' ? 'prestador' : 'cliente',
    tipo,
    authProvider: 'email',
    verifiedEmail: Boolean(data.user.email_confirmed_at),
    connectedAt: new Date().toISOString()
  };

  return { user: authUser, userDoc, usuarioDoc: userDoc };
}

// 5. Login com E-mail e Senha
export async function loginWithEmailPassword(
  email: string,
  password: string
): Promise<{ user: GoogleAuthUser; userDoc: UsuarioDoc; usuarioDoc: UsuarioDoc }> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não configurado. Configure as variáveis de ambiente.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Usuário não retornado pelo Supabase.');
  }

  const userDoc = await syncUserDocument(data.user);

  const authUser: GoogleAuthUser = {
    id: data.user.id,
    email: data.user.email || email,
    name: userDoc.nome || data.user.user_metadata?.name || email.split('@')[0],
    picture: userDoc.foto || data.user.user_metadata?.avatar_url || '',
    role: userDoc.tipo === 'profissional' ? 'prestador' : 'cliente',
    tipo: userDoc.tipo,
    authProvider: 'email',
    verifiedEmail: Boolean(data.user.email_confirmed_at),
    connectedAt: new Date().toISOString()
  };

  return { user: authUser, userDoc, usuarioDoc: userDoc };
}

// 6. Recuperação de Senha
export async function sendPasswordResetLink(email: string): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não configurado. Configure as variáveis de ambiente.');
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: typeof window !== 'undefined' ? `${window.location.origin}` : undefined
  });

  if (error) {
    throw new Error(error.message || 'Erro ao enviar e-mail de redefinição de senha.');
  }
}

// 7. Logout
export async function logoutSupabaseAuth(): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('[Supabase Auth] Erro ao fazer logout:', err);
    }
  }
}

// 8. Listener de Mudança de Estado de Autenticação
export function onSupabaseAuthStateChanged(
  callback: (user: any | null, userDoc: UsuarioDoc | null) => void
): () => void {
  if (!isSupabaseConfigured) {
    // Supabase unconfigured: simply notify null state
    callback(null, null);
    return () => {};
  }

  // 8.1 Verificar sessão inicial
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) {
      syncUserDocument(session.user).then((doc) => {
        callback(session.user, doc);
      });
    } else {
      callback(null, null);
    }
  }).catch((err) => {
    console.error('[Supabase Auth] Erro ao obter sessão inicial:', err);
    callback(null, null);
  });

  // 8.2 Inscrever no evento onAuthStateChange
  const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
    console.info(`[Supabase Auth] Evento Auth: ${event}`);
    if (session?.user) {
      const doc = await syncUserDocument(session.user);
      callback(session.user, doc);
    } else {
      callback(null, null);
    }
  });

  return () => {
    authListener.subscription.unsubscribe();
  };
}

// 9. Atualizar perfil do usuário
export async function updateUsuarioDoc(
  uid: string,
  updates: Partial<UsuarioDoc>
): Promise<UsuarioDoc | null> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não configurado. Configure as variáveis de ambiente.');
  }

  const payload = {
    ...updates,
    atualizadoEm: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('usuarios')
    .update(payload)
    .eq('uid', uid)
    .select()
    .single();

  if (error) {
    console.error('[Supabase Auth] Erro ao atualizar perfil do usuário:', error.message);
    throw new Error(error.message);
  }

  return (data as UsuarioDoc) || null;
}
