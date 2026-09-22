import { createClient } from "@supabase/supabase-js";
import { Servico, Avaliacao } from "@/types";
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
    cidade_bairro: "Regente Feijó - Centro",
    descricao: "Instalação de padrão, fiação completa, quadro de disjuntores e chuveiros. Atende chamados de emergência.",
    quem_indicou: "Ricardo do Grupo",
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
    nota_media: 5.0,
    total_avaliacoes: 24,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "3",
    nome: "Mecânica do Beto - Auto & Moto",
    categoria: "Mecânico",
    telefone: "(18) 99655-1122",
    telefone_numeros: "18996551122",
    cidade_bairro: "Regente Feijó - Vila Nova",
    descricao: "Injeção eletrônica, suspensão, freios e troca de óleo rápida. Preço justo e honestidade.",
    quem_indicou: "Marcos Mecânico",
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
    cidade_bairro: "Indaiatuba - Vila Avai",
    descricao: "Consultas, vacinas em domicílio, cirurgias e plantão de emergência para cães e gatos.",
    quem_indicou: "Juliana Santos",
    nota_media: 4.90,
    total_avaliacoes: 21,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "5",
    nome: "Marcos Encanador & Caça Vazamentos",
    categoria: "Encanador",
    telefone: "(18) 99877-6655",
    telefone_numeros: "18998776655",
    cidade_bairro: "Regente Feijó - Jd das Flores",
    descricao: "Localização de vazamentos ocultos sem quebrar parede à toa, troca de torneiras e caixas d água.",
    quem_indicou: "Seu Zé do Mercado",
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
    descricao: "Melhor pizza com massa de fermentação natural, forno a lenha e entrega super rápida.",
    quem_indicou: "Família Ribeiro",
    nota_media: 4.75,
    total_avaliacoes: 30,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: "7",
    nome: "Silvia Manicure & Designer de Unhas",
    categoria: "Beleza / Estética",
    telefone: "(18) 99188-7744",
    telefone_numeros: "18991887744",
    cidade_bairro: "Regente Feijó - Centro",
    descricao: "Alongamento em fibra de vidro, esmaltação em gel e spa dos pés. Atendimento com hora marcada.",
    quem_indicou: "Camila Estética",
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

// Fallback de armazenamento local / em memória
let localServicos: Servico[] = [...SEED_SERVICOS];
let localAvaliacoes: Avaliacao[] = [...SEED_AVALIACOES];

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

      if (!error && data && data.length > 0) {
        return data as Servico[];
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
        .eq("telefone_numeros", digitos)
        .maybeSingle();

      if (!error && data) {
        return data as Servico;
      }
    } catch (err) {
      console.warn("Erro na verificação de telefone no Supabase:", err);
    }
  }

  const encontrado = localServicos.find(
    (s) => s.telefone_numeros === digitos || limparTelefone(s.telefone) === digitos
  );

  return encontrado || null;
}

/**
 * Cadastra um novo serviço, validando duplicidade
 */
export async function cadastrarServico(dados: Omit<Servico, "id" | "created_at" | "nota_media" | "total_avaliacoes">): Promise<{ sucesso: boolean; servico?: Servico; erro?: string }> {
  const digitos = limparTelefone(dados.telefone);

  // 1. Checa se o telefone já existe
  const existente = await verificarTelefoneExistente(digitos);
  if (existente) {
    return {
      sucesso: false,
      erro: `Já existe um profissional cadastrado com este número: "${existente.nome}" (${existente.categoria}). Você pode visitá-lo e deixar uma nova avaliação para reforçar a recomendação!`,
      servico: existente,
    };
  }

  const novoServico: Servico = {
    ...dados,
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    telefone_numeros: digitos,
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
          cidade_bairro: novoServico.cidade_bairro,
          descricao: novoServico.descricao,
          quem_indicou: novoServico.quem_indicou,
          instagram: novoServico.instagram,
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
      if (!error) {
        return { sucesso: true };
      }
    } catch (err) {
      console.warn("Erro ao excluir no Supabase:", err);
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
      if (!error) {
        return { sucesso: true };
      }
    } catch (err) {
      console.warn("Erro ao excluir avaliação no Supabase:", err);
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

