"use client";

import React, { useState } from "react";
import { Star, X, CheckCircle2, HeartHandshake } from "lucide-react";
import confetti from "canvas-confetti";
import { Servico } from "@/types";
import { registrarAvaliacao } from "@/lib/supabase";

interface RatingModalProps {
  servico: Servico;
  isOpen: boolean;
  onClose: () => void;
  onAvaliacaoSalva: () => void;
}

export function RatingModal({ servico, isOpen, onClose, onAvaliacaoSalva }: RatingModalProps) {
  const [nota, setNota] = useState<number>(5);
  const [hoverNota, setHoverNota] = useState<number | null>(null);
  const [nomeAvaliador, setNomeAvaliador] = useState("");
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    try {
      const res = await registrarAvaliacao(
        servico.id,
        nomeAvaliador.trim() || "Membro da Comunidade",
        nota,
        comentario.trim()
      );

      if (res.sucesso) {
        setSucesso(true);
        // Dispara confetes comemorativos
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}

        setTimeout(() => {
          setSucesso(false);
          onAvaliacaoSalva();
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      alert("Não foi possível registrar a avaliação. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 overflow-hidden relative">
        {/* Header do modal */}
        <div className="bg-emerald-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base">Avaliar & Recomendar</h3>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-100 hover:text-white p-1 rounded-full hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sucesso ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-gray-900">Recomendação Registrada!</h4>
            <p className="text-sm text-gray-600 mt-1">
              Obrigado por ajudar nossa comunidade a ter serviços cada vez melhores e confiáveis.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                {servico.categoria}
              </p>
              <h4 className="text-base font-bold text-gray-900">{servico.nome}</h4>
            </div>

            {/* Seletor de estrelas */}
            <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 text-center">
              <label className="block text-xs font-semibold text-amber-900 mb-1.5">
                Qual nota você dá para este profissional?
              </label>
              <div className="flex justify-center items-center gap-2">
                {[1, 2, 3, 4, 5].map((estrela) => {
                  const ativa = (hoverNota !== null ? hoverNota : nota) >= estrela;
                  return (
                    <button
                      type="button"
                      key={estrela}
                      onClick={() => setNota(estrela)}
                      onMouseEnter={() => setHoverNota(estrela)}
                      onMouseLeave={() => setHoverNota(null)}
                      className="p-1 focus:outline-none transition-transform hover:scale-125 cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          ativa
                            ? "text-amber-400 fill-amber-400 drop-shadow-xs"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-amber-800 mt-1 font-medium">
                {nota === 5 && "⭐ Excelente / Super recomendo!"}
                {nota === 4 && "⭐ Muito bom serviço"}
                {nota === 3 && "⭐ Bom, atendeu o esperado"}
                {nota === 2 && "⭐ Regular"}
                {nota === 1 && "⭐ Ruim / Não recomendo"}
              </p>
            </div>

            {/* Nome do avaliador */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Seu Nome ou Apelido no grupo <span className="text-gray-400">(opcional)</span>
              </label>
              <input
                type="text"
                value={nomeAvaliador}
                onChange={(e) => setNomeAvaliador(e.target.value)}
                placeholder="Ex: Carlos (vizinho da rua 2)"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>

            {/* Comentário */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Seu comentário ou relato do serviço <span className="text-gray-400">(opcional)</span>
              </label>
              <textarea
                rows={3}
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Ex: Fez o conserto no mesmo dia, cobrou preço justo e deixou tudo limpo."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
              />
            </div>

            {/* Botões */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 active:scale-98 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={enviando}
                className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md active:scale-98 transition-all disabled:opacity-50"
              >
                {enviando ? "Salvando..." : "Enviar Avaliação"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
