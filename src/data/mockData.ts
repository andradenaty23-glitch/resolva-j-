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
  phone: '(11) 98123-4567',
  cpf: '382.491.028-44',
  residenceType: 'apartamento',
  address: {
    street: 'Rua das Palmeiras',
    number: '450',
    complement: 'Apto 82, Bloco B',
    neighborhood: 'Pinheiros',
    city: 'São Paulo',
    state: 'SP',
    cep: '05422-010'
  },
  plan: 'Resolva Já Plus',
  walletBalance: 120.00,
  cashbackBalance: 28.50,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  registeredAt: 'Janeiro de 2024'
};

export const INITIAL_PROVIDER_PROFILE: ProviderProfile = {
  id: 'provider-1',
  name: 'Ricardo Silva',
  email: 'ricardo.silva.reparos@gmail.com',
  phone: '(11) 98765-4321',
  document: '29.384.102/0001-92',
  category: 'Encanamento / Hidráulica',
  specialties: ['Vazamentos Hidráulicos', 'Tubulações PEX/PVC', 'Troca de Registros', 'Instalação de Misturadores'],
  experienceYears: 12,
  laborBaseRate: 100,
  operatingRadiusKm: 15,
  availability: 'Disponível Agora',
  verified: true,
  trustIndex: 94,
  rating: 4.9,
  reviewsCount: 142,
  completedJobsCount: 310,
  bio: 'Técnico hidráulico certificado com mais de 12 anos de experiência em edifícios residenciais e comerciais. Equipamento geofone próprio para caça-vazamento sem quebra.',
  avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
  bankAccount: {
    bank: 'Banco Inter (077)',
    pixKey: 'ricardo.silva.reparos@gmail.com'
  },
  totalEarningsMonth: 4680,
  registeredAt: 'Março de 2023'
};

export const INITIAL_PROVIDER_LEADS: ProviderJobLead[] = [
  {
    id: 'lead-1',
    clientName: 'Natália Andrade',
    serviceTitle: 'Vazamento contínuo na torneira da bancada',
    category: 'Encanamento / Hidráulica',
    room: 'Cozinha',
    neighborhood: 'Pinheiros (a 2.4 km)',
    distanceKm: 2.4,
    urgency: 'alta',
    suggestedBudget: 120,
    description: 'A torneira monocomando está com gotejamento constante na base e escorrendo pelo armário.',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
    status: 'aberto',
    createdAt: 'Há 12 min'
  },
  {
    id: 'lead-2',
    clientName: 'Marcelo Ribeiro',
    serviceTitle: 'Substituição de registro de pressão do chuveiro',
    category: 'Encanamento / Hidráulica',
    room: 'Banheiro Suíte',
    neighborhood: 'Vila Madalena (a 3.8 km)',
    distanceKm: 3.8,
    urgency: 'media',
    suggestedBudget: 140,
    description: 'Registro não fecha completamente e precisa de troca do reparo interno.',
    status: 'aberto',
    createdAt: 'Há 45 min'
  },
  {
    id: 'lead-3',
    clientName: 'Carla Dias',
    serviceTitle: 'Instalação de ponto de água para lava-louças',
    category: 'Encanamento / Hidráulica',
    room: 'Cozinha',
    neighborhood: 'Jardins (a 5.1 km)',
    distanceKm: 5.1,
    urgency: 'baixa',
    suggestedBudget: 180,
    description: 'Preciso puxar derivação do ponto da torneira com válvula dupla.',
    status: 'orcamento_enviado',
    createdAt: 'Ontem'
  }
];

export const INITIAL_DIAGNOSIS: DiagnosisResult = {
  id: 'diag-1',
  title: 'Diagnóstico Concluído',
  problemSummary: 'Possível vazamento hidráulico',
  category: 'Encanamento / Hidráulica',
  professionalType: 'Encanador',
  urgency: 'media',
  urgencyPercentage: 50,
  room: 'cozinha',
  diyTips: [
    'Feche o registro geral de água se o vazamento for contínuo.',
    'Coloque um balde ou pano absorvente sob o ponto de gotejamento.',
    'Evite usar veda-rosca provisório sem antes inspecionar a rosca da conexão.'
  ],
  estimatedCostRange: { min: 90, max: 160 },
  createdAt: 'Hoje às 14:20'
};

