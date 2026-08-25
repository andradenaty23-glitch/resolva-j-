import React, { useState, useEffect } from 'react';
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
  TransactionRecord,
  GoogleAuthUser
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
import { matchServiceDemand } from './utils/serviceMatcher';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { InstallAppBanner } from './components/InstallAppBanner';
import { RequireAuth } from './components/RequireAuth';
import { getSavedGoogleUser, saveGoogleUser } from './services/googleAuth';

const HomeScreen = React.lazy(() => import('./components/HomeScreen').then(m => ({ default: m.HomeScreen })));
const DiagnosisScreen = React.lazy(() => import('./components/DiagnosisScreen').then(m => ({ default: m.DiagnosisScreen })));
const MinhaCasaScreen = React.lazy(() => import('./components/MinhaCasaScreen').then(m => ({ default: m.MinhaCasaScreen })));
const AgendaScreen = React.lazy(() => import('./components/AgendaScreen').then(m => ({ default: m.AgendaScreen })));
const ProfileScreen = React.lazy(() => import('./components/ProfileScreen').then(m => ({ default: m.ProfileScreen })));
const ClientPaymentsScreen = React.lazy(() => import('./components/ClientPaymentsScreen').then(m => ({ default: m.ClientPaymentsScreen })));
const ProviderHomeScreen = React.lazy(() => import('./components/ProviderHomeScreen').then(m => ({ default: m.ProviderHomeScreen })));
const ProviderProfileScreen = React.lazy(() => import('./components/ProviderProfileScreen').then(m => ({ default: m.ProviderProfileScreen })));
const RegistrationModal = React.lazy(() => import('./components/RegistrationModal').then(m => ({ default: m.RegistrationModal })));
const GoogleAuthModal = React.lazy(() => import('./components/GoogleAuthModal').then(m => ({ default: m.GoogleAuthModal })));
const InstallAppModal = React.lazy(() => import('./components/InstallAppModal').then(m => ({ default: m.InstallAppModal })));
const AppUpdateModal = React.lazy(() => import('./components/AppUpdateModal').then(m => ({ default: m.AppUpdateModal })));

const VoiceModal = React.lazy(() => import('./components/Modals').then(m => ({ default: m.VoiceModal })));
const PhotoModal = React.lazy(() => import('./components/Modals').then(m => ({ default: m.PhotoModal })));
const GuidedWizardModal = React.lazy(() => import('./components/Modals').then(m => ({ default: m.GuidedWizardModal })));
const BookingModal = React.lazy(() => import('./components/Modals').then(m => ({ default: m.BookingModal })));
const ProfessionalProfileModal = React.lazy(() => import('./components/Modals').then(m => ({ default: m.ProfessionalProfileModal })));
const AddRoomModal = React.lazy(() => import('./components/Modals').then(m => ({ default: m.AddRoomModal })));
const NotificationsModal = React.lazy(() => import('./components/Modals').then(m => ({ default: m.NotificationsModal })));

