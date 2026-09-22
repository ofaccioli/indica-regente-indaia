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
        // Usuário cancelou ou navegador não suportou, faz fallback
      }
    }

    // Fallback: copia para área de transferência e abre link do zap
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);

      // Abre compartilhamento do WhatsApp Web / Mobile
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`, "_blank");
    } catch {
      alert("Texto da indicação copiado! Cole no seu grupo de WhatsApp.");
    }
  };

  return (
    <>
      <article className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
        {/* Faixa superior do card */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              {servico.categoria}
            </span>

            {/* Selo Top Recomendado */}
            {servico.selo_destaque && (
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-xs animate-pulse">
                <Award className="w-3.5 h-3.5 fill-amber-950" />
                TOP RECOMENDADO
              </span>
            )}
          </div>

          {/* Nome e Avaliação */}
          <div className="mb-2">
            <h3 className="text-base font-bold text-gray-900 leading-tight">
              {servico.nome}
            </h3>

            {/* Linha de estrelas e contagem */}
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-sm text-gray-900 ml-1">
                  {servico.nota_media ? servico.nota_media.toFixed(1) : "5.0"}
                </span>
              </div>
              <span className="text-gray-400 text-xs">•</span>
              <span className="text-xs text-gray-500 font-medium">
                {servico.total_avaliacoes} {servico.total_avaliacoes === 1 ? "recomendação" : "recomendações"}
              </span>
            </div>
          </div>

          {/* Localização */}
          <div className="flex items-center gap-1 text-xs text-gray-600 mb-2.5">
            <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="truncate">{servico.cidade_bairro}</span>
          </div>

          {/* Descrição */}
          {servico.descricao && (
            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3 bg-gray-50/70 p-2 rounded-lg border border-gray-100">
              {servico.descricao}
            </p>
          )}

          {/* Quem indicou */}
          {servico.quem_indicou && (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50/70 px-2 py-1 rounded-md mb-3 border border-emerald-100">
              <UserCheck className="w-3 h-3 text-emerald-600 flex-shrink-0" />
              <span>
                Indicado por: <strong className="font-semibold">{servico.quem_indicou}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="pt-2 border-t border-gray-100 mt-1">
          {/* Botão Principal: WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all mb-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Chamar no WhatsApp</span>
          </a>

          {/* Linha de botões secundários: Ligar, Avaliar, Compartilhar */}
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <a
              href={ligarUrl}
              className="py-1.5 px-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium flex items-center justify-center gap-1 transition-colors text-[11px]"
            >
              <Phone className="w-3 h-3 text-emerald-600" />
              <span>Ligar</span>
            </a>

            <button
              type="button"
              onClick={() => setModalAvaliacaoAberto(true)}
              className="py-1.5 px-2 rounded-lg border border-amber-200 bg-amber-50/60 text-amber-900 hover:bg-amber-100/60 font-medium flex items-center justify-center gap-1 transition-colors text-[11px] cursor-pointer"
            >
              <ThumbsUp className="w-3 h-3 text-amber-600" />
              <span>Avaliar</span>
            </button>

            <button
              type="button"
              onClick={handleCompartilhar}
              className="py-1.5 px-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium flex items-center justify-center gap-1 transition-colors text-[11px] cursor-pointer"
            >
              <Share2 className="w-3 h-3 text-blue-600" />
              <span>{copiado ? "Enviado!" : "Indicar"}</span>
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
