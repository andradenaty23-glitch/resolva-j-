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
    street: 'Av. Paulista',
    number: '1000',
    complement: '',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    cep: '01310-100'
  },
  plan: 'Resolva Já Free',
  walletBalance: 0.00,
  cashbackBalance: 0.00,
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
  specialties: ['Reparos Gerais', 'Elétrica', 'Hidráulica'],
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
    bank: 'Conta Bancária',
    pixKey: ''
  },
  totalEarningsMonth: 0,
  registeredAt: 'Conta ativa'
};

export const INITIAL_PROVIDER_LEADS: ProviderJobLead[] = [];

export const INITIAL_DIAGNOSIS: DiagnosisResult | null = null;

export const INITIAL_PROFESSIONALS: Professional[] = [];

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'sala',
    name: 'Sala',
    icon: 'Armchair',
    status: 'normal',
    statusText: 'Tudo normal',
    problemCount: 0,
    items: [
      { id: 'sala-1', name: 'Smart TV', brand: 'Smart TV', lastReview: 'Recente', status: 'ok', statusText: 'OK', iconName: 'Tv' },
      { id: 'sala-2', name: 'Ar Condicionado', brand: 'Split Inverter', lastReview: 'Recente', status: 'ok', statusText: 'OK', iconName: 'Wind' },
      { id: 'sala-3', name: 'Iluminação Geral', brand: 'LED', lastReview: 'Recente', status: 'ok', statusText: 'OK', iconName: 'Lightbulb' }
    ]
  },
  {
    id: 'cozinha',
    name: 'Cozinha',
    icon: 'UtensilsCrossed',
    status: 'normal',
    statusText: 'Tudo normal',
    problemCount: 0,
    items: [
      { id: 'cozinha-1', name: 'Geladeira', brand: 'Frost Free', lastReview: 'Recente', status: 'ok', statusText: 'OK', iconName: 'Refrigerator' },
      { id: 'cozinha-2', name: 'Fogão / Cooktop', brand: 'Gás', lastReview: 'Recente', status: 'ok', statusText: 'OK', iconName: 'Flame' },
      { id: 'cozinha-3', name: 'Torneira / Misturador', brand: 'Monocomando', lastReview: 'Recente', status: 'ok', statusText: 'OK', iconName: 'Droplet' },
      { id: 'cozinha-4', name: 'Coifa / Depurador', brand: 'Inox', lastReview: 'Recente', status: 'ok', statusText: 'OK', iconName: 'Fan' }
    ]
  },
  {
    id: 'quarto1',
    name: 'Quarto 1',
    icon: 'Bed',
    status: 'normal',
    statusText: 'Tudo normal',
    problemCount: 0,
    items: [
      { id: 'q1-1', name: 'Ar Condicionado', brand: 'Split', lastReview: 'Recente', status: 'ok', statusText: 'OK', iconName: 'Wind' },
      { id: 'q1-2', name: 'Persiana / Janela', brand: 'Alumínio', lastReview: 'Recente', status: 'ok', statusText: 'OK', iconName: 'Blinds' }
    ]
  },
  {
    id: 'lavanderia',
    name: 'Lavanderia',
    icon: 'WashingMachine',
    status: 'normal',
    statusText: 'Tudo normal',
    problemCount: 0,
    items: [
      { id: 'lav-1', name: 'Máquina de Lavar', brand: 'Lava e Seca', lastReview: 'Recente', status: 'ok', statusText: 'OK', iconName: 'WashingMachine' },
      { id: 'lav-2', name: 'Aquecedor a Gás', brand: 'Digital', lastReview: 'Recente', status: 'ok', statusText: 'OK', iconName: 'Flame' }
    ]
  },
  {
    id: 'banheiro',
    name: 'Banheiro Social',
    icon: 'Bath',
    status: 'normal',
    statusText: 'Tudo normal',
    problemCount: 0,
    items: [
      { id: 'banh-1', name: 'Chuveiro Elétrico', brand: 'Ducha', lastReview: 'Recente', status: 'ok', statusText: 'OK', iconName: 'ShowerHead' },
      { id: 'banh-2', name: 'Vaso Sanitário / Caixa', brand: 'Descarga Dupla', lastReview: 'Recente', status: 'ok', statusText: 'OK', iconName: 'Droplet' }
    ]
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Bem-vindo ao Resolva Já!',
    message: 'Seu assistente residencial inteligente está pronto para uso. Registre seus cômodos ou faça um diagnóstico quando precisar de reparos.',
    time: 'Agora',
    read: false,
    type: 'info'
  }
];

export const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pm-pix',
    type: 'pix',
    isDefault: true,
    nickname: 'Pix Instantâneo (5% Cashback)'
  }
];

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [];

export const PROVIDER_EARNINGS_HISTORY: ProviderEarningData[] = [];

export const PROVIDER_CATEGORY_DISTRIBUTION: { name: string; value: number; count: number; color: string }[] = [];

export const PROVIDER_WEEKLY_DEMAND: { day: string; chamados: number; propostas: number; faturamento: number }[] = [];

export const PROVIDER_HOURLY_PEAK: { hour: string; demanda: number; label: string }[] = [];

