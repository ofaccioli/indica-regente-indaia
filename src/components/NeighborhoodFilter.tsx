"use client";

import React from "react";
import { BAIRROS_INDAIATUBA } from "@/types";
import { MapPin, AlertCircle, Check } from "lucide-react";

interface NeighborhoodFilterProps {
  bairroSelecionado: string;
  onSelecionarBairro: (bairro: string) => void;
  apenasFimDeSemana: boolean;
  onToggleFimDeSemana: () => void;
}

export function NeighborhoodFilter({
  bairroSelecionado,
  onSelecionarBairro,
  apenasFimDeSemana,
  onToggleFimDeSemana,
}: NeighborhoodFilterProps) {
  return (
    <div className="w-full bg-emerald-900/90 text-white px-4 py-2 text-xs border-b border-emerald-700/50">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        {/* Toggle de Plantão / Fim de Semana */}
        <button
          type="button"
          onClick={onToggleFimDeSemana}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all flex-shrink-0 cursor-pointer ${
            apenasFimDeSemana
              ? "bg-amber-400 text-amber-950 shadow-xs ring-2 ring-amber-300 scale-105"
              : "bg-emerald-800/80 text-emerald-100 hover:bg-emerald-700 border border-emerald-600/40"
          }`}
        >
          <AlertCircle className={`w-3.5 h-3.5 ${apenasFimDeSemana ? "text-amber-950 fill-amber-950/20" : "text-amber-300"}`} />
          <span>🚨 Atende Fim de Semana</span>
          {apenasFimDeSemana && <Check className="w-3 h-3 stroke-[3]" />}
        </button>

        <span className="text-emerald-500 text-xs hidden sm:inline">|</span>

        {/* Chips de Bairros */}
        <div className="flex items-center gap-1.5 flex-nowrap">
          <span className="text-emerald-300/80 text-[11px] font-medium hidden md:inline flex-shrink-0">
            Região:
          </span>
          {BAIRROS_INDAIATUBA.map((bairro) => {
            const isAtivo = bairroSelecionado === bairro;
            return (
              <button
                key={bairro}
                type="button"
                onClick={() => onSelecionarBairro(bairro)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all flex-shrink-0 cursor-pointer ${
                  isAtivo
                    ? "bg-white text-emerald-950 font-bold shadow-xs"
                    : "bg-emerald-800/60 text-emerald-200 hover:bg-emerald-800 hover:text-white"
                }`}
              >
                {bairro}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
