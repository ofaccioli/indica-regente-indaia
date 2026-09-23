"use client";

import React, { useState, useEffect } from "react";
import {
  Phone,
  MessageCircle,
  MapPin,
  Star,
  UserCheck,
  ThumbsUp,
  Share2,
  Heart,
  AlertCircle,
  CheckCircle2,
  Award,
  Clock,
  Camera,
  Edit3,
} from "lucide-react";
import { Servico } from "@/types";
import { WhatsAppOptionsModal } from "./WhatsAppOptionsModal";
import { RatingModal } from "./RatingModal";
import { VerAvaliacoesModal } from "./VerAvaliacoesModal";
import { FotosTrabalhosModal } from "./FotosTrabalhosModal";
import { EditarServicoModal } from "./EditarServicoModal";
import { SugerirEdicaoModal } from "./SugerirEdicaoModal";
import { gerarLinkLigacao, verificarAbertoAgora } from "@/lib/utils";
import { isFavorite, toggleFavorite, FAVORITES_EVENT } from "@/lib/favorites";
import { isMyCreatedService, MY_SERVICES_EVENT } from "@/lib/my-services";
import { showToast } from "./Toast";

interface ServiceCardProps {
  servico: Servico;
  onAtualizar?: () => void;
  salvo?: boolean;
  onToggleFavorito?: (id: string) => void;
}

