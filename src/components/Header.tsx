"use client";

import React from "react";
import Image from "next/image";
import { Search, X, Plus, Share2, Sparkles, Download } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  busca: string;
  onBuscaChange: (novaBusca: string) => void;
  onAbrirDivulgacao?: () => void;
  onLogoClick?: () => void;
}

export function Header({ busca, onBuscaChange, onAbrirDivulgacao, onLogoClick }: HeaderProps) {
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
      </div>
    </header>
  );
}
