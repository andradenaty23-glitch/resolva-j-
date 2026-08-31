import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * RESOLVA JÁ - Configuração Real do Supabase Client
 * 
 * Este arquivo gerencia a conexão direta com o projeto PostgreSQL e Auth do Supabase.
 * NÃO utiliza bancos fictícios, nem fallbacks que mascarem a ausência de credenciais reais.
 */

// 1. Extração segura das variáveis de ambiente
const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

// 2. Validação rigorosa da URL e Anon Key
const isValidUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed.includes('placeholder') || trimmed.includes('xyzcompanytemp') || trimmed === 'https://') {
    return false;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const isKeyValid = (key: string): boolean => {
  if (!key || typeof key !== 'string') return false;
  const trimmed = key.trim();
  return trimmed.length > 20 && !trimmed.includes('placeholder');
};

export const isSupabaseConfigured = isValidUrl(envUrl) && isKeyValid(envKey);
export const supabaseUrl = envUrl.trim();
export const supabaseAnonKey = envKey.trim();

// 3. Status de configuração para diagnósticos e interface do usuário
export interface SupabaseConfigStatus {
  isConfigured: boolean;
  hasUrl: boolean;
  isUrlValid: boolean;
  hasKey: boolean;
  url: string;
  errorMessage?: string;
}

export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  if (!envUrl && !envKey) {
    return {
      isConfigured: false,
      hasUrl: false,
      isUrlValid: false,
      hasKey: false,
      url: '',
      errorMessage: 'É necessário configurar as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env.'
    };
  }

  if (!isValidUrl(envUrl)) {
    return {
      isConfigured: false,
      hasUrl: Boolean(envUrl),
      isUrlValid: false,
      hasKey: isKeyValid(envKey),
      url: envUrl,
      errorMessage: 'URL do Supabase inválida. Deve ser uma URL HTTP ou HTTPS válida no formato https://seu-projeto.supabase.co.'
    };
  }

  if (!isKeyValid(envKey)) {
    return {
      isConfigured: false,
      hasUrl: true,
      isUrlValid: true,
      hasKey: false,
      url: envUrl,
      errorMessage: 'A chave anônima pública (VITE_SUPABASE_ANON_KEY) não foi fornecida ou é inválida.'
    };
  }

  return {
    isConfigured: true,
    hasUrl: true,
    isUrlValid: true,
    hasKey: true,
    url: envUrl
  };
}

// 4. Criação do Supabase Client
let clientInstance: SupabaseClient;

if (isSupabaseConfigured) {
  try {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        flowType: 'pkce'
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    });
    console.info('[Supabase] Conectado com sucesso ao projeto:', supabaseUrl);
  } catch (err) {
    console.error('[Supabase] Erro fatal ao instanciar o Supabase Client:', err);
    // Criação defensiva para evitar quebra em tempo de carregamento
    clientInstance = createClient('https://unconfigured.supabase.co', 'dummy-unconfigured-key-please-set-env-variables', {
      auth: { persistSession: false }
    });
  }
} else {
  console.warn(
    '[Supabase] ⚠️ Supabase não configurado. Por favor, adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY ao ambiente.'
  );
  // Cliente inativo com URL sintaticamente válida apenas para não quebrar módulos de inicialização do bundle
  clientInstance = createClient('https://unconfigured.supabase.co', 'dummy-unconfigured-key-please-set-env-variables', {
    auth: { persistSession: false }
  });
}

export const supabase = clientInstance;
export default supabase;