export const INITIAL_PROFESSIONALS: Professional[] = [
  {
    id: 'prof-1',
    name: 'Ricardo Silva',
    role: 'Encanador',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
    rating: 4.9,
    matchPercentage: 96,
    priceLevel: '$$$',
    trustIndex: 94,
    recommendationReason: 'Recomendado porque trabalha com hidráulica e está disponível hoje.',
    availability: 'Hoje',
    verified: true,
    laborCost: 100,
    materialsCost: 20,
    totalCost: 120,
    phone: '(11) 98765-4321',
    reviewsCount: 142,
    completedJobs: 310,
    specialties: ['Vazamentos', 'Tubulações PEX/PVC', 'Instalação de Torneiras']
  },
  {
    id: 'prof-2',
    name: 'Carlos Mendes',
    role: 'Encanador / Especialista',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    rating: 4.8,
    matchPercentage: 89,
    priceLevel: '$$',
    trustIndex: 88,
    recommendationReason: 'Especialista em detecção de vazamentos complexos.',
    availability: 'Amanhã',
    verified: true,
    laborCost: 110,
    materialsCost: 25,
    totalCost: 135,
    phone: '(11) 97654-3210',
    reviewsCount: 98,
    completedJobs: 215,
    specialties: ['Caça-Vazamentos com Geofone', 'Troca de Registros', 'Desentupimento']
  },
  {
    id: 'prof-3',
    name: 'João Pedro',
    role: 'Encanador e Reparador Geral',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    rating: 4.7,
    matchPercentage: 82,
    priceLevel: '$',
    trustIndex: 82,
    recommendationReason: 'Ótimo custo-benefício para reparos rápidos em conexões.',
    availability: 'Amanhã',
    verified: true,
    laborCost: 90,
    materialsCost: 20,
    totalCost: 110,
    phone: '(11) 96543-2109',
    reviewsCount: 64,
    completedJobs: 140,
    specialties: ['Manutenção preventiva', 'Sifões e Válvulas', 'Filtros']
  }
];

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'sala',
    name: 'Sala',
    icon: 'Armchair',
    status: 'normal',
    statusText: 'Tudo normal',
    problemCount: 0,
    items: [
      { id: 'sala-1', name: 'Smart TV', brand: 'Samsung 55"', lastReview: '10/2023', status: 'ok', statusText: 'OK', iconName: 'Tv' },
      { id: 'sala-2', name: 'Ar Condicionado', brand: 'LG Dual Inverter', lastReview: '11/2023', status: 'ok', statusText: 'OK', iconName: 'Wind' },
      { id: 'sala-3', name: 'Iluminação Smart', brand: 'Philips Hue', lastReview: '01/2024', status: 'ok', statusText: 'OK', iconName: 'Lightbulb' }
    ]
  },
  {
    id: 'cozinha',
    name: 'Cozinha',
    icon: 'UtensilsCrossed',
    status: 'problema',
    statusText: '1 problema',
    problemCount: 1,
    items: [
      { id: 'cozinha-1', name: 'Geladeira', brand: 'Brastemp Frost Free', lastReview: '12/2023', status: 'ok', statusText: 'OK', iconName: 'Refrigerator' },
      { id: 'cozinha-2', name: 'Fogão', brand: 'Consul 4 Bocas', lastReview: '05/2023', status: 'ok', statusText: 'OK', iconName: 'Flame' },
      { id: 'cozinha-3', name: 'Torneira Monocomando', brand: 'Deca Gourmet', lastReview: '01/2024', status: 'problema', statusText: 'Vazamento', issueDescription: 'Pingamento contínuo na base do misturador.', iconName: 'Droplet' },
      { id: 'cozinha-4', name: 'Coifa Inox', brand: 'Electrolux', lastReview: '08/2023', status: 'ok', statusText: 'OK', iconName: 'Fan' }
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
      { id: 'q1-1', name: 'Ar Condicionado', brand: 'Daikin Split', lastReview: '09/2023', status: 'ok', statusText: 'OK', iconName: 'Wind' },
      { id: 'q1-2', name: 'Persiana Elétrica', brand: 'Somfy', lastReview: '04/2023', status: 'ok', statusText: 'OK', iconName: 'Blinds' }
    ]
  },
  {
    id: 'lavanderia',
    name: 'Lavanderia',
    icon: 'WashingMachine',
    status: 'atencao',
    statusText: 'Manutenção próx.',
    problemCount: 0,
    items: [
      { id: 'lav-1', name: 'Máquina de Lavar', brand: 'Samsung EcoBubble', lastReview: '02/2023', status: 'atencao', statusText: 'Manutenção próx.', issueDescription: 'Filtro de fiapos e duto recomendam limpeza em 15 dias.', iconName: 'WashingMachine' },
      { id: 'lav-2', name: 'Aquecedor a Gás', brand: 'Rinnai Digital', lastReview: '06/2023', status: 'ok', statusText: 'OK', iconName: 'Flame' }
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
      { id: 'banh-1', name: 'Chuveiro Elétrico', brand: 'Lorenzetti Acqua', lastReview: '03/2024', status: 'ok', statusText: 'OK', iconName: 'ShowerHead' },
      { id: 'banh-2', name: 'Vaso Sanitário / Caixa', brand: 'Incepa', lastReview: '11/2023', status: 'ok', statusText: 'OK', iconName: 'Toilet' }
    ]
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    clientName: 'Natália Andrade',
    clientPhone: '(11) 98123-4567',
    professionalName: 'Ricardo Silva',
    professionalAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
    role: 'Encanador',
    date: 'Hoje, 18 de Agosto',
    time: '16:00 - 17:30',
    serviceTitle: 'Reparo de vazamento em torneira monocomando',
    room: 'Cozinha',
    totalCost: 120,
    status: 'confirmado',
    address: 'Rua das Palmeiras, 450 - Apto 82'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Vazamento na Cozinha',
    message: 'A torneira monocomando da cozinha precisa de reparo. Orçamento disponível a partir de R$ 110.',
    time: 'Há 15 min',
    read: false,
    type: 'alert'
  },
  {
    id: 'notif-2',
    title: 'Manutenção Preventiva',
    message: 'A máquina de lavar na Lavanderia precisa de revisão recomendada para os próximos 15 dias.',
    time: 'Ontem',
    read: true,
    type: 'info'
  },
  {
    id: 'notif-3',
    title: 'Diagnóstico RESOLVA JÁ IA',
    message: 'Seu sistema residencial realizou a varredura matinal com sucesso.',
    time: 'Há 2 dias',
    read: true,
    type: 'success'
  }
];

