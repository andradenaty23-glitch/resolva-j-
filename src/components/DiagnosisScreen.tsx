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
      <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full pb-16 overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#18181b] tracking-tight">
              Análise do RESOLVA JÁ
            </h1>
            <p className="text-sm sm:text-base text-[#71717a] mt-0.5">
              Diagnóstico inteligente de problemas e serviços residenciais
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#e4e4e7] relative overflow-hidden text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#18181b] text-[#ea580c] flex items-center justify-center shadow-md border border-[#27272a]">
            <Bot className="w-9 h-9" />
          </div>

          <div className="max-w-md">
            <h2 className="text-xl sm:text-2xl font-bold text-[#18181b] mb-2">
              Nenhum diagnóstico ativo no momento
            </h2>
            <p className="text-sm sm:text-base text-[#52525b] leading-relaxed">
              Conte-nos o que você precisa instalar, consertar ou reformar. Nossa Inteligência Artificial analisa a demanda, estima valores e localiza os melhores especialistas verificados.
            </p>
          </div>

          <button
            onClick={onRunNewDiagnosis}
            className="w-full max-w-xs bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-base py-3.5 px-6 rounded-full shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Fazer Diagnóstico com IA</span>
          </button>

          <div className="w-full pt-6 mt-2 border-t border-[#f4f4f5]">
            <span className="text-xs sm:text-sm font-bold text-[#71717a] uppercase tracking-wider block mb-3">
              Ou selecione um problema comum para analisar agora:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
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
                  className="p-3.5 rounded-2xl border border-[#e4e4e7] hover:border-[#ea580c] hover:bg-[#fff7ed] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#fff7ed] text-[#ea580c] flex items-center justify-center shrink-0 border border-[#fed7aa]">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#18181b] group-hover:text-[#ea580c] transition-colors">
                        {demand.shortName}
                      </h4>
                      <p className="text-xs text-[#71717a] truncate max-w-[200px]">
                        {demand.popularIssues[0]}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#a1a1aa] group-hover:text-[#ea580c] transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 sm:gap-6 max-w-2xl mx-auto w-full pb-12 overflow-hidden animate-fadeIn">
      {/* 1. Screen 1: Análise do RESOLVA JÁ */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Análise e Diagnóstico
            </h1>
            <p className="text-xs text-slate-500 font-medium">Relatório gerado por inteligência técnica</p>
          </div>
          <div className="flex items-center gap-2">
            {onClearDiagnosis && (
              <button
                onClick={onClearDiagnosis}
                className="text-xs font-semibold text-slate-500 hover:text-rose-600 bg-white hover:bg-rose-50 px-3 py-1.5 rounded-xl transition-all border border-slate-200 cursor-pointer shadow-2xs"
                title="Limpar análise ativa"
              >
                Limpar
              </button>
            )}
            <button
              onClick={onRunNewDiagnosis}
              className="text-xs font-bold text-[#ea580c] bg-[#fff7ed] hover:bg-[#ea580c] hover:text-white px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer border border-[#fed7aa] shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5" /> Nova análise
            </button>
          </div>
        </div>

        {/* AI Diagnosis Glass Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 relative overflow-hidden">
          {/* AI Header */}
          <div className="flex items-start gap-3.5 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-[#ea580c] flex items-center justify-center shrink-0 shadow-sm border border-slate-800">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  {diagnosis.title || 'Diagnóstico Concluído'}
                </h2>
                <span className="text-[10px] bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  IA Resolva Já
                </span>
              </div>
              <p className="text-sm font-bold text-rose-600 flex items-center gap-1.5 mt-1">
                <Droplets className="w-4 h-4 shrink-0" />
                {diagnosis.problemSummary}
              </p>
            </div>
          </div>

          {/* Category, Professional, Urgency Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Categoria do Serviço
              </p>
              <p className="text-base font-bold text-slate-900">
                {diagnosis.category}
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Profissional Indicado
              </p>
              <p className="text-base font-bold text-slate-900">
                {diagnosis.professionalType}
              </p>
            </div>

            {/* Urgency Progress Bar */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 sm:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Nível de Urgência
                </p>
                <span className="text-xs font-bold text-amber-800 bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-md capitalize">
                  {diagnosis.urgency} ({diagnosis.urgencyPercentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-[#ea580c] h-full rounded-full transition-all duration-500"
                  style={{ width: `${diagnosis.urgencyPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Disclaimer Banner */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 flex items-start gap-2.5 mb-5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Recomenda-se avaliação presencial do profissional credenciado. Estimativas calculadas a partir dos parâmetros informados.
            </p>
          </div>

          {/* Room Selector */}
          <div className="space-y-1.5 mb-5">
            <label htmlFor="select-problem-room" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Vincular ao Cômodo da Residência
            </label>
            <div className="relative">
              <select
                id="select-problem-room"
                value={selectedRoom}
                onChange={(e) => onSelectRoom(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-base sm:text-sm font-medium text-slate-900 focus:border-[#ea580c] focus:ring-2 focus:ring-[#ea580c]/15 focus:outline-hidden appearance-none pr-10 cursor-pointer min-h-[44px]"
              >
                <option value="" disabled>Selecione um cômodo</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} {r.problemCount > 0 ? `(${r.problemCount} item com atenção)` : ''}
                  </option>
                ))}
                <option value="outro">Outro cômodo</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* DIY Tips Toggle */}
          {diagnosis.diyTips && diagnosis.diyTips.length > 0 && (
            <div className="mb-5">
              <button
                type="button"
                onClick={() => setShowTips(!showTips)}
                className="text-xs font-bold text-[#ea580c] hover:underline flex items-center gap-1 cursor-pointer min-h-[36px] py-1"
              >
                {showTips ? 'Ocultar dicas preventivas' : 'Ver dicas de segurança imediatas (Prevenção)'}
              </button>
              {showTips && (
                <ul className="mt-2 space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
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
            className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-sm sm:text-base py-3.5 rounded-xl shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
          >
            <span>Ver Profissionais Disponíveis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <hr className="border-slate-200" />

      {/* 2. Screen 2: Profissionais Recomendados */}
      <section id="section-profissionais" className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Profissionais Recomendados
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Especialistas credenciados com garantia de 90 dias e caução protegida
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">
              {sortedProfessionals.length} {sortedProfessionals.length === 1 ? 'disponível' : 'disponíveis'}
            </span>
            {sortedProfessionals.length > 0 && onClearProfessionals && (
              <button
                onClick={onClearProfessionals}
                className="text-xs font-semibold text-slate-500 hover:text-rose-600 bg-white hover:bg-rose-50 px-3 py-1 rounded-xl transition-all border border-slate-200 cursor-pointer shadow-2xs"
                title="Limpar lista de propostas"
              >
                Limpar Propostas
              </button>
            )}
          </div>
        </div>

        {sortedProfessionals.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#fff7ed] text-[#ea580c] flex items-center justify-center mx-auto border border-[#fed7aa]">
              <Shield className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <p className="text-base font-bold text-slate-900">
                Chamado Publicado na Rede Resolva Já
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Sua solicitação de serviço foi transmitida para os técnicos credenciados da sua região. Assim que uma proposta for enviada, ela aparecerá aqui com caução e garantia protegida.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                onClick={onRunNewDiagnosis}
                className="px-4 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Nova Análise com IA
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Filter Pills */}
            <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none max-w-full">
              <button
                id="filter-compatibilidade"
                onClick={() => setActiveFilter('compatibilidade')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === 'compatibilidade'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-[#fff7ed] hover:text-[#ea580c]'
                }`}
              >
                Melhor compatibilidade
              </button>

              <button
                id="filter-confianca"
                onClick={() => setActiveFilter('confianca')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === 'confianca'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-[#fff7ed] hover:text-[#ea580c]'
                }`}
              >
                Maior confiança
              </button>

              <button
                id="filter-preco"
                onClick={() => setActiveFilter('preco')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === 'preco'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-[#fff7ed] hover:text-[#ea580c]'
                }`}
              >
                Menor preço
              </button>
            </div>

            {/* Professional Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {sortedProfessionals.map((prof) => (
                <div
                  key={prof.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-3.5 border border-slate-200 hover:border-[#ea580c] hover:shadow-md transition-all group relative"
                >
                  {/* Top Row: Avatar & Basic Info */}
                  <div className="flex items-start gap-3.5">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                      <SafeAvatar
                        src={prof.avatar}
                        name={prof.name}
                        size="md"
                        className="w-full h-full rounded-xl"
                      />
                      {prof.verified && (
                        <div className="absolute bottom-0 right-0 bg-emerald-600 text-white rounded-tl-md p-0.5 z-10">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                          {prof.name}
                        </h3>
                        <span className="bg-emerald-50 text-emerald-700 font-bold text-xs px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0 border border-emerald-200">
                          <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                          {prof.matchPercentage}%
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 font-medium">{prof.role}</p>

                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa] px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider">
                          {prof.priceLevel}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                          <Shield className="w-3 h-3 text-emerald-600" />
                          Índice: {prof.trustIndex}/100
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Specialties & Verified Badges */}
                  {prof.specialties && prof.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {prof.specialties.map((spec, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Verified Protection Guarantee */}
                  <div className="flex items-center gap-2 text-[11px] text-emerald-900 bg-emerald-50/80 px-2.5 py-1.5 rounded-xl border border-emerald-200/80 font-medium">
                    <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Garantia de 90 dias com pagamento retido até sua aprovação</span>
                  </div>

                  {/* Bottom Row: Availability & Profile Link */}
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center mt-auto">
                    <span
                      className={`text-xs font-bold flex items-center gap-1.5 ${
                        prof.availability === 'Hoje' ? 'text-emerald-700' : 'text-slate-500'
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
                        className="bg-slate-900 hover:bg-[#ea580c] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
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
          <hr className="border-slate-200" />

          {/* 3. Screen 3: Comparar Orçamentos */}
          <section id="section-orcamentos" className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Comparativo de Orçamentos
                </h2>
                <p className="text-xs text-slate-500 font-medium">Valores transparentes com detalhamento</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {sortedProfessionals.map((prof, index) => {
                const isRecommended = index === 0;

                return (
                  <div
                    key={prof.id}
                    className={`bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 relative overflow-hidden transition-all shadow-xs hover:shadow-md ${
                      isRecommended
                        ? 'border-2 border-[#ea580c] ring-3 ring-[#ea580c]/10'
                        : 'border border-slate-200'
                    }`}
                  >
                    {/* Recommended Badge */}
                    {isRecommended && (
                      <div className="absolute top-0 right-0 bg-[#ea580c] text-white text-[10px] uppercase font-black px-2.5 py-1 rounded-bl-xl tracking-wider flex items-center gap-1">
                        <Award className="w-3 h-3" /> Recomendado
                      </div>
                    )}

                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-slate-900">{prof.name}</h3>
                          <p className="text-xs text-slate-500">{prof.role}</p>
                        </div>
                        {!isRecommended && (
                          <span className="bg-[#fff7ed] text-[#ea580c] text-xs font-bold px-2 py-0.5 rounded-md border border-[#fed7aa]">
                            {prof.trustIndex}/100
                          </span>
                        )}
                      </div>

                      {/* Price big display */}
                      <div className="flex items-baseline gap-1 my-2">
                        <span className="text-xs font-semibold text-slate-500">R$</span>
                        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                          {prof.totalCost}
                        </span>
                      </div>

                      <p
                        className={`text-xs font-bold flex items-center gap-1.5 mb-3 ${
                          prof.availability === 'Hoje' ? 'text-emerald-700' : 'text-slate-500'
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
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-1.5 text-xs">
                          <div className="flex justify-between text-slate-600">
                            <span>Mão de obra:</span>
                            <span className="font-bold text-slate-800">R$ {prof.laborCost}</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Materiais (est.):</span>
                            <span className="font-bold text-slate-800">R$ {prof.materialsCost}</span>
                          </div>
                          <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-1.5 mt-1">
                            <span>Total Estimado:</span>
                            <span className="text-[#ea580c] font-black">R$ {prof.totalCost}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200 flex items-center justify-center min-h-[64px] text-center text-xs text-slate-500">
                          <span>Detalhamento completo ao confirmar</span>
                        </div>
                      )}
                    </div>

                    <button
                      id={`btn-escolher-${prof.id}`}
                      onClick={() => onSelectProfessional(prof)}
                      className={`w-full font-bold text-xs sm:text-sm py-3 rounded-xl transition-all active:scale-98 cursor-pointer ${
                        isRecommended
                          ? 'bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-xs'
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


