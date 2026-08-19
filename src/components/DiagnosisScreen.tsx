import React, { useState } from 'react';
import {
  Bot,
  Droplets,
  AlertTriangle,
  Info,
  Shield,
  Star,
  CheckCircle2,
  Calendar,
  Zap,
  ChevronDown,
  Sparkles,
  Award,
  Clock,
  Phone,
  ArrowRight
} from 'lucide-react';
import { DiagnosisResult, Professional, Room } from '../types';

interface DiagnosisScreenProps {
  diagnosis: DiagnosisResult;
  professionals: Professional[];
  rooms: Room[];
  selectedRoom: string;
  onSelectRoom: (roomId: string) => void;
  onSelectProfessional: (prof: Professional) => void;
  onViewProfessionalProfile: (prof: Professional) => void;
  onRunNewDiagnosis: () => void;
}

export const DiagnosisScreen: React.FC<DiagnosisScreenProps> = ({
  diagnosis,
  professionals,
  rooms,
  selectedRoom,
  onSelectRoom,
  onSelectProfessional,
  onViewProfessionalProfile,
  onRunNewDiagnosis
}) => {
  const [activeFilter, setActiveFilter] = useState<'compatibilidade' | 'confianca' | 'preco'>('compatibilidade');
  const [showTips, setShowTips] = useState(false);

  // Sorting based on active filter
  const sortedProfessionals = [...professionals].sort((a, b) => {
    if (activeFilter === 'compatibilidade') return b.matchPercentage - a.matchPercentage;
    if (activeFilter === 'confianca') return b.trustIndex - a.trustIndex;
    if (activeFilter === 'preco') return a.totalCost - b.totalCost;
    return 0;
  });

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto pb-16">
      {/* 1. Screen 1: Análise do RESOLVA JÁ */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#241822] tracking-tight">
            Análise do RESOLVA JÁ
          </h1>
          <button
            onClick={onRunNewDiagnosis}
            className="text-xs font-semibold text-[#a200ac] bg-[#fee8f7] hover:bg-[#cb00d8] hover:text-white px-3 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> Nova análise
          </button>
        </div>

        {/* AI Diagnosis Glass Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-[#d9bfd3] relative overflow-hidden">
          {/* Subtle Ambient Background Light */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#cb00d8]/15 rounded-full blur-3xl pointer-events-none"></div>

          {/* AI Header */}
          <div className="flex items-start gap-3.5 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-[#cb00d8] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-[#241822]">
                  {diagnosis.title}
                </h2>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full uppercase">
                  IA Resolva Já v2.4
                </span>
              </div>
              <p className="text-sm font-semibold text-[#ba1a1a] flex items-center gap-1.5 mt-0.5">
                <Droplets className="w-4 h-4 shrink-0" />
                {diagnosis.problemSummary}
              </p>
            </div>
          </div>

          {/* Category, Professional, Urgency Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <div className="bg-[#ffeff9] rounded-xl p-3.5 border border-[#d9bfd3]/40">
              <p className="text-[11px] font-bold text-[#867083] uppercase tracking-wider mb-0.5">
                Categoria
              </p>
              <p className="text-sm sm:text-base font-semibold text-[#241822]">
                {diagnosis.category}
              </p>
            </div>

            <div className="bg-[#ffeff9] rounded-xl p-3.5 border border-[#d9bfd3]/40">
              <p className="text-[11px] font-bold text-[#867083] uppercase tracking-wider mb-0.5">
                Profissional
              </p>
              <p className="text-sm sm:text-base font-semibold text-[#241822]">
                {diagnosis.professionalType}
              </p>
            </div>

            {/* Urgency Progress Bar */}
            <div className="bg-[#ffeff9] rounded-xl p-3.5 border border-[#d9bfd3]/40 sm:col-span-2">
              <div className="flex justify-between items-center mb-1.5">
                <p className="text-[11px] font-bold text-[#867083] uppercase tracking-wider">
                  Urgência
                </p>
                <span className="text-xs font-bold text-[#dec74c] bg-[#6d5e00]/10 px-2 py-0.5 rounded-full capitalize">
                  {diagnosis.urgency} ({diagnosis.urgencyPercentage}%)
                </span>
              </div>
              <div className="w-full bg-[#e9d4e3] rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 to-[#cb00d8] h-full rounded-full transition-all duration-500"
                  style={{ width: `${diagnosis.urgencyPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Disclaimer Banner */}
          <div className="bg-[#ffdad6]/40 border border-[#ba1a1a]/20 rounded-xl p-3.5 flex items-start gap-2.5 mb-5">
            <Info className="w-5 h-5 text-[#ba1a1a] shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-[#544151] leading-relaxed">
              Recomenda-se avaliação profissional. Diagnóstico não definitivo baseado na análise preditiva.
            </p>
          </div>

          {/* Room Selector */}
          <div className="space-y-2 mb-5">
            <label className="text-xs font-bold text-[#241822] uppercase tracking-wider block">
              Onde está o problema?
            </label>
            <div className="relative">
              <select
                id="select-problem-room"
                value={selectedRoom}
                onChange={(e) => onSelectRoom(e.target.value)}
                className="w-full bg-[#fff7fa] border border-[#d9bfd3] rounded-xl p-3 text-sm sm:text-base font-medium text-[#241822] focus:border-[#a200ac] focus:outline-hidden appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>Selecione um cômodo</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} {r.problemCount > 0 ? `(${r.problemCount} item com atenção)` : ''}
                  </option>
                ))}
                <option value="outro">Outro cômodo</option>
              </select>
              <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-[#544151] pointer-events-none" />
            </div>
          </div>

          {/* DIY Tips Toggle */}
          {diagnosis.diyTips && (
            <div className="mb-5">
              <button
                type="button"
                onClick={() => setShowTips(!showTips)}
                className="text-xs font-bold text-[#a200ac] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {showTips ? 'Ocultar dicas preventivas' : 'Ver 3 dicas de segurança imediatas (DIY)'}
              </button>
              {showTips && (
                <ul className="mt-2.5 space-y-1.5 text-xs text-[#544151] bg-[#fff7fa] p-3 rounded-xl border border-[#f2dceb]">
                  {diagnosis.diyTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#a200ac] font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* CTA: Continuar para Profissionais */}
          <button
            id="btn-scroll-profissionais"
            onClick={() => scrollToSection('section-profissionais')}
            className="w-full bg-[#a200ac] hover:bg-[#8e0097] text-white font-bold text-sm sm:text-base py-3.5 rounded-full shadow-sm active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continuar para Profissionais</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <hr className="border-[#f2dceb]" />

      {/* 2. Screen 2: Profissionais Recomendados */}
      <section id="section-profissionais" className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-2xl font-bold text-[#241822] tracking-tight">
            Profissionais Recomendados
          </h2>
          <span className="text-xs text-[#867083]">
            {sortedProfessionals.length} especialistas disponíveis
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none">
          <button
            id="filter-compatibilidade"
            onClick={() => setActiveFilter('compatibilidade')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === 'compatibilidade'
                ? 'bg-[#a200ac] text-white shadow-xs'
                : 'bg-white text-[#544151] border border-[#d9bfd3] hover:bg-[#fee8f7]'
            }`}
          >
            Melhor compatibilidade
          </button>

          <button
            id="filter-confianca"
            onClick={() => setActiveFilter('confianca')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === 'confianca'
                ? 'bg-[#a200ac] text-white shadow-xs'
                : 'bg-white text-[#544151] border border-[#d9bfd3] hover:bg-[#fee8f7]'
            }`}
          >
            Maior confiança
          </button>

          <button
            id="filter-preco"
            onClick={() => setActiveFilter('preco')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === 'preco'
                ? 'bg-[#a200ac] text-white shadow-xs'
                : 'bg-white text-[#544151] border border-[#d9bfd3] hover:bg-[#fee8f7]'
            }`}
          >
            Menor preço
          </button>
        </div>

        {/* Professional Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedProfessionals.map((prof) => (
            <div
              key={prof.id}
              className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-3 border border-[#d9bfd3] hover:border-[#a200ac] hover:shadow-md transition-all group relative"
            >
              {/* Top Row: Avatar & Basic Info */}
              <div className="flex items-start gap-3.5">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-[#fee8f7] shrink-0">
                  <img
                    src={prof.avatar}
                    alt={prof.name}
                    className="w-full h-full object-cover"
                  />
                  {prof.verified && (
                    <div className="absolute bottom-0 right-0 bg-[#006c49] text-white rounded-tl-lg p-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-base font-bold text-[#241822] truncate">
                      {prof.name}
                    </h3>
                    <span className="bg-[#6cf8bb]/30 text-[#006c49] font-bold text-xs px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                      <Star className="w-3 h-3 fill-[#006c49]" />
                      {prof.matchPercentage}%
                    </span>
                  </div>

                  <p className="text-xs text-[#544151] font-medium">{prof.role}</p>

                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="bg-[#fee8f7] text-[#a200ac] px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">
                      {prof.priceLevel}
                    </span>
                    <span className="text-[11px] font-semibold text-[#867083] flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-[#006c49]" />
                      Índice de Confiança: {prof.trustIndex}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommendation quote */}
              <p className="text-xs text-[#544151] italic bg-[#fff7fa] p-2.5 rounded-xl border border-[#f2dceb] leading-relaxed">
                "{prof.recommendationReason}"
              </p>

              {/* Bottom Row: Availability & Profile Link */}
              <div className="pt-2 border-t border-[#f2dceb] flex justify-between items-center mt-auto">
                <span
                  className={`text-xs font-bold flex items-center gap-1.5 ${
                    prof.availability === 'Hoje' ? 'text-[#006c49]' : 'text-[#867083]'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Disponível {prof.availability}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewProfessionalProfile(prof)}
                    className="text-[#a200ac] font-bold text-xs hover:underline cursor-pointer"
                  >
                    Ver Perfil
                  </button>
                  <button
                    onClick={() => onSelectProfessional(prof)}
                    className="bg-[#a200ac] hover:bg-[#8e0097] text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                  >
                    Contratar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-[#f2dceb]" />

      {/* 3. Screen 3: Comparar Orçamentos */}
      <section id="section-orcamentos" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#241822] tracking-tight">
            Comparar Orçamentos
          </h2>
          <span className="text-xs text-[#867083]">Valores transparentes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sortedProfessionals.map((prof, index) => {
            const isRecommended = index === 0;

            return (
              <div
                key={prof.id}
                className={`bg-white rounded-2xl p-5 flex flex-col justify-between gap-4 relative overflow-hidden transition-all shadow-xs hover:shadow-md ${
                  isRecommended
                    ? 'border-2 border-[#a200ac] ring-4 ring-[#a200ac]/10'
                    : 'border border-[#d9bfd3]'
                }`}
              >
                {/* Recommended Badge */}
                {isRecommended && (
                  <div className="absolute top-0 right-0 bg-[#a200ac] text-white text-[10px] uppercase font-extrabold px-3 py-1 rounded-bl-xl tracking-wider flex items-center gap-1">
                    <Award className="w-3 h-3" /> Recomendado {prof.trustIndex}/100
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-base font-bold text-[#241822]">{prof.name}</h3>
                      <p className="text-xs text-[#867083]">{prof.role}</p>
                    </div>
                    {!isRecommended && (
                      <span className="bg-[#fee8f7] text-[#a200ac] text-xs font-bold px-2 py-0.5 rounded-full">
                        {prof.trustIndex}/100
                      </span>
                    )}
                  </div>

                  {/* Price big display */}
                  <div className="flex items-baseline gap-1 my-2">
                    <span className="text-base font-medium text-[#867083]">R$</span>
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#241822]">
                      {prof.totalCost}
                    </span>
                  </div>

                  <p
                    className={`text-xs font-semibold flex items-center gap-1 mb-3 ${
                      prof.availability === 'Hoje' ? 'text-[#006c49]' : 'text-[#867083]'
                    }`}
                  >
                    {prof.availability === 'Hoje' ? (
                      <>
                        <Zap className="w-3.5 h-3.5 fill-[#006c49]" />
                        Atendimento Hoje
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5" />
                        Atendimento Amanhã
                      </>
                    )}
                  </p>

                  {/* Cost breakdown */}
                  {isRecommended ? (
                    <div className="bg-[#ffeff9] rounded-xl p-3 border border-[#d9bfd3]/40 space-y-1.5 text-xs">
                      <div className="flex justify-between text-[#544151]">
                        <span>Mão de obra:</span>
                        <span className="font-semibold">R$ {prof.laborCost}</span>
                      </div>
                      <div className="flex justify-between text-[#544151]">
                        <span>Materiais (est.):</span>
                        <span className="font-semibold">R$ {prof.materialsCost}</span>
                      </div>
                      <div className="flex justify-between text-[#241822] font-bold border-t border-[#d9bfd3] pt-1.5 mt-1">
                        <span>Total Estimado:</span>
                        <span className="text-[#a200ac]">R$ {prof.totalCost}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#ffeff9]/60 rounded-xl p-3 border border-[#d9bfd3]/30 flex items-center justify-center min-h-[78px] text-center text-xs text-[#867083]">
                      <span>Detalhes detalhados disponíveis após escolha</span>
                    </div>
                  )}
                </div>

                <button
                  id={`btn-escolher-${prof.id}`}
                  onClick={() => onSelectProfessional(prof)}
                  className={`w-full font-bold text-xs sm:text-sm py-3 rounded-full transition-all active:scale-98 cursor-pointer ${
                    isRecommended
                      ? 'bg-[#a200ac] hover:bg-[#8e0097] text-white shadow-sm'
                      : 'bg-white hover:bg-[#fee8f7] text-[#a200ac] border border-[#a200ac]'
                  }`}
                >
                  Escolher este profissional
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
