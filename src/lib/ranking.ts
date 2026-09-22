import { Servico, TipoOrdenacao } from "@/types";

const PESO_MINIMO_AVALIACOES = 3; // 'm' na média bayesiana
const NOTA_MEDIA_GLOBAL = 4.2;      // 'C' na média bayesiana

/**
 * Calcula a pontuação inteligente ponderada (Média Bayesiana)
 * Evita que 1 voto com nota 5 passe na frente de 30 votos com nota 4.9.
 */
export function calcularScoreInteligente(notaMedia: number, totalAvaliacoes: number): number {
  const v = Math.max(0, totalAvaliacoes);
  const R = Math.min(5, Math.max(1, notaMedia));
  const m = PESO_MINIMO_AVALIACOES;
  const C = NOTA_MEDIA_GLOBAL;

  const score = (v * R + m * C) / (v + m);
  return Number(score.toFixed(3));
}

/**
 * Determina se o serviço tem direito ao selo de "Top Recomendado"
 */
export function isTopRecomendado(notaMedia: number, totalAvaliacoes: number): boolean {
  return notaMedia >= 4.7 && totalAvaliacoes >= 3;
}

/**
 * Enriquece uma lista de serviços com a pontuação inteligente e os selos
 */
export function enriquecerServicos(servicos: Servico[]): Servico[] {
  return servicos.map((item) => {
    const nota = item.nota_media || 5.0;
    const total = item.total_avaliacoes || 1;
    const score = calcularScoreInteligente(nota, total);
    const selo = isTopRecomendado(nota, total);

    return {
      ...item,
      pontuacao_inteligente: score,
      selo_destaque: selo,
    };
  });
}

/**
 * Ordena serviços de acordo com o critério escolhido
 */
export function ordenarServicos(servicos: Servico[], tipo: TipoOrdenacao): Servico[] {
  const enriquecidos = enriquecerServicos(servicos);

  return [...enriquecidos].sort((a, b) => {
    switch (tipo) {
      case "melhores":
        // Prioriza maior pontuação inteligente
        return (b.pontuacao_inteligente ?? 0) - (a.pontuacao_inteligente ?? 0);

      case "recomendados":
        // Prioriza maior quantidade absoluta de indicações/avaliações
        if (b.total_avaliacoes !== a.total_avaliacoes) {
          return b.total_avaliacoes - a.total_avaliacoes;
        }
        return b.nota_media - a.nota_media;

      case "recentes":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

      case "alfabetica":
        return a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" });

      default:
        return 0;
    }
  });
}
