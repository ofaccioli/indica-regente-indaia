"use client";

import React, { useRef, useState, useEffect } from "react";
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
  ChevronLeft,
  ChevronRight,
  Flame,
  Cake,
  PartyPopper,
  Trees,
  Truck,
  Armchair,
  Key,
  HeartHandshake,
  Briefcase,
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -280 : 280;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
      setTimeout(checkScroll, 300);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollRef.current && Math.abs(e.deltaY) > 0) {
      scrollRef.current.scrollLeft += e.deltaY;
      checkScroll();
    }
  };

  const getIcon = (cat: string) => {
    switch (cat) {
      case "Todos":
        return <LayoutGrid className="w-3.5 h-3.5" />;
      case "Eletricista":
        return <Zap className="w-3.5 h-3.5 text-amber-500" />;
      case "Encanador":
        return <Droplets className="w-3.5 h-3.5 text-sky-500" />;
      case "Diarista / Limpeza":
        return <Sparkles className="w-3.5 h-3.5 text-teal-500" />;
      case "Mecânico":
        return <Car className="w-3.5 h-3.5 text-orange-500" />;
      case "Reformas / Pedreiro":
        return <Hammer className="w-3.5 h-3.5 text-amber-700" />;
      case "Pintor / Gesso":
        return <Paintbrush className="w-3.5 h-3.5 text-indigo-500" />;
      case "Churrasqueiro":
        return <Flame className="w-3.5 h-3.5 text-amber-600" />;
      case "Buffet / Festas & Eventos":
        return <PartyPopper className="w-3.5 h-3.5 text-fuchsia-500" />;
      case "Bolos / Doces / Salgados":
        return <Cake className="w-3.5 h-3.5 text-pink-500" />;
      case "Jardinagem / Piscina":
        return <Trees className="w-3.5 h-3.5 text-emerald-600" />;
      case "Marcenaria / Móveis":
        return <Armchair className="w-3.5 h-3.5 text-amber-800" />;
      case "Chaveiro / Fechaduras":
        return <Key className="w-3.5 h-3.5 text-yellow-600" />;
      case "Fretes / Mudanças":
        return <Truck className="w-3.5 h-3.5 text-blue-600" />;
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
      case "Cuidador / Enfermagem / Babá":
        return <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />;
      case "Aulas / Reforço":
        return <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />;
      case "Costura / Roupas":
        return <Shirt className="w-3.5 h-3.5 text-violet-500" />;
      case "Lavanderia / Passadeira":
        return <Sparkles className="w-3.5 h-3.5 text-sky-600" />;
      case "Tecnologia / Celular":
        return <Smartphone className="w-3.5 h-3.5 text-blue-600" />;
      case "Contabilidade / Advocacia":
        return <Briefcase className="w-3.5 h-3.5 text-slate-700" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-gray-500" />;
    }
  };

  return (
    <div className="w-full bg-white border-b border-gray-200/80 py-2 px-2 sm:px-4 shadow-2xs relative group">
      <div className="max-w-4xl mx-auto relative flex items-center">
        {/* Botão de Rolar para Esquerda (Desktop) */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Rolar categorias para esquerda"
            className="hidden sm:flex absolute -left-3 z-10 w-7 h-7 rounded-full bg-white/95 shadow-md border border-gray-200 text-gray-700 items-center justify-center hover:bg-emerald-50 hover:text-emerald-700 transition-all cursor-pointer active:scale-90"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}

        {/* Container Horizontal com suporte a Mouse Wheel e Touch */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          onWheel={handleWheel}
          className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 w-full"
        >
          {CATEGORIAS_DISPONIVEIS.map((cat) => {
            const isAtivo = categoriaSelecionada === cat;
            const total = cat === "Todos" ? contagemPorCategoria["_total"] || 0 : contagemPorCategoria[cat] || 0;

            return (
              <button
                key={cat}
                onClick={() => onSelecionarCategoria(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 cursor-pointer ${
                  isAtivo
                    ? "bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-600/30 scale-[1.02]"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200/80 hover:text-gray-900"
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

        {/* Botão de Rolar para Direita (Desktop) */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Rolar categorias para direita"
            className="hidden sm:flex absolute -right-3 z-10 w-7 h-7 rounded-full bg-white/95 shadow-md border border-gray-200 text-gray-700 items-center justify-center hover:bg-emerald-50 hover:text-emerald-700 transition-all cursor-pointer active:scale-90"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
      </div>
    </div>
  );
}
