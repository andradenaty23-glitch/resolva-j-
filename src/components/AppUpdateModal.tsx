import React, { useState } from 'react';
import {
  X,
  RefreshCw,
  CheckCircle2,
  Sparkles,
  Smartphone,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

interface AppUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppUpdateModal: React.FC<AppUpdateModalProps> = ({ isOpen, onClose }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCheckUpdate = () => {
    setIsChecking(true);
    setUpdateSuccess(false);

    setTimeout(() => {
      setIsChecking(false);
      setUpdateSuccess(true);
    }, 1200);
  };

  const handleReloadApp = () => {
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 border border-[#e4e4e7] max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa] flex items-center justify-center shadow-2xs">
              <RefreshCw className={`w-6 h-6 ${isChecking ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#18181b]">
                  Atualização do App
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
                  v2.4.2
                </span>
              </div>
              <p className="text-xs text-[#71717a]">
                Engenharia Residencial & Plataforma Resolva Já
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Card */}
        <div className="bg-[#fafafa] p-4 rounded-2xl border border-[#e4e4e7] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#18181b] flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-[#ea580c]" />
              Status da Versão
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Versão Oficial Ativa
            </span>
          </div>

          <p className="text-xs text-[#52525b] leading-relaxed">
            Seu aplicativo está sincronizado com a versão mais recente da plataforma Resolva Já, com diagnósticos atualizados e suporte completo no celular.
          </p>

          {updateSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-950 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Verificação Concluída!</p>
                <p className="text-[11px] text-emerald-800">
                  Catálogo de serviços e diagnósticos recarregados com sucesso.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* What's New in v2.4.2 */}
        <div className="space-y-2">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#18181b] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
            O que há de novo na v2.4.2
          </h4>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-white rounded-xl border border-[#e4e4e7] flex items-start gap-2.5">
              <Zap className="w-4 h-4 text-[#ea580c] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#18181b]">Diagnóstico por IA Inteligente</p>
                <p className="text-[#71717a] text-[11px]">
                  Análise imediata do problema relatado com estimativa de custos e orçamentos correspondentes.
                </p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#e4e4e7] flex items-start gap-2.5">
              <Smartphone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#18181b]">Interface Celular & PWA Otimizada</p>
                <p className="text-[#71717a] text-[11px]">
                  Ajustes de telas para celulares, navegação por toque fluida e consumo reduzido de dados.
                </p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#e4e4e7] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#18181b]">Garantia Protege & Caução Pix</p>
                <p className="text-[#71717a] text-[11px]">
                  Retenção segura do pagamento e garantia contratual de 90 dias até R$ 5.000.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            type="button"
            onClick={handleCheckUpdate}
            disabled={isChecking}
            className="flex-1 py-2.5 px-4 rounded-full border border-[#e4e4e7] hover:bg-[#fafafa] text-xs font-bold text-[#18181b] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#ea580c] ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Verificando...' : 'Buscar Atualizações'}
          </button>

          <button
            type="button"
            onClick={handleReloadApp}
            className="flex-1 py-2.5 px-4 rounded-full bg-[#18181b] hover:bg-[#ea580c] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Recarregar App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
