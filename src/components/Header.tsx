"use client";

import React from "react";
import Image from "next/image";
import { Search, X, Sparkles, Plus, Share } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  busca: string;
  onBuscaChange: (novaBusca: string) => void;
  onAbrirDivulgacao?: () => void;
}

export function Header({ busca, onBuscaChange, onAbrirDivulgacao }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-b from-emerald-800 via-emerald-700 to-emerald-700 text-white shadow-sm border-b border-emerald-600/30">
      <div className="max-w-4xl mx-auto px-4 pt-3.5 pb-3">
        {/* Topo do Header: Logo e Botão de Ação */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden shadow-sm border-2 border-amber-300/60 group-active:scale-95 transition-transform flex-shrink-0 bg-emerald-800">
              <Image
                src="/logo.png"
                alt="Logo Indica Jd.Regente"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-base sm:text-lg font-black tracking-tight text-white drop-shadow-2xs leading-tight">
                  Indica <span className="text-amber-300">Jd.Regente</span>{" "}
                  <span className="text-emerald-100/90 text-xs sm:text-sm font-bold">- Indaiatuba</span>
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/80 font-medium">
                Guia de Serviços e Recomendações
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-1.5">
            {onAbrirDivulgacao && (
              <button
                type="button"
                onClick={onAbrirDivulgacao}
                className="inline-flex items-center gap-1 bg-emerald-800/80 hover:bg-emerald-800 text-amber-300 px-2.5 py-1.5 rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all border border-emerald-600/50 cursor-pointer"
                title="Divulgar e ver QR Code"
              >
                <Share className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Divulgar</span>
              </button>
            )}

            <Link
              href="/cadastrar"
              className="inline-flex items-center gap-1.5 bg-white hover:bg-emerald-50 text-emerald-900 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all border border-emerald-100"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-700 stroke-[2.5]" />
              <span>Indicar</span>
            </Link>
          </div>
        </div>

        {/* Barra de Pesquisa Moderna */}
        <div className="relative">
          <Search className="w-4 h-4 text-emerald-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={busca}
            onChange={(e) => onBuscaChange(e.target.value)}
            placeholder="O que você precisa hoje? (ex: eletricista, diarista...)"
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white text-gray-900 placeholder-gray-400 text-xs sm:text-sm font-medium focus:outline-none focus:ring-3 focus:ring-amber-300/60 shadow-sm border border-transparent transition-all"
          />
          {busca && (
            <button
              onClick={() => onBuscaChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
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
