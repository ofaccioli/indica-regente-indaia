"use client";

const FAVORITES_STORAGE_KEY = "indica_regente_favoritos";
export const FAVORITES_EVENT = "indica:favorites-changed";

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isFavorite(servicoId: string): boolean {
  const favs = getFavorites();
  return favs.includes(servicoId);
}

export function toggleFavorite(servicoId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const current = getFavorites();
    let updated: string[];
    let novoStatus = false;

    if (current.includes(servicoId)) {
      updated = current.filter((id) => id !== servicoId);
      novoStatus = false;
    } else {
      updated = [...current, servicoId];
      novoStatus = true;
    }

    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(FAVORITES_EVENT, { detail: { updated, servicoId, status: novoStatus } }));
    return novoStatus;
  } catch (err) {
    console.error("Erro ao salvar favorito:", err);
    return false;
  }
}
