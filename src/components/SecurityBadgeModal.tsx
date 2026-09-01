import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  CheckCircle2,
  Lock,
  CreditCard,
  Award,
  FileCheck,
  AlertTriangle,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { getSecurityPillars, validateCPF, validateCNPJ } from '../utils/security';

interface SecurityBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  professionalName?: string;
  professionalTrustIndex?: number;
  securityPin?: string;
}

export const SecurityBadgeModal: React.FC<SecurityBadgeModalProps> = ({
  isOpen,
  onClose,
  professionalName,
  professionalTrustIndex = 98,
  securityPin
}) => {
  const [activeTab, setActiveTab] = useState<'pilares' | 'dicas' | 'validador'>('pilares');
  const [testDoc, setTestDoc] = useState('');
  const [testResult, setTestResult] = useState<{ valid: boolean; formatted: string; message: string } | null>(null);

  if (!isOpen) return null;

  const pillars = getSecurityPillars();

  const handleTestDoc = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = testDoc.replace(/\D/g, '');
    if (clean.length === 11) {
      setTestResult(validateCPF(testDoc));
    } else if (clean.length === 14) {
      setTestResult(validateCNPJ(testDoc));
    } else {
      setTestResult({
        valid: false,
        formatted: testDoc,
        message: 'Digite um CPF válido (11 dígitos) ou CNPJ (14 dígitos).'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-scaleUp">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">
                  Protocolo de Segurança & Garantia
                </h2>
                <span className="bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                  Resolva Já Seguro
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {professionalName ? `Proteção para o atendimento com ${professionalName}` : 'Conheça nossos 5 pilares de proteção integral'}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 transition cursor-pointer shadow-2xs"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-5 pt-3 gap-2 bg-slate-50/60 dark:bg-slate-900/40">
          <button
            onClick={() => setActiveTab('pilares')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'pilares'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            🛡️ 5 Pilares de Proteção
          </button>
          <button
            onClick={() => setActiveTab('dicas')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'dicas'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            🔐 Dicas Antigolpe
          </button>
          <button
            onClick={() => setActiveTab('validador')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'validador'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            ✓ Validador de Documento
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-slate-800 dark:text-slate-200">
          
          {/* TAB 1: PILARES */}
          {activeTab === 'pilares' && (
            <div className="space-y-3.5">
              
              {/* Trust Score Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between shadow-sm">
                <div>
                  <div className="text-xs uppercase tracking-wider font-bold opacity-90">Índice de Confiança Médio</div>
                  <div className="text-2xl font-black flex items-center gap-2">
                    <span>{professionalTrustIndex}/100</span>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-md font-semibold">Nível Ouro</span>
                  </div>
                  <p className="text-[11px] opacity-90 mt-0.5">
                    Técnicos aprovados em checagens cadastrais, criminais e avaliações reais.
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-xs shrink-0">
                  <Award className="w-7 h-7 text-white" />
                </div>
              </div>

              {/* Security PIN Highlight if exists */}
              {securityPin && (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                        Seu PIN de Segurança do Atendimento
                      </span>
                      <div className="text-xl font-mono font-black text-slate-900 dark:text-white tracking-widest">
                        {securityPin}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-slate-500 font-medium max-w-[150px]">
                    Informe ao prestador somente na sua porta.
                  </div>
                </div>
              )}

              {/* List of Pillars */}
              <div className="space-y-2.5">
                {pillars.map((p, idx) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-start gap-3 hover:border-emerald-500/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                          {p.title}
                        </h4>
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 shrink-0">
                          {p.badgeText}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {p.fullDesc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: DICAS ANTIGOLPE */}
          {activeTab === 'dicas' && (
            <div className="space-y-3.5">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2 font-medium">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>Mantenha sua transação e comunicação sempre protegidas dentro do app.</span>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 space-y-1">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    1. Nunca pague por fora ou adiantado
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
                    A custódia do Resolva Já protege seu dinheiro até você aprovar o serviço. Pagamentos feitos em dinheiro direto ou PIX externo perdem a garantia de 90 dias da plataforma.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 space-y-1">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    2. Exija a validação do PIN presencial
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
                    Confira se o prestador que tocou sua campainha corresponde à foto e ao nome indicados no chamado, e informe seu PIN de 4 dígitos para iniciar o serviço.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 space-y-1">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    3. Formalize orçamentos e peças adicionais no app
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
                    Se durante o reparo surgir a necessidade de novas peças ou serviços extras, solicite que o técnico atualize a proposta pelo sistema para manter a garantia.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VALIDADOR DE DOCUMENTOS */}
          {activeTab === 'validador' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600 dark:text-slate-400">
                Nosso motor de segurança audita matematicamente os dígitos verificadores de CPFs e CNPJs contra fraudes e cadastros forjados.
              </div>

              <form onSubmit={handleTestDoc} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Digite um CPF ou CNPJ para testar a checagem:
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 123.456.789-00 ou 12.345.678/0001-90"
                    value={testDoc}
                    onChange={(e) => {
                      setTestDoc(e.target.value);
                      setTestResult(null);
                    }}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <FileCheck size={16} /> Executar Verificação Algorítmica
                </button>
              </form>

              {testResult && (
                <div
                  className={`p-4 rounded-2xl border text-xs font-medium flex items-start gap-3 ${
                    testResult.valid
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200'
                  }`}
                >
                  {testResult.valid ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold text-sm">
                      {testResult.valid ? 'Documento Válido & Autêntico' : 'Documento Inválido'}
                    </div>
                    <div className="mt-0.5 font-mono text-[11px] opacity-90">
                      {testResult.formatted}
                    </div>
                    <p className="mt-1 text-xs opacity-90">{testResult.message}</p>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>Cobertura de até R$ 5.000 em caso de danos</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer transition text-xs"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
