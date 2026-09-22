"use client";

import React, { useEffect, useState } from "react";
import { Download, X, Smartphone, Share, PlusSquare, ArrowUpRight } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const PWA_OPEN_INSTALL_EVENT = "indica:open-pwa-install";

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [mostrarBanner, setMostrarBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [modalIOSAberto, setModalIOSAberto] = useState(false);

  useEffect(() => {
    // Verifica se já está rodando como app instalado
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      return;
    }

    // Detecção iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIphoneOrIpad = /iphone|ipad|ipod/.test(userAgent);
    if (isIphoneOrIpad) {
      setIsIOS(true);
      const dispensado = localStorage.getItem("indica_pwa_dismissed");
      if (!dispensado) {
        setMostrarBanner(true);
      }
    }

    // Evento Chrome / Android / Edge
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      const dispensado = localStorage.getItem("indica_pwa_dismissed");
      if (!dispensado) {
        setMostrarBanner(true);
      }
    };

    const handleCustomOpen = () => {
      if (isIphoneOrIpad) {
        setModalIOSAberto(true);
      } else if (deferredPrompt) {
        deferredPrompt.prompt();
      } else {
        setModalIOSAberto(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener(PWA_OPEN_INSTALL_EVENT, handleCustomOpen);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener(PWA_OPEN_INSTALL_EVENT, handleCustomOpen);
    };
  }, [deferredPrompt]);

  const handleInstalar = async () => {
    if (isIOS) {
      setModalIOSAberto(true);
      return;
    }

    if (!deferredPrompt) {
      setModalIOSAberto(true);
      return;
    }

    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === "accepted") {
      setMostrarBanner(false);
    }
    setDeferredPrompt(null);
  };

  const dispensar = () => {
    setMostrarBanner(false);
    try {
      localStorage.setItem("indica_pwa_dismissed", "true");
    } catch {}
  };

  return (
    <>
      {/* Banner Flutuante Inferior */}
      {mostrarBanner && (
        <aside
          aria-label="Instalação do Aplicativo"
          className="fixed bottom-16 sm:bottom-4 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-md z-40 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-3.5 rounded-2xl shadow-xl border border-emerald-500/40 animate-in slide-in-from-bottom duration-300 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center flex-shrink-0 shadow font-black">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs leading-tight">Instalar no seu celular</h4>
              <p className="text-[11px] text-emerald-200">
                Acesse o app em 1 toque sem gastar memória!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={handleInstalar}
              className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-3 py-1.5 rounded-xl font-black text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar</span>
            </button>
            <button
              onClick={dispensar}
              className="text-emerald-300 hover:text-white p-1 rounded-full hover:bg-white/10"
              aria-label="Fechar aviso de instalação"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* Modal Visual com Tutorial de Instalação para iPhone / iPad e Navegadores */}
      {modalIOSAberto && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white text-gray-900 rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl border border-gray-200">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 font-bold">
              <Smartphone className="w-6 h-6" />
            </div>

            <h3 className="font-black text-base text-gray-900 mb-1">
              Como instalar no seu celular
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              O Indica Jd.Regente é um aplicativo web leve que não ocupa o espaço da memória do seu telefone.
            </p>

            {/* Passos Ilustrados */}
            <div className="space-y-3 text-left mb-5">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 text-xs">
                <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 font-bold">
                  1
                </div>
                <div>
                  <p className="font-bold text-gray-800">
                    Toque em Compartilhar <Share className="inline w-3.5 h-3.5 text-blue-600 ml-0.5" />
                  </p>
                  <p className="text-[11px] text-gray-500">
                    No Safari (iPhone) na barra inferior ou no menu ⋮ do Chrome (Android).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 text-xs">
                <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </div>
                <div>
                  <p className="font-bold text-gray-800">
                    Escolha &ldquo;Adicionar à Tela de Início&rdquo; <PlusSquare className="inline w-3.5 h-3.5 text-emerald-600 ml-0.5" />
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Role a tela para baixo até encontrar esta opção.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setModalIOSAberto(false)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Perfeito, entendi!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
