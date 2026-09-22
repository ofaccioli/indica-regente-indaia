"use client";

import React, { useState } from "react";
import { X, Send, Megaphone, AlertCircle, Loader2, Gift, Dog, Tag, Camera, Image as ImageIcon, Trash2 } from "lucide-react";
import { CATEGORIAS_DISPONIVEIS, GRUPOS_BAIRROS, PedidoMural } from "@/types";
import { formatarTelefoneBR, comprimirImagemArquivo } from "@/lib/utils";
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
  const [especieAnimal, setEspecieAnimal] = useState<string>("Cachorro");
  const [categoriaDesapego, setCategoriaDesapego] = useState<string>("Móveis & Casa");
  const [moradorNome, setMoradorNome] = useState("");
  const [bairro, setBairro] = useState("Jd. Regente");
  const [whatsapp, setWhatsapp] = useState("");
  const [urgente, setUrgente] = useState(false);
  const [ehDoacaoGratis, setEhDoacaoGratis] = useState(false);
  const [valorDesapego, setValorDesapego] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [carregandoFoto, setCarregandoFoto] = useState(false);
  const [mostrarCampoUrl, setMostrarCampoUrl] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const handleFotoArquivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setCarregandoFoto(true);
      const dataUrl = await comprimirImagemArquivo(file, 800, 0.75);
      setFotoUrl(dataUrl);
    } catch (err) {
      console.error(err);
      alert("Erro ao processar imagem. Tente uma foto menor ou outro formato.");
    } finally {
      setCarregandoFoto(false);
    }
  };

  if (!isOpen) return null;

  const handleTipoChange = (tipo: "pedido" | "pet_perdido" | "desapego") => {
    setTipoPost(tipo);
    if (tipo === "pet_perdido") {
      setUrgente(true);
      setCategoria("Pet / Veterinário");
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

    // Definir categoria final de acordo com o tipo
    let categoriaFinal = categoria;
    if (tipoPost === "pet_perdido") {
      categoriaFinal = `Pet (${especieAnimal})`;
    } else if (tipoPost === "desapego") {
      categoriaFinal = `Desapego (${categoriaDesapego})`;
    }

    setSalvando(true);
    try {
      const res = await criarPedidoMural({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        categoria: categoriaFinal,
        morador_nome: moradorNome.trim(),
        bairro,
        whatsapp_contato: whatsapp.trim() || undefined,
        urgente: tipoPost === "pet_perdido" ? true : urgente,
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
                ? "Nome do Pet e Características Principais *"
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
                  ? "Ex: Thor sumiu no Jd. Valença / Regente (Poodle branco c/ coleira azul)"
                  : tipoPost === "desapego"
                  ? "Ex: Bicicleta Caloi aro 26 ou Berço de madeira infantil"
                  : "Ex: Procuro pintor caprichoso para pintar a sala"
              }
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Campos específicos de Desapego: Valor / Doação */}
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

          {/* Linha com Seletores Inteligentes de acordo com o Tipo de Post */}
          <div className="grid grid-cols-2 gap-3">
            {/* Caso 1: Pedido de Serviço Comum -> Categoria de Serviços */}
            {tipoPost === "pedido" && (
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Categoria do Serviço *
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
            )}

            {/* Caso 2: Pet Perdido -> Espécie / Tipo de Animal (NÃO PEDE CATEGORIA DE SERVIÇO) */}
            {tipoPost === "pet_perdido" && (
              <div>
                <label className="block text-xs font-bold text-red-950 mb-1">
                  Espécie do Animal *
                </label>
                <select
                  value={especieAnimal}
                  onChange={(e) => setEspecieAnimal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-red-300 text-xs focus:ring-2 focus:ring-red-500 outline-none bg-white font-bold text-gray-800"
                >
                  <option value="Cachorro">🐶 Cachorro</option>
                  <option value="Gato">🐱 Gato</option>
                  <option value="Pássaro / Ave">🦜 Pássaro / Ave</option>
                  <option value="Outro Pet">🐾 Outro Animal</option>
                </select>
              </div>
            )}

            {/* Caso 3: Desapego -> Tipo de Item (NÃO PEDE CATEGORIA DE SERVIÇO) */}
            {tipoPost === "desapego" && (
              <div>
                <label className="block text-xs font-bold text-purple-950 mb-1">
                  Tipo de Item *
                </label>
                <select
                  value={categoriaDesapego}
                  onChange={(e) => setCategoriaDesapego(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-purple-300 text-xs focus:ring-2 focus:ring-purple-500 outline-none bg-white font-bold text-gray-800"
                >
                  <option value="Móveis & Casa">🛋️ Móveis & Casa</option>
                  <option value="Eletro & Eletrônicos">⚡ Eletro & Eletrônicos</option>
                  <option value="Infantil & Brinquedos">🧸 Infantil & Bebê</option>
                  <option value="Plantas & Jardim">🌿 Plantas & Mudas</option>
                  <option value="Bicicletas & Esportes">🚲 Bicicletas & Esporte</option>
                  <option value="Roupas & Acessórios">👗 Roupas & Calçados</option>
                  <option value="Ferramentas">🔧 Ferramentas</option>
                  <option value="Outros">📦 Outros</option>
                </select>
              </div>
            )}

            {/* Bairro sempre presente de forma contextual */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                {tipoPost === "pet_perdido"
                  ? "Bairro onde Sumiu / Visto *"
                  : tipoPost === "desapego"
                  ? "Bairro para Retirada *"
                  : "Seu Bairro *"}
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
                  ? "Ex: Fugiu pelo portão ontem por volta das 18h na Rua 4 do Jd. Regente. Atende por Thor, porte médio, coleira azul. A família está muito preocupada, por favor avisem se avistarem!"
                  : tipoPost === "desapego"
                  ? "Ex: Bicicleta usada mas em ótimo estado, pneus novos, precisa apenas lubrificar a corrente. Retirada no Jd. Regente."
                  : "Ex: Gostaria de alguém com boas recomendações para orçamento sem compromisso até sexta-feira..."
              }
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
            />
          </div>

          {/* Foto (Galeria, Câmera ou Link) */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-emerald-600" />
                {tipoPost === "pet_perdido"
                  ? "Foto do Pet (recomendado)"
                  : tipoPost === "desapego"
                  ? "Foto do Item (recomendado)"
                  : "Foto de Referência (opcional)"}
              </span>
              {!fotoUrl && (
                <button
                  type="button"
                  onClick={() => setMostrarCampoUrl(!mostrarCampoUrl)}
                  className="text-[11px] text-emerald-700 hover:underline font-semibold cursor-pointer"
                >
                  {mostrarCampoUrl ? "Usar envio de arquivo" : "Ou colar link da web"}
                </button>
              )}
            </label>

            {fotoUrl ? (
              <div className="relative inline-block mt-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={fotoUrl}
                  alt="Pré-visualização"
                  className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl border border-slate-300 shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setFotoUrl("")}
                  className="absolute -top-2 -right-2 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-full shadow-md transition"
                  title="Remover foto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <span className="block text-[11px] text-emerald-700 font-semibold mt-1">
                  ✓ Foto anexada com sucesso!
                </span>
              </div>
            ) : mostrarCampoUrl ? (
              <div>
                <input
                  type="url"
                  value={fotoUrl}
                  onChange={(e) => setFotoUrl(e.target.value)}
                  placeholder="https://exemplo.com/minha-foto.jpg"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                />
              </div>
            ) : (
              <div>
                <label className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl cursor-pointer transition text-slate-700 hover:text-emerald-700">
                  {carregandoFoto ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-700">Comprimindo imagem...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold">
                        Tirar foto ou escolher da galeria
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFotoArquivo}
                    disabled={carregandoFoto}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-400 mt-1">
                  💡 A foto é otimizada automaticamente no seu aparelho para carregar instantaneamente.
                </p>
              </div>
            )}
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

          {/* Alerta de urgência: automático para pets ou checkbox para serviços */}
          {tipoPost === "pet_perdido" ? (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-xs text-red-950 font-bold">
              <span className="text-base flex-shrink-0 animate-bounce">🚨</span>
              <span>Alerta urgente automático: Este pet receberá destaque prioritário com botão direto de resgate no mural!</span>
            </div>
          ) : (
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
                🚨 Destacar como Urgente no Mural
              </label>
            </div>
          )}

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
