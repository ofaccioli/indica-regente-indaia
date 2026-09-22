import { createClient } from "@supabase/supabase-js";
import { Servico, Avaliacao, PedidoMural, RespostaMural } from "@/types";
import { limparTelefone } from "./utils";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith("https://") &&
  !supabaseUrl.includes("seu-projeto")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// Base inicial de dados pré-carregados para funcionamento imediato
const SEED_SERVICOS: Servico[] = [
  {
    id: "1",
    nome: "Carlos Roberto Eletricista",
    categoria: "Eletricista",
    telefone: "(18) 99712-4040",
    telefone_numeros: "18997124040",
    cidade_bairro: "Indaiatuba - Jd. Regente",
    descricao: "Instalação de padrão, fiação completa, quadro de disjuntores e chuveiros. Atende chamados de emergência no fim de semana.",
    quem_indicou: "Ricardo do Grupo",
    instagram: "carlos.eletrica",
    atende_fim_de_semana: true,
    eh_morador: true,
    tipo_atendimento: "domicilio",
    oferta_vizinho: "10% de desconto em revisões elétricas para moradores do Jd. Regente e Valença",
    nota_media: 4.95,
    total_avaliacoes: 18,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: "2",
    nome: "Dona Luíza Diarista e Passadeira",
    categoria: "Diarista / Limpeza",
    telefone: "(19) 98844-3322",
    telefone_numeros: "19988443322",
    cidade_bairro: "Indaiatuba - Morada do Sol",
    descricao: "Faxina pesada, limpeza pós-obra e cuidado impecável com roupas. Muito pontual e de confiança.",
    quem_indicou: "Ana Paula Condomínio",
    instagram: "luiza.diarista",
    atende_fim_de_semana: false,
    eh_morador: false,
    tipo_atendimento: "domicilio",
    nota_media: 5.0,
    total_avaliacoes: 24,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "3",
    nome: "Mecânica do Beto - Auto & Moto",
    categoria: "Mecânico",
    telefone: "(19) 99655-1122",
    telefone_numeros: "19996551122",
    telefone_secundario: "(19) 3875-1010",
    telefone_secundario_numeros: "1938751010",
    cidade_bairro: "Indaiatuba - Itaici",
    descricao: "Injeção eletrônica, suspensão, freios e troca de óleo rápida. Preço justo e honestidade.",
    quem_indicou: "Marcos Mecânico",
    instagram: "mecanicadobeto",
    atende_fim_de_semana: false,
    eh_morador: false,
    tipo_atendimento: "local",
    nota_media: 4.80,
    total_avaliacoes: 15,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: "4",
    nome: "Dr. Fernando Veterinário 24h",
    categoria: "Pet / Veterinário",
    telefone: "(19) 99123-9988",
    telefone_numeros: "19991239988",
    telefone_secundario: "(19) 3894-2200",
    telefone_secundario_numeros: "1938942200",
    cidade_bairro: "Indaiatuba - Vila Avaí",
    descricao: "Consultas, vacinas em domicílio, cirurgias e plantão de emergência 24h para cães e gatos.",
    quem_indicou: "Juliana Santos",
    instagram: "drfernandovet24h",
    atende_fim_de_semana: true,
    eh_morador: false,
    tipo_atendimento: "ambos",
    nota_media: 4.90,
    total_avaliacoes: 21,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "5",
    nome: "Marcos Encanador & Caça Vazamentos",
    categoria: "Encanador",
    telefone: "(19) 99877-6655",
    telefone_numeros: "19998776655",
    cidade_bairro: "Indaiatuba - Jd. Regente",
    descricao: "Localização de vazamentos ocultos sem quebrar parede à toa, troca de torneiras e caixas d água. Atende emergências de fim de semana.",
    quem_indicou: "Seu Zé do Mercado",
    instagram: "marcosencanador_indaiatuba",
    atende_fim_de_semana: true,
    eh_morador: true,
    tipo_atendimento: "domicilio",
    nota_media: 4.85,
    total_avaliacoes: 12,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
  },
  {
    id: "6",
    nome: "Pizzaria & Forno Artesanal Sabor da Vila",
    categoria: "Restaurante / Lanche",
    telefone: "(19) 99766-5544",
    telefone_numeros: "19997665544",
    cidade_bairro: "Indaiatuba - Centro",
    descricao: "Melhor pizza com massa de fermentação natural, forno a lenha e entrega super rápida no Jd. Regente.",
    quem_indicou: "Família Ribeiro",
    instagram: "pizzariasabordavila",
    atende_fim_de_semana: true,
    eh_morador: false,
    tipo_atendimento: "local",
    oferta_vizinho: "Entrega Grátis para Jd. Regente, Jd. Valença e Park Gran Reserve às terças e quintas!",
    nota_media: 4.75,
    total_avaliacoes: 30,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: "7",
    nome: "Silvia Manicure & Designer de Unhas",
    categoria: "Beleza / Estética",
    telefone: "(19) 99188-7744",
    telefone_numeros: "19991887744",
    cidade_bairro: "Indaiatuba - Jd. Regente",
    descricao: "Alongamento em fibra de vidro, esmaltação em gel e spa dos pés. Atendimento no Jd. Regente.",
    quem_indicou: "Camila Estética",
    instagram: "silviaunhas_indaiatuba",
    atende_fim_de_semana: true,
    eh_morador: true,
    tipo_atendimento: "ambos",
    nota_media: 5.0,
    total_avaliacoes: 9,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
];

const SEED_AVALIACOES: Avaliacao[] = [
  {
    id: "av-1",
    servico_id: "1",
    nome_avaliador: "Lucas Silva",
    nota: 5,
    comentario: "Fez a troca de todo o padrão de energia da minha casa. Muito rápido e preço justo!",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "av-2",
    servico_id: "1",
    nome_avaliador: "Mariana Costa",
    nota: 5,
    comentario: "Resolveu um curto-circuito no chuveiro num domingo à noite. Salvou a gente!",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: "av-3",
    servico_id: "2",
    nome_avaliador: "Fernanda G.",
    nota: 5,
    comentario: "A Dona Luíza é maravilhosa! Confiança total, casa ficou impecável e cheirosa.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
];

const SEED_PEDIDOS_MURAL: PedidoMural[] = [
  {
    id: "ped-1",
    titulo: "Procuro pintor para sala e fachada",
    descricao: "Preciso de indicação de pintor caprichoso para pintar a sala e a frente de casa aqui no Jd. Regente. Preferência que tenha boas recomendações!",
    categoria: "Pintor / Gesso",
    morador_nome: "Patrícia",
    bairro: "Jd. Regente",
    whatsapp_contato: "19992334455",
    urgente: false,
    tipo_post: "pedido",
    status: "aberto",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    respostas: [
      {
        id: "resp-1",
        pedido_id: "ped-1",
        autor_nome: "Marcos (Vizinho)",
        mensagem: "Oi Patrícia! O Carlos Roberto aqui do Regente fez serviços de reforma e pintura na minha casa, recomendo muito!",
        servico_id_indicado: "1",
        servico_nome_indicado: "Carlos Roberto Eletricista",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      },
    ],
  },
  {
    id: "pet-1",
    titulo: "🚨 Procura-se: Poodle branco (Thor) escapou no Jd. Valença",
    descricao: "Gente, nosso cachorrinho Thor (Poodle branco, porte pequeno, com coleira azul) escapou pelo portão hoje por volta das 10h perto da Rua José Teixeira de Camargo. Quem ver por favor chame aqui no WhatsApp!",
    categoria: "Pet / Veterinário",
    morador_nome: "Camila",
    bairro: "Jd. Valença",
    whatsapp_contato: "19993445566",
    urgente: true,
    tipo_post: "pet_perdido",
    status: "aberto",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    respostas: [
      {
        id: "resp-pet-1",
        pedido_id: "pet-1",
        autor_nome: "Rogério",
        mensagem: "Camila, vi um cachorrinho parecido perto da rotatória do Park Gran Reserve há uns 30 minutos!",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
      },
    ],
  },
  {
    id: "des-1",
    titulo: "Bicicleta infantil aro 16 (vermelha) - Perfeito estado",
    descricao: "Bicicleta Caloi infantil que meu filho não usa mais. Revisada com rodinhas de apoio. Retirada a pé aqui no Jd. Regente.",
    categoria: "Outros",
    morador_nome: "Eduardo",
    bairro: "Jd. Regente",
    whatsapp_contato: "19997881122",
    urgente: false,
    tipo_post: "desapego",
    valor_desapego: "R$ 150",
    status: "aberto",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    respostas: [],
  },
  {
    id: "des-2",
    titulo: "Mudas de Jabuticabeira e Ervas para Horta",
    descricao: "Temos mudinhas excedentes de jabuticaba e manjericão fresco no vasinho. Doação para quem puder retirar no condomínio!",
    categoria: "Outros",
    morador_nome: "Dona Neusa",
    bairro: "Jd. Itamaracá",
    whatsapp_contato: "19996554433",
    urgente: false,
    tipo_post: "desapego",
    valor_desapego: "🎁 Doação Gratuita",
    status: "aberto",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    respostas: [],
  },
];

// Fallback de armazenamento local / em memória
let localServicos: Servico[] = [...SEED_SERVICOS];
let localAvaliacoes: Avaliacao[] = [...SEED_AVALIACOES];
let localPedidosMural: PedidoMural[] = [...SEED_PEDIDOS_MURAL];

/**
 * Busca todos os serviços (do Supabase ou do cache local)
 */
export async function listarServicos(): Promise<Servico[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("servicos")
        .select("*")
        .order("nota_media", { ascending: false });

      if (!error && data) {
        return data as Servico[];
      }
      if (error) {
        console.error("Erro ao buscar serviços no Supabase:", error);
      }
    } catch (err) {
      console.warn("Supabase indisponível, usando dados locais:", err);
    }
  }

  // Tenta carregar do localStorage se estiver no navegador
  if (typeof window !== "undefined") {
    try {
      const salvo = localStorage.getItem("indica_servicos");
      if (salvo) {
        localServicos = JSON.parse(salvo);
      }
    } catch {
      // continua com os seeds
    }
  }

  return [...localServicos];
}

