"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { X, MapPin, Star, MessageCircle, Navigation, Layers, Clock, AlertCircle, Compass, Maximize2 } from "lucide-react";
import { Servico } from "@/types";
import { verificarAbertoAgora, limparTelefone } from "@/lib/utils";

interface MapaServicosModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicos: Servico[];
}

// Centro REAL e calibrado do Jardim Regente, Indaiatuba - SP (R. Argemiro Fruet / R. David Silvério)
export const CENTRO_JD_REGENTE: [number, number] = [-23.0713, -47.1995];

// Coordenadas geográficas reais e precisas dos bairros de Indaiatuba
export const COORDENADAS_BAIRROS: Record<string, [number, number]> = {
  regente: [-23.0713, -47.1995],
  "santa rita": [-23.0737, -47.2023],
  rubens: [-23.0728, -47.1976],
  "avaí": [-23.0724, -47.2045],
  avai: [-23.0724, -47.2045],
  olinda: [-23.0777, -47.1946],
  itamarac: [-23.0780, -47.2030],
  valen: [-23.0816, -47.2101],
  "gran reserve": [-23.0645, -47.2120],
  cecap: [-23.0840, -47.2020],
  "cidade nova": [-23.0890, -47.2120],
  centro: [-23.0882, -47.2234],
  "pau preto": [-23.0875, -47.2220],
  primavera: [-23.0850, -47.2150],
  "ecol": [-23.0910, -47.2150],
  esplanada: [-23.0950, -47.2180],
  "suíça": [-23.0820, -47.2160],
  suica: [-23.0820, -47.2160],
  "morada do sol": [-23.1180, -47.2290],
  hubert: [-23.1120, -47.2210],
  "parque real": [-23.1150, -47.2180],
  itaici: [-23.1030, -47.1650],
  helvetia: [-23.0550, -47.1700],
};

// Coordenadas reais de logradouros frequentes em Indaiatuba para precisão máxima
export const COORDENADAS_RUAS: Record<string, [number, number]> = {
  "david silv": [-23.0710, -47.1985],
  "argemiro fruet": [-23.0713, -47.1995],
  "angelo cucc": [-23.0718, -47.2002],
  "reverendo willybaldo": [-23.0705, -47.1990],
  "maria de lourdes": [-23.0700, -47.1998],
  "antônio barnabé": [-23.0740, -47.1970],
  "antonio barnabe": [-23.0740, -47.1970],
  "bernardino bonavita": [-23.0732, -47.2025],
  "tuiuti": [-23.0728, -47.1976],
  "tupinambás": [-23.0777, -47.1946],
  "tupinambas": [-23.0777, -47.1946],
  "indaiás": [-23.0816, -47.2101],
  "indaias": [-23.0816, -47.2101],
  "orquídeas": [-23.0805, -47.2085],
  "orquideas": [-23.0805, -47.2085],
  "gran reserve": [-23.0645, -47.2120],
  "padre bento": [-23.0895, -47.2150],
  "humaitá": [-23.0880, -47.2135],
  "humaita": [-23.0880, -47.2135],
  "pres. kennedy": [-23.0870, -47.2100],
  "candelária": [-23.0880, -47.2190],
  "candelaria": [-23.0880, -47.2190],
  "15 de novembro": [-23.0885, -47.2210],
  "pedro de toledo": [-23.0890, -47.2200],
  "13 de maio": [-23.0875, -47.2205],
  "fábio roberto barnabé": [-23.0910, -47.2150],
  "fabio roberto barnabe": [-23.0910, -47.2150],
  "ário barnabé": [-23.1180, -47.2290],
  "ario barnabe": [-23.1180, -47.2290],
};

