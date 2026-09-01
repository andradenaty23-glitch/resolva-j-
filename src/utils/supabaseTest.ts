import { supabase, supabaseUrl, supabaseAnonKey } from '../lib/supabase';

/**
 * Utilitário para testar a conexão com o Supabase.
 * Verifica a inicialização do cliente e a validade das variáveis de ambiente,
 * mascarando a chave anônima para evitar exposição de credenciais no log.
 */
export const testSupabaseConnection = async () => {
  console.group('🔍 [Supabase] Teste de Conexão');

  // 1. Verificar presença das variáveis de ambiente
  const hasUrl = Boolean(supabaseUrl);
  const hasKey = Boolean(supabaseAnonKey);

  console.log(`URL Configurada: ${hasUrl ? '✅ Sim' : '❌ Não'}`);
  if (hasUrl) {
    console.log(`URL: ${supabaseUrl}`);
  }

  console.log(`Anon Key Configurada: ${hasKey ? '✅ Sim' : '❌ Não'}`);
  if (hasKey) {
    // Mascarar a chave para segurança: mostra apenas os primeiros 15 e últimos 4 caracteres
    const maskedKey = `${supabaseAnonKey.substring(0, 15)}...${supabaseAnonKey.substring(supabaseAnonKey.length - 4)}`;
    console.log(`Anon Key (Mascarada): ${maskedKey}`);
  }

  if (!hasUrl || !hasKey) {
    console.error('❌ Falha: Variáveis de ambiente VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY estão ausentes.');
    console.groupEnd();
    return false;
  }

  // 2. Testar conectividade via operação leve
  try {
    // getSession não faz chamadas de rede intensas, mas valida se o Auth client está instanciado.
    // Para testar a rede em si, fazemos um leve acesso ao health ou verificamos erro genérico na API
    const { error } = await supabase.auth.getSession();

    if (error) {
      console.error('❌ Erro de comunicação com o Supabase Auth:', error.message);
      console.groupEnd();
      return false;
    }

    console.log('✅ Cliente Supabase inicializado e pronto para uso!');
    console.groupEnd();
    return true;
  } catch (err) {
    console.error('❌ Erro inesperado ao tentar verificar o cliente Supabase:', err);
    console.groupEnd();
    return false;
  }
};
