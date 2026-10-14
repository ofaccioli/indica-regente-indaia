"use client";

import React, { useState, useEffect } from "react";
import { Clock, X } from "lucide-react";

interface BuscasRecentesProps {
  buscaAtual: string;
  onSelecionarBusca: (termo: string) => void;
}

const STORAGE_KEY = "indica_buscas_recentes";
const MAX_ITENS = 5;

export function BuscasRecentes({ buscaAtual, onSelecionarBusca }: BuscasRecentesProps) {
  const [historico, setHistorico] = useState<string[]>([]);

  // Carrega histórico salvo
  useEffect(() => {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY);
      if (salvo) {
        setHistorico(JSON.parse(salvo));
      }
    } catch {}
  }, []);

  // Salva no histórico quando a busca tiver 3+ caracteres e o usuário parar de digitar
  useEffect(() => {
    const t = buscaAtual.trim();
    if (t.length < 3) return;

    const timer = setTimeout(() => {
      try {
        setHistorico((prev) => {
          const filtrado = prev.filter((item) => item.toLowerCase() !== t.toLowerCase());
          const novo = [t, ...filtrado].slice(0, MAX_ITENS);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(novo));
          return novo;
        });
      } catch {}
    }, 1500);

    return () => clearTimeout(timer);
  }, [buscaAtual]);

  const removerItem = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    const novo = historico.filter((h) => h !== item);
    setHistorico(novo);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(novo));
    } catch {}
  };

  const limparTudo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHistorico([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  if (historico.length === 0) return null;

  return (
    <div className="w-full pt-1.5 pb-0.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
      <span className="text-emerald-200/80 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 flex-shrink-0 select-none">
        <Clock className="w-3 h-3 text-emerald-300" />
        Recentes:
      </span>

      {historico.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onSelecionarBusca(item)}
          className="inline-flex items-center gap-1 bg-emerald-800/60 hover:bg-emerald-700/80 text-emerald-100 hover:text-white px-2.5 py-0.5 rounded-full border border-emerald-600/50 shadow-2xs font-medium transition cursor-pointer flex-shrink-0 group active:scale-95"
          title={`Buscar "${item}"`}
        >
          <span>{item}</span>
          <span
            onClick={(e) => removerItem(e, item)}
            className="text-emerald-300/60 hover:text-rose-300 rounded-full p-0.5 transition"
            title="Remover do histórico"
          >
            <X className="w-2.5 h-2.5" />
          </span>
        </button>
      ))}

      <button
        type="button"
        onClick={limparTudo}
        className="text-[10px] text-emerald-300/70 hover:text-amber-300 underline font-semibold ml-1 cursor-pointer flex-shrink-0"
        title="Limpar histórico de buscas"
      >
        Limpar
      </button>
    </div>
  );
}
