"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Star, PlusCircle, HelpCircle } from "lucide-react";

interface BottomNavProps {
  onFiltroTopAvaliados?: () => void;
  onIrParaInicio?: () => void;
}

export function BottomNav({ onFiltroTopAvaliados, onIrParaInicio }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 py-1.5 px-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {/* Início */}
        <Link
          href="/"
          onClick={() => {
            if (onIrParaInicio) onIrParaInicio();
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 text-[11px] font-medium transition-colors ${
            pathname === "/" ? "text-emerald-700 font-bold" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Início</span>
        </Link>

        {/* Top Avaliados */}
        {pathname === "/" && onFiltroTopAvaliados ? (
          <button
            type="button"
            onClick={onFiltroTopAvaliados}
            className="flex flex-col items-center gap-0.5 py-1 px-3 text-[11px] font-medium text-gray-500 hover:text-emerald-700 transition-colors cursor-pointer"
          >
            <Star className="w-5 h-5 text-amber-500" />
            <span>Top Avaliados</span>
          </button>
        ) : (
          <Link
            href="/"
            className="flex flex-col items-center gap-0.5 py-1 px-3 text-[11px] font-medium text-gray-500 hover:text-emerald-700 transition-colors"
          >
            <Star className="w-5 h-5 text-amber-500" />
            <span>Top Avaliados</span>
          </Link>
        )}

        {/* Botão Central: + Indicar */}
        <Link
          href="/cadastrar"
          className="flex flex-col items-center -mt-4 group"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-600 group-hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 group-active:scale-95 transition-all">
            <PlusCircle className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-bold text-emerald-800 mt-0.5">Indicar</span>
        </Link>

        {/* Como Funciona */}
        <Link
          href="/sobre"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 text-[11px] font-medium transition-colors ${
            pathname === "/sobre" ? "text-emerald-700 font-bold" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <HelpCircle className="w-5 h-5" />
          <span>Ajuda</span>
        </Link>
      </div>
    </nav>
  );
}
