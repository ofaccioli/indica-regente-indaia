"use client";

import React, { useState } from "react";
import {
  X,
  Trash2,
  Recycle,
  Truck,
  Apple,
  MapPin,
  Clock,
  Calendar,
  AlertCircle,
  ExternalLink,
  PhoneCall,
} from "lucide-react";

interface ColetaLixoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ColetaLixoModal({ isOpen, onClose }: ColetaLixoModalProps) {
  const [aba, setAba] = useState<"lixo" | "reciclavel" | "catabagulho" | "feiras">("lixo");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700/80 border border-emerald-500/40 flex items-center justify-center text-white shadow-inner">
              <Truck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black leading-tight text-white flex items-center gap-2">
                <span>Coleta de Lixo & Feiras</span>
              </h2>
              <p className="text-xs text-emerald-200">
                Jd. Regente & Indaiatuba • Cronograma Comunitário
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Abas */}
        <div className="flex bg-slate-100 p-1.5 border-b border-slate-200 overflow-x-auto scrollbar-none text-xs font-bold gap-1">
          <button
            onClick={() => setAba("lixo")}
            className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              aba === "lixo"
                ? "bg-white text-emerald-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Trash2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Lixo Comum</span>
          </button>

          <button
            onClick={() => setAba("reciclavel")}
            className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              aba === "reciclavel"
                ? "bg-white text-emerald-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Recycle className="w-3.5 h-3.5 text-teal-600" />
            <span>Reciclável</span>
          </button>

          <button
            onClick={() => setAba("catabagulho")}
            className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              aba === "catabagulho"
                ? "bg-white text-emerald-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-amber-600" />
            <span>Cata-Bagulho</span>
          </button>

          <button
            onClick={() => setAba("feiras")}
            className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              aba === "feiras"
                ? "bg-white text-emerald-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Apple className="w-3.5 h-3.5 text-rose-600" />
            <span>Feiras Livres</span>
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
          {/* ABA 1: LIXO COMUM */}
          {aba === "lixo" && (
            <div className="space-y-3.5 animate-fade-in">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-emerald-950 text-sm">
                    Jd. Regente, Gran Reserve & Jd. Valença
                  </h4>
                  <p className="mt-1 text-emerald-900 font-semibold">
                    📅 <strong>Segunda, Quarta e Sexta-feira</strong>
                  </p>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    ⏰ <strong>Período Diurno (a partir das 07h00)</strong>. Recomendado colocar o lixo devidamente ensacado na noite anterior ou antes das 06h30.
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-3.5 space-y-2">
                <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  Bairros Vizinhos e Outras Regiões de Indaiatuba:
                </h5>
                <ul className="space-y-1.5 text-slate-600 text-[11px]">
                  <li>
                    • <strong>Vila Rubens, Jd. Santa Rita, Vila Avaí</strong>: Seg, Qua e Sex (Diurno).
                  </li>
                  <li>
                    • <strong>Centro & Principais Avenidas Comerciais</strong>: Segunda a Sábado (Noturno - após as 18h).
                  </li>
                  <li>
                    • <strong>Jd. Morada do Sol (Zona Sul)</strong>: Terça, Quinta e Sábado (Diurno).
                  </li>
                  <li>
                    • <strong>Itaici & Condomínios Fechados</strong>: Terça, Quinta e Sábado (Diurno).
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-[11px] text-amber-950 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Atenção ao lixo cortante:</strong> Cacos de vidro e latas devem ser embalados em caixas de papelão ou garrafas PET cortadas com aviso visível para proteger os coletores do nosso bairro.
                </span>
              </div>
            </div>
          )}

          {/* ABA 2: RECICLÁVEL */}
          {aba === "reciclavel" && (
            <div className="space-y-3.5 animate-fade-in">
              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3.5 flex items-start gap-2.5">
                <Recycle className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-teal-950 text-sm">
                    Coleta Seletiva no Jd. Regente
                  </h4>
                  <p className="mt-1 text-teal-900 font-semibold">
                    📅 <strong>Quinta-feira (Período da Manhã)</strong>
                  </p>
                  <p className="text-[11px] text-teal-800 mt-0.5">
                    O caminhão da coleta seletiva (Corbélia / Prefeitura) recolhe materiais recicláveis secos toda quinta-feira.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-emerald-800 block mb-1">✅ Pode Reciclar:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Papelão, folhas, garrafas PET, latinhas de refrigerante/cerveja, frascos de plástico limpos, embalagens longa vida (Tetra Pak).
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-rose-800 block mb-1">❌ Não Reciclar:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Papel higiênico, guardanapos sujos de gordura, fraldas, espelhos, lâmpadas fluorescentes e pilhas (levar aos ecopontos).
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-[11px] text-slate-700">
                <span>💡 <strong>Dica do Bairro:</strong> Coloque os recicláveis em sacos transparentes ou azuis para que os coletores identifiquem rapidamente na rua.</span>
              </div>
            </div>
          )}

          {/* ABA 3: CATA-BAGULHO & ECOPONTOS */}
          {aba === "catabagulho" && (
            <div className="space-y-3.5 animate-fade-in">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-amber-950 text-sm">
                    Operação Cata-Bagulho & Móveis Velhos
                  </h4>
                  <p className="mt-1 text-amber-900 text-[11px]">
                    A Prefeitura de Indaiatuba realiza mutirões periódicos pelo bairro para descarte gratuito de móveis velhos, colchões, sofás e restos de madeira.
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-3.5 space-y-2">
                <h5 className="font-bold text-slate-800">
                  📍 Ecopontos Gratuitos Mais Próximos:
                </h5>
                <div className="space-y-2 text-[11px]">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block font-bold">1. Ecoponto Jd. Olinda / Jd. Regente</strong>
                    <span className="text-slate-600">Rua Tupinambás, 305 - Jd. Olinda (Pertinho do Jd. Regente)</span>
                    <span className="block text-emerald-700 font-semibold mt-0.5">Segunda a Sábado: 07h às 19h • Domingo: 07h às 12h</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block font-bold">2. Ecoponto Jd. Morada do Sol</strong>
                    <span className="text-slate-600">Rua Teotônio Vilela, 1205</span>
                    <span className="block text-emerald-700 font-semibold mt-0.5">Segunda a Sábado: 07h às 19h</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-950 flex items-center justify-between">
                <span>Secretaria de Serviços Urbanos de Indaiatuba:</span>
                <a
                  href="tel:1938016600"
                  className="font-bold text-blue-800 hover:underline flex items-center gap-1"
                >
                  <PhoneCall className="w-3 h-3" />
                  (19) 3801-6600
                </a>
              </div>
            </div>
          )}

          {/* ABA 4: FEIRAS LIVRES */}
          {aba === "feiras" && (
            <div className="space-y-3.5 animate-fade-in">
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 flex items-start gap-2.5">
                <Apple className="w-4 h-4 text-rose-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-rose-950 text-sm">
                    Feiras Livres & Gastronômicas de Indaiatuba
                  </h4>
                  <p className="mt-0.5 text-rose-900 text-[11px]">
                    Hortifruti fresquinho, pastéis de feira, caldo de cana e artesanato perto de você.
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 font-bold">🌙 Feira Noturna do Parque Temático</strong>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Quarta-feira</span>
                  </div>
                  <span className="text-slate-600 block mt-0.5">Parque Ecológico (altura do barco) • 17h às 22h</span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 font-bold">🌙 Feira Noturna do Espaço Viber</strong>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Quinta-feira</span>
                  </div>
                  <span className="text-slate-600 block mt-0.5">Rua Almirante Tamandaré (próximo ao Cecap) • 17h às 22h</span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 font-bold">☀️ Feira Livre do Centro</strong>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">Sábado</span>
                  </div>
                  <span className="text-slate-600 block mt-0.5">Praça Prudente de Moraes • 06h às 12h</span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 font-bold">☀️ Feira Livre da Cecap</strong>
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold text-[10px]">Domingo</span>
                  </div>
                  <span className="text-slate-600 block mt-0.5">Av. Francisco de Paula Leite • 06h às 12h30</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé com Fechar */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium text-[11px]">
            Fonte: Prefeitura Municipal de Indaiatuba
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer transition active:scale-95"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