/**
 * Busca um serviço específico por ID com suas avaliações
 */
export async function buscarServicoPorId(id: string): Promise<{ servico: Servico | null; avaliacoes: Avaliacao[] }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: servicoData } = await supabase
        .from("servicos")
        .select("*")
        .eq("id", id)
        .single();

      const { data: avaliacoesData } = await supabase
        .from("avaliacoes")
        .select("*")
        .eq("servico_id", id)
        .order("created_at", { ascending: false });

      if (servicoData) {
        return {
          servico: servicoData as Servico,
          avaliacoes: (avaliacoesData || []) as Avaliacao[],
        };
      }
    } catch (err) {
      console.warn("Erro ao buscar no Supabase:", err);
    }
  }

  const servico = localServicos.find((s) => s.id === id) || null;
  const avaliacoes = localAvaliacoes.filter((a) => a.servico_id === id);

  return { servico, avaliacoes };
}

/**
 * Busca todas as avaliações de um serviço específico
 */
export async function listarAvaliacoesPorServico(servicoId: string): Promise<Avaliacao[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("avaliacoes")
        .select("*")
        .eq("servico_id", servicoId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data as Avaliacao[];
      }
    } catch (err) {
      console.warn("Erro ao buscar avaliações no Supabase:", err);
    }
  }

  return localAvaliacoes.filter((a) => a.servico_id === servicoId);
}

