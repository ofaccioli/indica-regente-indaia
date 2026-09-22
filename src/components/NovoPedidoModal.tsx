"use client";

import React, { useState } from "react";
import { X, Send, Megaphone, AlertCircle, Loader2 } from "lucide-react";
import { CATEGORIAS_DISPONIVEIS, BAIRROS_INDAIATUBA, GRUPOS_BAIRROS, PedidoMural } from "@/types";
import { formatarTelefoneBR } from "@/lib/utils";
import { criarPedidoMural } from "@/lib/supabase";

interface NovoPedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPedidoCriado: (pedido: PedidoMural) => void;
}

export function NovoPedidoModal({ isOpen, onClose, onPedidoCriado }: NovoPedidoModalProps) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState<string>("Eletricista");
  const [moradorNome, setMoradorNome] = useState("");
  const [bairro, setBairro] = useState("Jd. Regente");
  const [whatsapp, setWhatsapp] = useState("");
  const [urgente, setUrgente] = useState(false);
  const [salvando, setSalvando] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim() || !descricao.trim() || !moradorNome.trim()) {
      alert("Por favor, preencha o título, a descrição e o seu nome/rua.");
      return;
    }

    setSalvando(true);
    try {
      const res = await criarPedidoMural({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        categoria,
        morador_nome: moradorNome.trim(),
        bairro,
        whatsapp_contato: whatsapp.trim() || undefined,
        urgente,
        status: "aberto",
      });

      if (res.sucesso && res.pedido) {
        onPedidoCriado(res.pedido);
        onClose();
        // Limpar campos
        setTitulo("");
        setDescricao("");
        setMoradorNome("");
        setWhatsapp("");
        setUrgente(false);
      } else {
        alert(res.erro || "Falha ao publicar pedido.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao publicar pedido. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Pedir Indicação aos Vizinhos</h3>
              <p className="text-[11px] text-emerald-200">Mural Comunitário do Jd. Regente</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              O que você precisa? (Título claro) *
            </label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Procuro pintor caprichoso para pintar a sala"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Categoria *
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium"
              >
                {CATEGORIAS_DISPONIVEIS.filter((c) => c !== "Todos").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Seu Bairro *
              </label>
              <select
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium"
              >
                {GRUPOS_BAIRROS.map((grupo) => (
                  <optgroup key={grupo.nome} label={grupo.nome}>
                    {grupo.bairros.map((b) => (
                      <option key={b} value={b}>
                        {b === "Jd. Regente" ? "⭐ Jd. Regente (Principal)" : b}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              Detalhes do Pedido *
            </label>
            <textarea
              required
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Gostaria de alguém com boas recomendações para orçamento sem compromisso até sexta-feira..."
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Seu Nome ou Rua *
              </label>
              <input
                type="text"
                required
                value={moradorNome}
                onChange={(e) => setMoradorNome(e.target.value)}
                placeholder="Ex: Mariana (Rua 5)"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Seu WhatsApp <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(formatarTelefoneBR(e.target.value))}
                placeholder="(19) 99999-9999"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Checkbox de Urgência */}
          <div className="bg-red-50/80 border border-red-200 p-3 rounded-2xl flex items-center gap-3">
            <input
              type="checkbox"
              id="mural_urgente"
              checked={urgente}
              onChange={(e) => setUrgente(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded cursor-pointer accent-red-600"
            />
            <label htmlFor="mural_urgente" className="text-xs text-red-950 font-bold cursor-pointer">
              🚨 É urgente? (Vazamento, curto-circuito, problema imediato)
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={salvando}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {salvando ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Publicar no Mural dos Vizinhos</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
