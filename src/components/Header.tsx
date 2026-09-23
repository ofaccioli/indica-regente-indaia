"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  X,
  Plus,
  Share2,
  Sparkles,
  Download,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  busca: string;
  onBuscaChange: (novaBusca: string) => void;
  onAbrirDivulgacao?: () => void;
  onAbrirTelefones?: () => void;
  onLogoClick?: () => void;
}

export function Header({
  busca,
  onBuscaChange,
  onAbrirDivulgacao,
  onAbrirTelefones,
  onLogoClick,
}: HeaderProps) {
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
      const amount = direction === "left" ? -220 : 220;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
      setTimeout(checkScroll, 250);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollRef.current && Math.abs(e.deltaY) > 0) {
      scrollRef.current.scrollLeft += e.deltaY;
      checkScroll();
    }
  };
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-md border-b border-emerald-700/40 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 pt-3.5 pb-3">
        {/* Topo do Header: Logo e Botões de Ação */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <Link
            href="/"
            onClick={() => {
              if (onLogoClick) onLogoClick();
            }}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden shadow-md border-2 border-amber-300/80 group-active:scale-95 transition-transform flex-shrink-0 bg-emerald-950 ring-2 ring-emerald-500/20">
              <Image
                src="/logo.png"
                alt="Logo Indica Jd.Regente"
                fill
                sizes="44px"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-base sm:text-lg font-black tracking-tight text-white drop-shadow-xs leading-tight">
                  Indica <span className="text-amber-400">Jd.Regente</span>
                </span>
                <span className="text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-700/60 text-emerald-200 border border-emerald-600/40">
                  Indaiatuba • SP
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/90 font-medium flex items-center gap-1 mt-0.5">
                <span>Vizinhança & Serviços Recomendados</span>
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {onAbrirTelefones && (
              <button
                type="button"
                onClick={onAbrirTelefones}
                className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white px-2.5 py-1.5 rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all border border-red-400/60 cursor-pointer animate-pulse"
                title="Telefones Úteis & Emergência de Indaiatuba (GCM 153, SAMU, SAAE, CPFL)"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-white" />
                <span className="hidden xs:inline font-black">SOS</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("indica:open-pwa-install"));
                }
              }}
              className="inline-flex items-center gap-1 bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 hover:text-white px-2.5 py-1.5 rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all border border-emerald-600/50 cursor-pointer"
              title="Instalar App no Celular"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden xs:inline">App</span>
            </button>

            {onAbrirDivulgacao && (
              <button
                type="button"
                onClick={onAbrirDivulgacao}
                className="inline-flex items-center gap-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all border border-emerald-600/50 cursor-pointer"
                title="Divulgar e ver QR Code"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Divulgar</span>
              </button>
            )}

            <Link
              href="/cadastrar"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-emerald-950 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-950 stroke-[3]" />
              <span>Indicar</span>
            </Link>
          </div>
        </div>

        {/* Barra de Pesquisa Moderna com Efeito Glassmorphism */}
        <div className="relative">
          <Search className="w-4 h-4 text-emerald-700 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={busca}
            onChange={(e) => onBuscaChange(e.target.value)}
            placeholder="O que você precisa hoje? (ex: eletricista, diarista, pizza...)"
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white text-gray-900 placeholder-gray-400 text-xs sm:text-sm font-medium focus:outline-none focus:ring-3 focus:ring-amber-300/80 shadow-md border border-emerald-100 transition-all"
          />
          {busca && (
            <button
              onClick={() => onBuscaChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Limpar busca"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Tags de Atalho Rápido de Busca com Botões de Navegação Desktop */}
        <div className="relative flex items-center pt-2.5 pb-0.5">
          <span className="text-emerald-200/90 font-bold text-[10px] uppercase tracking-wider flex-shrink-0 mr-1.5 select-none">
            Sugestões:
          </span>

          {/* Botão Rolar para Esquerda (Desktop) */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Rolar sugestões para a esquerda"
              className="hidden sm:flex flex-shrink-0 mr-1 w-5 h-5 rounded-full bg-emerald-950/90 hover:bg-emerald-800 text-amber-300 items-center justify-center border border-emerald-600/60 shadow-xs transition-all active:scale-90 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            onWheel={handleWheel}
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth flex-1 py-0.5"
          >
            {[
              { rotulo: "🔥 Churrasco", termo: "Churrasqueiro" },
              { rotulo: "⚡ Eletricista", termo: "Eletricista" },
              { rotulo: "🧹 Diarista", termo: "Diarista" },
              { rotulo: "🚖 Uber / Táxi", termo: "Uber" },
              { rotulo: "🎂 Bolos & Doces", termo: "Bolos" },
              { rotulo: "🎉 Buffet", termo: "Buffet" },
              { rotulo: "🔑 Chaveiro", termo: "Chaveiro" },
              { rotulo: "🌲 Jardinagem", termo: "Jardinagem" },
              { rotulo: "🚚 Fretes", termo: "Fretes" },
            ].map((tag) => {
              const ativo = busca.toLowerCase() === tag.termo.toLowerCase();
              return (
                <button
                  key={tag.termo}
                  type="button"
                  onClick={() => {
                    if (ativo) {
                      onBuscaChange("");
                    } else {
                      onBuscaChange(tag.termo);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer flex-shrink-0 active:scale-95 ${
                    ativo
                      ? "bg-amber-400 text-emerald-950 font-black shadow-xs ring-2 ring-amber-300"
                      : "bg-white/15 hover:bg-white/25 text-white/90 border border-white/20"
                  }`}
                >
                  {tag.rotulo}
                </button>
              );
            })}
          </div>

          {/* Botão Rolar para Direita (Desktop) */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Rolar sugestões para a direita"
              className="hidden sm:flex flex-shrink-0 ml-1 w-5 h-5 rounded-full bg-emerald-950/90 hover:bg-emerald-800 text-amber-300 items-center justify-center border border-emerald-600/60 shadow-xs transition-all active:scale-90 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
