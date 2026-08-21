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
  Briefcase
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
import { ProviderProfile, ProviderJobLead } from '../types';
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
  onSendQuote: (leadId: string, value: number) => void;
  onToggleAvailability: () => void;
  onViewClientPhoto?: (imageUrl: string) => void;
}

export const ProviderHomeScreen: React.FC<ProviderHomeScreenProps> = ({
  provider,
  leads,
  onSendQuote,
  onToggleAvailability,
  onViewClientPhoto
}) => {
  const [biddingLeadId, setBiddingLeadId] = useState<string | null>(null);
  const [customPrice, setCustomPrice] = useState<number>(120);
  const [activeChartTab, setActiveChartTab] = useState<'faturamento' | 'conversao' | 'categorias' | 'horarios'>('faturamento');
  const [chartTimeframe, setChartTimeframe] = useState<'7d' | '30d' | '3m'>('30d');

  const handleSendCustomQuote = (leadId: string) => {
    onSendQuote(leadId, customPrice);
    setBiddingLeadId(null);
  };

  const sentCount = leads.filter((l) => l.status === 'orcamento_enviado').length;
  const openCount = leads.filter((l) => l.status === 'aberto').length;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-16 animate-fadeIn">
      {/* ================= 1. PRO TOP BANNER (MATCHING REFERENCE UI) ================= */}
      <div className="bg-[#18181b] text-white rounded-3xl p-6 sm:p-7 border border-[#27272a] shadow-xl relative overflow-hidden">
        {/* Subtle decorative mesh gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#ea580c]/20 via-[#ea580c]/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <SafeAvatar
                src={provider.avatar}
                alt={provider.name}
                name={provider.name}
                size="xl"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-emerald-400/80 shadow-md"
              />
              <button
                type="button"
                onClick={onToggleAvailability}
                className={`absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold flex items-center gap-1 shadow-md cursor-pointer ${
                  provider.availability === 'Disponível Agora'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-zinc-600 text-zinc-200'
                }`}
                title="Clique para alternar disponibilidade"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                {provider.availability === 'Disponível Agora' ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3" /> Profissional Verificado Resolva Já
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {provider.name}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300">
                {provider.category} • Atendendo: Pinheiros ({provider.operatingRadiusKm} km) e região
              </p>
            </div>
          </div>

          {/* Right Trust Score Badge */}
          <div className="bg-[#27272a] border border-[#3f3f46] rounded-2xl p-3.5 sm:p-4 flex items-center gap-4 shadow-inner self-stretch md:self-auto justify-between md:justify-start">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase block">
                Seu Trust Score
              </span>
              <span className="text-sm font-bold text-emerald-400">
                Nível Excelente
              </span>
              <span className="text-[11px] text-zinc-400 block mt-0.5">
                {provider.completedJobsCount} serviços concluídos
              </span>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-[#18181b] flex items-center justify-center font-black text-2xl shadow-lg">
              {provider.trustIndex}
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. METRIC STATS ROW (MATCHING REFERENCE UI) ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Chamados na sua área */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e4e4e7] shadow-xs flex flex-col justify-between gap-2">
          <div className="flex justify-between items-start">
            <span className="text-[10px] sm:text-xs font-bold text-[#71717a] uppercase tracking-wider">
              Chamados na sua área
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa] flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#18181b]">
              {openCount}
            </span>
            <p className="text-[11px] text-[#ea580c] font-semibold mt-0.5">
              Disponíveis para envio de proposta
            </p>
          </div>
        </div>

        {/* Propostas enviadas */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e4e4e7] shadow-xs flex flex-col justify-between gap-2">
          <div className="flex justify-between items-start">
            <span className="text-[10px] sm:text-xs font-bold text-[#71717a] uppercase tracking-wider">
              Propostas enviadas
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#18181b]">
              {sentCount}
            </span>
            <p className="text-[11px] text-amber-700 font-semibold mt-0.5">
              Aguardando decisão do cliente
            </p>
          </div>
        </div>

        {/* Visitas Agendadas */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e4e4e7] shadow-xs flex flex-col justify-between gap-2">
          <div className="flex justify-between items-start">
            <span className="text-[10px] sm:text-xs font-bold text-[#71717a] uppercase tracking-wider">
              Visitas agendadas
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#18181b]">
              1
            </span>
            <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
              Clientes confirmados hoje
            </p>
          </div>
        </div>

        {/* Faturamento do Mês */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e4e4e7] shadow-xs flex flex-col justify-between gap-2">
          <div className="flex justify-between items-start">
            <span className="text-[10px] sm:text-xs font-bold text-[#71717a] uppercase tracking-wider">
              Faturamento do Mês
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
              R$ {provider.totalEarningsMonth || 5480}
            </span>
            <p className="text-[11px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18% vs mês anterior
            </p>
          </div>
        </div>
      </div>

      {/* ================= 3. PAINEL DE GRÁFICOS DE DEMONSTRAÇÃO (RECHARTS) ================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e4e4e7] shadow-xs flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#e4e4e7] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa] flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#18181b]">
                Painel de Demonstração & Desempenho
              </h2>
            </div>
            <p className="text-xs text-[#71717a] mt-0.5">
              Acompanhe seu faturamento, conversão de propostas e horários de maior demanda
            </p>
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center bg-[#f4f4f5] p-1 rounded-full border border-[#e4e4e7]">
            <button
              onClick={() => setChartTimeframe('7d')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                chartTimeframe === '7d'
                  ? 'bg-[#18181b] text-white shadow-2xs'
                  : 'text-[#52525b] hover:bg-white'
              }`}
            >
              7 Dias
            </button>
            <button
              onClick={() => setChartTimeframe('30d')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                chartTimeframe === '30d'
                  ? 'bg-[#18181b] text-white shadow-2xs'
                  : 'text-[#52525b] hover:bg-white'
              }`}
            >
              Este Mês
            </button>
            <button
              onClick={() => setChartTimeframe('3m')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                chartTimeframe === '3m'
                  ? 'bg-[#18181b] text-white shadow-2xs'
                  : 'text-[#52525b] hover:bg-white'
              }`}
            >
              Trimestre
            </button>
          </div>
        </div>

        {/* Chart Sub-Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveChartTab('faturamento')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeChartTab === 'faturamento'
                ? 'bg-[#ea580c] text-white shadow-sm'
                : 'bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7] hover:bg-[#e4e4e7]'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Faturamento & Ganhos</span>
          </button>

          <button
            onClick={() => setActiveChartTab('conversao')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeChartTab === 'conversao'
                ? 'bg-[#ea580c] text-white shadow-sm'
                : 'bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7] hover:bg-[#e4e4e7]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Volume & Conversão (88%)</span>
          </button>

          <button
            onClick={() => setActiveChartTab('categorias')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeChartTab === 'categorias'
                ? 'bg-[#ea580c] text-white shadow-sm'
                : 'bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7] hover:bg-[#e4e4e7]'
            }`}
          >
            <PieChartIcon className="w-3.5 h-3.5" />
            <span>Por Especialidade</span>
          </button>

          <button
            onClick={() => setActiveChartTab('horarios')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeChartTab === 'horarios'
                ? 'bg-[#ea580c] text-white shadow-sm'
                : 'bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7] hover:bg-[#e4e4e7]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Horários de Pico</span>
          </button>
        </div>

        {/* 3.1 CHART: FATURAMENTO & GANHOS */}
        {activeChartTab === 'faturamento' && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3 bg-[#fafafa] p-3 rounded-2xl border border-[#e4e4e7]">
              <div>
                <span className="text-[10px] text-[#71717a] font-bold uppercase">Média por Serviço</span>
                <span className="text-base font-extrabold text-[#18181b] block">R$ 140,51</span>
              </div>
              <div>
                <span className="text-[10px] text-[#71717a] font-bold uppercase">Total Concluídos</span>
                <span className="text-base font-extrabold text-emerald-700 block">39 serviços</span>
              </div>
              <div>
                <span className="text-[10px] text-[#71717a] font-bold uppercase">Meta do Mês</span>
                <span className="text-base font-extrabold text-[#ea580c] block">109% Atingida</span>
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PROVIDER_EARNINGS_HISTORY} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ea580c" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ea580c" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorMeta" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#52525b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#52525b' }} tickFormatter={(val) => `R$${val}`} />
                  <Tooltip
                    formatter={(value: any) => [`R$ ${value}`, 'Valor']}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#e4e4e7', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                  <Area type="monotone" dataKey="faturamento" name="Faturamento Real (R$)" stroke="#ea580c" strokeWidth={3} fillOpacity={1} fill="url(#colorFaturamento)" />
                  <Area type="monotone" dataKey="meta" name="Meta Projetada (R$)" stroke="#059669" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorMeta)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 3.2 CHART: VOLUME & CONVERSÃO */}
        {activeChartTab === 'conversao' && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3 bg-[#fafafa] p-3 rounded-2xl border border-[#e4e4e7]">
              <div>
                <span className="text-[10px] text-[#71717a] font-bold uppercase">Propostas Aceitas</span>
                <span className="text-base font-extrabold text-emerald-700 block">88.6% de conversão</span>
              </div>
              <div>
                <span className="text-[10px] text-[#71717a] font-bold uppercase">Tempo Médio Resposta</span>
                <span className="text-base font-extrabold text-[#ea580c] block">4.2 minutos</span>
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PROVIDER_WEEKLY_DEMAND} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#52525b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#52525b' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#e4e4e7', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                  <Bar dataKey="chamados" name="Chamados Recebidos" fill="#a1a1aa" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="propostas" name="Propostas Enviadas" fill="#ea580c" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 3.3 CHART: ESPECIALIDADES */}
        {activeChartTab === 'categorias' && (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="h-64 w-full sm:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
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
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value}%`, 'Participação']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col gap-2.5 w-full sm:w-1/2">
              <h4 className="text-xs font-bold text-[#71717a] uppercase tracking-wider">
                Distribuição de Serviços (Últ. 30 dias)
              </h4>
              {PROVIDER_CATEGORY_DISTRIBUTION.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-[#fafafa] border border-[#e4e4e7] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="font-semibold text-[#18181b]">{item.name}</span>
                  </div>
                  <span className="font-bold text-[#ea580c]">{item.count} chamados ({item.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3.4 CHART: HORÁRIOS DE PICO */}
        {activeChartTab === 'horarios' && (
          <div className="flex flex-col gap-3">
            <div className="bg-[#fff7ed] p-3 rounded-xl border border-[#fed7aa] text-xs text-[#9a3412] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ea580c] shrink-0" />
              <span>
                <strong>Dica Pro:</strong> Os períodos de maior volume de chamados com urgência alta acontecem entre <strong>09h-12h</strong> e <strong>14h-18h</strong>.
              </span>
            </div>

            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PROVIDER_HOURLY_PEAK} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                  <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#52525b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#52525b' }} />
                  <Tooltip
                    formatter={(val: any) => [`${val}%`, 'Índice de Demanda']}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#e4e4e7', fontSize: '12px' }}
                  />
                  <Bar dataKey="demanda" name="Índice de Demanda (%)" fill="#ea580c" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* ================= 4. SOLICITAÇÕES DE CLIENTES (MATCHING REFERENCE UI) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Client Requests */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#ea580c]" />
              <h3 className="text-lg sm:text-xl font-bold text-[#18181b]">
                Solicitações de Clientes para Sua Especialidade
              </h3>
            </div>
            <span className="text-xs font-semibold text-[#71717a]">
              {leads.length} solicitações
            </span>
          </div>

          <div className="flex flex-col gap-3.5">
            {leads.map((lead) => {
              const isSent = lead.status === 'orcamento_enviado';

              return (
                <div
                  key={lead.id}
                  className="bg-white rounded-3xl p-5 border border-[#e4e4e7] shadow-xs hover:shadow-md transition-all flex flex-col gap-3.5"
                >
                  {/* Lead Category Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#ea580c] bg-[#fff7ed] px-2.5 py-0.5 rounded-full border border-[#fed7aa]">
                      {lead.category.split('/')[0].trim().toUpperCase()}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        lead.urgency === 'alta' || lead.urgency === 'critica'
                          ? 'bg-[#fee2e2] text-[#b91c1c]'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      URGÊNCIA: {lead.urgency.toUpperCase()}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-[#18181b]">
                      {lead.serviceTitle}
                    </h4>
                    <p className="text-xs text-[#52525b] mt-1 leading-relaxed">
                      {lead.description}
                    </p>
                  </div>

                  {/* Location & Time details */}
                  <div className="bg-[#fafafa] p-3 rounded-2xl border border-[#e4e4e7] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#52525b] gap-1.5">
                    <div className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-4 h-4 text-[#ea580c] shrink-0" />
                      <span>Local: {lead.room} • {lead.neighborhood}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#71717a]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{lead.createdAt}</span>
                    </div>
                  </div>

                  {/* Photo if provided */}
                  {lead.imageUrl && (
                    <div className="flex items-center gap-3">
                      <img
                        src={lead.imageUrl}
                        alt="Foto do cliente"
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover border border-[#e4e4e7] cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => onViewClientPhoto?.(lead.imageUrl!)}
                      />
                      <div className="text-xs text-[#52525b]">
                        <span className="font-bold block text-[#18181b]">Foto anexada pelo cliente</span>
                        <span className="text-[#71717a]">Analisada e diagnosticada pela IA Resolva Já</span>
                      </div>
                    </div>
                  )}

                  {/* Bottom Action Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#e4e4e7]">
                    <div>
                      <span className="text-[10px] text-[#71717a] uppercase block font-bold">Valor Sugerido</span>
                      <span className="text-lg font-black text-[#18181b]">
                        R$ {lead.suggestedBudget}
                      </span>
                    </div>

                    {isSent ? (
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" /> Proposta Enviada
                      </span>
                    ) : biddingLeadId === lead.id ? (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-[#fafafa] border border-[#ea580c] rounded-xl px-2.5 py-1">
                          <span className="text-xs font-bold mr-1">R$</span>
                          <input
                            type="number"
                            value={customPrice}
                            onChange={(e) => setCustomPrice(Number(e.target.value))}
                            className="w-16 text-xs font-bold focus:outline-hidden"
                          />
                        </div>
                        <button
                          onClick={() => handleSendCustomQuote(lead.id)}
                          className="bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
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
                        className="bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold px-4 py-2.5 rounded-full transition-all shadow-sm flex items-center gap-1.5 active:scale-98 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Enviar Proposta</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Agenda de Visitas (Matching Reference UI) */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-700" />
            <h3 className="text-lg sm:text-xl font-bold text-[#18181b]">
              Sua Agenda de Visitas
            </h3>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#e4e4e7] shadow-xs flex flex-col gap-4">
            {/* Scheduled Visit Item */}
            <div className="bg-[#fafafa] p-4 rounded-2xl border border-[#e4e4e7] flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-extrabold bg-[#fff7ed] text-[#ea580c] px-2 py-0.5 rounded-full uppercase border border-[#fed7aa]">
                  Hoje • 16:00 - 17:30
                </span>
                <span className="text-xs font-bold text-emerald-700">Confirmado</span>
              </div>
              <h4 className="text-sm font-bold text-[#18181b] mt-1">
                Reparo de vazamento em torneira
              </h4>
              <p className="text-xs text-[#52525b]">
                Cliente: <strong>Natália Andrade</strong> • (11) 98123-4567
              </p>
              <div className="flex items-center gap-1.5 text-xs text-[#71717a]">
                <MapPin className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>Rua das Palmeiras, 450 - Pinheiros</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-dashed border-[#e4e4e7] text-center text-xs text-[#71717a]">
              Nenhuma outra visita agendada para hoje.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
