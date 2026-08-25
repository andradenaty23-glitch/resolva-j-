import React, { useState } from 'react';
import {
  X,
  Shield,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Wrench,
  HelpCircle,
  ChevronRight,
  PhoneCall,
  Search,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GuaranteeModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName?: string;
}

export const GuaranteeModal: React.FC<GuaranteeModalProps> = ({
  isOpen,
  onClose,
  clientName
}) => {
  const [activeTab, setActiveTab] = useState<'cobertura' | 'acionar' | 'consultar'>('cobertura');
  const [claimSent, setClaimSent] = useState(false);
  const [claimProtocol, setClaimProtocol] = useState('');

  // Form states for acionar
  const [serviceDescription, setServiceDescription] = useState('');
  const [problemReason, setProblemReason] = useState('persistencia');
  const [urgency, setUrgency] = useState<'normal' | 'alta' | 'urgente'>('alta');
  const [contactPhone, setContactPhone] = useState('');

  // Search certificate state
  const [searchCode, setSearchCode] = useState('');
  const [searchResult, setSearchResult] = useState<{
    found: boolean;
    data?: {
      code: string;
      service: string;
      status: string;
      daysRemaining: number;
      coverageAmount: string;
    };
  } | null>(null);

  if (!isOpen) return null;

  const handleSendClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceDescription.trim()) return;

    const protocol = `GAR-${Math.floor(100000 + Math.random() * 900000)}`;
    setClaimProtocol(protocol);
    setClaimSent(true);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }
  };

  const handleSearchWarranty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    // Simulate search logic
    if (searchCode.toUpperCase().includes('RJ') || searchCode.length >= 4) {
      setSearchResult({
        found: true,
        data: {
          code: searchCode.toUpperCase(),
          service: 'Reparo Hidráulico & Vedação',
          status: 'Garantia Ativa',
          daysRemaining: 74,
          coverageAmount: 'R$ 5.000,00'
        }
      });
    } else {
      setSearchResult({
        found: false
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-xl w-full shadow-2xl flex flex-col gap-4 border border-[#e4e4e7] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa] flex items-center justify-center shadow-2xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#18181b]">
                  Garantia Resolva Já Protege
                </h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-200">
                  90 Dias
                </span>
              </div>
              <p className="text-xs text-[#71717a]">
                Proteção com cobertura de até R$ 5.000 em todos os serviços
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

        {/* Tab Navigation */}
        <div className="flex items-center bg-[#f4f4f5] p-1 rounded-2xl border border-[#e4e4e7] text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('cobertura')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'cobertura'
                ? 'bg-[#18181b] text-white shadow-2xs'
                : 'text-[#52525b] hover:bg-white'
            }`}
          >
            Como Funciona
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('acionar')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'acionar'
                ? 'bg-[#ea580c] text-white shadow-2xs'
                : 'text-[#52525b] hover:bg-white'
            }`}
          >
            Acionar Garantia
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('consultar')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'consultar'
                ? 'bg-[#18181b] text-white shadow-2xs'
                : 'text-[#52525b] hover:bg-white'
            }`}
          >
            Consultar Certificado
          </button>
        </div>

        {/* TAB 1: COBERTURA E COMO FUNCIONA */}
        {activeTab === 'cobertura' && (
          <div className="space-y-4 text-xs text-[#52525b]">
            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3.5 rounded-2xl bg-[#fafafa] border border-[#e4e4e7] flex flex-col gap-1.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Shield className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-[#18181b]">90 Dias Cobertos</h4>
                <p className="text-[11px] text-[#71717a]">
                  Garantia legal e contratual em qualquer mão de obra intermediada.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#fafafa] border border-[#e4e4e7] flex flex-col gap-1.5">
                <div className="w-8 h-8 rounded-xl bg-[#fff7ed] text-[#ea580c] flex items-center justify-center font-bold">
                  <Wrench className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-[#18181b]">Refação Grátis</h4>
                <p className="text-[11px] text-[#71717a]">
                  Se o reparo falhar, enviamos outro técnico perito sem custo.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#fafafa] border border-[#e4e4e7] flex flex-col gap-1.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-[#18181b]">Até R$ 5.000</h4>
                <p className="text-[11px] text-[#71717a]">
                  Fundo de proteção patrimonial contra danos acidentais ao imóvel.
                </p>
              </div>
            </div>

            {/* Step by step */}
            <div className="p-4 rounded-2xl bg-[#fafafa] border border-[#e4e4e7] space-y-3">
              <h4 className="font-bold text-sm text-[#18181b]">Etapas de Acionamento da Garantia</h4>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#18181b] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-[#18181b]">Abra o chamado na aba "Acionar Garantia"</p>
                    <p className="text-[11px] text-[#71717a]">Descreva o que ocorreu e informe fotos ou detalhes do serviço.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#18181b] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-[#18181b]">Análise da Engenharia Residencial (até 2h)</p>
                    <p className="text-[11px] text-[#71717a]">Nossa equipe técnica valida os dados e notifica o responsável.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#18181b] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-bold text-[#18181b]">Visita de Retorno ou Reembolso Total</p>
                    <p className="text-[11px] text-[#71717a]">O profissional retorna com prioridade ou realizamos o estorno do valor.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-emerald-900">
                  Custódia de pagamento: o prestador só recebe após a sua confirmação.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('acionar')}
              className="w-full py-3 rounded-full bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold transition-all shadow-xs cursor-pointer text-center flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" /> Solicitar Atendimento em Garantia
            </button>
          </div>
        )}

        {/* TAB 2: ACIONAR GARANTIA */}
        {activeTab === 'acionar' && (
          <div>
            {claimSent ? (
              <div className="py-6 text-center space-y-4 animate-scaleUp">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-300">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#18181b]">
                    Chamado de Garantia Aberto com Sucesso!
                  </h4>
                  <p className="text-xs text-[#71717a] mt-1">
                    Protocolo oficial registrado sob prioridade de atendimento:
                  </p>
                  <div className="inline-block mt-2 font-mono font-bold text-sm bg-[#fafafa] px-4 py-2 rounded-xl border border-[#e4e4e7] text-[#ea580c]">
                    {claimProtocol}
                  </div>
                </div>
                <p className="text-xs text-[#52525b] max-w-md mx-auto">
                  Um engenheiro residencial do Resolva Já entrará em contato via WhatsApp e telefone em até 2 horas úteis para agendar a visita de correção sem qualquer custo.
                </p>
                <div className="flex gap-2 justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setClaimSent(false);
                      onClose();
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#18181b] hover:bg-zinc-800 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Concluir
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendClaim} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-[#18181b] block mb-1">
                    Qual foi o motivo da inconformidade?
                  </label>
                  <select
                    value={problemReason}
                    onChange={(e) => setProblemReason(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden bg-white"
                  >
                    <option value="persistencia">O problema inicial retornou ou continua</option>
                    <option value="vazamento">Vazamento ou gotejamento após instalação</option>
                    <option value="eletrica">Disjuntor desarmando ou faísca</option>
                    <option value="dano">Dano acidental a outro componente da residência</option>
                    <option value="outro">Outro motivo</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#18181b] block mb-1">
                    Descreva o ocorrido em detalhes:
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={serviceDescription}
                    onChange={(e) => setServiceDescription(e.target.value)}
                    placeholder="Ex: O técnico fez o reparo na torneira ontem, porém hoje pela manhã voltou a pingar água pela base..."
                    className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#18181b] block mb-1">
                      Nível de Urgência
                    </label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden bg-white"
                    >
                      <option value="normal">Normal (Até 24h)</option>
                      <option value="alta">Alta (Mesmo dia)</option>
                      <option value="urgente">Urgente (Imediato)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-[#18181b] block mb-1">
                      Telefone para contato / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#fff7ed] border border-[#fed7aa] text-[11px] text-[#ea580c] flex items-center gap-2 font-medium">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>
                    A garantia de 90 dias cobre 100% dos custos de mão de obra e peças de reposição defeituosas.
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('cobertura')}
                    className="flex-1 py-2.5 rounded-full border border-[#e4e4e7] text-xs font-bold text-[#52525b] hover:bg-[#fafafa] cursor-pointer"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-full bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" /> Registrar Acionamento
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: CONSULTAR CERTIFICADO */}
        {activeTab === 'consultar' && (
          <div className="space-y-4 text-xs">
            <form onSubmit={handleSearchWarranty} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  placeholder="Digite o código da OS (Ex: RJ-2026)"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden uppercase font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#18181b] hover:bg-zinc-800 text-white text-xs font-bold cursor-pointer"
              >
                Buscar
              </button>
            </form>

            {searchResult && (
              <div>
                {searchResult.found && searchResult.data ? (
                  <div className="p-4 rounded-2xl bg-[#fafafa] border border-emerald-200 space-y-2.5 animate-fadeIn">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-xs text-[#ea580c]">
                        {searchResult.data.code}
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {searchResult.data.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-[#18181b]">
                      {searchResult.data.service}
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#e4e4e7]">
                      <div>
                        <span className="text-[#71717a] block text-[10px]">DIAS RESTANTES</span>
                        <span className="font-bold text-[#18181b]">{searchResult.data.daysRemaining} dias</span>
                      </div>
                      <div>
                        <span className="text-[#71717a] block text-[10px]">COBERTURA MÁXIMA</span>
                        <span className="font-bold text-emerald-700">{searchResult.data.coverageAmount}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl border border-dashed border-[#e4e4e7] text-center text-xs text-[#71717a]">
                    Nenhum certificado encontrado com este código. Verifique o número da OS no seu histórico de faturas e recibos.
                  </div>
                )}
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-[#fafafa] border border-[#e4e4e7] text-xs text-[#52525b] space-y-1">
              <p className="font-bold text-[#18181b]">Onde encontro o código de garantia?</p>
              <p className="text-[11px] text-[#71717a]">
                O código de garantia de 90 dias é emitido automaticamente em toda OS concluída na aba "Pagamentos & Faturas".
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
