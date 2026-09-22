"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { CategoryFilter } from "@/components/CategoryFilter";
import { NeighborhoodFilter } from "@/components/NeighborhoodFilter";
import { SortTabs } from "@/components/SortTabs";
import { ServiceCard } from "@/components/ServiceCard";
import { BottomNav } from "@/components/BottomNav";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { ShareCommunityModal } from "@/components/ShareCommunityModal";
import { MuralView } from "@/components/MuralView";
import { Servico, TipoOrdenacao, PedidoMural } from "@/types";
import { listarServicos, listarPedidosMural } from "@/lib/supabase";
import { ordenarServicos } from "@/lib/ranking";
import { getFavorites, toggleFavorite, FAVORITES_EVENT } from "@/lib/favorites";
import {
  Sparkles,
  PlusCircle,
  RefreshCw,
  AlertCircle,
  Heart,
  Megaphone,
  Grid,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  // Aba principal: Catálogo de Serviços ou Mural "Alguém Indica?"
  const [abaPrincipal, setAbaPrincipal] = useState<"catalogo" | "mural">("catalogo");

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [pedidosMural, setPedidosMural] = useState<PedidoMural[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
  const [bairroSelecionado, setBairroSelecionado] = useState("Todos os Bairros");
  const [apenasFimDeSemana, setApenasFimDeSemana] = useState(false);
  const [apenasFavoritos, setApenasFavoritos] = useState(false);
  const [apenasMorador, setApenasMorador] = useState(false);
  const [apenasOfertas, setApenasOfertas] = useState(false);
  const [filtroAtendimento, setFiltroAtendimento] = useState<"todos" | "domicilio" | "local">("todos");
  const [ordenacao, setOrdenacao] = useState<TipoOrdenacao>("melhores");
  const [modalDivulgacaoAberto, setModalDivulgacaoAberto] = useState(false);
  const [favoritosIds, setFavoritosIds] = useState<string[]>([]);

  // Sincroniza favoritos salvos localmente
  useEffect(() => {
    setFavoritosIds(getFavorites());

    const handleFavChange = () => {
      setFavoritosIds(getFavorites());
    };

    window.addEventListener(FAVORITES_EVENT, handleFavChange);
    return () => window.removeEventListener(FAVORITES_EVENT, handleFavChange);
  }, []);

  // Carrega serviços e mural
  const carregarDados = async () => {
    setCarregando(true);
    try {
      const [dadosServicos, dadosMural] = await Promise.all([
        listarServicos(),
        listarPedidosMural(),
      ]);
      setServicos(dadosServicos);
      setPedidosMural(dadosMural);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // Contagem de serviços por categoria
  const contagemPorCategoria = useMemo(() => {
    const mapa: Record<string, number> = { _total: servicos.length };
    servicos.forEach((s) => {
      mapa[s.categoria] = (mapa[s.categoria] || 0) + 1;
    });
    return mapa;
  }, [servicos]);

  // Filtra por categoria, bairro, plantão, morador, atendimento, favoritos e busca
  const servicosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    return servicos.filter((item) => {
      // Filtro de Meus Salvos / Favoritos
      if (apenasFavoritos && !favoritosIds.includes(item.id)) {
        return false;
      }

      // Filtro de Vizinho / Morador do Bairro
      if (apenasMorador && !item.eh_morador) {
        return false;
      }

      // Filtro de Ofertas da Vizinhança
      if (apenasOfertas && !item.oferta_vizinho) {
        return false;
      }

      // Filtro de Modalidade de Atendimento
      if (filtroAtendimento === "domicilio") {
        if (item.tipo_atendimento !== "domicilio" && item.tipo_atendimento !== "ambos") {
          return false;
        }
      } else if (filtroAtendimento === "local") {
        if (item.tipo_atendimento !== "local" && item.tipo_atendimento !== "ambos") {
          return false;
        }
      }

      // Filtro de Categoria
      const atendeCategoria =
        categoriaSelecionada === "Todos" || item.categoria === categoriaSelecionada;
      if (!atendeCategoria) return false;

      // Filtro de Plantão / Fim de Semana
      if (apenasFimDeSemana && !item.atende_fim_de_semana) {
        return false;
      }

      // Filtro de Bairro
      if (bairroSelecionado !== "Todos os Bairros") {
        const termoBairro = bairroSelecionado
          .toLowerCase()
          .replace("jd. ", "")
          .replace("parque ", "")
          .replace("vila ", "");
        const local = item.cidade_bairro.toLowerCase();
        if (!local.includes(termoBairro)) {
          return false;
        }
      }

      // Filtro de Texto de Busca
      if (!termo) return true;

      const nome = item.nome.toLowerCase();
      const categoria = item.categoria.toLowerCase();
      const cidade = item.cidade_bairro.toLowerCase();
      const desc = (item.descricao || "").toLowerCase();
      const quem = (item.quem_indicou || "").toLowerCase();
      const telefone = item.telefone_numeros || "";

      return (
        nome.includes(termo) ||
        categoria.includes(termo) ||
        cidade.includes(termo) ||
        desc.includes(termo) ||
        quem.includes(termo) ||
        telefone.includes(termo)
      );
    });
  }, [
    servicos,
    categoriaSelecionada,
    bairroSelecionado,
    apenasFimDeSemana,
    apenasFavoritos,
    favoritosIds,
    apenasMorador,
    apenasOfertas,
    filtroAtendimento,
    busca,
  ]);

  // Aplica inteligência de ordenação
  const servicosOrdenados = useMemo(() => {
    return ordenarServicos(servicosFiltrados, ordenacao);
  }, [servicosFiltrados, ordenacao]);

  // Força retorno ao Guia de Serviços ao clicar no logo ou em Início
  const irParaGuiaServicos = () => {
    setAbaPrincipal("catalogo");
    setBusca("");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {/* Banner de instalação PWA */}
      <PWAInstallPrompt />

      {/* Header com pesquisa e botão divulgar */}
      <Header
        busca={busca}
        onBuscaChange={setBusca}
        onAbrirDivulgacao={() => setModalDivulgacaoAberto(true)}
        onLogoClick={irParaGuiaServicos}
      />

      {/* Alternador de Modo: Catálogo de Serviços vs. Mural "Alguém Indica?" */}
      <div className="max-w-4xl w-full mx-auto px-4 pt-3.5 pb-1">
        <div className="bg-slate-200/75 p-1 rounded-2xl flex items-center gap-1 shadow-inner text-xs font-black border border-slate-300/40">
          <button
            onClick={() => setAbaPrincipal("catalogo")}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              abaPrincipal === "catalogo"
                ? "bg-white text-emerald-950 shadow-sm font-black scale-[1.01]"
                : "text-slate-600 hover:text-slate-900 font-bold"
            }`}
          >
            <Grid className="w-4 h-4 text-emerald-700" />
            <span>Guia de Serviços</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              abaPrincipal === "catalogo" ? "bg-emerald-100 text-emerald-900" : "bg-slate-300 text-slate-700"
            }`}>
              {servicos.length}
            </span>
          </button>

          <button
            onClick={() => setAbaPrincipal("mural")}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              abaPrincipal === "mural"
                ? "bg-white text-emerald-950 shadow-sm font-black scale-[1.01]"
                : "text-slate-600 hover:text-slate-900 font-bold"
            }`}
          >
            <Megaphone className="w-4 h-4 text-amber-600" />
            <span>Mural, Pets & Desapego</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              abaPrincipal === "mural" ? "bg-amber-200 text-amber-950" : "bg-slate-300 text-slate-700"
            }`}>
              {pedidosMural.length}
            </span>
          </button>
        </div>
      </div>

      {abaPrincipal === "mural" ? (
        /* Visualização do Mural Comunitário */
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 pt-3">
          <MuralView
            pedidos={pedidosMural}
            servicosCadastrados={servicos}
            onAtualizar={carregarDados}
          />
        </main>
      ) : (
        /* Visualização do Catálogo de Serviços */
        <>
          {/* Carrossel de Categorias */}
          <CategoryFilter
            categoriaSelecionada={categoriaSelecionada}
            onSelecionarCategoria={setCategoriaSelecionada}
            contagemPorCategoria={contagemPorCategoria}
          />

          {/* Barra de Filtro de Bairros e Plantão de Fim de Semana */}
          <NeighborhoodFilter
            bairroSelecionado={bairroSelecionado}
            onSelecionarBairro={setBairroSelecionado}
            apenasFimDeSemana={apenasFimDeSemana}
            onToggleFimDeSemana={() => setApenasFimDeSemana(!apenasFimDeSemana)}
          />

          {/* Filtros Rápidos Comunitários (Ofertas, Moradores, Favoritos, Domicílio) */}
          <div
            onWheel={(e) => {
              if (Math.abs(e.deltaY) > 0) {
                e.currentTarget.scrollLeft += e.deltaY;
              }
            }}
            className="max-w-4xl w-full mx-auto px-4 pt-2 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs scroll-smooth"
          >
            {/* Filtro de Ofertas da Vizinhança */}
            <button
              onClick={() => setApenasOfertas(!apenasOfertas)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                apenasOfertas
                  ? "bg-amber-400 text-amber-950 shadow-sm ring-2 ring-amber-300"
                  : "bg-white text-gray-700 border border-slate-200 hover:bg-amber-50 hover:text-amber-950"
              }`}
            >
              <span>🏷️ Ofertas da Vizinhança</span>
            </button>

            {/* Filtro de Morador do Bairro */}
            <button
              onClick={() => setApenasMorador(!apenasMorador)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                apenasMorador
                  ? "bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-500/30"
                  : "bg-white text-gray-700 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-800"
              }`}
            >
              <span>🏡 Moradores do Bairro</span>
            </button>

            {/* Filtro de Favoritos */}
            <button
              onClick={() => setApenasFavoritos(!apenasFavoritos)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                apenasFavoritos
                  ? "bg-rose-500 text-white shadow-sm ring-2 ring-rose-400/30"
                  : "bg-white text-gray-700 border border-slate-200 hover:bg-rose-50 hover:text-rose-600"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${apenasFavoritos ? "fill-white" : "text-rose-500"}`} />
              <span>Salvos ({favoritosIds.length})</span>
            </button>

            {/* Filtro de Domicílio */}
            <button
              onClick={() =>
                setFiltroAtendimento(filtroAtendimento === "domicilio" ? "todos" : "domicilio")
              }
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                filtroAtendimento === "domicilio"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-gray-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span>🛵 Vai a Domicílio</span>
            </button>

            {/* Filtro No Local Fixo */}
            <button
              onClick={() =>
                setFiltroAtendimento(filtroAtendimento === "local" ? "todos" : "local")
              }
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                filtroAtendimento === "local"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-gray-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span>🏢 No Espaço / Loja</span>
            </button>
          </div>

          {/* Abas de Ordenação Inteligente */}
          <SortTabs
            ordenacaoAtual={ordenacao}
            onMudarOrdenacao={setOrdenacao}
          />

          {/* Destaque Ativo de Plantão de Emergência */}
          {apenasFimDeSemana && (
            <div className="mx-4 mt-2.5 p-2.5 bg-amber-100 border border-amber-300 rounded-2xl flex items-center justify-between text-xs text-amber-950 shadow-2xs max-w-4xl sm:mx-auto">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <span className="font-bold">
                  Filtrando profissionais com atendimento em fins de semana e emergência
                </span>
              </div>
              <button
                onClick={() => setApenasFimDeSemana(false)}
                className="text-[11px] underline font-bold text-amber-900 cursor-pointer ml-2"
              >
                Limpar
              </button>
            </div>
          )}

          {/* Feed Principal de Serviços */}
          <main className="flex-1 max-w-4xl w-full mx-auto px-4 pt-3">
            {carregando ? (
              <div className="py-16 text-center flex flex-col items-center justify-center text-gray-400">
                <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
                <p className="text-xs font-medium">Carregando recomendações do Jd. Regente...</p>
              </div>
            ) : servicosOrdenados.length === 0 ? (
              /* Estado Vazio */
              <div className="py-14 text-center px-4 bg-white rounded-3xl border border-gray-200/70 shadow-xs my-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  Nenhuma indicação encontrada
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  {apenasFavoritos
                    ? "Você ainda não salvou nenhum contato como favorito. Clique no coração dos cards para salvar!"
                    : "Não encontramos nenhum serviço com os filtros selecionados. Seja o primeiro a indicar um bom profissional!"}
                </p>
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
                  <Link
                    href="/cadastrar"
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Indicar esse contato agora</span>
                  </Link>
                  <button
                    onClick={() => {
                      setBusca("");
                      setCategoriaSelecionada("Todos");
                      setBairroSelecionado("Todos os Bairros");
                      setApenasFimDeSemana(false);
                      setApenasFavoritos(false);
                      setApenasMorador(false);
                      setFiltroAtendimento("todos");
                    }}
                    className="text-xs text-gray-500 hover:text-gray-900 underline py-1 cursor-pointer"
                  >
                    Limpar todos os filtros
                  </button>
                </div>
              </div>
            ) : (
              /* Lista de Cards */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                {servicosOrdenados.map((item) => (
                  <ServiceCard
                    key={item.id}
                    servico={item}
                    salvo={favoritosIds.includes(item.id)}
                    onToggleFavorito={(id) => toggleFavorite(id)}
                    onAtualizar={carregarDados}
                  />
                ))}
              </div>
            )}
          </main>
        </>
      )}

      {/* Modal de Divulgação Comunitária com QR Code */}
      <ShareCommunityModal
        isOpen={modalDivulgacaoAberto}
        onClose={() => setModalDivulgacaoAberto(false)}
      />

      {/* Barra de Navegação Inferior Mobile */}
      <BottomNav
        onFiltroTopAvaliados={() => setOrdenacao("melhores")}
        onIrParaInicio={irParaGuiaServicos}
      />
    </div>
  );
}
