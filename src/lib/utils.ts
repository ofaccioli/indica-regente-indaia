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
  return `⭐ *Indicação no IndicaRegenteIndaia*:\n\n` +
    `👤 *${nome}*\n` +
    `🛠️ Categoria: *${categoria}*\n` +
    `⭐ Avaliação: *${nota.toFixed(1)}/5.0* (${total} indicações)\n` +
    `📍 Região: ${cidade}\n` +
    `📱 WhatsApp: ${telefone}\n\n` +
    `👉 Veja mais e recomende também no IndicaRegenteIndaia!`;
}
