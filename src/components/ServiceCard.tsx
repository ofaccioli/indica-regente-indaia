"use client";

import React, { useState } from "react";
import { Servico } from "@/types";
import {
  Star,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  ThumbsUp,
  UserCheck,
  Award,
  CheckCircle2,
  AlertCircle,
  Heart,
} from "lucide-react";
import {
  gerarLinkLigacao,
  gerarTextoCompartilhamento,
} from "@/lib/utils";
import { isFavorite, toggleFavorite, FAVORITES_EVENT } from "@/lib/favorites";
import { RatingModal } from "./RatingModal";
import { WhatsAppOptionsModal } from "./WhatsAppOptionsModal";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface ServiceCardProps {
  servico: Servico;
  onAtualizar: () => void;
}

export function ServiceCard({ servico, onAtualizar }: ServiceCardProps) {
  const [modalAvaliacaoAberto, setModalAvaliacaoAberto] = useState(false);
  const [modalZapAberto, setModalZapAberto] = useState(false);
  const [modalLigarAberto, setModalLigarAberto] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [salvo, setSalvo] = useState(false);

  React.useEffect(() => {
    setSalvo(isFavorite(servico.id));

    const handleFavChange = () => {
      setSalvo(isFavorite(servico.id));
    };

    window.addEventListener(FAVORITES_EVENT, handleFavChange);
    return () => window.removeEventListener(FAVORITES_EVENT, handleFavChange);
  }, [servico.id]);

  const handleToggleFavorito = (e: React.MouseEvent) => {
    e.stopPropagation();
    const novoStatus = toggleFavorite(servico.id);
    setSalvo(novoStatus);
  };

  const ligarUrl = gerarLinkLigacao(servico.telefone);

  const handleCompartilhar = async () => {
    const texto = gerarTextoCompartilhamento(
      servico.nome,
      servico.categoria,
      servico.telefone,
      servico.cidade_bairro,
      servico.nota_media,
      servico.total_avaliacoes
    );

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Indicação: ${servico.nome}`,
          text: texto,
        });
        return;
      } catch {
        // Fallback
      }
    }

    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);

      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`, "_blank");
    } catch {
      alert("Texto da indicação copiado! Cole no seu grupo de WhatsApp.");
    }
  };

  // Inicial do profissional para avatar visual
  const inicial = servico.nome ? servico.nome.trim().charAt(0).toUpperCase() : "S";

  // URL do Instagram limpa
  const instagramUser = servico.instagram ? servico.instagram.replace(/^@/, "").trim() : null;

  return (
    <>
      <article className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md border border-gray-200/70 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
        <div>
          {/* Topo: Categoria + Badges */}
          <div className="flex items-center justify-between gap-1.5 mb-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/50">
                {servico.categoria}
              </span>

              {servico.eh_morador && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-950 border border-emerald-300">
                  🏡 Vizinho do Bairro
                </span>
              )}

              {servico.tipo_atendimento === "domicilio" && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  🛵 A domicílio
                </span>
              )}
              {servico.tipo_atendimento === "local" && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  🏢 No local fixo
                </span>
              )}
              {servico.tipo_atendimento === "ambos" && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  🛵 Domicílio & 🏢 Local
                </span>
              )}

              {servico.verificado_admin && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/70">
                  <CheckCircle2 className="w-3 h-3 text-blue-600" />
                  Verificado
                </span>
              )}

              {servico.atende_fim_de_semana && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300">
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                  🚨 Fim de Semana
                </span>
              )}

              {servico.oferta_vizinho && (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-400">
                  🏷️ Com Oferta
                </span>
              )}
            </div>

            {/* Selo Top Recomendado */}
            {servico.selo_destaque && (
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-xs">
                <Award className="w-3 h-3 fill-amber-950" />
                TOP RECOMENDADO
              </span>
            )}
          </div>

          {/* Cabeçalho com Avatar de Iniciais e Nome */}
          <div className="flex items-start gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-900 flex items-center justify-center font-black text-sm flex-shrink-0 border border-emerald-200/60 shadow-2xs">
              {inicial}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h3 className="text-base font-bold text-gray-900 leading-snug truncate">
                  {servico.nome}
                </h3>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {instagramUser && (
                    <a
                      href={`https://instagram.com/${instagramUser}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-700 p-1 rounded-full hover:bg-pink-50 transition-colors"
                      title={`Instagram: @${instagramUser}`}
                    >
                      <InstagramIcon className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={handleToggleFavorito}
                    aria-label={salvo ? "Remover dos favoritos" : "Salvar contato"}
                    title={salvo ? "Salvo nos seus favoritos" : "Salvar nos favoritos"}
                    className={`p-1 rounded-full transition-all active:scale-90 ${
                      salvo
                        ? "text-rose-500 bg-rose-50 hover:bg-rose-100"
                        : "text-gray-400 hover:text-rose-500 hover:bg-gray-100"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${salvo ? "fill-rose-500" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Avaliação em Estrelas */}
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="flex items-center text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-xs text-gray-900 ml-1">
                    {servico.nota_media ? servico.nota_media.toFixed(1) : "5.0"}
                  </span>
                </div>
                <span className="text-gray-300 text-xs">•</span>
                <span className="text-[11px] text-gray-500 font-medium">
                  {servico.total_avaliacoes} {servico.total_avaliacoes === 1 ? "indicação" : "indicações"}
                </span>
              </div>
            </div>
          </div>

          {/* Localização */}
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="truncate font-medium">{servico.cidade_bairro}</span>
          </div>

          {/* Telefones */}
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-2.5 flex-wrap">
            <span className="font-semibold text-gray-700 flex items-center gap-1">
              <Phone className="w-3 h-3 text-emerald-600 flex-shrink-0" />
              {servico.telefone}
            </span>
            {servico.telefone_secundario && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-gray-600">2º Tel: <strong>{servico.telefone_secundario}</strong></span>
              </>
            )}
          </div>

          {/* Oferta Especial de Vizinhança */}
          {servico.oferta_vizinho && (
            <div className="mb-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300/80 rounded-xl p-2.5 flex items-start gap-2 shadow-2xs">
              <span className="text-sm flex-shrink-0">🏷️</span>
              <div className="flex-1 min-w-0">
                <span className="block text-[10px] font-black uppercase tracking-wider text-amber-900">
                  Oferta para Vizinhos do Bairro
                </span>
                <p className="text-xs font-bold text-amber-950 leading-snug">
                  {servico.oferta_vizinho}
                </p>
              </div>
            </div>
          )}

          {/* Descrição dos Serviços */}
          {servico.descricao && (
            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3 bg-gray-50/80 p-2 rounded-xl border border-gray-100">
              {servico.descricao}
            </p>
          )}

          {/* Quem indicou */}
          {servico.quem_indicou && (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-900 bg-emerald-50/70 px-2.5 py-1 rounded-lg mb-3 border border-emerald-100/70">
              <UserCheck className="w-3 h-3 text-emerald-600 flex-shrink-0" />
              <span>
                Recomendado por: <strong className="font-semibold">{servico.quem_indicou}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="pt-2.5 border-t border-gray-100 mt-1">
          {/* Botão Principal: WhatsApp Inteligente */}
          <button
            type="button"
            onClick={() => setModalZapAberto(true)}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all mb-2 cursor-pointer"
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
                className="py-1.5 px-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium flex items-center justify-center gap-1 transition-colors text-[11px] cursor-pointer"
              >
                <Phone className="w-3 h-3 text-emerald-600" />
                <span>Ligar (2)</span>
              </button>
            ) : (
              <a
                href={ligarUrl}
                className="py-1.5 px-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium flex items-center justify-center gap-1 transition-colors text-[11px]"
              >
                <Phone className="w-3 h-3 text-emerald-600" />
                <span>Ligar</span>
              </a>
            )}

            <button
              type="button"
              onClick={() => setModalAvaliacaoAberto(true)}
              className="py-1.5 px-2 rounded-xl border border-amber-200 bg-amber-50/50 text-amber-900 hover:bg-amber-100/70 font-medium flex items-center justify-center gap-1 transition-colors text-[11px] cursor-pointer"
            >
              <ThumbsUp className="w-3 h-3 text-amber-600" />
              <span>Avaliar</span>
            </button>

            <button
              type="button"
              onClick={handleCompartilhar}
              className="py-1.5 px-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium flex items-center justify-center gap-1 transition-colors text-[11px] cursor-pointer"
            >
              <Share2 className="w-3 h-3 text-blue-600" />
              <span>{copiado ? "Copiado!" : "Indicar"}</span>
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
        onAvaliacaoSalva={onAtualizar}
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
