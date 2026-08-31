import { supabase, isSupabaseConfigured, getSupabaseConfigStatus } from './supabase';

export type SupabaseConnectionState = 
  | 'CONFIGURED_AND_HEALTHY' 
  | 'UNCONFIGURED' 
  | 'INACCESSIBLE' 
  | 'PARTIAL_ERROR';

export interface SupabaseHealthCheckResult {
  state: SupabaseConnectionState;
  isConfigured: boolean;
  canQuery: boolean;
  canAccessAuth: boolean;
  latencyMs: number;
  message: string;
  tablesVerified: {
    usuarios: boolean;
    categorias: boolean;
    servicos: boolean;
    solicitacoes: boolean;
  };
}

/**
 * Executa uma verificação segura e transparente de conectividade com o Supabase Real.
 * Não expõe chaves no console ou na interface.
 */
export async function testSupabaseRealConnection(): Promise<SupabaseHealthCheckResult> {
  const configStatus = getSupabaseConfigStatus();

  if (!isSupabaseConfigured || !configStatus.isConfigured) {
    return {
      state: 'UNCONFIGURED',
      isConfigured: false,
      canQuery: false,
      canAccessAuth: false,
      latencyMs: 0,
      message: configStatus.errorMessage || 'Variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não estão configuradas.',
      tablesVerified: {
        usuarios: false,
        categorias: false,
        servicos: false,
        solicitacoes: false
      }
    };
  }

  const startTime = Date.now();
  let canQuery = false;
  let canAccessAuth = false;
  const tablesVerified = {
    usuarios: false,
    categorias: false,
    servicos: false,
    solicitacoes: false
  };

  try {
    // 1. Testa Auth
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (!authError) {
      canAccessAuth = true;
    }

    // 2. Testa consulta à tabela pública 'categorias'
    const { data: catData, error: catError } = await supabase
      .from('categorias')
      .select('id, nome')
      .limit(1);

    if (!catError) {
      tablesVerified.categorias = true;
      canQuery = true;
    }

    // 3. Testa consulta à tabela 'servicos'
    const { error: servError } = await supabase
      .from('servicos')
      .select('id')
      .limit(1);
    if (!servError) {
      tablesVerified.servicos = true;
    }

    // 4. Testa tabela 'usuarios'
    const { error: userError } = await supabase
      .from('usuarios')
      .select('uid')
      .limit(1);
    if (!userError) {
      tablesVerified.usuarios = true;
    }

    // 5. Testa tabela 'solicitacoes'
    const { error: solError } = await supabase
      .from('solicitacoes')
      .select('id')
      .limit(1);
    if (!solError) {
      tablesVerified.solicitacoes = true;
    }

    const latencyMs = Date.now() - startTime;

    if (canQuery && canAccessAuth) {
      return {
        state: 'CONFIGURED_AND_HEALTHY',
        isConfigured: true,
        canQuery: true,
        canAccessAuth: true,
        latencyMs,
        message: `Supabase conectado com sucesso (Latência: ${latencyMs}ms). Tabelas e autenticação operacionais.`,
        tablesVerified
      };
    } else if (canAccessAuth && !canQuery) {
      return {
        state: 'PARTIAL_ERROR',
        isConfigured: true,
        canQuery: false,
        canAccessAuth: true,
        latencyMs,
        message: 'Auth respondeu, mas as tabelas PostgreSQL não retornaram dados (verifique o schema ou permissões RLS).',
        tablesVerified
      };
    } else {
      return {
        state: 'INACCESSIBLE',
        isConfigured: true,
        canQuery: false,
        canAccessAuth: false,
        latencyMs,
        message: 'O endpoint do Supabase está inacessível ou as credenciais foram rejeitadas.',
        tablesVerified
      };
    }
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    return {
      state: 'INACCESSIBLE',
      isConfigured: true,
      canQuery: false,
      canAccessAuth: false,
      latencyMs,
      message: `Erro na comunicação com o Supabase: ${err?.message || 'Servidor inacessível.'}`,
      tablesVerified
    };
  }
}