export default function App() {
  // Google Authentication State
  const [googleUser, setGoogleUser] = useState<GoogleAuthUser | null>(() => getSavedGoogleUser());
  const [isGoogleAuthModalOpen, setIsGoogleAuthModalOpen] = useState(false);
  
  // Active Role and Profiles (Strictly isolated between Cliente and Prestador)
  const [currentRole, setCurrentRole] = useState<UserRole>(() => googleUser?.role || 'cliente');
  const [authModalRole, setAuthModalRole] = useState<UserRole>(() => googleUser?.role || 'cliente');
  const [clientProfile, setClientProfile] = useState<ClientProfile>(INITIAL_CLIENT_PROFILE);
  const [providerProfile, setProviderProfile] = useState<ProviderProfile>(INITIAL_PROVIDER_PROFILE);
  const [providerLeads, setProviderLeads] = useState<ProviderJobLead[]>(INITIAL_PROVIDER_LEADS);

  const handleOpenGoogleAuth = (role?: UserRole) => {
    const targetRole = role || currentRole;
    setAuthModalRole(targetRole);
    setIsGoogleAuthModalOpen(true);
  };

  // App Installation & Update State (PWA / Mobile)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallAppModalOpen, setIsInstallAppModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(true);

  // Client Data States
  const [activeTab, setActiveTab] = useState<TabType>('inicio');
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(INITIAL_DIAGNOSIS);
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

  // PWA beforeinstallprompt event handling
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
      setNotifications((prev) => [
        {
          id: `notif-app-${Date.now()}`,
          title: 'Aplicativo Instalado com Sucesso!',
          message: 'RESOLVA JÁ agora está pronto para uso direto da sua tela inicial com carregamento ultra rápido.',
          time: 'Agora mesmo',
          read: false,
          type: 'success'
        },
        ...prev
      ]);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Handle Google Auth Login
  const handleGoogleLoginSuccess = (user: GoogleAuthUser) => {
    setGoogleUser(user);
    saveGoogleUser(user);

    if (user.role === 'cliente') {
      setCurrentRole('cliente');
      setClientProfile((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
        avatar: user.picture || prev.avatar
      }));
    } else {
      setCurrentRole('prestador');
      setProviderProfile((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
        avatar: user.picture || prev.avatar,
        verified: true
      }));
    }

    setNotifications((prev) => [
      {
        id: `notif-google-${Date.now()}`,
        title: 'Autenticado com o Google',
        message: `Bem-vindo(a), ${user.name}! Seus dados estão sincronizados com sua conta Google.`,
        time: 'Agora',
        read: false,
        type: 'success'
      },
      ...prev
    ]);
  };

  const handleGoogleLogout = () => {
    setGoogleUser(null);
    saveGoogleUser(null);
    setNotifications((prev) => [
      {
        id: `notif-logout-${Date.now()}`,
        title: 'Sessão Google Encerrada',
        message: 'Você se desconectou com sucesso da sua conta Google.',
        time: 'Agora',
        read: false,
        type: 'info'
      },
      ...prev
    ]);
  };

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
    const match = matchServiceDemand(problemText, imageSrc);

    const newDiagnosis: DiagnosisResult = {
      id: `diag-${Date.now()}`,
      title: 'Diagnóstico Concluído',
      problemSummary: match.summary,
      category: match.category,
      professionalType: match.profType,
      urgency: match.urgency,
      urgencyPercentage: match.urgencyPercentage,
      room: match.room,
      diyTips: match.diyTips,
      estimatedCostRange: match.costRange,
      createdAt: 'Agora mesmo'
    };

    setDiagnosis(newDiagnosis);
    setSelectedRoomId(match.room);
    setProfessionals(match.professionals);
    setActiveTab('problemas');

    // Also automatically create an incoming real lead for providers
    const newLead: ProviderJobLead = {
      id: `lead-${Date.now()}`,
      clientName: clientProfile.name || 'Cliente Resolva Já',
      serviceTitle: problemText || match.summary,
      category: match.category,
      room: match.room === 'cozinha' ? 'Cozinha' : match.room === 'banheiro' ? 'Banheiro' : match.room === 'quarto1' ? 'Quarto' : match.room === 'lavanderia' ? 'Lavanderia' : 'Residência',
      neighborhood: clientProfile.address?.neighborhood
        ? `${clientProfile.address.neighborhood} - ${clientProfile.address.city || 'SP'}`
        : 'Sua Região de Atendimento',
      distanceKm: 2.1,
      urgency: match.urgency,
      suggestedBudget: match.costRange.min,
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
      handleFindSolution(matched.name);
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

    const providerPro: Professional = {
      id: `prof-provider-${Date.now()}`,
      name: providerProfile.name || 'Prestador Credenciado',
      role: providerProfile.category || 'Profissional Credenciado',
      avatar: providerProfile.avatar || '',
      rating: providerProfile.rating || 5.0,
      matchPercentage: 100,
      priceLevel: value < 150 ? '$' : value < 300 ? '$$' : '$$$',
      trustIndex: providerProfile.trustIndex || 100,
      recommendationReason: providerProfile.bio || 'Proposta personalizada enviada diretamente pelo prestador credenciado.',
      availability: 'Hoje',
      verified: true,
      laborCost: value,
      materialsCost: 0,
      totalCost: value,
      phone: providerProfile.phone || '(11) 99999-0000',
      reviewsCount: providerProfile.reviewsCount || 1,
      completedJobs: providerProfile.completedJobsCount || 1,
      specialties: providerProfile.specialties || ['Atendimento Residencial']
    };

    setProfessionals((prev) => [providerPro, ...prev.filter((p) => p.name !== providerPro.name)]);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Proposta Enviada com Sucesso',
      message: `Você enviou uma proposta de R$ ${value} para o chamado selecionado. O cliente receberá a notificação imediatamente.`,
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

  const handleUpdateAppointmentStatus = (id: string, newStatus: 'confirmado' | 'a_caminho' | 'concluido' | 'cancelado') => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    if (newStatus === 'concluido') {
      const apt = appointments.find((a) => a.id === id);
      if (apt) {
        setProviderProfile((prev) => ({
          ...prev,
          completedJobsCount: (prev.completedJobsCount || 0) + 1,
          totalEarningsMonth: (prev.totalEarningsMonth || 0) + (apt.totalCost || 0)
        }));
        const newNotif: NotificationItem = {
          id: `notif-${Date.now()}`,
          title: 'Serviço Concluído com Sucesso',
          message: `Atendimento "${apt.serviceTitle}" finalizado. Pagamento de R$ ${apt.totalCost} liberado da custódia.`,
          time: 'Agora mesmo',
          read: false,
          type: 'success'
        };
        setNotifications((prev) => [newNotif, ...prev]);
      }
    }
  };

  const handleAddManualAppointment = (apt: Appointment) => {
    setAppointments((prev) => [apt, ...prev]);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: apt.isBlockedSlot ? 'Horário Bloqueado' : 'Agendamento Criado',
      message: apt.isBlockedSlot
        ? `Horário bloqueado com sucesso na sua agenda.`
        : `Atendimento "${apt.serviceTitle}" adicionado à sua escala.`,
      time: 'Agora mesmo',
      read: false,
      type: 'info'
    };
    setNotifications((prev) => [newNotif, ...prev]);
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
      {/* Top App Header with Role Switcher & Google Auth / App install CTA */}
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
        googleUser={googleUser}
        onOpenGoogleAuth={() => handleOpenGoogleAuth(currentRole)}
        onOpenInstallModal={() => setIsInstallAppModalOpen(true)}
        onOpenUpdateModal={() => setIsUpdateModalOpen(true)}
        onOpenSystemStatus={() => {
          alert(
            currentRole === 'cliente'
              ? 'Sistema SOLVI IoT Online • 14 sensores conectados no imóvel.'
              : 'Solvi PRO Radar Ativo • 8 chamados abertos no seu raio de atendimento.'
          );
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-3 sm:px-5 pt-2 sm:pt-3 pb-24 md:pb-10 md:pl-28 max-w-3xl mx-auto w-full flex flex-col gap-3.5">
        <React.Suspense fallback={
          <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-3">
            <div className="animate-spin w-8 h-8 border-4 border-[#ea580c] border-t-transparent rounded-full" />
            <span className="text-xs text-slate-500 font-medium">Carregando interface...</span>
          </div>
        }>
          {/* Non-intrusive App Installation Banner */}
        {showInstallBanner && (
          <InstallAppBanner
            onOpenInstallModal={() => setIsInstallAppModalOpen(true)}
            onDismiss={() => setShowInstallBanner(false)}
            deferredPrompt={deferredPrompt}
          />
        )}

        {(!googleUser && (
          (currentRole === 'cliente' && ['agenda', 'pagamentos', 'minhacasa', 'perfil'].includes(activeTab)) ||
          (currentRole === 'prestador' && ['inicio', 'problemas', 'agenda', 'minhacasa', 'perfil'].includes(activeTab))
        )) ? (
          <RequireAuth user={googleUser} onOpenAuth={() => handleOpenGoogleAuth(currentRole)}>
            <div />
          </RequireAuth>
        ) : (
          <>
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
                onSelectQuickDemand={handleFindSolution}
                onClearProfessionals={() => setProfessionals([])}
                onClearDiagnosis={() => {
                  setDiagnosis(null);
                  setProfessionals([]);
                }}
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
                role="cliente"
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
                notifications={notifications}
                onUpdateClient={(updated) => setClientProfile((prev) => ({ ...prev, ...updated }))}
                onDeleteProfile={handleDeleteClientProfile}
                onSwitchToProvider={() => {
                  setCurrentRole('prestador');
                  setActiveTab('inicio');
                }}
                onOpenNewRegistration={() => setIsRegistrationModalOpen(true)}
                onNavigateToPayments={() => setActiveTab('pagamentos')}
                googleUser={googleUser}
                onOpenGoogleAuth={() => handleOpenGoogleAuth('cliente')}
                onDisconnectGoogle={handleGoogleLogout}
                onOpenInstallModal={() => setIsInstallAppModalOpen(true)}
                onOpenUpdateModal={() => setIsUpdateModalOpen(true)}
                onMarkAllNotificationsAsRead={() => {
                  setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                }}
                onClearAllNotifications={() => {
                  setNotifications([]);
                }}
                onAddNotification={(newNotif) => {
                  setNotifications((prev) => [newNotif, ...prev]);
                }}
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
                role="prestador"
                appointments={appointments}
                onCancelAppointment={(id) => {
                  setAppointments((prev) => prev.filter((a) => a.id !== id));
                }}
                onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
                onNewService={() => setActiveTab('inicio')}
                onAddManualAppointment={handleAddManualAppointment}
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
                googleUser={googleUser}
                onOpenGoogleAuth={() => handleOpenGoogleAuth('prestador')}
                onDisconnectGoogle={handleGoogleLogout}
                onOpenInstallModal={() => setIsInstallAppModalOpen(true)}
              />
            )}
          </>
        )}
        </>
        )}
        </React.Suspense>
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

      <React.Suspense fallback={null}>
      {/* Registration Modal for Clients & Providers */}
      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        initialRole={currentRole}
        onRegisterClient={handleRegisterClient}
        onRegisterProvider={handleRegisterProvider}
        onOpenGoogleAuth={(role) => {
          setIsRegistrationModalOpen(false);
          handleOpenGoogleAuth(role);
        }}
      />

      {/* Google Authentication Modal */}
      <GoogleAuthModal
        isOpen={isGoogleAuthModalOpen}
        onClose={() => setIsGoogleAuthModalOpen(false)}
        onSuccess={handleGoogleLoginSuccess}
        initialRole={authModalRole}
      />

      {/* App Installation Modal (PWA & APK Capacitor Guide) */}
      <InstallAppModal
        isOpen={isInstallAppModalOpen}
        onClose={() => setIsInstallAppModalOpen(false)}
        deferredPrompt={deferredPrompt}
      />

      {/* App Update Modal */}
      <AppUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
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
        onPhotoSelected={(photoUrl, description) => {
          setSelectedPhoto(photoUrl);
          handleFindSolution(description || 'Problema identificado a partir da foto enviada', photoUrl);
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
        clientName={clientProfile.name || 'Cliente Resolva Já'}
        clientPhone={clientProfile.phone || '(11) 98765-4321'}
        clientAvatar={clientProfile.avatar}
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
      </React.Suspense>
    </div>
  );
}
