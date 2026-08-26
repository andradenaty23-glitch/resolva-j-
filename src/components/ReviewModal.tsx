import React, { useState } from 'react';
import { X, Star, MessageSquare, Award, CheckCircle2, AlertCircle } from 'lucide-react';
import { addAvaliacao } from '../services/firestoreService';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  solicitacaoId: string;
  servicoId: string;
  profissionalId: string;
  profissionalNome?: string;
  servicoNome?: string;
  clienteId: string;
  clienteNome: string;
  clienteFoto?: string;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  solicitacaoId,
  servicoId,
  profissionalId,
  profissionalNome,
  servicoNome,
  clienteId,
  clienteNome,
  clienteFoto
}) => {
  const [nota, setNota] = useState(5);
  const [hoverNota, setHoverNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      await addAvaliacao({
        clienteId,
        clienteNome,
        clienteFoto,
        profissionalId,
        servicoId: servicoId || 'servico-concluido',
        solicitacaoId,
        nota,
        comentario: comentario.trim() || 'Serviço executado com excelência e pontualidade.'
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error adding review:', err);
      setErrorMsg(err.message || 'Não foi possível salvar sua avaliação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-amber-50/50 dark:bg-amber-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <Award size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base">
                Avaliar Atendimento
              </h2>
              <p className="text-xs text-slate-500">
                {profissionalNome || 'Profissional'} • {servicoNome || 'Serviço Concluído'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2">
              <AlertCircle size={16} /> {errorMsg}
            </div>
          )}

          <div className="text-center py-2">
            <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
              Como foi sua experiência geral?
            </div>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverNota || nota) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverNota(star)}
                    onMouseLeave={() => setHoverNota(0)}
                    onClick={() => setNota(star)}
                    className="p-1.5 focus:outline-none transition-transform hover:scale-125"
                  >
                    <Star
                      size={32}
                      className={
                        isFilled
                          ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                          : 'text-slate-300 dark:text-slate-700'
                      }
                    />
                  </button>
                );
              })}
            </div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-2">
              {nota === 5 && '⭐ Excelente! Super recomendo'}
              {nota === 4 && '⭐ Muito Bom! Bom serviço'}
              {nota === 3 && '⭐ Regular / Atendeu ao básico'}
              {nota === 2 && '⭐ Ruim / Teve problemas'}
              {nota === 1 && '⭐ Péssimo / Não recomendo'}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Deixe seu depoimento ou observações
            </label>
            <textarea
              rows={3}
              placeholder="Ex: Profissional super pontual, educado e deixou o local limpo..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-2xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Gravando Avaliação...</span>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>Publicar Avaliação no Firestore</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
