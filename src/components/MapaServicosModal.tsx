"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { X, MapPin, Star, MessageCircle, Navigation, Layers, Clock, AlertCircle } from "lucide-react";
import { Servico } from "@/types";
import { verificarAbertoAgora, limparTelefone } from "@/lib/utils";

interface MapaServicosModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicos: Servico[];
}

// Centro de referência do Jardim Regente, Indaiatuba - SP
const CENTRO_JD_REGENTE: [number, number] = [-23.1044, -47.2081];

// Coordenadas aproximadas dos bairros de Indaiatuba para posicionamento inteligente
const COORDENADAS_BAIRROS: Record<string, [number, number]> = {
  regente: [-23.1044, -47.2081],
  valen: [-23.1015, -47.205],
  itamarac: [-23.106, -47.211],
  "gran reserve": [-23.109, -47.2005],
  rubens: [-23.0995, -47.2115],
  "santa rita": [-23.102, -47.214],
  "avaí": [-23.0965, -47.2085],
  avai: [-23.0965, -47.2085],
  "cidade nova": [-23.098, -47.216],
  centro: [-23.0903, -47.2181],
  "pau preto": [-23.0875, -47.222],
  primavera: [-23.085, -47.215],
  "ecol": [-23.094, -47.21],
  "morada do sol": [-23.118, -47.229],
  cecap: [-23.084, -47.202],
  itaici: [-23.103, -47.165],
  helvetia: [-23.072, -47.168],
};

function resolverCoordenadas(s: Servico, idx: number): [number, number] {
  if (s.latitude && s.longitude) {
    return [s.latitude, s.longitude];
  }

  const bLower = (s.cidade_bairro || "").toLowerCase();
  let base = CENTRO_JD_REGENTE;

  for (const [key, coords] of Object.entries(COORDENADAS_BAIRROS)) {
    if (bLower.includes(key)) {
      base = coords;
      break;
    }
  }

  // Jitter determinístico para evitar sobreposição exata de pins no mesmo bairro
  const angulo = (idx * 137.5 * Math.PI) / 180;
  const raio = 0.0008 + ((idx % 7) * 0.0004); // ~80m a 350m
  const latOffset = Math.sin(angulo) * raio;
  const lngOffset = Math.cos(angulo) * raio;

  return [base[0] + latOffset, base[1] + lngOffset];
}

export function MapaServicosModal({ isOpen, onClose, servicos }: MapaServicosModalProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
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
          zoom: 15,
          zoomControl: false,
        });

        L.control.zoom({ position: "bottomright" }).addTo(map);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        // Ícone customizado para o centro do Jardim Regente
        const regenteIcon = L.divIcon({
          className: "custom-regente-icon",
          html: `<div style="background-color: #047857; color: white; border: 2px solid white; border-radius: 9999px; padding: 4px 8px; font-weight: 900; font-size: 11px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 4px; white-space: nowrap;">🏡 Jd. Regente</div>`,
          iconSize: [110, 28],
          iconAnchor: [55, 14],
        });
        L.marker(CENTRO_JD_REGENTE, { icon: regenteIcon }).addTo(map).bindPopup("<b>Jardim Regente, Indaiatuba</b><br/>Coração da nossa comunidade!");

        // Ícones para os estabelecimentos
        servicosFiltrados.forEach((s, idx) => {
          const [lat, lng] = resolverCoordenadas(s, idx);
          const status = verificarAbertoAgora(s.horario_funcionamento);
          const telDigits = limparTelefone(s.telefone);
          const zapUrl = `https://wa.me/55${telDigits}?text=${encodeURIComponent(
            `Olá! Vi o contato de ${s.nome} no Mapa do Indica Jd. Regente.`
          )}`;
          const rotaUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
            `${s.nome}, ${s.cidade_bairro}, Indaiatuba - SP`
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
              s.categoria.includes("Restaurante") || s.categoria.includes("Lanche")
                ? "🍕"
                : s.categoria.includes("Barbearia")
                ? "💈"
                : s.categoria.includes("Pet")
                ? "🐶"
                : s.categoria.includes("Médic") || s.categoria.includes("Dentista")
                ? "🩺"
                : "📍"
            }</div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });

          const popupContent = `
            <div style="font-family: inherit; min-width: 200px; padding: 2px;">
              <div style="display:flex; align-items:center; justify-content:space-between; gap:4px; margin-bottom:4px;">
                <span style="font-size:10px; font-weight:bold; color:#047857; text-transform:uppercase;">${s.categoria}</span>
                ${statusHtml}
              </div>
              <h3 style="font-size:14px; font-weight:900; margin:0 0 2px 0; color:#0f172a; line-height:1.2;">${s.nome}</h3>
              <p style="font-size:11px; color:#64748b; margin:0 0 6px 0;">📍 ${s.cidade_bairro}</p>
              
              <div style="display:flex; align-items:center; gap:4px; margin-bottom:8px; font-size:11px; font-weight:bold; color:#b45309;">
                ⭐ ${s.nota_media.toFixed(1)} (${s.total_avaliacoes} avaliações)
              </div>

              ${cardapioBtnHtml}

              <div style="display:grid; grid-template-cols: 1fr 1fr; gap:4px; margin-top:8px;">
                <a href="${zapUrl}" target="_blank" rel="noopener noreferrer" style="display:flex; align-items:center; justify-content:center; gap:4px; font-size:11px; font-weight:bold; background:#059669; color:white; padding:6px 8px; border-radius:8px; text-decoration:none; text-align:center;">
                  WhatsApp
                </a>
                <a href="${rotaUrl}" target="_blank" rel="noopener noreferrer" style="display:flex; align-items:center; justify-content:center; gap:4px; font-size:11px; font-weight:bold; background:#0f172a; color:white; padding:6px 8px; border-radius:8px; text-decoration:none; text-align:center;">
                  Como Chegar
                </a>
              </div>
            </div>
          `;

          L.marker([lat, lng], { icon: markerIcon }).addTo(map).bindPopup(popupContent);
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
                {servicosFiltrados.length} estabelecimentos e profissionais localizados no mapa
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

        {/* Barra de Filtro de Categorias no Mapa */}
        <div className="bg-slate-100/90 p-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px] flex-shrink-0">
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

        {/* Container do Mapa */}
        <div className="flex-1 w-full h-full relative bg-slate-100">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Legenda Flutuante */}
          <div className="absolute bottom-3 left-3 z-20 bg-white/90 backdrop-blur-md rounded-2xl p-2.5 shadow-md border border-slate-200 text-[11px] flex items-center gap-3">
            <span className="flex items-center gap-1 font-bold text-emerald-950">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Aberto Agora
            </span>
            <span className="flex items-center gap-1 font-bold text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
              Outros Serviços
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