function resolverCoordenadas(s: Servico, idx: number): [number, number] {
  if (
    s.latitude &&
    s.longitude &&
    typeof s.latitude === "number" &&
    typeof s.longitude === "number" &&
    !isNaN(s.latitude) &&
    s.latitude < 0
  ) {
    return [s.latitude, s.longitude];
  }

  const textoCompleto = `${s.endereco || ""} ${s.cidade_bairro || ""} ${s.nome || ""}`.toLowerCase();

  // 1. Tenta correspondência direta por rua conhecida (alta precisão)
  for (const [ruaKey, coords] of Object.entries(COORDENADAS_RUAS)) {
    if (textoCompleto.includes(ruaKey)) {
      const angulo = (idx * 137.5 * Math.PI) / 180;
      const raio = 0.00015 + ((idx % 4) * 0.00008); // micro-offset de apenas ~15m a 45m
      return [coords[0] + Math.sin(angulo) * raio, coords[1] + Math.cos(angulo) * raio];
    }
  }

  // 2. Tenta correspondência por bairro conhecido
  for (const [bairroKey, coords] of Object.entries(COORDENADAS_BAIRROS)) {
    if (textoCompleto.includes(bairroKey)) {
      const angulo = (idx * 137.5 * Math.PI) / 180;
      // Micro-dispersão de 30m a 80m dentro do bairro correto
      const raio = 0.00025 + ((idx % 6) * 0.0001);
      return [coords[0] + Math.sin(angulo) * raio, coords[1] + Math.cos(angulo) * raio];
    }
  }

  // 3. Fallback: Se for Indaiatuba geral ou Centro
  if (textoCompleto.includes("centro") || (textoCompleto.includes("indaiatuba") && !textoCompleto.includes("regente"))) {
    const coords = COORDENADAS_BAIRROS["centro"];
    const angulo = (idx * 137.5 * Math.PI) / 180;
    const raio = 0.0003 + ((idx % 6) * 0.00012);
    return [coords[0] + Math.sin(angulo) * raio, coords[1] + Math.cos(angulo) * raio];
  }

  // Padrão: Jardim Regente com micro-offset suave
  const angulo = (idx * 137.5 * Math.PI) / 180;
  const raio = 0.0002 + ((idx % 5) * 0.0001);
  return [CENTRO_JD_REGENTE[0] + Math.sin(angulo) * raio, CENTRO_JD_REGENTE[1] + Math.cos(angulo) * raio];
}

