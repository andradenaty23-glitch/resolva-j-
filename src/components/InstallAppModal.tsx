import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Download,
  Share2,
  CheckCircle2,
  Layers,
  Terminal,
  Copy,
  Check,
  Shield,
  Zap,
  Globe,
  Monitor,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt?: any;
  onInstalled?: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstalled
}) => {
  const [activeTab, setActiveTab] = useState<'pwa' | 'capacitor' | 'ios'>('pwa');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      setIsInstalling(true);
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setInstallSuccess(true);
        confetti({ particleCount: 60, spread: 60 });
        if (onInstalled) onInstalled();
      }
      setIsInstalling(false);
    } else {
      // Show tab instructions based on user platform
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        setActiveTab('ios');
      } else {
        setActiveTab('pwa');
      }
    }
  };

  const capacitorCommands = `# 1. Instalar Capacitor no projeto:
npm i @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios

# 2. Inicializar o aplicativo Resolva Já:
npx cap init "RESOLVA JÁ" "com.resolvaja.app" --web-dir=dist

# 3. Compilar os arquivos para produção:
npm run build

# 4. Adicionar plataformas nativas:
npx cap add android
npx cap add ios

# 5. Sincronizar e abrir no Android Studio / Xcode:
npx cap sync
npx cap open android`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(capacitorCommands);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-xl w-full shadow-2xl flex flex-col gap-4 border border-[#e4e4e7] max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#18181b] text-[#ea580c] flex items-center justify-center border border-[#27272a] shadow-xs shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-[#ea580c] bg-[#fff7ed] border border-[#fed7aa] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                App Mobile & PWA Ready
              </span>
              <h2 className="text-xl font-black text-[#18181b] mt-0.5">
                Instalar e Executar como Aplicativo
              </h2>
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

        {/* Tab switcher */}
        <div className="flex bg-[#f4f4f5] p-1 rounded-2xl border border-[#e4e4e7]">
          <button
            type="button"
            onClick={() => setActiveTab('pwa')}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'pwa'
                ? 'bg-white text-[#18181b] shadow-xs'
                : 'text-[#71717a] hover:text-[#18181b]'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Instalar Direto (PWA)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'ios'
                ? 'bg-white text-[#18181b] shadow-xs'
                : 'text-[#71717a] hover:text-[#18181b]'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>iPhone / iOS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('capacitor')}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'capacitor'
                ? 'bg-white text-[#18181b] shadow-xs'
                : 'text-[#71717a] hover:text-[#18181b]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Gerar APK (Capacitor)</span>
          </button>
        </div>

        {/* Tab 1: PWA Direct Install */}
        {activeTab === 'pwa' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#fff7ed] p-4 rounded-2xl border border-[#fed7aa] flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[#ea580c]">
                <Zap className="w-5 h-5" />
                <h3 className="text-sm font-bold text-[#18181b]">
                  Aplicativo Standalone com Ícone na Tela
                </h3>
              </div>
              <p className="text-xs text-[#52525b] leading-relaxed">
                O RESOLVA JÁ foi configurado com <strong>Web Manifest</strong>, <strong>Service Worker</strong> e ícones nativos. Ao instalar, ele funciona em tela cheia, sem barra de navegação do navegador, com carregamento instantâneo.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="bg-[#fafafa] p-3.5 rounded-2xl border border-[#e4e4e7] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#18181b]">Acesso Rápido com 1 Toque</h4>
                  <p className="text-[11px] text-[#71717a]">Ícone personalizado instalado na gaveta de apps</p>
                </div>
              </div>

              <div className="bg-[#fafafa] p-3.5 rounded-2xl border border-[#e4e4e7] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#18181b]">Modo Offline & Cache</h4>
                  <p className="text-[11px] text-[#71717a]">Recursos e dados pré-carregados para agilidade</p>
                </div>
              </div>

              <div className="bg-[#fafafa] p-3.5 rounded-2xl border border-[#e4e4e7] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#18181b]">Câmera e Microfone</h4>
                  <p className="text-[11px] text-[#71717a]">Permissões nativas para fotos e áudios de defeitos</p>
                </div>
              </div>

              <div className="bg-[#fafafa] p-3.5 rounded-2xl border border-[#e4e4e7] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#18181b]">Notificações de Visitas</h4>
                  <p className="text-[11px] text-[#71717a]">Alertas sobre chegada do técnico e orçamentos</p>
                </div>
              </div>
            </div>

            {deferredPrompt ? (
              <button
                type="button"
                onClick={handleNativeInstall}
                disabled={isInstalling}
                className="w-full py-3.5 rounded-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                <Download className="w-4 h-4" />
                <span>{isInstalling ? 'Instalando...' : 'Instalar Aplicativo Agora'}</span>
              </button>
            ) : (
              <div className="bg-[#f4f4f5] p-3.5 rounded-2xl border border-[#e4e4e7] flex flex-col gap-2">
                <p className="text-xs font-semibold text-[#18181b]">
                  Como instalar pelo navegador (Chrome, Edge ou Android):
                </p>
                <ol className="text-xs text-[#52525b] list-decimal list-inside space-y-1">
                  <li>Clique nos três pontinhos do navegador no topo direito.</li>
                  <li>Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</li>
                  <li>Confirme o nome <strong>RESOLVA JÁ</strong> para finalizar.</li>
                </ol>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: iOS Instructions */}
        {activeTab === 'ios' && (
          <div className="flex flex-col gap-3">
            <div className="bg-[#fafafa] p-4 rounded-2xl border border-[#e4e4e7] flex flex-col gap-3">
              <h3 className="text-sm font-bold text-[#18181b] flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#ea580c]" />
                Instalação no iPhone e iPad (Safari)
              </h3>

              <div className="space-y-2.5 text-xs text-[#52525b]">
                <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-[#e4e4e7]">
                  <span className="w-5 h-5 rounded-full bg-[#ea580c] text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                    1
                  </span>
                  <p>Abra o link do RESOLVA JÁ no navegador <strong>Safari</strong> do iOS.</p>
                </div>

                <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-[#e4e4e7]">
                  <span className="w-5 h-5 rounded-full bg-[#ea580c] text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                    2
                  </span>
                  <p>
                    Toque no botão <strong>Compartilhar</strong> (o quadrado com uma seta apontando para cima na barra inferior).
                  </p>
                </div>

                <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-[#e4e4e7]">
                  <span className="w-5 h-5 rounded-full bg-[#ea580c] text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                    3
                  </span>
                  <p>
                    Role para baixo e toque em <strong>"Adicionar à Tela de Início"</strong>.
                  </p>
                </div>

                <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-[#e4e4e7]">
                  <span className="w-5 h-5 rounded-full bg-[#ea580c] text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                    4
                  </span>
                  <p>
                    Toque em <strong>Adicionar</strong> no canto superior direito. Pronto! O app abrirá em tela cheia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Capacitor APK / Native build */}
        {activeTab === 'capacitor' && (
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#18181b]">
                Comandos para gerar APK Android & iOS nativo:
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="text-xs font-bold text-[#ea580c] bg-[#fff7ed] hover:bg-[#ea580c] hover:text-white px-2.5 py-1 rounded-lg border border-[#fed7aa] transition-all flex items-center gap-1 cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copiado!' : 'Copiar Comandos'}</span>
              </button>
            </div>

            <pre className="bg-[#18181b] text-emerald-400 p-3.5 rounded-2xl text-[11px] font-mono overflow-x-auto leading-relaxed border border-[#27272a]">
              {capacitorCommands}
            </pre>

            <div className="bg-[#fafafa] p-3 rounded-xl border border-[#e4e4e7] text-[11px] text-[#71717a] space-y-1">
              <p>• <strong>Package Name:</strong> <code>com.resolvaja.app</code></p>
              <p>• <strong>App Name:</strong> <code>RESOLVA JÁ</code></p>
              <p>• <strong>Web Dir:</strong> <code>dist</code> (gerado com <code>npm run build</code>)</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-[#f4f4f5] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-[#18181b] hover:bg-[#27272a] text-white font-bold text-xs cursor-pointer transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
