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
}

export interface CVData extends FormData {
  paymentId?: string;
}