/**
 * Verifica se já existe um serviço cadastrado com este telefone
 */
export async function verificarTelefoneExistente(telefone: string): Promise<Servico | null> {
  const digitos = limparTelefone(telefone);
  if (!digitos) return null;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("servicos")
        .select("*")
        .or(`telefone_numeros.eq.${digitos},telefone_secundario_numeros.eq.${digitos}`)
        .maybeSingle();

      if (!error && data) {
        return data as Servico;
      }
    } catch (err) {
      console.warn("Erro na verificação de telefone no Supabase:", err);
    }
  }

  const encontrado = localServicos.find(
    (s) =>
      s.telefone_numeros === digitos ||
      limparTelefone(s.telefone) === digitos ||
      s.telefone_secundario_numeros === digitos ||
      (s.telefone_secundario && limparTelefone(s.telefone_secundario) === digitos)
  );

  return encontrado || null;
}

/**
 * Cadastra um novo serviço, validando duplicidade
 */
export async function cadastrarServico(dados: Omit<Servico, "id" | "created_at" | "nota_media" | "total_avaliacoes">): Promise<{ sucesso: boolean; servico?: Servico; erro?: string }> {
  const digitos = limparTelefone(dados.telefone);
  const digitosSecundario = dados.telefone_secundario ? limparTelefone(dados.telefone_secundario) : undefined;

  // 1. Checa se o telefone principal já existe
  const existente = await verificarTelefoneExistente(digitos);
  if (existente) {
    return {
      sucesso: false,
      erro: `Já existe um profissional cadastrado com este número: "${existente.nome}" (${existente.categoria}). Você pode visitá-lo e deixar uma nova avaliação para reforçar a recomendação!`,
      servico: existente,
    };
  }

  // 2. Se informou telefone secundário, checa se já existe
  if (digitosSecundario) {
    const existenteSec = await verificarTelefoneExistente(digitosSecundario);
    if (existenteSec) {
      return {
        sucesso: false,
        erro: `O telefone secundário já está cadastrado no perfil de: "${existenteSec.nome}" (${existenteSec.categoria}).`,
        servico: existenteSec,
      };
    }
  }

  const novoServico: Servico = {
    ...dados,
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    telefone_numeros: digitos,
    telefone_secundario_numeros: digitosSecundario,
    nota_media: 5.0,
    total_avaliacoes: 1,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("servicos")
        .insert([{
          nome: novoServico.nome,
          categoria: novoServico.categoria,
          telefone: novoServico.telefone,
          telefone_numeros: novoServico.telefone_numeros,
          telefone_secundario: novoServico.telefone_secundario || null,
          telefone_secundario_numeros: novoServico.telefone_secundario_numeros || null,
          cidade_bairro: novoServico.cidade_bairro,
          descricao: novoServico.descricao,
          quem_indicou: novoServico.quem_indicou,
          instagram: novoServico.instagram,
          atende_fim_de_semana: Boolean(novoServico.atende_fim_de_semana),
          eh_morador: Boolean(novoServico.eh_morador),
          tipo_atendimento: novoServico.tipo_atendimento || "ambos",
          oferta_vizinho: novoServico.oferta_vizinho || null,
          horario_funcionamento: novoServico.horario_funcionamento || null,
          foto_url: novoServico.foto_url || null,
          fotos_trabalhos: novoServico.fotos_trabalhos || null,
          nota_media: 5.0,
          total_avaliacoes: 1,
        }])
        .select()
        .single();

      if (!error && data) {
        return { sucesso: true, servico: data as Servico };
      }
    } catch (err) {
      console.warn("Erro ao salvar no Supabase, salvando localmente:", err);
    }
  }

  // Fallback local
  localServicos = [novoServico, ...localServicos];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("indica_servicos", JSON.stringify(localServicos));
    } catch {}
  }

  return { sucesso: true, servico: novoServico };
}