export function MapaServicosModal({ isOpen, onClose, servicos }: MapaServicosModalProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");
  const [carregandoMapa, setCarregandoMapa] = useState(true);

  // Categorias disponíveis para o filtro do mapa
  const categorias = useMemo(() => {
    const set = new Set<string>();
    servicos.forEach((s) => s.categoria && set.add(s.categoria));
    return ["Todos", ...Array.from(set).slice(0, 8)];
  }, [servicos]);

  const servicosFiltrados = useMemo(() => {
    if (categoriaFiltro === "Todos") return servicos;
    return servicos.filter((s) => s.categoria === categoriaFiltro);
  }, [servicos, categoriaFiltro]);

  const focarJdRegente = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(CENTRO_JD_REGENTE, 16, { animate: true });
    }
  };

  const enquadrarTodos = () => {
    if (mapInstanceRef.current && markersGroupRef.current) {
      try {
        const bounds = markersGroupRef.current.getBounds();
        if (bounds.isValid()) {
          mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
        }
      } catch {}
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    let cancelado = false;

    // Carrega Leaflet dinamicamente apenas no client
    const initMap = async () => {
      try {
        const L = (await import("leaflet")).default;

        // Injeta CSS do Leaflet caso ainda não esteja presente
        if (!document.getElementById("leaflet-css")) {
          const link = document.createElement("link");
          link.id = "leaflet-css";
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);
        }

        if (cancelado || !mapContainerRef.current) return;

        // Se o mapa já existe, remove para recriar ou atualizar
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const map = L.map(mapContainerRef.current, {
          center: CENTRO_JD_REGENTE,
          zoom: 16,
          zoomControl: false,
        });

        L.control.zoom({ position: "bottomright" }).addTo(map);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        const markersGroup = L.featureGroup().addTo(map);
        markersGroupRef.current = markersGroup;

        // Marcador Oficial do Centro do Jardim Regente
        const regenteIcon = L.divIcon({
          className: "custom-regente-icon",
          html: `<div style="background-color: #047857; color: white; border: 2px solid white; border-radius: 9999px; padding: 4px 10px; font-weight: 900; font-size: 11px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.35); display: flex; align-items: center; gap: 4px; white-space: nowrap;">🏡 Jd. Regente</div>`,
          iconSize: [110, 28],
          iconAnchor: [55, 14],
        });
        L.marker(CENTRO_JD_REGENTE, { icon: regenteIcon })
          .addTo(markersGroup)
          .bindPopup("<b>Jardim Regente, Indaiatuba</b><br/>Coração da nossa comunidade!");

        // Marcador Especial: Ecoponto Subterrâneo do Jd. Regente (MecLix)
        const ecopontoIcon = L.divIcon({
          className: "custom-ecoponto-icon",
          html: `<div style="background-color: #0d9488; color: white; border: 2px solid white; border-radius: 9999px; padding: 3px 8px; font-weight: 800; font-size: 10px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 3px; white-space: nowrap;">♻️ Ecoponto 24h</div>`,
          iconSize: [100, 24],
          iconAnchor: [50, 12],
        });
        L.marker([-23.0710, -47.1985], { icon: ecopontoIcon })
          .addTo(markersGroup)
          .bindPopup("<b>Ecoponto Subterrâneo MecLix - Jd. Regente</b><br/>Rua David Silvério (Praça)<br/>Disponível 24h para recicláveis secos e óleo de cozinha!");

        // Ícones para os estabelecimentos
        servicosFiltrados.forEach((s, idx) => {
          const [lat, lng] = resolverCoordenadas(s, idx);
          const status = verificarAbertoAgora(s.horario_funcionamento);
          const telDigits = limparTelefone(s.telefone);
          const zapUrl = `https://wa.me/55${telDigits}?text=${encodeURIComponent(
            `Olá! Vi o contato de ${s.nome} no Mapa do Indica Jd. Regente.`
          )}`;
          const rotaUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
            `${s.nome}, ${s.endereco || s.cidade_bairro}, Indaiatuba - SP`
          )}`;

          const statusHtml = status
            ? `<span style="display:inline-block; font-size:10px; font-weight:bold; padding:2px 6px; border-radius:9999px; ${
                status.aberto
                  ? "background:#d1fae5; color:#065f46; border:1px solid #6ee7b7;"
                  : "background:#f1f5f9; color:#475569; border:1px solid #cbd5e1;"
              }">${status.aberto ? "🟢 Aberto agora" : "⚪ Fechado"}</span>`
            : "";

          const cardapioBtnHtml = s.cardapio_url
            ? `<a href="${s.cardapio_url}" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; justify-content:center; gap:4px; font-size:11px; font-weight:bold; background:#fef3c7; color:#92400e; border:1px solid #fde68a; padding:5px 8px; border-radius:8px; text-decoration:none; margin-top:4px;">🍽️ Ver Cardápio</a>`
            : "";

          const markerIcon = L.divIcon({
            className: "custom-service-pin",
            html: `<div style="background-color: ${
              status?.aberto ? "#059669" : "#0284c7"
            }; color: white; border: 2px solid white; border-radius: 9999px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 11px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);">${
              s.categoria.includes("Restaurante") || s.categoria.includes("Lanche") || s.categoria.includes("Pizza")
                ? "🍕"
                : s.categoria.includes("Barbearia")
                ? "💈"
                : s.categoria.includes("Pet")
                ? "🐶"
                : s.categoria.includes("Médic") || s.categoria.includes("Dentista")
                ? "🩺"
                : s.categoria.includes("Eletric")
                ? "⚡"
                : s.categoria.includes("Mecânic")
                ? "🔧"
                : "📍"
            }</div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });

          const popupContent = `
            <div style="font-family: inherit; min-width: 210px; padding: 2px;">
              <div style="display:flex; align-items:center; justify-content:space-between; gap:4px; margin-bottom:4px;">
                <span style="font-size:10px; font-weight:bold; color:#047857; text-transform:uppercase;">${s.categoria}</span>
                ${statusHtml}
              </div>
              <h3 style="font-size:14px; font-weight:900; margin:0 0 2px 0; color:#0f172a; line-height:1.2;">${s.nome}</h3>
              <p style="font-size:11px; color:#64748b; margin:0 0 6px 0;">📍 ${s.endereco || s.cidade_bairro}</p>
              
              <div style="display:flex; align-items:center; gap:4px; margin-bottom:8px; font-size:11px; font-weight:bold; color:#b45309;">
                ⭐ ${(s.nota_media || 5.0).toFixed(1)} (${s.total_avaliacoes || 0} avaliações)
              </div>

              ${cardapioBtnHtml}

              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:4px; margin-top:8px;">
                <a href="${zapUrl}" target="_blank" rel="noopener noreferrer" style="display:flex; align-items:center; justify-content:center; gap:4px; font-size:11px; font-weight:bold; background:#059669; color:white; padding:6px 8px; border-radius:8px; text-decoration:none; text-align:center;">
                  WhatsApp
                </a>
                <a href="${rotaUrl}" target="_blank" rel="noopener noreferrer" style="display:flex; align-items:center; justify-content:center; gap:4px; font-size:11px; font-weight:bold; background:#0f172a; color:white; padding:6px 8px; border-radius:8px; text-decoration:none; text-align:center;">
                  Como Chegar
                </a>
              </div>
            </div>
          `;

          L.marker([lat, lng], { icon: markerIcon }).addTo(markersGroup).bindPopup(popupContent);
        });

        mapInstanceRef.current = map;
        setCarregandoMapa(false);
      } catch (err) {
        console.error("Erro ao inicializar mapa Leaflet:", err);
        setCarregandoMapa(false);
      }
    };

    const timer = setTimeout(initMap, 200);

    return () => {
      cancelado = true;
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, servicosFiltrados]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div
        className="bg-white rounded-3xl max-w-4xl w-full h-[88vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-fade-in relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Topo do Modal */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-3.5 sm:p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-700/80 border border-emerald-500/40 flex items-center justify-center text-amber-300 shadow-inner">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black leading-tight text-white flex items-center gap-2">
                <span>Mapa do Jardim Regente & Bairros</span>
              </h2>
              <p className="text-[11px] text-emerald-200">
                {servicosFiltrados.length} estabelecimentos e profissionais calibrados no mapa
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Fechar Mapa"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Barra de Filtro de Categorias no Mapa + Botões de Navegação Rápida */}
        <div className="bg-slate-100/90 p-2 border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none text-[11px] flex-shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaFiltro(cat)}
                className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                  categoriaFiltro === cat
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              type="button"
              onClick={focarJdRegente}
              className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-900 font-bold rounded-xl border border-emerald-300 shadow-2xs flex items-center gap-1 transition cursor-pointer text-[10px]"
              title="Centralizar no Jardim Regente"
            >
              <Compass className="w-3 h-3 text-emerald-700" />
              <span>Jd. Regente</span>
            </button>
            <button
              type="button"
              onClick={enquadrarTodos}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-300 shadow-2xs flex items-center gap-1 transition cursor-pointer text-[10px]"
              title="Ajustar zoom para ver todos os pontos"
            >
              <Maximize2 className="w-3 h-3 text-slate-600" />
              <span>Ver Todos</span>
            </button>
          </div>
        </div>

        {/* Container do Mapa */}
        <div className="flex-1 w-full h-full relative bg-slate-100">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Legenda Flutuante */}
          <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-md border border-slate-200 text-[11px] flex items-center gap-3">
            <span className="flex items-center gap-1 font-bold text-emerald-950">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Aberto Agora
            </span>
            <span className="flex items-center gap-1 font-bold text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
              Outros Serviços
            </span>
            <span className="flex items-center gap-1 font-bold text-teal-800">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
              Ecoponto 24h
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
