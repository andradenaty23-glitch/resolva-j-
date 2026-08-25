import React from 'react';
import { AlertTriangle, ServerCrash, WifiOff, FileSearch, ShieldAlert, ArrowLeft, RefreshCw, Home } from 'lucide-react';

export type ErrorType = '404' | 'network' | 'server' | 'auth' | 'unexpected' | 'timeout' | 'validation';

interface ErrorStateProps {
  type?: ErrorType;
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  onGoHome?: () => void;
  className?: string;
}

const ERROR_CONFIG: Record<ErrorType, { icon: React.ElementType, defaultTitle: string, defaultMessage: string, color: string }> = {
  '404': {
    icon: FileSearch,
    defaultTitle: 'Página não encontrada',
    defaultMessage: 'O conteúdo que você está procurando não existe ou foi movido.',
    color: 'text-slate-500'
  },
  'network': {
    icon: WifiOff,
    defaultTitle: 'Sem conexão',
    defaultMessage: 'Verifique sua conexão com a internet e tente novamente.',
    color: 'text-amber-500'
  },
  'server': {
    icon: ServerCrash,
    defaultTitle: 'Serviço indisponível',
    defaultMessage: 'Nossos servidores estão passando por instabilidade. Tente novamente em alguns minutos.',
    color: 'text-rose-500'
  },
  'auth': {
    icon: ShieldAlert,
    defaultTitle: 'Acesso negado',
    defaultMessage: 'Você não tem permissão para realizar esta operação ou sua sessão expirou.',
    color: 'text-rose-600'
  },
  'unexpected': {
    icon: AlertTriangle,
    defaultTitle: 'Algo deu errado',
    defaultMessage: 'Ocorreu um erro inesperado. Nossa equipe técnica já foi notificada.',
    color: 'text-[#ea580c]'
  },
  'timeout': {
    icon: RefreshCw,
    defaultTitle: 'Tempo esgotado',
    defaultMessage: 'A operação demorou mais que o esperado. Por favor, tente novamente.',
    color: 'text-amber-500'
  },
  'validation': {
    icon: AlertTriangle,
    defaultTitle: 'Dados inválidos',
    defaultMessage: 'Alguns campos do formulário foram preenchidos incorretamente. Verifique e tente novamente.',
    color: 'text-amber-600'
  }
};

export const ErrorState: React.FC<ErrorStateProps> = ({
  type = 'unexpected',
  title,
  message,
  onRetry,
  onGoBack,
  onGoHome,
  className = ''
}) => {
  const config = ERROR_CONFIG[type];
  const Icon = config.icon;
  const displayTitle = title || config.defaultTitle;
  const displayMessage = message || config.defaultMessage;

  return (
    <div className={`flex flex-col items-center justify-center text-center p-6 min-h-[50vh] animate-in fade-in zoom-in duration-300 ${className}`}>
      <div className={`w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-200 ${config.color}`}>
        <Icon className="w-10 h-10" />
      </div>
      
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 tracking-tight">
        {displayTitle}
      </h2>
      
      <p className="text-slate-500 mb-8 max-w-sm text-sm sm:text-base leading-relaxed">
        {displayMessage}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center justify-center gap-2 bg-[#ea580c] hover:bg-[#d44d08] text-white px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Tentar novamente</span>
          </button>
        )}
        
        {onGoBack && (
          <button
            onClick={onGoBack}
            className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>
        )}

        {onGoHome && (
          <button
            onClick={onGoHome}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-md"
          >
            <Home className="w-4 h-4" />
            <span>Ir para o Início</span>
          </button>
        )}
      </div>
    </div>
  );
};
