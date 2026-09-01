import { ProblemCategory, Professional, DiagnosisResult, ServicoDoc, UsuarioDoc } from '../types';
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
    negativeKeywords: [],
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
    negativeKeywords: [],
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
    negativeKeywords: [],
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
    negativeKeywords: [],
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
    negativeKeywords: [],
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
    negativeKeywords: [],
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
    negativeKeywords: [],
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
    negativeKeywords: [],
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
    negativeKeywords: [],
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
    negativeKeywords: [],
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
    negativeKeywords: [],
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
    negativeKeywords: [],
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
    negativeKeywords: [],
    defaultRoom: 'sala'
  }
];

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
 * and directly matches with real professionals and services from the database.
 */
export function matchServiceDemand(
  problemText: string,
  imageSrc?: string,
  realServicos: ServicoDoc[] = [],
  realUsuarios: UsuarioDoc[] = []
): MatchServiceResult {
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
          score += normKw.length > 5 ? 15 : 10;
        } else {
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

  // DIRECT REAL DATABASE CONNECTION:
  // Match exclusively from real registered services and users stored in Firestore!
  const matchedRealProfessionals: Professional[] = [];
  const seenIds = new Set<string>();

  // 1. Match from real active services (ServicoDoc)
  const normCat = normalizeText(matchedDemand.name);
  const normCatId = normalizeText(matchedDemand.id);

  if (Array.isArray(realServicos) && realServicos.length > 0) {
    const relevantServicos = realServicos.filter((s) => {
      if (s.ativo === false) return false;
      const sCatId = normalizeText(s.categoriaId || '');
      const sCatNome = normalizeText(s.categoriaNome || '');
      const sNome = normalizeText(s.nome || '');
      const sDesc = normalizeText(s.descricao || '');

      // Direct category or keyword matches
      const matchesCategory =
        sCatId === normCatId ||
        sCatId.includes(normCatId) ||
        sCatNome.includes(normCat) ||
        normCat.includes(sCatNome);

      const matchesText =
        Boolean(norm) &&
        (sNome.includes(norm) ||
          norm.includes(sNome) ||
          sDesc.includes(norm) ||
          matchedDemand.popularIssues.some((issue) => sNome.includes(normalizeText(issue)) || sDesc.includes(normalizeText(issue))));

      return matchesCategory || matchesText;
    });

    for (const s of relevantServicos) {
      const profKey = s.id || `srv-${s.profissionalId}`;
      if (!seenIds.has(profKey)) {
        seenIds.add(profKey);

        const price = Number(s.preco) || costRange.min;
        const priceLevel: '$' | '$$' | '$$$' =
          price <= 100 ? '$' : price <= 250 ? '$$' : '$$$';

        matchedRealProfessionals.push({
          id: s.id,
          name: s.profissionalNome || 'Profissional Credenciado',
          role: s.nome || matchedDemand.profType,
          avatar: s.profissionalFoto || s.imagem || '',
          rating: Number(s.avaliacaoMedia) || 5.0,
          matchPercentage: 98,
          priceLevel,
          trustIndex: 99,
          recommendationReason: s.descricao || `Profissional credenciado em ${s.cidade || 'sua região'}.`,
          availability: 'Hoje',
          verified: true,
          laborCost: price,
          materialsCost: 0,
          totalCost: price,
          phone: s.telefone || s.whatsapp || '(11) 99999-9999',
          reviewsCount: Number(s.totalAvaliacoes) || 0,
          completedJobs: Number(s.totalAvaliacoes) || 1,
          specialties: [s.categoriaNome, s.cidade || 'Atendimento Residencial'].filter(Boolean) as string[],
          bairro: s.bairro || '',
          cidade: s.cidade || ''
        });
      }
    }
  }

  // 2. Match from real registered providers in database (UsuarioDoc with tipo === 'profissional')
  if (Array.isArray(realUsuarios) && realUsuarios.length > 0) {
    const relevantUsers = realUsuarios.filter((u) => {
      if (u.tipo !== 'profissional') return false;
      const uSpecs = (u.especialidades || []).map((sp) => normalizeText(sp));

      const matchesCategory =
        uSpecs.some((sp) => sp.includes(normCat) || normCat.includes(sp) || sp.includes(normCatId)) ||
        (u.bio ? normalizeText(u.bio).includes(normCat) || normalizeText(u.bio).includes(normCatId) : false);

      return matchesCategory || uSpecs.length === 0;
    });

    for (const u of relevantUsers) {
      const userKey = u.uid || u.email;
      if (!seenIds.has(userKey)) {
        seenIds.add(userKey);

        const price = Number(u.valorBase) || costRange.min;
        const priceLevel: '$' | '$$' | '$$$' =
          price <= 100 ? '$' : price <= 250 ? '$$' : '$$$';

        matchedRealProfessionals.push({
          id: u.uid,
          name: u.nome || 'Prestador Credenciado',
          role: (u.especialidades && u.especialidades[0]) || matchedDemand.profType,
          avatar: u.foto || '',
          rating: Number(u.avaliacaoMedia) || 5.0,
          matchPercentage: 95,
          priceLevel,
          trustIndex: u.cpf ? 100 : 96,
          recommendationReason: u.bio || `Especialista credenciado em ${u.cidade || 'sua região'}.`,
          availability: 'Hoje',
          verified: true,
          laborCost: price,
          materialsCost: 0,
          totalCost: price,
          phone: u.telefone || '(11) 99999-9999',
          reviewsCount: Number(u.totalAvaliacoes) || 0,
          completedJobs: Number(u.totalAvaliacoes) || 0,
          specialties: u.especialidades && u.especialidades.length > 0 ? u.especialidades : [matchedDemand.name, u.cidade || 'São Paulo'],
          bairro: u.bairro || '',
          cidade: u.cidade || ''
        });
      }
    }
  }

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
    professionals: matchedRealProfessionals
  };
}
