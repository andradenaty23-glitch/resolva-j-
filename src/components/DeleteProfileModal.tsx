import React, { useState } from 'react';
import { Trash2, AlertTriangle, X, ShieldAlert, Check } from 'lucide-react';
import { UserRole } from '../types';

interface DeleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
  profileName: string;
  onConfirmDelete: () => void;
}

export const DeleteProfileModal: React.FC<DeleteProfileModalProps> = ({
  isOpen,
  onClose,
  role,
  profileName,
  onConfirmDelete
}) => {
  const [confirmationWord, setConfirmationWord] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const isClient = role === 'cliente';
  const requiredConfirmation = 'EXCLUIR';
  const isConfirmed = confirmationWord.trim().toUpperCase() === requiredConfirmation;

  const handleDelete = () => {
    if (!isConfirmed) return;
    setIsDeleting(true);
    setTimeout(() => {
      onConfirmDelete();
      setIsDeleting(false);
      setConfirmationWord('');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-rose-200 flex flex-col gap-4 animate-scaleUp">
        {/* Header with Danger Accent */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full uppercase tracking-wider border border-rose-200">
                Zona de Risco • Irreversível
              </span>
              <h3 className="text-xl font-bold text-[#18181b] mt-0.5">
                {isClient ? 'Excluir Perfil de Cliente' : 'Excluir Perfil Profissional'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#71717a] hover:bg-[#f4f4f5] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Text Box */}
        <div className="bg-rose-50/80 rounded-2xl p-4 border border-rose-200 text-xs text-[#52525b] space-y-2">
          <p className="font-bold text-rose-900 flex items-center gap-1.5 text-sm">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            Atenção: Você está prestes a remover o perfil de "{profileName}".
          </p>
          <ul className="list-disc list-inside space-y-1 text-rose-800 text-[11px] leading-relaxed">
            {isClient ? (
              <>
                <li>Todos os dados pessoais, endereço residencial e CPF cadastrados serão apagados.</li>
                <li>O inventário de cômodos, aparelhos e histórico de diagnósticos serão limpos.</li>
                <li>Você poderá criar uma nova conta a qualquer momento na tela inicial.</li>
              </>
            ) : (
              <>
                <li>Seu credenciamento profissional, especialidades e CNPJ/CPF serão removidos.</li>
                <li>Chave Pix, dados bancários e propostas em andamento serão desvinculados.</li>
                <li>Seus chamados pendentes e avaliações de clientes serão resetados.</li>
              </>
            )}
          </ul>
        </div>

        {/* Safety Confirmation Step */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#18181b] block">
            Digite <span className="text-rose-600 font-mono font-black">EXCLUIR</span> para confirmar a exclusão:
          </label>
          <input
            type="text"
            placeholder="Digite EXCLUIR"
            value={confirmationWord}
            onChange={(e) => setConfirmationWord(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e4e7] text-sm font-bold uppercase tracking-wider focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-[#e4e4e7] text-xs font-bold text-[#52525b] hover:bg-[#f4f4f5] transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!isConfirmed || isDeleting}
            onClick={handleDelete}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
              isConfirmed && !isDeleting
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-[#f4f4f5] text-[#a1a1aa] cursor-not-allowed border border-[#e4e4e7]'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'Excluindo...' : 'Excluir Perfil'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
