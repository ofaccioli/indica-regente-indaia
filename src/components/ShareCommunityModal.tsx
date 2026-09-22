"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { X, Copy, Check, Share2, Download, Sparkles } from "lucide-react";

interface ShareCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareCommunityModal({ isOpen, onClose }: ShareCommunityModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [copiado, setCopiado] = useState(false);
  const [appUrl, setAppUrl] = useState("http://localhost:3000");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = window.location.origin;
      setAppUrl(url);

      QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: "#064e3b",
          light: "#ffffff",
        },
      })
        .then((dataUrl) => setQrCodeUrl(dataUrl))
        .catch((err) => console.error("Erro ao gerar QR Code:", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const textoCompartilhamento = `⭐ *Guia de Indicações e Serviços - Jd. Regente / Indaiatuba*\n\n` +
    `Olá vizinhos! Criamos um catálogo oficial para nossa comunidade para ninguém mais perder contatos de eletricistas, diaristas, mecânicos e serviços recomendados no grupo.\n\n` +
    `📱 Acesse pelo celular (pode instalar na tela de início):\n` +
    `👉 ${appUrl}\n\n` +
    `✨ Já conta com botão direto para o WhatsApp dos profissionais e notas da vizinhança!`;

  const handleCopiarTexto = async () => {
    try {
      await navigator.clipboard.writeText(textoCompartilhamento);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      alert("Não foi possível copiar o texto automaticamente.");
    }
  };

  const handleBaixarQRCode = () => {
    if (!qrCodeUrl) return;
    const a = document.createElement("a");
    a.href = qrCodeUrl;
    a.download = "qrcode-indica-jd-regente.png";
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-gray-100 overflow-hidden text-center">
        {/* Topo */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-sm">Divulgar no Grupo de WhatsApp</h3>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-full hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Logo e Nome */}
          <div className="flex flex-col items-center">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-md border-2 border-amber-300/70 mb-2 bg-emerald-800">
              <Image
                src="/logo.png"
                alt="Logo Indica Jd.Regente"
                fill
                className="object-cover"
              />
            </div>
            <h4 className="font-black text-sm text-gray-900 leading-tight">
              Indica Jd.Regente - Indaiatuba
            </h4>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Escaneie o QR Code abaixo para abrir o app
            </p>
          </div>

          {/* QR Code */}
          <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100 inline-block shadow-inner">
            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="QR Code do Indica Jd.Regente"
                className="w-44 h-44 mx-auto rounded-xl"
              />
            ) : (
              <div className="w-44 h-44 flex items-center justify-center text-xs text-gray-400">
                Gerando QR Code...
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleCopiarTexto}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all cursor-pointer"
            >
              {copiado ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>Mensagem Copiada!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Mensagem para o Grupo</span>
                </>
              )}
            </button>

            <button
              onClick={handleBaixarQRCode}
              className="w-full py-2 px-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-gray-500" />
              <span>Baixar Imagem do QR Code</span>
            </button>
          </div>

          <p className="text-[10px] text-gray-400 leading-tight">
            💡 Dica: Você pode imprimir o QR Code para colar no mural do condomínio ou na portaria!
          </p>
        </div>
      </div>
    </div>
  );
}
