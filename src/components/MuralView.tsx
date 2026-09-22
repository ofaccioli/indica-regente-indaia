"use client";

import React, { useState } from "react";
import {
  Megaphone,
  PlusCircle,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Share2,
  User,
  Send,
  Loader2,
  ChevronDown,
  ChevronUp,
  Tag,
  Gift,
  Search,
} from "lucide-react";
import { PedidoMural, Servico, RespostaMural } from "@/types";
import { responderPedidoMural, resolverPedidoMural } from "@/lib/supabase";
import { gerarLinkWhatsApp } from "@/lib/utils";
import { NovoPedidoModal } from "./NovoPedidoModal";

interface MuralViewProps {
  pedidos: PedidoMural[];
  servicosCadastrados: Servico[];
  onAtualizar: () => void;
}

export function MuralView({ pedidos, servicosCadastrados, onAtualizar }: MuralViewProps) {
  const [modalNovoPedidoAberto, setModalNovoPedidoAberto] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "pedidos" | "pets" | "desapegos" | "urgentes">("todos");
  
  // Estado para expandir formulário de resposta por pedido
  const [pedidoRespondendoId, setPedidoRespondendoId] = useState<string | null>(null);
  const [autorNome, setAutorNome] = useState("");
  const [mensagemResposta, setMensagemResposta] = useState("");
  const [servicoIndicadoId, setServicoIndicadoId] = useState("");
  const [enviandoResposta, setEnviandoResposta] = useState(false);

  // Contadores
  const countPets = pedidos.filter((p) => p.tipo_post === "pet_perdido").length;
  const countDesapegos = pedidos.filter((p) => p.tipo_post === "desapego").length;
  const countPedidos = pedidos.filter((p) => !p.tipo_post || p.tipo_post === "pedido").length;
  const countUrgentes = pedidos.filter((p) => p.urgente && p.status === "aberto").length;

  // Filtra pedidos
  const pedidosFiltrados = pedidos.filter((p) => {
    if (filtroTipo === "urgentes") return p.urgente && p.status === "aberto";
    if (filtroTipo === "pets") return p.tipo_post === "pet_perdido";
    if (filtroTipo === "desapegos") return p.tipo_post === "desapego";
    if (filtroTipo === "pedidos") return !p.tipo_post || p.tipo_post === "pedido";
    return true;
  });

  const handleResolverPedido = async (id: string) => {
    try {
      await resolverPedidoMural(id);
      onAtualizar();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEnviarResposta = async (pedidoId: string) => {
    if (!mensagemResposta.trim()) {
      alert("Por favor, escreva uma mensagem ou indicação.");
      return;
    }

    setEnviandoResposta(true);
    try {
      let servicoNome: string | undefined = undefined;
      if (servicoIndicadoId) {
        const s = servicosCadastrados.find((item) => item.id === servicoIndicadoId);
        if (s) servicoNome = s.nome;
      }

      await responderPedidoMural({
        pedido_id: pedidoId,
        autor_nome: autorNome.trim() || "Vizinho(a)",
        mensagem: mensagemResposta.trim(),
        servico_id_indicado: servicoIndicadoId || undefined,
        servico_nome_indicado: servicoNome,
      });

      // Limpar formulário de resposta
      setMensagemResposta("");
      setServicoIndicadoId("");
      setPedidoRespondendoId(null);
      onAtualizar();
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar resposta.");
    } finally {
      setEnviandoResposta(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Banner Superior com CTA para Pedir Indicação / Avisar Pet / Desapegar */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-5 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center flex-shrink-0 shadow font-black text-lg">
            📢
          </div>
          <div>
            <h2 className="text-base font-black leading-tight">Mural Comunitário da Vizinhança</h2>
            <p className="text-xs text-emerald-100/90 mt-0.5">
              Pedir indicação de serviços, alertar sobre 🐶 pets perdidos ou 📦 desapegar e doar entre vizinhos do Jd. Regente, Jd. Valença e região!
            </p>
          </div>
        </div>

        <button
          onClick={() => setModalNovoPedidoAberto(true)}
          className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-emerald-950 px-4 py-2.5 rounded-2xl font-black text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Publicar no Mural</span>
        </button>
      </div>

      {/* Filtros em Abas do Mural */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => setFiltroTipo("todos")}
          className={`px-3 py-1.5 rounded-full font-bold transition-all flex-shrink-0 cursor-pointer ${
            filtroTipo === "todos"
              ? "bg-gray-900 text-white shadow-xs"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Todos ({pedidos.length})
        </button>

        <button
          onClick={() => setFiltroTipo("pedidos")}
          className={`px-3 py-1.5 rounded-full font-bold transition-all flex-shrink-0 cursor-pointer flex items-center gap-1 ${
            filtroTipo === "pedidos"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50"
          }`}
        >
          <Megaphone className="w-3 h-3" />
          <span>Indicações ({countPedidos})</span>
        </button>

        <button
          onClick={() => setFiltroTipo("pets")}
          className={`px-3 py-1.5 rounded-full font-bold transition-all flex-shrink-0 cursor-pointer flex items-center gap-1 ${
            filtroTipo === "pets"
              ? "bg-red-600 text-white shadow-xs"
              : "bg-white text-red-700 border border-red-200 hover:bg-red-50"
          }`}
        >
          <span>🐶 Pets Perdidos ({countPets})</span>
        </button>

        <button
          onClick={() => setFiltroTipo("desapegos")}
          className={`px-3 py-1.5 rounded-full font-bold transition-all flex-shrink-0 cursor-pointer flex items-center gap-1 ${
            filtroTipo === "desapegos"
              ? "bg-purple-700 text-white shadow-xs"
              : "bg-white text-purple-700 border border-purple-200 hover:bg-purple-50"
          }`}
        >
          <span>📦 Desapegos & Doações ({countDesapegos})</span>
        </button>

        {countUrgentes > 0 && (
          <button
            onClick={() => setFiltroTipo("urgentes")}
            className={`px-3 py-1.5 rounded-full font-bold transition-all flex-shrink-0 cursor-pointer flex items-center gap-1 ${
              filtroTipo === "urgentes"
                ? "bg-amber-600 text-white shadow-xs animate-pulse"
                : "bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100"
            }`}
          >
            <span>🚨 Urgentes ({countUrgentes})</span>
          </button>
        )}
      </div>

      {/* Lista de Pedidos */}
      {pedidosFiltrados.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-gray-200/80 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2 text-2xl">
            {filtroTipo === "pets" ? "🐶" : filtroTipo === "desapegos" ? "📦" : "📢"}
          </div>
          <h3 className="font-bold text-sm text-gray-800">Nenhuma postagem nesta categoria</h3>
          <p className="text-xs text-gray-500 mt-1">
            {filtroTipo === "pets"
              ? "Nenhum animalzinho perdido reportado no momento (que ótima notícia!)."
              : filtroTipo === "desapegos"
              ? "Ainda não há desapegos anunciados. Tem algo parado que deseja vender ou doar?"
              : "Seja o primeiro a publicar para os vizinhos do bairro!"}
          </p>
          <button
            onClick={() => setModalNovoPedidoAberto(true)}
            className="mt-3.5 inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Criar publicação</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {pedidosFiltrados.map((pedido) => {
            const respostas = pedido.respostas || [];
            const isRespondendo = pedidoRespondendoId === pedido.id;
            const isPet = pedido.tipo_post === "pet_perdido";
            const isDesapego = pedido.tipo_post === "desapego";

            return (
              <article
                key={pedido.id}
                className={`bg-white rounded-3xl p-4 sm:p-5 border transition-all duration-200 shadow-xs hover:shadow-md ${
                  isPet && pedido.status === "aberto"
                    ? "border-red-300 ring-2 ring-red-100 bg-linear-to-b from-red-50/20 to-white"
                    : isDesapego
                    ? "border-purple-200/90 bg-linear-to-b from-purple-50/15 to-white"
                    : pedido.urgente && pedido.status === "aberto"
                    ? "border-amber-300 ring-1 ring-amber-100"
                    : "border-gray-200/80"
                }`}
              >
                {/* Topo do Card com Badges */}
                <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Badge do Tipo de Post */}
                    {isPet ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300 animate-pulse">
                        🚨 ALERTA: PET PERDIDO
                      </span>
                    ) : isDesapego ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
                        📦 DESAPEGO & DOAÇÃO
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        📢 {pedido.categoria}
                      </span>
                    )}

                    {/* Badge de Preço / Doação Grátis (se desapego) */}
                    {isDesapego && pedido.valor_desapego && (
                      <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        pedido.valor_desapego.toLowerCase().includes("grátis") || pedido.valor_desapego.toLowerCase().includes("gratis") || pedido.valor_desapego.toLowerCase().includes("doação")
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                          : "bg-amber-100 text-amber-900 border-amber-300"
                      }`}>
                        {pedido.valor_desapego.toLowerCase().includes("grátis") || pedido.valor_desapego.toLowerCase().includes("gratis") ? (
                          <>
                            <Gift className="w-3 h-3 text-emerald-700" />
                            <span>{pedido.valor_desapego}</span>
                          </>
                        ) : (
                          <>
                            <Tag className="w-3 h-3 text-amber-700" />
                            <span>{pedido.valor_desapego}</span>
                          </>
                        )}
                      </span>
                    )}

                    {pedido.urgente && pedido.status === "aberto" && !isPet && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                        <AlertCircle className="w-3 h-3 text-red-600" />
                        URGENTE
                      </span>
                    )}

                    {pedido.status === "resolvido" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        <CheckCircle2 className="w-3 h-3 text-blue-600" />
                        {isPet ? "🐶 Encontrado / Resolvido" : isDesapego ? "📦 Doado / Vendido" : "Resolvido"}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        Em Aberto
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(pedido.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>

                {/* Título e Descrição */}
                <h3 className="text-base font-extrabold text-gray-900 leading-snug mb-1">
                  {pedido.titulo}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-3 whitespace-pre-line bg-gray-50/70 p-2.5 rounded-2xl border border-gray-100">
                  {pedido.descricao}
                </p>

                {/* Foto se informada */}
                {pedido.foto_url && (
                  <div className="mb-3 overflow-hidden rounded-2xl border border-gray-200 max-h-60 bg-black/5 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pedido.foto_url}
                      alt={pedido.titulo}
                      className="max-h-60 w-auto object-cover rounded-2xl"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                )}

                {/* Autor e Ações de Contato */}
                <div className="flex items-center justify-between gap-2 flex-wrap pb-3 border-b border-gray-100 text-xs">
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-emerald-600" />
                      <strong>{pedido.morador_nome}</strong>
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1 text-gray-500">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {pedido.bairro}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {pedido.whatsapp_contato && (
                      <a
                        href={gerarLinkWhatsApp(
                          pedido.whatsapp_contato,
                          isPet
                            ? `Olá ${pedido.morador_nome}, vi seu alerta de PET PERDIDO no Mural do Indica Jd. Regente ("${pedido.titulo}")!`
                            : isDesapego
                            ? `Olá ${pedido.morador_nome}, vi seu desapego/doação no Mural do Indica Jd. Regente ("${pedido.titulo}") e gostaria de conversar!`
                            : `Olá ${pedido.morador_nome}, vi seu pedido no Mural do Indica Jd. Regente ("${pedido.titulo}") e gostaria de te ajudar!`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-2xs transition-colors ${
                          isPet
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : isDesapego
                            ? "bg-purple-700 hover:bg-purple-800 text-white"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        }`}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>
                          {isPet ? "🐶 Vi este Pet!" : isDesapego ? "📦 Quero Negociar / Retirar" : "WhatsApp"}
                        </span>
                      </a>
                    )}

                    {pedido.status === "aberto" && (
                      <button
                        onClick={() => handleResolverPedido(pedido.id)}
                        className="text-gray-500 hover:text-blue-600 font-semibold text-[11px] flex items-center gap-1 px-2 py-1 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Marcar como resolvido"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isPet ? "Pet encontrado" : "Já resolvi"}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Seção de Respostas e Recomendações dos Vizinhos */}
                <div className="pt-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <span>{isPet ? "Informações dos Vizinhos" : isDesapego ? "Perguntas / Comentários" : "Indicações dos Vizinhos"}</span>
                      <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                        {respostas.length}
                      </span>
                    </h4>

                    <button
                      onClick={() => setPedidoRespondendoId(isRespondendo ? null : pedido.id)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isRespondendo ? "Fechar resposta" : isPet ? "+ Avisar paradeiro / ajudar" : "+ Deixar comentário / indicação"}</span>
                      {isRespondendo ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Respostas Cadastradas */}
                  {respostas.length > 0 && (
                    <div className="space-y-2 mt-2">
                      {respostas.map((resp) => {
                        const servicoIndicado = servicosCadastrados.find(
                          (s) => s.id === resp.servico_id_indicado
                        );

                        return (
                          <div
                            key={resp.id}
                            className="bg-emerald-50/40 border border-emerald-100/80 rounded-2xl p-3 text-xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-gray-500 text-[11px]">
                              <strong className="text-emerald-950 font-bold">{resp.autor_nome}</strong>
                              <span>
                                {new Date(resp.created_at).toLocaleDateString("pt-BR", {
                                  day: "2-digit",
                                  month: "short",
                                })}
                              </span>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{resp.mensagem}</p>

                            {/* Card em destaque se recomendou um profissional da base */}
                            {servicoIndicado && (
                              <div className="bg-white rounded-xl p-2.5 border border-emerald-200 flex items-center justify-between gap-2 shadow-2xs mt-1">
                                <div>
                                  <span className="text-[10px] font-bold text-emerald-700 block">
                                    ★ Profissional Recomendado no App:
                                  </span>
                                  <span className="font-extrabold text-xs text-gray-900">
                                    {servicoIndicado.nome}
                                  </span>
                                  <span className="text-[10px] text-gray-500 block">
                                    {servicoIndicado.categoria} • Nota {servicoIndicado.nota_media?.toFixed(1) || "5.0"}
                                  </span>
                                </div>
                                <a
                                  href={gerarLinkWhatsApp(
                                    servicoIndicado.telefone,
                                    `Olá ${servicoIndicado.nome}, vi sua indicação no Mural do Indica Jd. Regente!`
                                  )}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-2xs flex-shrink-0"
                                >
                                  <MessageCircle className="w-3 h-3" />
                                  <span>WhatsApp</span>
                                </a>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Formulário para Responder / Indicar */}
                  {isRespondendo && (
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3.5 space-y-2.5 mt-2 animate-in fade-in duration-150">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <input
                          type="text"
                          value={autorNome}
                          onChange={(e) => setAutorNome(e.target.value)}
                          placeholder="Seu nome/vizinho (Ex: João Rua 2)"
                          className="px-3 py-2 rounded-xl border border-gray-300 outline-none bg-white font-medium"
                        />

                        {!isPet && !isDesapego && (
                          <select
                            value={servicoIndicadoId}
                            onChange={(e) => setServicoIndicadoId(e.target.value)}
                            className="px-3 py-2 rounded-xl border border-gray-300 outline-none bg-white font-medium text-xs truncate"
                          >
                            <option value="">Vincular profissional cadastrado (opcional)</option>
                            {servicosCadastrados.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.nome} ({s.categoria})
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      <textarea
                        rows={2}
                        value={mensagemResposta}
                        onChange={(e) => setMensagemResposta(e.target.value)}
                        placeholder={
                          isPet
                            ? "Ex: Acabei de avistar um cãozinho parecido na Rua 3 próximo ao mercadinho..."
                            : isDesapego
                            ? "Ex: Olá, ainda está disponível? Qual o melhor horário para retirar?"
                            : "Escreva sua recomendação ou comentário para o vizinho..."
                        }
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs outline-none bg-white resize-none"
                      />

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setPedidoRespondendoId(null)}
                          className="px-3 py-1.5 rounded-xl border border-gray-300 text-gray-600 text-xs font-semibold hover:bg-gray-100 cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEnviarResposta(pedido.id)}
                          disabled={enviandoResposta}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer active:scale-95"
                        >
                          {enviandoResposta ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>Enviar Comentário</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Modal de Novo Pedido */}
      <NovoPedidoModal
        isOpen={modalNovoPedidoAberto}
        onClose={() => setModalNovoPedidoAberto(false)}
        onPedidoCriado={() => {
          onAtualizar();
        }}
      />
    </div>
  );
}
