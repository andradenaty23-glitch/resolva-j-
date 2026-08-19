import React from 'react';
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
  UserPlus
} from 'lucide-react';
import { ClientProfile } from '../types';

interface ProfileScreenProps {
  client: ClientProfile;
  onSwitchToProvider: () => void;
  onOpenNewRegistration: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  client,
  onSwitchToProvider,
  onOpenNewRegistration
}) => {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto pb-16">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#241822] tracking-tight">
            Perfil do Cliente
          </h1>
          <p className="text-xs text-[#867083]">Gerencie seus dados residenciais e assinatura Resolva Já</p>
        </div>

        <button
          onClick={onOpenNewRegistration}
          className="text-xs font-bold text-[#a200ac] bg-[#fee8f7] hover:bg-[#cb00d8] hover:text-white px-3 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" /> Novo Cadastro
        </button>
      </div>

      {/* User Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#d9bfd3] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={client.avatar}
            alt={client.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#a200ac]"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#241822]">{client.name}</h2>
              <span className="bg-[#fee8f7] text-[#a200ac] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                {client.plan}
              </span>
            </div>
            <p className="text-xs text-[#544151]">{client.email}</p>
            <p className="text-xs text-[#867083] mt-0.5">CPF: {client.cpf} • {client.phone}</p>
          </div>
        </div>

        <button
          onClick={onSwitchToProvider}
          className="text-xs font-bold text-[#cb00d8] bg-[#fee8f7] hover:bg-[#cb00d8] hover:text-white px-3.5 py-2 rounded-full transition-all flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
        >
          <Wrench className="w-3.5 h-3.5" /> Alternar para Modo Prestador
        </button>
      </div>

      {/* Home Address */}
      <div className="bg-white rounded-2xl p-5 border border-[#f2dceb] shadow-xs flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-[#a200ac]" />
            <h3 className="text-sm font-bold text-[#241822]">Imóvel Cadastrado ({client.residenceType})</h3>
          </div>
          <button className="text-xs font-bold text-[#a200ac] hover:underline cursor-pointer">
            Alterar
          </button>
        </div>
        <div className="bg-[#fff7fa] p-3.5 rounded-xl border border-[#f2dceb] text-xs text-[#544151]">
          <p className="font-bold text-[#241822]">
            {client.address.street}, {client.address.number} {client.address.complement && `• ${client.address.complement}`}
          </p>
          <p className="text-[#867083] mt-0.5">
            {client.address.neighborhood} - {client.address.city}/{client.address.state} • CEP {client.address.cep}
          </p>
        </div>
      </div>

      {/* Menu Options */}
      <div className="bg-white rounded-2xl border border-[#f2dceb] shadow-xs overflow-hidden divide-y divide-[#f2dceb]">
        <button className="w-full p-4 flex items-center justify-between hover:bg-[#fee8f7]/50 transition-colors text-left cursor-pointer">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-[#544151]" />
            <div>
              <p className="text-sm font-semibold text-[#241822]">Formas de Pagamento</p>
              <p className="text-xs text-[#867083]">Mastercard final 4291 • Pix automático</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#867083]" />
        </button>

        <button className="w-full p-4 flex items-center justify-between hover:bg-[#fee8f7]/50 transition-colors text-left cursor-pointer">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#544151]" />
            <div>
              <p className="text-sm font-semibold text-[#241822]">Garantia Resolva Já Protege</p>
              <p className="text-xs text-[#867083]">Garantia de 90 dias com cobertura de até R$ 5.000</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#867083]" />
        </button>

        <button className="w-full p-4 flex items-center justify-between hover:bg-[#fee8f7]/50 transition-colors text-left cursor-pointer">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-[#544151]" />
            <div>
              <p className="text-sm font-semibold text-[#241822]">Alertas & Notificações</p>
              <p className="text-xs text-[#867083]">Avisos preventivos da casa e status de agendamentos</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#867083]" />
        </button>

        <button className="w-full p-4 flex items-center justify-between hover:bg-[#fee8f7]/50 transition-colors text-left cursor-pointer">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-[#544151]" />
            <div>
              <p className="text-sm font-semibold text-[#241822]">Central de Ajuda & Suporte</p>
              <p className="text-xs text-[#867083]">Fale com o time de engenharia residencial Resolva Já</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#867083]" />
        </button>
      </div>

      <button
        onClick={() => onOpenNewRegistration()}
        className="text-xs text-[#a200ac] hover:underline font-bold self-center flex items-center gap-1.5 py-2 cursor-pointer"
      >
        <UserPlus className="w-4 h-4" /> Cadastrar outro cliente ou prestador
      </button>
    </div>
  );
};
