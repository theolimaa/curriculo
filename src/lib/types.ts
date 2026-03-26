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

export interface FormData {
  nome: string;
  telefone: string;
  email: string;
  cidade: string;
  objetivo: string;
  experiencias: Experiencia[];
  formacao: Formacao[];
  habilidades: string;
  foto?: string; // base64
}

export interface CVData extends FormData {
  sessionId?: string;
}
