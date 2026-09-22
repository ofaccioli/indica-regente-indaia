"use client";

import React from "react";
import { TipoOrdenacao } from "@/types";
import { Star, Flame, Clock, ArrowDownAZ } from "lucide-react";

interface SortTabsProps {
  ordenacaoAtual: TipoOrdenacao;
  onMudarOrdenacao: (novaOrdenacao: TipoOrdenacao) => void;
}

export function SortTabs({ ordenacaoAtual, onMudarOrdenacao }: SortTabsProps) {
  const opcoes: { id: TipoOrdenacao; label: string; icon: React.ReactNode }[] = [
    {
      id: "melhores",
      label: "Top Avaliados",
      icon: <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />,
    },
    {
      id: "recomendados",
      label: "Mais Indicados",
      icon: <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-400" />,
    },
    {
      id: "recentes",
      label: "Recentes",
      icon: <Clock className="w-3.5 h-3.5 text-sky-500" />,
    },
    {
      id: "alfabetica",
      label: "A - Z",
      icon: <ArrowDownAZ className="w-3.5 h-3.5 text-slate-500" />,
    },
  ];

  return (
    <div className="px-4 py-2 bg-slate-50/50 border-b border-slate-200/60 flex items-center justify-between text-xs">
      <div className="max-w-4xl mx-auto w-full flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar py-0.5">
        <div className="bg-slate-200/70 p-1 rounded-2xl flex items-center gap-1 border border-slate-300/40">
          {opcoes.map((opcao) => {
            const ativo = ordenacaoAtual === opcao.id;
            return (
              <button
                key={opcao.id}
                onClick={() => onMudarOrdenacao(opcao.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all text-xs cursor-pointer flex-shrink-0 ${
                  ativo
                    ? "bg-white text-emerald-950 shadow-xs font-black"
                    : "text-slate-600 hover:text-slate-900 font-semibold"
                }`}
              >
                {opcao.icon}
                <span>{opcao.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