export const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pm-1',
    type: 'credit_card',
    brand: 'mastercard',
    last4: '4291',
    holderName: 'NATALIA ANDRADE',
    expiry: '08/29',
    isDefault: true,
    nickname: 'Nubank Roxinho'
  },
  {
    id: 'pm-2',
    type: 'credit_card',
    brand: 'visa',
    last4: '8834',
    holderName: 'NATALIA ANDRADE',
    expiry: '11/27',
    isDefault: false,
    nickname: 'Itaú Personalité'
  },
  {
    id: 'pm-3',
    type: 'pix',
    isDefault: false,
    nickname: 'Pix Automático (Chave CPF)'
  }
];

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'tx-101',
    serviceTitle: 'Reparo e Vedação de Torneira Monocomando',
    providerName: 'Ricardo Silva',
    providerAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
    providerCategory: 'Hidráulica',
    amount: 120.00,
    date: '18 Ago 2026, 14:30',
    status: 'em_custodia',
    paymentMethodType: 'Cartão de Crédito',
    paymentMethodDetails: 'Mastercard •••• 4291 (1x)',
    installments: 1,
    invoiceCode: 'RJ-2026-8941',
    warrantyUntil: '16 Nov 2026 (90 dias)'
  },
  {
    id: 'tx-102',
    serviceTitle: 'Troca de Resistência e Fiação Chuveiro Duo Shower',
    providerName: 'Carlos Mendonça',
    providerAvatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=256&q=80',
    providerCategory: 'Elétrica',
    amount: 150.00,
    date: '02 Jul 2026, 10:15',
    status: 'pago',
    paymentMethodType: 'Pix Instantâneo',
    paymentMethodDetails: 'Chave Pix com 5% cashback',
    invoiceCode: 'RJ-2026-7732',
    warrantyUntil: '30 Set 2026'
  },
  {
    id: 'tx-103',
    serviceTitle: 'Higienização e Carga de Gás Ar Condicionado 12.000 BTUs',
    providerName: 'Juliana Paes Clima',
    providerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    providerCategory: 'Ar Condicionado',
    amount: 320.00,
    date: '15 Mai 2026, 16:00',
    status: 'pago',
    paymentMethodType: 'Cartão de Crédito',
    paymentMethodDetails: 'Visa •••• 8834 (3x de R$ 106,66 sem juros)',
    installments: 3,
    invoiceCode: 'RJ-2026-5519',
    warrantyUntil: '15 Ago 2026'
  },
  {
    id: 'tx-104',
    serviceTitle: 'Manutenção Preventiva de Fechadura Biométrica',
    providerName: 'Roberto Chaves',
    providerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    providerCategory: 'Chaveiro & Acesso',
    amount: 90.00,
    date: '20 Mar 2026, 09:40',
    status: 'pago',
    paymentMethodType: 'Saldo Carteira Resolva Já',
    paymentMethodDetails: 'Débito em saldo de cashback',
    invoiceCode: 'RJ-2026-3304',
    warrantyUntil: '18 Jun 2026'
  }
];

