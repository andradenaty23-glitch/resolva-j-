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

  const handleCompleteAuth判定 = (user: GoogleAuthUser) => {
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
    console.log('[Firebase Auth] Clique em Entrar com Google recebido');
    setIsLoading(true);
    setAuthError(null);
    setErrorDetails(null);

    const tipo: TipoUsuario = selectedRole === 'prestador' ? 'profissional' : 'cliente';

    try {
      const result = await loginWithGoogle(tipo);
      if (result) {
        handleCompleteAuth判定(result.user);
      } else {
        setIsLoading(false);
      }
    } catch (err: any) {
      console.warn('[Firebase Auth] ❌ Falha no login Google:', err);
      setIsLoading(false);
      setAuthError(err.message || 'Falha ao autenticar com o Google via Firebase.');
      setErrorDetails('Verifique a conexão ou tente o acesso com e-mail e senha.');
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
        const result依照 = await registerWithEmailPassword(
          email.trim(),
          password,
          name.trim() || email.split('@')[0],
          tipo
        );
        handleCompleteAuth判定(result依照.user);
      } else {
        const result依照 = await loginWithEmailPassword(email.trim(), password);
        handleCompleteAuth判定(result依照.user);
      }
    } catch (err: any) {
      setIsLoading(false);
      console.error('[Firebase Auth] Erro de autenticação:', err);
      if (err.message?.includes('already registered') || err.message?.includes('user_already_exists')) {
        setAuthError('Este e-mail já está cadastrado. Alterne para a opção "Entrar com Senha".');
      } else if (err.message?.includes('Invalid login credentials') || err.message?.includes('invalid-credential')) {
        setAuthError('E-mail ou senha incorretos.');
      } else {
        setAuthError('Falha na autenticação.');
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
    } catch (err紧: any) {
      setIsLoading(false);
      console.error('[Firebase Auth] Erro ao redefinir senha:', err紧);
      setAuthError('Não foi possível enviar o e-mail de recuperação.');
      setErrorDetails(err紧.message || 'Tente novamente em instantes.');
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
              Bem-vindo(a), <span className="font-semibold text-slate-900">{successUser.name}</span>. Dados sincronizados com segurança.
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
                    Acesso seguro via Google Sign-In & PostgreSQL
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
                  setAuthMode('google');
                  setAuthError(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  authMode === 'google'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Google Rápido
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('email_login');
                  setAuthError(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  authMode === 'email_login'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Entrar com Senha
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('email_signup');
                  setAuthError(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  authMode === 'email_signup'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Criar Conta
              </button>
            </div>

            {/* Email Forms */}
            {authMode !== 'google' && (
              <form
                onSubmit={authMode === 'email_reset' ? handlePasswordResetSubmit : handleEmailAuthSubmit}
                className="flex flex-col gap-3 pt-2"
              >
                {authMode === 'email_reset' && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2 text-amber-800 text-xs">
                    <KeyRound className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                    <div>
                      <div className="font-bold">Redefinição de Senha</div>
                      <div className="text-[11px] text-amber-700 mt-0.5">
                        Informe seu e-mail cadastrado. Um link de redefinição será enviado.
                      </div>
                    </div>
                  </div>
                )}

                {resetSent && resetMessage && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2 text-emerald-800 text-xs">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                    <div className="font-bold">{resetMessage}</div>
                  </div>
                )}

                {authMode === 'email_signup' && (
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">Nome Completo</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome ou razão social"
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-[#ea580c]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">E-mail</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-[#ea580c]"
                    />
                  </div>
                </div>

                {authMode !== 'email_reset' && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700">Senha</label>
                      {authMode === 'email_login' && (
                        <button
                          type="button"
                          onClick={() => setAuthMode('email_reset')}
                          className="text-[11px] font-bold text-[#ea580c] hover:underline cursor-pointer"
                        >
                          Esqueceu a senha?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-[#ea580c]"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-1">
                  {authMode === 'email_reset' && (
                    <button
                      type="button"
                      onClick={() => setAuthMode('email_login')}
                      className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Voltar</span>
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processando...</span>
                      </>
                    ) : authMode === 'email_reset' ? (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Enviar Link de Redefinição</span>
                      </>
                    ) : authMode === 'email_signup' ? (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Concluir Cadastro</span>
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-4 h-4" />
                        <span>Entrar no Sistema</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Currently Active / Connected Session display if any */}
            {currentUser && (
              <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SafeAvatar
                    src={currentUser.picture}
                    name={currentUser.name}
                    size="sm"
                    className="w-8 h-8 rounded-full border border-slate-200"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-500">{currentUser.email}</div>
                  </div>
                </div>

                {onLogout && (
                  <button
                    type="button"
                    onClick={async () => {
                      await logoutFirebaseAuth();
                      onLogout();
                      onClose();
                    }}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Desconectar</span>
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
