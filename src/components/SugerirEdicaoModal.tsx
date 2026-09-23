"use client";

import React from "react";
import { X, MessageCircle, Edit3, ShieldCheck, PhoneCall, HelpCircle } from "lucide-react";
import { Servico } from "@/types";

interface SugerirEdicaoModalProps {
  servico: Servico | null;
  isOpen: boolean;
  onClose: () => void;
  onAbrirEdicaoDireta?: () => void;
  podeEditarDireto?: boolean;
}

export function SugerirEdicaoModal({
  servico,
  isOpen,
  onClose,
  onAbrirEdicaoDireta,
  podeEditarDireto = false,
}: SugerirEdicaoModalProps) {
  if (!isOpen || !servico) return null;

  const textoWhatsApp = encodeURIComponent(
    `Olá Otavio! Peguei seu contato pelo app *Indica Jd. Regente*.\n` +
      `Gostaria de solicitar uma atualização de dados no cadastro de: *${servico.nome}* (${servico.categoria}).\n` +
      `Seguem as informações atualizadas:`
  );

  // Contato do desenvolvedor / moderador (Otavio Faccioli - 19 99395-2651)
  const zapModeradorUrl = `https://wa.me/5519993952651?text=${textoWhatsApp}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Edit3 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">Atualizar Cadastro</h2>
              <p className="text-xs text-slate-300 truncate max-w-[240px]">{servico.nome}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 text-xs text-slate-700">
          <p className="text-slate-600 leading-relaxed">
            Deseja atualizar telefone, horário de atendimento, fotos ou alguma informação de <strong>{servico.nome}</strong>?
          </p>

          {/* Opção 1: Se este aparelho foi quem cadastrou */}
          {podeEditarDireto && onAbrirEdicaoDireta && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Você cadastrou este serviço neste aparelho!</span>
              </div>
              <p className="text-emerald-800 text-[11px] leading-relaxed">
                Você tem permissão para editar todas as informações, fotos e horários diretamente agora mesmo.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onAbrirEdicaoDireta();
                }}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-xs"
              >
                <Edit3 className="w-4 h-4" />
                <span>Abrir Editor de Cadastro</span>
              </button>
            </div>
          )}

          {/* Opção 2: Falar com o Moderador / Otávio pelo WhatsApp */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>É o proprietário ou vizinho? Fale com a moderação:</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Envie uma mensagem direta no WhatsApp para <strong>Otavio Faccioli</strong> (19 99395-2651) com o que precisa ser corrigido (telefone, horário, remoção ou fotos). A atualização é feita de imediato!
            </p>
            <a
              href={zapModeradorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition active:scale-95 shadow-xs"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Solicitar Correção no WhatsApp</span>
            </a>
          </div>

          {/* E-mail alternativo */}
          <div className="text-center text-[11px] text-slate-400">
            Ou se preferir, envie para:{" "}
            <a
              href={`mailto:otavio.faccioli@gmail.com?subject=Atualização de Serviço: ${encodeURIComponent(servico.nome)}`}
              className="text-emerald-700 font-bold hover:underline"
            >
              otavio.faccioli@gmail.com
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 font-semibold text-xs"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