export const PROVIDER_EARNINGS_HISTORY: ProviderEarningData[] = [
  { month: 'Mar', faturamento: 3450, meta: 3500, servicos: 24, propostas: 28, taxaConversao: 85.7, ticketMedio: 143.75 },
  { month: 'Abr', faturamento: 4120, meta: 4000, servicos: 29, propostas: 33, taxaConversao: 87.8, ticketMedio: 142.06 },
  { month: 'Mai', faturamento: 3890, meta: 4200, servicos: 26, propostas: 31, taxaConversao: 83.8, ticketMedio: 149.61 },
  { month: 'Jun', faturamento: 4850, meta: 4500, servicos: 34, propostas: 38, taxaConversao: 89.4, ticketMedio: 142.64 },
  { month: 'Jul', faturamento: 5120, meta: 4800, servicos: 36, propostas: 40, taxaConversao: 90.0, ticketMedio: 142.22 },
  { month: 'Ago (Atual)', faturamento: 5480, meta: 5000, servicos: 39, propostas: 44, taxaConversao: 88.6, ticketMedio: 140.51 }
];

export const PROVIDER_CATEGORY_DISTRIBUTION = [
  { name: 'Vazamentos & Reparos', value: 45, count: 18, color: '#a200ac' },
  { name: 'Troca de Registros', value: 25, count: 10, color: '#cb00d8' },
  { name: 'Instalação de Misturadores', value: 18, count: 7, color: '#006c49' },
  { name: 'Caça-Vazamento Geofone', value: 12, count: 4, color: '#2563eb' }
];

export const PROVIDER_WEEKLY_DEMAND = [
  { day: 'Seg', chamados: 8, propostas: 6, faturamento: 720 },
  { day: 'Ter', chamados: 12, propostas: 10, faturamento: 1140 },
  { day: 'Qua', chamados: 15, propostas: 13, faturamento: 1450 },
  { day: 'Qui', chamados: 11, propostas: 9, faturamento: 980 },
  { day: 'Sex', chamados: 14, propostas: 12, faturamento: 1380 },
  { day: 'Sáb', chamados: 9, propostas: 7, faturamento: 890 },
  { day: 'Dom', chamados: 4, propostas: 3, faturamento: 420 }
];

export const PROVIDER_HOURLY_PEAK = [
  { hour: '07h-09h', demanda: 45, label: 'Manhã Cedo' },
  { hour: '09h-12h', demanda: 92, label: 'Pico Manhã' },
  { hour: '12h-14h', demanda: 60, label: 'Almoço' },
  { hour: '14h-18h', demanda: 98, label: 'Pico Tarde' },
  { hour: '18h-21h', demanda: 78, label: 'Noite / Emergência' },
  { hour: '21h-00h', demanda: 25, label: 'Plantão Noturno' }
];

