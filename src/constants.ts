import { GlossaryTerm, FacialParameter } from "./types";

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: "Mewing",
    definition: "Técnica de reeducação postural lingual onde toda a língua (especialmente o terço posterior) é pressionada contra o palato duro. Promove forças biomecânicas de remodelamento no osso maxilar anterior e superior.",
    category: "Anatomia",
    dangerLevel: "safe",
    scientificAlternative: "Ortotropia Facial e Reeducação Miofuncional."
  },
  {
    term: "Hunter Eyes",
    definition: "Olhar predatório caracterizado por órbitas compactas, pálpebras superiores encapuzadas (hooding), tilt cantal positivo e ausência completa de esclera inferior visível. Indica forte suporte ósseo infraorbitário.",
    category: "Anatomia",
    dangerLevel: "safe",
    scientificAlternative: "Suficiência de suporte malar e infraorbitário."
  },
  {
    term: "Canthal Tilt",
    definition: "A orientação angular do canto externo do olho em relação ao interno. Um ângulo ascendente (+1° a +5°) é considerado positivo (Hunter Eyes), enquanto um ângulo descendente é negativo (Prey Eyes/Sad Eyes).",
    category: "Anatomia",
    dangerLevel: "safe"
  },
  {
    term: "Bone Smashing",
    definition: "Prática irracional que consiste em martelar e fraturar deliberadamente os próprios ossos faciais com objetos duros sob a falsa interpretação da Lei de Wolff, buscando calcificação volumétrica.",
    category: "Gíria",
    dangerLevel: "danger",
    scientificAlternative: "EXTREMAMENTE PERIGOSO. Fraturas micro-cominutivas irregulares causam assimetria permanente, infecções ósseas (osteomielite), necrose vascular do periósteo e paralisia de ramos nervosos do nervo facial."
  },
  {
    term: "Chewing",
    definition: "Exercício mastigatório crônico utilizando gomas de extrema dureza (goma de mastic natural ou borracha Falim) com o objetivo de gerar hipertrofia de trabalho no músculo masseter humano.",
    category: "Treino",
    dangerLevel: "warning",
    scientificAlternative: "Estímulo de resistência mastigatória. Deve ser moderado para evitar distúrbios graves na articulação temporomandibular (DTA)."
  },
  {
    term: "Forward Growth",
    definition: "Crescimento anteroposterior ideal do complexo maxilomandibular. Rostos com crescimento para frente têm mandíbulas fortes, queixos proeminentes e excelente suporte infraorbitário.",
    category: "Anatomia",
    dangerLevel: "safe",
    scientificAlternative: "Ortognatismo craniofacial equilibrado."
  },
  {
    term: "Gonial Angle",
    definition: "O ângulo entre o ramo vertical e a base horizontal da mandíbula. O ideal masculino estético está entre 110° e 120° para um delineamento robusto do terço inferior do rosto.",
    category: "Anatomia",
    dangerLevel: "safe"
  },
  {
    term: "Bloat",
    definition: "Retenção excessiva hídrica e lipídica extracelular subcutânea que cobre a definição óssea natural do rosto e do queixo. Geralmente causado por cortisol alto, picos frequentes de insulina e alta ingestão de sódio.",
    category: "Skin",
    dangerLevel: "safe",
    scientificAlternative: "Edema subcutâneo intersticial por desbalanço de eletrólitos/hormônios."
  },
  {
    term: "Softmaxxing",
    definition: "Autoaperfeiçoamento puramente de hábitos reversíveis e acessíveis (rotina de skincare científica, controle de percentual de gordura, higiene bucal, postura, mastigação e penteado).",
    category: "Gíria",
    dangerLevel: "safe"
  },
  {
    term: "Hardmaxxing",
    definition: "Mudanças cirúrgicas invasivas permanentes (osteotomias como avanço de queixo, implantes de mandíbula personalizados, cantoplastias, transplantes capilares ou correção ortodôntica osteossuportada).",
    category: "Gíria",
    dangerLevel: "warning",
    scientificAlternative: "Medicina Estética e Cirurgia Craniomaxilofaciais."
  },
  {
    term: "Skinmaxx",
    definition: "Maximização da saúde e brilho da pele. Foco na restauração de barreira de colágeno através de protetores de radiação solar UVA/UVB e retinoides ativos de grau médico.",
    category: "Skin",
    dangerLevel: "safe",
    scientificAlternative: "Farmacologia Tópica Dermatológica."
  }
];

