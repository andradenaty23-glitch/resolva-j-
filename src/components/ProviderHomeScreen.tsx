import React, { useState } from 'react';
import {
  Radar,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Star,
  Shield,
  Phone,
  DollarSign,
  Radio,
  Eye,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Calendar,
  Layers,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Briefcase,
  Inbox
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { ProviderProfile, ProviderJobLead, Appointment } from '../types';
import {
  PROVIDER_EARNINGS_HISTORY,
  PROVIDER_CATEGORY_DISTRIBUTION,
  PROVIDER_WEEKLY_DEMAND,
  PROVIDER_HOURLY_PEAK
} from '../data/mockData';
import { SafeAvatar } from './SafeAvatar';

interface ProviderHomeScreenProps {
  provider: ProviderProfile;
  leads: ProviderJobLead[];
  appointments?: Appointment[];
  onSendQuote: (leadId: string, value: number) => void;
  onToggleAvailability: () => void;
  onViewClientPhoto?: (imageUrl: string) => void;
}

export const ProviderHomeScreen: React.FC<ProviderHomeScreenProps> = ({
  provider,
  leads,
  appointments = [],
  onSendQuote,
  onToggleAvailability,
  onViewClientPhoto
}) => {
  const [biddingLeadId, setBiddingLeadId] = useState<string | null>(null);
  const [customPrice, setCustomPrice] = useState<number>(provider.laborBaseRate || 100);
  const [activeChartTab, setActiveChartTab] = useState<'faturamento' | 'conversao' | 'categorias' | 'horarios'>('faturamento');
  const [chartTimeframe, setChartTimeframe] = useState<'7d' | '30d' | '3m'>('30d');

  const handleSendCustomQuote = (leadId: string) => {
    onSendQuote(leadId, customPrice);
    setBiddingLeadId(null);
  };

  const sentCount = leads.filter((l) => l.status === 'orcamento_enviado').length;
  const openCount = leads.filter((l) => l.status === 'aberto').length;
  const scheduledCount = appointments.length;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-16 animate-fadeIn overflow-hidden">
      {/* ================= 1. PRO TOP BANNER ================= */}
      <div className="bg-[#18181b] text-white rounded-2xl p-6 sm:p-7 border border-[#27272a] shadow-lg relative overflow-hidden">
        {/* Subtle decorative mesh gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#ea580c]/20 via-[#ea580c]/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <SafeAvatar
                src={provider.avatar}
                alt={provider.name}
                name={provider.name}
                size="xl"
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl border-2 border-emerald-400/80 shadow-md"
              />
              <button
                type="button"
                onClick={onToggleAvailability}
                className={`btn-tactile absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full text-[11px] font-black flex items-center gap-1 shadow-md cursor-pointer border ${
                  provider.availability === 'Disponível Agora'
                    ? 'bg-emerald-500 text-white border-emerald-400'
                    : 'bg-zinc-700 text-zinc-300 border-zinc-600'
                }`}
                title="Clique para alternar disponibilidade"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                {provider.availability === 'Disponível Agora' ? 'ONLINE' : 'OFFLINE'}
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold px-3 py-0.5 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Profissional Verificado Resolva Já
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-display">
                {provider.name || 'Prestador de Serviços'}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300">
                {provider.category} • Raio de atendimento: {provider.operatingRadiusKm || 15} km
              </p>
            </div>
          </div>

          {/* Right Trust Score Badge */}
          <div className="bg-[#27272a]/90 border border-[#3f3f46] rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-inner self-stretch md:self-auto justify-between md:justify-start">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase block">
                Seu Trust Score
              </span>
              <span className="text-sm sm:text-base font-bold text-emerald-400">
                {provider.completedJobsCount > 0 ? 'Nível Excelente' : 'Novo Credenciado'}
              </span>
              <span className="text-xs text-zinc-400 block mt-0.5">
                {provider.completedJobsCount} serviços concluídos
              </span>
            </div>

            <div className="w-13 h-13 rounded-xl bg-emerald-500 text-[#18181b] flex items-center justify-center font-black text-xl shadow-md font-display">
              {provider.trustIndex || 100}
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. METRIC STATS ROW ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Chamados na sua área */}
        <div className="saas-card p-4 sm:p-5 flex flex-col justify-between gap-2">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-[#71717a] uppercase tracking-wider">
              Chamados na área
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa] flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#18181b] font-display">
              {openCount}
            </span>
            <p className="text-xs text-[#ea580c] font-bold mt-0.5">
              {openCount === 1 ? 'Disponível para proposta' : 'Disponíveis para envio'}
            </p>
          </div>
        </div>

        {/* Propostas enviadas */}
        <div className="saas-card p-4 sm:p-5 flex flex-col justify-between gap-2">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-[#71717a] uppercase tracking-wider">
              Propostas enviadas
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#18181b] font-display">
              {sentCount}
            </span>
            <p className="text-xs text-amber-700 font-bold mt-0.5">
              Aguardando decisão
            </p>
          </div>
        </div>

        {/* Visitas Agendadas */}
        <div className="saas-card p-4 sm:p-5 flex flex-col justify-between gap-2">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-[#71717a] uppercase tracking-wider">
              Visitas agendadas
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#18181b] font-display">
              {scheduledCount}
            </span>
            <p className="text-xs text-emerald-700 font-bold mt-0.5">
              {scheduledCount === 1 ? 'Cliente confirmado' : 'Clientes confirmados'}
            </p>
          </div>
        </div>

        {/* Faturamento do Mês */}
        <div className="saas-card p-4 sm:p-5 flex flex-col justify-between gap-2">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-[#71717a] uppercase tracking-wider">
              Faturamento Mês
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-700 font-display">
              R$ {(provider.totalEarningsMonth || 0).toFixed(2)}
            </span>
            <p className="text-xs text-emerald-700 font-bold mt-0.5 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" /> Repasses via Pix
            </p>
          </div>
        </div>
      </div>

      {/* ================= 3. PAINEL DE DEMONSTRAÇÃO & DESEMPENHO ================= */}
      <div className="saas-card p-5 sm:p-6 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#e4e4e7] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa] flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#18181b] font-display">
                Painel de Desempenho Financeiro & Demandas
              </h2>
            </div>
            <p className="text-xs text-[#71717a] mt-0.5">
              Acompanhe seu faturamento, conversão de propostas e horários de maior demanda
            </p>
          </div>

          {/* Timeframe Selector */}
          {PROVIDER_EARNINGS_HISTORY.length > 0 && (
            <div className="flex items-center bg-[#f4f4f5] p-1 rounded-xl border border-[#e4e4e7]">
              <button
                onClick={() => setChartTimeframe('7d')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  chartTimeframe === '7d'
                    ? 'bg-[#18181b] text-white shadow-2xs'
                    : 'text-[#52525b] hover:bg-white'
                }`}
              >
                7 Dias
              </button>
              <button
                onClick={() => setChartTimeframe('30d')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  chartTimeframe === '30d'
                    ? 'bg-[#18181b] text-white shadow-2xs'
                    : 'text-[#52525b] hover:bg-white'
                }`}
              >
                Este Mês
              </button>
              <button
                onClick={() => setChartTimeframe('3m')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  chartTimeframe === '3m'
                    ? 'bg-[#18181b] text-white shadow-2xs'
                    : 'text-[#52525b] hover:bg-white'
                }`}
              >
                Trimestre
              </button>
            </div>
          )}
        </div>

        {/* Empty State for Charts if no prior transactions */}
        {PROVIDER_EARNINGS_HISTORY.length === 0 ? (
          <div className="bg-[#fafafa] rounded-2xl p-8 border border-dashed border-[#e4e4e7] flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#e4e4e7] flex items-center justify-center text-[#ea580c] shadow-2xs">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#18181b] font-display">Pronto para receber seus primeiros atendimentos</h4>
              <p className="text-xs text-[#71717a] max-w-md mt-1 leading-relaxed">
                Conforme você enviar propostas e concluir serviços aos clientes, seus gráficos de faturamento real, taxas de conversão e horários de pico serão computados automaticamente.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs text-[#52525b] pt-1">
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#e4e4e7] font-medium">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Repasse com Taxa Zero
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#e4e4e7] font-medium">
                <Shield className="w-3.5 h-3.5 text-[#ea580c]" /> Pagamento Garantido em Custódia
              </span>
            </div>
          </div>
        ) : (
          <div>
            {/* Chart Sub-Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none mb-4">
              <button
                onClick={() => setActiveChartTab('faturamento')}
                className={`btn-tactile px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  activeChartTab === 'faturamento'
                    ? 'bg-[#ea580c] text-white shadow-xs'
                    : 'bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7] hover:bg-[#e4e4e7]'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Faturamento & Ganhos</span>
              </button>

              <button
                onClick={() => setActiveChartTab('conversao')}
                className={`btn-tactile px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  activeChartTab === 'conversao'
                    ? 'bg-[#ea580c] text-white shadow-xs'
                    : 'bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7] hover:bg-[#e4e4e7]'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Volume & Conversão</span>
              </button>

              <button
                onClick={() => setActiveChartTab('categorias')}
                className={`btn-tactile px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  activeChartTab === 'categorias'
                    ? 'bg-[#ea580c] text-white shadow-xs'
                    : 'bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7] hover:bg-[#e4e4e7]'
                }`}
              >
                <PieChartIcon className="w-3.5 h-3.5" />
                <span>Por Especialidade</span>
              </button>

              <button
                onClick={() => setActiveChartTab('horarios')}
                className={`btn-tactile px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  activeChartTab === 'horarios'
                    ? 'bg-[#ea580c] text-white shadow-xs'
                    : 'bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7] hover:bg-[#e4e4e7]'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Horários de Pico</span>
              </button>
            </div>

            {/* Chart Canvas */}
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                {activeChartTab === 'faturamento' ? (
                  <AreaChart data={PROVIDER_EARNINGS_HISTORY}>
                    <defs>
                      <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ea580c" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#ea580c" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `R$${v}`} />
                    <Tooltip formatter={(value: any) => [`R$ ${Number(value).toFixed(2)}`, 'Ganhos']} />
                    <Area type="monotone" dataKey="earnings" stroke="#ea580c" strokeWidth={2.5} fillOpacity={1} fill="url(#colorFaturamento)" />
                  </AreaChart>
                ) : activeChartTab === 'conversao' ? (
                  <BarChart data={PROVIDER_WEEKLY_DEMAND}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="chamados" fill="#cbd5e1" radius={[6, 6, 0, 0]} name="Chamados" />
                    <Bar dataKey="propostas" fill="#ea580c" radius={[6, 6, 0, 0]} name="Propostas Aceitas" />
                  </BarChart>
                ) : activeChartTab === 'categorias' ? (
                  <PieChart>
                    <Pie
                      data={PROVIDER_CATEGORY_DISTRIBUTION}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {PROVIDER_CATEGORY_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || '#ea580c'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: any) => [`${val}%`, 'Participação']} />
                    <Legend />
                  </PieChart>
                ) : (
                  <BarChart data={PROVIDER_HOURLY_PEAK}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="demanda" fill="#ea580c" radius={[6, 6, 0, 0]} name="Volume de Chamados" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* ================= 4. SOLICITAÇÕES DE CLIENTES & AGENDA ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Client Requests */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#ea580c]" />
              <h3 className="text-base sm:text-lg font-bold text-[#18181b] font-display">
                Solicitações de Clientes para Sua Especialidade
              </h3>
            </div>
            <span className="text-xs font-semibold text-[#71717a]">
              {leads.length} {leads.length === 1 ? 'solicitação' : 'solicitações'}
            </span>
          </div>

          <div className="flex flex-col gap-3.5">
            {leads.length === 0 ? (
              <div className="saas-card p-8 border-dashed flex flex-col items-center justify-center text-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#fafafa] border border-[#e4e4e7] flex items-center justify-center text-[#71717a]">
                  <Inbox className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-[#18181b] font-display">Nenhum chamado aberto no momento</h4>
                <p className="text-xs text-[#71717a] max-w-sm leading-relaxed">
                  Assim que um cliente relatar um problema ou solicitar atendimento para {provider.category || 'sua especialidade'}, a notificação e fotos aparecerão aqui em tempo real.
                </p>
              </div>
            ) : (
              leads.map((lead) => {
                const isSent = lead.status === 'orcamento_enviado';

                return (
                  <div
                    key={lead.id}
                    className="saas-card p-5 flex flex-col gap-3.5"
                  >
                    {/* Lead Category Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#ea580c] bg-[#fff7ed] px-2.5 py-0.5 rounded-full border border-[#fed7aa]">
                        {lead.category.split('/')[0].trim().toUpperCase()}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          lead.urgency === 'alta' || lead.urgency === 'critica'
                            ? 'bg-[#fee2e2] text-[#b91c1c] border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        URGÊNCIA: {lead.urgency.toUpperCase()}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-[#18181b] font-display">
                        {lead.serviceTitle}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#52525b] mt-1 leading-relaxed">
                        {lead.description}
                      </p>
                    </div>

                    {/* Location & Time details */}
                    <div className="bg-[#fafafa] p-3.5 rounded-xl border border-[#e4e4e7] flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-[#52525b] gap-2">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <MapPin className="w-4 h-4 text-[#ea580c] shrink-0" />
                        <span>Local: {lead.room} • {lead.neighborhood}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#71717a] font-medium">
                        <Clock className="w-4 h-4" />
                        <span>{lead.createdAt}</span>
                      </div>
                    </div>

                    {/* Photo if provided */}
                    {lead.imageUrl && (
                      <div className="flex items-center gap-3">
                        <img loading="lazy" decoding="async"
                          src={lead.imageUrl}
                          alt="Foto do cliente"
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-xl object-cover border border-[#e4e4e7] cursor-pointer hover:opacity-90 transition-opacity shrink-0"
                          onClick={() => onViewClientPhoto?.(lead.imageUrl!)}
                        />
                        <div className="text-xs sm:text-sm text-[#52525b]">
                          <span className="font-bold block text-[#18181b]">Foto anexada pelo cliente</span>
                          <span className="text-[#71717a]">Analisada e diagnosticada pela IA Resolva Já</span>
                        </div>
                      </div>
                    )}

                    {/* Bottom Action Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#e4e4e7]">
                      <div>
                        <span className="text-[11px] text-[#71717a] uppercase block font-bold">Valor Sugerido</span>
                        <span className="text-xl sm:text-2xl font-extrabold text-[#18181b] font-display">
                          R$ {lead.suggestedBudget}
                        </span>
                      </div>

                      {isSent ? (
                        <span className="bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 border border-emerald-200">
                          <CheckCircle className="w-4 h-4" /> Proposta Enviada
                        </span>
                      ) : biddingLeadId === lead.id ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-[#fafafa] border border-[#ea580c] rounded-xl px-3 py-1.5">
                            <span className="text-sm font-bold mr-1">R$</span>
                            <input
                              type="number"
                              value={customPrice}
                              onChange={(e) => setCustomPrice(Number(e.target.value))}
                              className="w-20 text-sm font-bold focus:outline-hidden"
                            />
                          </div>
                          <button
                            onClick={() => handleSendCustomQuote(lead.id)}
                            className="btn-tactile bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                          >
                            Enviar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setCustomPrice(lead.suggestedBudget);
                            setBiddingLeadId(lead.id);
                          }}
                          className="btn-tactile bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                          <span>Enviar Proposta</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 1 Col: Agenda de Visitas */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base sm:text-lg font-bold text-[#18181b] font-display">
              Sua Agenda de Visitas
            </h3>
          </div>

          <div className="saas-card p-5 flex flex-col gap-3.5">
            {appointments.length === 0 ? (
              <div className="p-6 rounded-2xl border border-dashed border-[#e4e4e7] text-center text-xs text-[#71717a] flex flex-col items-center justify-center gap-2">
                <Calendar className="w-6 h-6 text-[#a1a1aa]" />
                <span className="font-bold text-[#18181b]">Nenhuma visita agendada</span>
                <p className="text-[11px] text-[#71717a] max-w-xs leading-relaxed">
                  Quando um cliente aceitar sua proposta e agendar a visita técnica, o horário e endereço confirmado aparecerão aqui.
                </p>
              </div>
            ) : (
              appointments.map((apt) => (
                <div key={apt.id} className="bg-[#fafafa] p-4 rounded-xl border border-[#e4e4e7] flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-extrabold bg-[#fff7ed] text-[#ea580c] px-2 py-0.5 rounded-full uppercase border border-[#fed7aa]">
                      {apt.date} • {apt.time}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 uppercase">{apt.status}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#18181b] mt-1 font-display">
                    {apt.serviceTitle}
                  </h4>
                  <p className="text-xs text-[#52525b]">
                    Cômodo: <strong>{apt.room}</strong> • Valor: <strong>R$ {apt.totalCost}</strong>
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-[#71717a]">
                    <MapPin className="w-3.5 h-3.5 text-[#ea580c] shrink-0" />
                    <span className="truncate">{apt.address}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
