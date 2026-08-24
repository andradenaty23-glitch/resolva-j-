import React, { useState } from 'react';
import {
  TabType,
  UserRole,
  DiagnosisResult,
  Professional,
  Room,
  Appointment,
  NotificationItem,
  ProblemCategory,
  ClientProfile,
  ProviderProfile,
  ProviderJobLead,
  PaymentMethod,
  TransactionRecord
} from './types';
import {
  INITIAL_CLIENT_PROFILE,
  INITIAL_PROVIDER_PROFILE,
  INITIAL_PROVIDER_LEADS,
  INITIAL_DIAGNOSIS,
  INITIAL_PROFESSIONALS,
  INITIAL_ROOMS,
  INITIAL_APPOINTMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PAYMENT_METHODS,
  INITIAL_TRANSACTIONS
} from './data/mockData';
import { SERVICE_DEMANDS_CATALOG } from './data/serviceDemands';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { DiagnosisScreen } from './components/DiagnosisScreen';
import { MinhaCasaScreen } from './components/MinhaCasaScreen';
import { AgendaScreen } from './components/AgendaScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { ClientPaymentsScreen } from './components/ClientPaymentsScreen';
import { ProviderHomeScreen } from './components/ProviderHomeScreen';
import { ProviderProfileScreen } from './components/ProviderProfileScreen';
import { RegistrationModal } from './components/RegistrationModal';
import {
  VoiceModal,
  PhotoModal,
  GuidedWizardModal,
  BookingModal,
  ProfessionalProfileModal,
  AddRoomModal,
  NotificationsModal
} from './components/Modals';

