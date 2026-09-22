"use client";

import React from "react";
import {
  X,
  Trash2,
  Recycle,
  Truck,
  AlertCircle,
  Calendar,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
} from "lucide-react";

interface ColetaLixoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ColetaLixoModal({ isOpen, onClose }: ColetaLixoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-800 text-white p-4 sm:p-5 relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0">
                <Recycle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  Coleta de Lixo & Reciclagem
                </h2>
                <p className="text-xs text-emerald-100 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-300" />
                  Jd. Regente, Valença & Bairros Vizinhos
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition shrink-0"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-slate-800">
          {/* Card Lixo Orgânico / Comum */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Lixo Comum & Orgânico (Corpus)
                  </h3>
                  <span className="text-[11px] text-slate-500">Resíduos domésticos e restos</span>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-slate-200 text-slate-800 rounded-full text-[11px] font-bold">
                Diurno
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">Dias de Coleta</p>
                  <p className="text-slate-600 text-[11px]">Seg, Qua e Sex</p>
                </div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">Horário</p>
                  <p className="text-slate-600 text-[11px]">A partir das 07h00</p>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              💡 <em>Coloque o lixo na lixeira alta ou lixeira de calçada até as 07h para evitar que animais rasguem os sacos.</em>
            </p>
          </div>

          {/* Card Coleta Seletiva / Reciclável */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <Recycle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-950">
                    Coleta Seletiva (Recicláveis)
                  </h3>
                  <span className="text-[11px] text-emerald-700">Plástico, papelão, metal e vidro</span>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold">
                1x por semana
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">Dia no Bairro</p>
                  <p className="text-emerald-800 font-semibold text-[11px]">Quintas-feiras</p>
                </div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">Período</p>
                  <p className="text-emerald-800 font-semibold text-[11px]">Tarde (a partir das 13h)</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-emerald-100 text-[11px] text-slate-600 space-y-1">
              <p className="font-bold text-emerald-900 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                O que colocar no saco de recicláveis:
              </p>
              <p>• Caixas de leite e papelão secos e dobrados</p>
              <p>• Garrafas PET e potes plásticos enxaguados</p>
              <p>• Vidros: ⚠️ Embale bem em jornal/caixa e identifique para a segurança dos coletores</p>
            </div>
          </div>

          {/* Card Cata-Bagulho e Ecopontos */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-950">
                  Operação Cata-Bagulho & Ecoponto
                </h3>
                <span className="text-[11px] text-amber-800">Móveis velhos, colchões e podas</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              A Prefeitura de Indaiatuba disponibiliza a coleta programada de grandes volumes e Ecopontos públicos distribuídos pela cidade.
            </p>

            <div className="bg-white p-3 rounded-xl border border-amber-200/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Secretaria de Serviços Urbanos
                </p>
                <p className="text-[11px] text-slate-500">
                  Agendamento e dúvidas de cronograma
                </p>
              </div>
              <a
                href="tel:08007707702"
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>0800 770 7702</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            🌱 Mantenha nosso bairro limpo e sustentável!
          </span>
          <button
            onClick={onClose}
            className="font-semibold text-slate-700 hover:text-slate-900 px-3 py-1 bg-white border border-slate-200 rounded-lg"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
