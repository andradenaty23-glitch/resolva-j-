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
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-16 animate-fadeIn">
      {/* ================= 1. PRO TOP BANNER ================= */}
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
                {provider.name || 'Prestador de Serviços'}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300">
                {provider.category} • Raio de atendimento: {provider.operatingRadiusKm || 15} km
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
                {provider.completedJobsCount > 0 ? 'Nível Excelente' : 'Novo Credenciado'}
              </span>
              <span className="text-[11px] text-zinc-400 block mt-0.5">
                {provider.completedJobsCount} serviços concluídos
              </span>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-[#18181b] flex items-center justify-center font-black text-2xl shadow-lg">
              {provider.trustIndex || 100}
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. METRIC STATS ROW ================= */}
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
              {openCount === 1 ? 'Disponível para proposta' : 'Disponíveis para envio de proposta'}
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
              {scheduledCount}
            </span>
            <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
              {scheduledCount === 1 ? 'Cliente confirmado' : 'Clientes confirmados'}
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
              R$ {(provider.totalEarningsMonth || 0).toFixed(2)}
            </span>
            <p className="text-[11px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Repasses automáticos via Pix
            </p>
          </div>
        </div>
      </div>

      {/* ================= 3. PAINEL DE DEMONSTRAÇÃO & DESEMPENHO ================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e4e4e7] shadow-xs flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#e4e4e7] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa] flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#18181b]">
                Painel de Desempenho Financeiro & Demandas
              </h2>
            </div>
            <p className="text-xs text-[#71717a] mt-0.5">
              Acompanhe seu faturamento, conversão de propostas e horários de maior demanda
            </p>
          </div>

          {/* Timeframe Selector */}
          {PROVIDER_EARNINGS_HISTORY.length > 0 && (
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
          )}
        </div>

        {/* Empty State for Charts if no prior transactions */}
        {PROVIDER_EARNINGS_HISTORY.length === 0 ? (
          <div className="bg-[#fafafa] rounded-2xl p-8 border border-dashed border-[#e4e4e7] flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#e4e4e7] flex items-center justify-center text-[#ea580c] shadow-xs">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#18181b]">Pronto para receber seus primeiros atendimentos</h4>
              <p className="text-xs text-[#71717a] max-w-md mt-1">
                Conforme você enviar propostas e concluir serviços aos clientes, seus gráficos de faturamento real, taxas de conversão e horários de pico serão computados automaticamente.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-[#52525b] pt-1">
              <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-[#e4e4e7]">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Repasse com Taxa Zero
              </span>
              <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-[#e4e4e7]">
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
                <span>Volume & Conversão</span>
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
              <h3 className="text-lg sm:text-xl font-bold text-[#18181b]">
                Solicitações de Clientes para Sua Especialidade
              </h3>
            </div>
            <span className="text-xs font-semibold text-[#71717a]">
              {leads.length} {leads.length === 1 ? 'solicitação' : 'solicitações'}
            </span>
          </div>

          <div className="flex flex-col gap-3.5">
            {leads.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-dashed border-[#e4e4e7] flex flex-col items-center justify-center text-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#fafafa] border border-[#e4e4e7] flex items-center justify-center text-[#71717a]">
                  <Inbox className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-[#18181b]">Nenhum chamado aberto no momento</h4>
                <p className="text-xs text-[#71717a] max-w-sm">
                  Assim que um cliente relatar um problema ou solicitar atendimento para {provider.category || 'sua especialidade'}, a notificação e fotos aparecerão aqui em tempo real.
                </p>
              </div>
            ) : (
              leads.map((lead) => {
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
              })
            )}
          </div>
        </div>

        {/* Right 1 Col: Agenda de Visitas */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-700" />
            <h3 className="text-lg sm:text-xl font-bold text-[#18181b]">
              Sua Agenda de Visitas
            </h3>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#e4e4e7] shadow-xs flex flex-col gap-4">
            {appointments.length === 0 ? (
              <div className="p-6 rounded-2xl border border-dashed border-[#e4e4e7] text-center text-xs text-[#71717a] flex flex-col items-center justify-center gap-2">
                <Calendar className="w-6 h-6 text-[#a1a1aa]" />
                <span className="font-bold text-[#18181b]">Nenhuma visita agendada</span>
                <p className="text-[11px] text-[#71717a] max-w-xs">
                  Quando um cliente aceitar sua proposta e agendar a visita técnica, o horário e endereço confirmado aparecerão aqui.
                </p>
              </div>
            ) : (
              appointments.map((apt) => (
                <div key={apt.id} className="bg-[#fafafa] p-4 rounded-2xl border border-[#e4e4e7] flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-extrabold bg-[#fff7ed] text-[#ea580c] px-2 py-0.5 rounded-full uppercase border border-[#fed7aa]">
                      {apt.date} • {apt.time}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 uppercase">{apt.status}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#18181b] mt-1">
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
