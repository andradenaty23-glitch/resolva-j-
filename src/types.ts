export type UserRole = 'cliente' | 'prestador';

export type TabType = 'inicio' | 'problemas' | 'agenda' | 'minhacasa' | 'pagamentos' | 'perfil';

export type ProblemCategory = 'eletrica' | 'hidraulica' | 'ar_condicionado' | 'geral' | 'pintura' | 'fechadura';

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'pix' | 'boleto' | 'wallet';
  brand?: 'mastercard' | 'visa' | 'elo' | 'hipercard' | 'amex';
  last4?: string;
  holderName?: string;
  expiry?: string;
  isDefault: boolean;
  nickname?: string;
  icon?: string;
}

export interface TransactionRecord {
  id: string;
  serviceTitle: string;
  providerName: string;
  providerAvatar: string;
  providerCategory: string;
  amount: number;
  date: string;
  status: 'pago' | 'em_custodia' | 'processando' | 'estornado';
  paymentMethodType: string;
  paymentMethodDetails?: string;
  installments?: number;
  invoiceCode: string;
  warrantyUntil: string;
}

export interface ProviderEarningData {
  month: string;
  faturamento: number;
  meta: number;
  servicos: number;
  propostas: number;
  taxaConversao: number;
  ticketMedio: number;
}

export interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  residenceType: 'apartamento' | 'casa' | 'comercial';
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  };
  plan: 'Resolva Já Free' | 'Resolva Já Plus' | 'Resolva Já Premium';
  walletBalance: number;
  cashbackBalance: number;
  avatar: string;
  registeredAt: string;
}

export interface ProviderProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string; // CPF or CNPJ
  category: string;
  specialties: string[];
  experienceYears: number;
  laborBaseRate: number;
  operatingRadiusKm: number;
  availability: 'Disponível Agora' | 'Hoje' | 'Amanhã' | 'Ocupado';
  verified: boolean;
  trustIndex: number;
  rating: number;
  reviewsCount: number;
  completedJobsCount: number;
  bio: string;
  avatar: string;
  bankAccount: {
    bank: string;
    pixKey: string;
  };
  totalEarningsMonth: number;
  registeredAt: string;
}

export interface ProviderJobLead {
  id: string;
  clientName: string;
  serviceTitle: string;
  category: string;
  room: string;
  neighborhood: string;
  distanceKm: number;
  urgency: 'baixa' | 'media' | 'alta' | 'critica';
  suggestedBudget: number;
  description: string;
  imageUrl?: string;
  status: 'aberto' | 'orcamento_enviado' | 'aceito' | 'recusado';
  createdAt: string;
}

export interface DiagnosisResult {
  id: string;
  title: string;
  problemSummary: string;
  category: string;
  professionalType: string;
  urgency: 'baixa' | 'media' | 'alta' | 'critica';
  urgencyPercentage: number;
  room: string;
  diyTips?: string[];
  estimatedCostRange: { min: number; max: number };
  createdAt: string;
}

export interface Professional {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  matchPercentage: number;
  priceLevel: '$' | '$$' | '$$$';
  trustIndex: number;
  recommendationReason: string;
  availability: 'Hoje' | 'Amanhã' | 'Esta semana';
  verified: boolean;
  laborCost: number;
  materialsCost: number;
  totalCost: number;
  phone: string;
  reviewsCount: number;
  completedJobs: number;
  specialties: string[];
}

export interface DeviceItem {
  id: string;
  name: string;
  brand: string;
  lastReview: string;
  status: 'ok' | 'atencao' | 'problema';
  statusText: string;
  issueDescription?: string;
  iconName: string;
}

export interface Room {
  id: string;
  name: string;
  icon: string;
  status: 'normal' | 'atencao' | 'problema';
  statusText: string;
  problemCount: number;
  items: DeviceItem[];
}

export interface Appointment {
  id: string;
  clientName?: string;
  clientPhone?: string;
  professionalName: string;
  professionalAvatar: string;
  role: string;
  date: string;
  time: string;
  serviceTitle: string;
  room: string;
  totalCost: number;
  status: 'confirmado' | 'a_caminho' | 'concluido' | 'cancelado';
  address: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'alert' | 'info' | 'success';
}