/**
 * Adiciona uma avaliação / recomendação para um profissional
 */
export async function registrarAvaliacao(
  servicoId: string,
  nomeAvaliador: string,
  nota: number,
  comentario?: string
): Promise<{ sucesso: boolean; erro?: string }> {
  const novaAvaliacao: Avaliacao = {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    servico_id: servicoId,
    nome_avaliador: nomeAvaliador || "Membro da Comunidade",
    nota: Math.min(5, Math.max(1, nota)),
    comentario: comentario?.trim(),
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from("avaliacoes")
        .insert([{
          servico_id: novaAvaliacao.servico_id,
          nome_avaliador: novaAvaliacao.nome_avaliador,
          nota: novaAvaliacao.nota,
          comentario: novaAvaliacao.comentario,
        }]);

      if (!error) {
        return { sucesso: true };
      }
    } catch (err) {
      console.warn("Erro ao registrar avaliação no Supabase:", err);
    }
  }

  // Fallback local
  localAvaliacoes = [novaAvaliacao, ...localAvaliacoes];

  const servicoIndex = localServicos.findIndex((s) => s.id === servicoId);
  if (servicoIndex !== -1) {
    const s = localServicos[servicoIndex];
    const total = (s.total_avaliacoes || 0) + 1;
    const mediaAtual = s.nota_media || 5.0;
    const novaMedia = Number(((mediaAtual * (total - 1) + nota) / total).toFixed(2));

    localServicos[servicoIndex] = {
      ...s,
      nota_media: novaMedia,
      total_avaliacoes: total,
    };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("indica_servicos", JSON.stringify(localServicos));
        localStorage.setItem("indica_avaliacoes", JSON.stringify(localAvaliacoes));
      } catch {}
    }
  }

  return { sucesso: true };
}

