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
  AlertCircle,
  ExternalLink,
  PhoneCall,
  CheckCircle2,
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
            <div className="w-10 h-10 rounded-2xl bg-emerald-700/80 border border-emerald-500/40 flex items-center justify-center text-white shadow-inner flex-shrink-0">
              <Truck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black leading-tight text-white flex items-center gap-2">
                <span>Coleta de Lixo & Feiras</span>
              </h2>
              <p className="text-xs text-emerald-200">
                Jd. Regente & Indaiatuba • Informações Oficiais Corpus e Prefeitura
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer flex-shrink-0"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Abas */}
        <div className="flex bg-slate-100 p-1.5 border-b border-slate-200 overflow-x-auto scrollbar-none text-xs font-bold gap-1">
          <button
            onClick={() => setAba("lixo")}
            className={`flex-1 min-w-[105px] py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
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
            className={`flex-1 min-w-[105px] py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              aba === "reciclavel"
                ? "bg-white text-emerald-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Recycle className="w-3.5 h-3.5 text-teal-600" />
            <span>Reciclável</span>
          </button>

          <button
            onClick={() => setAba("feiras")}
            className={`flex-1 min-w-[105px] py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              aba === "feiras"
                ? "bg-white text-emerald-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Apple className="w-3.5 h-3.5 text-rose-600" />
            <span>Feiras Livres</span>
          </button>

          <button
            onClick={() => setAba("catabagulho")}
            className={`flex-1 min-w-[105px] py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              aba === "catabagulho"
                ? "bg-white text-emerald-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-amber-600" />
            <span>Cata-Bagulho</span>
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
          {/* ABA 1: LIXO COMUM */}
          {aba === "lixo" && (
            <div className="space-y-3.5 animate-fade-in">
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
                <Clock className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="inline-block px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 font-extrabold text-[10px] uppercase tracking-wide">
                    Oficial Corpus • Jardim Regente
                  </div>
                  <h4 className="font-black text-emerald-950 text-base">
                    Jardim Regente (Indaiatuba)
                  </h4>
                  <p className="text-emerald-900 font-bold text-sm">
                    📅 <strong>Terça-feira, Quinta-feira e Sábado</strong>
                  </p>
                  <p className="text-[11px] text-emerald-800">
                    ⏰ <strong>Turno Diurno (a partir das 06h00 da manhã)</strong>
                  </p>
                  <p className="text-[11px] text-slate-600 pt-1">
                    💡 <strong>Dica dos vizinhos:</strong> Coloque o lixo ensacado na lixeira da calçada antes das 06h00 ou na noite anterior para não perder a passagem do caminhão coletor da Corpus.
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-3.5 space-y-2">
                <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  Outras Regiões e Bairros de Indaiatuba:
                </h5>
                <ul className="space-y-1.5 text-slate-600 text-[11px]">
                  <li>
                    • <strong>Jd. Morada do Sol, Jd. Hubert, Parque Real</strong>: Terça, Quinta e Sábado (Diurno).
                  </li>
                  <li>
                    • <strong>Jd. Santa Rita, Jd. Oliveira Camargo, Vila Avaí</strong>: Segunda, Quarta e Sexta (Diurno).
                  </li>
                  <li>
                    • <strong>Centro, Avenidas Comerciais e Cidade Nova</strong>: Segunda a Sábado (Noturno - a partir das 17h / 18h).
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-[11px] text-amber-950 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Atenção com cacos e lâmpadas:</strong> Embale vidros quebrados dentro de caixas de leite ou garrafas PET cortadas e identifique para garantir a segurança dos garis da Corpus.
                </span>
              </div>

              <div className="text-center pt-1">
                <a
                  href="https://corpus.com.br/coletaindaiatuba"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline"
                >
                  <span>Consultar rua no site oficial da Corpus Saneamento</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
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
                    Ecoponto Subterrâneo do Jd. Regente (MecLix)
                  </h4>
                  <p className="mt-1 text-teal-900 font-semibold">
                    📍 <strong>Containers Soterrados na Praça / Área de Lazer</strong>
                  </p>
                  <p className="text-[11px] text-teal-800 mt-0.5">
                    Rua David Silvério (altura do nº 3) • <strong>Disponível 24 horas</strong>
                  </p>
                  <p className="text-[11px] text-teal-900 mt-1">
                    O Jardim Regente possui ponto fixo moderno com containers subterrâneos para descarte sustentável de recicláveis secos a qualquer momento.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-emerald-800 block mb-1">✅ Descarte Permitido:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Papelão, papéis, garrafas plásticas (PET), latinhas de alumínio, recipientes de vidro e <strong>óleo de cozinha usado</strong> (em garrafa PET bem vedada).
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-rose-800 block mb-1">❌ Não Permitido:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Lixo orgânico/comida, papel higiênico, guardanapos engordurados, espelhos, lâmpadas ou entulho.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-[11px] text-slate-700">
                <strong className="block text-slate-900 mb-0.5 font-bold">📍 Ecoponto Jd. Olinda / Jd. Regente:</strong>
                <span>Rua Tupinambás, 305 — Seg a Sáb: 07h às 19h • Dom e Feriados: 07h às 12h (recebe eletrônicos, óleo, podas e recicláveis).</span>
              </div>
            </div>
          )}

          {/* ABA 3: FEIRAS LIVRES */}
          {aba === "feiras" && (
            <div className="space-y-3.5 animate-fade-in">
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 flex items-start gap-2.5">
                <Apple className="w-4 h-4 text-rose-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-rose-950 text-sm">
                    Programação Oficial de Feiras de Indaiatuba
                  </h4>
                  <p className="mt-0.5 text-rose-900 text-[11px]">
                    Pastel de feira quentinho, caldo de cana, hortifruti fresquinho e gastronomia.
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-[11px]">
                {/* TERÇA */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                    <span className="font-black text-slate-900 text-xs">TERÇA-FEIRA</span>
                    <span className="px-2 py-0.2 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px]">Diurna & Noturna</span>
                  </div>
                  <div>
                    <span className="font-bold text-emerald-800">☀️ 06h às 12h:</span> Praça Andréa M. Bonachela (Vila Costa e Silva - entre Rua dos Indaiás e Dr. Germano Pucinelli).
                  </div>
                  <div>
                    <span className="font-bold text-indigo-800">🌙 17h às 23h (Noturna):</span> Estacionamento do Parque Ecológico (Jardim Paulista / Rua Martinho Lutero).
                  </div>
                </div>

                {/* QUARTA */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                    <span className="font-black text-slate-900 text-xs">QUARTA-FEIRA</span>
                    <span className="px-2 py-0.2 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px]">Diurna & Noturna</span>
                  </div>
                  <div>
                    <span className="font-bold text-emerald-800">☀️ 06h às 12h:</span> Rua Seraphin Gilberto Candello (Jd. Morada do Sol - entre Av. Ário Barnabé e Rua Octacílio Furlan).
                  </div>
                  <div>
                    <span className="font-bold text-indigo-800">🌙 17h às 23h (Noturna):</span> Parque Ecológico (Jd. do Vale 2 - Estacionamento do Barco / Raia de Remo, próx. Parque da Criança).
                  </div>
                </div>

                {/* QUINTA */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                    <span className="font-black text-slate-900 text-xs">QUINTA-FEIRA</span>
                    <span className="px-2 py-0.2 rounded-md bg-emerald-100 text-emerald-900 font-bold text-[10px]">Diurna</span>
                  </div>
                  <div>
                    <span className="font-bold text-emerald-800">☀️ 06h às 12h:</span> Rua Pará (Cidade Nova - Centro Esportivo) e Rua Albina Brizola Ulistka (Jd. Bom Princípio).
                  </div>
                </div>

                {/* SEXTA */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                    <span className="font-black text-slate-900 text-xs">SEXTA-FEIRA</span>
                    <span className="px-2 py-0.2 rounded-md bg-indigo-100 text-indigo-900 font-bold text-[10px]">Noturna</span>
                  </div>
                  <div>
                    <span className="font-bold text-indigo-800">🌙 17h às 23h (Noturna):</span> Praça Nelson de Almeida Rodrigues (Centro de Convenções Aydil Bonachella / Secretaria de Cultura).
                  </div>
                </div>

                {/* SÁBADO */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                    <span className="font-black text-slate-900 text-xs">SÁBADO</span>
                    <span className="px-2 py-0.2 rounded-md bg-emerald-100 text-emerald-900 font-bold text-[10px]">Diurna</span>
                  </div>
                  <div>
                    <span className="font-bold text-emerald-800">☀️ 06h às 12h:</span> Rua Francisco de Paula Cabral Vasconcelos (Jd. Morada do Sol).
                  </div>
                </div>

                {/* DOMINGO */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                    <span className="font-black text-slate-900 text-xs">DOMINGO</span>
                    <span className="px-2 py-0.2 rounded-md bg-purple-100 text-purple-900 font-bold text-[10px]">Tradicional Centro</span>
                  </div>
                  <div>
                    <span className="font-bold text-emerald-800">☀️ 06h às 12h:</span> Praça Dom Pedro II (Centro - Matriz, entre Ruas XV de Novembro, 11 de Junho e Pedro de Toledo).
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ABA 4: CATA-BAGULHO */}
          {aba === "catabagulho" && (
            <div className="space-y-3.5 animate-fade-in">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-amber-950 text-sm">
                    Operação Cata-Bagulho Municipal
                  </h4>
                  <p className="mt-1 text-amber-900 text-[11px]">
                    A Prefeitura de Indaiatuba realiza mutirões periódicos pelo bairro para recolhimento gratuito de móveis velhos, sofás, colchões e pedaços de madeira descartados na calçada.
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
        </div>

        {/* Rodapé com Fechar */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium text-[11px]">
            Fontes: Prefeitura de Indaiatuba & Corpus Saneamento
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
