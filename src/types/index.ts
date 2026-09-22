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
  "Jd. Santa Rita",
  "Park Gran Reserve",
  "Vila Avaí",
  "Cidade Nova II",
  "Cidade Nova I",
  "Centro",
  "Itaici",
  "Jd. Morada do Sol",
] as const;

export const GRUPOS_BAIRROS = [
  {
    nome: "📍 Jd. Regente & Vizinhos Imediatos (até 2 km)",
    bairros: [
      "Jd. Regente",
      "Jd. Santa Rita",
      "Park Gran Reserve",
      "Vila Avaí",
      "Vila Maria",
      "Vila Maria Helena",
      "Cidade Nova II",
      "Cidade Nova I",
      "Jd. Dom Bosco",
    ],
  },
  {
    nome: "🏙️ Região Próxima & Central (2 a 4 km)",
    bairros: [
      "Helvétia",
      "Centro",
      "Jd. Pau Preto",
      "Jd. Primavera",
      "Vale do Sol",
      "Jd. Bela Vista",
      "Chácara Areal",
      "Distrito Industrial",
    ],
  },
  {
    nome: "🌳 Região Intermediária & Leste (4 a 6 km)",
    bairros: [
      "Jd. Esplanada I",
      "Jd. Esplanada II",
      "Itaici",
      "Parque Ecológico",
      "Jd. Regina",
      "Jd. Kyoto",
      "Jd. Europa",
      "Jd. América",
      "Vila Suíça",
      "Vila Brigadeiro Faria Lima (Cecap)",
      "Jd. Califórnia",
      "Jd. Adriana",
      "Jd. Oliveira Camargo",
      "Colinas de Indaiatuba",
      "Altos da Bela Vista",
      "Jd. Marina",
      "Parque das Nações",
    ],
  },
  {
    nome: "🏠 Região Sul / Morada do Sol (6 a 9 km)",
    bairros: [
      "Jd. Rêmulo Zoppi",
      "Jd. Hubert",
      "Jd. Morada do Sol",
      "Jd. Alice",
      "Jd. Tancredo Neves",
      "Jd. Lauro Bueno",
      "Jd. São Conrado",
      "Jd. Eldorado",
      "Jd. Colonial",
      "Jd. Bom Princípio",
      "Jd. Nely",
      "Jd. Belo Horizonte",
      "Jd. Brasil",
      "Jd. Tropical",
      "Jd. Santa Cruz",
      "Parque Real",
      "Jd. Montreal",
      "Jd. Park Real",
      "Jd. Portal do Sol",
      "Jd. Veredas",
      "Jd. São Francisco",
      "Jd. Umuarama",
      "Jd. Monte Verde",
      "Recreio Campestre Joia",
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
  // 1. Jd. Regente e vizinhos imediatos (Zona Norte / Av. Conceição / Santos Dumont)
  "Jd. Regente",
  "Jd. Santa Rita",
  "Park Gran Reserve",
  "Vila Avaí",
  "Vila Maria",
  "Vila Maria Helena",
  "Cidade Nova II",
  "Cidade Nova I",
  "Jd. Dom Bosco",
  // 2. Região Próxima & Central (2 a 4 km)
  "Helvétia",
  "Centro",
  "Jd. Pau Preto",
  "Jd. Primavera",
  "Vale do Sol",
  "Jd. Bela Vista",
  "Chácara Areal",
  "Distrito Industrial",
  // 3. Região Intermediária & Leste (4 a 6 km)
  "Jd. Esplanada I",
  "Jd. Esplanada II",
  "Itaici",
  "Parque Ecológico",
  "Jd. Regina",
  "Jd. Kyoto",
  "Jd. Europa",
  "Jd. América",
  "Vila Suíça",
  "Vila Brigadeiro Faria Lima (Cecap)",
  "Jd. Califórnia",
  "Jd. Adriana",
  "Jd. Oliveira Camargo",
  "Colinas de Indaiatuba",
  "Altos da Bela Vista",
  "Jd. Marina",
  "Parque das Nações",
  // 4. Região Sul / Morada do Sol (6 a 9 km)
  "Jd. Rêmulo Zoppi",
  "Jd. Hubert",
  "Jd. Morada do Sol",
  "Jd. Alice",
  "Jd. Tancredo Neves",
  "Jd. Lauro Bueno",
  "Jd. São Conrado",
  "Jd. Eldorado",
  "Jd. Colonial",
  "Jd. Bom Princípio",
  "Jd. Nely",
  "Jd. Belo Horizonte",
  "Jd. Brasil",
  "Jd. Tropical",
  "Jd. Santa Cruz",
  "Parque Real",
  "Jd. Montreal",
  "Jd. Park Real",
  "Jd. Portal do Sol",
  "Jd. Veredas",
  "Jd. São Francisco",
  "Jd. Umuarama",
  "Jd. Monte Verde",
  "Recreio Campestre Joia",
  // 5. Bairros Rurais & Outros
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
