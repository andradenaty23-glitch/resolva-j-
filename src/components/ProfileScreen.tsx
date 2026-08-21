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
  Check
} from 'lucide-react';
import { ClientProfile } from '../types';
import { SafeAvatar } from './SafeAvatar';

interface ProfileScreenProps {
  client: ClientProfile;
  onUpdateClient?: (updated: Partial<ClientProfile>) => void;
  onSwitchToProvider: () => void;
  onOpenNewRegistration: () => void;
  onNavigateToPayments?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  client,
  onUpdateClient,
  onSwitchToProvider,
  onOpenNewRegistration,
  onNavigateToPayments
}) => {
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
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
          onClick={onOpenNewRegistration}
          className="text-xs font-bold text-[#ea580c] bg-[#fff7ed] hover:bg-[#ea580c] hover:text-white px-3 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer border border-[#fed7aa]"
        >
          <UserPlus className="w-3.5 h-3.5" /> Novo Cadastro / Login
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
              <h2 className="text-lg font-bold text-[#18181b]">{client.name}</h2>
              <span className="bg-[#fff7ed] text-[#ea580c] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase border border-[#fed7aa]">
                {client.plan}
              </span>
            </div>
            <p className="text-xs text-[#52525b]">{client.email}</p>
            <p className="text-xs text-[#71717a] mt-0.5">CPF: {client.cpf} • {client.phone}</p>
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
            <h3 className="text-sm font-bold text-[#18181b]">Imóvel Cadastrado ({client.residenceType})</h3>
          </div>
          <button className="text-xs font-bold text-[#ea580c] hover:underline cursor-pointer">
            Alterar
          </button>
        </div>
        <div className="bg-[#fafafa] p-3.5 rounded-xl border border-[#e4e4e7] text-xs text-[#52525b]">
          <p className="font-bold text-[#18181b]">
            {client.address.street}, {client.address.number} {client.address.complement && `• ${client.address.complement}`}
          </p>
          <p className="text-[#71717a] mt-0.5">
            {client.address.neighborhood} - {client.address.city}/{client.address.state} • CEP {client.address.cep}
          </p>
        </div>
      </div>

      {/* Menu Options */}
      <div className="bg-white rounded-2xl border border-[#e4e4e7] shadow-xs overflow-hidden divide-y divide-[#e4e4e7]">
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

        <button className="w-full p-4 flex items-center justify-between hover:bg-[#fff7ed]/50 transition-colors text-left cursor-pointer">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#52525b]" />
            <div>
              <p className="text-sm font-semibold text-[#18181b]">Garantia Resolva Já Protege</p>
              <p className="text-xs text-[#71717a]">Garantia de 90 dias com cobertura de até R$ 5.000</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#71717a]" />
        </button>

        <button className="w-full p-4 flex items-center justify-between hover:bg-[#fff7ed]/50 transition-colors text-left cursor-pointer">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-[#52525b]" />
            <div>
              <p className="text-sm font-semibold text-[#18181b]">Alertas & Notificações</p>
              <p className="text-xs text-[#71717a]">Avisos preventivos da casa e status de agendamentos</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#71717a]" />
        </button>

        <button className="w-full p-4 flex items-center justify-between hover:bg-[#fff7ed]/50 transition-colors text-left cursor-pointer">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-[#52525b]" />
            <div>
              <p className="text-sm font-semibold text-[#18181b]">Central de Ajuda & Suporte</p>
              <p className="text-xs text-[#71717a]">Fale com o time de engenharia residencial Resolva Já</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#71717a]" />
        </button>
      </div>

      <button
        onClick={() => onOpenNewRegistration()}
        className="text-xs text-[#ea580c] hover:underline font-bold self-center flex items-center gap-1.5 py-2 cursor-pointer"
      >
        <UserPlus className="w-4 h-4" /> Cadastrar outro cliente ou prestador
      </button>
    </div>
  );
};
