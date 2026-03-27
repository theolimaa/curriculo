export interface Experiencia {
  empresa: string;
  cargo: string;
  periodo: string;
  descricao: string;
}

export interface Formacao {
  instituicao: string;
  curso: string;
  grau?: string;
  grau2?: string;
  periodoInicio?: string;
  periodoFim?: string;
  presente?: boolean;
  descricao?: string;
  ano?: string;
}

export interface Habilidade {
  nome: string;
  nivel: "basico" | "intermediario" | "avancado";
}

export interface FormData {
  nome: string;
  telefone: string;
  email: string;
  cidade: string;
  objetivo: string;
  experiencias: Experiencia[];
  formacao: Formacao[];
  habilidades: Habilidade[];
  foto?: string;
  fotoOffset?: { x: number; y: number };
  estilo?: "vermelho" | "azul" | "verde" | "preto";
}

export interface CVData extends FormData {
  sessionId?: string;
}
