export type UserRole = 'cliente' | 'prestador' | 'profissional' | 'admin';

export type TabType = 'inicio' | 'problemas' | 'agenda' | 'minhacasa' | 'pagamentos' | 'perfil' | 'admin';

export type ProblemCategory =
  | 'hidraulica'
  | 'eletrica'
  | 'ar_condicionado'
  | 'geral'
  | 'montagem_moveis'
  | 'desentupimento'
  | 'pintura'
  | 'fechadura'
  | 'alvenaria'
  | 'serralheria'
  | 'marcenaria'
  | 'eletrodomesticos'
  | 'seguranca_cftv'
  | 'limpeza_pos_obra'
  | 'aquecedor_gas'
  | 'gesso_drywall';

// ================= SUPABASE POSTGRESQL DATABASE TYPES =================
export type TipoUsuario = 'cliente' | 'profissional' | 'admin';

export interface UsuarioDoc {
  uid: string;
  nome: string;
  email: string;
  foto: string;
  telefone: string;
  tipo: TipoUsuario;
  cidade: string;
  bairro: string;
  criadoEm: string;
  atualizadoEm: string;
  // Campos complementares opcionais para enriquecer o perfil
  residenceType?: 'apartamento' | 'casa' | 'comercial';
  endereco?: string;
  cep?: string;
  cpf?: string;
  bio?: string;
  especialidades?: string[];
  raioKm?: number;
  valorBase?: number;
  chavePix?: string;
  avaliacaoMedia?: number;
  totalAvaliacoes?: number;
}

export interface CategoriaDoc {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  ativa: boolean;
  criadoEm: string;
}

export interface ServicoDoc {
  id: string;
  profissionalId: string;
  profissionalNome?: string;
  profissionalFoto?: string;
  nome: string;
  descricao: string;
  categoriaId: string;
  categoriaNome: string;
  telefone: string;
  whatsapp: string;
  cidade: string;
  bairro: string;
  endereco: string;
  preco: number;
  imagem: string;
  disponivel: boolean;
  ativo?: boolean;
  avaliacaoMedia?: number;
  totalAvaliacoes?: number;
  criadoEm: string;
  atualizadoEm: string;
}

export type StatusSolicitacao =
  | 'pendente'
  | 'aceita'
  | 'recusada'
  | 'em_andamento'
  | 'concluida'
  | 'cancelada';

export interface SolicitacaoDoc {
  id: string;
  clienteId: string;
  clienteNome?: string;
  clienteFoto?: string;
  clienteTelefone?: string;
  profissionalId: string;
  profissionalNome?: string;
  profissionalFoto?: string;
  servicoId: string;
  servicoNome: string;
  descricao: string;
  dataSolicitacao: string;
  status: StatusSolicitacao;
  observacao?: string;
  valor?: number;
  endereco?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface AvaliacaoDoc {
  id: string;
  clienteId: string;
  clienteNome?: string;
  clienteFoto?: string;
  profissionalId: string;
  servicoId: string;
  solicitacaoId: string;
  nota: number; // 1 a 5
  comentario: string;
  criadoEm: string;
}

export interface FavoritoDoc {
  id: string;
  usuarioId: string;
  servicoId: string;
  criadoEm: string;
}

export interface NotificacaoDoc {
  id: string;
  usuarioId: string;
  titulo: string;
  mensagem: string;
  tipo: 'info' | 'success' | 'alert' | 'warning';
  lida: boolean;
  referenciaId?: string;
  criadoEm: string;
}

// ================= UI / LEGACY COMPATIBILITY TYPES =================
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
  document: string;
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
  bairro?: string;
  cidade?: string;
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
  clientAvatar?: string;
  professionalName: string;
  professionalAvatar: string;
  role: string;
  date: string;
  time: string;
  serviceTitle: string;
  room: string;
  totalCost: number;
  status: 'confirmado' | 'a_caminho' | 'concluido' | 'cancelado' | 'pendente' | 'aceita' | 'recusada' | 'em_andamento';
  address: string;
  notes?: string;
  isBlockedSlot?: boolean;
  blockReason?: string;
  solicitacaoId?: string;
  servicoId?: string;
  clienteId?: string;
  profissionalId?: string;
  avaliacaoFeita?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'alert' | 'info' | 'success';
  referenciaId?: string;
}

export interface GoogleAuthUser {
  id: string;
  email: string;
  name: string;
  givenName?: string;
  familyName?: string;
  picture: string;
  verifiedEmail: boolean;
  role: UserRole;
  tipo?: TipoUsuario;
  authProvider: 'google' | 'email';
  connectedAt: string;
  token?: string;
}
