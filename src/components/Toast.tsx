"use client";

import React, { useState, useEffect } from "react";

export interface ToastData {
  id: number;
  message: string;
  icon?: string;
}

export const TOAST_EVENT = "indica:toast";

export function showToast(message: string, icon: string = "✨") {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(TOAST_EVENT, {
        detail: { message, icon },
      })
    );
  }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string; icon?: string }>;
      if (!customEvent.detail?.message) return;

      const newToast: ToastData = {
        id: Date.now(),
        message: customEvent.detail.message,
        icon: customEvent.detail.icon || "✨",
      };

      setToasts((prev) => [...prev.slice(-2), newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 2800);
    };

    window.addEventListener(TOAST_EVENT, handleToast);
    return () => window.removeEventListener(TOAST_EVENT, handleToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none px-4 w-full max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="bg-slate-900/95 text-white backdrop-blur-md px-4 py-2.5 rounded-full shadow-2xl border border-slate-700/60 flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <span className="text-sm flex-shrink-0">{t.icon}</span>
          <span className="truncate">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
