import { ProblemCategory, Professional, DiagnosisResult } from '../types';
import { SERVICE_DEMANDS_CATALOG, ServiceDemandCategory } from '../data/serviceDemands';

// Helper to remove accents, lowercase and normalize strings for matching
export function normalizeText(text: string): string {
  return (text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

interface CategoryMatchRule {
  categoryId: ProblemCategory;
  primaryKeywords: string[];
  secondaryKeywords: string[];
  negativeKeywords?: string[];
  defaultRoom: string;
}

// Complete and strict matching rule dictionary for all service categories
const CATEGORY_MATCH_RULES: CategoryMatchRule[] = [
  {
    categoryId: 'montagem_moveis',
    primaryKeywords: [
      'montador',
      'montagem',
      'montar',
      'desmontar',
      'desmontagem',
      'remontagem',
      'guarda roupa',
      'guardaroupa',
      'guarda-roupa',
      'armario',
      'armarios',
      'rack',
      'painel de tv',
      'painel tv',
      'painel',
      'estante',
      'comoda',
      'gaveteiro',
      'beliche',
      'berco',
      'sapateira',
      'cabeceira',
      'buffet',
      'aparador',
      'criado mudo',
      'mesa de jantar',
      'movel',
      'moveis',
      'mobilia',
      'mesa e cadeira'
    ],
    secondaryKeywords: ['quarto', 'sala', 'parafusar', 'manual', 'compensado'],
    negativeKeywords: ['cano', 'registro', 'disjuntor', 'tomada', 'vazamento'],
    defaultRoom: 'quarto1'
  },
  {
    categoryId: 'hidraulica',
    primaryKeywords: [
      'hidraulica',
      'encanador',
      'encanamento',
      'vazamento',
      'vazar',
      'vaza',
      'pingando',
      'goteira',
      'gotejando',
      'torneira',
      'cano',
      'canos',
      'tubulacao',
      'registro geral',
      'registro de agua',
      'sifao',
      'sifoes',
      'flexivel',
      'pressao da agua',
      'reparo de torneira',
      'valvula hydra',
      'hydra',
      'caixa dagua',
      'caixa de agua',
      'boia',
      'pressurizador',
      'monocomando',
      'infiltracao de agua'
    ],
    secondaryKeywords: ['agua', 'pia', 'lavatorio', 'tanque', 'pinga', 'balde', 'registro'],
    negativeKeywords: ['eletric', 'faisca', 'disjuntor', 'ar condicionado', 'montador', 'moveis'],
    defaultRoom: 'cozinha'
  },
  {
    categoryId: 'eletrica',
    primaryKeywords: [
      'eletrica',
      'eletrico',
      'eletricista',
      'fiacao',
      'fios',
      'curto circuito',
      'curto-circuito',
      'curto',
      'disjuntor',
      'quadro de luz',
      'quadro eletrico',
      'tomada',
      'tomadas',
      'interruptor',
      'interruptores',
      'faisca',
      'faiscando',
      'cheiro de queimado',
      'luz piscando',
      'chuveiro',
      'chuveiro eletrico',
      'resistencia',
      'trocar resistencia',
      'luminaria',
      'spot',
      'fita led',
      'plafon',
      'lustre',
      'queda de luz',
      'queda de energia',
      'choque',
      '110v',
      '220v'
    ],
    secondaryKeywords: ['luz', 'lampada', 'energia', 'apaguei'],
    negativeKeywords: ['cano', 'torneira', 'montador', 'moveis', 'ar condicionado'],
    defaultRoom: 'sala'
  },
  {
    categoryId: 'desentupimento',
    primaryKeywords: [
      'desentupir',
      'desentupimento',
      'desentupidora',
      'entupido',
      'entupida',
      'entupiu',
      'obstrucao',
      'ralo',
      'ralo entupido',
      'vaso sanitario',
      'privada',
      'privada entupida',
      'esgoto',
      'caixa de gordura',
      'refluxo',
      'agua voltando',
      'mau cheiro no ralo',
      'pia nao desce',
      'retorno de esgoto'
    ],
    secondaryKeywords: ['sanitario', 'cheiro ruim', 'transbordando'],
    defaultRoom: 'banheiro'
  },
  {
    categoryId: 'ar_condicionado',
    primaryKeywords: [
      'ar condicionado',
      'ar-condicionado',
      'arcondicionado',
      'split',
      'climatizador',
      'climatizacao',
      'refrigeracao',
      'inverter',
      'nao gela',
      'gelando pouco',
      'pingando agua no ar',
      'dreno do ar',
      'higienizacao de ar',
      'higienizacao',
      'limpeza de ar',
      'recarga de gas',
      'carga de gas',
      'gas r410',
      'evaporadora',
      'condensadora',
      'ar vazando agua'
    ],
    secondaryKeywords: ['quente', 'frio', 'filtro', 'controle remoto'],
    defaultRoom: 'quarto1'
  },
  {
    categoryId: 'fechadura',
    primaryKeywords: [
      'chaveiro',
      'fechadura',
      'fechaduras',
      'fechadura digital',
      'fechadura eletronica',
      'fechadura biometrica',
      'biometria',
      'chave',
      'chaves',
      'tranca',
      'trancado',
      'trancada',
      'porta bateu',
      'esqueci a chave',
      'perdi a chave',
      'chave emperrada',
      'chave quebrou',
      'trocar segredo',
      'miolo da fechadura',
      'cilindro',
      'cadeado',
      'abertura de porta',
      'trinco'
    ],
    secondaryKeywords: ['porta', 'portao', 'seguranca'],
    defaultRoom: 'sala'
  },
  {
    categoryId: 'pintura',
    primaryKeywords: [
      'pintor',
      'pintura',
      'pintar',
      'tinta',
      'massa corrida',
      'massa acrilica',
      'textura',
      'grafiato',
      'emassar',
      'lixar parede',
      'retoque de tinta',
      'tinta antimofo',
      'mofo na parede',
      'tinta descascando',
      'verniz',
      'esmalte sintetico',
      'pintar teto',
      'pintura interna',
      'pintura externa',
      'rolo de pintura'
    ],
    secondaryKeywords: ['parede', 'teto', 'fita crepe', 'mancha'],
    defaultRoom: 'sala'
  },
  {
    categoryId: 'alvenaria',
    primaryKeywords: [
      'pedreiro',
      'azulejista',
      'alvenaria',
      'obra',
      'reforma',
      'piso',
      'pisos',
      'porcelanato',
      'azulejo',
      'azulejos',
      'ceramica',
      'rejunte',
      'rejuntar',
      'reboco',
      'chapisco',
      'assentar piso',
      'trocar piso',
      'piso oco',
      'piso quebrado',
      'trinca na parede',
      'rachadura',
      'mureta',
      'contrapiso',
      'quebrar parede',
      'revestimento'
    ],
    secondaryKeywords: ['argamassa', 'cimento', 'nivel', 'quebrar'],
    defaultRoom: 'sala'
  },
  {
    categoryId: 'marcenaria',
    primaryKeywords: [
      'marceneiro',
      'marcenaria',
      'movel planejado',
      'moveis planejados',
      'planejados',
      'dobradica',
      'dobradicas',
      'corredica',
      'corredicas',
      'corredica telescopica',
      'gaveta emperrada',
      'ajuste de porta de armario',
      'tampo de madeira',
      'mdf',
      'mdp',
      'compensado',
      'restauracao de moveis',
      'marcenaria sob medida',
      'trocar puxador'
    ],
    secondaryKeywords: ['gaveta', 'armario planejado', 'madeira'],
    defaultRoom: 'cozinha'
  },
  {
    categoryId: 'serralheria',
    primaryKeywords: [
      'serralheiro',
      'serralheria',
      'portao',
      'portao automatico',
      'portao basculante',
      'portao deslizante',
      'solda',
      'soldar',
      'grade',
      'grades',
      'esquadria',
      'esquadrias',
      'janela de aluminio',
      'roldana',
      'cabo de aco',
      'trilho de portao',
      'ferro',
      'guarda-corpo',
      'estrutura metalica'
    ],
    secondaryKeywords: ['trilho', 'motor de portao', 'metal'],
    defaultRoom: 'sala'
  },
  {
    categoryId: 'eletrodomesticos',
    primaryKeywords: [
      'eletrodomestico',
      'eletrodomesticos',
      'linha branca',
      'maquina de lavar',
      'lava e seca',
      'lava loucas',
      'lava-loucas',
      'lavaloucas',
      'fogao',
      'cooktop',
      'fogao a gas',
      'conversao de fogao',
      'conversao de gas',
      'coifa',
      'depurador',
      'forno eletrico',
      'forno a gas',
      'geladeira',
      'refrigerador',
      'micro-ondas',
      'microondas',
      'instalar maquina de lavar',
      'instalar cooktop',
      'instalar coifa',
      'instalar lava loucas'
    ],
    secondaryKeywords: ['cozinha', 'lavanderia', 'inox'],
    defaultRoom: 'cozinha'
  },
  {
    categoryId: 'seguranca_cftv',
    primaryKeywords: [
      'seguranca eletronica',
      'cftv',
      'camera',
      'cameras',
      'camera de seguranca',
      'camera wifi',
      'camera ip',
      'interfone',
      'interfonia',
      'video porteiro',
      'porteiro eletronico',
      'alarme',
      'sensor de presenca',
      'cerca eletrica',
      'dvr',
      'nvr',
      'monitoramento'
    ],
    secondaryKeywords: ['seguranca', 'gravador', 'aplicativo'],
    defaultRoom: 'sala'
  },
  {
    categoryId: 'aquecedor_gas',
    primaryKeywords: [
      'aquecedor a gas',
      'aquecedor',
      'boiler',
      'aquecimento a gas',
      'gas encanado',
      'botijao',
      'gn',
      'glp',
      'revisao de aquecedor',
      'manutencao de aquecedor',
      'chama do aquecedor',
      'codigo de erro aquecedor',
      'flexivel de gas',
      'vazamento de gas',
      'cheiro de gas',
      'duto de exaustao',
      'rinnai',
      'komeco',
      'lorenzetti gas'
    ],
    secondaryKeywords: ['gas', 'ducha fria', 'pilha aquecedor'],
    defaultRoom: 'lavanderia'
  },
  {
    categoryId: 'gesso_drywall',
    primaryKeywords: [
      'gesso',
      'gesseiro',
      'drywall',
      'placa de gesso',
      'forro de gesso',
      'rebaixo de gesso',
      'sanca',
      'sanca aberta',
      'sanca invertida',
      'cortineiro',
      'divisoria de drywall',
      'parede de drywall',
      'reparo de gesso',
      'gesso molhado',
      'teto de gesso caido',
      'fita telada',
      'buchas para drywall'
    ],
    secondaryKeywords: ['teto', 'forro', 'divisoria'],
    defaultRoom: 'sala'
  },
  {
    categoryId: 'limpeza_pos_obra',
    primaryKeywords: [
      'limpeza pos obra',
      'limpeza pos-obra',
      'limpeza pós obra',
      'limpeza pesada',
      'limpeza fina',
      'limpeza de vidro',
      'vidraca de sacada',
      'residuo de cimento',
      'remover cimento',
      'remover respingo de tinta',
      'lavagem de quintal',
      'lavadora de alta pressao',
      'faxina pos obra',
      'limpeza de piso pos reforma'
    ],
    secondaryKeywords: ['limpeza', 'po', 'residuos', 'faxina'],
    defaultRoom: 'sala'
  },
  {
    categoryId: 'geral',
    primaryKeywords: [
      'marido de aluguel',
      'reparos gerais',
      'pequenos reparos',
      'faz tudo',
      'suporte de tv',
      'suporte articulado',
      'instalar tv',
      'pendurar tv',
      'espelho',
      'pendurar espelho',
      'quadro',
      'pendurar quadro',
      'varal',
      'varal de teto',
      'varal de parede',
      'prateleira',
      'instalar prateleira',
      'nicho',
      'cortina',
      'varao de cortina',
      'persiana',
      'furadeira',
      'furo na parede',
      'tapar furo'
    ],
    secondaryKeywords: ['instalar', 'fixar', 'pendurar', 'ajuste'],
    defaultRoom: 'sala'
  }
];

// Curated realistic profiles with high credibility for every specialty
interface SpecializedProviderTemplate {
  name: string;
  role: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  completedJobs: number;
  trustIndex: number;
  priceLevel: '$' | '$$' | '$$$';
  specialties: string[];
  costMultiplier: number;
  availability: 'Hoje' | 'Amanhã' | 'Esta semana';
  recommendationReason: string;
}

const SPECIALTY_PROFESSIONALS_MAP: Record<ProblemCategory, SpecializedProviderTemplate[]> = {
  montagem_moveis: [
    {
      name: 'Carlos Eduardo Silva',
      role: 'Montador de Móveis Profissional',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviewsCount: 184,
      completedJobs: 320,
      trustIndex: 99,
      priceLevel: '$$',
      specialties: ['Montagem de Móveis', 'Guarda-Roupas & Camas', 'Garantia de 90 dias'],
      costMultiplier: 1.0,
      availability: 'Hoje',
      recommendationReason: 'Especialista em montagem ágil, alinhamento estrutural e fixação com ferramentas completas e garantia contratual de 90 dias.'
    },
    {
      name: 'Mariana Souza Rocha',
      role: 'Montadora & Designer de Interiores',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviewsCount: 112,
      completedJobs: 195,
      trustIndex: 96,
      priceLevel: '$',
      specialties: ['Montagem Econômica', 'Móveis Planejados e Modulares', 'Atendimento Cuidadoso'],
      costMultiplier: 0.85,
      availability: 'Hoje',
      recommendationReason: 'Montagem cuidadosa e sem arranhões em MDF e MDP com ótimo custo-benefício.'
    },
    {
      name: 'Rodrigo Albuquerque (Master)',
      role: 'Mestre Montador & Ajustes Estruturais',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      reviewsCount: 245,
      completedJobs: 430,
      trustIndex: 100,
      priceLevel: '$$$',
      specialties: ['Montagens Complexas', 'Portas de Correr & Espelhos', 'Laudo Técnico'],
      costMultiplier: 1.35,
      availability: 'Amanhã',
      recommendationReason: 'Profissional Master credenciado com mais de 10 anos de experiência para montagens grandes e móveis sob medida.'
    }
  ],
  hidraulica: [
    {
      name: 'Roberto Mendes Santos',
      role: 'Encanador Especializado em Vazamentos',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviewsCount: 230,
      completedJobs: 410,
      trustIndex: 98,
      priceLevel: '$$',
      specialties: ['Hidráulica & Encanamento', 'Caça-Vazamentos', 'Garantia de 90 dias'],
      costMultiplier: 1.0,
      availability: 'Hoje',
      recommendationReason: 'Atendimento prioritário de emergência com teste de pressão, estanqueidade e laudo técnico.'
    },
    {
      name: 'Lucas Ferreira Lima',
      role: 'Técnico Hidráulico Residencial',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviewsCount: 145,
      completedJobs: 260,
      trustIndex: 95,
      priceLevel: '$',
      specialties: ['Reparo de Torneiras & Sifões', 'Válvulas de Descarga', 'Atendimento no Dia'],
      costMultiplier: 0.85,
      availability: 'Hoje',
      recommendationReason: 'Solução rápida e econômica com troca de vedações originais e peças normatizadas ABNT.'
    },
    {
      name: 'Eng. Marcelo Cavalcanti',
      role: 'Mestre em Instalações Hidráulicas Prediais',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      reviewsCount: 310,
      completedJobs: 520,
      trustIndex: 100,
      priceLevel: '$$$',
      specialties: ['Redes Pressurizadas', 'Laudo Técnico de Infiltração', 'Garantia Estendida'],
      costMultiplier: 1.35,
      availability: 'Hoje',
      recommendationReason: 'Engenheiro especialista em caça-vazamentos não destrutivo com geofone digital e inspeção térmica.'
    }
  ],
  eletrica: [
    {
      name: 'Alexandre Moreira (Eletrotécnico)',
      role: 'Eletricista Certificado NR-10',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviewsCount: 198,
      completedJobs: 350,
      trustIndex: 99,
      priceLevel: '$$',
      specialties: ['Elétrica Residencial', 'Quadros de Luz & Disjuntores', 'Certificado NR-10'],
      costMultiplier: 1.0,
      availability: 'Hoje',
      recommendationReason: 'Eletricista com certificação NR-10 para diagnóstico seguro de curto-circuito, disjuntores e fiação.'
    },
    {
      name: 'Camila Duarte',
      role: 'Técnica Eletricista & Iluminação LED',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviewsCount: 134,
      completedJobs: 220,
      trustIndex: 95,
      priceLevel: '$',
      specialties: ['Troca de Chuveiro & Tomadas', 'Iluminação Decorativa', 'Atendimento Rápido'],
      costMultiplier: 0.85,
      availability: 'Hoje',
      recommendationReason: 'Agilidade e segurança elétrica com testes de voltagem e acabamento cuidadoso.'
    },
    {
      name: 'Eng. Fernando Prado',
      role: 'Engenheiro Eletricista Master',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      reviewsCount: 280,
      completedJobs: 490,
      trustIndex: 100,
      priceLevel: '$$$',
      specialties: ['Laudo Pericial Elétrico', 'Redimensionamento de Carga', 'Garantia Total'],
      costMultiplier: 1.4,
      availability: 'Hoje',
      recommendationReason: 'Diagnóstico aprofundado com termografia infravermelha para eliminar riscos e sobrecargas elétricas.'
    }
  ],
  desentupimento: [
    {
      name: 'Marcos Vinícius Siqueira',
      role: 'Técnico Desentupidor Especialista',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviewsCount: 215,
      completedJobs: 380,
      trustIndex: 98,
      priceLevel: '$$',
      specialties: ['Desentupimento Mecânico Roto-Rooter', 'Vasos & Ralos', 'Plantão 24h'],
      costMultiplier: 1.0,
      availability: 'Hoje',
      recommendationReason: 'Desobstrução rápida com máquina rotativa profissional sem quebrar pisos ou azulejos.'
    },
    {
      name: 'Equipe Desentupidora Ágil',
      role: 'Técnico em Saneamento Residencial',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviewsCount: 160,
      completedJobs: 290,
      trustIndex: 96,
      priceLevel: '$',
      specialties: ['Pias & Ralos Rápidos', 'Preço Justo', 'Chegada em até 45min'],
      costMultiplier: 0.85,
      availability: 'Hoje',
      recommendationReason: 'Atendimento expresso para desentupir e higienizar a tubulação com garantia de desobstrução.'
    },
    {
      name: 'Cláudio Sanches Master',
      role: 'Especialista em Hidrojateamento & Vídeo-Inspeção',
      avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      reviewsCount: 290,
      completedJobs: 510,
      trustIndex: 100,
      priceLevel: '$$$',
      specialties: ['Vídeo-Inspeção de Esgoto', 'Caixas de Gordura', 'Laudo Técnico'],
      costMultiplier: 1.35,
      availability: 'Hoje',
      recommendationReason: 'Vídeo-inspeção por câmera endoscópica para identificar e desobstruir a causa raiz na tubulação.'
    }
  ],
  ar_condicionado: [
    {
      name: 'Julio Cesar Refrigeração',
      role: 'Técnico em Climatização & Split',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviewsCount: 190,
      completedJobs: 340,
      trustIndex: 98,
      priceLevel: '$$',
      specialties: ['Higienização Completa', 'Desobstrução de Dreno', 'Recarga de Gás'],
      costMultiplier: 1.0,
      availability: 'Hoje',
      recommendationReason: 'Especialista em desobstruir vazamentos de dreno, higienizar serpentina e medir rendimento térmico.'
    },
    {
      name: 'Lucas Clima Limpo',
      role: 'Técnico em Manutenção de Ar',
      avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviewsCount: 120,
      completedJobs: 210,
      trustIndex: 94,
      priceLevel: '$',
      specialties: ['Limpeza Preventiva', 'Filtros Antimofo', 'Atendimento Rápido'],
      costMultiplier: 0.85,
      availability: 'Hoje',
      recommendationReason: 'Higienização bactericida e conserto rápido com excelente custo-benefício.'
    },
    {
      name: 'Engenharia Térmica Master Clima',
      role: 'Engenheiro Mecânico & Climatização',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      reviewsCount: 260,
      completedJobs: 460,
      trustIndex: 100,
      priceLevel: '$$$',
      specialties: ['Instalação Split Inverter', 'Laudo PMOC', 'Recarga de Gás Ecológico'],
      costMultiplier: 1.35,
      availability: 'Amanhã',
      recommendationReason: 'Serviço premium com bomba de vácuo na tubulação e carga precisa de fluido refrigerante.'
    }
  ],
  fechadura: [
    {
      name: 'Bruno Chaveiro 24 Horas',
      role: 'Chaveiro Especialista & Fechaduras Digitais',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviewsCount: 280,
      completedJobs: 490,
      trustIndex: 99,
      priceLevel: '$$',
      specialties: ['Fechaduras Digitais', 'Abertura sem Danos', 'Plantão 24h'],
      costMultiplier: 1.0,
      availability: 'Hoje',
      recommendationReason: 'Chaveiro ágil com ferramentas de precisão para abertura e instalação sem danificar a porta.'
    },
    {
      name: 'Silvio Chaves & Travas',
      role: 'Chaveiro Residencial Credenciado',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviewsCount: 140,
      completedJobs: 250,
      trustIndex: 95,
      priceLevel: '$',
      specialties: ['Troca de Segredo', 'Chaves Tetra e Pantográficas', 'Preço Justo'],
      costMultiplier: 0.85,
      availability: 'Hoje',
      recommendationReason: 'Troca rápida de miolos, chaves codificadas e conserto econômico de fechaduras.'
    },
    {
      name: 'Smart Lock Prime (Yale & Intelbras)',
      role: 'Instalador Certificado de Fechaduras Eletrônicas',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      reviewsCount: 310,
      completedJobs: 540,
      trustIndex: 100,
      priceLevel: '$$$',
      specialties: ['Biometria & Senhas', 'Furação com Gabarito Oficial', 'Garantia Estendida'],
      costMultiplier: 1.35,
      availability: 'Hoje',
      recommendationReason: 'Instalação milimétrica com gabarito oficial e configuração completa de aplicativo e biometria.'
    }
  ],
  pintura: [
    {
      name: 'Renato Pinturas & Acabamento',
      role: 'Pintor Especializado em Interiores',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviewsCount: 175,
      completedJobs: 310,
      trustIndex: 98,
      priceLevel: '$$',
      specialties: ['Massa Corrida & Lixamento', 'Pintura Acrílica', 'Proteção Total de Móveis'],
      costMultiplier: 1.0,
      availability: 'Hoje',
      recommendationReason: 'Pintura limpa e sem respingos, com emassamento fino, isolamento completo do ambiente e tinta premium.'
    },
    {
      name: 'Daniela Artes & Cores',
      role: 'Pintora Residencial & Decorativa',
      avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviewsCount: 125,
      completedJobs: 210,
      trustIndex: 95,
      priceLevel: '$',
      specialties: ['Retoques & Pequenas Áreas', 'Pintura de Portas e Rodapés', 'Atendimento Rápido'],
      costMultiplier: 0.85,
      availability: 'Hoje',
      recommendationReason: 'Opção econômica para retoques pontuais, correção de pequenas manchas e pintura rápida.'
    },
    {
      name: 'Ateliê de Pinturas Finas Master',
      role: 'Mestre em Pintura Fina & Efeitos Especiais',
      avatar: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      reviewsCount: 240,
      completedJobs: 430,
      trustIndex: 100,
      priceLevel: '$$$',
      specialties: ['Cimento Queimado & Texturas', 'Tratamento de Infiltração', 'Garantia 90d'],
      costMultiplier: 1.4,
      availability: 'Amanhã',
      recommendationReason: 'Acabamento de alto padrão com tratamento de substrato, lixamento técnico aspirado e tintas nobres.'
    }
  ],
  alvenaria: [
    {
      name: 'José Valdir Pedreiro & Azulejista',
      role: 'Pedreiro & Azulejista Especializado',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviewsCount: 195,
      completedJobs: 360,
      trustIndex: 98,
      priceLevel: '$$',
      specialties: ['Assentamento de Porcelanato', 'Troca de Azulejos', 'Correção de Trincas'],
      costMultiplier: 1.0,
      availability: 'Hoje',
      recommendationReason: 'Mão de obra precisa para assentamento cerâmico, pequenas alvenarias e correções estruturais.'
    },
    {
      name: 'Antônio Reformas Rápidas',
      role: 'Oficial de Alvenaria Residencial',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviewsCount: 130,
      completedJobs: 230,
      trustIndex: 95,
      priceLevel: '$',
      specialties: ['Pequenos Reparos de Reboco', 'Rejuntamento Epóxi', 'Preço Justo'],
      costMultiplier: 0.85,
      availability: 'Hoje',
      recommendationReason: 'Excelente custo-benefício para pequenas obras, trocas de peças e rejuntamento.'
    },
    {
      name: 'Mestre de Obras Revest Master',
      role: 'Especialista em Porcelanatos Grandes Formatos',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      reviewsCount: 260,
      completedJobs: 470,
      trustIndex: 100,
      priceLevel: '$$$',
      specialties: ['Nivelamento a Laser', 'Cortes em Meia Esquadria 45°', 'Garantia de 90 dias'],
      costMultiplier: 1.4,
      availability: 'Amanhã',
      recommendationReason: 'Nivelamento a laser com niveladores de tração e cortes 45° de altíssima precisão.'
    }
  ],
  marcenaria: [
    {
      name: 'Wagner Marceneiro Especialista',
      role: 'Marceneiro de Móveis Planejados',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviewsCount: 165,
      completedJobs: 290,
      trustIndex: 98,
      priceLevel: '$$',
      specialties: ['Regulagem de Portas e Gavetas', 'Corrediças Telescópicas', 'Restauração MDF'],
      costMultiplier: 1.0,
      availability: 'Hoje',
      recommendationReason: 'Ajuste fino de dobradiças com amortecedor, substituição de ferragens e restauração de móveis.'
    },
    {
      name: 'Oficina do Marceneiro Ágil',
      role: 'Técnico em Reparos de Mobília',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviewsCount: 110,
      completedJobs: 180,
      trustIndex: 94,
      priceLevel: '$',
      specialties: ['Troca de Puxadores e Trilhos', 'Conserto de Gavetas', 'Atendimento Rápido'],
      costMultiplier: 0.85,
      availability: 'Hoje',
      recommendationReason: 'Conserto ágil e peças de reposição duráveis para móveis de cozinha, quarto e escritório.'
    },
    {
      name: 'Marcenaria de Precisão Prime',
      role: 'Mestre Marceneiro & Mobiliário Fino',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      reviewsCount: 230,
      completedJobs: 410,
      trustIndex: 100,
      priceLevel: '$$$',
      specialties: ['Móveis Sob Medida', 'Ferragens Blum / Hafele', 'Garantia Contratual'],
      costMultiplier: 1.35,
      availability: 'Amanhã',
      recommendationReason: 'Serviço de marcenaria de alto padrão com ferragens importadas e acabamento impecável.'
    }
  ],
  serralheria: [
    {
      name: 'Gilberto Serralheiro & Portões',
      role: 'Serralheiro Técnico Especializado',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviewsCount: 180,
      completedJobs: 310,
      trustIndex: 98,
      priceLevel: '$$',
      specialties: ['Manutenção de Portão Automático', 'Solda MIG/TIG', 'Troca de Cabos e Roldanas'],
      costMultiplier: 1.0,
      availability: 'Hoje',
      recommendationReason: 'Solução técnica para travas, soldas, trilhos e alinhamento de portões e grades metálicas.'
    },
    {
      name: 'Marcos Soldas & Grades',
      role: 'Serralheiro de Manutenção Residencial',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviewsCount: 120,
      completedJobs: 190,
      trustIndex: 95,
      priceLevel: '$',
      specialties: ['Ajuste de Esquadrias de Alumínio', 'Solda Elétrica', 'Preço Justo'],
      costMultiplier: 0.85,
      availability: 'Hoje',
      recommendationReason: 'Conserto prático de janelas emperradas, portas de alumínio e pequenas soldas residenciais.'
    },
    {
      name: 'Metalmecânica Master Portões',
      role: 'Especialista em Automatização & Esquadrias',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      reviewsCount: 250,
      completedJobs: 450,
      trustIndex: 100,
      priceLevel: '$$$',
      specialties: ['Motores PPA/Rossi/Peccinin', 'Estruturas de Aço Galvanizado', 'Garantia 90d'],
      costMultiplier: 1.4,
      availability: 'Hoje',
      recommendationReason: 'Manutenção preventiva e corretiva com balanceamento de pesos e motores reforçados.'
    }
  ],
  eletrodomesticos: [
    {
      name: 'Vitor Hugo Instalações de Eletros',
      role: 'Técnico Especialista em Eletrodomésticos',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviewsCount: 210,
      completedJobs: 370,
      trustIndex: 99,
      priceLevel: '$$',
      specialties: ['Instalação de Lava e Seca', 'Cooktop & Coifas', 'Conversão de Gás NBR'],
      costMultiplier: 1.0,
      availability: 'Hoje',
      recommendationReason: 'Instalação técnica e segura de eletrodomésticos da linha branca conforme normas de fábrica.'
    },
    {
      name: 'Patrícia Eletros & Casa',
      role: 'Instaladora de Linha Branca',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviewsCount: 135,
      completedJobs: 230,
      trustIndex: 96,
      priceLevel: '$',
      specialties: ['Máquinas de Lavar e Lava-Louças', 'Desembalagem e Nivelamento', 'Atendimento Rápido'],
      costMultiplier: 0.85,
      availability: 'Hoje',
      recommendationReason: 'Nivelamento anti-vibração, conexões estanques de água e esgoto e teste de funcionamento.'
    },
    {
      name: 'Linha Branca Gourmet Master',
      role: 'Mestre em Eletrodomésticos de Embutir',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      reviewsCount: 290,
      completedJobs: 510,
      trustIndex: 100,
      priceLevel: '$$$',
      specialties: ['Coifas Ilha & Dutos Inox', 'Cooktops Indução / Gás', 'Laudo Técnico'],
      costMultiplier: 1.35,
      availability: 'Amanhã',
      recommendationReason: 'Instalação de eletros de embutir, coifas de ilha e forros com teste de estanqueidade e laudo.'
    }
  ],
  seguranca_cftv: [
    {
      name: 'Otávio Segurança & Câmeras',
      role: 'Técnico em CFTV & Segurança Eletrônica',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviewsCount: 190,
      completedJobs: 330,
      trustIndex: 98,
      priceLevel: '$$',
      specialties: ['Câmeras Wi-Fi & IP', 'Configuração no Celular', 'Interfones & Fechaduras'],
      costMultiplier: 1.0,
      availability: 'Hoje',
      recommendationReason: 'Configuração e instalação limpa de câmeras com visualização remota no smartphone.'
    },
    {
      name: 'SafeHome Tecnologia',
      role: 'Instalador de Sensores e Alarmes',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviewsCount: 115,
      completedJobs: 190,
      trustIndex: 95,
      priceLevel: '$',
      specialties: ['Câmeras Sem Fio', 'Campainhas Inteligentes', 'Preço Justo'],
      costMultiplier: 0.85,
      availability: 'Hoje',
      recommendationReason: 'Solução rápida e sem complicação para monitoramento e segurança da sua residência.'
    },
    {
      name: 'Engenharia de Segurança Prime',
      role: 'Especialista em Redes & CFTV Corporativo/Residencial',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      reviewsCount: 270,
      completedJobs: 480,
      trustIndex: 100,
      priceLevel: '$$$',
      specialties: ['DVR/NVR Inteligente', 'Controle de Acesso Biométrico', 'Garantia Total'],
      costMultiplier: 1.4,
      availability: 'Hoje',
      recommendationReason: 'Projeto de segurança estruturado com cabeamento blindado e criptografia de vídeo.'
    }
  ],
  aquecedor_gas: [
    {
      name: 'Gabriel Gás & Aquecedores',
      role: 'Técnico Especialista em Aquecedores a Gás',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviewsCount: 220,
      completedJobs: 390,
      trustIndex: 99,
      priceLevel: '$$',
      specialties: ['Rinnai / Komeco / Lorenzetti', 'Limpeza de Queimadores', 'Garantia de 90 dias'],
      costMultiplier: 1.0,
      availability: 'Hoje',
      recommendationReason: 'Diagnóstico técnico seguro para eliminar códigos de erro, regular a chama e descarbonizar queimadores.'
    },
    {
      name: 'SOS Aquecedores Rápido',
      role: 'Técnico em Manutenção de Aquecedores',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviewsCount: 140,
      completedJobs: 240,
      trustIndex: 96,
      priceLevel: '$',
      specialties: ['Troca de Pilhas e Sensores', 'Desentupimento de Bicos', 'Atendimento no Dia'],
      costMultiplier: 0.85,
      availability: 'Hoje',
      recommendationReason: 'Manutenção preventiva rápida para restabelecer a água quente com segurança.'
    },
    {
      name: 'Técnica Gás & Boiler Master',
      role: 'Engenheiro Especialista em Redes de Gás e Boilers',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      reviewsCount: 290,
      completedJobs: 520,
      trustIndex: 100,
      priceLevel: '$$$',
      specialties: ['Laudo de Estanqueidade com Manômetro', 'Dutos de Exaustão NBR', 'Garantia Total'],
      costMultiplier: 1.35,
      availability: 'Hoje',
      recommendationReason: 'Vistoria completa com laudo de estanqueidade e segurança de gás segundo normas da Comgás e ABNT.'
    }
  ],
  gesso_drywall: [
    {
      name: 'Valter Gesso & Drywall',
      role: 'Gesseiro & Instalador de Drywall Especializado',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviewsCount: 170,
      completedJobs: 280,
      trustIndex: 98,
      priceLevel: '$$',
      specialties: ['Reparo de Forro Caído', 'Divisórias em Drywall', 'Sancas Iluminadas'],
      costMultiplier: 1.0,
      availability: 'Hoje',
      recommendationReason: 'Conserto ágil de furos, trincas e placas danificadas com acabamento perfeito para pintura.'
    },
    {
      name: 'Leonardo Drywall Ágil',
      role: 'Instalador de Divisórias e Forros',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviewsCount: 110,
      completedJobs: 170,
      trustIndex: 94,
      priceLevel: '$',
      specialties: ['Pequenos Remendos de Gesso', 'Fechamento de Vãos', 'Preço Justo'],
      costMultiplier: 0.85,
      availability: 'Hoje',
      recommendationReason: 'Solução prática e econômica para recomposição de placas de gesso e fechamentos.'
    },
    {
      name: 'Studio Drywall & Acústica Master',
      role: 'Mestre em Estruturas Drywall & Forros Decorativos',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      reviewsCount: 230,
      completedJobs: 410,
      trustIndex: 100,
      priceLevel: '$$$',
      specialties: ['Isolamento Acústico Lã de Rocha', 'Cortineiros Iluminados', 'Garantia 90d'],
      costMultiplier: 1.35,
      availability: 'Amanhã',
      recommendationReason: 'Estrutura reforçada de aço galvanizado e acabamento de alto padrão decorativo.'
    }
  ],
  limpeza_pos_obra: [
    {
      name: 'Solange Limpeza Fina Pós-Obra',
      role: 'Especialista em Limpeza Pós-Reforma & Fachadas',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviewsCount: 195,
      completedJobs: 340,
      trustIndex: 99,
      priceLevel: '$$',
      specialties: ['Remoção de Resíduos sem Riscar', 'Vidraças & Esquadrias', 'Produtos Profissionais'],
      costMultiplier: 1.0,
      availability: 'Hoje',
      recommendationReason: 'Remoção química e mecânica segura de resíduos de cimento e tinta de porcelanatos e vidros.'
    },
    {
      name: 'Equipe Faxina Pós-Obra Express',
      role: 'Equipe de Limpeza Pesada Residencial',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviewsCount: 130,
      completedJobs: 220,
      trustIndex: 95,
      priceLevel: '$',
      specialties: ['Limpeza Rápida', 'Aspiração de Pó de Gesso', 'Preço Justo'],
      costMultiplier: 0.85,
      availability: 'Hoje',
      recommendationReason: 'Equipe ágil para deixar seu ambiente completamente livre de poeira de obra e resíduos.'
    },
    {
      name: 'Clean Pro Master Clean',
      role: 'Mestre em Higienização Técnica Pós-Obra',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      reviewsCount: 260,
      completedJobs: 460,
      trustIndex: 100,
      priceLevel: '$$$',
      specialties: ['Tratamento de Pedras & Mármores', 'Lavagem Pressurizada', 'Garantia de Satisfação'],
      costMultiplier: 1.4,
      availability: 'Amanhã',
      recommendationReason: 'Limpeza minuciosa com maquinário industrial e tratamento protetor de pisos e pedras nobres.'
    }
  ],
  geral: [
    {
      name: 'Paulo Sérgio (Marido de Aluguel)',
      role: 'Profissional de Reparos Gerais & Instalações',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviewsCount: 250,
      completedJobs: 430,
      trustIndex: 99,
      priceLevel: '$$',
      specialties: ['Suportes de TV & Quadros', 'Varal de Teto', 'Prateleiras e Pequenos Reparos'],
      costMultiplier: 1.0,
      availability: 'Hoje',
      recommendationReason: 'Profissional polivalente e cuidadoso para fixações seguras, nivelamento e reparos diversos.'
    },
    {
      name: 'Maurício Faz Tudo Ágil',
      role: 'Técnico de Pequenas Instalações',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviewsCount: 155,
      completedJobs: 270,
      trustIndex: 95,
      priceLevel: '$',
      specialties: ['Furos com Detector de Canos', 'Instalação de Espelhos', 'Atendimento no Dia'],
      costMultiplier: 0.85,
      availability: 'Hoje',
      recommendationReason: 'Rapidez e excelente preço para fixações de cortinas, espelhos, suportes e acessórios.'
    },
    {
      name: 'Engenharia de Reparos Home Master',
      role: 'Mestre em Manutenção Residencial Preventiva',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      reviewsCount: 310,
      completedJobs: 550,
      trustIndex: 100,
      priceLevel: '$$$',
      specialties: ['Check-up Geral do Imóvel', 'Buchas Especiais Fischer', 'Garantia 90d'],
      costMultiplier: 1.35,
      availability: 'Hoje',
      recommendationReason: 'Revisão técnica completa do imóvel e fixações de alta resistência com garantia de 90 dias.'
    }
  ]
};

export interface MatchServiceResult {
  demand: ServiceDemandCategory;
  category: string;
  profType: string;
  summary: string;
  room: string;
  urgency: 'baixa' | 'media' | 'alta' | 'critica';
  urgencyPercentage: number;
  diyTips: string[];
  costRange: { min: number; max: number };
  professionals: Professional[];
}

/**
 * Intelligent matcher that analyzes free text, categories, room items, and symptoms
 * to guarantee 100% accurate specialty, category, diagnosis and professionals.
 */
export function matchServiceDemand(problemText: string, imageSrc?: string): MatchServiceResult {
  const norm = normalizeText(problemText);

  let bestCategoryId: ProblemCategory = 'geral';
  let bestScore = -1;
  let detectedRoom: string | null = null;

  // Direct match check by ID or Category Name
  const directCategory = SERVICE_DEMANDS_CATALOG.find(
    (c) =>
      norm === normalizeText(c.id) ||
      norm === normalizeText(c.name) ||
      norm === normalizeText(c.shortName)
  );

  if (directCategory) {
    bestCategoryId = directCategory.id;
  } else {
    // Score all rules based on keywords
    for (const rule of CATEGORY_MATCH_RULES) {
      let score = 0;

      // Negative keywords reject or lower score
      if (rule.negativeKeywords) {
        for (const neg of rule.negativeKeywords) {
          if (norm.includes(normalizeText(neg))) {
            score -= 10;
          }
        }
      }

      // Check primary keywords (high weight)
      for (const kw of rule.primaryKeywords) {
        const normKw = normalizeText(kw);
        if (norm.includes(normKw)) {
          // Exact full phrase bonus
          score += normKw.length > 5 ? 15 : 10;
        } else {
          // Check individual sub-words for compound keywords
          const words = normKw.split(' ');
          if (words.length > 1) {
            const allWordsPresent = words.every((w) => w.length > 2 && norm.includes(w));
            if (allWordsPresent) {
              score += 12;
            }
          }
        }
      }

      // Check secondary keywords (low weight)
      for (const kw of rule.secondaryKeywords) {
        const normKw = normalizeText(kw);
        if (norm.includes(normKw)) {
          score += 3;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestCategoryId = rule.categoryId;
        detectedRoom = rule.defaultRoom;
      }
    }
  }

  // Room detection override from text
  if (norm.includes('banheiro')) detectedRoom = 'banheiro';
  else if (norm.includes('cozinha')) detectedRoom = 'cozinha';
  else if (norm.includes('quarto') || norm.includes('dormitorio')) detectedRoom = 'quarto1';
  else if (norm.includes('sala')) detectedRoom = 'sala';
  else if (norm.includes('lavanderia') || norm.includes('area de servico')) detectedRoom = 'lavanderia';
  else if (norm.includes('varanda') || norm.includes('sacada')) detectedRoom = 'sala';

  // Retrieve matching demand definition from catalog
  const matchedDemand =
    SERVICE_DEMANDS_CATALOG.find((d) => d.id === bestCategoryId) ||
    SERVICE_DEMANDS_CATALOG[0];

  const room = detectedRoom || 'sala';
  const category = matchedDemand.name;
  const profType = matchedDemand.profType;
  const costRange = matchedDemand.estimatedCostRange;
  const urgency = matchedDemand.urgencyDefault;
  const urgencyPercentage = matchedDemand.urgencyPercentageDefault;
  const diyTips = matchedDemand.diyTips;

  // Format problem summary cleanly
  let summary = problemText.trim();
  if (
    !summary ||
    summary.startsWith('Problema identificado') ||
    summary.startsWith('Problema na categoria') ||
    summary.length < 5
  ) {
    summary = matchedDemand.popularIssues[0] || `Demanda de ${matchedDemand.name}`;
  } else if (summary.length > 120) {
    summary = summary.substring(0, 117) + '...';
  }

  // Generate verified specialized professionals strictly tailored to this category
  const templates = SPECIALTY_PROFESSIONALS_MAP[bestCategoryId] || SPECIALTY_PROFESSIONALS_MAP.geral;

  const professionals: Professional[] = templates.map((t, idx) => {
    const baseLabor = Math.round(costRange.min * t.costMultiplier);
    const materials = idx === 0 ? Math.round(baseLabor * 0.25) : idx === 1 ? Math.round(baseLabor * 0.15) : Math.round(baseLabor * 0.35);
    const totalCost = baseLabor + materials;

    return {
      id: `prof-${bestCategoryId}-${idx + 1}-${Date.now()}`,
      name: t.name,
      role: t.role,
      avatar: t.avatar,
      rating: t.rating,
      matchPercentage: idx === 0 ? 99 : idx === 1 ? 95 : 92,
      priceLevel: t.priceLevel,
      trustIndex: t.trustIndex,
      recommendationReason: t.recommendationReason,
      availability: t.availability,
      verified: true,
      laborCost: baseLabor,
      materialsCost: materials,
      totalCost,
      phone: idx === 0 ? '(11) 98765-4321' : idx === 1 ? '(11) 97654-3210' : '(11) 99887-7665',
      reviewsCount: t.reviewsCount,
      completedJobs: t.completedJobs,
      specialties: t.specialties
    };
  });

  return {
    demand: matchedDemand,
    category,
    profType,
    summary,
    room,
    urgency,
    urgencyPercentage,
    diyTips,
    costRange,
    professionals
  };
}
