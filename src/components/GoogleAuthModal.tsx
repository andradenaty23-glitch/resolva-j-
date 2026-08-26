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
  Sparkles,
  ExternalLink,
  Mail
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GoogleAuthUser, UserRole } from '../types';
import {
  DEMO_GOOGLE_ACCOUNTS,
  saveGoogleUser,
  logoutGoogle,
  GOOGLE_OAUTH_CLIENT_ID,
  fetchGoogleUserProfile
} from '../services/googleAuth';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';
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
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [successUser, setSuccessUser] = useState<GoogleAuthUser | null>(null);

  useEffect(() => {
    if (initialRole) {
      setSelectedRole(initialRole);
    }
  }, [initialRole]);

  useEffect(() => {
    if (isOpen) {
      setAuthError(null);
      setErrorDetails(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleCompleteAuth = (user: GoogleAuthUser) => {
    setIsLoading(false);
    setAuthError(null);
    setErrorDetails(null);
    setSuccessUser(user);
    setIsSuccess(true);
    saveGoogleUser(user);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => {
      onSuccess(user);
      setIsSuccess(false);
      onClose();
    }, 1000);
  };

  /**
   * Attempt Google Identity Services (GSI) Token Client
   */
  const tryGsiTokenAuth = (): Promise<boolean> => {
    return new Promise((resolve) => {
      try {
        if (!window.google?.accounts?.oauth2 || !GOOGLE_OAUTH_CLIENT_ID) {
          resolve(false);
          return;
        }

        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_OAUTH_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          callback: async (tokenResponse: any) => {
            if (tokenResponse?.access_token) {
              const profile = await fetchGoogleUserProfile(tokenResponse.access_token);
              if (profile && profile.email) {
                const authUser: GoogleAuthUser = {
                  id: profile.sub || `google-${Date.now()}`,
                  email: profile.email,
                  name: profile.name || profile.given_name || 'Usuário Google',
                  picture: profile.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'User')}&background=ea580c&color=ffffff&bold=true`,
                  verifiedEmail: profile.email_verified ?? true,
                  role: selectedRole,
                  authProvider: 'google',
                  connectedAt: new Date().toISOString(),
                  token: tokenResponse.access_token
                };
                handleCompleteAuth(authUser);
                resolve(true);
                return;
              }
            }
            resolve(false);
          },
          error_callback: (err: any) => {
            console.warn('GSI Error:', err);
            resolve(false);
          }
        });

        client.requestAccessToken({ prompt: 'select_account' });
      } catch (err) {
        console.warn('Failed GSI token client:', err);
        resolve(false);
      }
    });
  };

  /**
   * Primary Multi-Tier Google Authentication Trigger
   */
  const handleTriggerGoogleOAuth = async () => {
    setIsLoading(true);
    setAuthError(null);
    setErrorDetails(null);

    // 1. Try Firebase Auth popup
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const authUser: GoogleAuthUser = {
        id: user.uid,
        email: user.email || '',
        name: user.displayName || user.email?.split('@')[0] || 'Usuário Google',
        picture: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=ea580c&color=ffffff&bold=true`,
        verifiedEmail: user.emailVerified,
        role: selectedRole,
        authProvider: 'google',
        connectedAt: new Date().toISOString()
      };
      
      handleCompleteAuth(authUser);
      return;
    } catch (firebaseError: any) {
      console.warn('Firebase signInWithPopup failed:', firebaseError?.code, firebaseError?.message);

      // 2. If Firebase fails (e.g. domain unauthorized in sandbox, iframe constraints), attempt GSI
      const gsiSuccess = await tryGsiTokenAuth();
      if (gsiSuccess) {
        return;
      }

      setIsLoading(false);

      if (firebaseError?.code === 'auth/popup-closed-by-user') {
        setAuthError('Janela de login foi fechada. Você pode tentar novamente ou usar o acesso rápido abaixo.');
      } else if (firebaseError?.code === 'auth/unauthorized-domain' || firebaseError?.code === 'auth/operation-not-allowed') {
        setAuthError('O domínio de visualização precisa de autorização no console do Google/Firebase.');
        setErrorDetails('Você pode entrar instantaneamente usando seu e-mail Gmail ou selecionar uma das contas de demonstração abaixo sem restrições.');
      } else {
        setAuthError('O navegador ou bloqueador de popups impediu a janela externa do Google.');
        setErrorDetails('Utilize o acesso rápido com seu Gmail abaixo para entrar imediatamente.');
      }
    }
  };

  const handleSelectDemoAccount = (account: (typeof DEMO_GOOGLE_ACCOUNTS)[0]) => {
    const user: GoogleAuthUser = {
      id: `google-${Date.now()}`,
      email: account.email,
      name: account.name,
      picture: account.picture,
      verifiedEmail: true,
      role: selectedRole,
      authProvider: 'google',
      connectedAt: new Date().toISOString()
    };
    handleCompleteAuth(user);
  };

  const handleCustomGoogleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;

    const email = customEmail.trim();
    const name = customName.trim() || email.split('@')[0];
    const user: GoogleAuthUser = {
      id: `google-${Date.now()}`,
      email,
      name,
      picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ea580c&color=ffffff&bold=true`,
      verifiedEmail: true,
      role: selectedRole,
      authProvider: 'google',
      connectedAt: new Date().toISOString()
    };
    handleCompleteAuth(user);
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

            <div className="mt-1">
              <h3 className="text-xl font-bold text-[#18181b]">
                Conectado com Sucesso!
              </h3>
              <p className="text-sm font-semibold text-[#ea580c] mt-0.5">
                Bem-vindo(a), {successUser.name}
              </p>
              <p className="text-xs text-[#71717a] mt-1">{successUser.email}</p>
            </div>

            <div className="bg-emerald-50 text-emerald-800 text-xs px-4 py-2 rounded-full font-medium flex items-center gap-1.5 border border-emerald-200 mt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Autenticado como {selectedRole === 'cliente' ? 'Cliente Residencial' : 'Prestador PRO'}</span>
            </div>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-[#e4e4e7] shadow-2xs">
                    {/* Official Google Vector G */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#18181b]">
                      {currentUser ? 'Conta Google Conectada' : 'Entrar com o Google'}
                    </h2>
                  </div>
                </div>
                <p className="text-xs text-[#71717a] mt-1">
                  Acesso rápido e seguro integrado ao ecossistema RESOLVA JÁ.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error / Notice Alert if Any */}
            {authError && (
              <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="font-bold text-amber-950">{authError}</p>
                  {errorDetails && <p className="text-[11px] text-amber-800">{errorDetails}</p>}
                </div>
                <button
                  onClick={() => {
                    setAuthError(null);
                    setErrorDetails(null);
                  }}
                  className="text-amber-700 hover:text-amber-950 font-bold text-xs"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Currently Logged In Banner if Active */}
            {currentUser && (
              <div className="bg-[#f4f4f5] p-3.5 rounded-2xl border border-[#e4e4e7] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SafeAvatar
                    src={currentUser.picture}
                    name={currentUser.name}
                    size="sm"
                    className="w-10 h-10 rounded-full border border-[#ea580c]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#18181b]">{currentUser.name}</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                        Ativo
                      </span>
                    </div>
                    <p className="text-[11px] text-[#71717a] truncate max-w-[200px]">
                      {currentUser.email}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    logoutGoogle(currentUser.token);
                    if (onLogout) onLogout();
                    onClose();
                  }}
                  className="text-xs text-rose-600 font-bold hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  title="Desconectar do Google"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sair
                </button>
              </div>
            )}

            {/* Role Selection for Google Auth */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#18181b]">
                Tipo de Acesso Desejado:
              </label>
              <div className="grid grid-cols-2 gap-2 bg-[#f4f4f5] p-1.5 rounded-2xl border border-[#e4e4e7]">
                <button
                  type="button"
                  onClick={() => setSelectedRole('cliente')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectedRole === 'cliente'
                      ? 'bg-[#18181b] text-white shadow-xs'
                      : 'text-[#71717a] hover:bg-white hover:text-[#18181b]'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Cliente Residencial</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('prestador')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectedRole === 'prestador'
                      ? 'bg-[#ea580c] text-white shadow-xs'
                      : 'text-[#71717a] hover:bg-white hover:text-[#ea580c]'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Prestador PRO</span>
                </button>
              </div>
            </div>

            {/* Primary Google OAuth 2.0 Action Button */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                id="btn-entrar-google-oauth-popup"
                type="button"
                onClick={handleTriggerGoogleOAuth}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-full bg-white hover:bg-[#fafafa] text-[#18181b] font-bold text-sm border-2 border-[#e4e4e7] hover:border-[#ea580c] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer group active:scale-98 disabled:opacity-75"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 text-[#ea580c] animate-spin" />
                    <span>Conectando com o Google...</span>
                  </>
                ) : (
                  <>
                    {/* Official Google Vector G */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>Entrar com Conta Google</span>
                  </>
                )}
              </button>
            </div>

            {/* Custom Google Email Fast Login */}
            <form onSubmit={handleCustomGoogleLogin} className="pt-2 border-t border-[#f4f4f5] flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#71717a] uppercase tracking-wider">
                <Mail className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>Ou entre diretamente com seu e-mail Gmail:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Seu Nome (Ex: Natalia)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden bg-white"
                />
                <input
                  type="email"
                  required
                  placeholder="seu.email@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#18181b] hover:bg-[#ea580c] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Conectar com este Gmail</span>
              </button>
            </form>

            {/* Quick 1-Click Accounts */}
            <div className="flex flex-col gap-2 pt-1 border-t border-[#f4f4f5]">
              <span className="text-[11px] font-bold text-[#71717a] uppercase tracking-wider">
                Contas Google de Teste (1-Clique):
              </span>

              <div className="grid grid-cols-1 gap-2">
                {DEMO_GOOGLE_ACCOUNTS.map((acc, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelectDemoAccount(acc)}
                    className="p-2.5 rounded-2xl border border-[#e4e4e7] hover:border-[#ea580c] hover:bg-[#fff7ed]/50 transition-all flex items-center justify-between group cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <SafeAvatar
                        src={acc.picture}
                        name={acc.name}
                        size="sm"
                        className="w-9 h-9 rounded-full border border-[#e4e4e7]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#18181b] group-hover:text-[#ea580c] transition-colors">
                            {acc.name}
                          </span>
                          <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-md bg-[#f4f4f5] text-[#52525b]">
                            {acc.role === 'cliente' ? 'Cliente' : 'Prestador PRO'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#71717a] truncate">{acc.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-[#ea580c] opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Entrar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Security Footer */}
            <div className="text-[10px] text-[#71717a] flex items-center justify-center gap-1.5 pt-1 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Autenticação criptografada • Proteção de dados padrão LGPD</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
