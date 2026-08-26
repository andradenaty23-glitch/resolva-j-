import React from 'react';
import { Cpu, Bell, ShieldCheck, User, Wrench, UserPlus, Smartphone, LogIn, RefreshCw, ShieldAlert } from 'lucide-react';
import { GoogleAuthUser, NotificationItem, UserRole } from '../types';
import { SafeAvatar } from './SafeAvatar';

interface HeaderProps {
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  onOpenSystemStatus: () => void;
  unreadCount: number;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenRegistration: () => void;
  googleUser: GoogleAuthUser | null;
  onOpenGoogleAuth: () => void;
  onOpenInstallModal: () => void;
  onOpenUpdateModal?: () => void;
  onOpenAdminPanel?: () => void;
  isAdmin?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  notifications,
  onOpenNotifications,
  onOpenSystemStatus,
  unreadCount,
  currentRole,
  onRoleChange,
  onOpenRegistration,
  googleUser,
  onOpenGoogleAuth,
  onOpenInstallModal,
  onOpenUpdateModal,
  onOpenAdminPanel,
  isAdmin = false
}) => {
  return (
    <header className="w-full top-0 sticky bg-white/95 backdrop-blur-md shadow-xs z-40 border-b border-slate-200/80 transition-all select-none">
      <div className="max-w-4xl mx-auto flex justify-between items-center px-2.5 sm:px-5 py-2 gap-1.5 sm:gap-2.5">
        {/* Left: Role Switcher & IoT Status */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            id="btn-iot-status"
            onClick={onOpenSystemStatus}
            aria-label="Status do Sistema Resolva Já IoT"
            className="text-[#ea580c] hover:bg-[#fff7ed] active:scale-95 transition-all p-2 rounded-xl flex items-center justify-center relative cursor-pointer border border-transparent hover:border-[#fed7aa] min-w-[38px] min-h-[38px]"
            title="Status do Sistema Resolva Já IoT"
          >
            <Cpu className="w-5 h-5 text-[#ea580c]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse"></span>
          </button>

          {/* Role Switcher Pill */}
          <div className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200 shadow-2xs" role="group" aria-label="Alternar perfil de usuário">
            <button
              id="switch-role-cliente"
              onClick={() => onRoleChange('cliente')}
              aria-label="Alternar para Visão do Cliente"
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[34px] ${
                currentRole === 'cliente'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
              title="Alternar para Visão do Cliente"
            >
              <User className="w-3.5 h-3.5" />
              <span>Cliente</span>
            </button>

            <button
              id="switch-role-prestador"
              onClick={() => onRoleChange('prestador')}
              aria-label="Alternar para Visão do Prestador PRO"
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[34px] ${
                currentRole === 'prestador'
                  ? 'bg-[#ea580c] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#ea580c] hover:bg-white/60'
              }`}
              title="Alternar para Visão do Prestador"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>PRO</span>
            </button>
          </div>
        </div>

        {/* Center Brand Title (responsive display) */}
        <div className="hidden md:flex items-center gap-1 select-none shrink-0" aria-label="Logotipo Resolva Já">
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 font-sans flex items-center gap-1">
            RESOLVA <span className="text-[#ea580c]">JÁ</span>
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Admin Panel Quick Action */}
          {onOpenAdminPanel && (
            <button
              id="btn-admin-panel"
              onClick={onOpenAdminPanel}
              aria-label="Painel de Administração do Firestore"
              className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 p-2 sm:px-2.5 sm:py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-2xs active:scale-95 min-h-[38px]"
              title="Auditoria & Painel Firestore (Admin)"
            >
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {/* App Install Button */}
          <button
            id="btn-install-app"
            onClick={onOpenInstallModal}
            aria-label="Instalar Aplicativo no Dispositivo"
            className="text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-900 hover:text-white border border-slate-200 p-2 sm:px-2.5 sm:py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 min-h-[38px]"
            title="Instalar Aplicativo (PWA / APK)"
          >
            <Smartphone className="w-4 h-4 text-[#ea580c]" />
            <span className="hidden sm:inline">App</span>
          </button>

          {/* Google Auth Trigger */}
          {googleUser ? (
            <button
              id="btn-google-profile"
              onClick={onOpenGoogleAuth}
              aria-label={`Conta Google conectada: ${googleUser.name}`}
              className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-xl bg-white border border-slate-200 hover:border-[#ea580c] transition-all cursor-pointer shadow-2xs group active:scale-95 min-h-[38px]"
              title={`Conectado como ${googleUser.name} (${googleUser.email})`}
            >
              <div className="relative">
                <SafeAvatar
                  src={googleUser.picture}
                  name={googleUser.name}
                  size="sm"
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-emerald-500"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full ring-1 ring-white"></div>
              </div>
              <span className="text-xs font-bold text-slate-800 hidden md:inline max-w-[70px] truncate">
                {googleUser.givenName || googleUser.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              id="btn-entrar-google"
              onClick={onOpenGoogleAuth}
              aria-label="Entrar com conta Google"
              className="text-xs sm:text-sm font-bold text-slate-800 bg-white border border-slate-200 hover:border-[#ea580c] hover:bg-[#fff7ed] p-2 sm:px-2.5 sm:py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 min-h-[38px]"
              title="Entrar com conta Google"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
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
              <span className="hidden sm:inline">Entrar</span>
            </button>
          )}

          {/* Notifications Bell */}
          <button
            id="btn-notifications"
            onClick={onOpenNotifications}
            aria-label={`Notificações: ${unreadCount} não lidas`}
            className="text-slate-800 hover:bg-slate-100 p-2 rounded-xl transition-all relative group cursor-pointer active:scale-95 min-w-[38px] min-h-[38px] flex items-center justify-center"
            title="Notificações do Sistema"
          >
            <Bell className="w-5 h-5 text-slate-700" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#ea580c] text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
