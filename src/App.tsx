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
  GoogleAuthUser,
  CategoriaDoc,
  ServicoDoc,
  SolicitacaoDoc,
  FavoritoDoc,
  AvaliacaoDoc,
  UsuarioDoc,
  TipoUsuario
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
import {
  getSavedClientUser,
  saveClientUser,
  getSavedProviderUser,
  saveProviderUser,
  getSavedClientProfile,
  saveClientProfile,
  getSavedProviderProfile,
  saveProviderProfile,
  logoutUser
} from './services/googleAuth';
import {
  onFirebaseAuthStateChanged,
  syncUserDocument,
  logoutFirebaseAuth,
  isMasterAdmin
} from './services/firebaseAuth';
import {
  testFirestoreConnection,
  seedDefaultCategoriasIfEmpty,
  subscribeCategorias,
  subscribeServicos,
  subscribeProfissionais,
  subscribeSolicitacoesCliente,
  subscribeSolicitacoesProfissional,
  subscribeFavoritos,
  subscribeNotificacoes,
  updateSolicitacaoStatus,
  cancelSolicitacao,
  createNotificacao,
  deleteUsuarioByEmail,
  purgeAllDataByEmail,
  createAgendamentoInDatabase,
  deleteAgendamentoFromDatabase,
  mapSolicitacaoToAppointment
} from './services/firebaseDatabase';

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
const AdminPanelScreen = React.lazy(() => import('./components/AdminPanelScreen').then(m => ({ default: m.AdminPanelScreen })));
const ServiceModal = React.lazy(() => import('./components/ServiceModal').then(m => ({ default: m.ServiceModal })));
const RequestServiceModal = React.lazy(() => import('./components/RequestServiceModal').then(m => ({ default: m.RequestServiceModal })));
const ReviewModal = React.lazy(() => import('./components/ReviewModal').then(m => ({ default: m.ReviewModal })));

const VoiceModal = React.lazy(() => import('./components/Modals').then(m => ({ default: m.VoiceModal })));
const PhotoModal = React.lazy(() => import('./components/Modals').then(m => ({ default: m.PhotoModal })));
const GuidedWizardModal = React.lazy(() => import('./components/Modals').then(m => ({ default: m.GuidedWizardModal })));
const BookingModal = React.lazy(() => import('./components/Modals').then(m => ({ default: m.BookingModal })));
const ProfessionalProfileModal = React.lazy(() => import('./components/Modals').then(m => ({ default: m.ProfessionalProfileModal })));
const AddRoomModal = React.lazy(() => import('./components/Modals').then(m => ({ default: m.AddRoomModal })));
const NotificationsModal = React.lazy(() => import('./components/Modals').then(m => ({ default: m.NotificationsModal })));

