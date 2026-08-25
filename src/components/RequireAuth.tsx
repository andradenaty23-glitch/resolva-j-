import React from 'react';
import { Lock, LogIn } from 'lucide-react';
import { GoogleAuthUser } from '../types';

interface RequireAuthProps {
  user: GoogleAuthUser | null;
  onOpenAuth: () => void;
  children: React.ReactNode;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ user, onOpenAuth, children }) => {
  if (user) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center animate-fadeIn">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-200">
        <Lock className="w-8 h-8 text-slate-400" />
      </div>
      <h2 className="text-2xl font-black text-slate-900 mb-2">Área Restrita</h2>
      <p className="text-sm text-slate-600 mb-8 max-w-sm">
        Para acessar esta área, você precisa estar autenticado de forma segura em nosso sistema.
      </p>
      
      <button
        onClick={onOpenAuth}
        className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2"
      >
        <LogIn className="w-5 h-5" />
        Fazer Login para Acessar
      </button>
    </div>
  );
};