export const INITIAL_PARAMETERS: FacialParameter[] = [
  {
    id: "canthal_tilt",
    label: "Canthal Tilt (Inclinação Cantal)",
    value: 5, // Neutral
    description: "Ângulo entre o epicanto interno e o canto externo do olho. Determina o olhar predatório ou o olhar de pressa.",
    consequence: "Olhos neutros. Harmonia ocular básica.",
    idealScientific: "Tilt Cantal Positivo (+3° a +5°). Reduz exposição de esclera e confere olhar forte, compacto e atrativo."
  },
  {
    id: "mandibular_angle",
    label: "Ângulo Gonial Mandibular",
    value: 4, // 135 deg
    description: "Determina a projeção angulada do osso da mandíbula. Ângulos muito abertos (>130°) dão um visual de pescoço misturado com o rosto.",
    consequence: "Mandíbula levemente arredondada, definição moderada.",
    idealScientific: "Entre 110° e 120° na cefalometria. Otimizado por hipertrofia segura do masseter e controle preciso de gordura corporal."
  },
  {
    id: "body_fat",
    label: "Percentual de Gordura (Body Fat %)",
    value: 18, // 18%
    description: "Gordura corporal total. Afeta diretamente as bochechas sebáceas (coxins bucais) e acumulações sebáceas submentonianas (papada).",
    consequence: "Traços ósseos escondidos sob tecido adiposo subcutâneo médio.",
    idealScientific: "10% a 12% para homens e 18% para mulheres. É o softmax número um para evidenciar a linha mandibular real."
  },
  {
    id: "midface_ratio",
    label: "Proporção do Midface",
    value: 6, // Average
    description: "A relação de altura entre os olhos e a boca. Um midface muito longo causa a impressão de rosto envelhecido ou flácido.",
    consequence: "Midface regular. Aparência facial comum.",
    idealScientific: "Fração ideal dourada de cerca de 0.9 a 1.0 (relação de largura/altura compacta). Estimulado por crescimento maxilar anteroposterior."
  },
  {
    id: "neck_girth",
    label: "Relação Circunferência Pescoço vs Mandíbula",
    value: 5, // Slightly thin
    description: "Espessura do pescoço em relação à base da mandíbula. Pescoços muito finos passam aparência de fragilidade física extrema.",
    consequence: "Pescoço mais estreito que o ramo mandibular lateral, desproporcional.",
    idealScientific: "A largura lateral do pescoço deve se alinhar perfeitamente com a junção gonial mandibular lateral periférica."
  },
  {
    id: "clavicle_index",
    label: "Largura Clavicular (V-Taper Frame)",
    value: 5, // Average
    description: "Comprimento ósseo acromioclavicular que dita a amplitude natural dos seus ombros.",
    consequence: "Estrutura equilibrada, visual clássico de ombro padrão.",
    idealScientific: "Clavículas longas horizontais acopladas a baixo diâmetro de cintura escapular. Pode ser maximizado com foco em deltoides laterais robustos."
  }
];

export const DAILY_HYPER_ROUTINES = [
  {
    title: "1. Biomecânica da Maxila (Ortotropia)",
    duration: "Contínuo / 30 min focados",
    steps: [
      { name: "Alinhamento Lingual Ativo (Mewing Contínuo)", detail: "Cole o terço posterior da língua contra o palato, selando os dentes levemente e lábios fechados. Respire puramente pelo nariz." },
      { name: "Sessão de Mastigação Mecânica (Chewing)", detail: "Masque goma de mastic dura por 15 a 20 minutos de forma bilateral controlada. Alterne os lados para evitar assimetrias musculares e articulares. Lave o rosto com água fria em seguida." },
      { name: "Swallowing Posture (Deglutição Correta)", detail: "Sempre engula saliva utilizando puramente a musculatura do pescoço e da língua, sem mover bochechas ou lábios faciais. Isso impede a hipertrofia indesejada do músculo bucinador (bochechas gordas)." }
    ]
  },
  {
    title: "2. Otimização Epidérmica Científica (Skinmaxx)",
    duration: "Rotina Diária (Manhã e Noite)",
    steps: [
      { name: "Manhã: Bloqueio UVB/UVA & Hidratação", detail: "Lave o rosto apenas com água ou cleanser suave. Aplique um antioxidante de Vitamina C estabilizado e complemente com protetor solar FPS 50. Previne o envelhecimento e degradação do colágeno das órbitas oculares." },
      { name: "Noite: Estimulação de Retinol e Renovação", detail: "Aplique Tretinoína ou Retinol ativo após limpar o rosto. O ácido ativa receptores celulares internos, acelerando a taxa mitótica da pele para cobrir cicatrizes sebáceas e linhas de expressão." },
      { name: "Terapia de Choque Frio (Ice Therapy)", detail: "Massageie o rosto com gelo ou tome um banho ultra-frio por 3 minutos ao acordar para causar vasoconstrição periférica agressiva, drenando edemas inflamatórios do sono ('debloating')." }
    ]
  },
  {
    title: "3. Redução de Bloat e Alinhamento do Frame (Anabolismo Estético)",
    duration: "Contínuo / Foco diário",
    steps: [
      { name: "Eliminação Científica da Gordura Subcutânea", detail: "Mantenha ingestão alta de proteína (2g/kg) em leve déficit calórico para retirar os depósitos adiposos de bochechas profundas, revelando a mandíbula óssea enterrada." },
      { name: "Drenagem Hídrica da Face (Zero Bloat Intracelular)", detail: "Consuma pelo menos 3.5 a 4 litros de água pura diários para expulsar a aldosterona de retenção. Elimine açúcares rápidos e mantenha o sódio controlado. Suplemente Potássio e Magnésio para equilibrar a bomba de sódio-potássio." },
      { name: "Hipertrofia do Deltoide Lateral (Efeito V-Taper)", detail: "Priorize elevações laterais progressivas na polia e halteres 3 vezes por semana em alta intensidade para forçar o alargamento visual da clavícula estreita, mudando as relações de proporção corporal." }
    ]
  }
];
