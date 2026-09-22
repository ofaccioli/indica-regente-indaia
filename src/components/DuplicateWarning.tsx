"use client";

import React from "react";
import { AlertTriangle, Star, CheckCircle, ThumbsUp } from "lucide-react";
import { Servico } from "@/types";

interface DuplicateWarningProps {
  servicoExistente: Servico;
  onAvaliarExistente: () => void;
}

export function DuplicateWarning({ servicoExistente, onAvaliarExistente }: DuplicateWarningProps) {
  return (
    <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 shadow-sm text-amber-950 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center flex-shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-sm text-amber-900">
            Contato já cadastrado na comunidade!
          </h4>
          <p className="text-xs text-amber-800 mt-1 leading-relaxed">
            O telefone digitado já pertence a:{" "}
            <strong className="font-bold text-gray-900">{servicoExistente.nome}</strong>, na categoria{" "}
            <strong className="font-bold text-gray-900">{servicoExistente.categoria}</strong>.
          </p>

          <div className="bg-white/80 rounded-xl p-2.5 mt-2.5 border border-amber-200/70 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-amber-900">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-bold">{servicoExistente.nota_media.toFixed(1)}</span>
              <span className="text-gray-500 text-[11px]">
                ({servicoExistente.total_avaliacoes} {servicoExistente.total_avaliacoes === 1 ? "indicação" : "indicações"})
              </span>
            </div>

            <button
              type="button"
              onClick={onAvaliarExistente}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Avaliar este</span>
            </button>
          </div>

          <p className="text-[11px] text-amber-700/90 mt-2 italic">
            💡 Dica: Para não duplicar contatos na lista, clique no botão acima para adicionar sua recomendação ao perfil já existente!
          </p>
        </div>
      </div>
    </div>
  );
}