/**
 * Atualiza dados de um serviço existente (Ação do Admin)
 */
export async function atualizarServico(
  id: string,
  dados: Partial<Servico>
): Promise<{ sucesso: boolean; erro?: string; servico?: Servico }> {
  const dadosParaAtualizar: Partial<Servico> = { ...dados };
  if (dados.telefone) {
    dadosParaAtualizar.telefone_numeros = limparTelefone(dados.telefone);
  }
  if (dados.telefone_secundario !== undefined) {
    dadosParaAtualizar.telefone_secundario_numeros = dados.telefone_secundario
      ? limparTelefone(dados.telefone_secundario)
      : undefined;
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("servicos")
        .update(dadosParaAtualizar)
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        return { sucesso: true, servico: data as Servico };
      }
    } catch (err) {
      console.warn("Erro ao atualizar no Supabase:", err);
    }
  }

  // Fallback local
  const index = localServicos.findIndex((s) => s.id === id);
  if (index !== -1) {
    localServicos[index] = { ...localServicos[index], ...dadosParaAtualizar };
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("indica_servicos", JSON.stringify(localServicos));
      } catch {}
    }
    return { sucesso: true, servico: localServicos[index] };
  }

  return { sucesso: false, erro: "Serviço não encontrado" };
}

/**
 * Exclui um serviço e suas avaliações (Ação do Admin)
 */
export async function excluirServico(id: string): Promise<{ sucesso: boolean; erro?: string }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("servicos").delete().eq("id", id);
      if (error) {
        console.error("Erro ao excluir serviço no Supabase:", error);
        return { sucesso: false, erro: error.message };
      }
      // Limpa também do cache local se existir
      localServicos = localServicos.filter((s) => s.id !== id);
      localAvaliacoes = localAvaliacoes.filter((a) => a.servico_id !== id);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("indica_servicos", JSON.stringify(localServicos));
          localStorage.setItem("indica_avaliacoes", JSON.stringify(localAvaliacoes));
        } catch {}
      }
      return { sucesso: true };
    } catch (err: any) {
      console.error("Erro ao excluir no Supabase:", err);
      return { sucesso: false, erro: err?.message || "Falha ao excluir serviço no banco de dados" };
    }
  }

  // Fallback local
  localServicos = localServicos.filter((s) => s.id !== id);
  localAvaliacoes = localAvaliacoes.filter((a) => a.servico_id !== id);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("indica_servicos", JSON.stringify(localServicos));
      localStorage.setItem("indica_avaliacoes", JSON.stringify(localAvaliacoes));
    } catch {}
  }

  return { sucesso: true };
}

