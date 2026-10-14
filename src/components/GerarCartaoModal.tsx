"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Download, Share2, Sparkles, QrCode, Phone, MapPin, Star, CheckCircle } from "lucide-react";
import QRCode from "qrcode";
import { Servico } from "@/types";
import { showToast } from "./Toast";

interface GerarCartaoModalProps {
  servico: Servico;
  isOpen: boolean;
  onClose: () => void;
}

export function GerarCartaoModal({ servico, isOpen, onClose }: GerarCartaoModalProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [baixando, setBaixando] = useState(false);
  const cartaoRef = useRef<HTMLDivElement>(null);

  const urlDestino = typeof window !== "undefined"
    ? `${window.location.origin}/?busca=${encodeURIComponent(servico.nome)}`
    : `https://indica-regente-indaia.vercel.app/?busca=${encodeURIComponent(servico.nome)}`;

  useEffect(() => {
    if (!isOpen) return;

    QRCode.toDataURL(urlDestino, {
      width: 320,
      margin: 1,
      color: {
        dark: "#064e3b", // emerald-900
        light: "#ffffff",
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error(err));
  }, [isOpen, urlDestino]);

  if (!isOpen) return null;

  const handleBaixarImagem = async () => {
    setBaixando(true);
    try {
      // Cria imagem via Canvas desenhando o cartão para impressão perfeita
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 1100;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Fundo degradê
      const gradient = ctx.createLinearGradient(0, 0, 800, 1100);
      gradient.addColorStop(0, "#064e3b");
      gradient.addColorStop(0.3, "#065f46");
      gradient.addColorStop(1, "#042f2e");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 1100);

      // Card Branco Central
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(40, 40, 720, 1020, 36);
      ctx.fill();

      // Topo do card interno: Verde
      const topGradient = ctx.createLinearGradient(40, 40, 760, 200);
      topGradient.addColorStop(0, "#065f46");
      topGradient.addColorStop(1, "#0d9488");
      ctx.fillStyle = topGradient;
      ctx.beginPath();
      ctx.roundRect(40, 40, 720, 160, [36, 36, 0, 0]);
      ctx.fill();

      // Textos do Topo
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 32px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("INDICA JD. REGENTE", 400, 105);

      ctx.fillStyle = "#fef08a"; // amber-200
      ctx.font = "700 18px sans-serif";
      ctx.fillText("Guia de Recomendações da Vizinhança • Indaiatuba - SP", 400, 145);

      // Nome do Estabelecimento
      ctx.fillStyle = "#0f172a";
      ctx.font = "900 38px sans-serif";
      ctx.fillText(servico.nome.slice(0, 30), 400, 270);

      // Categoria & Bairro
      ctx.fillStyle = "#047857";
      ctx.font = "800 22px sans-serif";
      ctx.fillText(`${servico.categoria.toUpperCase()}`, 400, 315);

      ctx.fillStyle = "#64748b";
      ctx.font = "600 20px sans-serif";
      ctx.fillText(`📍 ${servico.cidade_bairro}`, 400, 355);

      // Avaliação
      ctx.fillStyle = "#b45309";
      ctx.font = "800 22px sans-serif";
      ctx.fillText(`⭐ ${servico.nota_media.toFixed(1)} no Google Maps & Comunidade`, 400, 395);

      // Linha divisória
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(120, 430);
      ctx.lineTo(680, 430);
      ctx.stroke();

      // QR Code
      if (qrCodeDataUrl) {
        const qrImg = new Image();
        qrImg.src = qrCodeDataUrl;
        await new Promise((resolve) => {
          qrImg.onload = resolve;
        });
        ctx.drawImage(qrImg, 225, 460, 350, 350);
      }

      // Instrução do QR Code
      ctx.fillStyle = "#0f172a";
      ctx.font = "900 24px sans-serif";
      ctx.fillText("Aponte a câmera do celular", 400, 860);

      ctx.fillStyle = "#475569";
      ctx.font = "600 18px sans-serif";
      ctx.fillText("Para pedir, ver avaliações ou chamar no WhatsApp", 400, 895);

      // Telefone em destaque
      ctx.fillStyle = "#047857";
      ctx.font = "900 26px sans-serif";
      ctx.fillText(`📞 WhatsApp: ${servico.telefone}`, 400, 955);

      // Rodapé
      ctx.fillStyle = "#94a3b8";
      ctx.font = "600 15px sans-serif";
      ctx.fillText("indica-regente-indaia.vercel.app", 400, 1010);

      // Download
      const link = document.createElement("a");
      link.download = `cartao-balcao-${servico.nome.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      showToast("Cartão gerado e salvo com sucesso!", "🎉");
    } catch (e) {
      console.error(e);
      showToast("Erro ao gerar imagem.", "❌");
    } finally {
      setBaixando(false);
    }
  };

  const handleCompartilhar = async () => {
    const texto = `Conheça *${servico.nome}* no Indica Jd. Regente!\nCategoria: ${servico.categoria}\nTelefone: ${servico.telefone}\nConfira o perfil completo: ${urlDestino}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: servico.nome, text: texto });
        return;
      } catch {}
    }
    navigator.clipboard.writeText(texto);
    showToast("Link copiado para compartilhar!", "📋");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-fade-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Topo */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-700/80 flex items-center justify-center text-amber-300">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white">Cartão de Balcão & Divulgação</h2>
              <p className="text-[10px] text-emerald-200">Pronto para imprimir ou postar no Instagram</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Prévia do Cartão Visual */}
        <div className="p-4 sm:p-5 bg-slate-100 flex items-center justify-center">
          <div
            ref={cartaoRef}
            className="w-full max-w-xs bg-white rounded-3xl shadow-lg border-2 border-emerald-600/30 overflow-hidden text-center flex flex-col"
          >
            {/* Cabeçalho do Cartão */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white py-3 px-4">
              <span className="block text-[11px] font-black uppercase tracking-wider text-amber-300">
                Indica Jd. Regente
              </span>
              <span className="text-[9px] text-emerald-100">Guia de Recomendações • Indaiatuba</span>
            </div>

            {/* Corpo */}
            <div className="p-4 flex flex-col items-center">
              <h3 className="text-base font-black text-slate-900 leading-tight">
                {servico.nome}
              </h3>
              <span className="text-[11px] font-bold text-emerald-700 mt-0.5">
                {servico.categoria}
              </span>
              <span className="text-[10px] text-slate-500">
                📍 {servico.cidade_bairro}
              </span>

              {/* QR Code gerado */}
              <div className="my-3 p-2 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center">
                {qrCodeDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrCodeDataUrl}
                    alt="QR Code do Estabelecimento"
                    className="w-36 h-36 rounded-xl"
                  />
                ) : (
                  <div className="w-36 h-36 bg-slate-200 animate-pulse rounded-xl" />
                )}
              </div>

              <span className="text-[11px] font-extrabold text-slate-800">
                Aponte a câmera do celular
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">
                Para chamar no WhatsApp ou fazer pedidos
              </span>

              <div className="mt-3 py-1.5 px-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-black">
                📞 {servico.telefone}
              </div>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-2">
          <button
            type="button"
            onClick={handleBaixarImagem}
            disabled={baixando}
            className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{baixando ? "Gerando Imagem..." : "Baixar para Imprimir (PNG)"}</span>
          </button>

          <button
            type="button"
            onClick={handleCompartilhar}
            className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
            title="Compartilhar link"
          >
            <Share2 className="w-4 h-4 text-blue-600" />
            <span>Compartilhar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