export default function App() {
  // Isolated Authentication Sessions for Cliente and Prestador PRO
  const [clientUser, setClientUser] = useState<GoogleAuthUser | null>(() => getSavedClientUser());
  const [providerUser, setProviderUser] = useState<GoogleAuthUser | null>(() => getSavedProviderUser());

  // Firebase Real-Time Data States
  const [firebaseCategorias, setFirebaseCategorias] = useState<CategoriaDoc[]>([]);
  const [firebaseServicos, setFirebaseServicos] = useState<ServicoDoc[]>([]);
  const [firebaseProfissionais, setFirebaseProfissionais] = useState<UsuarioDoc[]>([]);
  const [firebaseSolicitacoes, setFirebaseSolicitacoes] = useState<SolicitacaoDoc[]>([]);
  const [firebaseFavoritos, setFirebaseFavoritos] = useState<FavoritoDoc[]>([]);
  const [firebaseUserDoc, setFirebaseUserDoc] = useState<UsuarioDoc | null>(null);
  const [isAdminModeOpen, setIsAdminModeOpen] = useState(false);

  // Firebase Modals
  const [selectedServiceToRequest, setSelectedServiceToRequest] = useState<ServicoDoc | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedSolicitacaoToReview, setSelectedSolicitacaoToReview] = useState<SolicitacaoDoc | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isCreateServiceModalOpen, setIsCreateServiceModalOpen] = useState(false);

  // Isolated Profiles for Cliente and Prestador PRO
  const [clientProfile, setClientProfile] = useState<ClientProfile>(() => getSavedClientProfile());
  const [providerProfile, setProviderProfile] = useState<ProviderProfile>(() => getSavedProviderProfile());
  const [providerLeads, setProviderLeads] = useState<ProviderJobLead[]>(INITIAL_PROVIDER_LEADS);

  // Active Role and Auth Modal State
  const [currentRole, setCurrentRole] = useState<UserRole>('cliente');
  const [authModalRole, setAuthModalRole] = useState<UserRole>('cliente');
  const [isGoogleAuthModalOpen, setIsGoogleAuthModalOpen] = useState(false);

  // Active user depending on role
  const currentAuthUser = currentRole === 'cliente' ? clientUser : providerUser;

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
  const [isSyncingAgenda, setIsSyncingAgenda] = useState(false);

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

  // 1. Initialize Firebase Realtime & Subscriptions
  useEffect(() => {
    // Validate connection to Firestore on boot
    testFirestoreConnection().catch(console.error);

    // Seed initial categories if empty
    seedDefaultCategoriasIfEmpty().catch(console.error);

    // Subscribe to Categorias
    const unsubCategorias = subscribeCategorias((cats) => {
      setFirebaseCategorias(cats);
    });

    // Subscribe to Servicos
    const unsubServicos = subscribeServicos((servs) => {
      setFirebaseServicos(servs);
    });

    // Subscribe to Profissionais (users with role 'profissional')
    const unsubProfissionais = subscribeProfissionais((profs) => {
      setFirebaseProfissionais(profs);
    });

    return () => {
      unsubCategorias();
      unsubServicos();
      unsubProfissionais();
    };
  }, []);

  // 2. Firebase Auth Listener
  useEffect(() => {
    const unsubAuth = onFirebaseAuthStateChanged(async (sbUser, userDoc) => {
      if (sbUser && userDoc) {
        setFirebaseUserDoc(userDoc);
        const mappedAuthUser: GoogleAuthUser = {
          id: userDoc.uid,
          email: userDoc.email,
          name: userDoc.nome,
          picture: userDoc.foto || '',
          role: userDoc.tipo === 'profissional' ? 'prestador' : 'cliente',
          tipo: userDoc.tipo,
          authProvider: 'google',
          verifiedEmail: true,
          connectedAt: userDoc.criadoEm || new Date().toISOString()
        };

        if (userDoc.tipo === 'profissional') {
          setProviderUser(mappedAuthUser);
          saveProviderUser(mappedAuthUser);
          setProviderProfile((prev) => {
            const next = {
              ...prev,
              id: userDoc.uid,
              name: userDoc.nome,
              email: userDoc.email,
              phone: userDoc.telefone || prev.phone,
              avatar: userDoc.foto || prev.avatar,
              verified: true
            };
            saveProviderProfile(next);
            return next;
          });
        } else {
          setClientUser(mappedAuthUser);
          saveClientUser(mappedAuthUser);
          setClientProfile((prev) => {
            const next = {
              ...prev,
              id: userDoc.uid,
              name: userDoc.nome,
              email: userDoc.email,
              phone: userDoc.telefone || prev.phone,
              avatar: userDoc.foto || prev.avatar
            };
            saveClientProfile(next);
            return next;
          });
        }
      }
    });

    return () => unsubAuth();
  }, []);

  // 3. User Specific Subscriptions (Solicitações, Favoritos, Notificações)
  useEffect(() => {
    let unsubSolicitacoes = () => {};
    let unsubFavs = () => {};
    let unsubNotifs = () => {};

    if (firebaseUserDoc && firebaseUserDoc.uid) {
      const activeUid = firebaseUserDoc.uid;
      if (currentRole === 'cliente') {
        unsubSolicitacoes = subscribeSolicitacoesCliente(activeUid, (sols) => {
          setFirebaseSolicitacoes(sols);
        });
        unsubFavs = subscribeFavoritos(activeUid, (favs) => {
          setFirebaseFavoritos(favs);
        });
        unsubNotifs = subscribeNotificacoes(activeUid, (notifs) => {
          if (notifs.length > 0) {
            const mapped: NotificationItem[] = notifs.map((n) => ({
              id: n.id,
              title: n.titulo,
              message: n.mensagem,
              time: 'Hoje',
              read: n.lida,
              type: n.tipo === 'success' ? 'success' : n.tipo === 'alert' || n.tipo === 'warning' ? 'alert' : 'info'
            }));
            setNotifications((prev) => [...mapped, ...prev.filter((p) => !notifs.some((n) => n.id === p.id))]);
          }
        });
      } else if (currentRole === 'prestador') {
        unsubSolicitacoes = subscribeSolicitacoesProfissional(activeUid, (sols) => {
          setFirebaseSolicitacoes(sols);
        });
        unsubNotifs = subscribeNotificacoes(activeUid, (notifs) => {
          if (notifs.length > 0) {
            const mapped: NotificationItem[] = notifs.map((n) => ({
              id: n.id,
              title: n.titulo,
              message: n.mensagem,
              time: 'Hoje',
              read: n.lida,
              type: n.tipo === 'success' ? 'success' : n.tipo === 'alert' || n.tipo === 'warning' ? 'alert' : 'info'
            }));
            setNotifications((prev) => [...mapped, ...prev.filter((p) => !notifs.some((n) => n.id === p.id))]);
          }
        });
      }
    }

    return () => {
      unsubSolicitacoes();
      unsubFavs();
      unsubNotifs();
    };
  }, [currentRole, firebaseUserDoc]);

  // Manual refresh / force sync trigger for agenda
  const handleRefreshAgenda = async () => {
    setIsSyncingAgenda(true);
    try {
      await testFirestoreConnection();
    } catch (e) {
      console.warn('Sync connection check:', e);
    } finally {
      setTimeout(() => setIsSyncingAgenda(false), 600);
    }
  };

  // Map Firebase Solicitacoes to Appointments for Agenda
  const combinedAppointments: Appointment[] = React.useMemo(() => {
    if (firebaseSolicitacoes.length === 0) {
      return appointments;
    }

    const fromFirebase: Appointment[] = firebaseSolicitacoes.map((sol) =>
      mapSolicitacaoToAppointment(sol)
    );

    return [...fromFirebase, ...appointments.filter((a) => !fromFirebase.some((f) => f.id === a.id))];
  }, [firebaseSolicitacoes, appointments]);

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

  // Handle Updates with Persistent Storage
  const handleUpdateClient = (updated: Partial<ClientProfile>) => {
    setClientProfile((prev) => {
      const next = { ...prev, ...updated };
      saveClientProfile(next);
      return next;
    });
  };

  const handleUpdateProvider = (updated: Partial<ProviderProfile>) => {
    setProviderProfile((prev) => {
      const next = { ...prev, ...updated };
      saveProviderProfile(next);
      return next;
    });
  };

  // Handle Google Auth Login - strictly isolated per role
  const handleGoogleLoginSuccess = (user: GoogleAuthUser) => {
    if (user.role === 'cliente' || user.tipo === 'cliente' || user.tipo === 'admin') {
      setClientUser(user);
      saveClientUser(user);
      setCurrentRole('cliente');
      setClientProfile((prev) => {
        const updated: ClientProfile = {
          ...prev,
          id: user.id || prev.id,
          name: user.name || prev.name,
          email: user.email || prev.email,
          avatar: user.picture || prev.avatar
        };
        saveClientProfile(updated);
        return updated;
      });
    } else {
      setProviderUser(user);
      saveProviderUser(user);
      setCurrentRole('prestador');
      setProviderProfile((prev) => {
        const updated: ProviderProfile = {
          ...prev,
          id: user.id || prev.id,
          name: user.name || prev.name,
          email: user.email || prev.email,
          avatar: user.picture || prev.avatar,
          verified: true
        };
        saveProviderProfile(updated);
        return updated;
      });
    }

    setNotifications((prev) => [
      {
        id: `notif-google-${Date.now()}`,
        title: `Autenticado como ${user.role === 'cliente' ? 'Cliente' : 'Prestador PRO'}`,
        message: `Bem-vindo(a), ${user.name}! Sessão e dados salvos no seu perfil ${user.role === 'cliente' ? 'de Cliente' : 'Profissional PRO'}.`,
        time: 'Agora',
        read: false,
        type: 'success'
      },
      ...prev
    ]);
  };

  const handleLogoutRole = async (role: UserRole) => {
    await logoutFirebaseAuth();
    if (role === 'cliente') {
      const token = clientUser?.token;
      setClientUser(null);
      saveClientUser(null);
      await logoutUser('cliente', token);
    } else {
      const token = providerUser?.token;
      setProviderUser(null);
      saveProviderUser(null);
      await logoutUser('prestador', token);
    }

    setNotifications((prev) => [
      {
        id: `notif-logout-${Date.now()}`,
        title: `Sessão de ${role === 'cliente' ? 'Cliente' : 'Prestador PRO'} Encerrada`,
        message: 'Você se desconectou com sucesso deste perfil.',
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
  const providerPendingCount =
    providerLeads.filter((l) => l.status === 'aberto').length +
    firebaseSolicitacoes.filter((s) => s.status === 'pendente').length;

  // Handlers for Profile Deletion
  const handleDeleteClientProfile = () => {
    const emptyClient: ClientProfile = {
      ...INITIAL_CLIENT_PROFILE,
      id: `client-${Date.now()}`,
      name: 'Cliente Resolva Já',
      email: '',
      phone: '',
      avatar: '',
      cpf: ''
    };
    setClientProfile(emptyClient);
    saveClientProfile(emptyClient);
    setClientUser(null);
    saveClientUser(null);
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
      ...INITIAL_PROVIDER_PROFILE,
      id: `prov-${Date.now()}`,
      name: 'Prestador de Serviços',
      email: '',
      phone: '',
      document: '',
      avatar: ''
    };
    setProviderProfile(emptyProvider);
    saveProviderProfile(emptyProvider);
    setProviderUser(null);
    saveProviderUser(null);
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
    const match = matchServiceDemand(problemText, imageSrc, firebaseServicos, firebaseProfissionais);

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

  const handleSelectCategory = (categoryId: ProblemCategory) => {
    const demand = SERVICE_DEMANDS_CATALOG.find((d) => d.id === categoryId);
    if (demand) {
      handleFindSolution(demand.popularIssues[0] || demand.name);
    }
  };

  const handleReportProblemInRoom = (roomId: string, problemText: string) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === roomId
          ? {
              ...r,
              problemCount: r.problemCount + 1,
              statusText: problemText
            }
          : r
      )
    );
    handleFindSolution(problemText);
  };

  const handleAddRoom = (name: string, type: any) => {
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      name,
      icon: 'Home',
      status: 'normal',
      statusText: 'Novo cômodo adicionado',
      problemCount: 0,
      items: [
        {
          id: `dev-${Date.now()}`,
          name: 'Sensor Geral',
          brand: 'Resolva Já IoT',
          lastReview: 'Hoje',
          status: 'ok',
          statusText: 'Operando normalmente',
          iconName: 'Cpu'
        }
      ]
    };
    setRooms((prev) => [...prev, newRoom]);
    setActiveTab('minhacasa');
    setSelectedRoomId(newRoom.id);
  };

  const handleBooking = (prof: Professional) => {
    setSelectedProfessional(prof);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = (date: string, time: string, note?: string) => {
    if (!selectedProfessional) return;

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      clientName: clientProfile.name || 'Cliente Resolva Já',
      clientPhone: clientProfile.phone || '(11) 98765-4321',
      professionalName: selectedProfessional.name,
      professionalAvatar: selectedProfessional.avatar,
      role: selectedProfessional.role,
      date,
      time,
      serviceTitle: diagnosis?.problemSummary || 'Reparo e manutenção técnica',
      room: diagnosis?.room || 'Residência',
      totalCost: (selectedProfessional.laborCost || 150) * 1.5,
      status: 'confirmado',
      address: clientProfile.address?.street
        ? `${clientProfile.address.street}, ${clientProfile.address.number || ''}`
        : 'Rua das Flores, 123 - Jardins'
    };

    setAppointments((prev) => [newAppointment, ...prev]);

    // Direct synchronization with Firestore Database
    const clienteId = firebaseUserDoc?.uid || clientProfile.id || 'cliente-anonimo';
    const profId = selectedProfessional.id || 'prof-1';
    createAgendamentoInDatabase({
      clienteId,
      clienteNome: clientProfile.name || 'Cliente Resolva Já',
      clienteTelefone: clientProfile.phone || '(11) 98765-4321',
      profissionalId: profId,
      profissionalNome: selectedProfessional.name,
      profissionalFoto: selectedProfessional.avatar,
      descricao: diagnosis?.problemSummary || 'Reparo e manutenção técnica',
      servicoNome: selectedProfessional.role,
      data,
      horario: time,
      endereco: newAppointment.address,
      valorEstimado: newAppointment.totalCost,
      status: 'aceita',
      room: newAppointment.room
    }).catch((err) => console.warn('Sync booking to Firestore database:', err));

    const newTransaction: TransactionRecord = {
      id: `tx-${Date.now()}`,
      date: 'Hoje',
      serviceTitle: newAppointment.serviceTitle,
      providerName: newAppointment.professionalName,
      providerAvatar: selectedProfessional.avatar,
      providerCategory: selectedProfessional.role,
      amount: newAppointment.totalCost || 225,
      status: 'em_custodia',
      paymentMethodType: 'credit_card',
      paymentMethodDetails: 'Mastercard •••• 4242',
      invoiceCode: `INV-${Date.now().toString().slice(-6)}`,
      warrantyUntil: '30 dias de garantia'
    };
    setTransactions((prev) => [newTransaction, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Agendamento Confirmado no Firebase',
      message: `Atendimento agendado com ${selectedProfessional.name} para ${date} às ${time}. Pagamento protegido em custódia.`,
      time: 'Agora mesmo',
      read: false,
      type: 'success'
    };
    setNotifications((prev) => [newNotif, ...prev]);

    setIsBookingModalOpen(false);
    setActiveTab('agenda');
  };

  // Payment Methods Handlers
  const handleAddPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethods((prev) => [...prev, method]);
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

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Provider Actions
  const handleSendProviderQuote = (leadId: string, value: number) => {
    setProviderLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: 'orcamento_enviado', suggestedBudget: value } : l))
    );

    const targetLead = providerLeads.find((l) => l.id === leadId);
    if (targetLead) {
      const newApt: Appointment = {
        id: `apt-prov-${Date.now()}`,
        clientName: targetLead.clientName,
        clientPhone: '(11) 98765-4321',
        professionalName: providerProfile.name,
        professionalAvatar: providerProfile.avatar,
        role: providerProfile.specialties?.[0] || 'Técnico Especialista',
        date: 'Amanhã',
        time: '14:00 - 16:00',
        serviceTitle: targetLead.serviceTitle,
        room: targetLead.room,
        totalCost: value,
        status: 'confirmado',
        address: `${targetLead.neighborhood}`
      };
      setAppointments((prev) => [newApt, ...prev]);
    }

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

  const handleUpdateAppointmentStatus = async (id: string, newStatus: 'confirmado' | 'a_caminho' | 'concluido' | 'cancelado') => {
    // Check if this is a real Firebase solicitation
    const sol = firebaseSolicitacoes.find((s) => s.id === id);
    if (sol) {
      const statusMap: Record<string, any> = {
        confirmado: 'aceita',
        a_caminho: 'em_andamento',
        concluido: 'concluida',
        cancelado: 'cancelada'
      };
      try {
        await updateSolicitacaoStatus(id, statusMap[newStatus], providerProfile.id);
      } catch (err) {
        console.error('Error updating firebase solicitation status:', err);
      }
    }

    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );

    if (newStatus === 'concluido') {
      const apt = combinedAppointments.find((a) => a.id === id);
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

    // Persist to Firestore database
    const currentUid = firebaseUserDoc?.uid || providerProfile.id || 'prof-1';
    createAgendamentoInDatabase({
      clienteId: apt.isBlockedSlot ? currentUid : (firebaseUserDoc?.uid || 'cliente-direto'),
      clienteNome: apt.clientName || 'Cliente Direto',
      clienteTelefone: apt.clientPhone || '(11) 98765-4321',
      profissionalId: currentUid,
      profissionalNome: providerProfile.name || 'Profissional Resolva Já',
      profissionalFoto: providerProfile.avatar,
      descricao: apt.serviceTitle,
      servicoNome: apt.role || (apt.isBlockedSlot ? 'Bloqueio de Horário' : 'Atendimento Direto'),
      data: apt.date,
      horario: apt.time,
      endereco: apt.address || 'Local combinado',
      valorEstimado: apt.totalCost || 0,
      isBlockedSlot: apt.isBlockedSlot,
      blockReason: apt.blockReason,
      status: 'aceita',
      room: apt.room || 'Residência'
    }).catch((err) => console.warn('Sync manual appointment to Firestore database:', err));

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: apt.isBlockedSlot ? 'Horário Bloqueado no Banco' : 'Agendamento Salvo no Banco',
      message: apt.isBlockedSlot
        ? `Horário bloqueado e sincronizado com o banco de dados.`
        : `Atendimento "${apt.serviceTitle}" salvo e sincronizado na sua agenda.`,
      time: 'Agora mesmo',
      read: false,
      type: 'info'
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Registration Handlers
  const handleRegisterClient = (newClient: ClientProfile) => {
    setClientProfile(newClient);
    saveClientProfile(newClient);
    const user: GoogleAuthUser = {
      id: newClient.id,
      name: newClient.name,
      email: newClient.email,
      picture: newClient.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(newClient.name)}&background=ea580c&color=ffffff&bold=true`,
      role: 'cliente',
      authProvider: 'email',
      verifiedEmail: true,
      connectedAt: new Date().toISOString()
    };
    setClientUser(user);
    saveClientUser(user);
    setCurrentRole('cliente');
    setActiveTab('inicio');

    // Sync to Firebase usuarios table
    if (newClient.email) {
      syncUserDocument(user, 'cliente', {
        telefone: newClient.phone,
        cidade: newClient.address?.city || 'São Paulo',
        bairro: newClient.address?.neighborhood || 'Centro'
      }).catch((err) => console.warn('Could not sync client to Firebase:', err));
    }

    setNotifications((prev) => [
      {
        id: `notif-client-reg-${Date.now()}`,
        title: 'Bem-vindo(a) ao RESOLVA JÁ!',
        message: `Olá, ${newClient.name}! Seu cadastro de cliente foi concluído com sucesso.`,
        time: 'Agora mesmo',
        read: false,
        type: 'success'
      },
      ...prev
    ]);
  };

  const handleRegisterProvider = (newProvider: ProviderProfile) => {
    setProviderProfile(newProvider);
    saveProviderProfile(newProvider);
    const user: GoogleAuthUser = {
      id: newProvider.id,
      name: newProvider.name,
      email: newProvider.email,
      picture: newProvider.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(newProvider.name)}&background=16a34a&color=ffffff&bold=true`,
      role: 'prestador',
      authProvider: 'email',
      verifiedEmail: true,
      connectedAt: new Date().toISOString()
    };
    setProviderUser(user);
    saveProviderUser(user);
    setCurrentRole('prestador');
    setActiveTab('inicio');

    // Sync to Firebase usuarios table
    if (newProvider.email) {
      syncUserDocument(user, 'profissional', {
        telefone: newProvider.phone,
        cidade: 'São Paulo',
        bairro: 'Centro'
      }).catch((err) => console.warn('Could not sync provider to Firebase:', err));
    }

    setNotifications((prev) => [
      {
        id: `notif-prov-reg-${Date.now()}`,
        title: 'Credenciamento Concluído!',
        message: `Parabéns, ${newProvider.name}! Seu perfil profissional está ativo no painel Resolva Já.`,
        time: 'Agora mesmo',
        read: false,
        type: 'success'
      },
      ...prev
    ]);
  };

  const isCurrentUserAdmin = Boolean(
    isMasterAdmin(firebaseUserDoc?.email) ||
    isMasterAdmin(currentAuthUser?.email) ||
    isMasterAdmin(clientUser?.email) ||
    isMasterAdmin(providerUser?.email)
  );

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
        googleUser={currentAuthUser}
        onOpenGoogleAuth={() => handleOpenGoogleAuth(currentRole)}
        onOpenInstallModal={() => setIsInstallAppModalOpen(true)}
        onOpenUpdateModal={() => setIsUpdateModalOpen(true)}
        onOpenAdminPanel={() => setIsAdminModeOpen(true)}
        isAdmin={isCurrentUserAdmin}
        onOpenSystemStatus={() => {
          alert(
            currentRole === 'cliente'
              ? 'Sistema RESOLVA JÁ IoT Online • 14 sensores conectados no imóvel.'
              : 'RESOLVA JÁ PRO Radar Ativo • Chamados abertos no seu raio de atendimento.'
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
                  firebaseServicos={firebaseServicos}
                  firebaseCategorias={firebaseCategorias}
                  clientProfile={clientProfile}
                  favoritos={firebaseFavoritos}
                  onRequestService={(servico) => {
                    setSelectedServiceToRequest(servico);
                    setIsRequestModalOpen(true);
                  }}
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
                  appointments={combinedAppointments}
                  isSyncing={isSyncingAgenda}
                  onRefreshSync={handleRefreshAgenda}
                  onCancelAppointment={async (id) => {
                    const sol = firebaseSolicitacoes.find((s) => s.id === id);
                    if (sol) {
                      await deleteAgendamentoFromDatabase(id).catch(() => cancelSolicitacao(id));
                    }
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
                  onUpdateClient={handleUpdateClient}
                  onDeleteProfile={handleDeleteClientProfile}
                  onSwitchToProvider={() => {
                    setCurrentRole('prestador');
                    setActiveTab('inicio');
                  }}
                  onOpenNewRegistration={() => setIsRegistrationModalOpen(true)}
                  onNavigateToPayments={() => setActiveTab('pagamentos')}
                  googleUser={clientUser}
                  onOpenGoogleAuth={() => handleOpenGoogleAuth('cliente')}
                  onDisconnectGoogle={() => handleLogoutRole('cliente')}
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
                  appointments={combinedAppointments}
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
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-[#18181b] tracking-tight">
                        Orçamentos & Propostas
                      </h1>
                      <p className="text-xs text-[#71717a]">Acompanhe suas propostas enviadas aos clientes</p>
                    </div>
                    <button
                      onClick={() => setIsCreateServiceModalOpen(true)}
                      className="px-3.5 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs rounded-xl shadow-xs transition"
                    >
                      + Novo Serviço
                    </button>
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
                          ? `${Math.round((combinedAppointments.length / providerLeads.filter((l) => l.status === 'orcamento_enviado').length) * 100)}%`
                          : '100%'}
                      </span>
                      <p className="text-xs text-[#52525b] mt-1 font-semibold">Taxa de Conversão</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-bold text-[#18181b]">Histórico de Chamados Firebase</h3>
                    {firebaseSolicitacoes.length === 0 && providerLeads.length === 0 ? (
                      <div className="p-6 rounded-2xl border border-dashed border-[#e4e4e7] text-center text-xs text-[#71717a]">
                        Nenhum chamado aberto no momento na sua região de atendimento.
                      </div>
                    ) : (
                      <>
                        {firebaseSolicitacoes.map((sol) => (
                          <div
                            key={sol.id}
                            className="bg-white rounded-2xl p-4 border border-[#e4e4e7] shadow-xs flex justify-between items-center"
                          >
                            <div>
                              <h4 className="text-sm font-bold text-[#18181b]">{sol.servicoNome || sol.descricao}</h4>
                              <p className="text-xs text-[#71717a]">{sol.clienteNome || 'Cliente'} • {sol.endereco}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-extrabold text-[#ea580c]">R$ {sol.valorEstimado}</span>
                              <span className="block text-[10px] font-bold text-emerald-700 uppercase">
                                {sol.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'agenda' && (
                <AgendaScreen
                  role="prestador"
                  appointments={combinedAppointments}
                  isSyncing={isSyncingAgenda}
                  onRefreshSync={handleRefreshAgenda}
                  onCancelAppointment={async (id) => {
                    const sol = firebaseSolicitacoes.find((s) => s.id === id);
                    if (sol) {
                      await deleteAgendamentoFromDatabase(id).catch(() => cancelSolicitacao(id));
                    }
                    setAppointments((prev) => prev.filter((a) => a.id !== id));
                  }}
                  onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
                  onNewService={() => setIsCreateServiceModalOpen(true)}
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
                      <p className="text-xs text-[#71717a]">Gerencie sua tabela de preços no Firebase (PostgreSQL)</p>
                    </div>
                    <button
                      onClick={() => setIsCreateServiceModalOpen(true)}
                      className="text-xs font-bold text-[#ea580c] bg-[#fff7ed] hover:bg-[#ea580c] hover:text-white border border-[#fed7aa] px-3 py-1.5 rounded-full transition-all cursor-pointer"
                    >
                      + Cadastrar Serviço
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
                  onUpdateProvider={handleUpdateProvider}
                  onDeleteProfile={handleDeleteProviderProfile}
                  onSwitchToClient={() => {
                    setCurrentRole('cliente');
                    setActiveTab('inicio');
                  }}
                  onOpenNewRegistration={() => setIsRegistrationModalOpen(true)}
                  googleUser={providerUser}
                  onOpenGoogleAuth={() => handleOpenGoogleAuth('prestador')}
                  onDisconnectGoogle={() => handleLogoutRole('prestador')}
                  onOpenInstallModal={() => setIsInstallAppModalOpen(true)}
                />
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
        providerPendingCount={providerPendingCount}
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
          currentUser={authModalRole === 'cliente' ? clientUser : providerUser}
          onSuccess={handleGoogleLoginSuccess}
          onLogout={() => handleLogoutRole(authModalRole)}
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

        {/* Firebase Admin Panel - strictly for Master Admin */}
        {isCurrentUserAdmin && (
          <AdminPanelScreen
            isOpen={isAdminModeOpen}
            onClose={() => setIsAdminModeOpen(false)}
            currentUserEmail={firebaseUserDoc?.email || currentAuthUser?.email || ''}
          />
        )}

        {/* Firebase Create/Edit Service Modal */}
        <ServiceModal
          isOpen={isCreateServiceModalOpen}
          onClose={() => setIsCreateServiceModalOpen(false)}
          onSuccess={() => setIsCreateServiceModalOpen(false)}
          profissionalId={providerProfile.id || 'prov-default'}
          profissionalNome={providerProfile.name}
          profissionalFoto={providerProfile.avatar}
          categorias={firebaseCategorias}
        />

        {/* Firebase Request Service Modal */}
        <RequestServiceModal
          isOpen={isRequestModalOpen}
          onClose={() => {
            setIsRequestModalOpen(false);
            setSelectedServiceToRequest(null);
          }}
          onSuccess={(id) => {
            setActiveTab('agenda');
            setNotifications((prev) => [
              {
                id: `notif-sol-${Date.now()}`,
                title: 'Chamado Gravado no Firebase!',
                message: 'Sua solicitação foi salva e o profissional foi notificado via PostgreSQL.',
                time: 'Agora',
                read: false,
                type: 'success'
              },
              ...prev
            ]);
          }}
          servico={selectedServiceToRequest}
          client={clientProfile}
        />

        {/* Firebase Review Modal */}
        {selectedSolicitacaoToReview && (
          <ReviewModal
            isOpen={isReviewModalOpen}
            onClose={() => {
              setIsReviewModalOpen(false);
              setSelectedSolicitacaoToReview(null);
            }}
            onSuccess={() => {
              setNotifications((prev) => [
                {
                  id: `notif-rev-${Date.now()}`,
                  title: 'Avaliação Publicada!',
                  message: 'Sua nota e comentário foram registrados com sucesso no Firebase.',
                  time: 'Agora',
                  read: false,
                  type: 'success'
                },
                ...prev
              ]);
            }}
            solicitacaoId={selectedSolicitacaoToReview.id}
            servicoId={selectedSolicitacaoToReview.servicoId}
            profissionalId={selectedSolicitacaoToReview.profissionalId}
            profissionalNome={selectedSolicitacaoToReview.profissionalNome}
            servicoNome={selectedSolicitacaoToReview.servicoNome}
            clienteId={clientProfile.id}
            clienteNome={clientProfile.name}
            clienteFoto={clientProfile.avatar}
          />
        )}

        {/* Voice & Photo Modals */}
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
