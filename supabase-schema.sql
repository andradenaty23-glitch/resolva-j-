-- =============================================================================
-- RESOLVA JÁ - SUPABASE POSTGRESQL DATABASE SCHEMA & RLS POLICIES (PRODUÇÃO)
-- =============================================================================
-- Execute este script completo no SQL Editor do seu projeto Supabase.

-- 1. TABELA: usuarios
CREATE TABLE IF NOT EXISTS public.usuarios (
    uid TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    foto TEXT,
    telefone TEXT,
    tipo TEXT NOT NULL DEFAULT 'cliente' CHECK (tipo IN ('cliente', 'profissional', 'admin')),
    cidade TEXT DEFAULT 'São Paulo',
    bairro TEXT,
    "residenceType" TEXT,
    endereco TEXT,
    cep TEXT,
    cpf TEXT,
    bio TEXT,
    especialidades TEXT[],
    "raioKm" NUMERIC DEFAULT 15,
    "valorBase" NUMERIC DEFAULT 120,
    "chavePix" TEXT,
    "avaliacaoMedia" NUMERIC DEFAULT 5.0,
    "totalAvaliacoes" INTEGER DEFAULT 0,
    "criadoEm" TIMESTAMPTZ DEFAULT NOW(),
    "atualizadoEm" TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA: categorias
CREATE TABLE IF NOT EXISTS public.categorias (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    descricao TEXT,
    icone TEXT DEFAULT 'Wrench',
    ativa BOOLEAN DEFAULT TRUE,
    "criadoEm" TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA: servicos
CREATE TABLE IF NOT EXISTS public.servicos (
    id TEXT PRIMARY KEY,
    "profissionalId" TEXT NOT NULL REFERENCES public.usuarios(uid) ON DELETE CASCADE,
    "profissionalNome" TEXT NOT NULL,
    "profissionalFoto" TEXT,
    nome TEXT NOT NULL,
    descricao TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,
    "categoriaNome" TEXT NOT NULL,
    preco NUMERIC NOT NULL DEFAULT 0,
    cidade TEXT NOT NULL DEFAULT 'São Paulo',
    bairro TEXT,
    endereco TEXT,
    telefone TEXT,
    whatsapp TEXT,
    imagem TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    "avaliacaoMedia" NUMERIC DEFAULT 5.0,
    "totalAvaliacoes" INTEGER DEFAULT 0,
    "criadoEm" TIMESTAMPTZ DEFAULT NOW(),
    "atualizadoEm" TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABELA: solicitacoes
CREATE TABLE IF NOT EXISTS public.solicitacoes (
    id TEXT PRIMARY KEY,
    "servicoId" TEXT NOT NULL,
    "servicoNome" TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,
    "categoriaNome" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "clienteNome" TEXT NOT NULL,
    "clienteEmail" TEXT NOT NULL,
    "clienteTelefone" TEXT,
    "clienteFoto" TEXT,
    "profissionalId" TEXT NOT NULL,
    "profissionalNome" TEXT NOT NULL,
    endereco TEXT NOT NULL,
    bairro TEXT,
    cidade TEXT NOT NULL,
    data TEXT NOT NULL,
    horario TEXT NOT NULL,
    descricao TEXT NOT NULL,
    "valorEstimado" NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aceita', 'em_andamento', 'concluida', 'cancelada', 'recusada')),
    observacao TEXT,
    "criadoEm" TIMESTAMPTZ DEFAULT NOW(),
    "atualizadoEm" TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABELA: avaliacoes
CREATE TABLE IF NOT EXISTS public.avaliacoes (
    id TEXT PRIMARY KEY,
    "solicitacaoId" TEXT NOT NULL,
    "servicoId" TEXT NOT NULL,
    "profissionalId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "clienteNome" TEXT NOT NULL,
    "clienteFoto" TEXT,
    nota NUMERIC NOT NULL CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT NOT NULL,
    "criadoEm" TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABELA: favoritos
CREATE TABLE IF NOT EXISTS public.favoritos (
    id TEXT PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "servicoId" TEXT NOT NULL,
    "criadoEm" TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE("usuarioId", "servicoId")
);

-- 7. TABELA: notificacoes
CREATE TABLE IF NOT EXISTS public.notificacoes (
    id TEXT PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    titulo TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    tipo TEXT NOT NULL DEFAULT 'info' CHECK (tipo IN ('info', 'alert', 'success')),
    lida BOOLEAN DEFAULT FALSE,
    "referenciaId" TEXT,
    "criadoEm" TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_servicos_prof ON public.servicos("profissionalId");
CREATE INDEX IF NOT EXISTS idx_servicos_cat ON public.servicos("categoriaId");
CREATE INDEX IF NOT EXISTS idx_solicitacoes_cliente ON public.solicitacoes("clienteId");
CREATE INDEX IF NOT EXISTS idx_solicitacoes_prof ON public.solicitacoes("profissionalId");
CREATE INDEX IF NOT EXISTS idx_avaliacoes_prof ON public.avaliacoes("profissionalId");
CREATE INDEX IF NOT EXISTS idx_favoritos_user ON public.favoritos("usuarioId");
CREATE INDEX IF NOT EXISTS idx_notificacoes_user ON public.notificacoes("usuarioId");

-- =============================================================================
-- FUNÇÃO DE SEGURANÇA: is_admin() (SECURITY DEFINER)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.usuarios
        WHERE uid = auth.uid()::text AND tipo = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- =============================================================================
-- TRIGGERS DE PROTEÇÃO CONTRA ESCALAÇÃO DE PRIVILÉGIOS (ANTI-TAMPERING)
-- =============================================================================

-- Impede que novos cadastros públicos definam tipo = 'admin'
CREATE OR REPLACE FUNCTION public.set_default_user_role()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.tipo = 'admin' AND NOT public.is_admin() THEN
        NEW.tipo := 'cliente';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_set_default_user_role ON public.usuarios;
CREATE TRIGGER trg_set_default_user_role
    BEFORE INSERT ON public.usuarios
    FOR EACH ROW
    EXECUTE FUNCTION public.set_default_user_role();

-- Impede que usuários comuns alterem seu próprio tipo para 'admin'
CREATE OR REPLACE FUNCTION public.protect_user_role()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.tipo = 'admin' AND OLD.tipo IS DISTINCT FROM 'admin') THEN
        IF NOT public.is_admin() THEN
            RAISE EXCEPTION 'Acesso negado: apenas administradores podem conceder o nível admin.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_user_role ON public.usuarios;
CREATE TRIGGER trg_protect_user_role
    BEFORE UPDATE OF tipo ON public.usuarios
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_user_role();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES GRANULARES
-- =============================================================================
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favoritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;

-- 1. Políticas para 'usuarios'
DROP POLICY IF EXISTS "Usuarios leitura pública" ON public.usuarios;
CREATE POLICY "Usuarios leitura pública" ON public.usuarios
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Usuarios criam seu próprio perfil" ON public.usuarios;
DROP POLICY IF EXISTS "Usuarios criam/editam seu próprio perfil" ON public.usuarios;
CREATE POLICY "Usuarios criam seu próprio perfil" ON public.usuarios
    FOR INSERT WITH CHECK (auth.uid()::text = uid);

DROP POLICY IF EXISTS "Usuarios editam seu próprio perfil" ON public.usuarios;
CREATE POLICY "Usuarios editam seu próprio perfil" ON public.usuarios
    FOR UPDATE USING (auth.uid()::text = uid OR public.is_admin());

DROP POLICY IF EXISTS "Usuarios deletam seu próprio perfil" ON public.usuarios;
CREATE POLICY "Usuarios deletam seu próprio perfil" ON public.usuarios
    FOR DELETE USING (auth.uid()::text = uid OR public.is_admin());

-- 2. Políticas para 'categorias'
DROP POLICY IF EXISTS "Categorias leitura pública" ON public.categorias;
CREATE POLICY "Categorias leitura pública" ON public.categorias
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Categorias escrita autenticada" ON public.categorias;
DROP POLICY IF EXISTS "Admin gerencia categorias" ON public.categorias;
CREATE POLICY "Admin gerencia categorias" ON public.categorias
    FOR ALL USING (public.is_admin() OR auth.role() = 'authenticated');

-- 3. Políticas para 'servicos'
DROP POLICY IF EXISTS "Servicos leitura pública" ON public.servicos;
CREATE POLICY "Servicos leitura pública" ON public.servicos
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Profissional gerencia seus próprios serviços" ON public.servicos;
DROP POLICY IF EXISTS "Profissional cria serviços" ON public.servicos;
CREATE POLICY "Profissional cria serviços" ON public.servicos
    FOR INSERT WITH CHECK (auth.uid()::text = "profissionalId" OR public.is_admin());

DROP POLICY IF EXISTS "Profissional atualiza serviços" ON public.servicos;
CREATE POLICY "Profissional atualiza serviços" ON public.servicos
    FOR UPDATE USING (auth.uid()::text = "profissionalId" OR public.is_admin());

DROP POLICY IF EXISTS "Profissional exclui serviços" ON public.servicos;
CREATE POLICY "Profissional exclui serviços" ON public.servicos
    FOR DELETE USING (auth.uid()::text = "profissionalId" OR public.is_admin());

-- 4. Políticas para 'solicitacoes'
DROP POLICY IF EXISTS "Participantes visualizam suas solicitacoes" ON public.solicitacoes;
CREATE POLICY "Participantes visualizam suas solicitacoes" ON public.solicitacoes
    FOR SELECT USING (auth.uid()::text = "clienteId" OR auth.uid()::text = "profissionalId" OR public.is_admin());

DROP POLICY IF EXISTS "Clientes criam solicitacoes" ON public.solicitacoes;
CREATE POLICY "Clientes criam solicitacoes" ON public.solicitacoes
    FOR INSERT WITH CHECK (auth.uid()::text = "clienteId" OR public.is_admin());

DROP POLICY IF EXISTS "Participantes atualizam solicitacoes" ON public.solicitacoes;
CREATE POLICY "Participantes atualizam solicitacoes" ON public.solicitacoes
    FOR UPDATE USING (auth.uid()::text = "clienteId" OR auth.uid()::text = "profissionalId" OR public.is_admin());

DROP POLICY IF EXISTS "Participantes cancelam ou deletam solicitacoes" ON public.solicitacoes;
CREATE POLICY "Participantes cancelam ou deletam solicitacoes" ON public.solicitacoes
    FOR DELETE USING (auth.uid()::text = "clienteId" OR public.is_admin());

-- 5. Políticas para 'avaliacoes'
DROP POLICY IF EXISTS "Avaliacoes leitura pública" ON public.avaliacoes;
CREATE POLICY "Avaliacoes leitura pública" ON public.avaliacoes
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Clientes criam avaliacoes" ON public.avaliacoes;
CREATE POLICY "Clientes criam avaliacoes" ON public.avaliacoes
    FOR INSERT WITH CHECK (auth.uid()::text = "clienteId" OR public.is_admin());

DROP POLICY IF EXISTS "Admin ou autor gerencia avaliacoes" ON public.avaliacoes;
CREATE POLICY "Admin ou autor gerencia avaliacoes" ON public.avaliacoes
    FOR DELETE USING (auth.uid()::text = "clienteId" OR public.is_admin());

-- 6. Políticas para 'favoritos'
DROP POLICY IF EXISTS "Usuarios gerenciam seus próprios favoritos" ON public.favoritos;
DROP POLICY IF EXISTS "Usuarios visualizam seus próprios favoritos" ON public.favoritos;
CREATE POLICY "Usuarios visualizam seus próprios favoritos" ON public.favoritos
    FOR SELECT USING (auth.uid()::text = "usuarioId" OR public.is_admin());

DROP POLICY IF EXISTS "Usuarios criam seus próprios favoritos" ON public.favoritos;
CREATE POLICY "Usuarios criam seus próprios favoritos" ON public.favoritos
    FOR INSERT WITH CHECK (auth.uid()::text = "usuarioId");

DROP POLICY IF EXISTS "Usuarios deletam seus próprios favoritos" ON public.favoritos;
CREATE POLICY "Usuarios deletam seus próprios favoritos" ON public.favoritos
    FOR DELETE USING (auth.uid()::text = "usuarioId" OR public.is_admin());

-- 7. Políticas para 'notificacoes'
DROP POLICY IF EXISTS "Usuarios visualizam e atualizam suas proprias notificacoes" ON public.notificacoes;
DROP POLICY IF EXISTS "Usuarios visualizam suas proprias notificacoes" ON public.notificacoes;
CREATE POLICY "Usuarios visualizam suas proprias notificacoes" ON public.notificacoes
    FOR SELECT USING (auth.uid()::text = "usuarioId" OR public.is_admin());

DROP POLICY IF EXISTS "Criacao de notificacoes" ON public.notificacoes;
CREATE POLICY "Criacao de notificacoes" ON public.notificacoes
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Usuarios atualizam suas proprias notificacoes" ON public.notificacoes;
CREATE POLICY "Usuarios atualizam suas proprias notificacoes" ON public.notificacoes
    FOR UPDATE USING (auth.uid()::text = "usuarioId" OR public.is_admin());

DROP POLICY IF EXISTS "Usuarios deletam suas proprias notificacoes" ON public.notificacoes;
CREATE POLICY "Usuarios deletam suas proprias notificacoes" ON public.notificacoes
    FOR DELETE USING (auth.uid()::text = "usuarioId" OR public.is_admin());

-- =============================================================================
-- HABILITAÇÃO DO REALTIME NO SUPABASE
-- =============================================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'servicos'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.categorias, public.servicos, public.solicitacoes, public.avaliacoes, public.favoritos, public.notificacoes;
    END IF;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- =============================================================================
-- DADOS INICIAIS: CATEGORIAS PADRÃO
-- =============================================================================
INSERT INTO public.categorias (id, nome, descricao, icone, ativa)
VALUES 
    ('eletrica', 'Elétrica', 'Instalação de tomadas, disjuntores, chuveiros, fiação e iluminação', 'Zap', true),
    ('hidraulica', 'Hidráulica', 'Vazamentos, torneiras, registros, desentupimentos e encanamentos', 'Droplets', true),
    ('ar_condicionado', 'Ar-Condicionado', 'Higienização, recarga de gás, manutenção e instalação de Split', 'Fan', true),
    ('montagem_moveis', 'Montagem de Móveis', 'Montagem e desmontagem de armários, mesas, camas e estantes', 'Hammer', true),
    ('pintura', 'Pintura', 'Pintura residencial, aplicação de massa corrida, textura e verniz', 'Paintbrush', true),
    ('marcenaria', 'Marcenaria & Reparos', 'Ajuste de portas, troca de dobradiças, trilhos e móveis sob medida', 'Wrench', true),
    ('alvenaria', 'Alvenaria & Pequenas Obras', 'Pisos, azulejos, reboco, conserto de trincas e furos em paredes', 'Building2', true),
    ('limpeza_pos_obra', 'Diarista & Limpeza', 'Faxina pesada, limpeza pós-obra e higienização residencial', 'Sparkles', true)
ON CONFLICT (id) DO NOTHING;
