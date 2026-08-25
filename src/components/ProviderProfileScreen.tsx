import React, { useState, useRef } from 'react';
import {
  User,
  Shield,
  Star,
  Award,
  CreditCard,
  MapPin,
  Clock,
  Edit,
  CheckCircle,
  FileText,
  DollarSign,
  LogOut,
  ChevronRight,
  Plus,
  Camera,
  Upload,
  Key,
  Briefcase,
  Trash2,
  Smartphone,
  ShieldCheck
} from 'lucide-react';
import { ProviderProfile, GoogleAuthUser } from '../types';
import { SafeAvatar } from './SafeAvatar';
import { EditProviderProfileModal } from './EditProviderProfileModal';
import { DeleteProfileModal } from './DeleteProfileModal';

interface ProviderProfileScreenProps {
  provider: ProviderProfile;
  onUpdateProvider: (updated: Partial<ProviderProfile>) => void;
  onDeleteProfile?: () => void;
  onSwitchToClient: () => void;
  onOpenNewRegistration: () => void;
  googleUser?: GoogleAuthUser | null;
  onOpenGoogleAuth?: () => void;
  onDisconnectGoogle?: () => void;
  onOpenInstallModal?: () => void;
}

export const ProviderProfileScreen: React.FC<ProviderProfileScreenProps> = ({
  provider,
  onUpdateProvider,
  onDeleteProfile,
  onSwitchToClient,
  onOpenNewRegistration,
  googleUser,
  onOpenGoogleAuth,
  onDisconnectGoogle,
  onOpenInstallModal
}) => {
  const [isEditingFullProfile, setIsEditingFullProfile] = useState(false);
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [rate, setRate] = useState(provider.laborBaseRate);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveRate = () => {
    onUpdateProvider({ laborBaseRate: rate });
    setIsEditingRate(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onUpdateProvider({ avatar: result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto pb-16 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#18181b] tracking-tight">
            Perfil Profissional
          </h1>
          <p className="text-xs text-[#71717a]">Credenciamento, documentos e faturamento</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditingFullProfile(true)}
            className="text-xs font-bold text-[#18181b] bg-white hover:bg-[#f4f4f5] border border-[#e4e4e7] px-3 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer shadow-xs"
          >
            <Edit className="w-3.5 h-3.5 text-[#ea580c]" /> Editar Perfil
          </button>
          <button
            onClick={onOpenNewRegistration}
            className="text-xs font-bold text-[#ea580c] bg-[#fff7ed] hover:bg-[#ea580c] hover:text-white border border-[#fed7aa] px-3 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Novo Cadastro / Login
          </button>
        </div>
      </div>

      {/* Provider Main Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#e4e4e7] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <SafeAvatar
              src={provider.avatar}
              name={provider.name}
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
              title="Trocar foto do prestador"
            >
              <Camera className="w-4 h-4 mb-0.5" />
              <span className="text-[8px] font-bold">Mudar</span>
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#18181b]">{provider.name || 'Prestador de Serviços'}</h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <CheckCircle className="w-3 h-3" /> Resolva Já PRO
              </span>
            </div>
            <p className="text-xs text-[#52525b]">{provider.category}</p>
            <p className="text-xs text-[#71717a] mt-0.5">Documento: {provider.document || 'Não informado'}</p>
          </div>
        </div>

        <button
          onClick={onSwitchToClient}
          className="text-xs font-bold text-[#18181b] bg-[#f4f4f5] hover:bg-[#18181b] hover:text-white border border-[#e4e4e7] px-3.5 py-2 rounded-full transition-all flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
        >
          <User className="w-3.5 h-3.5" /> Alternar para Modo Cliente
        </button>
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
                {googleUser ? 'Google PRO Vinculado' : 'Acesso Rápido Google'}
              </h4>
              {googleUser && (
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                  <ShieldCheck className="w-2.5 h-2.5" /> Verificado
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#71717a]">
              {googleUser
                ? `${googleUser.email} • Login com 1 clique ativo para prestador`
                : 'Conecte sua conta Google para login em 1 clique e receber chamados em tempo real'}
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

      {/* App Install Banner Option */}
      <button
        onClick={onOpenInstallModal}
        className="w-full bg-gradient-to-r from-zinc-900 to-zinc-800 text-white rounded-2xl p-4 border border-zinc-700 shadow-md flex items-center justify-between hover:from-black hover:to-zinc-900 transition-all cursor-pointer text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ea580c] flex items-center justify-center shrink-0 shadow-xs">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold">Instalar Aplicativo no Celular</h4>
              <span className="bg-[#ea580c] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                PWA / APK
              </span>
            </div>
            <p className="text-[11px] text-zinc-300">
              Receba notificações sonoras de novos chamados e use em tela cheia
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-zinc-400" />
      </button>

      {/* Verification & Trust Badge */}
      <div className="bg-[#fff7ed] rounded-2xl p-4 border border-[#fed7aa] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#ea580c] text-white flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#9a3412]">Documentação e Credenciamento</h4>
            <p className="text-xs text-[#52525b]">
              Cadastro verificado para recebimento em conta e emissão de propostas.
            </p>
          </div>
        </div>
        <span className="text-xs font-extrabold text-[#ea580c] bg-white px-3 py-1 rounded-full shadow-xs border border-[#fed7aa]">
          {provider.trustIndex ? `Score ${provider.trustIndex}` : 'Ativo'}
        </span>
      </div>

      {/* Pricing & Banking */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-[#e4e4e7] shadow-xs flex flex-col justify-between gap-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-[#71717a] uppercase">Valor Base de Mão de Obra</span>
              {isEditingRate ? (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold">R$</span>
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-20 p-1 border border-[#e4e4e7] rounded-lg text-sm font-bold"
                  />
                  <button
                    onClick={handleSaveRate}
                    className="bg-[#ea580c] text-white text-xs px-2 py-1 rounded-lg hover:bg-[#c2410c] cursor-pointer"
                  >
                    Salvar
                  </button>
                </div>
              ) : (
                <p className="text-2xl font-extrabold text-[#18181b] mt-1">R$ {provider.laborBaseRate || 100}</p>
              )}
            </div>
            {!isEditingRate && (
              <button
                onClick={() => setIsEditingRate(true)}
                className="text-xs text-[#ea580c] font-bold hover:underline cursor-pointer"
              >
                Editar
              </button>
            )}
          </div>
          <p className="text-[11px] text-[#71717a]">Utilizado como referência em novas propostas.</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#e4e4e7] shadow-xs flex flex-col justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-[#71717a] uppercase">Chave Pix de Recebimento</span>
            <p className="text-sm font-bold text-[#18181b] mt-1 truncate">
              {provider.bankAccount?.pixKey || 'Não cadastrada'}
            </p>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Repasses automáticos com taxa zero
          </p>
        </div>
      </div>

      {/* Specialties */}
      <div className="bg-white rounded-2xl p-5 border border-[#e4e4e7] shadow-xs">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-[#18181b]">Especialidades Atendidas</h3>
          <button
            onClick={() => setIsEditingFullProfile(true)}
            className="text-xs text-[#ea580c] font-bold hover:underline cursor-pointer"
          >
            Editar Especialidades
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(provider.specialties || []).length === 0 ? (
            <span className="text-xs text-[#71717a]">Nenhuma especialidade selecionada.</span>
          ) : (
            provider.specialties.map((s, idx) => (
              <span
                key={idx}
                className="text-xs bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa] font-bold px-3 py-1 rounded-full"
              >
                {s}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Client Reviews */}
      <div className="bg-white rounded-2xl p-5 border border-[#e4e4e7] shadow-xs flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-[#18181b]">Avaliações dos Clientes</h3>
          <span className="text-xs text-amber-600 font-bold flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-500" /> {provider.rating || 5.0} ({provider.reviewsCount || 0} avaliações)
          </span>
        </div>

        {provider.reviewsCount === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-[#e4e4e7] text-center text-xs text-[#71717a]">
            Nenhuma avaliação registrada ainda. Suas notas e depoimentos dos clientes aparecerão aqui após a conclusão dos atendimentos.
          </div>
        ) : (
          <div className="space-y-2 text-xs text-[#52525b]">
            <div className="bg-[#fafafa] p-3 rounded-xl border border-[#e4e4e7]">
              <div className="flex justify-between font-bold text-[#18181b] mb-1">
                <span>Atendimento Verificado</span>
                <span className="text-amber-500">★★★★★</span>
              </div>
              <p>"Serviço concluído com pontualidade e transparência pelo aplicativo Resolva Já."</p>
            </div>
          </div>
        )}
      </div>

      {/* Danger Zone: Delete Provider Profile */}
      <div className="bg-rose-50/60 rounded-2xl p-4 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            Excluir Perfil Profissional
          </h4>
          <p className="text-[11px] text-rose-700 mt-0.5">
            Descredencia sua conta profissional, remove especialidades, chave Pix e histórico de propostas.
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

      {/* Edit Profile Modal */}
      <EditProviderProfileModal
        isOpen={isEditingFullProfile}
        onClose={() => setIsEditingFullProfile(false)}
        provider={provider}
        onSave={onUpdateProvider}
      />

      {/* Delete Profile Confirmation Modal */}
      <DeleteProfileModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        role="prestador"
        profileName={provider.name || 'Prestador de Serviços'}
        onConfirmDelete={() => {
          if (onDeleteProfile) onDeleteProfile();
        }}
      />
    </div>
  );
};
