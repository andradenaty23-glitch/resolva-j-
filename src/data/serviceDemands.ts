import { ProblemCategory } from '../types';

export interface ServiceDemandCategory {
  id: ProblemCategory;
  name: string;
  shortName: string;
  iconName: string;
  badge?: string;
  description: string;
  profType: string;
  estimatedCostRange: { min: number; max: number };
  urgencyDefault: 'baixa' | 'media' | 'alta' | 'critica';
  urgencyPercentageDefault: number;
  popularIssues: string[];
  diyTips: string[];
  providerSpecialtyTitle: string;
}

export const SERVICE_DEMANDS_CATALOG: ServiceDemandCategory[] = [
  {
    id: 'hidraulica',
    name: 'Hidráulica & Encanamento',
    shortName: 'Hidráulica',
    iconName: 'Droplets',
    badge: 'Mais pedido',
    description: 'Vazamentos em canos, torneiras pingando, troca de registros, sifões e válvulas.',
    profType: 'Encanador Especializado',
    estimatedCostRange: { min: 90, max: 180 },
    urgencyDefault: 'alta',
    urgencyPercentageDefault: 75,
    popularIssues: [
      'Torneira da cozinha ou banheiro com vazamento contínuo',
      'Vazamento oculto no registro geral ou parede',
      'Troca de sifão e flexíveis da pia',
      'Substituição de válvula Hydra / descarga acoplada'
    ],
    diyTips: [
      'Feche imediatamente o registro geral de água do imóvel.',
      'Coloque recipientes ou panos sob o vazamento para proteger o piso e armários.'
    ],
    providerSpecialtyTitle: 'Encanador / Reparos Hidráulicos'
  },
  {
    id: 'eletrica',
    name: 'Elétrica Residencial & Comercial',
    shortName: 'Elétrica',
    iconName: 'Zap',
    badge: 'Alta urgência',
    description: 'Instalação de chuveiros, tomadas faiscando, disjuntores caindo, fiação e iluminação LED.',
    profType: 'Eletricista Certificado',
    estimatedCostRange: { min: 100, max: 220 },
    urgencyDefault: 'critica',
    urgencyPercentageDefault: 85,
    popularIssues: [
      'Chuveiro elétrico parou de esquentar ou queimou',
      'Disjuntor desarmando quando liga vários aparelhos',
      'Tomada esquentando, chiando ou faiscando',
      'Instalação de luminárias, spots e fitas de LED'
    ],
    diyTips: [
      'Desligue imediatamente o disjuntor correspondente no quadro de luz.',
      'Não utilize aparelhos de alta potência na mesma tomada (evite adaptadores T/benjamins).'
    ],
    providerSpecialtyTitle: 'Eletricista Residencial e Predial'
  },
  {
    id: 'ar_condicionado',
    name: 'Ar Condicionado & Refrigeração',
    shortName: 'Ar Condicionado',
    iconName: 'Snowflake',
    description: 'Higienização profunda, recarga de gás, desobstrução de dreno e instalação Split.',
    profType: 'Técnico em Climatização',
    estimatedCostRange: { min: 140, max: 280 },
    urgencyDefault: 'media',
    urgencyPercentageDefault: 50,
    popularIssues: [
      'Ar condicionado gotejando água para dentro do quarto',
      'Aparelho ligado mas não está gelando o ambiente',
      'Cheiro forte / mofo saindo da evaporadora',
      'Higienização completa preventiva com laudo'
    ],
    diyTips: [
      'Desligue o equipamento para evitar infiltrações na alvenaria ou piso de madeira.',
      'Lave periodicamente os filtros de ar removíveis sob água corrente morna.'
    ],
    providerSpecialtyTitle: 'Técnico de Ar Condicionado e Refrigeração'
  },
  {
    id: 'geral',
    name: 'Reparos Gerais & Marido de Aluguel',
    shortName: 'Reparos Gerais',
    iconName: 'Wrench',
    badge: 'Polivalente',
    description: 'Instalação de varal, suportes de TV, quadros, espelhos, prateleiras e pequenos ajustes.',
    profType: 'Profissional de Reparos Gerais',
    estimatedCostRange: { min: 80, max: 160 },
    urgencyDefault: 'baixa',
    urgencyPercentageDefault: 35,
    popularIssues: [
      'Instalação de suporte fixo/articulado para Smart TV',
      'Fixação de espelhos grandes, prateleiras e nichos',
      'Instalação de varal de teto ou parede',
      'Pequenos ajustes em portas, puxadores e rodapés'
    ],
    diyTips: [
      'Verifique se não há canos de água ou conduítes elétricos antes de perfurar a parede.',
      'Utilize buchas e parafusos adequados para o tipo de parede (alvenaria ou drywall).'
    ],
    providerSpecialtyTitle: 'Marido de Aluguel / Reparos Gerais'
  },
  {
    id: 'montagem_moveis',
    name: 'Montagem & Desmontagem de Móveis',
    shortName: 'Montador Móveis',
    iconName: 'Hammer',
    badge: 'Popular',
    description: 'Montagem precisa de guarda-roupas, camas, armários de cozinha, escrivaninhas e estantes.',
    profType: 'Montador de Móveis Profissional',
    estimatedCostRange: { min: 90, max: 200 },
    urgencyDefault: 'baixa',
    urgencyPercentageDefault: 30,
    popularIssues: [
      'Montagem de guarda-roupa casal com portas de correr',
      'Desmontagem e remontagem para mudança residencial',
      'Montagem de armários suspensos de cozinha',
      'Ajuste de gavetas emperradas e portas desalinhadas'
    ],
    diyTips: [
      'Mantenha todas as ferragens e manuais originais organizados em sacos plásticos.',
      'Reserve espaço amplo e limpo no cômodo para evitar danos aos painéis de MDF/MDP.'
    ],
    providerSpecialtyTitle: 'Montador de Móveis e Estofados'
  },
  {
    id: 'desentupimento',
    name: 'Desentupimento Especializado',
    shortName: 'Desentupimento',
    iconName: 'AlertTriangle',
    badge: '24 Horas',
    description: 'Desobstrução de pias, ralos, vasos sanitários, caixas de gordura e esgoto sem quebrar piso.',
    profType: 'Técnico em Desentupimento',
    estimatedCostRange: { min: 120, max: 260 },
    urgencyDefault: 'critica',
    urgencyPercentageDefault: 90,
    popularIssues: [
      'Vaso sanitário com retorno de água ou entupido',
      'Ralo do banheiro transbordando durante o banho',
      'Pia da cozinha descendo a água muito devagar',
      'Limpeza e desobstrução de caixa de gordura'
    ],
    diyTips: [
      'Não utilize soda cáustica ou ácidos fortes pois danificam as tubulações de PVC.',
      'Interrompa o fluxo de água no local afetado até a chegada do técnico.'
    ],
    providerSpecialtyTitle: 'Desentupidora e Saneamento'
  },
  {
    id: 'pintura',
    name: 'Pintura Residencial & Acabamento',
    shortName: 'Pintura',
    iconName: 'Paintbrush',
    description: 'Pintura de paredes, tetos, portas, aplicação de massa corrida, textura e retoques.',
    profType: 'Pintor Especializado',
    estimatedCostRange: { min: 150, max: 400 },
    urgencyDefault: 'baixa',
    urgencyPercentageDefault: 25,
    popularIssues: [
      'Pintura de paredes internas com correção de imperfeições',
      'Retoque de manchas de umidade ou furos antigos',
      'Aplicação de verniz e esmalte sintético em portas/janelas',
      'Pintura de teto com tinta antimofo'
    ],
    diyTips: [
      'Proteja rodapés, pisos e móveis com lonas plásticas e fita crepe.',
      'Lixe a superfície e remova todo o pó antes de aplicar a primeira demão.'
    ],
    providerSpecialtyTitle: 'Pintor Residencial e Decorativo'
  },
  {
    id: 'fechadura',
    name: 'Chaveiro & Fechaduras Digitais',
    shortName: 'Chaveiro / Smart',
    iconName: 'Key',
    badge: 'Plantão',
    description: 'Abertura de portas, troca de segredo, instalação de fechaduras eletrônicas e biométricas.',
    profType: 'Chaveiro Profissional 24h',
    estimatedCostRange: { min: 80, max: 190 },
    urgencyDefault: 'alta',
    urgencyPercentageDefault: 80,
    popularIssues: [
      'Chave travou ou quebrou dentro do tambor da fechadura',
      'Porta bateu e trancou com chaves do lado de dentro',
      'Instalação e configuração de Fechadura Digital / Biométrica',
      'Troca preventiva do segredo do miolo da porta principal'
    ],
    diyTips: [
      'Nunca use óleo de cozinha em cilindros (use grafite em pó seco).',
      'Não tente forçar a chave com alicate para não agravar a trava interna.'
    ],
    providerSpecialtyTitle: 'Chaveiro 24h e Fechaduras Digitais'
  },
  {
    id: 'alvenaria',
    name: 'Alvenaria & Pequenas Reformas',
    shortName: 'Alvenaria / Obra',
    iconName: 'Layers',
    description: 'Assentamento de pisos, porcelanatos, reboco, conserto de trincas e pequenas reformas.',
    profType: 'Pedreiro / Azulejista',
    estimatedCostRange: { min: 130, max: 350 },
    urgencyDefault: 'media',
    urgencyPercentageDefault: 45,
    popularIssues: [
      'Troca de pisos quebrados ou azulejos soltos no banheiro',
      'Correção de trincas na alvenaria e reboco esfarelando',
      'Abertura de vãos para portas ou passagens',
      'Construção de bancadas e muretas em alvenaria'
    ],
    diyTips: [
      'Identifique se a trinca é superficial ou estrutural antes de fechar.',
      'Utilize argamassa com especificação correta para áreas úmidas (AC-II ou AC-III).'
    ],
    providerSpecialtyTitle: 'Pedreiro e Azulejista'
  },
  {
    id: 'serralheria',
    name: 'Serralheria, Portões & Janelas',
    shortName: 'Serralheria',
    iconName: 'Shield',
    description: 'Manutenção de portões automáticos, soldas, trilhos, grades, esquadrias e travas.',
    profType: 'Serralheiro Técnico',
    estimatedCostRange: { min: 110, max: 270 },
    urgencyDefault: 'media',
    urgencyPercentageDefault: 55,
    popularIssues: [
      'Portão basculante ou deslizante travando no trilho',
      'Solda em grades de proteção ou suportes metálicos',
      'Ajuste de esquadrias e janelas de alumínio emperradas',
      'Troca de cabo de aço e roldanas de portão automático'
    ],
    diyTips: [
      'Limpe o trilho do portão de terra e folhas que possam travar as roldanas.',
      'Lubrifique as articulações com graxa apropriada periodicamente.'
    ],
    providerSpecialtyTitle: 'Serralheiro e Esquadrias Metálicas'
  },
  {
    id: 'marcenaria',
    name: 'Marcenaria & Móveis Planejados',
    shortName: 'Marcenaria',
    iconName: 'Component',
    description: 'Regulagem de dobradiças, corrediças telescópicas, restauração e móveis sob medida.',
    profType: 'Marceneiro Especializado',
    estimatedCostRange: { min: 100, max: 250 },
    urgencyDefault: 'baixa',
    urgencyPercentageDefault: 35,
    popularIssues: [
      'Portas de armários planejados desalinhadas ou caindo',
      'Troca de corrediças telescópicas de gavetas emperradas',
      'Recorte em tampos de madeira para passagem de fiação/pias',
      'Substituição de puxadores e dobradiças amortecedoras'
    ],
    diyTips: [
      'Aperte os parafusos centrais das dobradiças para regular o alinhamento das portas.',
      'Evite umidade direta em MDF/MDP para não estufar as bordas.'
    ],
    providerSpecialtyTitle: 'Marceneiro de Móveis Planejados'
  },
  {
    id: 'eletrodomesticos',
    name: 'Instalação de Eletrodomésticos',
    shortName: 'Eletrodomésticos',
    iconName: 'Refrigerator',
    badge: 'Instalação',
    description: 'Instalação de máquina lava e seca, cooktop a gás, coifas, depuradores e lava-louças.',
    profType: 'Técnico de Instalação de Eletros',
    estimatedCostRange: { min: 90, max: 190 },
    urgencyDefault: 'media',
    urgencyPercentageDefault: 45,
    popularIssues: [
      'Instalação de Máquina de Lavar / Lava e Seca (água e dreno)',
      'Instalação e conversão de Cooktop ou Fogão a gás encanado',
      'Fixação e ligação de Coifa / Depurador de ar inox',
      'Instalação de Máquina Lava-Louças de embutir'
    ],
    diyTips: [
      'Use mangueiras flexíveis metálicas normatizadas (NBR) para conexões de gás.',
      'Remova os parafusos de transporte traseiros da máquina de lavar antes do primeiro uso.'
    ],
    providerSpecialtyTitle: 'Instalador de Eletrodomésticos e Linha Branca'
  },
  {
    id: 'seguranca_cftv',
    name: 'Segurança Eletrônica & CFTV',
    shortName: 'Câmeras / CFTV',
    iconName: 'Video',
    description: 'Câmeras de segurança Wi-Fi/IP, interfones, sensores de presença e alarmes residenciais.',
    profType: 'Técnico em Segurança Eletrônica',
    estimatedCostRange: { min: 120, max: 300 },
    urgencyDefault: 'media',
    urgencyPercentageDefault: 50,
    popularIssues: [
      'Instalação e configuração de câmeras IP / Wi-Fi no celular',
      'Interfone ou vídeo porteiro sem áudio ou sem abrir o portão',
      'Instalação de sensores de presença e refletores externos',
      'Manutenção de central de alarme e cerca elétrica'
    ],
    diyTips: [
      'Posicione as câmeras em pontos com boa cobertura do roteador Wi-Fi.',
      'Configure senhas fortes e autenticação em duas etapas no aplicativo das câmeras.'
    ],
    providerSpecialtyTitle: 'Técnico em CFTV e Segurança Eletrônica'
  },
  {
    id: 'limpeza_pos_obra',
    name: 'Limpeza Pós-Obra & Fachadas',
    shortName: 'Limpeza Pós-Obra',
    iconName: 'Sparkles',
    description: 'Limpeza fina pós-reforma, remoção de resíduos de cimento, rejunte e vidraças altas.',
    profType: 'Especialista em Limpeza Pós-Obra',
    estimatedCostRange: { min: 180, max: 450 },
    urgencyDefault: 'baixa',
    urgencyPercentageDefault: 20,
    popularIssues: [
      'Remoção de respingos de tinta e cimento em pisos de porcelanato',
      'Limpeza pesada pós-obra de apartamento ou casa inteira',
      'Higienização de esquadrias e vidraças de sacada',
      'Lavagem pressurizada de quintal e pedras externas'
    ],
    diyTips: [
      'Nunca utilize produtos abrasivos ou palha de aço em porcelanatos e vidros.',
      'Aspire todo o pó fino de gesso antes de molhar os pisos.'
    ],
    providerSpecialtyTitle: 'Higienização e Limpeza Pós-Obra'
  },
  {
    id: 'aquecedor_gas',
    name: 'Aquecedores a Gás & Boiler',
    shortName: 'Aquecedor a Gás',
    iconName: 'Flame',
    badge: 'Segurança Gás',
    description: 'Revisão periódica, regulagem de chama, desobstrução, troca de flexíveis e exaustão.',
    profType: 'Técnico Especialista em Gás',
    estimatedCostRange: { min: 130, max: 260 },
    urgencyDefault: 'alta',
    urgencyPercentageDefault: 80,
    popularIssues: [
      'Aquecedor a gás apresentando código de erro ou apagando',
      'Água da ducha esfriando no meio do banho',
      'Cheiro suspeito de gás próximo ao aparelho',
      'Revisão preventiva anual obrigatória e limpeza dos queimadores'
    ],
    diyTips: [
      'Em caso de cheiro de gás, feche o registro imediatamente e abra todas as janelas.',
      'Não acenda luzes ou fósforos em ambientes com suspeita de vazamento de gás.'
    ],
    providerSpecialtyTitle: 'Técnico de Aquecedor a Gás e Boiler'
  },
  {
    id: 'gesso_drywall',
    name: 'Gesso & Paredes em Drywall',
    shortName: 'Gesso / Drywall',
    iconName: 'Square',
    description: 'Reparo de forros de gesso caídos, sancas iluminadas, divisórias em drywall e pintura de reforço.',
    profType: 'Gesseiro / Instalador de Drywall',
    estimatedCostRange: { min: 110, max: 260 },
    urgencyDefault: 'media',
    urgencyPercentageDefault: 40,
    popularIssues: [
      'Reparo de buraco ou corte no teto de gesso após vazamento',
      'Instalação de divisória de ambientes em Drywall',
      'Construção de sanca ou cortineiro de gesso iluminado',
      'Reforço interno para instalação de TV pesada em drywall'
    ],
    diyTips: [
      'Utilize buchas específicas tipo "Fly" ou "Togler" para fixação de objetos em gesso/drywall.',
      'Deixe o gesso secar completamente antes de aplicar selador e tinta.'
    ],
    providerSpecialtyTitle: 'Gesseiro e Especialista em Drywall'
  }
];
