import React, { useState } from 'react';
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
  Plus
} from 'lucide-react';
import { ProviderProfile } from '../types';

interface ProviderProfileScreenProps {
  provider: ProviderProfile;
  onUpdateProvider: (updated: Partial<ProviderProfile>) => void;
  onSwitchToClient: () => void;
  onOpenNewRegistration: () => void;
}

export const ProviderProfileScreen: React.FC<ProviderProfileScreenProps> = ({
  provider,
  onUpdateProvider,
  onSwitchToClient,
  onOpenNewRegistration
}) => {
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [rate, setRate] = useState(provider.laborBaseRate);

  const handleSaveRate = () => {
    onUpdateProvider({ laborBaseRate: rate });
    setIsEditingRate(false);
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto pb-16">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#241822] tracking-tight">
            Perfil Profissional
          </h1>
          <p className="text-xs text-[#867083]">Credenciamento, documentos e faturamento</p>
        </div>

        <button
          onClick={onOpenNewRegistration}
          className="text-xs font-bold text-[#a200ac] bg-[#fee8f7] hover:bg-[#cb00d8] hover:text-white px-3 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Novo Cadastro
        </button>
      </div>

      {/* Provider Main Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#d9bfd3] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={provider.avatar}
            alt={provider.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#a200ac]"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#241822]">{provider.name}</h2>
              <span className="bg-[#6cf8bb]/30 text-[#006c49] text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <CheckCircle className="w-3 h-3" /> Resolva Já PRO
              </span>
            </div>
            <p className="text-xs text-[#544151]">{provider.category}</p>
            <p className="text-xs text-[#867083] mt-0.5">CNPJ: {provider.document}</p>
          </div>
        </div>

        <button
          onClick={onSwitchToClient}
          className="text-xs font-bold text-[#a200ac] bg-[#fee8f7] hover:bg-[#cb00d8] hover:text-white px-3.5 py-2 rounded-full transition-all flex items-center gap-1.5 self-start sm:self-center"
        >
          <User className="w-3.5 h-3.5" /> Alternar para Modo Cliente
        </button>
      </div>

      {/* Verification & Trust Badge */}
      <div className="bg-[#dee8ff]/50 rounded-2xl p-4 border border-[#d8e3fb] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#2563eb] text-white flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#111c2d]">Documentação Verificada</h4>
            <p className="text-xs text-[#434655]">
              Antecedentes criminais, certidões e CNPJ validados pelo time Resolva Já.
            </p>
          </div>
        </div>
        <span className="text-xs font-extrabold text-[#004ac6] bg-white px-3 py-1 rounded-full shadow-xs">
          Nível 4 (Ouro)
        </span>
      </div>

      {/* Pricing & Banking */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-[#f2dceb] shadow-xs flex flex-col justify-between gap-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-[#867083] uppercase">Valor Base de Mão de Obra</span>
              {isEditingRate ? (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold">R$</span>
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-20 p-1 border rounded-lg text-sm font-bold"
                  />
                  <button
                    onClick={handleSaveRate}
                    className="bg-[#a200ac] text-white text-xs px-2 py-1 rounded-lg"
                  >
                    Salvar
                  </button>
                </div>
              ) : (
                <p className="text-2xl font-extrabold text-[#241822] mt-1">R$ {provider.laborBaseRate}</p>
              )}
            </div>
            {!isEditingRate && (
              <button
                onClick={() => setIsEditingRate(true)}
                className="text-xs text-[#a200ac] font-bold hover:underline"
              >
                Editar
              </button>
            )}
          </div>
          <p className="text-[11px] text-[#867083]">Utilizado como referência em novos orçamentos.</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#f2dceb] shadow-xs flex flex-col justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-[#867083] uppercase">Chave Pix de Recebimento</span>
            <p className="text-sm font-bold text-[#241822] mt-1 truncate">{provider.bankAccount.pixKey}</p>
          </div>
          <p className="text-[11px] text-[#006c49] font-medium flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Repasses automáticos com taxa zero
          </p>
        </div>
      </div>

      {/* Specialties */}
      <div className="bg-white rounded-2xl p-5 border border-[#f2dceb] shadow-xs">
        <h3 className="text-sm font-bold text-[#241822] mb-3">Especialidades Atendidas</h3>
        <div className="flex flex-wrap gap-2">
          {provider.specialties.map((s, idx) => (
            <span
              key={idx}
              className="text-xs bg-[#fee8f7] text-[#a200ac] font-bold px-3 py-1 rounded-full"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Client Reviews */}
      <div className="bg-white rounded-2xl p-5 border border-[#f2dceb] shadow-xs flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-[#241822]">Avaliações Recentes dos Clientes</h3>
          <span className="text-xs text-amber-600 font-bold flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-500" /> {provider.rating} ({provider.reviewsCount})
          </span>
        </div>

        <div className="space-y-2 text-xs text-[#544151]">
          <div className="bg-[#fff7fa] p-3 rounded-xl border border-[#f2dceb]">
            <div className="flex justify-between font-bold text-[#241822] mb-1">
              <span>Natália A. (Pinheiros)</span>
              <span className="text-amber-500">★★★★★</span>
            </div>
            <p>"Excelente profissional! Diagnosticou o vazamento na pia em menos de 10 minutos."</p>
          </div>
          <div className="bg-[#fff7fa] p-3 rounded-xl border border-[#f2dceb]">
            <div className="flex justify-between font-bold text-[#241822] mb-1">
              <span>Rodrigo M. (Vila Mariana)</span>
              <span className="text-amber-500">★★★★★</span>
            </div>
            <p>"Preço transparente e pontualidade britânica. Super recomendo."</p>
          </div>
        </div>
      </div>
    </div>
  );
};
