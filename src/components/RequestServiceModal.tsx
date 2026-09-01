import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, MessageSquare, Send, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { ServicoDoc, SolicitacaoDoc, ClientProfile } from '../types';
import { createSolicitacao } from '../services/firebaseDatabase';

interface RequestServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (solicitacaoId: string) => void;
  servico: ServicoDoc | null;
  client: ClientProfile;
  customTitle?: string;
  customProfessionalId?: string;
  customProfessionalName?: string;
}

export const RequestServiceModal: React.FC<RequestServiceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  servico,
  client,
  customTitle,
  customProfessionalId,
  customProfessionalName
}) => {
  const [dataAgendamento, setDataAgendamento] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [horario, setHorario] = useState('14:00');
  const [descricao, setDescricao] = useState('');
  const [observacao, setObservacao] = useState('');
  const [endereco, setEndereco] = useState(
    client.address?.street
      ? `${client.address.street}, ${client.address.number || 'S/N'} - ${client.address.neighborhood || ''}, ${client.address.city || ''}`
      : 'Rua dos Pinheiros, 100 - Pinheiros, São Paulo - SP'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const targetProfId = servico?.profissionalId || customProfessionalId || 'prov-default';
  const targetProfName = servico?.profissionalNome || customProfessionalName || 'Profissional Resolva Já';
  const targetServiceName = customTitle || servico?.nome || 'Atendimento Especializado';
  const precoBase = servico?.preco || 150;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim()) {
      setErrorMsg('Descreva brevemente o problema ou necessidade.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const dataHoraCompleta = `${dataAgendamento}T${horario}:00`;

      const id = await createSolicitacao({
        clienteId: client.id,
        clienteNome: client.name,
        clienteFoto: client.avatar,
        clienteTelefone: client.phone,
        profissionalId: targetProfId,
        profissionalNome: targetProfName,
        servicoId: servico?.id || 'servico-direto',
        servicoNome: targetServiceName,
        descricao: descricao.trim(),
        dataSolicitacao: dataHoraCompleta,
        status: 'pendente',
        observacao: observacao.trim(),
        valor: precoBase,
        endereco
      });

      onSuccess(id);
      onClose();
    } catch (err: any) {
      console.error('Error creating solicitation:', err);
      setErrorMsg('Não foi possível enviar a solicitação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-orange-50/50 dark:bg-orange-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold">
              <Send size={18} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                Solicitar Atendimento
              </h2>
              <p className="text-xs text-slate-500">
                {targetProfName} • {targetServiceName}
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

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2">
              <AlertCircle size={16} /> {errorMsg}
            </div>
          )}

          {/* Service Banner */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                Valor Base Estimado
              </span>
              <div className="text-lg font-black text-slate-900 dark:text-white">
                R$ {precoBase.toFixed(2)}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck size={16} /> Garantia Resolva Já 90 Dias
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Descreva sua Necessidade / Problema *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Ex: Torneira da cozinha está com vazamento constante na base e precisa de reparo ou troca de vedação..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Data Preferencial
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={dataAgendamento}
                  onChange={(e) => setDataAgendamento(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Horário Sugerido
              </label>
              <select
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-orange-500"
              >
                <option value="09:00">Manhã - 09:00</option>
                <option value="11:00">Manhã - 11:00</option>
                <option value="14:00">Tarde - 14:00</option>
                <option value="16:00">Tarde - 16:00</option>
                <option value="18:30">Noite - 18:30</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Endereço do Atendimento
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-3.5 text-slate-400" />
              <input
                type="text"
                required
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Observações / Instruções de Acesso (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Interfone 42, deixar nome na portaria, possui cachorro dócil..."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Gravando Solicitação no Firebase...</span>
              ) : (
                <>
                  <Send size={18} />
                  <span>Confirmar e Enviar Chamado</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
