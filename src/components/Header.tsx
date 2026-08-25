import React from 'react';
import { Cpu, Bell, ShieldCheck, User, Wrench, UserPlus, Smartphone, LogIn, RefreshCw } from 'lucide-react';
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
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  onOpenSystemStatus,
  unreadCount,
  currentRole,
  onRoleChange,
  onOpenRegistration,
  googleUser,
  onOpenGoogleAuth,
  onOpenInstallModal,
  onOpenUpdateModal
}) => {
  return (
    <header className="w-full top-0 sticky bg-white/95 backdrop-blur-md shadow-xs z-40 border-b border-[#e4e4e7]">
      <div className="max-w-3xl mx-auto flex justify-between items-center px-3 py-2 sm:px-5">
        {/* Left Smart Home IoT Icon & Role Switcher */}
        <div className="flex items-center gap-2">
          <button
            id="btn-iot-status"
            onClick={onOpenSystemStatus}
            className="text-[#ea580c] hover:bg-[#fff7ed] transition-all active:scale-95 duration-200 p-2 rounded-full flex items-center justify-center relative group cursor-pointer"
            title="Status do Sistema Resolva Já IoT"
          >
            <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-[#ea580c]" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse"></span>
          </button>

          {/* Role Switcher Pill */}
          <div className="flex items-center bg-[#f4f4f5] p-1 rounded-full border border-[#e4e4e7] shadow-2xs">
            <button
              id="switch-role-cliente"
              onClick={() => onRoleChange('cliente')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                currentRole === 'cliente'
                  ? 'bg-[#18181b] text-white shadow-xs'
                  : 'text-[#71717a] hover:bg-[#fff7ed] hover:text-[#ea580c]'
              }`}
              title="Alternar para Visão do Cliente"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cliente</span>
            </button>

            <button
              id="switch-role-prestador"
              onClick={() => onRoleChange('prestador')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                currentRole === 'prestador'
                  ? 'bg-[#ea580c] text-white shadow-xs'
                  : 'text-[#71717a] hover:bg-[#fff7ed] hover:text-[#ea580c]'
              }`}
              title="Alternar para Visão do Prestador de Serviços"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Prestador</span>
            </button>
          </div>
        </div>

        {/* Center Brand Title */}
        <div className="flex items-center gap-1.5 cursor-pointer select-none">
          <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#18181b] font-sans flex items-center gap-1">
            RESOLVA <span className="text-[#ea580c]">JÁ</span>
          </span>
          <span className="hidden lg:inline-flex items-center gap-1 bg-[#fff7ed] text-[#ea580c] border border-[#ffedd5] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            {currentRole === 'cliente' ? '🏠 Residencial' : '🛠️ PRO'}
          </span>
        </div>

        {/* Right Actions: Google Auth, Install App, Update App, Notification Bell */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* App Update Button */}
          {onOpenUpdateModal && (
            <button
              id="btn-update-app"
              onClick={onOpenUpdateModal}
              className="text-xs font-bold text-[#ea580c] bg-[#fff7ed] hover:bg-[#ea580c] hover:text-white border border-[#fed7aa] p-1.5 sm:px-2.5 sm:py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
              title="Buscar Atualizações do Aplicativo (v2.4.2)"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">v2.4.2</span>
            </button>
          )}

          {/* App Install Button */}
          <button
            id="btn-install-app"
            onClick={onOpenInstallModal}
            className="text-xs font-bold text-[#18181b] bg-[#f4f4f5] hover:bg-[#18181b] hover:text-white border border-[#e4e4e7] p-1.5 sm:px-2.5 sm:py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer"
            title="Instalar Aplicativo (PWA / APK)"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#ea580c]" />
            <span className="hidden md:inline">App</span>
          </button>

          {/* Google Auth Trigger */}
          {googleUser ? (
            <button
              id="btn-google-profile"
              onClick={onOpenGoogleAuth}
              className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-full bg-white border border-[#e4e4e7] hover:border-[#ea580c] transition-all cursor-pointer shadow-2xs group"
              title={`Conectado como ${googleUser.name} (${googleUser.email})`}
            >
              <div className="relative">
                <SafeAvatar
                  src={googleUser.picture}
                  name={googleUser.name}
                  size="sm"
                  className="w-6 h-6 rounded-full border border-emerald-500"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full ring-1 ring-white"></div>
              </div>
              <span className="text-xs font-bold text-[#18181b] hidden sm:inline max-w-[80px] truncate">
                {googleUser.givenName || googleUser.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              id="btn-entrar-google"
              onClick={onOpenGoogleAuth}
              className="text-xs font-bold text-[#18181b] bg-white border border-[#e4e4e7] hover:border-[#ea580c] hover:bg-[#fff7ed] px-2.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Entrar com conta Google"
            >
              {/* Google Vector Icon */}
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
              <span className="hidden sm:inline">Google</span>
            </button>
          )}

          {/* Register modal trigger */}
          <button
            id="btn-cadastrar-novo"
            onClick={onOpenRegistration}
            className="text-xs font-bold text-[#ea580c] bg-[#fff7ed] border border-[#fed7aa] hover:bg-[#ea580c] hover:text-white px-2.5 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
            title="Cadastrar novo Cliente ou Prestador"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Conta</span>
          </button>

          {/* Notifications */}
          <button
            id="btn-notifications"
            onClick={onOpenNotifications}
            className="text-[#52525b] hover:bg-[#f4f4f5] transition-all active:scale-95 duration-200 p-2 rounded-full flex items-center justify-center relative cursor-pointer"
            title="Notificações e Avisos"
          >
            <Bell className="w-5 h-5 text-[#52525b]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

