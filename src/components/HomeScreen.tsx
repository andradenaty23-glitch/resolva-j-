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
  Sparkles
} from 'lucide-react';
import { ProblemCategory, Room } from '../types';

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

  const quickPrompts = [
    'Torneira da cozinha vazando na bancada',
    'Chuveiro elétrico parou de esquentar',
    'Disjuntor cai quando ligo o micro-ondas',
    'Ar condicionado gotejando dentro do quarto'
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!problemDescription.trim() && !selectedPhoto) return;
    onFindSolution(problemDescription, selectedPhoto || undefined);
  };

  const handleQuickCategoryClick = (category: ProblemCategory, label: string) => {
    setProblemDescription(`Problema de ${label}: preciso de reparo urgente`);
    onSelectCategory(category);
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8 max-w-2xl mx-auto pb-10">
      {/* Hero Section: O que aconteceu? */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#18181b] tracking-tight">
            O que aconteceu?
          </h2>
          <span className="inline-flex items-center gap-1 text-xs text-[#ea580c] font-bold bg-[#fff7ed] border border-[#fed7aa] px-2.5 py-1 rounded-full shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" /> IA Diagnóstico
          </span>
        </div>

        {/* Big Input Container */}
        <div className="bg-white rounded-2xl shadow-xs p-4 sm:p-5 flex flex-col gap-4 border border-[#e4e4e7] focus-within:border-[#ea580c] focus-within:ring-2 focus-within:ring-[#ea580c]/20 transition-all">
          <textarea
            id="input-problem-description"
            rows={4}
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            placeholder="Descreva o problema com suas palavras (ex: vazamento embaixo da pia, tomada faiscando, cheiro de queimado)..."
            className="w-full bg-transparent border-none resize-none focus:outline-hidden text-base sm:text-lg text-[#18181b] placeholder-[#a1a1aa] p-0 font-normal leading-relaxed"
          />

          {/* Photo attachment preview if uploaded */}
          {selectedPhoto && (
            <div className="relative inline-block w-28 h-28 rounded-xl overflow-hidden border border-[#d4d4d8] shadow-xs group">
              <img src={selectedPhoto} alt="Problema anexado" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={onClearPhoto}
                className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white p-1 rounded-full transition-colors cursor-pointer"
                title="Remover foto"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Input Method Badges / Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-[#f4f4f5]">
            <button
              type="button"
              id="btn-mode-digitar"
              onClick={() => setActiveInputMode('digitar')}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                activeInputMode === 'digitar'
                  ? 'bg-[#18181b] text-white shadow-xs'
                  : 'bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7] hover:bg-[#fff7ed] hover:text-[#ea580c]'
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
              className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                activeInputMode === 'falar'
                  ? 'bg-[#18181b] text-white shadow-xs'
                  : 'bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7] hover:bg-[#fff7ed] hover:text-[#ea580c]'
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
              className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                activeInputMode === 'foto' || selectedPhoto
                  ? 'bg-[#18181b] text-white shadow-xs'
                  : 'bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7] hover:bg-[#fff7ed] hover:text-[#ea580c]'
              }`}
            >
              <Camera className="w-4 h-4" />
              {selectedPhoto ? 'Foto anexada' : 'Mostrar por foto'}
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5 mt-1">
          <span className="text-xs text-[#71717a] font-medium py-1">Exemplos:</span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setProblemDescription(prompt)}
              className="text-[11px] bg-white border border-[#e4e4e7] text-[#52525b] hover:border-[#ea580c] hover:text-[#ea580c] px-2.5 py-1 rounded-full transition-colors truncate max-w-[220px] cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col gap-2.5 mt-2">
          <button
            type="button"
            id="btn-find-solution"
            onClick={() => handleSubmit()}
            className="w-full bg-[#ea580c] hover:bg-[#c2410c] active:scale-[0.99] text-white font-bold text-lg py-4 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Encontrar solução</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            id="btn-guided-wizard"
            onClick={onOpenGuidedWizard}
            className="w-full bg-transparent hover:bg-[#fff7ed] text-[#ea580c] font-bold text-xs py-2.5 rounded-xl transition-colors tracking-wider uppercase flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            NÃO SEI O QUE É (Assistente Guiado)
          </button>
        </div>
      </section>

      {/* Problemas Frequentes Grid */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#18181b]">Problemas frequentes</h3>
          <span className="text-xs text-[#71717a]">Categorias</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 sm:gap-3">
          {/* Elétrica */}
          <button
            id="cat-eletrica"
            onClick={() => handleQuickCategoryClick('eletrica', 'Elétrica')}
            className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl shadow-xs border border-[#e4e4e7] hover:border-[#ea580c] hover:shadow-sm transition-all active:scale-95 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#fff7ed] flex items-center justify-center text-[#ea580c] group-hover:bg-[#ea580c] group-hover:text-white transition-colors">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-[#52525b] text-center">Elétrica</span>
          </button>

          {/* Hidráulica */}
          <button
            id="cat-hidraulica"
            onClick={() => handleQuickCategoryClick('hidraulica', 'Hidráulica')}
            className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl shadow-xs border border-[#e4e4e7] hover:border-[#ea580c] hover:shadow-sm transition-all active:scale-95 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#fff7ed] flex items-center justify-center text-[#ea580c] group-hover:bg-[#ea580c] group-hover:text-white transition-colors">
              <Droplets className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-[#52525b] text-center">Hidráulica</span>
          </button>

          {/* Ar Cond. */}
          <button
            id="cat-ar-cond"
            onClick={() => handleQuickCategoryClick('ar_condicionado', 'Ar Condicionado')}
            className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl shadow-xs border border-[#e4e4e7] hover:border-[#ea580c] hover:shadow-sm transition-all active:scale-95 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#fff7ed] flex items-center justify-center text-[#ea580c] group-hover:bg-[#ea580c] group-hover:text-white transition-colors">
              <Snowflake className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-[#52525b] text-center">Ar Cond.</span>
          </button>

          {/* Geral */}
          <button
            id="cat-geral"
            onClick={() => handleQuickCategoryClick('geral', 'Reparos Gerais')}
            className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl shadow-xs border border-[#e4e4e7] hover:border-[#ea580c] hover:shadow-sm transition-all active:scale-95 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#fff7ed] flex items-center justify-center text-[#ea580c] group-hover:bg-[#ea580c] group-hover:text-white transition-colors">
              <Wrench className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-[#52525b] text-center">Geral</span>
          </button>

          {/* Pintura */}
          <button
            id="cat-pintura"
            onClick={() => handleQuickCategoryClick('pintura', 'Pintura e Acabamento')}
            className="hidden sm:flex flex-col items-center gap-2 p-3 bg-white rounded-2xl shadow-xs border border-[#e4e4e7] hover:border-[#ea580c] hover:shadow-sm transition-all active:scale-95 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#fff7ed] flex items-center justify-center text-[#ea580c] group-hover:bg-[#ea580c] group-hover:text-white transition-colors">
              <Paintbrush className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-[#52525b] text-center">Pintura</span>
          </button>

          {/* Fechaduras */}
          <button
            id="cat-fechaduras"
            onClick={() => handleQuickCategoryClick('fechadura', 'Fechaduras e Portas')}
            className="hidden sm:flex flex-col items-center gap-2 p-3 bg-white rounded-2xl shadow-xs border border-[#e4e4e7] hover:border-[#ea580c] hover:shadow-sm transition-all active:scale-95 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#fff7ed] flex items-center justify-center text-[#ea580c] group-hover:bg-[#ea580c] group-hover:text-white transition-colors">
              <Key className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-[#52525b] text-center">Chaveiro</span>
          </button>
        </div>
      </section>

      {/* Minha Casa Alert Summary Card */}
      <section className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-[#18181b]">Minha Casa</h3>
          <button
            id="btn-ver-tudo-casa"
            onClick={onNavigateToMinhaCasa}
            className="text-[#ea580c] font-bold text-xs hover:underline uppercase tracking-wide cursor-pointer"
          >
            Ver tudo
          </button>
        </div>

        {problemRooms.length > 0 ? (
          <div
            onClick={() => onNavigateToRoom(problemRooms[0].id)}
            className="bg-white rounded-2xl shadow-xs p-4 flex items-center justify-between border-l-4 border-[#ea580c] border-y border-r border-[#e4e4e7] hover:shadow-md hover:border-[#ea580c] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#fff7ed] flex items-center justify-center text-[#ea580c]">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#18181b] group-hover:text-[#ea580c] transition-colors">
                  {problemRooms[0].name}
                </h4>
                <p className="text-xs font-medium text-rose-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                  {problemRooms[0].statusText}
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-[#f4f4f5] group-hover:bg-[#fff7ed] flex items-center justify-center text-[#52525b] group-hover:text-[#ea580c] transition-colors">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        ) : (
          <div
            onClick={onNavigateToMinhaCasa}
            className="bg-white rounded-2xl shadow-xs p-4 flex items-center justify-between border border-[#e4e4e7] hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#18181b]">Todos os cômodos em ordem</h4>
                <p className="text-xs text-[#71717a]">Nenhum vazamento ou falha ativa</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#71717a]" />
          </div>
        )}
      </section>
    </div>
  );
};
