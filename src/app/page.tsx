"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SortTabs } from "@/components/SortTabs";
import { ServiceCard } from "@/components/ServiceCard";
import { BottomNav } from "@/components/BottomNav";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { Servico, TipoOrdenacao } from "@/types";
import { listarServicos } from "@/lib/supabase";
import { ordenarServicos } from "@/lib/ranking";
import { Sparkles, PlusCircle, Award, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
  const [ordenacao, setOrdenacao] = useState<TipoOrdenacao>("melhores");

  // Carrega serviços
  const carregarDados = async () => {
    setCarregando(true);
    try {
      const dados = await listarServicos();
      setServicos(dados);
    } catch (err) {
      console.error("Erro ao carregar serviços:", err);
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

  // Filtra por categoria e texto de busca
  const servicosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    return servicos.filter((item) => {
      const atendeCategoria =
        categoriaSelecionada === "Todos" || item.categoria === categoriaSelecionada;

      if (!atendeCategoria) return false;

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
  }, [servicos, categoriaSelecionada, busca]);

  // Aplica inteligência de ordenação
  const servicosOrdenados = useMemo(() => {
    return ordenarServicos(servicosFiltrados, ordenacao);
  }, [servicosFiltrados, ordenacao]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {/* Banner de instalação PWA */}
      <PWAInstallPrompt />

      {/* Header com pesquisa */}
      <Header
        busca={busca}
        onBuscaChange={setBusca}
      />

      {/* Carrossel de Categorias */}
      <CategoryFilter
        categoriaSelecionada={categoriaSelecionada}
        onSelecionarCategoria={setCategoriaSelecionada}
        contagemPorCategoria={contagemPorCategoria}
      />

      {/* Abas de Ordenação Inteligente */}
      <SortTabs
        ordenacaoAtual={ordenacao}
        onMudarOrdenacao={setOrdenacao}
      />

      {/* Destaque Inteligente para "Top Avaliados" */}
      {ordenacao === "melhores" && !busca && (
        <div className="mx-4 mt-3 p-3 bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-amber-500/10 border border-amber-200/80 rounded-2xl flex items-center gap-2.5 text-xs text-amber-950 shadow-2xs">
          <div className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center flex-shrink-0 font-black shadow-xs">
            ⭐
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-tight flex items-center gap-1">
              <span>Classificação Inteligente da Comunidade</span>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-full font-bold">
                Algoritmo Ativo
              </span>
            </p>
            <p className="text-[11px] text-gray-600 mt-0.5">
              Prioriza profissionais com maior índice de recomendações reais e satisfação comprovada pelos vizinhos.
            </p>
          </div>
        </div>
      )}

      {/* Feed Principal de Serviços */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 pt-3">
        {carregando ? (
          <div className="py-16 text-center flex flex-col items-center justify-center text-gray-400">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
            <p className="text-xs font-medium">Carregando recomendações da comunidade...</p>
          </div>
        ) : servicosOrdenados.length === 0 ? (
          /* Estado Vazio */
          <div className="py-14 text-center px-4 bg-white rounded-2xl border border-gray-200/70 shadow-xs my-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              Nenhuma indicação encontrada
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Não encontramos nenhum serviço para &ldquo;{busca || categoriaSelecionada}&rdquo;. Seja o primeiro a indicar um bom profissional!
            </p>
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
              <Link
                href="/cadastrar"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Indicar esse contato agora</span>
              </Link>
              {(busca || categoriaSelecionada !== "Todos") && (
                <button
                  onClick={() => {
                    setBusca("");
                    setCategoriaSelecionada("Todos");
                  }}
                  className="text-xs text-gray-500 hover:text-gray-900 underline py-1"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Lista de Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {servicosOrdenados.map((item) => (
              <ServiceCard
                key={item.id}
                servico={item}
                onAtualizar={carregarDados}
              />
            ))}
          </div>
        )}
      </main>

      {/* Barra de Navegação Inferior Mobile */}
      <BottomNav onFiltroTopAvaliados={() => setOrdenacao("melhores")} />
    </div>
  );
}
