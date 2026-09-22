/**
 * Remove todos os caracteres não numéricos de um telefone
 */
export function limparTelefone(telefone: string): string {
  return telefone.replace(/\D/g, "");
}

/**
 * Aplica máscara de telefone brasileiro: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 */
export function formatarTelefoneBR(valor: string): string {
  const digitos = limparTelefone(valor).slice(0, 11);

  if (digitos.length <= 2) {
    return digitos.length > 0 ? `(${digitos}` : "";
  }
  if (digitos.length <= 6) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  }
  if (digitos.length <= 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7, 11)}`;
}

/**
 * Valida se é um telefone brasileiro válido (com DDD e 8 ou 9 dígitos)
 */
export function isTelefoneValido(telefone: string): boolean {
  const digitos = limparTelefone(telefone);
  return digitos.length === 10 || digitos.length === 11;
}

/**
 * Gera URL do WhatsApp com mensagem pronta
 */
export function gerarLinkWhatsApp(
  telefone: string,
  nomeOuMensagem?: string,
  categoria?: string
): string {
  let digitos = limparTelefone(telefone);
  if (!digitos.startsWith("55")) {
    digitos = `55${digitos}`;
  }

  let textoFinal = "";
  if (categoria && nomeOuMensagem) {
    textoFinal = `Olá ${nomeOuMensagem}! Peguei seu contato pelo app *Indica Jd.Regente - Indaiatuba* na categoria *${categoria}*. Gostaria de mais informações sobre seus serviços!`;
  } else if (nomeOuMensagem) {
    textoFinal = nomeOuMensagem;
  }

  return `https://wa.me/${digitos}${textoFinal ? `?text=${encodeURIComponent(textoFinal)}` : ""}`;
}

/**
 * Gera URL de ligação telefônica direta
 */
export function gerarLinkLigacao(telefone: string): string {
  const digitos = limparTelefone(telefone);
  return `tel:+55${digitos}`;
}

/**
 * Formata texto para compartilhar o contato no grupo de WhatsApp
 */
export function gerarTextoCompartilhamento(nome: string, categoria: string, telefone: string, cidade: string, nota: number, total: number): string {
  return `⭐ *Indicação no Indica Jd. Regente (Indaiatuba)*:\n\n` +
    `👤 *${nome}*\n` +
    `🛠️ Categoria: *${categoria}*\n` +
    `⭐ Avaliação: *${nota.toFixed(1)}/5.0* (${total} indicações)\n` +
    `📍 Região: ${cidade}\n` +
    `📱 WhatsApp: ${telefone}\n\n` +
    `👉 Veja mais e recomende no app: https://indica-regente-indaia.vercel.app`;
}

/**
 * Tenta detectar o bairro em Indaiatuba via GPS do navegador
 */
export async function detectarBairroPorGPS(
  bairrosDisponiveis?: readonly string[]
): Promise<{ bairro?: string; erro?: string }> {
  if (typeof window === "undefined" || !navigator.geolocation) {
    return { erro: "Seu navegador não suporta geolocalização." };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16&addressdetails=1`;
          const res = await fetch(url, {
            headers: { "Accept-Language": "pt-BR" },
          });

          if (!res.ok) {
            resolve({ erro: "Não foi possível identificar o bairro pelo mapa." });
            return;
          }

          const data = await res.json();
          const addr = data.address || {};
          const rawBairro =
            addr.suburb ||
            addr.neighbourhood ||
            addr.residential ||
            addr.quarter ||
            addr.city_district ||
            "";

          if (!rawBairro) {
            resolve({ erro: "Bairro não identificado nas coordenadas." });
            return;
          }

          // Se fornecida a lista de bairros, tenta fazer correspondência inteligente
          if (bairrosDisponiveis && bairrosDisponiveis.length > 0) {
            const clean = (str: string) =>
              str
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/^jardim\s+/i, "jd. ")
                .replace(/^parque\s+/i, "pq. ")
                .replace(/^vila\s+/i, "vl. ")
                .trim();

            const rawClean = clean(rawBairro);
            const encontrado = bairrosDisponiveis.find((b) => {
              const bClean = clean(b);
              return bClean === rawClean || rawClean.includes(bClean) || bClean.includes(rawClean);
            });

            if (encontrado) {
              resolve({ bairro: encontrado });
              return;
            }
          }

          resolve({ bairro: rawBairro });
        } catch {
          resolve({ erro: "Erro de conexão ao buscar localização." });
        }
      },
      (err) => {
        if (err.code === 1) {
          resolve({ erro: "Permissão de localização foi recusada no navegador." });
        } else if (err.code === 2) {
          resolve({ erro: "Posição de GPS indisponível no momento." });
        } else {
          resolve({ erro: "Tempo limite atingido ao obter GPS." });
        }
      },
      { timeout: 7000, enableHighAccuracy: true }
    );
  });
}