// Ícone do Instagram estilizado
function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export function ServiceCard({
  servico,
  onAtualizar,
  salvo = false,
  onToggleFavorito,
}: ServiceCardProps) {
  const [salvoLocal, setSalvoLocal] = useState(salvo);
  const [modalZapAberto, setModalZapAberto] = useState(false);
  const [modalAvaliacaoAberto, setModalAvaliacaoAberto] = useState(false);
  const [modalVerAvaliacoesAberto, setModalVerAvaliacoesAberto] = useState(false);
  const [modalFotosAberto, setModalFotosAberto] = useState(false);
  const [modalLigarAberto, setModalLigarAberto] = useState(false);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [modalSugerirEdicaoAberto, setModalSugerirEdicaoAberto] = useState(false);
  const [souAutor, setSouAutor] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const statusAberto = verificarAbertoAgora(servico.horario_funcionamento);

  // Checa se este aparelho foi quem cadastrou o serviço
  useEffect(() => {
    setSouAutor(isMyCreatedService(servico.id));

    const handleMyServicesSync = () => {
      setSouAutor(isMyCreatedService(servico.id));
    };

    window.addEventListener(MY_SERVICES_EVENT, handleMyServicesSync);
    return () => window.removeEventListener(MY_SERVICES_EVENT, handleMyServicesSync);
  }, [servico.id]);

  // Sincroniza estado de favorito com props e localStorage
  useEffect(() => {
    setSalvoLocal(isFavorite(servico.id));

    const handleSync = () => {
      setSalvoLocal(isFavorite(servico.id));
    };

    window.addEventListener(FAVORITES_EVENT, handleSync);
    return () => window.removeEventListener(FAVORITES_EVENT, handleSync);
  }, [servico.id]);

  const ligarUrl = gerarLinkLigacao(servico.telefone);

  const handleToggleFavorito = (e: React.MouseEvent) => {
    e.stopPropagation();
    const novoStatus = toggleFavorite(servico.id);
    setSalvoLocal(novoStatus);
    showToast(
      novoStatus ? "Salvo nos seus Favoritos!" : "Removido dos Favoritos",
      novoStatus ? "❤️" : "🤍"
    );
    if (onToggleFavorito) {
      onToggleFavorito(servico.id);
    }
  };

  const handleCompartilhar = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const texto = `Indicação de serviço em Indaiatuba:\n*${servico.nome}* (${servico.categoria})\nBairro: ${servico.cidade_bairro}\nTelefone: ${servico.telefone}\nEncontre mais profissionais no Indica Jd.Regente: https://indica-regente-indaia.vercel.app`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Indicação: ${servico.nome}`,
          text: texto,
        });
        showToast("Indicação compartilhada com sucesso!", "🚀");
        return;
      } catch {
        // Fallback
      }
    }

    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      showToast("Texto copiado! Cole no WhatsApp", "📋");
      setTimeout(() => setCopiado(false), 2500);

      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`, "_blank");
    } catch {
      showToast("Texto copiado para a área de transferência", "📋");
    }
  };

  // Inicial do profissional para avatar visual
  const inicial = servico.nome ? servico.nome.trim().charAt(0).toUpperCase() : "S";

  // URL do Instagram limpa
  const instagramUser = servico.instagram ? servico.instagram.replace(/^@/, "").trim() : null;

  return (
    <>
      <article className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs hover:shadow-md border border-slate-200/80 hover:border-emerald-200 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
        <div>
          {/* Topo: Categoria + Status Aberto/FDS + Top Recomendado */}
          <div className="flex items-center justify-between gap-1.5 mb-2.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                {servico.categoria}
              </span>

              {statusAberto && (
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    statusAberto.aberto
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                      : "bg-rose-50 text-rose-800 border-rose-200"
                  }`}
                  title={servico.horario_funcionamento}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      statusAberto.aberto ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                    }`}
                  />
                  {statusAberto.texto}
                </span>
              )}

              {servico.atende_fim_de_semana && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300">
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                  🚨 Plantão FDS
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {souAutor && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalEditarAberto(true);
                  }}
                  className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition active:scale-95 cursor-pointer"
                  title="Você cadastrou este serviço! Clique para editar"
                >
                  <Edit3 className="w-2.5 h-2.5" />
                  <span>Editar</span>
                </button>
              )}

              {servico.selo_destaque && (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-2xs">
                  <Award className="w-3 h-3 fill-amber-950" />
                  TOP RECOMENDADO
                </span>
              )}
            </div>
          </div>

          {/* Cabeçalho com Avatar de Iniciais ou Foto de Perfil, Nome e Ações Rápidas */}
          <div className="flex items-start gap-3 mb-2.5">
            {servico.foto_url ? (
              <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-sm border border-emerald-500/30 flex-shrink-0 bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={servico.foto_url}
                  alt={servico.nome}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            ) : (
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-black text-base flex-shrink-0 shadow-sm border border-emerald-500/30">
                {inicial}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h3 className="text-base font-extrabold text-gray-900 leading-tight truncate">
                  {servico.nome}
                </h3>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {instagramUser && (
                    <a
                      href={`https://instagram.com/${instagramUser}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-700 p-1.5 rounded-full hover:bg-pink-50 transition-colors"
                      title={`Instagram: @${instagramUser}`}
                    >
                      <InstagramIcon className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={handleToggleFavorito}
                    aria-label={salvoLocal ? "Remover dos favoritos" : "Salvar contato"}
                    title={salvoLocal ? "Salvo nos seus favoritos" : "Salvar nos favoritos"}
                    className={`p-1.5 rounded-full transition-all active:scale-90 cursor-pointer ${
                      salvoLocal
                        ? "text-rose-500 bg-rose-50 hover:bg-rose-100"
                        : "text-gray-400 hover:text-rose-500 hover:bg-gray-100"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${salvoLocal ? "fill-rose-500 text-rose-500" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Avaliação em Estrelas & Total (Clicável para ver depoimentos reais) */}
              <button
                type="button"
                onClick={() => setModalVerAvaliacoesAberto(true)}
                className="flex items-center gap-1.5 mt-1 hover:opacity-85 transition cursor-pointer text-left group/rating"
                title="Clique para ler as avaliações dos vizinhos"
              >
                <div className="flex items-center bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/80 group-hover/rating:border-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-black text-xs text-amber-950 ml-1">
                    {servico.nota_media ? servico.nota_media.toFixed(1) : "5.0"}
                  </span>
                </div>
                <span className="text-gray-300 text-xs">•</span>
                <span className="text-[11px] text-emerald-700 group-hover/rating:text-emerald-800 font-semibold underline underline-offset-2 decoration-emerald-300">
                  {servico.total_avaliacoes} {servico.total_avaliacoes === 1 ? "indicação" : "indicações"}
                </span>
              </button>
            </div>
          </div>

          {/* Localização, Bairro e Badges Complementares */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-1.5 flex-wrap">
            <div className="flex items-center gap-1 font-semibold text-gray-700">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>{servico.cidade_bairro}</span>
            </div>

            {servico.eh_morador && (
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300">
                🏡 Vizinho do Bairro
              </span>
            )}

            {servico.tipo_atendimento === "domicilio" && (
              <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                🛵 Domicílio
              </span>
            )}
            {servico.tipo_atendimento === "local" && (
              <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                🏢 No Local
              </span>
            )}
            {servico.tipo_atendimento === "ambos" && (
              <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                🛵 & 🏢 Ambos
              </span>
            )}

            {servico.verificado_admin && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                <CheckCircle2 className="w-3 h-3 text-blue-600" />
                Verificado
              </span>
            )}
          </div>

          {/* Horário de Funcionamento se cadastrado */}
          {servico.horario_funcionamento && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="text-[11px] text-slate-600">{servico.horario_funcionamento}</span>
            </div>
          )}

          {/* Telefones */}
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-2.5 flex-wrap">
            <span className="font-semibold text-gray-800 flex items-center gap-1">
              <Phone className="w-3 h-3 text-emerald-600 flex-shrink-0" />
              {servico.telefone}
            </span>
            {servico.telefone_secundario && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500">2º: <strong>{servico.telefone_secundario}</strong></span>
              </>
            )}
          </div>

          {/* Oferta Especial de Vizinhança (Design Refinado) */}
          {servico.oferta_vizinho && (
            <div className="mb-3 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-300 rounded-2xl p-3 flex items-start gap-2.5 shadow-2xs">
              <span className="text-base flex-shrink-0">🏷️</span>
              <div className="flex-1 min-w-0">
                <span className="block text-[10px] font-black uppercase tracking-wider text-amber-900">
                  Condição Especial para Vizinhos
                </span>
                <p className="text-xs font-bold text-amber-950 leading-snug mt-0.5">
                  {servico.oferta_vizinho}
                </p>
              </div>
            </div>
          )}

          {/* Mini-Galeria / Pré-visualização dos Trabalhos em Destaque */}
          {servico.fotos_trabalhos && servico.fotos_trabalhos.length > 0 && (
            <div
              onClick={() => setModalFotosAberto(true)}
              className="mb-3 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer group/galeria relative shadow-2xs hover:border-emerald-300 transition-all"
              title="Toque para abrir as fotos dos trabalhos em tela cheia"
            >
              <div
                className={`grid gap-1 ${
                  servico.fotos_trabalhos.length === 1
                    ? "grid-cols-1"
                    : servico.fotos_trabalhos.length === 2
                    ? "grid-cols-2"
                    : "grid-cols-3"
                } h-28 sm:h-32`}
              >
                {servico.fotos_trabalhos.slice(0, 3).map((foto, idx) => (
                  <div key={idx} className="relative w-full h-full overflow-hidden bg-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={foto}
                      alt={`Trabalho ${idx + 1} de ${servico.nome}`}
                      className="w-full h-full object-cover group-hover/galeria:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {idx === 2 && servico.fotos_trabalhos!.length > 3 && (
                      <div className="absolute inset-0 bg-slate-950/65 flex items-center justify-center text-white font-black text-xs">
                        +{servico.fotos_trabalhos!.length - 2} fotos
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="absolute bottom-2 right-2 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <Camera className="w-3 h-3 text-amber-300" />
                <span>Ver fotos ({servico.fotos_trabalhos.length})</span>
              </div>
            </div>
          )}

          {/* Descrição dos Serviços */}
          {servico.descricao && (
            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 font-normal">
              {servico.descricao}
            </p>
          )}

          {/* Quem indicou */}
          {servico.quem_indicou && (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-950 bg-emerald-50/80 px-2.5 py-1.5 rounded-xl mb-3 border border-emerald-100">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>
                Recomendado por: <strong className="font-bold">{servico.quem_indicou}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="pt-3 border-t border-slate-100 mt-1">
          {/* Botão Principal: WhatsApp Inteligente */}
          <button
            type="button"
            onClick={() => setModalZapAberto(true)}
            className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all mb-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Chamar no WhatsApp</span>
          </button>

          {/* Linha de botões secundários */}
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            {servico.telefone_secundario ? (
              <button
                type="button"
                onClick={() => setModalLigarAberto(true)}
                className="py-1.5 px-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold flex items-center justify-center gap-1 transition-colors text-[11px] cursor-pointer"
              >
                <Phone className="w-3 h-3 text-emerald-600" />
                <span>Ligar (2)</span>
              </button>
            ) : (
              <a
                href={ligarUrl}
                className="py-1.5 px-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold flex items-center justify-center gap-1 transition-colors text-[11px]"
              >
                <Phone className="w-3 h-3 text-emerald-600" />
                <span>Ligar</span>
              </a>
            )}

            <button
              type="button"
              onClick={() => setModalAvaliacaoAberto(true)}
              className="py-1.5 px-2 rounded-xl border border-amber-200 bg-amber-50/60 text-amber-950 hover:bg-amber-100/70 font-semibold flex items-center justify-center gap-1 transition-colors text-[11px] cursor-pointer"
            >
              <ThumbsUp className="w-3 h-3 text-amber-600" />
              <span>Avaliar</span>
            </button>

            <button
              type="button"
              onClick={handleCompartilhar}
              className="py-1.5 px-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold flex items-center justify-center gap-1 transition-colors text-[11px] cursor-pointer"
            >
              <Share2 className="w-3 h-3 text-blue-600" />
              <span>{copiado ? "Copiado!" : "Indicar"}</span>
            </button>
          </div>

          {/* Link discreto para Atualizar Dados / Sugerir Edição */}
          <div className="pt-2 text-center border-t border-slate-100/70 mt-2">
            <button
              type="button"
              onClick={() => {
                if (souAutor) {
                  setModalEditarAberto(true);
                } else {
                  setModalSugerirEdicaoAberto(true);
                }
              }}
              className="text-[11px] text-slate-400 hover:text-emerald-700 font-medium inline-flex items-center gap-1 hover:underline transition cursor-pointer"
            >
              <Edit3 className="w-3 h-3 text-slate-400" />
              <span>{souAutor ? "Editar informações deste cadastro" : "É o dono? Atualizar informações"}</span>
            </button>
          </div>
        </div>
      </article>

      {/* Modal de Mensagens Pré-formatadas do WhatsApp */}
      <WhatsAppOptionsModal
        servico={servico}
        isOpen={modalZapAberto}
        onClose={() => setModalZapAberto(false)}
      />

      {/* Modal de Avaliação */}
      <RatingModal
        servico={servico}
        isOpen={modalAvaliacaoAberto}
        onClose={() => setModalAvaliacaoAberto(false)}
        onAvaliacaoSalva={onAtualizar || (() => {})}
      />

      {/* Modal para Visualizar Avaliações e Depoimentos */}
      <VerAvaliacoesModal
        servico={servico}
        isOpen={modalVerAvaliacoesAberto}
        onClose={() => setModalVerAvaliacoesAberto(false)}
        onAvaliarClick={() => setModalAvaliacaoAberto(true)}
      />

      {/* Modal para Visualizar Fotos de Trabalhos */}
      {servico.fotos_trabalhos && servico.fotos_trabalhos.length > 0 && (
        <FotosTrabalhosModal
          isOpen={modalFotosAberto}
          onClose={() => setModalFotosAberto(false)}
          nomeProfissional={servico.nome}
          fotos={servico.fotos_trabalhos}
        />
      )}

      {/* Modal de Edição Direta (para quem cadastrou no aparelho) */}
      <EditarServicoModal
        servico={servico}
        isOpen={modalEditarAberto}
        onClose={() => setModalEditarAberto(false)}
        onSalvo={onAtualizar || (() => {})}
      />

      {/* Modal de Sugerir Edição / WhatsApp com Moderador */}
      <SugerirEdicaoModal
        servico={servico}
        isOpen={modalSugerirEdicaoAberto}
        onClose={() => setModalSugerirEdicaoAberto(false)}
        podeEditarDireto={souAutor}
        onAbrirEdicaoDireta={() => setModalEditarAberto(true)}
      />

      {/* Modal para Escolha de Telefone para Ligação */}
      {modalLigarAberto && servico.telefone_secundario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-xs rounded-3xl shadow-2xl p-5 text-center border border-gray-100">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2 font-bold">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="font-black text-sm text-gray-900 mb-0.5">Para qual número deseja ligar?</h4>
            <p className="text-xs text-gray-500 mb-4 truncate">{servico.nome}</p>

            <div className="space-y-2 mb-3">
              <a
                href={ligarUrl}
                onClick={() => setModalLigarAberto(false)}
                className="w-full py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Principal: {servico.telefone}</span>
              </a>

              <a
                href={gerarLinkLigacao(servico.telefone_secundario)}
                onClick={() => setModalLigarAberto(false)}
                className="w-full py-2.5 px-3 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>2º Número: {servico.telefone_secundario}</span>
              </a>
            </div>

            <button
              type="button"
              onClick={() => setModalLigarAberto(false)}
              className="text-xs text-gray-500 hover:text-gray-800 font-semibold cursor-pointer py-1"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
