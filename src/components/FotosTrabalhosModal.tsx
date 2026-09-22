"use client";

import React, { useState } from "react";
import { X, Images, ChevronLeft, ChevronRight } from "lucide-react";

interface FotosTrabalhosModalProps {
  isOpen: boolean;
  onClose: () => void;
  nomeProfissional: string;
  fotos: string[];
}

export function FotosTrabalhosModal({
  isOpen,
  onClose,
  nomeProfissional,
  fotos,
}: FotosTrabalhosModalProps) {
  const [fotoSelecionadaIdx, setFotoSelecionadaIdx] = useState<number>(0);

  if (!isOpen || !fotos || fotos.length === 0) return null;

  const anterior = () => {
    setFotoSelecionadaIdx((prev) => (prev > 0 ? prev - 1 : fotos.length - 1));
  };

  const proximo = () => {
    setFotoSelecionadaIdx((prev) => (prev < fotos.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-slate-900 text-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-800 flex flex-col max-h-[92vh] overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Images className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white leading-tight">
                Fotos de Trabalhos
              </h3>
              <p className="text-xs text-slate-400">{nomeProfissional}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visualização Principal em Destaque */}
        <div className="relative flex-1 bg-black/60 min-h-[260px] sm:min-h-[340px] flex items-center justify-center p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fotos[fotoSelecionadaIdx]}
            alt={`Trabalho ${fotoSelecionadaIdx + 1} de ${nomeProfissional}`}
            className="max-h-[55vh] max-w-full object-contain rounded-2xl shadow-lg"
          />

          {fotos.length > 1 && (
            <>
              <button
                type="button"
                onClick={anterior}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm transition border border-white/10"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={proximo}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm transition border border-white/10"
                aria-label="Próxima foto"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Indicador de página */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-black/70 backdrop-blur-sm text-white text-[11px] font-bold rounded-full border border-white/10">
            {fotoSelecionadaIdx + 1} / {fotos.length}
          </div>
        </div>

        {/* Miniaturas */}
        {fotos.length > 1 && (
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-2 overflow-x-auto">
            {fotos.map((f, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setFotoSelecionadaIdx(i)}
                className={`relative rounded-xl overflow-hidden border-2 transition shrink-0 ${
                  i === fotoSelecionadaIdx
                    ? "border-emerald-500 scale-105"
                    : "border-slate-700 opacity-60 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f}
                  alt={`Miniatura ${i + 1}`}
                  className="w-12 h-12 object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
