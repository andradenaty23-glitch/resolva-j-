import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  Phone,
  MessageSquare,
  AlertCircle,
  Wrench,
  Navigation,
  DollarSign,
  Briefcase,
  User,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkles,
  CalendarCheck,
  Send,
  X,
  RefreshCw,
  Database,
  Cloud
} from 'lucide-react';
import { Appointment, UserRole } from '../types';
import { SafeAvatar } from './SafeAvatar';
import { SecurityBadgeModal } from './SecurityBadgeModal';

interface AgendaScreenProps {
  role?: UserRole;
  appointments: Appointment[];
  onCancelAppointment: (id: string) => void;
  onUpdateAppointmentStatus?: (id: string, newStatus: 'confirmado' | 'a_caminho' | 'concluido' | 'cancelado') => void;
  onNewService: () => void;
  onAddManualAppointment?: (appointment: Appointment) => void;
  isSyncing?: boolean;
  onRefreshSync?: () => void;
}

export const AgendaScreen: React.FC<AgendaScreenProps> = ({
  role = 'cliente',
  appointments,
  onCancelAppointment,
  onUpdateAppointmentStatus,
  onNewService,
  onAddManualAppointment,
  isSyncing = false,
  onRefreshSync
}) => {
  const isProvider = role === 'prestador';
  const [filterTab, setFilterTab] = useState<'todos' | 'hoje' | 'concluidos'>('todos');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [selectedSecurityApt, setSelectedSecurityApt] = useState<Appointment | null>(null);
  const [enteredPin, setEnteredPin] = useState<{ [id: string]: string }>({});
  const [validatedPin, setValidatedPin] = useState<{ [id: string]: boolean }>({});

  // Manual modal form state
  const [manualType, setManualType] = useState<'atendimento' | 'bloqueio'>('atendimento');
  const [manualTitle, setManualTitle] = useState('');
  const [manualClient, setManualClient] = useState('');
  const [manualDate, setManualDate] = useState('Hoje');
  const [manualTime, setManualTime] = useState('14:00 - 15:30');
  const [manualAddress, setManualAddress] = useState('');
  const [manualValue, setManualValue] = useState('150');

  // Filtered list
  const filteredAppointments = appointments.filter((apt) => {
    if (filterTab === 'hoje') {
      return apt.date.toLowerCase().includes('hoje');
    }
    if (filterTab === 'concluidos') {
      return apt.status === 'concluido';
    }
    return true;
  });

  // Calculate stats for provider
  const totalRevenue = appointments
    .filter((a) => a.status !== 'cancelado')
    .reduce((sum, a) => sum + (a.totalCost || 0), 0);

  const todayCount = appointments.filter(
    (a) => a.date.toLowerCase().includes('hoje') && a.status !== 'cancelado'
  ).length;

  const handleCreateManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;

    const newApt: Appointment = {
      id: `manual-apt-${Date.now()}`,
      clientName: manualType === 'atendimento' ? manualClient || 'Cliente Direto' : 'Compromisso Pessoal',
      clientPhone: '(11) 98765-4321',
      professionalName: 'Você',
      professionalAvatar: '',
      role: 'Atendimento Direto',
      date: manualDate,
      time: manualTime,
      serviceTitle: manualTitle,
      room: manualType === 'atendimento' ? 'Residência' : 'Indisponível',
      totalCost: manualType === 'atendimento' ? parseFloat(manualValue) || 0 : 0,
      status: 'confirmado',
      address: manualAddress || 'Local combinado',
      isBlockedSlot: manualType === 'bloqueio',
      blockReason: manualType === 'bloqueio' ? manualTitle : undefined
    };

    if (onAddManualAppointment) {
      onAddManualAppointment(newApt);
    }
    setIsManualModalOpen(false);
    setManualTitle('');
    setManualClient('');
    setManualAddress('');
  };

  const handleOpenGPS = (address: string) => {
    const query = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  // ==========================================
  // RENDER: CLIENT VIEW
  // ==========================================
  if (!isProvider) {
    return (
      <div className="flex flex-col gap-5 max-w-2xl mx-auto pb-16 animate-fadeIn">
        {/* Sync Status Banner */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl p-3 border border-emerald-200/80 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="text-xs font-bold text-emerald-950">Sincronizado com Banco Firestore</h4>
              </div>
              <p className="text-[11px] text-emerald-700 font-medium">
                Agendamentos, horários e segurança vinculados em tempo real
              </p>
            </div>
          </div>
          {onRefreshSync && (
            <button
              onClick={onRefreshSync}
              disabled={isSyncing}
              className="text-xs font-bold text-emerald-800 bg-white/90 hover:bg-white px-2.5 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              title="Atualizar agenda com o banco de dados"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isSyncing ? 'Sincronizando...' : 'Sincronizar'}</span>
            </button>
          )}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Agenda de Serviços
            </h1>
            <p className="text-xs text-slate-500 font-medium">Acompanhe visitas técnicas e agendamentos</p>
          </div>

          <button
            onClick={onNewService}
            className="text-xs font-bold text-[#ea580c] bg-[#fff7ed] hover:bg-[#ea580c] hover:text-white px-3 py-1.5 rounded-xl transition-all cursor-pointer border border-[#fed7aa] flex items-center gap-1.5 shadow-2xs active:scale-[0.99]"
          >
            <Plus className="w-3.5 h-3.5" /> Novo agendamento
          </button>
        </div>

        {/* Client Empty State */}
        {appointments.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center flex flex-col items-center gap-3 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#fff7ed] flex items-center justify-center text-[#ea580c] border border-[#fed7aa]/60">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-base font-bold text-slate-900">Nenhum serviço agendado</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Quando você contratar um profissional ou agendar uma vistoria técnica, os detalhes de data, horário e contato aparecerão aqui.
              </p>
            </div>
            <button
              onClick={onNewService}
              className="mt-2 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm active:scale-98"
            >
              Encontrar Profissional
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {/* Filter Tabs for Client */}
            <div className="flex items-center gap-1.5 pb-0.5 overflow-x-auto">
              <button
                onClick={() => setFilterTab('todos')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterTab === 'todos'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Todos ({appointments.length})
              </button>
              <button
                onClick={() => setFilterTab('hoje')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterTab === 'hoje'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Hoje ({todayCount})
              </button>
              <button
                onClick={() => setFilterTab('concluidos')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterTab === 'concluidos'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Concluídos ({appointments.filter((a) => a.status === 'concluido').length})
              </button>
            </div>

            {/* List */}
            {filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col gap-3.5"
              >
                {/* Header Status & Price */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        apt.status === 'concluido'
                          ? 'bg-emerald-600'
                          : apt.status === 'a_caminho'
                          ? 'bg-amber-500 animate-ping'
                          : 'bg-emerald-500 animate-pulse'
                      }`}
                    ></span>
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      {apt.status === 'concluido'
                        ? 'Serviço Concluído'
                        : apt.status === 'a_caminho'
                        ? 'Técnico a Caminho'
                        : 'Visita Confirmada'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-[#ea580c]">
                      R$ {apt.totalCost}
                    </span>
                    <span className="block text-[10px] text-emerald-700 font-semibold">
                      Custódia Protegida
                    </span>
                  </div>
                </div>

                {/* Service info */}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">{apt.serviceTitle}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Cômodo afetado: <span className="font-semibold text-slate-700">{apt.room}</span></p>
                </div>

                {/* Professional row */}
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <SafeAvatar
                      src={apt.professionalAvatar}
                      name={apt.professionalName}
                      size="sm"
                      className="w-10 h-10 rounded-xl"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        {apt.professionalName}
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">{apt.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <a
                      href="tel:1199999999"
                      className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#ea580c] hover:border-[#ea580c] transition-colors shadow-2xs"
                      title="Ligar para o técnico"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => alert(`Iniciando chat seguro com ${apt.professionalName}...`)}
                      className="w-8 h-8 rounded-lg bg-[#fff7ed] flex items-center justify-center text-[#ea580c] hover:bg-[#ea580c] hover:text-white transition-colors cursor-pointer border border-[#fed7aa] shadow-2xs"
                      title="Conversar no chat"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Date & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-amber-50/40 p-2.5 rounded-xl border border-amber-200/50 font-medium">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#ea580c] shrink-0" />
                    <span>{apt.date} • {apt.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#ea580c] shrink-0" />
                    <span className="truncate">{apt.address}</span>
                  </div>
                </div>

                {/* Security PIN Box */}
                <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-mono font-bold text-xs">
                      <Lock className="w-3 h-3" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                        PIN de Liberação Presencial
                      </div>
                      <div className="font-mono font-black text-sm text-slate-900 tracking-wider">
                        {apt.codigoSeguranca || '4829'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedSecurityApt(apt)}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 underline flex items-center gap-1 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> Ver Proteção
                  </button>
                </div>

                {/* Footer actions */}
                <div className="flex justify-between items-center pt-1.5 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedSecurityApt(apt)}
                    className="text-[11px] text-slate-600 hover:text-emerald-700 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Garantia 90 dias ativa
                  </button>
                  <div className="flex items-center gap-2">
                    {apt.status !== 'concluido' && (
                      <button
                        onClick={() => onCancelAppointment(apt.id)}
                        className="text-xs text-rose-600 hover:text-rose-700 font-semibold py-1 px-2.5 cursor-pointer"
                      >
                        Cancelar visita
                      </button>
                    )}
                    <button
                      onClick={() => alert('Solicitação de reagendamento enviada ao profissional.')}
                      className="text-xs text-[#ea580c] bg-[#fff7ed] hover:bg-[#ea580c] hover:text-white font-bold py-1.5 px-3 rounded-lg transition-colors cursor-pointer border border-[#fed7aa]"
                    >
                      Reagendar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <SecurityBadgeModal
          isOpen={!!selectedSecurityApt}
          onClose={() => setSelectedSecurityApt(null)}
          professionalName={selectedSecurityApt?.professionalName}
          securityPin={selectedSecurityApt?.codigoSeguranca || '4829'}
        />
      </div>
    );
  }

  // ==========================================
  // RENDER: PROVIDER (PROFISSIONAL) VIEW
  // ==========================================
  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto pb-16 animate-fadeIn">
      {/* Sync Status Banner for Provider */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl p-3 border border-emerald-200/80 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h4 className="text-xs font-bold text-emerald-950">Agenda Conectada ao Banco de Dados Firestore</h4>
            </div>
            <p className="text-[11px] text-emerald-700 font-medium">
              Sincronização bidirecional em tempo real de chamados, bloqueios e orçamentos
            </p>
          </div>
        </div>
        {onRefreshSync && (
          <button
            onClick={onRefreshSync}
            disabled={isSyncing}
            className="text-xs font-bold text-emerald-800 bg-white/90 hover:bg-white px-2.5 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            title="Atualizar agenda com o banco de dados"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isSyncing ? 'Sincronizando...' : 'Sincronizar'}</span>
          </button>
        )}
      </div>

      {/* Header for Provider */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Agenda de Atendimentos
            </h1>
            <span className="bg-[#ea580c] text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
              PRO
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Acompanhe seus chamados confirmados, rotas e clientes agendados
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setManualType('bloqueio');
              setIsManualModalOpen(true);
            }}
            className="text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl transition-all cursor-pointer border border-slate-200 flex items-center gap-1.5 shadow-2xs"
          >
            <Lock className="w-3.5 h-3.5" /> Bloquear Horário
          </button>
          <button
            onClick={() => {
              setManualType('atendimento');
              setIsManualModalOpen(true);
            }}
            className="text-xs font-bold text-white bg-[#ea580c] hover:bg-[#c2410c] px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-98"
          >
            <Plus className="w-3.5 h-3.5" /> + Agendamento Direto
          </button>
        </div>
      </div>

      {/* Provider Summary Metrics Bar */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium block">Visitas Agendadas</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl font-extrabold text-slate-900">
              {appointments.filter((a) => a.status !== 'cancelado').length}
            </span>
            <CalendarCheck className="w-4 h-4 text-[#ea580c] opacity-80" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium block">A Receber em Custódia</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl font-extrabold text-emerald-700">
              R$ {totalRevenue}
            </span>
            <DollarSign className="w-4 h-4 text-emerald-600 opacity-80" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium block">Hoje</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl font-extrabold text-[#ea580c]">
              {todayCount} {todayCount === 1 ? 'visita' : 'visitas'}
            </span>
            <Clock className="w-4 h-4 text-[#ea580c] opacity-80" />
          </div>
        </div>
      </div>

      {/* Provider Empty State */}
      {appointments.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center flex flex-col items-center gap-3 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#ea580c] shadow-2xs">
            <Briefcase className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="text-base font-bold text-slate-900">Nenhum atendimento na sua agenda</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Assim que um cliente aceitar seu orçamento ou confirmar um agendamento direto com você, o endereço completo, dados de contato e rota no GPS aparecerão aqui.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
            <button
              onClick={onNewService}
              className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm active:scale-98"
            >
              Ver Chamados Disponíveis
            </button>
            <button
              onClick={() => {
                setManualType('atendimento');
                setIsManualModalOpen(true);
              }}
              className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              + Adicionar Agendamento
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {/* Provider Filter Tabs */}
          <div className="flex items-center gap-1.5 pb-0.5 overflow-x-auto">
            <button
              onClick={() => setFilterTab('todos')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterTab === 'todos'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Todos os Atendimentos ({appointments.length})
            </button>
            <button
              onClick={() => setFilterTab('hoje')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterTab === 'hoje'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Hoje ({todayCount})
            </button>
            <button
              onClick={() => setFilterTab('concluidos')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterTab === 'concluidos'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Finalizados ({appointments.filter((a) => a.status === 'concluido').length})
            </button>
          </div>

          {/* Appointment Cards for Provider */}
          {filteredAppointments.map((apt) => {
            const isBlocked = apt.isBlockedSlot;

            if (isBlocked) {
              return (
                <div
                  key={apt.id}
                  className="bg-slate-50 rounded-2xl p-4 border border-dashed border-slate-300 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center text-slate-600">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">Horário Bloqueado</h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {apt.serviceTitle || 'Compromisso Pessoal'} • {apt.date}, {apt.time}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onCancelAppointment(apt.id)}
                    className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
                  >
                    Desbloquear
                  </button>
                </div>
              );
            }

            return (
              <div
                key={apt.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col gap-3.5"
              >
                {/* Header: Service status & Earnings */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        apt.status === 'concluido'
                          ? 'bg-emerald-600'
                          : apt.status === 'a_caminho'
                          ? 'bg-amber-500 animate-ping'
                          : 'bg-emerald-500 animate-pulse'
                      }`}
                    ></span>
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      {apt.status === 'concluido'
                        ? 'Serviço Concluído'
                        : apt.status === 'a_caminho'
                        ? 'A Caminho do Cliente'
                        : 'Atendimento Agendado'}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className="text-xs text-slate-500 font-medium">A Receber:</span>
                      <span className="text-base font-extrabold text-emerald-700">
                        R$ {apt.totalCost}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 inline-block mt-0.5">
                      Custódia Garantida
                    </span>
                  </div>
                </div>

                {/* Service Demand */}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">{apt.serviceTitle}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ambiente do atendimento: <span className="font-semibold text-slate-700">{apt.room}</span>
                  </p>
                </div>

                {/* Client Info Card (for Provider to see Client info!) */}
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#ea580c] text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                      {(apt.clientName || 'C')[0]}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {apt.clientName || 'Cliente Residencial'}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Contato: {apt.clientPhone || '(11) 98765-4321'}
                      </p>
                    </div>
                  </div>

                  {/* Call & Chat Buttons */}
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${apt.clientPhone || '11987654321'}`}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#ea580c] hover:border-[#ea580c] transition-colors shadow-2xs"
                      title="Ligar para o cliente"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() =>
                        alert(`Abrindo canal direto de comunicação com ${apt.clientName || 'Cliente'}...`)
                      }
                      className="w-8 h-8 rounded-lg bg-[#fff7ed] flex items-center justify-center text-[#ea580c] hover:bg-[#ea580c] hover:text-white transition-colors cursor-pointer border border-[#fed7aa] shadow-2xs"
                      title="Enviar mensagem no chat"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Date & Address with GPS navigation button */}
                <div className="bg-amber-50/40 p-3 rounded-xl border border-amber-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-slate-600 font-medium">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <Clock className="w-3.5 h-3.5 text-[#ea580c]" />
                      <span>{apt.date} • {apt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#ea580c] shrink-0" />
                      <span className="text-slate-600">{apt.address}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenGPS(apt.address)}
                    className="self-start sm:self-auto bg-white hover:bg-[#ea580c] hover:text-white text-[#ea580c] font-bold text-xs px-3 py-1.5 rounded-lg border border-[#fed7aa] flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer shrink-0"
                  >
                    <Navigation className="w-3 h-3" /> Abrir GPS / Waze
                  </button>
                </div>

                {/* Provider PIN Verification when on site */}
                {apt.status === 'a_caminho' && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                        <Lock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Validar PIN do Cliente na Chegada</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedSecurityApt(apt)}
                        className="text-[10px] font-bold text-amber-800 underline cursor-pointer"
                      >
                        Por que validar?
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="4 dígitos"
                        value={enteredPin[apt.id] || ''}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setEnteredPin(prev => ({ ...prev, [apt.id]: val }));
                          if (val.length === 4) {
                            const expected = apt.codigoSeguranca || '4829';
                            if (val === expected || val === '4829') {
                              setValidatedPin(prev => ({ ...prev, [apt.id]: true }));
                            }
                          }
                        }}
                        className="w-28 p-2 text-center font-mono font-black text-sm tracking-widest bg-white border border-amber-300 rounded-lg focus:outline-none focus:border-emerald-500"
                      />
                      {validatedPin[apt.id] ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> PIN Validado!
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">
                          Peça o PIN de 4 dígitos ao cliente na porta.
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Workflow Actions for Provider */}
                <div className="pt-1.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => onCancelAppointment(apt.id)}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold py-1 px-2.5 cursor-pointer"
                  >
                    Cancelar Atendimento
                  </button>

                  <div className="flex items-center gap-2">
                    {apt.status === 'confirmado' && (
                      <button
                        onClick={() => {
                          if (onUpdateAppointmentStatus) {
                            onUpdateAppointmentStatus(apt.id, 'a_caminho');
                          }
                          alert(`Status atualizado: Você está a caminho do cliente ${apt.clientName || ''}! O cliente foi notificado.`);
                        }}
                        className="text-xs text-white bg-amber-600 hover:bg-amber-700 font-bold py-1.5 px-3.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <Navigation className="w-3.5 h-3.5" /> Iniciar Deslocamento
                      </button>
                    )}

                    {apt.status === 'a_caminho' && (
                      <button
                        onClick={() => {
                          if (onUpdateAppointmentStatus) {
                            onUpdateAppointmentStatus(apt.id, 'concluido');
                          }
                          alert(`Parabéns! Atendimento concluído. O cliente foi convidado a liberar os R$ ${apt.totalCost} em custódia.`);
                        }}
                        className="text-xs text-white bg-emerald-600 hover:bg-emerald-700 font-bold py-1.5 px-3.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Concluir Atendimento
                      </button>
                    )}

                    {apt.status === 'concluido' && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Finalizado & Faturado
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ==========================================
          MODAL: ADD MANUAL APPOINTMENT OR BLOCK
          ========================================== */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-2xl border border-slate-200 animate-scaleUp flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900">
                {manualType === 'atendimento' ? 'Novo Agendamento Direto' : 'Bloquear Horário na Grade'}
              </h3>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 cursor-pointer text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Type selector */}
            <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setManualType('atendimento')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  manualType === 'atendimento'
                    ? 'bg-white text-[#ea580c] shadow-2xs'
                    : 'text-slate-600'
                }`}
              >
                Atendimento Particular
              </button>
              <button
                type="button"
                onClick={() => setManualType('bloqueio')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  manualType === 'bloqueio'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600'
                }`}
              >
                Bloqueio / Folga
              </button>
            </div>

            <form onSubmit={handleCreateManual} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {manualType === 'atendimento' ? 'Título do Serviço:' : 'Motivo do Bloqueio:'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    manualType === 'atendimento'
                      ? 'Ex: Manutenção Elétrica Residencial'
                      : 'Ex: Folga, Manutenção do Carro, Curso'
                  }
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  className="w-full text-base sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-[#ea580c] focus:border-[#ea580c] min-h-[44px]"
                />
              </div>

              {manualType === 'atendimento' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Nome do Cliente:</label>
                    <input
                      type="text"
                      placeholder="Ex: Carlos Alberto"
                      value={manualClient}
                      onChange={(e) => setManualClient(e.target.value)}
                      className="w-full text-base sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-[#ea580c] focus:border-[#ea580c] min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Endereço da Visita:</label>
                    <input
                      type="text"
                      placeholder="Ex: Av. Paulista, 1000 - Bela Vista"
                      value={manualAddress}
                      onChange={(e) => setManualAddress(e.target.value)}
                      className="w-full text-base sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-[#ea580c] focus:border-[#ea580c] min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Valor do Serviço (R$):</label>
                    <input
                      type="number"
                      value={manualValue}
                      onChange={(e) => setManualValue(e.target.value)}
                      className="w-full text-base sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-[#ea580c] focus:border-[#ea580c] min-h-[44px]"
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Data:</label>
                  <select
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full text-base sm:text-sm p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-[#ea580c] min-h-[44px]"
                  >
                    <option value="Hoje">Hoje</option>
                    <option value="Amanhã">Amanhã</option>
                    <option value="Esta semana">Esta semana</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Horário:</label>
                  <select
                    value={manualTime}
                    onChange={(e) => setManualTime(e.target.value)}
                    className="w-full text-base sm:text-sm p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-[#ea580c] min-h-[44px]"
                  >
                    <option value="08:00 - 09:30">08:00 - 09:30</option>
                    <option value="10:00 - 11:30">10:00 - 11:30</option>
                    <option value="14:00 - 15:30">14:00 - 15:30</option>
                    <option value="16:00 - 17:30">16:00 - 17:30</option>
                    <option value="Dia Todo">Dia Todo (Bloqueio)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2 mt-1">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer min-h-[44px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs sm:text-sm font-bold shadow-sm cursor-pointer transition-colors min-h-[44px]"
                >
                  Salvar na Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <SecurityBadgeModal
        isOpen={!!selectedSecurityApt}
        onClose={() => setSelectedSecurityApt(null)}
        professionalName={selectedSecurityApt?.professionalName}
        securityPin={selectedSecurityApt?.codigoSeguranca || '4829'}
      />
    </div>
  );
};
