"use client";

import React, { useState } from "react";
import { BAIRROS_INDAIATUBA, BAIRROS_DESTAQUE, GRUPOS_BAIRROS } from "@/types";
import { AlertCircle, Check, Navigation, Loader2, MapPin } from "lucide-react";
import { detectarBairroPorGPS } from "@/lib/utils";

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
  const [detectandoGps, setDetectandoGps] = useState(false);

  const handleGPS = async () => {
    setDetectandoGps(true);
    const res = await detectarBairroPorGPS(BAIRROS_INDAIATUBA);
    setDetectandoGps(false);
    if (res.bairro) {
      onSelecionarBairro(res.bairro);
    } else if (res.erro) {
      alert(res.erro);
    }
  };

  const isDestaque = (BAIRROS_DESTAQUE as readonly string[]).includes(bairroSelecionado);

  return (
    <div className="w-full bg-slate-900 text-white px-4 py-2 text-xs border-b border-slate-800 shadow-inner">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2.5 overflow-x-auto no-scrollbar">
        {/* Toggle de Plantão / Fim de Semana */}
        <button
          type="button"
          onClick={onToggleFimDeSemana}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 cursor-pointer ${
            apenasFimDeSemana
              ? "bg-amber-400 text-amber-950 shadow-sm ring-2 ring-amber-300 scale-102"
              : "bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700"
          }`}
        >
          <AlertCircle className={`w-3.5 h-3.5 ${apenasFimDeSemana ? "text-amber-950" : "text-amber-400"}`} />
          <span>Plantão FDS / Emergência</span>
          {apenasFimDeSemana && <Check className="w-3 h-3 stroke-[3]" />}
        </button>

        <span className="text-slate-700 text-xs hidden sm:inline">•</span>

        {/* Botão GPS */}
        <button
          type="button"
          onClick={handleGPS}
          disabled={detectandoGps}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition-all flex-shrink-0 cursor-pointer disabled:opacity-50"
          title="Detectar meu bairro pelo GPS"
        >
          {detectandoGps ? (
            <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
          ) : (
            <Navigation className="w-3 h-3 text-emerald-400" />
          )}
          <span>{detectandoGps ? "Localizando..." : "Meu Bairro (GPS)"}</span>
        </button>

        {/* Chips de Bairros Principais */}
        <div className="flex items-center gap-1.5 flex-nowrap">
          {BAIRROS_DESTAQUE.map((bairro) => {
            const isAtivo = bairroSelecionado === bairro;
            return (
              <button
                key={bairro}
                type="button"
                onClick={() => onSelecionarBairro(bairro)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex-shrink-0 cursor-pointer ${
                  isAtivo
                    ? "bg-emerald-500 text-white shadow-xs"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
                }`}
              >
                {bairro}
              </button>
            );
          })}

          {/* Seletor dropdown para todos os outros bairros */}
          <div className="relative flex-shrink-0">
            <select
              value={isDestaque ? "" : bairroSelecionado}
              onChange={(e) => onSelecionarBairro(e.target.value || "Todos os Bairros")}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer outline-none border ${
                !isDestaque
                  ? "bg-emerald-500 text-white border-emerald-400 shadow-xs"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700"
              }`}
            >
              <option value="" disabled className="bg-slate-900 text-white font-medium">
                {!isDestaque ? `📍 ${bairroSelecionado}` : "+ Outros Bairros"}
              </option>
              {GRUPOS_BAIRROS.map((grupo) => {
                const bairrosDoGrupo = grupo.bairros.filter(
                  (b) => !(BAIRROS_DESTAQUE as readonly string[]).includes(b)
                );
                if (bairrosDoGrupo.length === 0) return null;
                return (
                  <optgroup key={grupo.nome} label={grupo.nome} className="bg-slate-900 text-emerald-400 font-bold">
                    {bairrosDoGrupo.map((b) => (
                      <option key={b} value={b} className="bg-slate-900 text-white font-normal">
                        {b}
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
