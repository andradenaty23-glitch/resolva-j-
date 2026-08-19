import React from 'react';
import { Cpu, Bell, ShieldCheck, User, Wrench, UserPlus } from 'lucide-react';
import { NotificationItem, UserRole } from '../types';

interface HeaderProps {
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  onOpenSystemStatus: () => void;
  unreadCount: number;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenRegistration: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  onOpenSystemStatus,
  unreadCount,
  currentRole,
  onRoleChange,
  onOpenRegistration
}) => {
  return (
    <header className="w-full top-0 sticky bg-[#fff7fa]/95 backdrop-blur-md shadow-xs z-40 border-b border-[#f2dceb]/60">
      <div className="max-w-4xl mx-auto flex justify-between items-center px-4 py-2.5 sm:px-6">
        {/* Left Smart Home IoT Icon */}
        <div className="flex items-center gap-2">
          <button
            id="btn-iot-status"
            onClick={onOpenSystemStatus}
            className="text-[#a200ac] hover:bg-[#fee8f7] transition-all active:scale-95 duration-200 p-2 rounded-full flex items-center justify-center relative group cursor-pointer"
            title="Status do Sistema Resolva Já IoT"
          >
            <Cpu className="w-6 h-6 text-[#a200ac]" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#fff7fa] animate-pulse"></span>
          </button>

          {/* Role Switcher Pill */}
          <div className="flex items-center bg-white p-1 rounded-full border border-[#d9bfd3] shadow-2xs">
            <button
              id="switch-role-cliente"
              onClick={() => onRoleChange('cliente')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                currentRole === 'cliente'
                  ? 'bg-[#a200ac] text-white shadow-xs'
                  : 'text-[#544151] hover:bg-[#fee8f7]'
              }`}
              title="Alternar para Visão do Cliente"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cliente</span>
            </button>

            <button
              id="switch-role-prestador"
              onClick={() => onRoleChange('prestador')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                currentRole === 'prestador'
                  ? 'bg-[#cb00d8] text-white shadow-xs'
                  : 'text-[#544151] hover:bg-[#fee8f7]'
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
          <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#a200ac] font-sans">
            RESOLVA JÁ
          </span>
          <span className="hidden md:inline-flex items-center gap-1 bg-[#fee8f7] text-[#a200ac] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            {currentRole === 'cliente' ? '🏠 Residencial' : '🛠️ PRO'}
          </span>
        </div>

        {/* Right Actions: Register new + Notification Bell */}
        <div className="flex items-center gap-1.5">
          <button
            id="btn-cadastrar-novo"
            onClick={onOpenRegistration}
            className="text-xs font-bold text-[#a200ac] bg-[#fee8f7] hover:bg-[#cb00d8] hover:text-white px-2.5 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer"
            title="Cadastrar novo Cliente ou Prestador"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cadastrar</span>
          </button>

          <button
            id="btn-notifications"
            onClick={onOpenNotifications}
            className="text-[#544151] hover:bg-[#fee8f7] transition-all active:scale-95 duration-200 p-2 rounded-full flex items-center justify-center relative cursor-pointer"
            title="Notificações e Avisos"
          >
            <Bell className="w-5 h-5 text-[#544151]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#ba1a1a] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#fff7fa]">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
