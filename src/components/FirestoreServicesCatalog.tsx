import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Star,
  MapPin,
  Clock,
  Heart,
  ShieldCheck,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Tag
} from 'lucide-react';
import { ServicoDoc, CategoriaDoc, ClientProfile, FavoritoDoc } from '../types';
import { toggleFavorito } from '../services/firestoreService';
import { SafeAvatar } from './SafeAvatar';

interface FirestoreServicesCatalogProps {
  servicos: ServicoDoc[];
  categorias: CategoriaDoc[];
  client: ClientProfile;
  favoritos: FavoritoDoc[];
  onRequestService: (servico: ServicoDoc) => void;
  isLoading?: boolean;
}

export const FirestoreServicesCatalog: React.FC<FirestoreServicesCatalogProps> = ({
  servicos = [],
  categorias = [],
  client,
  favoritos = [],
  onRequestService,
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [sortBy, setSortBy] = useState<'rating' | 'price_asc' | 'price_desc' | 'recent'>('rating');
  const [favoriteLoadingId, setFavoriteLoadingId] = useState<string | null>(null);

  // Favorited service IDs set
  const favoritedIds = useMemo(() => {
    return new Set(favoritos.map((f) => f.servicoId));
  }, [favoritos]);

  const filteredServicos = useMemo(() => {
    return servicos
      .filter((s) => {
        if (!s.ativo) return false;
        
        // Category filter
        if (selectedCategory !== 'todas') {
          if (s.categoriaId !== selectedCategory && s.categoriaNome !== selectedCategory) {
            return false;
          }
        }

        // Search text
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchName = s.nome?.toLowerCase().includes(q);
          const matchDesc = s.descricao?.toLowerCase().includes(q);
          const matchProf = s.profissionalNome?.toLowerCase().includes(q);
          const matchCat = s.categoriaNome?.toLowerCase().includes(q);
          const matchLoc =
            s.cidade?.toLowerCase().includes(q) ||
            s.bairro?.toLowerCase().includes(q);

          if (!matchName && !matchDesc && !matchProf && !matchCat && !matchLoc) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return (b.avaliacaoMedia || 5) - (a.avaliacaoMedia || 5);
        }
        if (sortBy === 'price_asc') {
          return a.preco - b.preco;
        }
        if (sortBy === 'price_desc') {
          return b.preco - a.preco;
        }
        return (b.criadoEm || '').localeCompare(a.criadoEm || '');
      });
  }, [servicos, selectedCategory, searchTerm, sortBy]);

  const handleToggleFav = async (e: React.MouseEvent, servico: ServicoDoc) => {
    e.stopPropagation();
    if (!client.id) return;
    setFavoriteLoadingId(servico.id);
    try {
      await toggleFavorito(client.id, servico.id);
    } catch (err) {
      console.error('Error toggling fav:', err);
    } finally {
      setFavoriteLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header with Search and Title */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Serviços Verificados no Firestore
            </h2>
            <p className="text-xs text-slate-500">
              Profissionais reais disponíveis para contratação imediata
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            {filteredServicos.length} ativos
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por serviço, eletricista, encanador, bairro ou cidade..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:border-orange-500 shadow-xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-3 text-xs font-bold text-slate-400 hover:text-slate-700"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Category Pills and Sort Selector */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setSelectedCategory('todas')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === 'todas'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Todas as Categorias
            </button>
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-orange-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat.nome}
              </button>
            ))}
          </div>

          <div className="shrink-0 flex items-center gap-1">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold focus:outline-none"
            >
              <option value="rating">Melhor Avaliados</option>
              <option value="price_asc">Menor Preço</option>
              <option value="price_desc">Maior Preço</option>
              <option value="recent">Mais Recentes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2">
          <div className="w-7 h-7 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-500">Sincronizando com Firestore...</span>
        </div>
      ) : filteredServicos.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200 flex flex-col items-center gap-2">
          <AlertCircle size={28} className="text-slate-400" />
          <h4 className="text-sm font-bold text-slate-800">Nenhum serviço encontrado</h4>
          <p className="text-xs text-slate-500 max-w-sm">
            Tente buscar com outros termos ou alterne a categoria selecionada.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredServicos.map((servico) => {
            const isFav = favoritedIds.has(servico.id);
            return (
              <div
                key={servico.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-orange-400 hover:shadow-md transition-all flex flex-col justify-between gap-3 group relative overflow-hidden"
              >
                {/* Top card bar */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-200">
                      {servico.categoriaNome || 'Geral'}
                    </span>
                    <button
                      onClick={(e) => handleToggleFav(e, servico)}
                      disabled={favoriteLoadingId === servico.id}
                      className="p-1.5 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                      title={isFav ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
                    >
                      <Heart
                        size={16}
                        className={isFav ? 'fill-rose-500 text-rose-500' : ''}
                      />
                    </button>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-orange-600 transition-colors">
                    {servico.nome}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {servico.descricao}
                  </p>
                </div>

                {/* Professional Info & Location */}
                <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SafeAvatar
                        src={servico.profissionalFoto}
                        name={servico.profissionalNome}
                        size="sm"
                        className="w-7 h-7 rounded-full border border-slate-200"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-800 line-clamp-1">
                          {servico.profissionalNome}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <MapPin size={10} />
                          {servico.bairro ? `${servico.bairro}, ${servico.cidade || 'SP'}` : servico.cidade || 'São Paulo - SP'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-black text-amber-500">
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                      <span>{servico.avaliacaoMedia ? servico.avaliacaoMedia.toFixed(1) : '5.0'}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({servico.totalAvaliacoes || 0})
                      </span>
                    </div>
                  </div>

                  {/* Price & CTA Button */}
                  <div className="flex items-center justify-between mt-1 pt-2 border-t border-dashed border-slate-100">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        A partir de
                      </span>
                      <span className="text-base sm:text-lg font-black text-slate-900">
                        R$ {servico.preco.toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => onRequestService(servico)}
                      className="px-3.5 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send size={13} />
                      <span>Solicitar</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
