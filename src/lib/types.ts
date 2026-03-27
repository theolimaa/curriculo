export interface Experiencia {
  empresa: string;
  cargo: string;
  periodo: string;
  descricao: string;
}

export interface Formacao {
  instituicao: string;
  curso: string;
  ano: string;
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
  estilo?: "vermelho" | "azul" | "verde" | "preto";
}

export interface CVData extends FormData {
  sessionId?: string;
}
