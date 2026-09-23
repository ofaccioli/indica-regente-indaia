"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Sparkles,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ExternalLink,
  Loader2,
  AlertCircle,
  HelpCircle,
  Link as LinkIcon,
  Layers,
  Star,
  Check,
  Building,
  Info,
} from "lucide-react";
import { CATEGORIAS_DISPONIVEIS, BAIRROS_INDAIATUBA } from "@/types";
import { GooglePlaceResult } from "@/lib/googlePlaces";

interface GooglePlacesImporterProps {
  onImportado: () => void;
}

export function GooglePlacesImporter({ onImportado }: GooglePlacesImporterProps) {
  const [abaInterna, setAbaInterna] = useState<"massa" | "link">("massa");

  // Estado da Busca em Massa
  const [categoria, setCategoria] = useState("Todos");
  const [termoBusca, setTermoBusca] = useState("");
  const [minRating, setMinRating] = useState("0");
  const [proximidade, setProximidade] = useState<"todas" | "regente" | "centro" | "morada">("todas");
  const [carregandoBusca, setCarregandoBusca] = useState(false);
  const [lugares, setLugares] = useState<GooglePlaceResult[]>([]);
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [isApiKeyAtiva, setIsApiKeyAtiva] = useState(false);
  const [importandoMassa, setImportandoMassa] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [modalAjudaApiKey, setModalAjudaApiKey] = useState(false);

  // Estado da Importação por Link
  const [urlMaps, setUrlMaps] = useState("");
  const [carregandoLink, setCarregandoLink] = useState(false);
  const [lugarLink, setLugarLink] = useState<any | null>(null);
  const [salvandoLink, setSalvandoLink] = useState(false);
  const [erroLink, setErroLink] = useState<string | null>(null);

  // Carrega catálogo inicial ao abrir ou mudar filtros rápidos
  useEffect(() => {
    handleBuscar();
  }, [categoria, minRating, proximidade]);

  const handleBuscar = async () => {
    setCarregandoBusca(true);
    setMensagemSucesso(null);
    try {
      const params = new URLSearchParams({
        categoria,
        termo: termoBusca,
        minRating,
        proximidade,
      });

      const res = await fetch(`/api/admin/google-places/search?${params.toString()}`);
      const data = await res.json();

      if (data.sucesso) {
        setLugares(data.lugares || []);
        setIsApiKeyAtiva(Boolean(data.isApiKeyAtiva));
        setSelecionados(new Set());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCarregandoBusca(false);
    }
  };

  const toggleSelecionado = (placeId: string) => {
    const novos = new Set(selecionados);
    if (novos.has(placeId)) {
      novos.delete(placeId);
    } else {
      novos.add(placeId);
    }
    setSelecionados(novos);
  };

  const selecionarTodosDisponiveis = () => {
    const disponiveis = lugares.filter((l) => !l.ja_cadastrado).map((l) => l.google_place_id);
    if (selecionados.size === disponiveis.length) {
      setSelecionados(new Set());
    } else {
      setSelecionados(new Set(disponiveis));
    }
  };

  const handleImportarSelecionados = async () => {
    if (selecionados.size === 0) return;

    setImportandoMassa(true);
    setMensagemSucesso(null);

    const paraImportar = lugares
      .filter((l) => selecionados.has(l.google_place_id))
      .map((l) => ({
        nome: l.nome,
        categoria: l.categoria,
        telefone: l.telefone_formatado || l.telefone || "(19) 99999-9999",
        cidade_bairro: `Indaiatuba - ${l.bairro || "Jd. Regente"}`,
        descricao: `${l.nome} com nota ${l.nota_media.toFixed(1)} no Google Maps (${l.total_avaliacoes} avaliações). Endereço: ${l.endereco || "Indaiatuba - SP"}.`,
        quem_indicou: "Google Maps (Bem Avaliado)",
        nota_media: l.nota_media,
        total_avaliacoes: Math.min(l.total_avaliacoes, 999),
        horario_funcionamento: l.horario_funcionamento,
        foto_url: l.foto_url,
        atende_fim_de_semana: true,
        eh_morador: false,
        tipo_atendimento: "local" as const,
        origem: "google" as const,
        google_rating: l.nota_media,
        google_user_ratings_total: l.total_avaliacoes,
        google_place_id: l.google_place_id,
        endereco: l.endereco,
      }));

    try {
      const res = await fetch("/api/admin/servicos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ servicos: paraImportar }),
      });

      const data = await res.json();
      if (data.sucesso) {
        const msg = data.duplicados > 0
          ? `🎉 Sucesso! ${data.inseridos} estabelecimento(s) cadastrado(s) no app. (${data.duplicados} já existentes/duplicados foram pulados)`
          : `🎉 Sucesso! ${data.inseridos || paraImportar.length} estabelecimento(s) cadastrado(s) no app!`;
        setMensagemSucesso(msg);
        setSelecionados(new Set());
        handleBuscar();
        onImportado();
      } else {
        alert("Ocorreu um erro ao importar os serviços selecionados.");
      }
    } catch (err) {
      console.error(err);
      alert("Falha na comunicação com o servidor.");
    } finally {
      setImportandoMassa(false);
    }
  };

  // Importar por Link do Google Maps
  const handleConsultarLink = async () => {
    if (!urlMaps.trim()) {
      setErroLink("Por favor, cole um link ou nome do local.");
      return;
    }

    setCarregandoLink(true);
    setErroLink(null);
    setLugarLink(null);

    try {
      const res = await fetch("/api/admin/google-places/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlMaps.trim() }),
      });

      const data = await res.json();
      if (data.sucesso && data.lugar) {
        setLugarLink(data.lugar);
      } else {
        setErroLink(data.erro || "Não foi possível carregar os dados deste link.");
      }
    } catch (err) {
      console.error(err);
      setErroLink("Falha ao consultar link.");
    } finally {
      setCarregandoLink(false);
    }
  };

  const handleSalvarLugarLink = async () => {
    if (!lugarLink || !lugarLink.nome || !lugarLink.telefone) {
      alert("Por favor, preencha pelo menos Nome e Telefone do estabelecimento.");
      return;
    }

    setSalvandoLink(true);
    try {
      const payload = {
        nome: lugarLink.nome,
        categoria: lugarLink.categoria,
        telefone: lugarLink.telefone,
        cidade_bairro: `Indaiatuba - ${lugarLink.bairro || "Jd. Regente"}`,
        descricao: `${lugarLink.nome} com nota ${lugarLink.nota_media || "4.8"} no Google Maps. Endereço: ${lugarLink.endereco || "Indaiatuba - SP"}.`,
        quem_indicou: "Google Maps",
        nota_media: lugarLink.nota_media || 4.8,
        total_avaliacoes: lugarLink.total_avaliacoes || 20,
        horario_funcionamento: lugarLink.horario_funcionamento,
        foto_url: lugarLink.foto_url,
        atende_fim_de_semana: true,
        eh_morador: false,
        tipo_atendimento: "local" as const,
        origem: "google" as const,
        endereco: lugarLink.endereco,
      };

      const res = await fetch("/api/admin/servicos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ servico: payload }),
      });

      const data = await res.json();
      if (data.sucesso) {
        alert("✅ Estabelecimento cadastrado com sucesso!");
        setUrlMaps("");
        setLugarLink(null);
        onImportado();
      } else {
        alert(data.erro || "Erro ao cadastrar estabelecimento.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar serviço.");
    } finally {
      setSalvandoLink(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner Principal com Alternador de Modos */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-md border border-indigo-900/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl flex-shrink-0 shadow-lg shadow-amber-400/20">
              <Sparkles className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-black leading-tight">Importador do Google Maps</h2>
                {isApiKeyAtiva ? (
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    API Google Ativa
                  </span>
                ) : (
                  <button
                    onClick={() => setModalAjudaApiKey(true)}
                    className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 hover:bg-amber-500/30 transition cursor-pointer"
                  >
                    <Info className="w-3 h-3" />
                    Catálogo Curado (Como ativar API?)
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Adicione comércios, lojas e serviços de alta reputação (nota 4.5+ no Google) com telefones reais, endereços, horários e fotos sem precisar digitar tudo manualmente.
              </p>
            </div>
          </div>

          {/* Abas Internas */}
          <div className="flex bg-slate-800/80 p-1 rounded-2xl border border-slate-700/80 flex-shrink-0">
            <button
              onClick={() => setAbaInterna("massa")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                abaInterna === "massa"
                  ? "bg-amber-400 text-slate-950 shadow-md"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Busca em Massa</span>
            </button>
            <button
              onClick={() => setAbaInterna("link")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                abaInterna === "link"
                  ? "bg-amber-400 text-slate-950 shadow-md"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Importar por Link</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODO 1: BUSCA EM MASSA */}
      {abaInterna === "massa" && (
        <div className="space-y-4">
          {/* Barra de Filtros */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 text-xs">
              {/* Termo */}
              <div className="sm:col-span-4 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  placeholder="Nome, palavra ou serviço (Ex: farmácia, mercado, pizza)..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition font-medium"
                  onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
                />
              </div>

              {/* Categoria */}
              <div className="sm:col-span-3">
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition font-medium"
                >
                  <option value="Todos">Todas as Categorias</option>
                  <option value="Barbearia / Cabeleireiro">Barbearias & Salões</option>
                  <option value="Lava Rápido / Estética Automotiva">Lava Rápido & Estética</option>
                  <option value="Dentista / Odontologia">Dentistas & Odontologia</option>
                  <option value="Médico / Clínicas & Consultórios">Médicos & Consultórios</option>
                  <option value="Psicólogo / Terapia & Saúde Mental">Psicólogos & Saúde Mental</option>
                  <option value="Açougue / Casa de Carnes">Açougues & Carnes</option>
                  <option value="Sorveteria / Açaí">Sorveterias & Açaí</option>
                  <option value="Restaurante / Lanche">Pizzarias & Lanchonetes</option>
                  <option value="Bolos / Doces / Salgados">Padarias & Doces</option>
                  <option value="Chaveiro / Fechaduras">Chaveiros 24h</option>
                  <option value="Pet / Veterinário">Pet Shop & Veterinários</option>
                  <option value="Mecânico">Mecânica, Auto & Pneus</option>
                  <option value="Ar Condicionado">Ar Condicionado</option>
                  <option value="Conserto de Eletrodomésticos">Eletrodomésticos</option>
                  <option value="Bicicletaria / Bike">Bicicletarias</option>
                  <option value="Beleza / Estética">Estética & Beleza</option>
                  <option value="Vidraçaria / Box & Espelhos">Vidraçarias</option>
                  <option value="Saúde / Terapia">Farmácias & Saúde</option>
                  <option value="Eletricista">Eletricistas</option>
                  <option value="Encanador">Encanadores</option>
                  <option value="Jardinagem / Piscina">Jardim & Piscina</option>
                  <option value="Serralheria / Portões">Serralheria</option>
                  <option value="Gás & Água Mineral">Gás & Água</option>
                  <option value="Lavanderia / Passadeira">Lavanderias</option>
                </select>
              </div>

              {/* Filtro de Proximidade / Bairro */}
              <div className="sm:col-span-3">
                <select
                  value={proximidade}
                  onChange={(e: any) => setProximidade(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50/40 text-emerald-950 font-bold focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                >
                  <option value="todas">📍 Toda Indaiatuba (Mais perto primeiro)</option>
                  <option value="regente">🏡 Só Vizinhos ao Jd. Regente (Até 1.5 km)</option>
                  <option value="centro">🏙️ Só Região Central (2 a 4 km)</option>
                  <option value="morada">🏠 Só Morada do Sol / Região Sul</option>
                </select>
              </div>

              {/* Filtro de Nota */}
              <div className="sm:col-span-2">
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition font-medium"
                >
                  <option value="0">⭐ Todas as notas</option>
                  <option value="4.0">⭐ 4.0+ estrelas</option>
                  <option value="4.5">⭐ 4.5+ estrelas</option>
                  <option value="4.8">⭐ 4.8+ estrelas</option>
                </select>
              </div>
            </div>

            {/* Chips Rápidos de Filtro */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] pt-1">
              <button
                type="button"
                onClick={() => setProximidade(proximidade === "regente" ? "todas" : "regente")}
                className={`px-3 py-1 rounded-full font-bold transition flex items-center gap-1 cursor-pointer flex-shrink-0 ${
                  proximidade === "regente"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100"
                }`}
              >
                <span>🏡 Só Pertinho do Jd. Regente</span>
              </button>

              <button
                type="button"
                onClick={() => setCategoria(categoria === "Barbearia / Cabeleireiro" ? "Todos" : "Barbearia / Cabeleireiro")}
                className={`px-2.5 py-1 rounded-full font-medium transition cursor-pointer flex-shrink-0 ${
                  categoria === "Barbearia / Cabeleireiro"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                💈 Barbearias
              </button>

              <button
                type="button"
                onClick={() => setCategoria(categoria === "Lava Rápido / Estética Automotiva" ? "Todos" : "Lava Rápido / Estética Automotiva")}
                className={`px-2.5 py-1 rounded-full font-medium transition cursor-pointer flex-shrink-0 ${
                  categoria === "Lava Rápido / Estética Automotiva"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                🚗 Lava Rápido
              </button>

              <button
                type="button"
                onClick={() => setCategoria(categoria === "Dentista / Odontologia" ? "Todos" : "Dentista / Odontologia")}
                className={`px-2.5 py-1 rounded-full font-medium transition cursor-pointer flex-shrink-0 ${
                  categoria === "Dentista / Odontologia"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                🦷 Dentistas
              </button>

              <button
                type="button"
                onClick={() => setCategoria(categoria === "Médico / Clínicas & Consultórios" ? "Todos" : "Médico / Clínicas & Consultórios")}
                className={`px-2.5 py-1 rounded-full font-medium transition cursor-pointer flex-shrink-0 ${
                  categoria === "Médico / Clínicas & Consultórios"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                🩺 Médicos & Clínicas
              </button>

              <button
                type="button"
                onClick={() => setCategoria(categoria === "Psicólogo / Terapia & Saúde Mental" ? "Todos" : "Psicólogo / Terapia & Saúde Mental")}
                className={`px-2.5 py-1 rounded-full font-medium transition cursor-pointer flex-shrink-0 ${
                  categoria === "Psicólogo / Terapia & Saúde Mental"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                🧠 Psicólogos
              </button>

              <button
                type="button"
                onClick={() => setCategoria(categoria === "Açougue / Casa de Carnes" ? "Todos" : "Açougue / Casa de Carnes")}
                className={`px-2.5 py-1 rounded-full font-medium transition cursor-pointer flex-shrink-0 ${
                  categoria === "Açougue / Casa de Carnes"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                🥩 Açougues
              </button>

              <button
                type="button"
                onClick={() => setCategoria(categoria === "Sorveteria / Açaí" ? "Todos" : "Sorveteria / Açaí")}
                className={`px-2.5 py-1 rounded-full font-medium transition cursor-pointer flex-shrink-0 ${
                  categoria === "Sorveteria / Açaí"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                🍦 Sorvetes & Açaí
              </button>

              <button
                type="button"
                onClick={() => setCategoria(categoria === "Restaurante / Lanche" ? "Todos" : "Restaurante / Lanche")}
                className={`px-2.5 py-1 rounded-full font-medium transition cursor-pointer flex-shrink-0 ${
                  categoria === "Restaurante / Lanche"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                🍕 Pizzas & Lanches
              </button>

              <button
                type="button"
                onClick={() => setCategoria(categoria === "Bolos / Doces / Salgados" ? "Todos" : "Bolos / Doces / Salgados")}
                className={`px-2.5 py-1 rounded-full font-medium transition cursor-pointer flex-shrink-0 ${
                  categoria === "Bolos / Doces / Salgados"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                🥖 Padarias
              </button>

              <button
                type="button"
                onClick={() => setCategoria(categoria === "Chaveiro / Fechaduras" ? "Todos" : "Chaveiro / Fechaduras")}
                className={`px-2.5 py-1 rounded-full font-medium transition cursor-pointer flex-shrink-0 ${
                  categoria === "Chaveiro / Fechaduras"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                🔑 Chaveiros 24h
              </button>

              <button
                type="button"
                onClick={() => setCategoria(categoria === "Pet / Veterinário" ? "Todos" : "Pet / Veterinário")}
                className={`px-2.5 py-1 rounded-full font-medium transition cursor-pointer flex-shrink-0 ${
                  categoria === "Pet / Veterinário"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                🐶 Pets & Vet
              </button>

              <button
                type="button"
                onClick={() => setCategoria(categoria === "Mecânico" ? "Todos" : "Mecânico")}
                className={`px-2.5 py-1 rounded-full font-medium transition cursor-pointer flex-shrink-0 ${
                  categoria === "Mecânico"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                🔧 Mecânicas
              </button>

              <button
                type="button"
                onClick={() => setCategoria(categoria === "Saúde / Terapia" ? "Todos" : "Saúde / Terapia")}
                className={`px-2.5 py-1 rounded-full font-medium transition cursor-pointer flex-shrink-0 ${
                  categoria === "Saúde / Terapia"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                💊 Farmácias
              </button>
            </div>

            <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
              <span className="text-xs text-slate-500 font-medium">
                {lugares.length} estabelecimentos encontrados em Indaiatuba (priorizando os mais próximos ao Jd. Regente)
              </span>

              <button
                type="button"
                onClick={handleBuscar}
                disabled={carregandoBusca}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-xs cursor-pointer"
              >
                {carregandoBusca ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Search className="w-3.5 h-3.5" />
                )}
                <span>Filtrar Resultados</span>
              </button>
            </div>
          </div>

          {/* Mensagem de Sucesso */}
          {mensagemSucesso && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 font-bold flex items-center justify-between animate-fade-in shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{mensagemSucesso}</span>
              </div>
              <button
                onClick={() => setMensagemSucesso(null)}
                className="text-emerald-700 hover:text-emerald-950 font-bold text-xs"
              >
                ✕
              </button>
            </div>
          )}

          {/* Barra de Ação em Lote */}
          {lugares.length > 0 && (
            <div className="bg-slate-900 text-white rounded-2xl p-3.5 flex items-center justify-between flex-wrap gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={selecionarTodosDisponiveis}
                  className="text-xs font-bold text-slate-300 hover:text-white underline cursor-pointer"
                >
                  {selecionados.size === lugares.filter((l) => !l.ja_cadastrado).length && selecionados.size > 0
                    ? "Desmarcar todos"
                    : "Selecionar todos disponíveis"}
                </button>
                <span className="text-xs bg-slate-800 text-amber-300 px-2.5 py-1 rounded-full font-bold">
                  {selecionados.size} selecionado(s)
                </span>
              </div>

              <button
                type="button"
                onClick={handleImportarSelecionados}
                disabled={selecionados.size === 0 || importandoMassa}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition active:scale-95 shadow-md ${
                  selecionados.size === 0
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer"
                }`}
              >
                {importandoMassa ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Importar Selecionados ({selecionados.size})</span>
              </button>
            </div>
          )}

          {/* Grid de Lugares */}
          {carregandoBusca ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">Consultando estabelecimentos no Google...</p>
            </div>
          ) : lugares.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
              <Building className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700">Nenhum resultado com esses filtros</h3>
              <p className="text-xs text-slate-400 mt-1">Tente diminuir a nota mínima ou buscar por outro termo.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {lugares.map((lugar) => {
                const isSelected = selecionados.has(lugar.google_place_id);

                return (
                  <div
                    key={lugar.google_place_id}
                    onClick={() => !lugar.ja_cadastrado && toggleSelecionado(lugar.google_place_id)}
                    className={`bg-white rounded-3xl p-4 border transition-all duration-200 flex flex-col justify-between gap-3 shadow-2xs relative ${
                      lugar.ja_cadastrado
                        ? "border-slate-200 bg-slate-50/60 opacity-80"
                        : isSelected
                        ? "border-emerald-500 ring-2 ring-emerald-200/80 shadow-md cursor-pointer"
                        : "border-slate-200/90 hover:border-slate-300 hover:shadow-sm cursor-pointer"
                    }`}
                  >
                    {/* Topo do Card */}
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <div className="pt-0.5">
                        {lugar.ja_cadastrado ? (
                          <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]" title="Já cadastrado no app">
                            ✓
                          </div>
                        ) : (
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                              isSelected
                                ? "bg-emerald-600 border-emerald-600 text-white"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        )}
                      </div>

                      {/* Foto ou Ícone */}
                      {lugar.foto_url ? (
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={lugar.foto_url}
                            alt={lugar.nome}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl flex-shrink-0">
                          🏬
                        </div>
                      )}

                      {/* Info do Local */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {lugar.proximidade_tier === 1 ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                              <MapPin className="w-3 h-3 text-emerald-700" />
                              <span>Pertinho do Jd. Regente</span>
                            </span>
                          ) : lugar.proximidade_tier === 2 ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                              <span>Centro (2 a 4 km)</span>
                            </span>
                          ) : lugar.proximidade_tier === 4 ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                              <span>Morada do Sol</span>
                            </span>
                          ) : null}

                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            {lugar.categoria}
                          </span>

                          <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                            <Star className="w-3 h-3 text-amber-600 fill-amber-500" />
                            <span>{lugar.nota_media.toFixed(1)}</span>
                            <span className="text-amber-700 font-medium">({lugar.total_avaliacoes})</span>
                          </span>

                          {lugar.ja_cadastrado && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                              No App
                            </span>
                          )}
                        </div>

                        <h4 className="font-extrabold text-sm text-slate-900 mt-1 leading-snug truncate">
                          {lugar.nome}
                        </h4>

                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 truncate">
                          <MapPin className="w-3 h-3 flex-shrink-0 text-slate-400" />
                          <span>{lugar.bairro} • {lugar.endereco}</span>
                        </div>
                      </div>
                    </div>

                    {/* Detalhes de Rodapé */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 gap-2 flex-wrap">
                      <div className="flex items-center gap-1 font-semibold text-slate-700">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{lugar.telefone_formatado || lugar.telefone || "Telefone disponível"}</span>
                      </div>

                      {lugar.horario_funcionamento && (
                        <div className="flex items-center gap-1 text-slate-400 truncate max-w-[180px]">
                          <Clock className="w-3 h-3" />
                          <span className="truncate">{lugar.horario_funcionamento}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODO 2: IMPORTAR POR LINK DO GOOGLE MAPS */}
      {abaInterna === "link" && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4 max-w-2xl mx-auto">
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-900">Importar por Link ou Nome</h3>
            <p className="text-xs text-slate-500">
              Cole o link de compartilhamento do Google Maps (ex: <code>https://maps.app.goo.gl/...</code>) ou digite o nome exato do estabelecimento em Indaiatuba:
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={urlMaps}
              onChange={(e) => setUrlMaps(e.target.value)}
              placeholder="Cole o link do Google Maps aqui..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-medium"
              onKeyDown={(e) => e.key === "Enter" && handleConsultarLink()}
            />
            <button
              type="button"
              onClick={handleConsultarLink}
              disabled={carregandoLink}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs cursor-pointer flex-shrink-0"
            >
              {carregandoLink ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>Consultar Dados</span>
            </button>
          </div>

          {erroLink && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{erroLink}</span>
            </div>
          )}

          {/* Card de Pré-visualização e Edição */}
          {lugarLink && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3.5 animate-fade-in mt-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Dados Encontrados no Google</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  ⭐ {lugarLink.nota_media || "4.8"} ({lugarLink.total_avaliacoes || 10} avaliações)
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nome do Estabelecimento</label>
                  <input
                    type="text"
                    value={lugarLink.nome}
                    onChange={(e) => setLugarLink({ ...lugarLink, nome: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Categoria no App</label>
                    <select
                      value={lugarLink.categoria}
                      onChange={(e) => setLugarLink({ ...lugarLink, categoria: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium outline-none text-xs"
                    >
                      {CATEGORIAS_DISPONIVEIS.filter((c) => c !== "Todos").map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Bairro de Indaiatuba</label>
                    <select
                      value={lugarLink.bairro || "Jd. Regente"}
                      onChange={(e) => setLugarLink({ ...lugarLink, bairro: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium outline-none text-xs"
                    >
                      {BAIRROS_INDAIATUBA.filter((b) => b !== "Todos os Bairros").map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Telefone / WhatsApp</label>
                    <input
                      type="text"
                      value={lugarLink.telefone}
                      onChange={(e) => setLugarLink({ ...lugarLink, telefone: e.target.value })}
                      placeholder="(19) 99999-9999"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Horário de Atendimento</label>
                    <input
                      type="text"
                      value={lugarLink.horario_funcionamento || ""}
                      onChange={(e) => setLugarLink({ ...lugarLink, horario_funcionamento: e.target.value })}
                      placeholder="Ex: Seg a Sáb: 08h às 18h"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Endereço Completo</label>
                  <input
                    type="text"
                    value={lugarLink.endereco || ""}
                    onChange={(e) => setLugarLink({ ...lugarLink, endereco: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium outline-none"
                  />
                </div>

                {/* Preview e URL da Imagem do Estabelecimento */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
                  {lugarLink.foto_url ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={lugarLink.foto_url}
                        alt={lugarLink.nome}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl flex-shrink-0">
                      🏬
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Foto do Local (URL da Imagem)
                    </label>
                    <input
                      type="url"
                      value={lugarLink.foto_url || ""}
                      onChange={(e) => setLugarLink({ ...lugarLink, foto_url: e.target.value })}
                      placeholder="https://exemplo.com/foto.jpg"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-xs font-medium outline-none focus:bg-white focus:border-indigo-500"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {lugarLink.foto_url ? "✓ Foto carregada automaticamente." : "Cole um link de foto ou deixe em branco para usar a foto padrão da categoria."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setLugarLink(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSalvarLugarLink}
                  disabled={salvandoLink}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                >
                  {salvandoLink ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>Confirmar e Cadastrar no App</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Explicativo da API Google Places */}
      {modalAjudaApiKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-600" />
                <span>Como ativar a Google Places API?</span>
              </h3>
              <button
                onClick={() => setModalAjudaApiKey(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <p>
                O app já funciona imediatamente com a <strong>lista curada de alta reputação de Indaiatuba</strong> sem você precisar configurar nada.
              </p>
              <p>
                Para fazer <strong>buscas em tempo real de qualquer loja ou comércio</strong> direto da base mundial do Google Maps:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 pl-1 font-medium text-slate-700">
                <li>Acesse o <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" className="text-indigo-600 font-bold underline">Google Cloud Console</a>.</li>
                <li>Crie um projeto e ative a <strong>&quot;Places API (New)&quot;</strong>.</li>
                <li>Em <em>Credenciais</em>, gere uma chave de API (API Key).</li>
                <li>O Google dá <strong>$200 de crédito gratuito todo mês</strong> (mais de 10.000 buscas gratuitas).</li>
                <li>Adicione nas variáveis da Vercel ou no seu <code>.env.local</code>:
                  <code className="block bg-slate-100 text-indigo-900 p-2 rounded-lg mt-1 font-mono text-[11px]">
                    GOOGLE_PLACES_API_KEY=sua-chave-aqui
                  </code>
                </li>
              </ol>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setModalAjudaApiKey(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
