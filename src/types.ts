export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  image?: string; // String Base64 contendo a imagem (ex: data:image/jpeg;base64,...)
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  timestamp: string;
}

export interface MetricItem {
  name: string;
  ideal: string;
  science: string;
}

export interface InterventionItem {
  type: 'Softmaxxing' | 'Hardmaxxing';
  name: string;
  description: string;
}

export interface LookmaxCategory {
  id: string;
  title: string;
  description: string;
  metrics: MetricItem[];
  interventions: InterventionItem[];
}

export interface FacialParameter {
  id: string;
  label: string;
  value: number; // 0 to 10
  description: string;
  consequence: string;
  idealScientific: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: 'Anatomia' | 'Treino' | 'Skin' | 'Gíria';
  dangerLevel: 'safe' | 'warning' | 'danger';
  scientificAlternative?: string;
}
