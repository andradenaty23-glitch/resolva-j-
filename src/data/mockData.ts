import {
  Professional,
  Room,
  Appointment,
  DiagnosisResult,
  NotificationItem,
  ClientProfile,
  ProviderProfile,
  ProviderJobLead,
  PaymentMethod,
  TransactionRecord,
  ProviderEarningData
} from '../types';

export const INITIAL_CLIENT_PROFILE: ClientProfile = {
  id: 'client-1',
  name: 'Natália Andrade',
  email: 'andradenaty23@gmail.com',
  phone: '',
  cpf: '',
  residenceType: 'apartamento',
  address: {
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    cep: ''
  },
  plan: 'Resolva Já Free',
  walletBalance: 0.0,
  cashbackBalance: 0.0,
  avatar: '',
  registeredAt: 'Conta ativa'
};

export const INITIAL_PROVIDER_PROFILE: ProviderProfile = {
  id: 'provider-1',
  name: 'Prestador de Serviços',
  email: '',
  phone: '',
  document: '',
  category: 'Reparos e Manutenção',
  specialties: ['Elétrica Residencial', 'Hidráulica & Encanamento', 'Pequenos Reparos'],
  experienceYears: 0,
  laborBaseRate: 100,
  operatingRadiusKm: 15,
  availability: 'Disponível Agora',
  verified: true,
  trustIndex: 100,
  rating: 5.0,
  reviewsCount: 0,
  completedJobsCount: 0,
  bio: '',
  avatar: '',
  bankAccount: {
    bank: '',
    pixKey: ''
  },
  totalEarningsMonth: 0.0,
  registeredAt: 'Prestador Credenciado'
};

// Clean initial state for provider job leads - incoming customer requests appear dynamically
export const INITIAL_PROVIDER_LEADS: ProviderJobLead[] = [];

export const INITIAL_DIAGNOSIS: DiagnosisResult | null = null;

export const INITIAL_PROFESSIONALS: Professional[] = [];

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'sala',
    name: 'Sala de Estar',
    icon: 'Armchair',
    status: 'normal',
    statusText: 'Tudo funcionando perfeitamente',
    problemCount: 0,
    items: [
      { id: 'sala-1', name: 'Smart TV', brand: 'Televisor Principal', lastReview: 'Recente', status: 'ok', statusText: 'Funcionando 100%', iconName: 'Tv' },
      { id: 'sala-2', name: 'Ar Condicionado', brand: 'Split', lastReview: 'Recente', status: 'ok', statusText: 'Filtros limpos', iconName: 'Wind' },
      { id: 'sala-3', name: 'Iluminação', brand: 'Pontos de Luz', lastReview: 'Recente', status: 'ok', statusText: 'Circuito estável', iconName: 'Lightbulb' }
    ]
  },
  {
    id: 'cozinha',
    name: 'Cozinha',
    icon: 'UtensilsCrossed',
    status: 'normal',
    statusText: 'Instalações em dia',
    problemCount: 0,
    items: [
      { id: 'cozinha-1', name: 'Geladeira', brand: 'Refrigerador', lastReview: 'Recente', status: 'ok', statusText: 'Temperatura ideal', iconName: 'Refrigerator' },
      { id: 'cozinha-2', name: 'Fogão / Cooktop', brand: 'Fogão', lastReview: 'Recente', status: 'ok', statusText: 'Chamas reguladas', iconName: 'Flame' },
      { id: 'cozinha-3', name: 'Torneira da Pia', brand: 'Monocomando', lastReview: 'Recente', status: 'ok', statusText: 'Vedação e pressão OK', iconName: 'Droplet' }
    ]
  },
  {
    id: 'quarto1',
    name: 'Quarto',
    icon: 'Bed',
    status: 'normal',
    statusText: 'Em perfeito estado',
    problemCount: 0,
    items: [
      { id: 'q1-1', name: 'Ar Condicionado', brand: 'Quarto', lastReview: 'Recente', status: 'ok', statusText: 'Silencioso e calibrado', iconName: 'Wind' },
      { id: 'q1-2', name: 'Tomadas e Interruptores', brand: 'Tomadas', lastReview: 'Recente', status: 'ok', statusText: 'Tensão correta', iconName: 'Plug' }
    ]
  },
  {
    id: 'lavanderia',
    name: 'Lavanderia',
    icon: 'WashingMachine',
    status: 'normal',
    statusText: 'Revisão hidráulica em dia',
    problemCount: 0,
    items: [
      { id: 'lav-1', name: 'Máquina de Lavar', brand: 'Lava e Seca', lastReview: 'Recente', status: 'ok', statusText: 'Drenagem OK', iconName: 'WashingMachine' }
    ]
  },
  {
    id: 'banheiro',
    name: 'Banheiro',
    icon: 'Bath',
    status: 'normal',
    statusText: 'Instalações em dia',
    problemCount: 0,
    items: [
      { id: 'banh-1', name: 'Chuveiro', brand: 'Ducha Elétrica', lastReview: 'Recente', status: 'ok', statusText: 'Aquecimento e pressão normais', iconName: 'ShowerHead' },
      { id: 'banh-2', name: 'Vaso Sanitário', brand: 'Descarga', lastReview: 'Recente', status: 'ok', statusText: 'Sem vazamentos', iconName: 'Droplet' }
    ]
  }
];

// Clean initial state for ready-to-use experience
export const INITIAL_APPOINTMENTS: Appointment[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Bem-vindo(a) ao RESOLVA JÁ!',
    message: 'Solicite diagnósticos inteligentes por áudio, foto ou texto e conecte-se com técnicos credenciados com garantia de 90 dias.',
    time: 'Agora',
    read: false,
    type: 'info'
  }
];

// Clean initial payment methods
export const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [];

// Clean initial transaction history
export const INITIAL_TRANSACTIONS: TransactionRecord[] = [];

// Clean initial provider earnings and performance history
export const PROVIDER_EARNINGS_HISTORY: ProviderEarningData[] = [];

export const PROVIDER_CATEGORY_DISTRIBUTION: { name: string; value: number; count: number; color: string }[] = [];

export const PROVIDER_WEEKLY_DEMAND: { day: string; chamados: number; propostas: number; faturamento: number }[] = [];

export const PROVIDER_HOURLY_PEAK: { hour: string; demanda: number; label: string }[] = [];
