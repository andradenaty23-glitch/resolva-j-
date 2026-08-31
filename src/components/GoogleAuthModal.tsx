import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  User,
  Wrench,
  ArrowRight,
  LogOut,
  AlertCircle,
  Loader2,
  Mail,
  Lock,
  Sparkles,
  KeyRound,
  ArrowLeft,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GoogleAuthUser, UserRole, TipoUsuario } from '../types';
import {
  loginWithGoogle,
  loginWithEmailPassword,
  registerWithEmailPassword,
  sendPasswordResetLink,
  logoutFirebaseAuth,
  syncUserDocument
} from '../services/firebaseAuth';
import { SafeAvatar } from './SafeAvatar';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: GoogleAuthUser | null;
  onSuccess: (user: GoogleAuthUser) => void;
  onLogout?: () => void;
  initialRole?: UserRole;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSuccess,
  onLogout,
  initialRole = 'cliente'
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [authMode, setAuthMode] = useState<'google' | 'email_login' | 'email_signup' | 'email_reset'>('google');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [successUser, setSuccessUser] = useState<GoogleAuthUser | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialRole) {
      setSelectedRole(initialRole);
    }
  }, [initialRole, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setAuthError(null);
      setErrorDetails(null);
      setIsLoading(false);
      setResetSent(false);
      setResetMessage(null);
    }
  }, [isOpen]);

  const handleCompleteAuth = (user: GoogleAuthUser) => {
    setIsLoading(false);
    setAuthError(null);
    setErrorDetails(null);
    setSuccessUser(user);
    setIsSuccess(true);

    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => {
      onSuccess(user);
      setIsSuccess(false);
      onClose();
    }, 1000);
  };

  /**
   * Firebase Google Sign-In
   */
  const handleTriggerGoogleOAuth = async () => {
    setIsLoading(true);
    setAuthError(null);
    setErrorDetails(null);

    const tipo: TipoUsuario = selectedRole === 'prestador' ? 'profissional' : 'cliente';

    try {
      const result = await loginWithGoogle(tipo);
      if (result) {
        handleCompleteAuth(result.user);
      } else {
        setIsLoading(false);
      }
    } catch (firebaseError: any) {
      console.warn('Firebase loginWithGoogle failed:', firebaseError?.code, firebaseError?.message);
      setIsLoading(false);

      const code = firebaseError?.code || '';
      const domain = typeof window !== 'undefined' ? window.location.hostname : 'este domínio';

      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setAuthError('Janela de login fechada antes da conclusão. Tente novamente.');
      } else if (code === 'auth/popup-blocked') {
        setAuthError('Janela pop-up bloqueada pelo navegador.');
        setErrorDetails('Verifique se o navegador bloqueou a janela de login ou tente o acesso com e-mail/senha.');
      } else if (code === 'auth/popup-timeout') {
        setAuthError('A conexão com o Google demorou para responder.');
        setErrorDetails('O navegador pode ter bloqueado o pop-up silenciosamente. Tente novamente ou use o login por e-mail/senha.');
      } else if (code === 'auth/unauthorized-domain') {
        setAuthError(`Domínio não autorizado para o login Google: ${domain}`);
        setErrorDetails(`Adicione este domínio no Firebase Console: Authentication → Settings → Authorized domains → Adicionar "${domain}".`);
      } else if (code === 'auth/operation-not-allowed') {
        setAuthError('O provedor de login do Google não está ativado no Firebase Console.');
        setErrorDetails('Ative o provedor Google em: Firebase Console → Authentication → Sign-in method → Google.');
      } else if (code === 'auth/account-exists-with-different-credential') {
        setAuthError('Uma conta já existe com este e-mail associada a outro método.');
        setErrorDetails('Tente entrar com e-mail e senha.');
        setAuthMode('email_login');
      } else if (code === 'auth/user-disabled') {
        setAuthError('Esta conta de usuário foi desativada.');
      } else if (code === 'auth/network-request-failed') {
        setAuthError('Erro de conexão com a rede. Verifique sua internet.');
      } else if (code === 'auth/invalid-api-key' || code === 'auth/configuration-not-found') {
        setAuthError('Configuração do Firebase inválida ou ausente.');
        setErrorDetails(firebaseError?.message);
      } else {
        setAuthError('Não foi possível conectar ao Firebase neste momento.');
        setErrorDetails(firebaseError?.message || 'Tente pelo formulário de e-mail/senha.');
      }
    }
  };

  /**
   * Email/Password Auth
   */
  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setAuthError('Preencha todos os campos obrigatórios.');
      return;
    }

    setIsLoading(true);
    setAuthError(null);
    setErrorDetails(null);

    const tipo: TipoUsuario = selectedRole === 'prestador' ? 'profissional' : 'cliente';

    try {
      if (authMode === 'email_signup') {
        const result = await registerWithEmailPassword(
          email.trim(),
          password,
          name.trim() || email.split('@')[0],
          tipo
        );
        handleCompleteAuth(result.user);
      } else {
        const result = await loginWithEmailPassword(email.trim(), password);
        handleCompleteAuth(result.user);
      }
    } catch (err: any) {
      setIsLoading(false);
      console.error('Email auth error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setAuthError('Este e-mail já está cadastrado. Alterne para a opção "Entrar com Senha".');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setAuthError('E-mail ou senha incorretos.');
      } else if (err.code === 'auth/weak-password') {
        setAuthError('A senha deve ter no mínimo 6 caracteres.');
      } else {
        setAuthError('Falha na autenticação. Verifique os dados e tente novamente.');
        setErrorDetails(err.message);
      }
    }
  };

  /**
   * Password Reset Handler
   */
  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setAuthError('Informe o e-mail cadastrado para redefinir a senha.');
      return;
    }

    setIsLoading(true);
    setAuthError(null);
    setErrorDetails(null);
    setResetSent(false);

    try {
      await sendPasswordResetLink(cleanEmail);
      setIsLoading(false);
      setResetSent(true);
      setResetMessage(`Enviamos um link de redefinição de senha para ${cleanEmail}.`);
    } catch (err: any) {
      setIsLoading(false);
      console.error('Password reset error:', err);
      if (err.code === 'auth/user-not-found') {
        setAuthError('Nenhum usuário cadastrado encontrado com este e-mail no Firebase.');
      } else if (err.code === 'auth/invalid-email') {
        setAuthError('Formato de e-mail inválido. Verifique o endereço digitado.');
      } else if (err.code === 'auth/missing-email') {
        setAuthError('Por favor, informe seu e-mail.');
      } else {
        setAuthError('Não foi possível enviar o e-mail de recuperação no momento.');
        setErrorDetails(err.message || 'Tente novamente em instantes.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4 border border-[#e4e4e7] max-h-[92vh] overflow-y-auto">
        {/* Success State */}
        {isSuccess && successUser ? (
          <div className="py-10 flex flex-col items-center text-center gap-3 animate-fadeIn">
            <div className="relative">
              <SafeAvatar
                src={successUser.picture}
                name={successUser.name}
                size="lg"
                className="w-20 h-20 rounded-full border-4 border-emerald-500 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-1 shadow-xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Autenticado no Firebase!</h3>
            <p className="text-sm text-slate-600">
              Bem-vindo(a), <span className="font-semibold text-slate-900">{successUser.name}</span>. Dados sincronizados no Cloud Firestore.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-start border-b border-[#f4f4f5] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#ea580c]/10 text-[#ea580c] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Autenticação Firebase
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Acesso seguro via Google Sign-In & Firestore
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Role Selection */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-2 block uppercase tracking-wider">
                Perfil de Acesso
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole('cliente')}
                  className={`p-3 rounded-2xl border flex items-center gap-2.5 text-left transition cursor-pointer ${
                    selectedRole === 'cliente'
                      ? 'border-[#ea580c] bg-[#ea580c]/5 ring-2 ring-[#ea580c]/20'
                      : 'border-[#e4e4e7] bg-white hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      selectedRole === 'cliente' ? 'bg-[#ea580c] text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Cliente</div>
                    <div className="text-[10px] text-slate-500">Contratar serviços</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('prestador')}
                  className={`p-3 rounded-2xl border flex items-center gap-2.5 text-left transition cursor-pointer ${
                    selectedRole === 'prestador'
                      ? 'border-emerald-600 bg-emerald-500/5 ring-2 ring-emerald-500/20'
                      : 'border-[#e4e4e7] bg-white hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      selectedRole === 'prestador' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Prestador PRO</div>
                    <div className="text-[10px] text-slate-500">Receber chamados</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2 text-rose-800 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold">{authError}</div>
                  {errorDetails && <div className="text-[11px] text-rose-600 mt-0.5">{errorDetails}</div>}
                  {authError.includes('já está cadastrado') && (
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('email_login');
                          setAuthError(null);
                          setErrorDetails(null);
                        }}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                      >
                        Entrar com Senha
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('email_reset');
                          setAuthError(null);
                          setErrorDetails(null);
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-rose-100 border border-rose-300 text-rose-900 rounded-lg text-[11px] font-bold cursor-pointer"
                      >
                        Redefinir Senha
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Google Sign In Button */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleTriggerGoogleOAuth}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl border-2 border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm transition flex items-center justify-center gap-3 shadow-xs cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-[#ea580c]" />
                    <span>Conectando ao Firebase...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Entrar com o Google</span>
                  </>
                )}
              </button>
            </div>

            {/* Email/Password Option Toggle */}
            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-slate-400 font-medium">Ou autentique via E-mail</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === 'email_signup' ? 'google' : 'email_signup');
                  setAuthError(null);
                  setErrorDetails(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                  authMode === 'email_signup'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Criar Nova Conta
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === 'email_login' ? 'google' : 'email_login');
                  setAuthError(null);
                  setErrorDetails(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                  authMode === 'email_login'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Entrar com Senha
              </button>
            </div>

            {/* Password Reset Screen */}
            {authMode === 'email_reset' && (
              <div className="space-y-3 pt-1 animate-fadeIn">
                <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Recuperação de Senha</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      Informe seu e-mail cadastrado para receber as instruções e o link seguro de redefinição de senha do Firebase.
                    </p>
                  </div>
                </div>

                {resetSent ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col items-center text-center gap-2 animate-fadeIn">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-emerald-950">Link Enviado com Sucesso!</h4>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      {resetMessage || `Enviamos o link de redefinição para ${email}.`}
                    </p>
                    <p className="text-[11px] text-emerald-700/80 mt-1">
                      Verifique sua caixa de entrada e também a pasta de spam/lixo eletrônico.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('email_login');
                        setResetSent(false);
                        setAuthError(null);
                        setErrorDetails(null);
                      }}
                      className="mt-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> Voltar para o Login
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordResetSubmit} className="space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">E-mail Cadastrado</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="seuemail@gmail.com"
                          className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#ea580c]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || !email.trim()}
                      className="w-full py-3 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Enviar Link de Recuperação</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('email_login');
                        setAuthError(null);
                        setErrorDetails(null);
                      }}
                      className="w-full py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Voltar para Entrar com Senha</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Email Form (Signup & Login) */}
            {(authMode === 'email_signup' || authMode === 'email_login') && (
              <form onSubmit={handleEmailAuthSubmit} className="space-y-3 pt-1">
                {authMode === 'email_signup' && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Nome Completo</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome"
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#ea580c]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">E-mail</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seuemail@gmail.com"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#ea580c]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-600 block">Senha</label>
                    {authMode === 'email_login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('email_reset');
                          setAuthError(null);
                          setErrorDetails(null);
                          setResetSent(false);
                        }}
                        className="text-[11px] font-bold text-[#ea580c] hover:text-[#c2410c] hover:underline cursor-pointer"
                      >
                        Esqueceu a senha?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#ea580c]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : authMode === 'email_signup' ? (
                    <span>Finalizar Cadastro no Firebase</span>
                  ) : (
                    <span>Entrar no Firebase</span>
                  )}
                </button>

                {authMode === 'email_login' && (
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('email_reset');
                        setAuthError(null);
                        setErrorDetails(null);
                        setResetSent(false);
                      }}
                      className="text-xs text-slate-500 hover:text-[#ea580c] font-medium transition cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-[#ea580c]" />
                      <span>Problemas para entrar? <strong>Recuperar senha</strong></span>
                    </button>
                  </div>
                )}
              </form>
            )}

            {/* Logout button if currently logged in */}
            {currentUser && onLogout && (
              <div className="pt-2 border-t border-[#f4f4f5] flex justify-between items-center">
                <div className="text-xs text-slate-500">
                  Conectado como <span className="font-bold text-slate-800">{currentUser.name}</span>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await logoutFirebaseAuth();
                    onLogout();
                    onClose();
                  }}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer py-1 px-2.5 rounded-lg hover:bg-rose-50 transition"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sair
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
