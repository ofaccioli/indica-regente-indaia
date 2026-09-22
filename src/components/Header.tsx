"use client";

import React from "react";
import { Search, X, Sparkles, MapPin } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  busca: string;
  onBuscaChange: (novaBusca: string) => void;
  totalServicos: number;
}

export function Header({ busca, onBuscaChange, totalServicos }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-emerald-700 text-white shadow-md">
      {/* Barra superior de status */}
      <div className="bg-emerald-800/80 px-4 py-1.5 text-xs text-emerald-100 flex items-center justify-between border-b border-emerald-600/40">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="font-medium">Comunidade Regente Feijó & Indaiatuba</span>
        </div>
        <span className="text-[11px] bg-emerald-900/60 px-2 py-0.5 rounded-full">
          {totalServicos} serviços recomendados
        </span>
      </div>

      {/* Brand & Título */}
      <div className="px-4 pt-3.5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-900 flex items-center justify-center font-black text-xl shadow-inner">
              ⭐
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-extrabold tracking-tight text-white drop-shadow-sm">
                  Indica<span className="text-amber-300">RegenteIndaia</span>
                </h1>
              </div>
              <p className="text-xs text-emerald-100 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Guia de Recomendações e Serviços Confiáveis
              </p>
            </div>
          </Link>

          <Link
            href="/cadastrar"
            className="hidden sm:inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 px-3.5 py-1.5 rounded-lg text-xs font-bold shadow transition-all active:scale-95"
          >
            + Indicar Contato
          </Link>
        </div>

        {/* Barra de Pesquisa Rápida */}
        <div className="relative">
          <Search className="w-4 h-4 text-emerald-200 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={busca}
            onChange={(e) => onBuscaChange(e.target.value)}
            placeholder="Buscar eletricista, mecânico, diarista, bairro..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-emerald-800/70 border border-emerald-500/50 text-white placeholder-emerald-200/70 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:bg-emerald-900 transition-all shadow-inner"
          />
          {busca && (
            <button
              onClick={() => onBuscaChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-200 hover:text-white p-0.5 rounded-full"
              aria-label="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
