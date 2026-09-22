"use client";

import React, { useEffect, useState } from "react";
import { Download, X, Smartphone, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [mostrarBanner, setMostrarBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [instrucaoIOS, setInstrucaoIOS] = useState(false);

  useEffect(() => {
    // Verifica se já está rodando como standalone (já instalado)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      return;
    }

    // Detecção de iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIphoneOrIpad = /iphone|ipad|ipod/.test(userAgent);
    if (isIphoneOrIpad) {
      setIsIOS(true);
      const dispensado = localStorage.getItem("indica_pwa_dismissed");
      if (!dispensado) {
        setMostrarBanner(true);
      }
    }

    // Escuta evento do Chrome / Android / Edge
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      const dispensado = localStorage.getItem("indica_pwa_dismissed");
      if (!dispensado) {
        setMostrarBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstalar = async () => {
    if (isIOS) {
      setInstrucaoIOS(true);
      return;
    }

    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === "accepted") {
      setMostrarBanner(false);
    }
    setDeferredPrompt(null);
  };

  const dispensar = () => {
    setMostrarBanner(false);
    setInstrucaoIOS(false);
    try {
      localStorage.setItem("indica_pwa_dismissed", "true");
    } catch {}
  };

  if (!mostrarBanner) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white px-4 py-2.5 shadow-lg border-b border-emerald-600/50 flex items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-amber-400 text-emerald-950 flex items-center justify-center flex-shrink-0 shadow">
          <Smartphone className="w-4 h-4" />
        </div>
        <div>
          <p className="font-bold leading-tight">Instalar IndicaRegenteIndaia</p>
          <p className="text-[11px] text-emerald-200">
            Acesso rápido direto da tela do seu celular!
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleInstalar}
          className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-3 py-1.5 rounded-lg font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Instalar</span>
        </button>
        <button
          onClick={dispensar}
          className="text-emerald-300 hover:text-white p-1 rounded-full"
          aria-label="Fechar banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {instrucaoIOS && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center p-4">
          <div className="bg-white text-gray-900 rounded-2xl p-5 w-full max-w-sm text-center">
            <h4 className="font-bold text-base mb-2">Instalar no iPhone / iPad</h4>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Toque no botão de <strong>Compartilhar</strong>{" "}
              <Share className="inline w-4 h-4 text-blue-600" /> na barra inferior do Safari e escolha{" "}
              <strong>&ldquo;Adicionar à Tela de Início&rdquo;</strong>.
            </p>
            <button
              onClick={() => setInstrucaoIOS(false)}
              className="w-full py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl"
            >
              Entendi!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