/**
 * Exclui uma avaliação e recalcula a nota média (Ação do Admin)
 */
export async function excluirAvaliacao(
  avaliacaoId: string,
  servicoId: string
): Promise<{ sucesso: boolean; erro?: string }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("avaliacoes").delete().eq("id", avaliacaoId);
      if (error) {
        console.error("Erro ao excluir avaliação no Supabase:", error);
        return { sucesso: false, erro: error.message };
      }
    } catch (err: any) {
      console.error("Erro ao excluir avaliação no Supabase:", err);
      return { sucesso: false, erro: err?.message || "Falha ao excluir avaliação" };
    }
  }

  // Fallback local
  localAvaliacoes = localAvaliacoes.filter((a) => a.id !== avaliacaoId);

  const avaliacoesRestantes = localAvaliacoes.filter((a) => a.servico_id === servicoId);
  const total = avaliacoesRestantes.length;
  const servicoIndex = localServicos.findIndex((s) => s.id === servicoId);

  if (servicoIndex !== -1) {
    const novaMedia =
      total === 0
        ? 5.0
        : Number((avaliacoesRestantes.reduce((acc, cur) => acc + cur.nota, 0) / total).toFixed(2));

    localServicos[servicoIndex] = {
      ...localServicos[servicoIndex],
      nota_media: novaMedia,
      total_avaliacoes: Math.max(1, total),
    };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("indica_servicos", JSON.stringify(localServicos));
        localStorage.setItem("indica_avaliacoes", JSON.stringify(localAvaliacoes));
      } catch {}
    }
  }

  return { sucesso: true };
}

/**
 * Lista todas as avaliações para a área de moderação
 */
export async function listarTodasAvaliacoes(): Promise<Avaliacao[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("avaliacoes")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data as Avaliacao[];
      }
    } catch (err) {
      console.warn("Erro ao buscar avaliações no Supabase:", err);
    }
  }

  return [...localAvaliacoes];
}

/**
 * Busca todos os pedidos do Mural Comunitário "Alguém Indica?"
 */
export async function listarPedidosMural(): Promise<PedidoMural[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("pedidos_mural")
        .select("*, respostas:respostas_mural(*)")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data as PedidoMural[];
      }
      if (error) {
        console.error("Erro ao listar mural no Supabase:", error);
      }
    } catch (err) {
      console.warn("Supabase indisponível para mural, usando dados locais:", err);
    }
  }

  // Tenta carregar do localStorage
  if (typeof window !== "undefined") {
    try {
      const salvo = localStorage.getItem("indica_pedidos_mural");
      if (salvo) {
        localPedidosMural = JSON.parse(salvo);
      }
    } catch {}
  }

  return [...localPedidosMural];
}

/**
 * Cria um novo pedido de recomendação no Mural
 */
