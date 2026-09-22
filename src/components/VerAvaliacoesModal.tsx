"use client";

import React, { useEffect, useState } from "react";
import { X, Star, MessageSquare, ThumbsUp, UserCheck, PlusCircle, Calendar } from "lucide-react";
import { Servico, Avaliacao } from "@/types";
import { listarAvaliacoesPorServico } from "@/lib/supabase";

interface VerAvaliacoesModalProps {
  servico: Servico | null;
  isOpen: boolean;
  onClose: () => void;
  onAvaliarClick: () => void;
}

export function VerAvaliacoesModal({
  servico,
  isOpen,
  onClose,
  onAvaliarClick,
}: VerAvaliacoesModalProps) {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!isOpen || !servico) return;

    let cancelado = false;
    setCarregando(true);

    listarAvaliacoesPorServico(servico.id)
      .then((res) => {
        if (!cancelado) {
          setAvaliacoes(res);
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar avaliações:", err);
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [isOpen, servico]);

  if (!isOpen || !servico) return null;

  const total = servico.total_avaliacoes || avaliacoes.length;
  const nota = servico.nota_media || 5.0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-4 sm:p-5 relative">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0 mt-0.5">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">
                  Avaliações da Vizinhança
                </span>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
                  {servico.nome}
                </h2>
                <p className="text-xs text-emerald-100 mt-0.5">
                  {servico.categoria} • {servico.cidade_bairro}
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

          {/* Resumo de Avaliações */}
          <div className="mt-4 bg-white/10 backdrop-blur-md rounded-xl p-3 flex items-center justify-between border border-white/20">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-black text-amber-300">
                {nota.toFixed(1)}
              </div>
              <div>
                <div className="flex items-center gap-0.5 text-amber-300">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= Math.round(nota)
                          ? "fill-amber-300 text-amber-300"
                          : "text-white/30"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-white/90 mt-0.5">
                  Baseado em <strong>{total}</strong> {total === 1 ? "indicação" : "indicações"}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onAvaliarClick();
              }}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs rounded-lg transition shadow-sm flex items-center gap-1.5 active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Avaliar</span>
            </button>
          </div>
        </div>

        {/* Lista de Avaliações / Depoimentos */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {carregando ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Buscando depoimentos dos vizinhos...
            </div>
          ) : avaliacoes.length === 0 ? (
            <div className="py-10 px-4 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <UserCheck className="w-10 h-10 text-emerald-500/50 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">
                Profissional Recomendado na Vizinhança
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                Este profissional possui {total} indicações diretas no bairro. Seja o primeiro a escrever um depoimento com detalhes sobre o serviço!
              </p>
              <button
                onClick={() => {
                  onClose();
                  onAvaliarClick();
                }}
                className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition shadow-sm"
              >
                Escrever Primeira Avaliação
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>O que os vizinhos dizem ({avaliacoes.length}):</span>
              </div>

              {avaliacoes.map((av) => (
                <div
                  key={av.id}
                  className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3 text-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                        {av.nome_avaliador.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-slate-900">
                        {av.nome_avaliador}
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${
                            s <= av.nota
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {av.comentario && (
                    <p className="text-xs text-slate-600 leading-relaxed italic bg-white p-2.5 rounded-lg border border-slate-100">
                      "{av.comentario}"
                    </p>
                  )}

                  <div className="flex items-center gap-1 text-[10px] text-slate-400 justify-end pt-0.5">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(av.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onAvaliarClick();
            }}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Avaliar este profissional</span>
          </button>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
