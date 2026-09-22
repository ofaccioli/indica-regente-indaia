export interface Servico {
  id: string;
  nome: string;
  categoria: string;
  telefone: string;
  telefone_numeros: string;
  telefone_secundario?: string;
  telefone_secundario_numeros?: string;
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
  eh_morador?: boolean;
  tipo_atendimento?: "domicilio" | "local" | "ambos";
  created_at: string;
}

export interface PedidoMural {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  morador_nome: string;
  bairro: string;
  whatsapp_contato?: string;
  urgente?: boolean;
  status: "aberto" | "resolvido";
  respostas?: RespostaMural[];
  created_at: string;
}

export interface RespostaMural {
  id: string;
  pedido_id: string;
  autor_nome: string;
  mensagem: string;
  servico_id_indicado?: string;
  servico_nome_indicado?: string;
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
