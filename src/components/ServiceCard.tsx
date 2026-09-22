"use client";

import React, { useState } from "react";
import { Servico } from "@/types";
import {
  Star,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  ThumbsUp,
  UserCheck,
  Award,
  CheckCircle2,
} from "lucide-react";
import {
  gerarLinkWhatsApp,
  gerarLinkLigacao,
  gerarTextoCompartilhamento,
} from "@/lib/utils";
import { RatingModal } from "./RatingModal";

interface ServiceCardProps {
  servico: Servico;
  onAtualizar: () => void;
}

export function ServiceCard({ servico, onAtualizar }: ServiceCardProps) {
  const [modalAvaliacaoAberto, setModalAvaliacaoAberto] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const whatsappUrl = gerarLinkWhatsApp(
    servico.telefone,
    servico.nome,
    servico.categoria
  );

  const ligarUrl = gerarLinkLigacao(servico.telefone);

  const handleCompartilhar = async () => {
    const texto = gerarTextoCompartilhamento(
      servico.nome,
      servico.categoria,
      servico.telefone,
      servico.cidade_bairro,
      servico.nota_media,
      servico.total_avaliacoes
    );

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Indicação: ${servico.nome}`,
          text: texto,
        });
        return;
      } catch {
        // Fallback
      }
    }

    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);

      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`, "_blank");
    } catch {
      alert("Texto da indicação copiado! Cole no seu grupo de WhatsApp.");
    }
  };

  // Inicial do profissional para avatar visual
  const inicial = servico.nome ? servico.nome.trim().charAt(0).toUpperCase() : "S";

  return (
    <>
      <article className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md border border-gray-200/70 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
        <div>
          {/* Topo: Categoria + Badges */}
          <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/50">
                {servico.categoria}
              </span>

              {servico.verificado_admin && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/70">
                  <CheckCircle2 className="w-3 h-3 text-blue-600" />
                  Verificado
                </span>
              )}
            </div>

            {/* Selo Top Recomendado */}
            {servico.selo_destaque && (
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-xs">
                <Award className="w-3 h-3 fill-amber-950" />
                TOP RECOMENDADO
              </span>
            )}
          </div>

          {/* Cabeçalho com Avatar de Iniciais e Nome */}
          <div className="flex items-start gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-900 flex items-center justify-center font-black text-sm flex-shrink-0 border border-emerald-200/60 shadow-2xs">
              {inicial}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-gray-900 leading-snug truncate">
                {servico.nome}
              </h3>

              {/* Avaliação em Estrelas */}
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="flex items-center text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-xs text-gray-900 ml-1">
                    {servico.nota_media ? servico.nota_media.toFixed(1) : "5.0"}
                  </span>
                </div>
                <span className="text-gray-300 text-xs">•</span>
                <span className="text-[11px] text-gray-500 font-medium">
                  {servico.total_avaliacoes} {servico.total_avaliacoes === 1 ? "indicação" : "indicações"}
                </span>
              </div>
            </div>
          </div>

          {/* Localização */}
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="truncate font-medium">{servico.cidade_bairro}</span>
          </div>

          {/* Descrição dos Serviços */}
          {servico.descricao && (
            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3 bg-gray-50/80 p-2 rounded-xl border border-gray-100">
              {servico.descricao}
            </p>
          )}

          {/* Quem indicou */}
          {servico.quem_indicou && (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-900 bg-emerald-50/70 px-2.5 py-1 rounded-lg mb-3 border border-emerald-100/70">
              <UserCheck className="w-3 h-3 text-emerald-600 flex-shrink-0" />
              <span>
                Recomendado por: <strong className="font-semibold">{servico.quem_indicou}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="pt-2.5 border-t border-gray-100 mt-1">
          {/* Botão Principal: WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all mb-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Chamar no WhatsApp</span>
          </a>

          {/* Linha de botões secundários */}
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <a
              href={ligarUrl}
              className="py-1.5 px-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium flex items-center justify-center gap-1 transition-colors text-[11px]"
            >
              <Phone className="w-3 h-3 text-emerald-600" />
              <span>Ligar</span>
            </a>

            <button
              type="button"
              onClick={() => setModalAvaliacaoAberto(true)}
              className="py-1.5 px-2 rounded-xl border border-amber-200 bg-amber-50/50 text-amber-900 hover:bg-amber-100/70 font-medium flex items-center justify-center gap-1 transition-colors text-[11px] cursor-pointer"
            >
              <ThumbsUp className="w-3 h-3 text-amber-600" />
              <span>Avaliar</span>
            </button>

            <button
              type="button"
              onClick={handleCompartilhar}
              className="py-1.5 px-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium flex items-center justify-center gap-1 transition-colors text-[11px] cursor-pointer"
            >
              <Share2 className="w-3 h-3 text-blue-600" />
              <span>{copiado ? "Copiado!" : "Indicar"}</span>
            </button>
          </div>
        </div>
      </article>

      {/* Modal de Avaliação */}
      <RatingModal
        servico={servico}
        isOpen={modalAvaliacaoAberto}
        onClose={() => setModalAvaliacaoAberto(false)}
        onAvaliacaoSalva={onAtualizar}
      />
    </>
  );
}
