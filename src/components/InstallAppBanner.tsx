import React from 'react';
import { Smartphone, Download, X } from 'lucide-react';

interface InstallAppBannerProps {
  onOpenInstallModal: () => void;
  onDismiss: () => void;
  show: boolean;
}

export const InstallAppBanner: React.FC<InstallAppBannerProps> = ({
  onOpenInstallModal,
  onDismiss,
  show
}) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-30 bg-[#18181b] text-white p-3 sm:p-3.5 rounded-2xl shadow-xl border border-[#27272a] flex items-center justify-between gap-3 animate-slideUp">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-[#ea580c] flex items-center justify-center shrink-0 shadow-xs">
          <Smartphone className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-bold truncate">Instalar App RESOLVA JÁ</h4>
          <p className="text-[11px] text-zinc-400 truncate">
            Acesso offline e diagnósticos rápidos na tela inicial
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onOpenInstallModal}
          aria-label="Abrir modal para instalar o aplicativo Resolva Já"
          className="bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold px-3 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Instalar</span>
        </button>

        <button
          type="button"
          onClick={onDismiss}
          aria-label="Fechar aviso de instalação"
          className="text-zinc-400 hover:text-white p-1.5 rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Fechar aviso"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
