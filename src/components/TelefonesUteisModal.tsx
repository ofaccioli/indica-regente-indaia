"use client";

import React, { useState, useMemo } from "react";
import {
  X,
  Phone,
  Search,
  ShieldAlert,
  Zap,
  Droplets,
  HeartPulse,
  Flame,
  Dog,
  Building2,
  ExternalLink,
  MessageCircle,
} from "lucide-react";

interface TelefoneItem {
  nome: string;
  descricao: string;
  numero: string;
  numeroDiscagem: string;
  whatsapp?: string;
  categoria: "emergencia" | "servicos" | "saude" | "outros";
  icone: any;
  corBadge: string;
}

const TELEFONES_INDAIATUBA: TelefoneItem[] = [
  // Emergência
  {
    nome: "GCM - Guarda Civil Municipal",
    descricao: "Patrulhamento, denúncias e ocorrências em Indaiatuba",
    numero: "153",
    numeroDiscagem: "153",
    categoria: "emergencia",
    icone: ShieldAlert,
    corBadge: "bg-red-50 text-red-700 border-red-200",
  },
  {
    nome: "SAMU Emergência",
    descricao: "Ambulância e atendimento médico de urgência pré-hospitalar",
    numero: "192",
    numeroDiscagem: "192",
    categoria: "emergencia",
    icone: HeartPulse,
    corBadge: "bg-red-50 text-red-700 border-red-200",
  },
  {
    nome: "Corpo de Bombeiros",
    descricao: "Incêndios, resgates, vazamentos e acidentes graves",
    numero: "193",
    numeroDiscagem: "193",
    categoria: "emergencia",
    icone: Flame,
    corBadge: "bg-red-50 text-red-700 border-red-200",
  },
  {
    nome: "Polícia Militar",
    descricao: "Ocorrências e viaturas da PM",
    numero: "190",
    numeroDiscagem: "190",
    categoria: "emergencia",
    icone: ShieldAlert,
    corBadge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    nome: "Defesa Civil Indaiatuba",
    descricao: "Queda de árvores, alagamentos e riscos estruturais",
    numero: "199 ou (19) 3894-6220",
    numeroDiscagem: "199",
    categoria: "emergencia",
    icone: ShieldAlert,
    corBadge: "bg-amber-50 text-amber-700 border-amber-200",
  },

  // Concessionárias & Serviços Públicos
  {
    nome: "SAAE - Água & Esgoto",
    descricao: "Plantão 24h para vazamentos na rua e falta de água",
    numero: "0800 77 22 195",
    numeroDiscagem: "08007722195",
    whatsapp: "1938349400",
    categoria: "servicos",
    icone: Droplets,
    corBadge: "bg-sky-50 text-sky-700 border-sky-200",
  },
  {
    nome: "CPFL Piratininga - Energia",
    descricao: "Falta de luz, fios caídos e emergências elétricas",
    numero: "0800 010 2570",
    numeroDiscagem: "08000102570",
    whatsapp: "19999088888",
    categoria: "servicos",
    icone: Zap,
    corBadge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    nome: "Prefeitura de Indaiatuba",
    descricao: "Central de Serviços e Atendimento ao Cidadão",
    numero: "(19) 3834-9000",
    numeroDiscagem: "1938349000",
    categoria: "servicos",
    icone: Building2,
    corBadge: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    nome: "Sou Indaiatuba (Ônibus)",
    descricao: "Horários, itinerários e SAC do transporte coletivo",
    numero: "0800 770 3888",
    numeroDiscagem: "08007703888",
    categoria: "servicos",
    icone: Building2,
    corBadge: "bg-slate-50 text-slate-700 border-slate-200",
  },

  // Saúde
  {
    nome: "UPA - Jardim Morada do Sol",
    descricao: "Pronto-atendimento municipal 24 horas",
    numero: "(19) 3936-5400",
    numeroDiscagem: "1939365400",
    categoria: "saude",
    icone: HeartPulse,
    corBadge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    nome: "HAOC - Hospital Augusto de Oliveira Camargo",
    descricao: "Pronto-Socorro Geral e Hospitalar de Indaiatuba",
    numero: "(19) 3801-8200",
    numeroDiscagem: "1938018200",
    categoria: "saude",
    icone: HeartPulse,
    corBadge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },

  // Outros & Causa Animal
  {
    nome: "CRA - Centro de Reabilitação Animal",
    descricao: "Resgate de animais de rua atropelados ou em risco e zoonoses",
    numero: "(19) 3894-5530",
    numeroDiscagem: "1938945530",
    categoria: "outros",
    icone: Dog,
    corBadge: "bg-teal-50 text-teal-700 border-teal-200",
  },
];