export default function App() {
  // Active Role and Profiles
  const [currentRole, setCurrentRole] = useState<UserRole>('cliente');
  const [clientProfile, setClientProfile] = useState<ClientProfile>(INITIAL_CLIENT_PROFILE);
  const [providerProfile, setProviderProfile] = useState<ProviderProfile>(INITIAL_PROVIDER_PROFILE);
  const [providerLeads, setProviderLeads] = useState<ProviderJobLead[]>(INITIAL_PROVIDER_LEADS);

  // Client Data States
  const [activeTab, setActiveTab] = useState<TabType>('inicio');
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult>(INITIAL_DIAGNOSIS);
  const [professionals, setProfessionals] = useState<Professional[]>(INITIAL_PROFESSIONALS);
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(INITIAL_PAYMENT_METHODS);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);

  // Selected states
  const [selectedRoomId, setSelectedRoomId] = useState<string>('cozinha');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Modal open states
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isGuidedWizardOpen, setIsGuidedWizardOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);

  // Counts
  const unreadCount = notifications.filter((n) => !n.read).length;
  const pendingProblemsCount = rooms.reduce((acc, r) => acc + r.problemCount, 0);

  // Handlers for Profile Deletion
  const handleDeleteClientProfile = () => {
    const emptyClient: ClientProfile = {
      id: `client-${Date.now()}`,
      name: 'Cliente Resolva Já',
      email: '',
      phone: '',
      avatar: '',
      cpf: '',
      residenceType: 'apartamento',
      plan: 'Resolva Já Free',
      walletBalance: 0.0,
      cashbackBalance: 0.0,
      registeredAt: 'Conta redefinida',
      address: {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: 'São Paulo',
        state: 'SP',
        cep: ''
      }
    };
    setClientProfile(emptyClient);
    setAppointments([]);
    setTransactions([]);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Perfil de Cliente Excluído',
        message: 'Seus dados de cliente foram removidos com sucesso.',
        time: 'Agora mesmo',
        read: false,
        type: 'info'
      },
      ...prev
    ]);
    setActiveTab('inicio');
  };

  const handleDeleteProviderProfile = () => {
    const emptyProvider: ProviderProfile = {
      id: `prov-${Date.now()}`,
      name: 'Prestador de Serviços',
      email: '',
      phone: '',
      document: '',
      avatar: '',
      category: 'Reparos e Manutenção',
      rating: 5.0,
      reviewsCount: 0,
      completedJobsCount: 0,
      experienceYears: 0,
      verified: true,
      laborBaseRate: 100,
      operatingRadiusKm: 15,
      availability: 'Disponível Agora',
      trustIndex: 100,
      specialties: ['Reparos Gerais'],
      bio: '',
      totalEarningsMonth: 0,
      registeredAt: 'Conta redefinida',
      bankAccount: {
        bank: 'Conta Bancária',
        pixKey: ''
      }
    };
    setProviderProfile(emptyProvider);
    setProviderLeads([]);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Perfil Profissional Excluído',
        message: 'Seu cadastro de prestador foi removido com sucesso.',
        time: 'Agora mesmo',
        read: false,
        type: 'info'
      },
      ...prev
    ]);
    setActiveTab('inicio');
  };

  // Handler for Client: Dynamic AI diagnosis generator
  const handleFindSolution = (problemText: string, imageSrc?: string) => {
    const textLower = problemText.toLowerCase();

    // Find matched demand category in catalog
    const matchedDemand = SERVICE_DEMANDS_CATALOG.find((demand) => {
      if (textLower.includes(demand.id.toLowerCase())) return true;
      if (textLower.includes(demand.shortName.toLowerCase())) return true;
      const keyWords = demand.name.toLowerCase().split(' ');
      return keyWords.some((kw) => kw.length > 3 && textLower.includes(kw));
    });

    let category = matchedDemand ? matchedDemand.name : 'Encanamento / Hidráulica';
    let profType = matchedDemand ? matchedDemand.profType : 'Encanador Especializado';
    let summary = matchedDemand ? matchedDemand.popularIssues[0] : 'Vazamento ou reparo hidráulico residencial';
    let room = 'cozinha';
    let urgencyPercentage = matchedDemand ? matchedDemand.urgencyPercentageDefault : 55;
    let urgency: 'baixa' | 'media' | 'alta' | 'critica' = matchedDemand ? matchedDemand.urgencyDefault : 'media';
    let diyTips = matchedDemand
      ? matchedDemand.diyTips
      : [
          'Feche o registro geral de água se o vazamento for contínuo.',
          'Coloque um balde ou pano absorvente sob o ponto de gotejamento.'
        ];
    let costRange = matchedDemand ? matchedDemand.estimatedCostRange : { min: 90, max: 180 };

    if (
      textLower.includes('eletric') ||
      textLower.includes('disjuntor') ||
      textLower.includes('luz') ||
      textLower.includes('faísca') ||
      textLower.includes('tomada') ||
      textLower.includes('chuveiro')
    ) {
      category = 'Elétrica Residencial & Comercial';
      profType = 'Eletricista Certificado';
      summary = 'Sobrecarga, disjuntor desarmando ou reparo de fiação';
      room = 'sala';
      urgencyPercentage = 85;
      urgency = 'alta';
      costRange = { min: 100, max: 220 };
      diyTips = [
        'Desarme o disjuntor geral imediatamente por segurança.',
        'Não toque em cabos desencapados ou tomadas com cheiro de queimado.',
        'Desconecte aparelhos pesados da mesma tomada.'
      ];
    } else if (
      textLower.includes('ar') ||
      textLower.includes('split') ||
      textLower.includes('gela') ||
      textLower.includes('ar condicionado')
    ) {
      category = 'Ar Condicionado & Refrigeração';
      profType = 'Técnico em Climatização';
      summary = 'Obstrução de dreno, higienização ou carga de gás';
      room = 'quarto1';
      urgencyPercentage = 50;
      urgency = 'media';
      costRange = { min: 140, max: 280 };
      diyTips = [
        'Desligue o aparelho para evitar vazamento na parede ou piso.',
        'Lave periodicamente os filtros de ar removíveis sob água morna.'
      ];
    } else if (
      textLower.includes('chave') ||
      textLower.includes('tranca') ||
      textLower.includes('porta') ||
      textLower.includes('fechadura')
    ) {
      category = 'Chaveiro & Fechaduras Digitais';
      profType = 'Chaveiro Profissional 24h';
      summary = 'Desgaste do tambor da fechadura ou instalação digital';
      room = 'sala';
      urgencyPercentage = 80;
      urgency = 'alta';
      costRange = { min: 80, max: 190 };
      diyTips = [
        'Aplique grafite em pó na entrada da chave (nunca óleo de cozinha).',
        'Não force a chave para não quebrá-la dentro do cilindro.'
      ];
    } else if (
      textLower.includes('móvel') ||
      textLower.includes('moveis') ||
      textLower.includes('armário') ||
      textLower.includes('guarda-roupa') ||
      textLower.includes('montagem')
    ) {
      category = 'Montagem & Desmontagem de Móveis';
      profType = 'Montador de Móveis Profissional';
      summary = 'Montagem técnica e alinhamento de mobília residencial';
      room = 'quarto1';
      urgencyPercentage = 30;
      urgency = 'baixa';
      costRange = { min: 90, max: 200 };
      diyTips = [
        'Mantenha as ferragens e manuais originais guardados com cuidado.',
        'Evite arrastar móveis montados para preservar a estrutura de fixação.'
      ];
    } else if (
      textLower.includes('entup') ||
      textLower.includes('ralo') ||
      textLower.includes('esgoto') ||
      textLower.includes('vaso')
    ) {
      category = 'Desentupimento Especializado';
      profType = 'Técnico em Desentupimento';
      summary = 'Obstrução com refluxo em ralo, pia ou vaso sanitário';
      room = 'banheiro';
      urgencyPercentage = 90;
      urgency = 'critica';
      costRange = { min: 120, max: 260 };
      diyTips = [
        'Interrompa o uso da água no cômodo para evitar transbordamento.',
        'Não despeje substâncias químicas corrosivas na tubulação de PVC.'
      ];
    }

    const newDiagnosis: DiagnosisResult = {
      id: `diag-${Date.now()}`,
      title: 'Diagnóstico Concluído',
      problemSummary: summary,
      category,
      professionalType: profType,
      urgency,
      urgencyPercentage,
      room,
      diyTips,
      estimatedCostRange: costRange,
      createdAt: 'Agora mesmo'
    };

    setDiagnosis(newDiagnosis);
    setSelectedRoomId(room);
    setActiveTab('problemas');

    // Also automatically create an incoming lead for providers!
    const newLead: ProviderJobLead = {
      id: `lead-${Date.now()}`,
      clientName: clientProfile.name || 'Cliente Resolva Já',
      serviceTitle: problemText || summary,
      category,
      room: room === 'cozinha' ? 'Cozinha' : room === 'banheiro' ? 'Banheiro' : 'Residência',
      neighborhood: `${clientProfile.address?.neighborhood || 'Bairro Residencial'} (a 2.1 km)`,
      distanceKm: 2.1,
      urgency,
      suggestedBudget: costRange.min + 20,
      description: problemText || 'Problema diagnosticado pela IA Resolva Já no imóvel do cliente.',
      imageUrl: imageSrc,
      status: 'aberto',
      createdAt: 'Agora mesmo'
    };
    setProviderLeads((prev) => [newLead, ...prev]);
  };

  const handleSelectCategory = (cat: ProblemCategory) => {
    const matched = SERVICE_DEMANDS_CATALOG.find((item) => item.id === cat);
    if (matched) {
      handleFindSolution(matched.popularIssues[0] || matched.name);
    } else {
      handleFindSolution(`Problema na categoria ${cat}`);
    }
  };

  const handleBooking = (prof: Professional) => {
    setSelectedProfessional(prof);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = (appointment: Appointment) => {
    setAppointments((prev) => [appointment, ...prev]);

    // Create a secure custody transaction
    const newTx: TransactionRecord = {
      id: `tx-${Date.now()}`,
      serviceTitle: appointment.serviceTitle,
      providerName: appointment.professionalName,
      providerAvatar: appointment.professionalAvatar,
      providerCategory: appointment.role,
      amount: appointment.totalCost,
      date: `${appointment.date}, ${appointment.time}`,
      status: 'em_custodia',
      paymentMethodType: 'Cartão de Crédito',
      paymentMethodDetails: 'Mastercard •••• 4291 (1x)',
      installments: 1,
      invoiceCode: `RJ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      warrantyUntil: '90 dias após conclusão'
    };
    setTransactions((prev) => [newTx, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Agendamento e Pagamento Seguro',
      message: `Visita com ${appointment.professionalName} confirmada. R$ ${appointment.totalCost} retido em custódia segura.`,
      time: 'Agora mesmo',
      read: false,
      type: 'success'
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setActiveTab('agenda');
  };

  // Payment Methods Handlers
  const handleAddPaymentMethod = (newMethod: PaymentMethod) => {
    setPaymentMethods((prev) => {
      if (newMethod.isDefault) {
        return [...prev.map((m) => ({ ...m, isDefault: false })), newMethod];
      }
      return [...prev, newMethod];
    });
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Cartão Adicionado',
      message: `Novo método de pagamento (${newMethod.nickname || newMethod.brand}) cadastrado com sucesso.`,
      time: 'Agora mesmo',
      read: false,
      type: 'success'
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleSetDefaultPaymentMethod = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((m) => ({
        ...m,
        isDefault: m.id === id
      }))
    );
  };

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAddRoom = (name: string, icon: string) => {
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      name,
      icon,
      status: 'normal',
      statusText: 'Tudo normal',
      problemCount: 0,
      items: [
        {
          id: `item-${Date.now()}`,
          name: 'Iluminação Geral',
          brand: 'Padrão LED',
          lastReview: '08/2024',
          status: 'ok',
          statusText: 'OK',
          iconName: 'Lightbulb'
        }
      ]
    };
    setRooms((prev) => [...prev, newRoom]);
  };

  const handleReportProblemInRoom = (roomId: string, deviceName?: string) => {
    const room = rooms.find((r) => r.id === roomId);
    const text = deviceName
      ? `Problema com ${deviceName} na ${room?.name || 'residência'}`
      : `Preciso de avaliação técnica para ${room?.name || 'cômodo'}`;
    handleFindSolution(text);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Provider Actions
  const handleSendProviderQuote = (leadId: string, value: number) => {
    setProviderLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: 'orcamento_enviado', suggestedBudget: value } : l))
    );
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Proposta Enviada',
      message: `Você enviou uma proposta de R$ ${value} para o chamado selecionado.`,
      time: 'Agora mesmo',
      read: false,
      type: 'info'
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleToggleProviderAvailability = () => {
    setProviderProfile((prev) => ({
      ...prev,
      availability: prev.availability === 'Disponível Agora' ? 'Ocupado' : 'Disponível Agora'
    }));
  };

  // Registration Handlers
  const handleRegisterClient = (newClient: ClientProfile) => {
    setClientProfile(newClient);
    setCurrentRole('cliente');
    setActiveTab('inicio');
  };

  const handleRegisterProvider = (newProvider: ProviderProfile) => {
    setProviderProfile(newProvider);
    setCurrentRole('prestador');
    setActiveTab('inicio');
  };

  return (
    <div className="bg-[#f8fafc] text-[#0f172a] min-h-screen flex flex-col font-sans antialiased selection:bg-[#dbeafe] selection:text-[#1d4ed8]">
      {/* Top App Header with Role Switcher & New Registration CTA */}
      <Header
        notifications={notifications}
        unreadCount={unreadCount}
        currentRole={currentRole}
        onRoleChange={(role) => {
          setCurrentRole(role);
          setActiveTab('inicio');
        }}
        onOpenRegistration={() => setIsRegistrationModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSystemStatus={() => {
          alert(
            currentRole === 'cliente'
              ? 'Sistema SOLVI IoT Online • 14 sensores conectados no imóvel.'
              : 'Solvi PRO Radar Ativo • 8 chamados abertos no seu raio de atendimento.'
          );
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-6 pt-5 pb-24 md:pl-28 max-w-4xl mx-auto w-full">
        {/* ================= CLIENT ROLE SCREENS ================= */}
        {currentRole === 'cliente' && (
          <>
            {activeTab === 'inicio' && (
              <HomeScreen
                onFindSolution={handleFindSolution}
                onSelectCategory={handleSelectCategory}
                onOpenVoiceInput={() => setIsVoiceModalOpen(true)}
                onOpenPhotoInput={() => setIsPhotoModalOpen(true)}
                onOpenGuidedWizard={() => setIsGuidedWizardOpen(true)}
                onNavigateToRoom={(roomId) => {
                  setSelectedRoomId(roomId);
                  setActiveTab('minhacasa');
                }}
                onNavigateToMinhaCasa={() => setActiveTab('minhacasa')}
                problemRooms={rooms.filter((r) => r.problemCount > 0)}
                selectedPhoto={selectedPhoto}
                onClearPhoto={() => setSelectedPhoto(null)}
              />
            )}

            {activeTab === 'problemas' && (
              <DiagnosisScreen
                diagnosis={diagnosis}
                professionals={professionals}
                rooms={rooms}
                selectedRoom={selectedRoomId}
                onSelectRoom={(rId) => setSelectedRoomId(rId)}
                onSelectProfessional={handleBooking}
                onViewProfessionalProfile={(prof) => {
                  setSelectedProfessional(prof);
                  setIsProfileModalOpen(true);
                }}
                onRunNewDiagnosis={() => setActiveTab('inicio')}
              />
            )}

            {activeTab === 'minhacasa' && (
              <MinhaCasaScreen
                rooms={rooms}
                activeRoomId={selectedRoomId}
                onOpenRoomDetail={(rId) => setSelectedRoomId(rId)}
                onBackToOverview={() => setSelectedRoomId('')}
                onReportProblemInRoom={handleReportProblemInRoom}
                onOpenAddRoom={() => setIsAddRoomModalOpen(true)}
                onOpenAddDevice={(rId) => {
                  alert(`Adicionando novo equipamento para o cômodo selecionado.`);
                }}
              />
            )}

            {activeTab === 'agenda' && (
              <AgendaScreen
                appointments={appointments}
                onCancelAppointment={(id) => {
                  setAppointments((prev) => prev.filter((a) => a.id !== id));
                }}
                onNewService={() => setActiveTab('inicio')}
              />
            )}

            {activeTab === 'pagamentos' && (
              <ClientPaymentsScreen
                client={clientProfile}
                paymentMethods={paymentMethods}
                transactions={transactions}
                onAddPaymentMethod={handleAddPaymentMethod}
                onSetDefaultPaymentMethod={handleSetDefaultPaymentMethod}
                onDeletePaymentMethod={handleDeletePaymentMethod}
                onOpenUpgradePlan={() => {
                  alert('Plano atual: Resolva Já Plus (R$ 29,90/mês). Para upgrade para Premium (R$ 49,90/mês com 2 visitas inclusas), o plano foi atualizado!');
                  setClientProfile((prev) => ({ ...prev, plan: 'Resolva Já Premium' }));
                }}
              />
            )}

            {activeTab === 'perfil' && (
              <ProfileScreen
                client={clientProfile}
                onUpdateClient={(updated) => setClientProfile((prev) => ({ ...prev, ...updated }))}
                onDeleteProfile={handleDeleteClientProfile}
                onSwitchToProvider={() => {
                  setCurrentRole('prestador');
                  setActiveTab('inicio');
                }}
                onOpenNewRegistration={() => setIsRegistrationModalOpen(true)}
                onNavigateToPayments={() => setActiveTab('pagamentos')}
              />
            )}
          </>
        )}

        {/* ================= PROVIDER ROLE SCREENS ================= */}
        {currentRole === 'prestador' && (
          <>
            {activeTab === 'inicio' && (
              <ProviderHomeScreen
                provider={providerProfile}
                leads={providerLeads}
                appointments={appointments}
                onSendQuote={handleSendProviderQuote}
                onToggleAvailability={handleToggleProviderAvailability}
                onViewClientPhoto={(url) => {
                  setSelectedPhoto(url);
                  setIsPhotoModalOpen(true);
                }}
              />
            )}

            {activeTab === 'problemas' && (
              <div className="flex flex-col gap-6 max-w-2xl mx-auto pb-16 animate-fadeIn">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#18181b] tracking-tight">
                    Orçamentos & Propostas
                  </h1>
                  <p className="text-xs text-[#71717a]">Acompanhe suas propostas enviadas aos clientes</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-2xl p-4 border border-[#e4e4e7] shadow-xs">
                    <span className="text-2xl font-extrabold text-[#ea580c]">
                      {providerLeads.filter((l) => l.status === 'orcamento_enviado').length}
                    </span>
                    <p className="text-xs text-[#52525b] mt-1 font-semibold">Propostas Enviadas</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 border border-[#e4e4e7] shadow-xs">
                    <span className="text-2xl font-extrabold text-emerald-700">
                      {providerLeads.filter((l) => l.status === 'orcamento_enviado').length > 0
                        ? `${Math.round((appointments.length / providerLeads.filter((l) => l.status === 'orcamento_enviado').length) * 100)}%`
                        : '100%'}
                    </span>
                    <p className="text-xs text-[#52525b] mt-1 font-semibold">Taxa de Conversão</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-bold text-[#18181b]">Histórico de Chamados</h3>
                  {providerLeads.length === 0 ? (
                    <div className="p-6 rounded-2xl border border-dashed border-[#e4e4e7] text-center text-xs text-[#71717a]">
                      Nenhum chamado aberto no momento na sua região de atendimento.
                    </div>
                  ) : (
                    providerLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-white rounded-2xl p-4 border border-[#e4e4e7] shadow-xs flex justify-between items-center"
                      >
                        <div>
                          <h4 className="text-sm font-bold text-[#18181b]">{lead.serviceTitle}</h4>
                          <p className="text-xs text-[#71717a]">{lead.clientName || 'Cliente'} • {lead.neighborhood}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-extrabold text-[#ea580c]">R$ {lead.suggestedBudget}</span>
                          <span className="block text-[10px] font-bold text-emerald-700 uppercase">
                            {lead.status === 'orcamento_enviado' ? 'Proposta Enviada' : 'Aberto'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'agenda' && (
              <AgendaScreen
                appointments={appointments}
                onCancelAppointment={(id) => {
                  setAppointments((prev) => prev.filter((a) => a.id !== id));
                }}
                onNewService={() => setActiveTab('inicio')}
              />
            )}

            {activeTab === 'minhacasa' && (
              <div className="flex flex-col gap-6 max-w-2xl mx-auto pb-16 animate-fadeIn">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#18181b] tracking-tight">
                      Serviços & Especialidades
                    </h1>
                    <p className="text-xs text-[#71717a]">Gerencie sua tabela de preços e área de atuação</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('perfil')}
                    className="text-xs font-bold text-[#ea580c] bg-[#fff7ed] hover:bg-[#ea580c] hover:text-white border border-[#fed7aa] px-3 py-1.5 rounded-full transition-all cursor-pointer"
                  >
                    Editar no Perfil
                  </button>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-[#e4e4e7] shadow-xs flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-[#18181b]">Especialidades Cadastradas</h3>
                    <span className="text-xs font-bold text-emerald-700">Taxa Base: R$ {providerProfile.laborBaseRate}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(providerProfile.specialties || []).map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa] rounded-full text-xs font-bold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'perfil' && (
              <ProviderProfileScreen
                provider={providerProfile}
                onUpdateProvider={(updated) => setProviderProfile((prev) => ({ ...prev, ...updated }))}
                onDeleteProfile={handleDeleteProviderProfile}
                onSwitchToClient={() => {
                  setCurrentRole('cliente');
                  setActiveTab('inicio');
                }}
                onOpenNewRegistration={() => setIsRegistrationModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Bottom & Desktop Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        pendingProblemsCount={pendingProblemsCount}
        currentRole={currentRole}
      />

      {/* Registration Modal for Clients & Providers */}
      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        initialRole={currentRole}
        onRegisterClient={handleRegisterClient}
        onRegisterProvider={handleRegisterProvider}
      />

      {/* Modals */}
      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onTranscriptComplete={(text) => handleFindSolution(text)}
      />

      <PhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onPhotoSelected={(photoUrl) => {
          setSelectedPhoto(photoUrl);
          handleFindSolution('Problema identificado a partir da foto enviada', photoUrl);
        }}
      />

      <GuidedWizardModal
        isOpen={isGuidedWizardOpen}
        onClose={() => setIsGuidedWizardOpen(false)}
        onComplete={(symptomText) => handleFindSolution(symptomText)}
      />

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        professional={selectedProfessional}
        clientAddress={
          clientProfile.address?.street
            ? `${clientProfile.address.street}, ${clientProfile.address.number || ''} ${clientProfile.address.complement || ''} - ${clientProfile.address.neighborhood || ''}, ${clientProfile.address.city || 'São Paulo'}`
            : 'Endereço principal cadastrado'
        }
        serviceTitle={diagnosis?.problemSummary || 'Reparo e manutenção técnica'}
        roomName={diagnosis?.room || 'Residência'}
        onConfirmBooking={handleConfirmBooking}
      />

      <ProfessionalProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        professional={selectedProfessional}
        onHire={handleBooking}
      />

      <AddRoomModal
        isOpen={isAddRoomModalOpen}
        onClose={() => setIsAddRoomModalOpen(false)}
        onAddRoom={handleAddRoom}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
      />
    </div>
  );
}
