export interface Servico {
  id: string;
  nome: string;
  categoria: string;
  telefone: string;
  telefone_numeros: string;
  cidade_bairro: string;
  descricao?: string;
  quem_indicou?: string;
  instagram?: string;
  nota_media: number;
  total_avaliacoes: number;
  pontuacao_inteligente?: number;
  selo_destaque?: boolean;
  verificado_admin?: boolean;
  atende_fim_de_semana?: boolean;
  created_at: string;
}

export const BAIRROS_INDAIATUBA = [
  "Todos os Bairros",
  "Jd. Regente",
  "Morada do Sol",
  "Itaici",
  "Centro",
  "Vila Avaí",
  "Jd. Pau Preto",
  "Parque Ecológico",
  "Jd. Esplanada",
  "Jd. Bela Vista",
  "Regente Feijó",
  "Outro Bairro",
] as const;

export interface Avaliacao {
  id: string;
  servico_id: string;
  nome_avaliador: string;
  nota: number; // 1 a 5
  comentario?: string;
  created_at: string;
}

export type TipoOrdenacao = "melhores" | "recomendados" | "recentes" | "alfabetica";

export const CATEGORIAS_DISPONIVEIS = [
  "Todos",
  "Eletricista",
  "Encanador",
  "Diarista / Limpeza",
  "Mecânico",
  "Reformas / Pedreiro",
  "Pintor / Gesso",
  "Pet / Veterinário",
  "Restaurante / Lanche",
  "Ar Condicionado",
  "Beleza / Estética",
  "Saúde / Terapia",
  "Aulas / Reforço",
  "Costura / Roupas",
  "Tecnologia / Celular",
  "Outros",
] as const;
