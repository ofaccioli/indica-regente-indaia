"use client";

import React, { useState } from "react";
import { X, Send, Megaphone, AlertCircle, Loader2, HeartHandshake, HelpCircle, Gift } from "lucide-react";
import { CATEGORIAS_DISPONIVEIS, GRUPOS_BAIRROS, PedidoMural } from "@/types";
import { formatarTelefoneBR } from "@/lib/utils";
import { criarPedidoMural } from "@/lib/supabase";

interface NovoPedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPedidoCriado: (pedido: PedidoMural) => void;
}

export function NovoPedidoModal({ isOpen, onClose, onPedidoCriado }: NovoPedidoModalProps) {
  const [tipoPost, setTipoPost] = useState<"pedido" | "pet_perdido" | "desapego">("pedido");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState<string>("Eletricista");
  const [moradorNome, setMoradorNome] = useState("");
  const [bairro, setBairro] = useState("Jd. Regente");
  const [whatsapp, setWhatsapp] = useState("");
  const [urgente, setUrgente] = useState(false);
  const [ehDoacaoGratis, setEhDoacaoGratis] = useState(false);
  const [valorDesapego, setValorDesapego] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [salvando, setSalvando] = useState(false);

  if (!isOpen) return null;

  const handleTipoChange = (tipo: "pedido" | "pet_perdido" | "desapego") => {
    setTipoPost(tipo);
    if (tipo === "pet_perdido") {
      setUrgente(true);
      setCategoria("Pet Shop / Veterinário");
    } else if (tipo === "desapego") {
      setUrgente(false);
      setCategoria("Outros");
    } else {
      setUrgente(false);
      setCategoria("Eletricista");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim() || !descricao.trim() || !moradorNome.trim()) {
      alert("Por favor, preencha o título, a descrição e o seu nome/rua.");
      return;
    }

    if (tipoPost === "pet_perdido" && !whatsapp.trim()) {
      alert("Por favor, informe seu WhatsApp para que quem avistar o pet possa entrar em contato imediatamente!");
      return;
    }

    let valorFinal: string | undefined = undefined;
    if (tipoPost === "desapego") {
      valorFinal = ehDoacaoGratis ? "Doação Gratuita (Grátis)" : (valorDesapego.trim() || "A combinar");
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
        tipo_post: tipoPost,
        valor_desapego: valorFinal,
        foto_url: fotoUrl.trim() || undefined,
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
        setValorDesapego("");
        setFotoUrl("");
        setEhDoacaoGratis(false);
        setTipoPost("pedido");
      } else {
        alert(res.erro || "Falha ao publicar no mural.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao publicar. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header com estilo dinâmico */}
        <div
          className={`p-4 flex items-center justify-between text-white transition-colors ${
            tipoPost === "pet_perdido"
              ? "bg-gradient-to-r from-red-700 to-rose-600"
              : tipoPost === "desapego"
              ? "bg-gradient-to-r from-purple-800 to-indigo-700"
              : "bg-gradient-to-r from-emerald-800 to-emerald-700"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold text-base shadow-sm">
              {tipoPost === "pet_perdido" ? "🐶" : tipoPost === "desapego" ? "📦" : <Megaphone className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {tipoPost === "pet_perdido"
                  ? "Alertar Pet Perdido / Encontrado"
                  : tipoPost === "desapego"
                  ? "Publicar Desapego ou Doação"
                  : "Pedir Indicação aos Vizinhos"}
              </h3>
              <p className="text-[11px] text-white/80">Mural Comunitário do Jd. Regente & Região</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Seletor de Tipo de Postagem */}
        <div className="bg-gray-100 p-2 border-b border-gray-200 flex gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => handleTipoChange("pedido")}
            className={`flex-1 py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
              tipoPost === "pedido"
                ? "bg-white text-emerald-800 shadow-xs border border-emerald-300"
                : "text-gray-600 hover:bg-white/60"
            }`}
          >
            <Megaphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Indicação</span>
          </button>

          <button
            type="button"
            onClick={() => handleTipoChange("pet_perdido")}
            className={`flex-1 py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
              tipoPost === "pet_perdido"
                ? "bg-white text-red-700 shadow-xs border border-red-300"
                : "text-gray-600 hover:bg-white/60"
            }`}
          >
            <span>🐶 Pet Perdido</span>
          </button>

          <button
            type="button"
            onClick={() => handleTipoChange("desapego")}
            className={`flex-1 py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
              tipoPost === "desapego"
                ? "bg-white text-purple-700 shadow-xs border border-purple-300"
                : "text-gray-600 hover:bg-white/60"
            }`}
          >
            <span>📦 Desapego / Doação</span>
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 overflow-y-auto flex-1">
          {/* Título */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              {tipoPost === "pet_perdido"
                ? "Nome do Pet e Bairro onde sumiu/encontrado *"
                : tipoPost === "desapego"
                ? "O que você está desapegando ou doando? *"
                : "O que você precisa? (Título claro) *"}
            </label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder={
                tipoPost === "pet_perdido"
                  ? "Ex: Thor sumiu no Jd. Valença / Regente (Poodle branco c/ coleira)"
                  : tipoPost === "desapego"
                  ? "Ex: Bicicleta Caloi aro 26 ou Berço de madeira"
                  : "Ex: Procuro pintor caprichoso para pintar a sala"
              }
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Campos específicos de Desapego */}
          {tipoPost === "desapego" && (
            <div className="bg-purple-50/80 p-3 rounded-2xl border border-purple-200 space-y-2">
              <label className="block text-xs font-bold text-purple-950">
                Valor ou Tipo de Desapego *
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEhDoacaoGratis(!ehDoacaoGratis)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    ehDoacaoGratis
                      ? "bg-purple-600 text-white shadow-xs"
                      : "bg-white text-purple-800 border border-purple-300 hover:bg-purple-100/50"
                  }`}
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>🎁 É Doação Gratuita (R$ 0)</span>
                </button>

                {!ehDoacaoGratis && (
                  <input
                    type="text"
                    value={valorDesapego}
                    onChange={(e) => setValorDesapego(e.target.value)}
                    placeholder="Valor (Ex: R$ 80 ou A combinar)"
                    className="flex-1 px-3 py-2 rounded-xl border border-purple-300 text-xs bg-white focus:ring-2 focus:ring-purple-500 outline-none font-medium"
                  />
                )}
              </div>
            </div>
          )}

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
                Localização / Bairro *
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
              {tipoPost === "pet_perdido"
                ? "Detalhes do Pet e onde foi visto por último *"
                : tipoPost === "desapego"
                ? "Condições do item e instruções para retirada *"
                : "Detalhes do Pedido *"}
            </label>
            <textarea
              required
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder={
                tipoPost === "pet_perdido"
                  ? "Ex: Fugiu pelo portão ontem por volta das 18h perto da praça. É dócil, atende por Thor e a família está desesperada. Por favor ajudem a divulgar!"
                  : tipoPost === "desapego"
                  ? "Ex: Bicicleta usada mas em ótimo estado, pneus novos, precisa apenas lubrificar a corrente. Retirada no Jd. Regente."
                  : "Ex: Gostaria de alguém com boas recomendações para orçamento sem compromisso até sexta-feira..."
              }
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
            />
          </div>

          {/* Link para foto (opcional) para pets ou desapego */}
          {(tipoPost === "pet_perdido" || tipoPost === "desapego") && (
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Link da Foto <span className="text-gray-400 font-normal">(opcional - imagem na internet)</span>
              </label>
              <input
                type="url"
                value={fotoUrl}
                onChange={(e) => setFotoUrl(e.target.value)}
                placeholder="https://imgur.com/... ou link de imagem"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          )}

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
                Seu WhatsApp {tipoPost === "pet_perdido" ? <span className="text-red-600 font-bold">* (Obrigatório)</span> : <span className="text-gray-400 font-normal">(opcional)</span>}
              </label>
              <input
                type="text"
                required={tipoPost === "pet_perdido"}
                value={whatsapp}
                onChange={(e) => setWhatsapp(formatarTelefoneBR(e.target.value))}
                placeholder="(19) 99999-9999"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Checkbox de Urgência (para pedidos comuns ou confirmação em pets) */}
          <div className={`p-3 rounded-2xl flex items-center gap-3 border ${
            urgente ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"
          }`}>
            <input
              type="checkbox"
              id="mural_urgente"
              checked={urgente}
              onChange={(e) => setUrgente(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded cursor-pointer accent-red-600"
            />
            <label htmlFor="mural_urgente" className="text-xs font-bold text-gray-800 cursor-pointer">
              🚨 Destacar com Alerta Urgente no Mural
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={salvando}
              className={`w-full py-3 rounded-2xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                tipoPost === "pet_perdido"
                  ? "bg-red-600 hover:bg-red-700"
                  : tipoPost === "desapego"
                  ? "bg-purple-700 hover:bg-purple-800"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {salvando ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>
                    {tipoPost === "pet_perdido"
                      ? "Publicar Alerta de Pet Perdido"
                      : tipoPost === "desapego"
                      ? "Publicar Desapego / Doação"
                      : "Publicar no Mural dos Vizinhos"}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
