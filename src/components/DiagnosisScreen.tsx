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
  ArrowRight,
  Wrench,
  Search,
  Check
} from 'lucide-react';
import { DiagnosisResult, Professional, Room } from '../types';
import { SafeAvatar } from './SafeAvatar';
import { SERVICE_DEMANDS_CATALOG } from '../data/serviceDemands';

interface DiagnosisScreenProps {
  diagnosis: DiagnosisResult | null;
  professionals: Professional[];
  rooms: Room[];
  selectedRoom: string;
  onSelectRoom: (roomId: string) => void;
  onSelectProfessional: (prof: Professional) => void;
  onViewProfessionalProfile: (prof: Professional) => void;
  onRunNewDiagnosis: () => void;
  onSelectQuickDemand?: (problemText: string) => void;
  onClearProfessionals?: () => void;
  onClearDiagnosis?: () => void;
}

export const DiagnosisScreen: React.FC<DiagnosisScreenProps> = ({
  diagnosis,
  professionals,
  rooms,
  selectedRoom,
  onSelectRoom,
  onSelectProfessional,
  onViewProfessionalProfile,
  onRunNewDiagnosis,
  onSelectQuickDemand,
  onClearProfessionals,
  onClearDiagnosis
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

  // If no diagnosis exists yet, render a helpful empty state
  if (!diagnosis) {
    return (
      <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-16">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#18181b] tracking-tight">
              Análise do RESOLVA JÁ
            </h1>
            <p className="text-xs sm:text-sm text-[#71717a] mt-0.5">
              Diagnóstico inteligente de problemas residenciais
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#e4e4e7] relative overflow-hidden text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#18181b] text-[#ea580c] flex items-center justify-center shadow-md border border-[#27272a]">
            <Bot className="w-9 h-9" />
          </div>

          <div className="max-w-md">
            <h2 className="text-lg sm:text-xl font-bold text-[#18181b] mb-1">
              Nenhum diagnóstico ativo no momento
            </h2>
            <p className="text-xs sm:text-sm text-[#52525b] leading-relaxed">
              Conte-nos o que está com defeito ou vazando na sua residência. Nossa Inteligência Artificial analisa o problema, estima valores e localiza os melhores especialistas verificados.
            </p>
          </div>

          <button
            onClick={onRunNewDiagnosis}
            className="w-full max-w-xs bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-sm py-3.5 px-6 rounded-full shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Fazer Diagnóstico com IA</span>
          </button>

          <div className="w-full pt-6 mt-2 border-t border-[#f4f4f5]">
            <span className="text-xs font-bold text-[#71717a] uppercase tracking-wider block mb-3">
              Ou selecione um problema comum para analisar agora:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
              {SERVICE_DEMANDS_CATALOG.slice(0, 6).map((demand) => (
                <button
                  key={demand.id}
                  onClick={() => {
                    if (onSelectQuickDemand) {
                      onSelectQuickDemand(demand.popularIssues[0] || demand.name);
                    } else {
                      onRunNewDiagnosis();
                    }
                  }}
                  className="p-3 rounded-xl border border-[#e4e4e7] hover:border-[#ea580c] hover:bg-[#fff7ed] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#fff7ed] text-[#ea580c] flex items-center justify-center shrink-0 border border-[#fed7aa]">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#18181b] group-hover:text-[#ea580c] transition-colors">
                        {demand.shortName}
                      </h4>
                      <p className="text-[10px] text-[#71717a] truncate max-w-[200px]">
                        {demand.popularIssues[0]}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#a1a1aa] group-hover:text-[#ea580c] transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5 max-w-2xl mx-auto pb-10">
      {/* 1. Screen 1: Análise do RESOLVA JÁ */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-bold text-[#18181b] tracking-tight">
            Análise do RESOLVA JÁ
          </h1>
          <div className="flex items-center gap-1.5">
            {onClearDiagnosis && (
              <button
                onClick={onClearDiagnosis}
                className="text-xs font-semibold text-[#71717a] hover:text-rose-600 bg-white hover:bg-rose-50 px-2.5 py-1 rounded-full transition-all border border-[#e4e4e7] cursor-pointer"
                title="Limpar análise ativa"
              >
                Limpar Análise
              </button>
            )}
            <button
              onClick={onRunNewDiagnosis}
              className="text-xs font-semibold text-[#ea580c] bg-[#fff7ed] hover:bg-[#ea580c] hover:text-white px-2.5 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer border border-[#fed7aa]"
            >
              <Sparkles className="w-3.5 h-3.5" /> Nova análise
            </button>
          </div>
        </div>

        {/* AI Diagnosis Glass Card */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e4e4e7] relative overflow-hidden">
          {/* Subtle Ambient Background Light */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#ea580c]/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* AI Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#18181b] text-[#ea580c] flex items-center justify-center shrink-0 shadow-sm border border-[#27272a]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#18181b]">
                  {diagnosis.title || 'Diagnóstico Concluído'}
                </h2>
                <span className="text-[9px] bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa] font-bold px-1.5 py-0.2 rounded-full uppercase">
                  IA Resolva Já
                </span>
              </div>
              <p className="text-xs font-semibold text-rose-600 flex items-center gap-1 mt-0.5">
                <Droplets className="w-3.5 h-3.5 shrink-0" />
                {diagnosis.problemSummary}
              </p>
            </div>
          </div>

          {/* Category, Professional, Urgency Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <div className="bg-[#f4f4f5] rounded-xl p-3.5 border border-[#e4e4e7]">
              <p className="text-[11px] font-bold text-[#71717a] uppercase tracking-wider mb-0.5">
                Categoria
              </p>
              <p className="text-sm sm:text-base font-semibold text-[#18181b]">
                {diagnosis.category}
              </p>
            </div>

            <div className="bg-[#f4f4f5] rounded-xl p-3.5 border border-[#e4e4e7]">
              <p className="text-[11px] font-bold text-[#71717a] uppercase tracking-wider mb-0.5">
                Profissional
              </p>
              <p className="text-sm sm:text-base font-semibold text-[#18181b]">
                {diagnosis.professionalType}
              </p>
            </div>

            {/* Urgency Progress Bar */}
            <div className="bg-[#f4f4f5] rounded-xl p-3.5 border border-[#e4e4e7] sm:col-span-2">
              <div className="flex justify-between items-center mb-1.5">
                <p className="text-[11px] font-bold text-[#71717a] uppercase tracking-wider">
                  Urgência
                </p>
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full capitalize">
                  {diagnosis.urgency} ({diagnosis.urgencyPercentage}%)
                </span>
              </div>
              <div className="w-full bg-[#e4e4e7] rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 to-[#ea580c] h-full rounded-full transition-all duration-500"
                  style={{ width: `${diagnosis.urgencyPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Disclaimer Banner */}
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start gap-2.5 mb-5">
            <Info className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-[#52525b] leading-relaxed">
              Recomenda-se avaliação profissional. Diagnóstico não definitivo baseado na análise preditiva.
            </p>
          </div>

          {/* Room Selector */}
          <div className="space-y-2 mb-5">
            <label className="text-xs font-bold text-[#18181b] uppercase tracking-wider block">
              Onde está o problema?
            </label>
            <div className="relative">
              <select
                id="select-problem-room"
                value={selectedRoom}
                onChange={(e) => onSelectRoom(e.target.value)}
                className="w-full bg-[#f4f4f5] border border-[#e4e4e7] rounded-xl p-3 text-sm sm:text-base font-medium text-[#18181b] focus:border-[#ea580c] focus:outline-hidden appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>Selecione um cômodo</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} {r.problemCount > 0 ? `(${r.problemCount} item com atenção)` : ''}
                  </option>
                ))}
                <option value="outro">Outro cômodo</option>
              </select>
              <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none" />
            </div>
          </div>

          {/* DIY Tips Toggle */}
          {diagnosis.diyTips && diagnosis.diyTips.length > 0 && (
            <div className="mb-5">
              <button
                type="button"
                onClick={() => setShowTips(!showTips)}
                className="text-xs font-bold text-[#ea580c] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {showTips ? 'Ocultar dicas preventivas' : 'Ver 3 dicas de segurança imediatas (DIY)'}
              </button>
              {showTips && (
                <ul className="mt-2.5 space-y-1.5 text-xs text-[#52525b] bg-[#f4f4f5] p-3 rounded-xl border border-[#e4e4e7]">
                  {diagnosis.diyTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#ea580c] font-bold">•</span>
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
            className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-sm sm:text-base py-3.5 rounded-full shadow-sm active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continuar para Profissionais</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <hr className="border-[#e4e4e7]" />

      {/* 2. Screen 2: Profissionais Recomendados */}
      <section id="section-profissionais" className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold text-[#18181b] tracking-tight">
              Profissionais Recomendados
            </h2>
            <p className="text-xs text-[#71717a]">
              Especialistas credenciados com garantia de 90 dias
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#71717a]">
              {sortedProfessionals.length} {sortedProfessionals.length === 1 ? 'disponível' : 'disponíveis'}
            </span>
            {sortedProfessionals.length > 0 && onClearProfessionals && (
              <button
                onClick={onClearProfessionals}
                className="text-xs font-semibold text-[#71717a] hover:text-rose-600 bg-white hover:bg-rose-50 px-3 py-1 rounded-full transition-all border border-[#e4e4e7] cursor-pointer"
                title="Limpar lista de propostas"
              >
                Limpar Propostas
              </button>
            )}
          </div>
        </div>

        {sortedProfessionals.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e4e4e7] text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#fff7ed] text-[#ea580c] flex items-center justify-center mx-auto border border-[#fed7aa]">
              <Shield className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <p className="text-base font-bold text-[#18181b]">
                Chamado Publicado na Rede Resolva Já
              </p>
              <p className="text-xs text-[#71717a] leading-relaxed">
                Sua solicitação de serviço foi transmitida para os técnicos credenciados da sua região. Assim que uma proposta for enviada, ela aparecerá aqui com caução e garantia protegida.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                onClick={onRunNewDiagnosis}
                className="px-5 py-2.5 rounded-full bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Nova Análise com IA
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Filter Pills */}
            <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none">
              <button
                id="filter-compatibilidade"
                onClick={() => setActiveFilter('compatibilidade')}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === 'compatibilidade'
                    ? 'bg-[#18181b] text-white shadow-xs'
                    : 'bg-white text-[#52525b] border border-[#e4e4e7] hover:bg-[#fff7ed] hover:text-[#ea580c]'
                }`}
              >
                Melhor compatibilidade
              </button>

              <button
                id="filter-confianca"
                onClick={() => setActiveFilter('confianca')}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === 'confianca'
                    ? 'bg-[#18181b] text-white shadow-xs'
                    : 'bg-white text-[#52525b] border border-[#e4e4e7] hover:bg-[#fff7ed] hover:text-[#ea580c]'
                }`}
              >
                Maior confiança
              </button>

              <button
                id="filter-preco"
                onClick={() => setActiveFilter('preco')}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === 'preco'
                    ? 'bg-[#18181b] text-white shadow-xs'
                    : 'bg-white text-[#52525b] border border-[#e4e4e7] hover:bg-[#fff7ed] hover:text-[#ea580c]'
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
                  className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-3 border border-[#e4e4e7] hover:border-[#ea580c] hover:shadow-md transition-all group relative"
                >
                  {/* Top Row: Avatar & Basic Info */}
                  <div className="flex items-start gap-3.5">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0">
                      <SafeAvatar
                        src={prof.avatar}
                        name={prof.name}
                        size="md"
                        className="w-full h-full rounded-2xl"
                      />
                      {prof.verified && (
                        <div className="absolute bottom-0 right-0 bg-emerald-600 text-white rounded-tl-lg p-0.5 z-10">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-base font-bold text-[#18181b] truncate">
                          {prof.name}
                        </h3>
                        <span className="bg-emerald-50 text-emerald-700 font-bold text-xs px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0 border border-emerald-200">
                          <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                          {prof.matchPercentage}%
                        </span>
                      </div>

                      <p className="text-xs text-[#52525b] font-medium">{prof.role}</p>

                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa] px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">
                          {prof.priceLevel}
                        </span>
                        <span className="text-[11px] font-semibold text-[#71717a] flex items-center gap-1">
                          <Shield className="w-3.5 h-3.5 text-emerald-600" />
                          Índice de Confiança: {prof.trustIndex}/100
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation quote */}
                  <p className="text-xs text-[#52525b] italic bg-[#f4f4f5] p-2.5 rounded-xl border border-[#e4e4e7] leading-relaxed">
                    "{prof.recommendationReason}"
                  </p>

                  {/* Bottom Row: Availability & Profile Link */}
                  <div className="pt-2 border-t border-[#e4e4e7] flex justify-between items-center mt-auto">
                    <span
                      className={`text-xs font-bold flex items-center gap-1.5 ${
                        prof.availability === 'Hoje' ? 'text-emerald-700' : 'text-[#71717a]'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Disponível {prof.availability}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewProfessionalProfile(prof)}
                        className="text-[#ea580c] font-bold text-xs hover:underline cursor-pointer"
                      >
                        Ver Perfil
                      </button>
                      <button
                        onClick={() => onSelectProfessional(prof)}
                        className="bg-[#18181b] hover:bg-[#ea580c] text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                      >
                        Contratar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {sortedProfessionals.length > 0 && (
        <>
          <hr className="border-[#e4e4e7]" />

          {/* 3. Screen 3: Comparar Orçamentos */}
          <section id="section-orcamentos" className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#18181b] tracking-tight">
                Comparar Orçamentos
              </h2>
              <span className="text-xs text-[#71717a]">Valores transparentes</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sortedProfessionals.map((prof, index) => {
                const isRecommended = index === 0;

                return (
                  <div
                    key={prof.id}
                    className={`bg-white rounded-2xl p-5 flex flex-col justify-between gap-4 relative overflow-hidden transition-all shadow-xs hover:shadow-md ${
                      isRecommended
                        ? 'border-2 border-[#ea580c] ring-4 ring-[#ea580c]/10'
                        : 'border border-[#e4e4e7]'
                    }`}
                  >
                    {/* Recommended Badge */}
                    {isRecommended && (
                      <div className="absolute top-0 right-0 bg-[#ea580c] text-white text-[10px] uppercase font-extrabold px-3 py-1 rounded-bl-xl tracking-wider flex items-center gap-1">
                        <Award className="w-3 h-3" /> Recomendado {prof.trustIndex}/100
                      </div>
                    )}

                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-base font-bold text-[#18181b]">{prof.name}</h3>
                          <p className="text-xs text-[#71717a]">{prof.role}</p>
                        </div>
                        {!isRecommended && (
                          <span className="bg-[#fff7ed] text-[#ea580c] text-xs font-bold px-2 py-0.5 rounded-full border border-[#fed7aa]">
                            {prof.trustIndex}/100
                          </span>
                        )}
                      </div>

                      {/* Price big display */}
                      <div className="flex items-baseline gap-1 my-2">
                        <span className="text-base font-medium text-[#71717a]">R$</span>
                        <span className="text-3xl sm:text-4xl font-extrabold text-[#18181b]">
                          {prof.totalCost}
                        </span>
                      </div>

                      <p
                        className={`text-xs font-semibold flex items-center gap-1 mb-3 ${
                          prof.availability === 'Hoje' ? 'text-emerald-700' : 'text-[#71717a]'
                        }`}
                      >
                        {prof.availability === 'Hoje' ? (
                          <>
                            <Zap className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
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
                        <div className="bg-[#f4f4f5] rounded-xl p-3 border border-[#e4e4e7] space-y-1.5 text-xs">
                          <div className="flex justify-between text-[#52525b]">
                            <span>Mão de obra:</span>
                            <span className="font-semibold">R$ {prof.laborCost}</span>
                          </div>
                          <div className="flex justify-between text-[#52525b]">
                            <span>Materiais (est.):</span>
                            <span className="font-semibold">R$ {prof.materialsCost}</span>
                          </div>
                          <div className="flex justify-between text-[#18181b] font-bold border-t border-[#e4e4e7] pt-1.5 mt-1">
                            <span>Total Estimado:</span>
                            <span className="text-[#ea580c]">R$ {prof.totalCost}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-[#f4f4f5]/60 rounded-xl p-3 border border-[#e4e4e7] flex items-center justify-center min-h-[78px] text-center text-xs text-[#71717a]">
                          <span>Detalhes detalhados disponíveis após escolha</span>
                        </div>
                      )}
                    </div>

                    <button
                      id={`btn-escolher-${prof.id}`}
                      onClick={() => onSelectProfessional(prof)}
                      className={`w-full font-bold text-xs sm:text-sm py-3 rounded-full transition-all active:scale-98 cursor-pointer ${
                        isRecommended
                          ? 'bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-sm'
                          : 'bg-white hover:bg-[#fff7ed] text-[#ea580c] border border-[#ea580c]'
                      }`}
                    >
                      Escolher este profissional
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

