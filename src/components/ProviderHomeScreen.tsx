import React, { useState } from 'react';
import {
  Radar,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Star,
  Shield,
  Phone,
  DollarSign,
  Radio,
  Eye
} from 'lucide-react';
import { ProviderProfile, ProviderJobLead } from '../types';

interface ProviderHomeScreenProps {
  provider: ProviderProfile;
  leads: ProviderJobLead[];
  onSendQuote: (leadId: string, value: number) => void;
  onToggleAvailability: () => void;
  onViewClientPhoto?: (imageUrl: string) => void;
}

export const ProviderHomeScreen: React.FC<ProviderHomeScreenProps> = ({
  provider,
  leads,
  onSendQuote,
  onToggleAvailability,
  onViewClientPhoto
}) => {
  const [biddingLeadId, setBiddingLeadId] = useState<string | null>(null);
  const [customPrice, setCustomPrice] = useState<number>(120);

  const handleSendCustomQuote = (leadId: string) => {
    onSendQuote(leadId, customPrice);
    setBiddingLeadId(null);
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto pb-16">
      {/* Top Provider Status Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#d9bfd3] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={provider.avatar}
            alt={provider.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-[#a200ac]"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-[#241822]">{provider.name}</h2>
              <span className="bg-[#6cf8bb]/30 text-[#006c49] text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <CheckCircle className="w-3 h-3" /> Verificado
              </span>
            </div>
            <p className="text-xs text-[#544151]">{provider.category}</p>
            <p className="text-xs font-semibold text-[#867083] mt-0.5">
              Raio de atendimento: {provider.operatingRadiusKm} km
            </p>
          </div>
        </div>

        {/* Live Availability Toggle */}
        <button
          type="button"
          onClick={onToggleAvailability}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs self-start sm:self-center cursor-pointer ${
            provider.availability === 'Disponível Agora'
              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Radio className="w-4 h-4 animate-pulse" />
          <span>{provider.availability}</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-[#f2dceb] shadow-xs flex flex-col items-center justify-center text-center">
          <span className="text-xl sm:text-2xl font-extrabold text-[#006c49]">
            R$ {provider.totalEarningsMonth}
          </span>
          <span className="text-[11px] font-bold text-[#544151]">Ganhos do Mês</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#f2dceb] shadow-xs flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-xl sm:text-2xl font-extrabold text-[#241822]">
              {provider.rating}
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#544151]">
            {provider.reviewsCount} avaliações
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#f2dceb] shadow-xs flex flex-col items-center justify-center text-center">
          <span className="text-xl sm:text-2xl font-extrabold text-[#a200ac]">
            {provider.trustIndex}/100
          </span>
          <span className="text-[11px] font-bold text-[#544151]">Índice Confiança</span>
        </div>
      </div>

      {/* Leads / Radar de Chamados */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radar className="w-5 h-5 text-[#a200ac] animate-spin" style={{ animationDuration: '6s' }} />
            <h3 className="text-xl font-bold text-[#241822]">Radar de Chamados Próximos</h3>
          </div>
          <span className="text-xs font-bold text-[#a200ac] bg-[#fee8f7] px-2.5 py-1 rounded-full">
            {leads.length} oportunidades
          </span>
        </div>

        <div className="flex flex-col gap-3.5">
          {leads.map((lead) => {
            const isSent = lead.status === 'orcamento_enviado';

            return (
              <div
                key={lead.id}
                className="bg-white rounded-2xl p-5 border border-[#d9bfd3] shadow-xs hover:shadow-md transition-all flex flex-col gap-3.5"
              >
                {/* Header of lead */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#a200ac] bg-[#fee8f7] px-2 py-0.5 rounded-md">
                      {lead.category} • {lead.room}
                    </span>
                    <h4 className="text-base font-bold text-[#241822] mt-1">
                      {lead.serviceTitle}
                    </h4>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      lead.urgency === 'alta'
                        ? 'bg-[#ffdad6] text-[#ba1a1a]'
                        : 'bg-[#fbe365]/30 text-[#6d5e00]'
                    }`}
                  >
                    Urgência: {lead.urgency}
                  </span>
                </div>

                {/* Client and distance */}
                <div className="flex items-center justify-between text-xs text-[#544151]">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <MapPin className="w-4 h-4 text-[#a200ac]" />
                    <span>{lead.neighborhood}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#867083]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{lead.createdAt}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#544151] bg-[#fff7fa] p-3 rounded-xl border border-[#f2dceb] leading-relaxed">
                  "{lead.description}"
                </p>

                {/* Image preview if exists */}
                {lead.imageUrl && (
                  <div className="flex items-center gap-2">
                    <img
                      src={lead.imageUrl}
                      alt="Foto do cliente"
                      className="w-16 h-16 rounded-xl object-cover border border-[#d9bfd3]"
                    />
                    <div className="text-xs text-[#544151]">
                      <span className="font-bold block text-[#241822]">Foto enviada pelo cliente</span>
                      <span>Analisada pela IA Resolva Já</span>
                    </div>
                  </div>
                )}

                {/* Price Estimate & CTA */}
                <div className="flex items-center justify-between pt-2 border-t border-[#f2dceb]">
                  <div>
                    <span className="text-[11px] text-[#867083] block">Valor Médio Estimado:</span>
                    <span className="text-lg font-extrabold text-[#241822]">
                      R$ {lead.suggestedBudget}
                    </span>
                  </div>

                  {isSent ? (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" /> Proposta Enviada
                    </span>
                  ) : biddingLeadId === lead.id ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-[#fff7fa] border border-[#a200ac] rounded-xl px-2 py-1">
                        <span className="text-xs font-bold mr-1">R$</span>
                        <input
                          type="number"
                          value={customPrice}
                          onChange={(e) => setCustomPrice(Number(e.target.value))}
                          className="w-16 text-xs font-bold focus:outline-hidden"
                        />
                      </div>
                      <button
                        onClick={() => handleSendCustomQuote(lead.id)}
                        className="bg-[#a200ac] hover:bg-[#8e0097] text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors"
                      >
                        Enviar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setCustomPrice(lead.suggestedBudget);
                        setBiddingLeadId(lead.id);
                      }}
                      className="bg-[#a200ac] hover:bg-[#8e0097] text-white text-xs font-bold px-4 py-2.5 rounded-full transition-all shadow-sm flex items-center gap-1.5 active:scale-98 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" /> Enviar Proposta
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