export async function criarPedidoMural(
  dados: Omit<PedidoMural, "id" | "created_at" | "respostas" | "status"> & { status?: "aberto" | "resolvido" }
): Promise<{ sucesso: boolean; pedido?: PedidoMural; erro?: string }> {
  const novoPedido: PedidoMural = {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `ped-${Date.now()}`,
    titulo: dados.titulo.trim(),
    descricao: dados.descricao.trim(),
    categoria: dados.categoria,
    morador_nome: dados.morador_nome.trim() || "Vizinho(a)",
    bairro: dados.bairro || "Jd. Regente",
    whatsapp_contato: dados.whatsapp_contato ? limparTelefone(dados.whatsapp_contato) : undefined,
    urgente: Boolean(dados.urgente),
    status: dados.status || "aberto",
    tipo_post: dados.tipo_post || "pedido",
    valor_desapego: dados.valor_desapego || undefined,
    foto_url: dados.foto_url || undefined,
    respostas: [],
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("pedidos_mural")
        .insert([{
          titulo: novoPedido.titulo,
          descricao: novoPedido.descricao,
          categoria: novoPedido.categoria,
          morador_nome: novoPedido.morador_nome,
          bairro: novoPedido.bairro,
          whatsapp_contato: novoPedido.whatsapp_contato,
          urgente: novoPedido.urgente,
          status: novoPedido.status,
          tipo_post: novoPedido.tipo_post,
          valor_desapego: novoPedido.valor_desapego || null,
          foto_url: novoPedido.foto_url || null,
        }])
        .select()
        .single();

      if (!error && data) {
        return { sucesso: true, pedido: { ...(data as PedidoMural), respostas: [] } };
      }
    } catch (err) {
      console.warn("Erro ao criar pedido no Supabase:", err);
    }
  }

  localPedidosMural = [novoPedido, ...localPedidosMural];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("indica_pedidos_mural", JSON.stringify(localPedidosMural));
    } catch {}
  }

  return { sucesso: true, pedido: novoPedido };
}

/**
 * Adiciona uma resposta / indicação de vizinho para um pedido no Mural
 */
export async function responderPedidoMural(
  dados: Omit<RespostaMural, "id" | "created_at">
): Promise<{ sucesso: boolean; resposta?: RespostaMural; erro?: string }> {
  const novaResposta: RespostaMural = {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `resp-${Date.now()}`,
    pedido_id: dados.pedido_id,
    autor_nome: dados.autor_nome.trim() || "Vizinho(a)",
    mensagem: dados.mensagem.trim(),
    servico_id_indicado: dados.servico_id_indicado,
    servico_nome_indicado: dados.servico_nome_indicado,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("respostas_mural")
        .insert([novaResposta])
        .select()
        .single();

      if (!error && data) {
        return { sucesso: true, resposta: data as RespostaMural };
      }
    } catch (err) {
      console.warn("Erro ao responder no Supabase:", err);
    }
  }

  // Atualiza local
  const index = localPedidosMural.findIndex((p) => p.id === dados.pedido_id);
  if (index !== -1) {
    const respostasAtuais = localPedidosMural[index].respostas || [];
    localPedidosMural[index] = {
      ...localPedidosMural[index],
      respostas: [...respostasAtuais, novaResposta],
    };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("indica_pedidos_mural", JSON.stringify(localPedidosMural));
      } catch {}
    }

    return { sucesso: true, resposta: novaResposta };
  }

  return { sucesso: false, erro: "Pedido não encontrado" };
}

/**
 * Marca um pedido como resolvido
 */
export async function resolverPedidoMural(pedidoId: string): Promise<{ sucesso: boolean }> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from("pedidos_mural")
        .update({ status: "resolvido" })
        .eq("id", pedidoId);
    } catch {}
  }

  const index = localPedidosMural.findIndex((p) => p.id === pedidoId);
  if (index !== -1) {
    localPedidosMural[index] = {
      ...localPedidosMural[index],
      status: "resolvido",
    };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("indica_pedidos_mural", JSON.stringify(localPedidosMural));
      } catch {}
    }
  }

  return { sucesso: true };
}

/**
 * Exclui um pedido do Mural (Ação de Moderação)
 */
export async function excluirPedidoMural(pedidoId: string): Promise<{ sucesso: boolean; erro?: string }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("pedidos_mural").delete().eq("id", pedidoId);
      if (error) {
        console.error("Erro ao excluir pedido no Supabase:", error);
        return { sucesso: false, erro: error.message };
      }
    } catch (err: any) {
      return { sucesso: false, erro: err?.message || "Falha ao excluir pedido" };
    }
  }

  localPedidosMural = localPedidosMural.filter((p) => p.id !== pedidoId);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("indica_pedidos_mural", JSON.stringify(localPedidosMural));
    } catch {}
  }

  return { sucesso: true };
}


