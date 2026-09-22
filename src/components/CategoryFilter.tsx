"use client";

import React from "react";
import { CATEGORIAS_DISPONIVEIS } from "@/types";
import {
  Sparkles,
  Zap,
  Droplets,
  Car,
  Hammer,
  Paintbrush,
  Dog,
  Utensils,
  Wind,
  Scissors,
  HeartPulse,
  GraduationCap,
  Shirt,
  Smartphone,
  LayoutGrid,
} from "lucide-react";

interface CategoryFilterProps {
  categoriaSelecionada: string;
  onSelecionarCategoria: (categoria: string) => void;
  contagemPorCategoria: Record<string, number>;
}

export function CategoryFilter({
  categoriaSelecionada,
  onSelecionarCategoria,
  contagemPorCategoria,
}: CategoryFilterProps) {
  const getIcon = (cat: string) => {
    switch (cat) {
      case "Todos":
        return <LayoutGrid className="w-3.5 h-3.5" />;
      case "Eletricista":
        return <Zap className="w-3.5 h-3.5 text-amber-500" />;
      case "Encanador":
        return <Droplets className="w-3.5 h-3.5 text-blue-500" />;
      case "Diarista / Limpeza":
        return <Sparkles className="w-3.5 h-3.5 text-teal-500" />;
      case "Mecânico":
        return <Car className="w-3.5 h-3.5 text-orange-500" />;
      case "Reformas / Pedreiro":
        return <Hammer className="w-3.5 h-3.5 text-amber-700" />;
      case "Pintor / Gesso":
        return <Paintbrush className="w-3.5 h-3.5 text-indigo-500" />;
      case "Pet / Veterinário":
        return <Dog className="w-3.5 h-3.5 text-pink-500" />;
      case "Restaurante / Lanche":
        return <Utensils className="w-3.5 h-3.5 text-red-500" />;
      case "Ar Condicionado":
        return <Wind className="w-3.5 h-3.5 text-cyan-500" />;
      case "Beleza / Estética":
        return <Scissors className="w-3.5 h-3.5 text-purple-500" />;
      case "Saúde / Terapia":
        return <HeartPulse className="w-3.5 h-3.5 text-rose-500" />;
      case "Aulas / Reforço":
        return <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />;
      case "Costura / Roupas":
        return <Shirt className="w-3.5 h-3.5 text-violet-500" />;
      case "Tecnologia / Celular":
        return <Smartphone className="w-3.5 h-3.5 text-sky-600" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-gray-500" />;
    }
  };

  return (
    <div className="w-full bg-white border-b border-gray-100 py-2.5 px-4 shadow-xs">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 pt-0.5">
        {CATEGORIAS_DISPONIVEIS.map((cat) => {
          const isAtivo = categoriaSelecionada === cat;
          const total = cat === "Todos" ? contagemPorCategoria["_total"] || 0 : contagemPorCategoria[cat] || 0;

          return (
            <button
              key={cat}
              onClick={() => onSelecionarCategoria(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 flex-shrink-0 cursor-pointer ${
                isAtivo
                  ? "bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-600/30 scale-[1.02]"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span>{getIcon(cat)}</span>
              <span>{cat}</span>
              {total > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isAtivo ? "bg-emerald-900/60 text-emerald-100" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {total}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
