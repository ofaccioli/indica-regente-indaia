"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  MessageCircle,
  FileText,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Car,
  Plane,
  Truck,
  Tag,
} from "lucide-react";
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
  const isTransporte = servico.categoria === "Uber / Táxi / Motorista";
  const isFrete = servico.categoria === "Fretes / Mudanças";
  const temOferta = Boolean(servico.oferta_vizinho);

  const getOpcaoPadrao = () => {
    if (isTransporte) return "corrida";
    if (isFrete) return "frete";
    return "orcamento";
  };

  const [opcaoSelecionada, setOpcaoSelecionada] = useState<string>(getOpcaoPadrao());
  const [telefoneEscolhido, setTelefoneEscolhido] = useState<string>(servico.telefone);

  // Sincroniza estado quando o servico mudar
  useEffect(() => {
    setTelefoneEscolhido(servico.telefone);
    setOpcaoSelecionada(getOpcaoPadrao());
  }, [servico]);

  if (!isOpen) return null;

  const telFinal = telefoneEscolhido || servico.telefone;
  let digitos = limparTelefone(telFinal);
  if (!digitos.startsWith("55")) {
    digitos = `55${digitos}`;
  }

  const getMensagem = () => {
    if (isTransporte) {
      switch (opcaoSelecionada) {
        case "viracopos":
          return `Olá ${servico.nome}! Peguei seu contato pelo app *Indica Jd.Regente*. Gostaria de consultar o valor e disponibilidade para traslado até o Aeroporto de Viracopos (Campinas) saindo do Jd. Regente.`;
        case "duvida":
          return `Olá ${servico.nome}! Vi sua indicação de motorista no app *Indica Jd.Regente*. Você costuma atender corridas no bairro e região? Gostaria de tirar uma dúvida sobre seus horários.`;
        case "oferta":
          return `Olá ${servico.nome}! Vi no app *Indica Jd.Regente* sua condição especial para moradores: "${servico.oferta_vizinho}". Gostaria de agendar uma corrida aproveitando essa condição!`;
        case "corrida":
        default:
          return `Olá ${servico.nome}! Peguei seu contato pelo app *Indica Jd.Regente - Indaiatuba*. Gostaria de consultar disponibilidade para uma corrida/viagem saindo do Jd. Regente para [Destino]. Poderia me informar o valor?`;
      }
    }

    if (isFrete) {
      switch (opcaoSelecionada) {
        case "mudanca":
          return `Olá ${servico.nome}! Peguei seu contato no app *Indica Jd.Regente*. Gostaria de solicitar um orçamento para mudança residencial saindo do Jd. Regente. Você possui ajudantes inclusos?`;
        case "urgente":
          return `Olá ${servico.nome}! Vi sua indicação no app *Indica Jd.Regente*. Preciso de um frete/carreto com urgência para hoje. Você teria disponibilidade?`;
        case "oferta":
          return `Olá ${servico.nome}! Vi no app *Indica Jd.Regente* sua condição especial para vizinhos: "${servico.oferta_vizinho}". Gostaria de solicitar um frete aproveitando esse desconto!`;
        case "frete":
        default:
          return `Olá ${servico.nome}! Peguei seu contato pelo app *Indica Jd.Regente - Indaiatuba*. Gostaria de pedir um orçamento para um frete/carreto saindo do Jd. Regente.`;
      }
    }

    // Padrão para outros serviços
    switch (opcaoSelecionada) {
      case "urgente":
        return `Olá ${servico.nome}! Peguei seu contato no app *Indica Jd.Regente - Indaiatuba*. Preciso de um *atendimento urgente* para serviço de *${servico.categoria}*. Você teria disponibilidade hoje?`;
      case "duvida":
        return `Olá ${servico.nome}! Vi sua indicação no app *Indica Jd.Regente - Indaiatuba* para *${servico.categoria}* e gostaria de tirar uma dúvida sobre seus serviços.`;
      case "oferta":
        return `Olá ${servico.nome}! Vi no app *Indica Jd.Regente* sua condição especial para vizinhos: "${servico.oferta_vizinho}". Gostaria de contratar o serviço aproveitando essa condição especial!`;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Topo do Modal */}
        <div className="bg-emerald-700 text-white p-4 flex items-center justify-between flex-shrink-0">
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
        <div className="p-4 space-y-3 overflow-y-auto">
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
            Escolha a mensagem que deseja enviar:
          </p>

          {/* Opção Condição Especial para Morador (quando existir) */}
          {temOferta && (
            <button
              type="button"
              onClick={() => setOpcaoSelecionada("oferta")}
              className={`w-full p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                opcaoSelecionada === "oferta"
                  ? "border-amber-500 bg-amber-50/80 ring-1 ring-amber-500"
                  : "border-amber-200 bg-amber-50/30 hover:bg-amber-50/60"
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Tag className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-black text-amber-950 block">🏷️ Aproveitar Oferta de Morador</span>
                <span className="text-[11px] text-amber-800 leading-tight block mt-0.5">
                  &ldquo;{servico.oferta_vizinho}&rdquo;
                </span>
              </div>
            </button>
          )}

          {/* Opções Personalizadas para UBER / TÁXI */}
          {isTransporte && (
            <>
              <button
                type="button"
                onClick={() => setOpcaoSelecionada("corrida")}
                className={`w-full p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                  opcaoSelecionada === "corrida"
                    ? "border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-500"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Car className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-gray-900 block">🚗 Agendar Corrida / Viagem</span>
                  <span className="text-[11px] text-gray-500 leading-tight block mt-0.5">
                    Consultar valor e disponibilidade saindo do Jd. Regente
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setOpcaoSelecionada("viracopos")}
                className={`w-full p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                  opcaoSelecionada === "viracopos"
                    ? "border-sky-500 bg-sky-50/70 ring-1 ring-sky-500"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Plane className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-gray-900 block">✈️ Traslado Aeroporto Viracopos</span>
                  <span className="text-[11px] text-gray-500 leading-tight block mt-0.5">
                    Valor e agendamento para o Aeroporto de Viracopos (Campinas)
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setOpcaoSelecionada("duvida")}
                className={`w-full p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                  opcaoSelecionada === "duvida"
                    ? "border-slate-500 bg-slate-50/70 ring-1 ring-slate-500"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-gray-900 block">Horários e Disponibilidade</span>
                  <span className="text-[11px] text-gray-500 leading-tight block mt-0.5">
                    Tirar dúvida sobre plantões e viagens particulares
                  </span>
                </div>
              </button>
            </>
          )}

          {/* Opções Personalizadas para FRETES / MUDANÇAS */}
          {isFrete && (
            <>
              <button
                type="button"
                onClick={() => setOpcaoSelecionada("frete")}
                className={`w-full p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                  opcaoSelecionada === "frete"
                    ? "border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-500"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-gray-900 block">📦 Orçamento de Frete / Carreto</span>
                  <span className="text-[11px] text-gray-500 leading-tight block mt-0.5">
                    Transporte de cargas e itens saindo do Jd. Regente
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setOpcaoSelecionada("mudanca")}
                className={`w-full p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                  opcaoSelecionada === "mudanca"
                    ? "border-sky-500 bg-sky-50/70 ring-1 ring-sky-500"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-gray-900 block">🏠 Mudança Residencial</span>
                  <span className="text-[11px] text-gray-500 leading-tight block mt-0.5">
                    Mudança com consulta sobre ajudantes inclusos
                  </span>
                </div>
              </button>

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
                  <span className="text-xs font-bold text-gray-900 block">🚨 Frete Urgente para Hoje</span>
                  <span className="text-[11px] text-gray-500 leading-tight block mt-0.5">
                    Para carretos no mesmo dia ou emergências
                  </span>
                </div>
              </button>
            </>
          )}

          {/* Opções Gerais para Demais Categorias */}
          {!isTransporte && !isFrete && (
            <>
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
            </>
          )}

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