interface TelefonesUteisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TelefonesUteisModal({ isOpen, onClose }: TelefonesUteisModalProps) {
  const [busca, setBusca] = useState("");
  const [abaCategoria, setAbaCategoria] = useState<"todos" | "emergencia" | "servicos" | "saude">("todos");

  const telefonesFiltrados = useMemo(() => {
    return TELEFONES_INDAIATUBA.filter((item) => {
      const matchAba = abaCategoria === "todos" || item.categoria === abaCategoria;
      const matchBusca =
        !busca.trim() ||
        item.nome.toLowerCase().includes(busca.toLowerCase()) ||
        item.descricao.toLowerCase().includes(busca.toLowerCase()) ||
        item.numero.includes(busca);
      return matchAba && matchBusca;
    });
  }, [busca, abaCategoria]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-4 sm:p-5 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  Telefones Úteis & Emergência
                </h2>
                <p className="text-xs text-red-100 font-medium">
                  Indaiatuba / Região do Jd. Regente
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Campo de Busca */}
          <div className="mt-3.5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome, número ou serviço..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white text-slate-800 placeholder-slate-400 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>
        </div>

        {/* Filtro por categoria */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 border-b border-slate-100 overflow-x-auto text-xs font-semibold scrollbar-none">
          <button
            onClick={() => setAbaCategoria("todos")}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${
              abaCategoria === "todos"
                ? "bg-slate-800 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            Todos ({TELEFONES_INDAIATUBA.length})
          </button>
          <button
            onClick={() => setAbaCategoria("emergencia")}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 flex items-center gap-1 ${
              abaCategoria === "emergencia"
                ? "bg-red-600 text-white"
                : "bg-white text-red-700 border border-red-200 hover:bg-red-50"
            }`}
          >
            🚨 Emergências
          </button>
          <button
            onClick={() => setAbaCategoria("servicos")}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 flex items-center gap-1 ${
              abaCategoria === "servicos"
                ? "bg-sky-600 text-white"
                : "bg-white text-sky-700 border border-sky-200 hover:bg-sky-50"
            }`}
          >
            💧⚡ SAAE / CPFL
          </button>
          <button
            onClick={() => setAbaCategoria("saude")}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 flex items-center gap-1 ${
              abaCategoria === "saude"
                ? "bg-emerald-600 text-white"
                : "bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
            }`}
          >
            🏥 Saúde / UPA
          </button>
        </div>

        {/* Lista de Contatos */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 divide-y divide-slate-100">
          {telefonesFiltrados.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              Nenhum telefone encontrado para "{busca}".
            </div>
          ) : (
            telefonesFiltrados.map((item, index) => {
              const Icone = item.icone;
              return (
                <div
                  key={index}
                  className="pt-2.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${item.corBadge}`}>
                      <Icone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm">
                          {item.nome}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        {item.descricao}
                      </p>
                      <span className="inline-block mt-1 text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {item.numero}
                      </span>
                    </div>
                  </div>

                  {/* Ações de discagem rápida */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {item.whatsapp && (
                      <a
                        href={`https://wa.me/55${item.whatsapp}?text=Ol%C3%A1%2C+preciso+de+informa%C3%A7%C3%B5es+de+atendimento.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                        title="Abrir WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Whats</span>
                      </a>
                    )}
                    <a
                      href={`tel:${item.numeroDiscagem}`}
                      className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm active:scale-95"
                      title={`Ligar para ${item.numero}`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Ligar</span>
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            📍 Números de utilidade pública de Indaiatuba-SP
          </span>
          <button
            onClick={onClose}
            className="font-semibold text-slate-700 hover:text-slate-900 px-3 py-1 bg-white border border-slate-200 rounded-lg"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
