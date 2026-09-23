"use client";

import React from "react";
import {
  X,
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  CloudRain,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";
import { ClimaAtual } from "@/lib/weather";

interface PrevisaoTempoModalProps {
  clima: ClimaAtual | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PrevisaoTempoModal({ clima, isOpen, onClose }: PrevisaoTempoModalProps) {
  if (!isOpen || !clima) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com Gradiente de Céu */}
        <div className="bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-800 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shadow-xs">
              {clima.icone}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-black leading-tight">Clima no Jd. Regente</h2>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-white/20 text-sky-100">
                  Indaiatuba • SP
                </span>
              </div>
              <p className="text-xs text-sky-100 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>Atualizado às {clima.atualizadoEm}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conteúdo do Clima */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {/* Destaque Principal de Hoje */}
          <div className="bg-gradient-to-br from-sky-50 to-blue-50/60 border border-sky-100 rounded-3xl p-4 sm:p-5 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                  {clima.temperatura}°
                </span>
                <span className="text-sm font-bold text-slate-600">{clima.descricao}</span>
              </div>

              <div className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-2">
                <span>Sensação de <strong>{clima.sensacaoTermica}°C</strong></span>
                <span>•</span>
                <span>Mín {clima.tempMinHoje}° / Máx {clima.tempMaxHoje}°</span>
              </div>
            </div>

            <div className="text-5xl filter drop-shadow-sm select-none">
              {clima.icone}
            </div>
          </div>

          {/* Métricas Rápidas: Chuva, Umidade, Vento */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 space-y-1">
              <CloudRain className="w-4 h-4 text-blue-500 mx-auto" />
              <span className="text-[10px] text-slate-400 font-bold block">Chuva Hoje</span>
              <strong className="text-slate-800 font-black text-xs">
                {clima.probabilidadeChuvaHoje}%
              </strong>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 space-y-1">
              <Droplets className="w-4 h-4 text-sky-500 mx-auto" />
              <span className="text-[10px] text-slate-400 font-bold block">Umidade</span>
              <strong className="text-slate-800 font-black text-xs">
                {clima.umidade}%
              </strong>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 space-y-1">
              <Wind className="w-4 h-4 text-teal-600 mx-auto" />
              <span className="text-[10px] text-slate-400 font-bold block">Vento</span>
              <strong className="text-slate-800 font-black text-xs">
                {clima.ventoKmH} km/h
              </strong>
            </div>
          </div>

          {/* Dica da Vizinhança */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-amber-950">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-extrabold block text-amber-900 text-[11px]">Dica para o bairro:</strong>
              <p className="mt-0.5 leading-relaxed text-[11px] text-amber-900/90">{clima.dicaBairro}</p>
            </div>
          </div>

          {/* Previsão dos Próximos 5 Dias */}
          <div className="space-y-2 pt-1">
            <h4 className="text-xs font-black text-slate-800">Previsão para os Próximos Dias</h4>
            <div className="divide-y divide-slate-100 bg-slate-50/70 border border-slate-200/80 rounded-2xl overflow-hidden">
              {clima.proximosDias.map((dia) => (
                <div
                  key={dia.data}
                  className="p-2.5 sm:px-3.5 flex items-center justify-between text-xs hover:bg-slate-100/60 transition"
                >
                  <div className="flex items-center gap-2.5 min-w-[90px]">
                    <span className="text-base select-none">{dia.icone}</span>
                    <div>
                      <span className="font-bold text-slate-800 block text-xs">{dia.diaSemana}</span>
                      <span className="text-[10px] text-slate-400 truncate block max-w-[90px]">{dia.descricao}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-blue-600 text-[11px] font-semibold min-w-[50px] justify-center">
                    {dia.probabilidadeChuva > 0 ? (
                      <>
                        <CloudRain className="w-3 h-3 text-blue-400" />
                        <span>{dia.probabilidadeChuva}%</span>
                      </>
                    ) : (
                      <span className="text-slate-400 font-normal">Sem chuva</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <span className="text-slate-400">{dia.tempMin}°</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-900 font-black">{dia.tempMax}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Dados meteorológicos Open-Meteo</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:text-slate-900 font-semibold text-xs cursor-pointer shadow-2xs"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
