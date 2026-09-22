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

export const BAIRROS_DESTAQUE = [
  "Todos os Bairros",
  "Jd. Regente",
  "Parque Real",
  "Jd. Morada do Sol",
  "Jd. Hubert",
  "Jd. Alice",
  "Centro",
  "Itaici",
] as const;

export const GRUPOS_BAIRROS = [
  {
    nome: "📍 Jd. Regente & Vizinhos Imediatos",
    bairros: [
      "Jd. Regente",
      "Parque Real",
      "Jd. Morada do Sol",
      "Jd. Hubert",
      "Jd. Alice",
      "Jd. Tancredo Neves",
      "Jd. Lauro Bueno",
      "Jd. Rêmulo Zoppi",
      "Jd. Eldorado",
      "Jd. Califórnia",
      "Jd. São Conrado",
      "Jd. Nely",
      "Jd. Belo Horizonte",
      "Jd. Bom Princípio",
      "Jd. Brasil",
      "Jd. Tropical",
      "Jd. Santa Cruz",
      "Jd. Colonial",
      "Vila Brigadeiro Faria Lima (Cecap)",
    ],
  },
  {
    nome: "🏙️ Região Central & Intermediária",
    bairros: [
      "Cidade Nova I",
      "Cidade Nova II",
      "Vila Avaí",
      "Jd. Pau Preto",
      "Centro",
      "Parque Ecológico",
      "Jd. Esplanada I",
      "Jd. Esplanada II",
      "Jd. Bela Vista",
      "Jd. Regina",
      "Jd. Kyoto",
      "Jd. Europa",
      "Jd. América",
      "Vila Suíça",
      "Jd. Primavera",
      "Jd. Adriana",
      "Jd. Oliveira Camargo",
    ],
  },
  {
    nome: "🌳 Região Norte, Itaici & Arredores",
    bairros: [
      "Itaici",
      "Vale do Sol",
      "Colinas de Indaiatuba",
      "Altos da Bela Vista",
      "Vila Maria Helena",
      "Jd. Umuarama",
      "Jd. Monte Verde",
      "Jd. Montreal",
      "Jd. Park Real",
      "Jd. Portal do Sol",
      "Jd. Veredas",
      "Jd. São Francisco",
      "Jd. Marina",
      "Parque das Nações",
      "Helvétia",
      "Chácara Areal",
      "Recreio Campestre Joia",
      "Distrito Industrial",
    ],
  },
  {
    nome: "🌾 Bairros Rurais & Outros",
    bairros: [
      "Bairro Caldeira",
      "Bairro Funchal",
      "Bairro Morro Alto",
      "Bairro Pimenta",
      "Bairro Tombadouro",
      "Bairro Videira",
      "Outro Bairro",
    ],
  },
] as const;

export const BAIRROS_INDAIATUBA = [
  "Todos os Bairros",
  // 1. Jd. Regente e vizinhos imediatos
  "Jd. Regente",
  "Parque Real",
  "Jd. Morada do Sol",
  "Jd. Hubert",
  "Jd. Alice",
  "Jd. Tancredo Neves",
  "Jd. Lauro Bueno",
  "Jd. Rêmulo Zoppi",
  "Jd. Eldorado",
  "Jd. Califórnia",
  "Jd. São Conrado",
  "Jd. Nely",
  "Jd. Belo Horizonte",
  "Jd. Bom Princípio",
  "Jd. Brasil",
  "Jd. Tropical",
  "Jd. Santa Cruz",
  "Jd. Colonial",
  "Vila Brigadeiro Faria Lima (Cecap)",
  // 2. Região Central & Intermediária
  "Cidade Nova I",
  "Cidade Nova II",
  "Vila Avaí",
  "Jd. Pau Preto",
  "Centro",
  "Parque Ecológico",
  "Jd. Esplanada I",
  "Jd. Esplanada II",
  "Jd. Bela Vista",
  "Jd. Regina",
  "Jd. Kyoto",
  "Jd. Europa",
  "Jd. América",
  "Vila Suíça",
  "Jd. Primavera",
  "Jd. Adriana",
  "Jd. Oliveira Camargo",
  // 3. Região Norte, Itaici & Arredores
  "Itaici",
  "Vale do Sol",
  "Colinas de Indaiatuba",
  "Altos da Bela Vista",
  "Vila Maria Helena",
  "Jd. Umuarama",
  "Jd. Monte Verde",
  "Jd. Montreal",
  "Jd. Park Real",
  "Jd. Portal do Sol",
  "Jd. Veredas",
  "Jd. São Francisco",
  "Jd. Marina",
  "Parque das Nações",
  "Helvétia",
  "Chácara Areal",
  "Recreio Campestre Joia",
  "Distrito Industrial",
  // 4. Bairros Rurais & Outros
  "Bairro Caldeira",
  "Bairro Funchal",
  "Bairro Morro Alto",
  "Bairro Pimenta",
  "Bairro Tombadouro",
  "Bairro Videira",
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
