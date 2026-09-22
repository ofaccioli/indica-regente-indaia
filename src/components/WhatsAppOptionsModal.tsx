"use client";

import React, { useState } from "react";
import { X, MessageCircle, FileText, AlertCircle, HelpCircle, ExternalLink } from "lucide-react";
import { Servico } from "@/types";
import { limparTelefone } from "@/lib/utils";

interface WhatsAppOptionsModalProps {
  servico: Servico;
  isOpen: boolean;
  onClose: () => void;
}

export function WhatsAppOptionsModal({
  servico,
  isOpen,
  onClose,
}: WhatsAppOptionsModalProps) {
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<"orcamento" | "urgente" | "duvida">("orcamento");
  const [telefoneEscolhido, setTelefoneEscolhido] = useState<string>(servico.telefone);

  // Sincroniza telefone quando o servico mudar
  React.useEffect(() => {
    setTelefoneEscolhido(servico.telefone);
  }, [servico]);

  if (!isOpen) return null;

  const telFinal = telefoneEscolhido || servico.telefone;
  let digitos = limparTelefone(telFinal);
  if (!digitos.startsWith("55")) {
    digitos = `55${digitos}`;
  }

  const getMensagem = () => {
    switch (opcaoSelecionada) {
      case "urgente":
        return `Olá ${servico.nome}! Peguei seu contato no app *Indica Jd.Regente - Indaiatuba*. Preciso de um *atendimento urgente* para serviço de *${servico.categoria}*. Você teria disponibilidade hoje?`;
      case "duvida":
        return `Olá ${servico.nome}! Vi sua indicação no app *Indica Jd.Regente - Indaiatuba* para *${servico.categoria}* e gostaria de tirar uma dúvida sobre seus serviços.`;
      case "orcamento":
      default:
        return `Olá ${servico.nome}! Peguei seu contato no app *Indica Jd.Regente - Indaiatuba* na categoria *${servico.categoria}*. Gostaria de solicitar um orçamento para um serviço aqui no bairro.`;
    }
  };

  const handleEnviar = () => {
    const url = `https://wa.me/${digitos}?text=${encodeURIComponent(getMensagem())}`;
    window.open(url, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Topo do Modal */}
        <div className="bg-emerald-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-emerald-200 fill-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">Chamar no WhatsApp</h3>
              <p className="text-[11px] text-emerald-200 truncate max-w-[200px]">{servico.nome}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-full hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo com Opções */}
        <div className="p-4 space-y-3">
          {/* Seletor de Telefone (se houver 2 telefones) */}
          {servico.telefone_secundario && (
            <div className="bg-gray-50 p-2.5 rounded-2xl border border-gray-200">
              <label className="block text-[11px] font-bold text-gray-700 mb-1.5">
                Enviar WhatsApp para qual número?
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setTelefoneEscolhido(servico.telefone)}
                  className={`py-1.5 px-2 rounded-xl font-bold border transition-all text-center ${
                    telefoneEscolhido === servico.telefone
                      ? "bg-emerald-700 text-white border-emerald-700 shadow-2xs"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <span className="block text-[10px] opacity-80">Principal</span>
                  <span className="truncate">{servico.telefone}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTelefoneEscolhido(servico.telefone_secundario!)}
                  className={`py-1.5 px-2 rounded-xl font-bold border transition-all text-center ${
                    telefoneEscolhido === servico.telefone_secundario
                      ? "bg-emerald-700 text-white border-emerald-700 shadow-2xs"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <span className="block text-[10px] opacity-80">2º Número</span>
                  <span className="truncate">{servico.telefone_secundario}</span>
                </button>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500 font-medium">
            Escolha como prefere iniciar a conversa:
          </p>

          {/* Opção 1: Orçamento */}
          <button
            type="button"
            onClick={() => setOpcaoSelecionada("orcamento")}
            className={`w-full p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
              opcaoSelecionada === "orcamento"
                ? "border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-500"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold text-gray-900 block">Solicitar Orçamento</span>
              <span className="text-[11px] text-gray-500 leading-tight block mt-0.5">
                Pede cotação de preço e disponibilidade para o serviço
              </span>
            </div>
          </button>

          {/* Opção 2: Atendimento Urgente */}
          <button
            type="button"
            onClick={() => setOpcaoSelecionada("urgente")}
            className={`w-full p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
              opcaoSelecionada === "urgente"
                ? "border-amber-500 bg-amber-50/70 ring-1 ring-amber-500"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold text-gray-900 block">🚨 Atendimento Urgente</span>
              <span className="text-[11px] text-gray-500 leading-tight block mt-0.5">
                Para emergências, fins de semana ou consertos para hoje
              </span>
            </div>
          </button>

          {/* Opção 3: Dúvida Rápida */}
          <button
            type="button"
            onClick={() => setOpcaoSelecionada("duvida")}
            className={`w-full p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
              opcaoSelecionada === "duvida"
                ? "border-sky-500 bg-sky-50/70 ring-1 ring-sky-500"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center flex-shrink-0 mt-0.5">
              <HelpCircle className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold text-gray-900 block">Tirar uma Dúvida</span>
              <span className="text-[11px] text-gray-500 leading-tight block mt-0.5">
                Pergunta sobre horários, tipos de atendimento ou localização
              </span>
            </div>
          </button>

          {/* Preview da Mensagem */}
          <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200/80 text-[11px] text-gray-600 italic">
            &ldquo;{getMensagem()}&rdquo;
          </div>

          {/* Botão de Envio */}
          <button
            onClick={handleEnviar}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Abrir Conversa no WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </button>
        </div>
      </div>
    </div>
  );
}
