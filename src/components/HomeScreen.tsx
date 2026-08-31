import React, { useState } from 'react';
import {
  Keyboard,
  Mic,
  Camera,
  ArrowRight,
  HelpCircle,
  Zap,
  Droplets,
  Snowflake,
  Wrench,
  Paintbrush,
  Key,
  ChevronRight,
  UtensilsCrossed,
  X,
  Sparkles,
  Hammer,
  AlertTriangle,
  Layers,
  Shield,
  Component as ComponentIcon,
  Refrigerator,
  Video,
  Flame,
  Square,
  SlidersHorizontal,
  Search,
  CheckCircle2,
  Store
} from 'lucide-react';
import { ProblemCategory, Room, ServicoDoc, CategoriaDoc, ClientProfile, FavoritoDoc } from '../types';
import { SERVICE_DEMANDS_CATALOG, ServiceDemandCategory } from '../data/serviceDemands';
import { SupabaseServicesCatalog } from './SupabaseServicesCatalog';

interface HomeScreenProps {
  onFindSolution: (problemText: string, imageSrc?: string) => void;
  onSelectCategory: (category: ProblemCategory) => void;
  onOpenVoiceInput: () => void;
  onOpenPhotoInput: () => void;
  onOpenGuidedWizard: () => void;
  onNavigateToRoom: (roomId: string) => void;
  onNavigateToMinhaCasa: () => void;
  problemRooms: Room[];
  selectedPhoto: string | null;
  onClearPhoto: () => void;
  supabaseServicos?: ServicoDoc[];
  supabaseCategorias?: CategoriaDoc[];
  clientProfile?: ClientProfile;
  favoritos?: FavoritoDoc[];
  onRequestService?: (servico: ServicoDoc) => void;
  isLoadingServices?: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onFindSolution,
  onSelectCategory,
  onOpenVoiceInput,
  onOpenPhotoInput,
  onOpenGuidedWizard,
  onNavigateToRoom,
  onNavigateToMinhaCasa,
  problemRooms,
  selectedPhoto,
  onClearPhoto,
  supabaseServicos = [],
  supabaseCategorias = [],
  clientProfile,
  favoritos = [],
  onRequestService,
  isLoadingServices = false
}) => {
  const activeServicos = supabaseServicos;
  const activeCategorias = supabaseCategorias;
  const [problemDescription, setProblemDescription] = useState('');
  const [activeInputMode, setActiveInputMode] = useState<'digitar' | 'falar' | 'foto'>('digitar');
  const [selectedFilterTab, setSelectedFilterTab] = useState<'todos' | 'urgente' | 'instalacao' | 'reforma'>('todos');
  const [showAllDemands, setShowAllDemands] = useState(false);

  const quickPrompts = [
    'Torneira da cozinha vazando na bancada',
    'Chuveiro elétrico parou de esquentar',
    'Disjuntor cai quando ligo o micro-ondas',
    'Ar condicionado gotejando dentro do quarto',
    'Montagem de guarda-roupa casal',
    'Vaso sanitário entupido com refluxo'
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!problemDescription.trim() && !selectedPhoto) return;
    onFindSolution(problemDescription, selectedPhoto || undefined);
  };

  const handleDemandClick = (demand: ServiceDemandCategory) => {
    const sample = demand.popularIssues[0] || `Reparo de ${demand.name}`;
    setProblemDescription(sample);
    onSelectCategory(demand.id);
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return Zap;
      case 'Droplets':
        return Droplets;
      case 'Snowflake':
        return Snowflake;
      case 'Wrench':
        return Wrench;
      case 'Hammer':
        return Hammer;
      case 'AlertTriangle':
        return AlertTriangle;
      case 'Paintbrush':
        return Paintbrush;
      case 'Key':
        return Key;
      case 'Refrigerator':
        return Refrigerator;
      case 'Video':
        return Video;
      case 'Flame':
        return Flame;
      case 'Square':
        return Square;
      default:
        return Wrench;
    }
  };

  const filteredDemands = SERVICE_DEMANDS_CATALOG.filter((demand) => {
    if (selectedFilterTab === 'todos') return true;
    if (selectedFilterTab === 'urgente') return demand.urgencyDefault === 'alta' || demand.urgencyDefault === 'critica';
    if (selectedFilterTab === 'instalacao') return demand.name.toLowerCase().includes('instala') || demand.description.toLowerCase().includes('instala');
    if (selectedFilterTab === 'reforma') return demand.name.toLowerCase().includes('reforma') || demand.name.toLowerCase().includes('pintura') || demand.name.toLowerCase().includes('marcenaria');
    return true;
  });

  const displayedDemands = showAllDemands ? filteredDemands : filteredDemands.slice(0, 8);

  return (
    <div className="flex flex-col gap-5 sm:gap-6 max-w-2xl mx-auto w-full pb-8 overflow-hidden animate-fadeIn">
      {/* Hero Section: O que aconteceu? */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
              O que você precisa resolver?
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Diagnóstico imediato, estimativa de preço e profissionais verificados
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs text-[#ea580c] font-bold bg-[#fff7ed] border border-[#fed7aa] px-2.5 py-1 rounded-full shadow-2xs shrink-0 select-none">
            <Sparkles className="w-3.5 h-3.5" /> IA Ativa
          </span>
        </div>

        {/* Big Input Container */}
        <div className="bg-white rounded-2xl shadow-xs p-3.5 sm:p-5 flex flex-col gap-3 border border-slate-200 focus-within:border-[#ea580c] focus-within:ring-3 focus-within:ring-[#ea580c]/15 transition-all">
          <textarea
            id="input-problem-description"
            rows={2.5}
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            placeholder="Descreva o problema (ex: vazamento na pia, montagem de móvel, disjuntor caindo, ar pingando)..."
            className="w-full bg-transparent border-none resize-none focus:outline-hidden text-base text-slate-900 placeholder:text-slate-400 p-0 font-medium leading-relaxed"
          />

          {/* Photo attachment preview if uploaded */}
          {selectedPhoto && (
            <div className="relative inline-block w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-slate-300 shadow-xs group">
              <img loading="lazy" decoding="async" src={selectedPhoto} alt="Problema anexado" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={onClearPhoto}
                className="absolute top-1 right-1 bg-slate-900/80 hover:bg-slate-900 text-white p-1 rounded-full transition-colors cursor-pointer min-w-[28px] min-h-[28px] flex items-center justify-center"
                title="Remover foto"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Input Method Badges / Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2.5 border-t border-slate-100 touch-pan-x">
            <button
              type="button"
              id="btn-mode-digitar"
              onClick={() => setActiveInputMode('digitar')}
              className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer min-h-[40px] ${
                activeInputMode === 'digitar'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-[#fff7ed] hover:text-[#ea580c]'
              }`}
            >
              <Keyboard className="w-4 h-4" />
              Digitar
            </button>

            <button
              type="button"
              id="btn-mode-falar"
              onClick={() => {
                setActiveInputMode('falar');
                onOpenVoiceInput();
              }}
              className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer min-h-[40px] ${
                activeInputMode === 'falar'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-[#fff7ed] hover:text-[#ea580c]'
              }`}
            >
              <Mic className="w-4 h-4" />
              Falar
            </button>

            <button
              type="button"
              id="btn-mode-foto"
              onClick={() => {
                setActiveInputMode('foto');
                onOpenPhotoInput();
              }}
              className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer min-h-[40px] ${
                activeInputMode === 'foto' || selectedPhoto
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-[#fff7ed] hover:text-[#ea580c]'
              }`}
            >
              <Camera className="w-4 h-4" />
              {selectedPhoto ? 'Foto anexada' : 'Enviar foto'}
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider py-1">Exemplos:</span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setProblemDescription(prompt);
                onFindSolution(prompt);
              }}
              className="text-xs bg-white hover:bg-[#fff7ed] text-slate-700 hover:text-[#ea580c] border border-slate-200 hover:border-[#fed7aa] px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Big Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-1">
          <button
            type="button"
            id="btn-find-solution"
            onClick={() => handleSubmit()}
            disabled={!problemDescription.trim() && !selectedPhoto}
            className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-extrabold text-sm sm:text-base py-3.5 px-5 rounded-2xl transition-all shadow-md shadow-[#ea580c]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
          >
            <span>Ver Diagnóstico & Preços</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            id="btn-guided-wizard"
            onClick={onOpenGuidedWizard}
            className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 font-bold text-sm sm:text-base py-3.5 px-5 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-[0.99]"
          >
            <HelpCircle className="w-4 h-4 text-[#ea580c]" />
            <span>Não sei explicar o que é</span>
          </button>
        </div>
      </section>

      {/* Real Supabase Services Catalog */}
      {activeServicos && activeServicos.length > 0 && clientProfile && (
        <section className="pt-2">
          <SupabaseServicesCatalog
            servicos={activeServicos}
            categorias={activeCategorias}
            client={clientProfile}
            favoritos={favoritos}
            onRequestService={(servico) => {
              if (onRequestService) {
                onRequestService(servico);
              }
            }}
            isLoading={isLoadingServices}
          />
        </section>
      )}

      {/* Catalog of Problems and Services */}
      <section className="flex flex-col gap-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Especialidades mais Procuradas
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Selecione o tipo de serviço para diagnóstico ou contratação direta
            </p>
          </div>

          {/* Catalog Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setSelectedFilterTab('todos')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedFilterTab === 'todos' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilterTab('urgente')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedFilterTab === 'urgente' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Emergência
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilterTab('instalacao')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedFilterTab === 'instalacao' ? 'bg-white text-[#ea580c] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Instalação
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilterTab('reforma')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedFilterTab === 'reforma' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Reformas
            </button>
          </div>
        </div>

        {/* Demands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {displayedDemands.map((demand) => {
            const Icon = getIconComponent(demand.iconName);
            return (
              <button
                key={demand.id}
                type="button"
                onClick={() => handleDemandClick(demand)}
                className="bg-white rounded-2xl p-3.5 sm:p-4 flex flex-col items-start text-left border border-slate-200 hover:border-[#ea580c] hover:shadow-md transition-all cursor-pointer group relative overflow-hidden active:scale-[0.98]"
              >
                {demand.badge && (
                  <span className="absolute top-2.5 right-2.5 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa]">
                    {demand.badge}
                  </span>
                )}

                <div className="w-10 h-10 rounded-xl bg-[#fff7ed] flex items-center justify-center text-[#ea580c] group-hover:bg-[#ea580c] group-hover:text-white transition-colors mb-2.5 border border-[#fed7aa]/50">
                  <Icon className="w-5 h-5" />
                </div>

                <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#ea580c] transition-colors leading-tight line-clamp-1">
                  {demand.shortName}
                </span>

                <span className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-normal">
                  {demand.description}
                </span>

                <div className="mt-3 pt-2.5 border-t border-slate-100 w-full flex justify-between items-center text-xs">
                  <span className="font-extrabold text-emerald-700">R$ {demand.estimatedCostRange.min}+</span>
                  <span className="text-[#ea580c] font-bold group-hover:translate-x-0.5 transition-transform flex items-center text-xs">
                    Pedir <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Show More / Less Demands Toggle */}
        {filteredDemands.length > 8 && (
          <button
            type="button"
            onClick={() => setShowAllDemands((prev) => !prev)}
            className="w-full py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-[#fff7ed] text-[#ea580c] font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs mt-1"
          >
            <span>{showAllDemands ? 'Mostrar Menos Categorias' : `Ver Todas as ${filteredDemands.length} Categorias`}</span>
            <ChevronRight className={`w-4 h-4 transition-transform ${showAllDemands ? '-rotate-90' : 'rotate-90'}`} />
          </button>
        )}
      </section>

      {/* Minha Casa Alert Summary Card */}
      <section className="flex flex-col gap-2.5">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Gestão da Residência</h3>
            <p className="text-xs text-slate-500 font-medium">Status de manutenção dos cômodos e aparelhos</p>
          </div>
          <button
            id="btn-ver-tudo-casa"
            onClick={onNavigateToMinhaCasa}
            className="text-[#ea580c] font-bold text-xs hover:underline uppercase tracking-wider cursor-pointer"
          >
            Ver tudo
          </button>
        </div>

        {problemRooms.length > 0 ? (
          <div
            onClick={() => onNavigateToRoom(problemRooms[0].id)}
            className="bg-white rounded-2xl shadow-xs p-4 flex items-center justify-between border-l-4 border-[#ea580c] border-y border-r border-slate-200 hover:shadow-md hover:border-[#ea580c] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#fff7ed] flex items-center justify-center text-[#ea580c] border border-[#fed7aa]/60">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-[#ea580c] transition-colors">
                  {problemRooms[0].name}
                </h4>
                <p className="text-xs sm:text-sm font-semibold text-rose-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                  {problemRooms[0].statusText}
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-[#fff7ed] flex items-center justify-center text-slate-600 group-hover:text-[#ea580c] transition-colors">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ) : (
          <div
            onClick={onNavigateToMinhaCasa}
            className="bg-white rounded-2xl shadow-xs p-4 flex items-center justify-between border border-slate-200 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">Todos os cômodos em ordem</h4>
                <p className="text-xs text-slate-500">Nenhum vazamento ou falha ativa detectada</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
          </div>
        )}
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              Garantia Resolva Já de 90 Dias
            </h4>
            <p className="text-xs text-slate-300">
              Pagamento protegido em custódia até você aprovar o serviço finalizado.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-lg shrink-0">
          100% Protegido
        </span>
      </section>
    </div>
  );
};
