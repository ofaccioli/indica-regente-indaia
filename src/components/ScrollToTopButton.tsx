"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTopButton() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisivel(window.scrollY > 380);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visivel) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Voltar ao topo da página"
      className="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-40 w-11 h-11 rounded-full bg-emerald-700/90 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xl shadow-emerald-950/20 backdrop-blur-xs border border-white/20 transition-all active:scale-90 cursor-pointer animate-in fade-in zoom-in-75 duration-200"
    >
      <ArrowUp className="w-5 h-5 stroke-[2.5]" />
    </button>
  );
}
