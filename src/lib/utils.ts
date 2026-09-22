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

/**
 * Comprime uma imagem selecionada pelo usuário (câmera ou galeria)
 * redimensionando-a para maxDim e convertendo para WebP/JPEG leve (Data URL)
 */
export async function comprimirImagemArquivo(file: File, maxDim = 800, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        try {
          const dataUrl = canvas.toDataURL("image/webp", quality);
          resolve(dataUrl);
        } catch {
          const dataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(dataUrl);
        }
      };
      img.onerror = () => reject(new Error("Falha ao processar a imagem."));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Falha ao ler o arquivo selecionado."));
    reader.readAsDataURL(file);
  });
}

/**
 * Analisa o texto de horário de funcionamento e determina se está aberto agora
 */
export function verificarAbertoAgora(horario?: string): { aberto: boolean; texto: string } | null {
  if (!horario || !horario.trim()) return null;
  const textoLimpo = horario.trim();

  if (/24\s*h(oras)?/i.test(textoLimpo)) {
    return { aberto: true, texto: "Aberto 24h" };
  }

  const regexHoras = /(\d{1,2})(?::(\d{2})|h(?:(\d{2}))?)?\s*(?:-|às|as|até|ate)\s*(\d{1,2})(?::(\d{2})|h(?:(\d{2}))?)?/i;
  const match = textoLimpo.match(regexHoras);

  if (match) {
    const horaInicio = parseInt(match[1], 10);
    const minInicio = parseInt(match[2] || match[3] || "0", 10);
    const horaFim = parseInt(match[4], 10);
    const minFim = parseInt(match[5] || match[6] || "0", 10);

    const agora = new Date();
    const minutosAtuais = agora.getHours() * 60 + agora.getMinutes();
    const minutosInicio = horaInicio * 60 + minInicio;
    const minutosFim = horaFim * 60 + minFim;

    if (minutosFim < minutosInicio) {
      if (minutosAtuais >= minutosInicio || minutosAtuais <= minutosFim) {
        return { aberto: true, texto: `🟢 Aberto (fecha às ${String(horaFim).padStart(2, "0")}:${String(minFim).padStart(2, "0")})` };
      } else {
        return { aberto: false, texto: `🔴 Fechado (abre às ${String(horaInicio).padStart(2, "0")}:${String(minInicio).padStart(2, "0")})` };
      }
    }

    if (minutosAtuais >= minutosInicio && minutosAtuais <= minutosFim) {
      return { aberto: true, texto: `🟢 Aberto (fecha às ${String(horaFim).padStart(2, "0")}:${String(minFim).padStart(2, "0")})` };
    } else {
      return { aberto: false, texto: `🔴 Fechado` };
    }
  }

  return { aberto: true, texto: textoLimpo };
}
