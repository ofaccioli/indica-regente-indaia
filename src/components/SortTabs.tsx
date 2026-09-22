"use client";

import React from "react";
import { TipoOrdenacao } from "@/types";
import { Star, Flame, Clock, ArrowDownAZ } from "lucide-react";

interface SortTabsProps {
  ordenacaoAtual: TipoOrdenacao;
  onMudarOrdenacao: (novaOrdenacao: TipoOrdenacao) => void;
}

export function SortTabs({ ordenacaoAtual, onMudarOrdenacao }: SortTabsProps) {
  const opcoes: { id: TipoOrdenacao; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: "melhores",
      label: "Top Avaliados",
      icon: <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />,
      badge: "Inteligente",
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
      icon: <ArrowDownAZ className="w-3.5 h-3.5 text-gray-500" />,
    },
  ];

  return (
    <div className="px-4 py-2.5 bg-gray-50/80 border-b border-gray-200/60 flex items-center justify-between text-xs">
      <span className="text-gray-500 font-medium hidden xs:inline">Ordenar por:</span>
      <div className="flex gap-1.5 w-full xs:w-auto overflow-x-auto no-scrollbar">
        {opcoes.map((opcao) => {
          const ativo = ordenacaoAtual === opcao.id;
          return (
            <button
              key={opcao.id}
              onClick={() => onMudarOrdenacao(opcao.id)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-medium transition-all text-xs cursor-pointer flex-shrink-0 ${
                ativo
                  ? "bg-white text-emerald-800 shadow-xs border border-emerald-200 font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {opcao.icon}
              <span>{opcao.label}</span>
              {opcao.badge && (
                <span className="text-[9px] bg-amber-100 text-amber-800 px-1 rounded font-bold uppercase">
                  {opcao.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
