# RESOLVA JÁ - Diagnóstico Inteligente & Serviços Residenciais

**RESOLVA JÁ** é uma plataforma web e PWA (Progressive Web App) inteligente voltada para diagnóstico automatizado de problemas domésticos (hidráulica, elétrica, ar-condicionado, pintura, serralheria, etc.), gestão de cômodos residenciais, orçamentos rápidos e contratação garantida de prestadores de serviço credenciados.

---

## 🚀 Tecnologias Utilizadas

- **Frontend Core:** React 18+, TypeScript, Vite
- **Estilização & UI:** Tailwind CSS, Lucide React (Icons), Motion (Animations)
- **Data & Charts:** Recharts (Analytics para prestadores e faturamento)
- **Modais & Interação:** Canvas Confetti
- **PWA Capabilities:** Web App Manifest (`manifest.webmanifest`), Service Worker (`sw.js`), suporte a instalação offline/desktop/mobile
- **Segurança & Tratamento de Erros:** React Error Boundary, Componentes de Estado de Erro (`ErrorState`), higienização de dados técnicos
- **Backend / Servidor:** Node.js (Servidor Express em produção via `server.ts` e suporte a proxy de chamadas de API)

---

## 📋 Requisitos do Sistema

- **Node.js:** v18.0.0 ou superior
- **NPM:** v9.0.0 ou superior
- **Navegadores suportados:** Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge (suporte completo a PWA no Android e iOS)

---

## ⚙️ Configuração das Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto utilizando o arquivo `.env.example` como modelo:

```bash
cp .env.example .env
```

Campos configuráveis no `.env`:

```env
# Chave de API da IA (Google Gemini API) - Processada no backend
GEMINI_API_KEY=sua_chave_gemini_aqui

# Client ID da Autenticação do Google Identity Services / Firebase
VITE_GOOGLE_CLIENT_ID=seu_google_client_id.apps.googleusercontent.com

# URL Base da Aplicação (usado para callbacks e SEO)
APP_URL=https://seu-dominio.com.br
```

> **Atenção:** Variáveis prefixadas com `VITE_` são expostas ao cliente no bundle final. Nunca coloque chaves privadas ou segredos de servidor em variáveis `VITE_`.

---

## 🔐 Configuração da Autenticação (Google Sign-In)

O aplicativo suporta login rápido via conta Google para clientes e prestadores de serviço:

1. Acesse o **Google Cloud Console** ([console.cloud.google.com](https://console.cloud.google.com/)).
2. Crie ou selecione o seu projeto Google Cloud.
3. Acesse **APIs e Serviços > Tela de permissão OAuth** (OAuth Consent Screen) e configure o nome da aplicação e o e-mail de suporte.
4. Vá em **Credenciais > Criar Credenciais > ID do cliente OAuth**.
5. Tipo de aplicação: **Aplicação Web**.
6. Em **Origens JavaScript autorizadas**, adicione o seu domínio local (`http://localhost:3000`) e o seu domínio de produção (`https://seu-dominio.com.br`).
7. Copie o **Client ID** gerado e atribua à variável `VITE_GOOGLE_CLIENT_ID` no seu `.env`.

---

## 💻 Instruções para Desenvolvimento Local

1. Instale as dependências do projeto:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Abra o navegador no endereço:
   ```text
   http://localhost:3000
   ```

---

## 🏗️ Instruções para Build de Produção

Para testar e compilar a aplicação para produção:

1. Execute a compilação dos ativos estáticos e backend:
   ```bash
   npm run build
   ```

2. Os arquivos compilados serão gerados na pasta `dist/`.

---

## 🚀 Instruções para Deploy (Implantação)

### Opção 1: Containers / Cloud Run / Docker

1. Certifique-se de que o servidor Node escute na porta `3000` e no host `0.0.0.0`.
2. Execute o comando de inicialização em produção:
   ```bash
   npm run start
   ```

### Opção 2: Hospedagem Estática (Vercel / Netlify / Cloudflare Pages)

1. Defina o comando de build como `npm run build`.
2. Defina o diretório de saída (Output Directory) como `dist`.
3. Configure as variáveis de ambiente na interface da plataforma (`GEMINI_API_KEY`, `VITE_GOOGLE_CLIENT_ID`, `APP_URL`).

---

## 🌐 Instruções para Configuração de Domínio Personalizado

1. No seu provedor de DNS (Cloudflare, Registro.br, GoDaddy, etc.):
   - Crie um registro **A** apontando para o IP do seu servidor ou load balancer.
   - Crie um registro **CNAME** `www` apontando para o domínio principal.
2. Certifique-se de habilitar o certificado SSL/TLS (HTTPS é obrigatório para o funcionamento correto do Service Worker/PWA e Google Auth).
3. Atualize a variável `APP_URL` no `.env` com o domínio configurado.

---

## 🛡️ Observações de Segurança

- **Tratamento de Erros:** A aplicação utiliza um `ErrorBoundary` global que engole *stack traces*, tokens e dados internos, exibindo apenas telas amigáveis para o usuário final.
- **Proteção de Chaves de API:** As chamadas que exigem segredos (como Gemini AI) passam por rotas de servidor ou proxies e não expõem senhas no front-end.
- **Imagens e Mídia:** Tags de imagem usam `referrerPolicy="no-referrer"` e carregamento assíncrono.
