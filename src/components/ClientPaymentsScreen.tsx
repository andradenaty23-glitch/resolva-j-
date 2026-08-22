import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  Plus,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  Copy,
  Check,
  Lock,
  Wallet,
  Sparkles,
  ChevronRight,
  Info,
  Calendar,
  AlertCircle,
  X,
  Download,
  Building2,
  Percent,
  Receipt
} from 'lucide-react';
import { ClientProfile, PaymentMethod, TransactionRecord } from '../types';
import { SafeAvatar } from './SafeAvatar';

interface ClientPaymentsScreenProps {
  client: ClientProfile;
  paymentMethods: PaymentMethod[];
  transactions: TransactionRecord[];
  onAddPaymentMethod: (method: PaymentMethod) => void;
  onSetDefaultPaymentMethod: (id: string) => void;
  onDeletePaymentMethod: (id: string) => void;
  onOpenUpgradePlan: () => void;
}

export const ClientPaymentsScreen: React.FC<ClientPaymentsScreenProps> = ({
  client,
  paymentMethods,
  transactions,
  onAddPaymentMethod,
  onSetDefaultPaymentMethod,
  onDeletePaymentMethod,
  onOpenUpgradePlan
}) => {
  const [selectedTxFilter, setSelectedTxFilter] = useState<'todos' | 'em_custodia' | 'pago'>('todos');
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<TransactionRecord | null>(null);

  // New Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardBrand, setCardBrand] = useState<'mastercard' | 'visa' | 'elo'>('mastercard');
  const [cardNickname, setCardNickname] = useState('');
  const [isCopiedPix, setIsCopiedPix] = useState(false);

  // Simulator State
  const [simulatedAmount, setSimulatedAmount] = useState<number>(350);

  const filteredTransactions = transactions.filter((tx) => {
    if (selectedTxFilter === 'todos') return true;
    if (selectedTxFilter === 'em_custodia') return tx.status === 'em_custodia';
    if (selectedTxFilter === 'pago') return tx.status === 'pago';
    return true;
  });

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardHolder || !cardExpiry) return;

    const newMethod: PaymentMethod = {
      id: `pm-${Date.now()}`,
      type: 'credit_card',
      brand: cardBrand,
      last4: cardNumber.replace(/\s+/g, '').slice(-4) || '1234',
      holderName: cardHolder.toUpperCase(),
      expiry: cardExpiry,
      isDefault: paymentMethods.length === 0,
      nickname: cardNickname || `${cardBrand.toUpperCase()} Principal`
    };

    onAddPaymentMethod(newMethod);
    setIsAddCardModalOpen(false);
    // Reset
    setCardNumber('');
    setCardHolder('');
    setCardExpiry('');
    setCardCvv('');
    setCardNickname('');
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText('00020126580014br.gov.bcb.pix0136resolvaja-pagamentos-custodia-20265204000053039865405120.005802BR5925RESOLVA JA TECNOLOGIA SA6009SAO PAULO62070503***6304E8A2');
    setIsCopiedPix(true);
    setTimeout(() => setIsCopiedPix(false), 2000);
  };

  // Card formatting
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
    if (raw.startsWith('4')) setCardBrand('visa');
    else if (raw.startsWith('5') || raw.startsWith('2')) setCardBrand('mastercard');
    else if (raw.startsWith('6')) setCardBrand('elo');
  };

  const handleExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2, 4)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto pb-16 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <span className="text-[10px] font-extrabold text-[#ea580c] bg-[#fff7ed] px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#fed7aa]">
            Painel do Cliente
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#18181b] tracking-tight mt-1">
            Opções de Pagamento & Carteira
          </h1>
          <p className="text-xs text-[#71717a]">
            Gerencie cartões, Pix, histórico de faturas e custódia protegida
          </p>
        </div>

        <button
          onClick={() => setIsAddCardModalOpen(true)}
          id="btn-add-novo-cartao-top"
          className="bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold px-4 py-2.5 rounded-full transition-all shadow-sm flex items-center gap-1.5 active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Cartão</span>
        </button>
      </div>

      {/* Wallet Balance & Protection Card */}
      <div className="bg-gradient-to-br from-[#18181b] via-[#27272a] to-[#3f3f46] text-white rounded-3xl p-5 sm:p-6 shadow-md border border-[#52525b]/40 relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ea580c]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col gap-5">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xs text-amber-200">
                <Wallet className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-zinc-100 tracking-wide">
                Carteira Digital Resolva Já
              </span>
            </div>

            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Proteção Caução Ativa
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <span className="text-[11px] text-zinc-300 block">Saldo em Conta</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                R$ {client.walletBalance?.toFixed(2) || '120.00'}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-zinc-300 block flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Cashback Acumulado
              </span>
              <span className="text-xl sm:text-2xl font-bold text-amber-400 tracking-tight">
                R$ {client.cashbackBalance?.toFixed(2) || '28.50'}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 flex flex-col justify-end">
              <button
                onClick={() => setIsPixModalOpen(true)}
                id="btn-pagar-pix-direto"
                className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-98 cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-white" />
                <span>Pagar com Pix (5% OFF)</span>
              </button>
            </div>
          </div>

          {/* Custody Guarantee Explanation */}
          <div className="pt-3 border-t border-white/10 flex items-center gap-2.5 text-[11px] text-zinc-200">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Garantia Caução:</strong> O valor do serviço só é repassado ao prestador após sua conferência e aprovação com garantia de 90 dias.
            </span>
          </div>
        </div>
      </div>

      {/* Payment Methods Section */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#18181b] flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#ea580c]" />
            Formas de Pagamento Cadastradas
          </h2>
          <span className="text-xs font-bold text-[#71717a]">
            {paymentMethods.length} método(s)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {paymentMethods.map((method) => {
            const isCard = method.type === 'credit_card' || method.type === 'debit_card';

            return (
              <div
                key={method.id}
                className={`p-4 rounded-2xl border transition-all relative flex flex-col justify-between gap-3 ${
                  method.isDefault
                    ? 'bg-white border-[#ea580c] shadow-xs ring-2 ring-[#ea580c]/10'
                    : 'bg-white border-[#e4e4e7] shadow-2xs hover:border-[#cbd5e1]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    {/* Brand Pill */}
                    <div className="w-10 h-7 rounded-lg bg-[#18181b] text-white flex items-center justify-center font-black text-[10px] tracking-wider uppercase shadow-2xs">
                      {method.brand || 'CARD'}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-[#18181b]">
                        {method.nickname || `Cartão ${method.brand?.toUpperCase()}`}
                      </h4>
                      <p className="text-xs text-[#71717a] font-mono">
                        •••• •••• •••• {method.last4}
                      </p>
                    </div>
                  </div>

                  {method.isDefault ? (
                    <span className="text-[10px] bg-[#fff7ed] text-[#ea580c] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#fed7aa]">
                      <CheckCircle2 className="w-3 h-3" /> Padrão
                    </span>
                  ) : (
                    <button
                      onClick={() => onSetDefaultPaymentMethod(method.id)}
                      className="text-[11px] text-[#52525b] hover:text-[#ea580c] font-medium hover:underline cursor-pointer"
                    >
                      Tornar Padrão
                    </button>
                  )}
                </div>

                <div className="flex justify-between items-center text-xs text-[#71717a] pt-2 border-t border-[#e4e4e7]">
                  <span>Titular: {method.holderName || client.name.toUpperCase()}</span>
                  <span>Val: {method.expiry || '12/28'}</span>
                </div>

                {paymentMethods.length > 1 && (
                  <button
                    onClick={() => onDeletePaymentMethod(method.id)}
                    className="text-[10px] text-rose-500 hover:text-rose-700 self-end font-semibold cursor-pointer"
                  >
                    Remover
                  </button>
                )}
              </div>
            );
          })}

          {/* Pix Quick Card Option */}
          <div
            onClick={() => setIsPixModalOpen(true)}
            className="p-4 rounded-2xl border border-dashed border-[#e4e4e7] hover:border-[#ea580c] bg-[#fafafa] flex items-center justify-between gap-3 cursor-pointer group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa] flex items-center justify-center group-hover:scale-105 transition-transform">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#18181b] group-hover:text-[#ea580c] transition-colors">
                  Pix com Aprovação Imediata
                </h4>
                <p className="text-xs text-[#52525b]">
                  5% de cashback direto na sua carteira
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#71717a] group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Simulator: Parcelamento & Vantagens */}
      <div className="bg-white rounded-3xl p-5 border border-[#e4e4e7] shadow-xs flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 w-fit mb-1 border border-emerald-200">
              <Percent className="w-3 h-3" /> Simulação Flexível
            </span>
            <h3 className="text-base font-bold text-[#18181b]">
              Simulador de Parcelamento em Serviços
            </h3>
            <p className="text-xs text-[#71717a]">
              Divida reparos em até 12x no cartão com total segurança
            </p>
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[120, 250, 350, 600, 1200].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setSimulatedAmount(amt)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                simulatedAmount === amt
                  ? 'bg-[#18181b] text-white shadow-xs'
                  : 'bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7] hover:bg-[#e4e4e7]'
              }`}
            >
              R$ {amt}
            </button>
          ))}
        </div>

        {/* Breakdown table */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="p-3 rounded-xl bg-[#fff7ed]/80 border border-[#fed7aa] flex flex-col">
            <span className="text-[11px] font-bold text-[#ea580c]">Pix à Vista</span>
            <span className="text-lg font-black text-[#18181b] mt-0.5">
              R$ {(simulatedAmount * 0.95).toFixed(2)}
            </span>
            <span className="text-[10px] font-bold text-emerald-700 mt-1">
              + R$ {(simulatedAmount * 0.05).toFixed(2)} Cashback
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-[#e4e4e7] flex flex-col">
            <span className="text-[11px] font-bold text-[#52525b]">Cartão em 3x</span>
            <span className="text-lg font-black text-[#18181b] mt-0.5">
              3x R$ {(simulatedAmount / 3).toFixed(2)}
            </span>
            <span className="text-[10px] font-bold text-emerald-700 mt-1">
              Sem juros
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-[#e4e4e7] flex flex-col">
            <span className="text-[11px] font-bold text-[#52525b]">Cartão em 6x</span>
            <span className="text-lg font-black text-[#18181b] mt-0.5">
              6x R$ {(simulatedAmount / 6).toFixed(2)}
            </span>
            <span className="text-[10px] font-bold text-emerald-700 mt-1">
              Sem juros no Resolva Já
            </span>
          </div>
        </div>
      </div>

      {/* Transaction History & Invoices */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-lg font-bold text-[#18181b] flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#ea580c]" />
              Histórico & Comprovantes de Serviços
            </h3>
            <p className="text-xs text-[#71717a]">
              Acesse recibos digitais, faturas e certificados de garantia
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center bg-[#f4f4f5] p-1 rounded-full border border-[#e4e4e7]">
            <button
              onClick={() => setSelectedTxFilter('todos')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedTxFilter === 'todos'
                  ? 'bg-[#18181b] text-white shadow-2xs'
                  : 'text-[#52525b] hover:bg-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedTxFilter('em_custodia')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedTxFilter === 'em_custodia'
                  ? 'bg-[#18181b] text-white shadow-2xs'
                  : 'text-[#52525b] hover:bg-white'
              }`}
            >
              Em Custódia
            </button>
            <button
              onClick={() => setSelectedTxFilter('pago')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedTxFilter === 'pago'
                  ? 'bg-[#18181b] text-white shadow-2xs'
                  : 'text-[#52525b] hover:bg-white'
              }`}
            >
              Concluídos
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {filteredTransactions.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-dashed border-[#e4e4e7] flex flex-col items-center justify-center text-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-[#fafafa] border border-[#e4e4e7] flex items-center justify-center text-[#71717a]">
                <Receipt className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#18181b]">Nenhum registro encontrado</h4>
              <p className="text-xs text-[#71717a] max-w-xs">
                Seus comprovantes, recibos e ordens de serviço aparecerão aqui assim que realizar um atendimento.
              </p>
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e4e4e7] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#ea580c] transition-all"
              >
                <div className="flex items-start gap-3.5">
                  <SafeAvatar
                    src={tx.providerAvatar}
                    name={tx.providerName}
                    size="sm"
                    className="w-12 h-12 rounded-xl shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#18181b]">
                        {tx.serviceTitle}
                      </h4>
                    </div>
                    <p className="text-xs text-[#52525b] mt-0.5">
                      Profissional: <strong>{tx.providerName}</strong> ({tx.providerCategory})
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-[#71717a] mt-1">
                      <span>{tx.date}</span>
                      <span>•</span>
                      <span>{tx.paymentMethodDetails || tx.paymentMethodType}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-[#e4e4e7]">
                  <div className="text-left sm:text-right">
                    <span className="text-base font-extrabold text-[#18181b] block">
                      R$ {tx.amount.toFixed(2)}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-block uppercase ${
                        tx.status === 'em_custodia'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {tx.status === 'em_custodia' ? 'Retido em Custódia' : 'Pago com Garantia'}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedReceipt(tx)}
                    className="text-xs font-bold text-[#ea580c] hover:text-[#c2410c] flex items-center gap-1 hover:underline sm:mt-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Ver Recibo</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Subscription Plan Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#e4e4e7] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa] flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-[#18181b]">
                Assinatura {client.plan}
              </h4>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                Ativo
              </span>
            </div>
            <p className="text-xs text-[#52525b]">
              R$ 29,90/mês • 1 Visita diagnóstica grátis/mês + 20% off na mão de obra
            </p>
          </div>
        </div>

        <button
          onClick={onOpenUpgradePlan}
          className="text-xs font-bold text-[#ea580c] bg-[#fff7ed] hover:bg-[#ea580c] hover:text-white px-4 py-2 rounded-full transition-all cursor-pointer shrink-0 border border-[#fed7aa]"
        >
          Gerenciar Plano
        </button>
      </div>

      {/* ================= MODAL: ADICIONAR NOVO CARTÃO ================= */}
      {isAddCardModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 border border-[#e4e4e7] max-h-[90vh] overflow-y-auto animate-scaleUp">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-extrabold text-[#ea580c] bg-[#fff7ed] px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#fed7aa]">
                  Criptografia 256-bit
                </span>
                <h3 className="text-xl font-bold text-[#18181b] mt-1">
                  Adicionar Novo Cartão
                </h3>
              </div>
              <button
                onClick={() => setIsAddCardModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Realistic Interactive Card Preview */}
            <div className="bg-gradient-to-tr from-[#18181b] via-[#27272a] to-[#3f3f46] text-white p-5 rounded-2xl shadow-lg flex flex-col justify-between h-44 relative overflow-hidden border border-[#52525b]">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-amber-300 tracking-wider">
                  RESOLVA JÁ PAY
                </span>
                <span className="font-black text-sm uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-md">
                  {cardBrand.toUpperCase()}
                </span>
              </div>

              <div className="font-mono text-lg tracking-widest text-center my-auto">
                {cardNumber || '•••• •••• •••• ••••'}
              </div>

              <div className="flex justify-between items-end text-xs">
                <div>
                  <span className="text-[9px] text-zinc-300 block uppercase">Titular</span>
                  <span className="font-bold tracking-wide truncate max-w-[180px] block">
                    {cardHolder || 'NOME DO TITULAR'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-zinc-300 block uppercase">Validade</span>
                  <span className="font-mono font-bold">{cardExpiry || 'MM/AA'}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleCreateCard} className="flex flex-col gap-3.5">
              <div>
                <label className="text-xs font-bold text-[#18181b] block mb-1">
                  Número do Cartão
                </label>
                <input
                  type="text"
                  required
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-sm font-mono focus:border-[#ea580c] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#18181b] block mb-1">
                  Nome impresso no Cartão
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: NATALIA ANDRADE"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs uppercase focus:border-[#ea580c] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#18181b] block mb-1">
                    Validade (MM/AA)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="12/28"
                    value={cardExpiry}
                    onChange={(e) => handleExpiryChange(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs font-mono focus:border-[#ea580c] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#18181b] block mb-1">
                    CVV / Código
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    placeholder="123"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs font-mono focus:border-[#ea580c] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#18181b] block mb-1">
                  Apelido do Cartão (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Cartão Pessoal Nubank"
                  value={cardNickname}
                  onChange={(e) => setCardNickname(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#e4e4e7] text-xs focus:border-[#ea580c] focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                id="btn-salvar-cartao"
                className="w-full py-3.5 rounded-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs shadow-md transition-all mt-2 cursor-pointer"
              >
                Salvar Cartão com Segurança
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: PAGAR COM PIX ================= */}
      {isPixModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center gap-4 border border-[#e4e4e7] animate-scaleUp">
            <div className="flex justify-between items-center w-full">
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase border border-emerald-200">
                5% Cashback Ativo
              </span>
              <button
                onClick={() => setIsPixModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-48 h-48 bg-white p-3 rounded-2xl border-2 border-[#ea580c] shadow-sm flex items-center justify-center relative">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=ResolvaJaPixPaymentCustody120"
                alt="QR Code Pix"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#18181b]">
                Escaneie o QR Code Pix
              </h3>
              <p className="text-xs text-[#52525b] mt-1">
                Abra o app do seu banco e selecione "Pagar com Pix". O valor fica retido com caução segura até a finalização do serviço.
              </p>
            </div>

            <button
              onClick={handleCopyPix}
              className="w-full py-3 rounded-xl bg-[#fff7ed] hover:bg-[#ea580c] hover:text-white text-[#ea580c] font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#fed7aa]"
            >
              {isCopiedPix ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Código Pix Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Código Pix (Copia e Cola)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: COMPROVANTE DIGITAL ================= */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 border border-[#e4e4e7] animate-scaleUp">
            <div className="flex justify-between items-center border-b border-[#e4e4e7] pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#ea580c]" />
                <h3 className="text-base font-bold text-[#18181b]">
                  Comprovante de Pagamento
                </h3>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Content */}
            <div className="bg-[#fafafa] p-4 rounded-2xl border border-[#e4e4e7] flex flex-col gap-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#71717a]">Código do Recibo:</span>
                <span className="font-mono font-bold text-[#18181b]">{selectedReceipt.invoiceCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717a]">Serviço:</span>
                <span className="font-bold text-[#18181b] text-right">{selectedReceipt.serviceTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717a]">Prestador:</span>
                <span className="font-bold text-[#18181b]">{selectedReceipt.providerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717a]">Data e Hora:</span>
                <span className="font-semibold text-[#52525b]">{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717a]">Forma de Pagamento:</span>
                <span className="font-semibold text-[#52525b]">{selectedReceipt.paymentMethodDetails || selectedReceipt.paymentMethodType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717a]">Garantia Resolva Já:</span>
                <span className="font-bold text-emerald-700">{selectedReceipt.warrantyUntil}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#e4e4e7]">
                <span className="text-sm font-bold text-[#18181b]">Valor Total:</span>
                <span className="text-xl font-black text-[#ea580c]">
                  R$ {selectedReceipt.amount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  alert('Comprovante baixado com sucesso no formato PDF.');
                  setSelectedReceipt(null);
                }}
                className="flex-1 py-3 rounded-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Baixar Recibo (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
