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
  Search
} from 'lucide-react';
import { ProblemCategory, Room } from '../types';
import { SERVICE_DEMANDS_CATALOG, ServiceDemandCategory } from '../data/serviceDemands';

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
  onClearPhoto
}) => {
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
      case 'Layers':
        return Layers;
      case 'Shield':
        return Shield;
      case 'Component':
        return ComponentIcon;
      case 'Refrigerator':
        return Refrigerator;
      case 'Video':
        return Video;
      case 'Sparkles':
        return Sparkles;
      case 'Flame':
        return Flame;
      case 'Square':
        return Square;
      default:
        return Wrench;
    }
  };

  const filteredDemands = SERVICE_DEMANDS_CATALOG.filter((item) => {
    if (selectedFilterTab === 'urgente') {
      return item.urgencyDefault === 'critica' || item.urgencyDefault === 'alta' || item.badge?.includes('24');
    }
    if (selectedFilterTab === 'instalacao') {
      return (
        item.id === 'montagem_moveis' ||
        item.id === 'eletrodomesticos' ||
        item.id === 'seguranca_cftv' ||
        item.id === 'ar_condicionado' ||
        item.id === 'geral'
      );
    }
    if (selectedFilterTab === 'reforma') {
      return (
        item.id === 'pintura' ||
        item.id === 'alvenaria' ||
        item.id === 'gesso_drywall' ||
        item.id === 'marcenaria' ||
        item.id === 'serralheria' ||
        item.id === 'limpeza_pos_obra'
      );
    }
    return true;
  });

  const displayedDemands = showAllDemands ? filteredDemands : filteredDemands.slice(0, 8);

  return (
    <div className="flex flex-col gap-4 sm:gap-5 max-w-xl mx-auto pb-6">
      {/* Hero Section: O que aconteceu? */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-[#18181b] tracking-tight">
            O que aconteceu?
          </h2>
          <span className="inline-flex items-center gap-1 text-[11px] text-[#ea580c] font-bold bg-[#fff7ed] border border-[#fed7aa] px-2 py-0.5 rounded-full shadow-2xs">
            <Sparkles className="w-3 h-3" /> IA Diagnóstico
          </span>
        </div>

        {/* Big Input Container */}
        <div className="bg-white rounded-2xl shadow-xs p-3 sm:p-4 flex flex-col gap-3 border border-[#e4e4e7] focus-within:border-[#ea580c] focus-within:ring-2 focus-within:ring-[#ea580c]/20 transition-all">
          <textarea
            id="input-problem-description"
            rows={2.5}
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            placeholder="Descreva a demanda ou problema com suas palavras (ex: vazamento embaixo da pia, montagem de armário, tomada faiscando, troca de fechadura)..."
            className="w-full bg-transparent border-none resize-none focus:outline-hidden text-sm sm:text-base text-[#18181b] placeholder-[#a1a1aa] p-0 font-normal leading-relaxed"
          />

          {/* Photo attachment preview if uploaded */}
          {selectedPhoto && (
            <div className="relative inline-block w-20 h-20 rounded-xl overflow-hidden border border-[#d4d4d8] shadow-xs group">
              <img src={selectedPhoto} alt="Problema anexado" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={onClearPhoto}
                className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white p-1 rounded-full transition-colors cursor-pointer"
                title="Remover foto"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Input Method Badges / Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none pt-2 border-t border-[#f4f4f5]">
            <button
              type="button"
              id="btn-mode-digitar"
              onClick={() => setActiveInputMode('digitar')}
              className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                activeInputMode === 'digitar'
                  ? 'bg-[#18181b] text-white shadow-xs'
                  : 'bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7] hover:bg-[#fff7ed] hover:text-[#ea580c]'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              Digitar
            </button>

            <button
              type="button"
              id="btn-mode-falar"
              onClick={() => {
                setActiveInputMode('falar');
                onOpenVoiceInput();
              }}
              className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                activeInputMode === 'falar'
                  ? 'bg-[#18181b] text-white shadow-xs'
                  : 'bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7] hover:bg-[#fff7ed] hover:text-[#ea580c]'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              Falar
            </button>

            <button
              type="button"
              id="btn-mode-foto"
              onClick={() => {
                setActiveInputMode('foto');
                onOpenPhotoInput();
              }}
              className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                activeInputMode === 'foto' || selectedPhoto
                  ? 'bg-[#18181b] text-white shadow-xs'
                  : 'bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7] hover:bg-[#fff7ed] hover:text-[#ea580c]'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              {selectedPhoto ? 'Foto anexada' : 'Mostrar por foto'}
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-1 mt-0.5">
          <span className="text-[11px] text-[#71717a] font-medium py-0.5">Exemplos:</span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setProblemDescription(prompt)}
              className="text-[10px] bg-white border border-[#e4e4e7] text-[#52525b] hover:border-[#ea580c] hover:text-[#ea580c] px-2 py-0.5 rounded-full transition-colors truncate max-w-[190px] cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col gap-1.5 mt-1">
          <button
            type="button"
            id="btn-find-solution"
            onClick={() => handleSubmit()}
            className="w-full bg-[#ea580c] hover:bg-[#c2410c] active:scale-[0.99] text-white font-bold text-sm sm:text-base py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Encontrar solução</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            id="btn-guided-wizard"
            onClick={onOpenGuidedWizard}
            className="w-full bg-transparent hover:bg-[#fff7ed] text-[#ea580c] font-bold text-[11px] py-2 rounded-lg transition-colors tracking-wider uppercase flex items-center justify-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            NÃO SEI O QUE É (Assistente Guiado)
          </button>
        </div>
      </section>

      {/* Demandas de Serviços & Categorias Grid */}
      <section className="flex flex-col gap-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#18181b]">Demandas de Serviços</h3>
            <p className="text-[11px] text-[#71717a]">Selecione uma especialidade para diagnóstico imediato</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
            <button
              onClick={() => setSelectedFilterTab('todos')}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedFilterTab === 'todos'
                  ? 'bg-[#18181b] text-white'
                  : 'bg-[#f4f4f5] text-[#71717a] hover:bg-[#e4e4e7]'
              }`}
            >
              Todos ({SERVICE_DEMANDS_CATALOG.length})
            </button>
            <button
              onClick={() => setSelectedFilterTab('urgente')}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedFilterTab === 'urgente'
                  ? 'bg-rose-600 text-white'
                  : 'bg-[#f4f4f5] text-[#71717a] hover:bg-[#e4e4e7]'
              }`}
            >
              Urgentes / 24h
            </button>
            <button
              onClick={() => setSelectedFilterTab('instalacao')}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedFilterTab === 'instalacao'
                  ? 'bg-[#ea580c] text-white'
                  : 'bg-[#f4f4f5] text-[#71717a] hover:bg-[#e4e4e7]'
              }`}
            >
              Instalação
            </button>
            <button
              onClick={() => setSelectedFilterTab('reforma')}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedFilterTab === 'reforma'
                  ? 'bg-[#ea580c] text-white'
                  : 'bg-[#f4f4f5] text-[#71717a] hover:bg-[#e4e4e7]'
              }`}
            >
              Reformas
            </button>
          </div>
        </div>

        {/* Dynamic Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
          {displayedDemands.map((demand) => {
            const Icon = getIconComponent(demand.iconName);
            return (
              <button
                key={demand.id}
                id={`cat-${demand.id}`}
                onClick={() => handleDemandClick(demand)}
                className="relative flex flex-col items-start p-2.5 bg-white rounded-xl shadow-xs border border-[#e4e4e7] hover:border-[#ea580c] hover:shadow-md transition-all active:scale-[0.98] group cursor-pointer text-left overflow-hidden"
              >
                {demand.badge && (
                  <span className="absolute top-2 right-2 text-[8px] font-black uppercase px-1 py-0.2 rounded-full bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa]">
                    {demand.badge}
                  </span>
                )}

                <div className="w-8 h-8 rounded-lg bg-[#fff7ed] flex items-center justify-center text-[#ea580c] group-hover:bg-[#ea580c] group-hover:text-white transition-colors mb-1.5">
                  <Icon className="w-4 h-4" />
                </div>

                <span className="text-xs font-bold text-[#18181b] group-hover:text-[#ea580c] transition-colors leading-tight line-clamp-1">
                  {demand.shortName}
                </span>

                <span className="text-[10px] text-[#71717a] mt-0.5 line-clamp-1 leading-tight">
                  {demand.description}
                </span>

                <div className="mt-2 pt-1.5 border-t border-[#f4f4f5] w-full flex justify-between items-center text-[10px]">
                  <span className="font-bold text-emerald-700">R$ {demand.estimatedCostRange.min}+</span>
                  <span className="text-[#ea580c] font-bold group-hover:translate-x-0.5 transition-transform flex items-center text-[9px]">
                    Pedir <ChevronRight className="w-3 h-3 ml-0.2" />
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
            className="w-full py-2 rounded-lg border border-[#e4e4e7] bg-white hover:bg-[#fff7ed] text-[#ea580c] font-bold text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-2xs mt-0.5"
          >
            <span>{showAllDemands ? 'Mostrar Menos Categorias' : `Ver Todas as ${filteredDemands.length} Categorias`}</span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAllDemands ? '-rotate-90' : 'rotate-90'}`} />
          </button>
        )}
      </section>

      {/* Minha Casa Alert Summary Card */}
      <section className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h3 className="text-base sm:text-lg font-bold text-[#18181b]">Minha Casa</h3>
          <button
            id="btn-ver-tudo-casa"
            onClick={onNavigateToMinhaCasa}
            className="text-[#ea580c] font-bold text-[11px] hover:underline uppercase tracking-wide cursor-pointer"
          >
            Ver tudo
          </button>
        </div>

        {problemRooms.length > 0 ? (
          <div
            onClick={() => onNavigateToRoom(problemRooms[0].id)}
            className="bg-white rounded-xl shadow-xs p-3 flex items-center justify-between border-l-4 border-[#ea580c] border-y border-r border-[#e4e4e7] hover:shadow-md hover:border-[#ea580c] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#fff7ed] flex items-center justify-center text-[#ea580c]">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#18181b] group-hover:text-[#ea580c] transition-colors">
                  {problemRooms[0].name}
                </h4>
                <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                  {problemRooms[0].statusText}
                </p>
              </div>
            </div>

            <div className="w-7 h-7 rounded-full bg-[#f4f4f5] group-hover:bg-[#fff7ed] flex items-center justify-center text-[#52525b] group-hover:text-[#ea580c] transition-colors">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ) : (
          <div
            onClick={onNavigateToMinhaCasa}
            className="bg-white rounded-xl shadow-xs p-3 flex items-center justify-between border border-[#e4e4e7] hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#18181b]">Todos os cômodos em ordem</h4>
                <p className="text-[10px] text-[#71717a]">Nenhum vazamento ou falha ativa</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#71717a]" />
          </div>
        )}
      </section>
    </div>
  );
};
