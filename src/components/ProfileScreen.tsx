import React, { useState, useRef } from 'react';
import {
  User,
  MapPin,
  CreditCard,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Home,
  Wrench,
  UserPlus,
  Camera,
  Upload,
  Check,
  Edit3,
  Trash2,
  Smartphone,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { ClientProfile, GoogleAuthUser, NotificationItem } from '../types';
import { SafeAvatar } from './SafeAvatar';
import { EditProfileModal } from './EditProfileModal';
import { DeleteProfileModal } from './DeleteProfileModal';
import { GuaranteeModal } from './GuaranteeModal';
import { NotificationsPreferencesModal } from './NotificationsPreferencesModal';
import { SupportCenterModal } from './SupportCenterModal';

interface ProfileScreenProps {
  client: ClientProfile;
  notifications?: NotificationItem[];
  onUpdateClient?: (updated: Partial<ClientProfile>) => void;
  onDeleteProfile?: () => void;
  onSwitchToProvider: () => void;
  onOpenNewRegistration: () => void;
  onNavigateToPayments?: () => void;
  googleUser?: GoogleAuthUser | null;
  onOpenGoogleAuth?: () => void;
  onDisconnectGoogle?: () => void;
  onOpenInstallModal?: () => void;
  onMarkAllNotificationsAsRead?: () => void;
  onClearAllNotifications?: () => void;
  onAddNotification?: (notification: NotificationItem) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  client,
  notifications = [],
  onUpdateClient,
  onDeleteProfile,
  onSwitchToProvider,
  onOpenNewRegistration,
  onNavigateToPayments,
  googleUser,
  onOpenGoogleAuth,
  onDisconnectGoogle,
  onOpenInstallModal,
  onMarkAllNotificationsAsRead,
  onClearAllNotifications,
  onAddNotification
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isGuaranteeModalOpen, setIsGuaranteeModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result && onUpdateClient) {
        onUpdateClient({ avatar: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const hasAddress = client.address && client.address.street;

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto pb-16">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#18181b] tracking-tight">
            Perfil do Cliente
          </h1>
          <p className="text-xs text-[#71717a]">Gerencie seus dados residenciais e assinatura Resolva Já</p>
        </div>

        <button
          onClick={() => setIsEditModalOpen(true)}
          className="text-xs font-bold text-[#ea580c] bg-[#fff7ed] hover:bg-[#ea580c] hover:text-white px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer border border-[#fed7aa]"
        >
          <Edit3 className="w-3.5 h-3.5" /> Editar Dados
        </button>
      </div>

      {/* User Card with Photo Change */}
      <div className="bg-white rounded-3xl p-5 border border-[#e4e4e7] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <SafeAvatar
              src={client.avatar}
              name={client.name}
              size="md"
              className="w-16 h-16 rounded-2xl border-2 border-[#ea580c]"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/50 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
              title="Trocar foto do perfil"
            >
              <Camera className="w-4 h-4 mb-0.5" />
              <span className="text-[8px] font-bold">Mudar</span>
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#18181b]">{client.name || 'Cliente (Não informado)'}</h2>
              <span className="bg-[#fff7ed] text-[#ea580c] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase border border-[#fed7aa]">
                {client.plan || 'Resolva Já Free'}
              </span>
            </div>
            <p className="text-xs text-[#52525b]">{client.email || 'Email não cadastrado'}</p>
            <p className="text-xs text-[#71717a] mt-0.5">
              {client.phone ? `Tel: ${client.phone}` : 'Telefone não cadastrado'}
              {client.cpf ? ` • CPF: ${client.cpf}` : ''}
            </p>
          </div>
        </div>

        <button
          onClick={onSwitchToProvider}
          className="text-xs font-bold text-[#18181b] bg-[#f4f4f5] hover:bg-[#18181b] hover:text-white px-3.5 py-2 rounded-full transition-all flex items-center gap-1.5 self-start sm:self-center cursor-pointer border border-[#e4e4e7]"
        >
          <Wrench className="w-3.5 h-3.5" /> Alternar para Modo Prestador
        </button>
      </div>

      {/* Home Address */}
      <div className="bg-white rounded-2xl p-5 border border-[#e4e4e7] shadow-xs flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-[#ea580c]" />
            <h3 className="text-sm font-bold text-[#18181b]">Imóvel Cadastrado ({client.residenceType || 'apartamento'})</h3>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-xs font-bold text-[#ea580c] hover:underline cursor-pointer"
          >
            {hasAddress ? 'Alterar Endereço' : 'Cadastrar Endereço'}
          </button>
        </div>

        {hasAddress ? (
          <div className="bg-[#fafafa] p-3.5 rounded-xl border border-[#e4e4e7] text-xs text-[#52525b]">
            <p className="font-bold text-[#18181b]">
              {client.address.street}, {client.address.number} {client.address.complement && `• ${client.address.complement}`}
            </p>
            <p className="text-[#71717a] mt-0.5">
              {client.address.neighborhood ? `${client.address.neighborhood} - ` : ''}
              {client.address.city}/{client.address.state} {client.address.cep ? `• CEP ${client.address.cep}` : ''}
            </p>
          </div>
        ) : (
          <div className="bg-[#fafafa] p-3.5 rounded-xl border border-dashed border-[#e4e4e7] text-xs text-[#71717a] text-center">
            Nenhum endereço cadastrado ainda. Clique em "Cadastrar Endereço" para configurar seu imóvel.
          </div>
        )}
      </div>

      {/* Google Account Authentication Status */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e4e4e7] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-[#e4e4e7] shadow-2xs shrink-0">
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
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-[#18181b]">
                {googleUser ? 'Conta Google Vinculada' : 'Autenticação Google'}
              </h4>
              {googleUser && (
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                  <ShieldCheck className="w-2.5 h-2.5" /> Verificado
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#71717a]">
              {googleUser
                ? `${googleUser.email} • Login com 1 clique ativo`
                : 'Conecte sua conta Google para login rápido e backup dos seus dados'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {googleUser ? (
            <button
              type="button"
              onClick={onDisconnectGoogle}
              className="text-xs text-zinc-600 hover:text-rose-600 font-bold px-3 py-1.5 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer border border-[#e4e4e7]"
            >
              Desconectar
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenGoogleAuth}
              className="text-xs font-bold text-white bg-[#18181b] hover:bg-[#ea580c] px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              Conectar Google
            </button>
          )}
        </div>
      </div>

      {/* Menu Options */}
      <div className="bg-white rounded-2xl border border-[#e4e4e7] shadow-xs overflow-hidden divide-y divide-[#e4e4e7]">
        {/* App Installation */}
        <button
          onClick={onOpenInstallModal}
          className="w-full p-4 flex items-center justify-between hover:bg-[#fff7ed]/50 transition-colors text-left cursor-pointer bg-gradient-to-r from-orange-50/40 to-transparent"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#fff7ed] text-[#ea580c] flex items-center justify-center border border-[#fed7aa]">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-[#18181b]">Instalar Aplicativo no Celular / PC</p>
                <span className="bg-[#ea580c] text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                  PWA & APK
                </span>
              </div>
              <p className="text-xs text-[#71717a]">Acesso rápido offline, notificações e tela cheia standalone</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#71717a]" />
        </button>

        <button
          onClick={onNavigateToPayments}
          className="w-full p-4 flex items-center justify-between hover:bg-[#fff7ed]/50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-[#ea580c]" />
            <div>
              <p className="text-sm font-semibold text-[#18181b]">Formas de Pagamento & Carteira</p>
              <p className="text-xs text-[#71717a]">Gerenciar cartões, Pix, parcelamento e custódia</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#71717a]" />
        </button>

        <button
          onClick={() => setIsGuaranteeModalOpen(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-[#fff7ed]/50 transition-colors text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#fff7ed] text-[#ea580c] flex items-center justify-center border border-[#fed7aa] group-hover:scale-105 transition-transform">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#18181b]">Garantia Resolva Já Protege</p>
              <p className="text-xs text-[#71717a]">Garantia de 90 dias com cobertura de até R$ 5.000</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#71717a] group-hover:text-[#ea580c] transition-colors" />
        </button>

        <button
          onClick={() => setIsNotificationsModalOpen(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-[#fff7ed]/50 transition-colors text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#fff7ed] text-[#ea580c] flex items-center justify-center border border-[#fed7aa] group-hover:scale-105 transition-transform">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#18181b]">Alertas & Notificações</p>
              <p className="text-xs text-[#71717a]">Avisos preventivos da casa e status de agendamentos</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#71717a] group-hover:text-[#ea580c] transition-colors" />
        </button>

        <button
          onClick={() => setIsSupportModalOpen(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-[#fff7ed]/50 transition-colors text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#fff7ed] text-[#ea580c] flex items-center justify-center border border-[#fed7aa] group-hover:scale-105 transition-transform">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#18181b]">Central de Ajuda & Suporte</p>
              <p className="text-xs text-[#71717a]">Fale com o time de engenharia residencial Resolva Já</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#71717a] group-hover:text-[#ea580c] transition-colors" />
        </button>
      </div>

      {/* Danger Zone: Delete Profile */}
      <div className="bg-rose-50/60 rounded-2xl p-4 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            Excluir Perfil de Cliente
          </h4>
          <p className="text-[11px] text-rose-700 mt-0.5">
            Remove todos os dados cadastrados, imóveis e preferências permanentemente.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsDeleteModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs"
        >
          Excluir Perfil
        </button>
      </div>

      <button
        onClick={() => onOpenNewRegistration()}
        className="text-xs text-[#ea580c] hover:underline font-bold self-center flex items-center gap-1.5 py-2 cursor-pointer"
      >
        <UserPlus className="w-4 h-4" /> Cadastrar outro cliente ou prestador
      </button>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        client={client}
        onSave={(updated) => {
          if (onUpdateClient) onUpdateClient(updated);
        }}
      />

      {/* Delete Profile Confirmation Modal */}
      <DeleteProfileModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        role="cliente"
        profileName={client.name || 'Cliente'}
        onConfirmDelete={() => {
          if (onDeleteProfile) onDeleteProfile();
        }}
      />

      {/* Guarantee Resolva Já Protege Modal */}
      <GuaranteeModal
        isOpen={isGuaranteeModalOpen}
        onClose={() => setIsGuaranteeModalOpen(false)}
        clientName={client.name}
      />

      {/* Notifications Preferences & Feed Modal */}
      <NotificationsPreferencesModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={onMarkAllNotificationsAsRead}
        onClearAll={onClearAllNotifications}
        onAddTestNotification={onAddNotification}
      />

      {/* Help & Residential Engineering Support Modal */}
      <SupportCenterModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        clientName={client.name}
        clientEmail={client.email}
      />
    </div>
  );
};
