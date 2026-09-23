"use client";

const MY_SERVICES_STORAGE_KEY = "indica_meus_cadastros";
export const MY_SERVICES_EVENT = "indica:my-services-changed";

export function getMyCreatedServices(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(MY_SERVICES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isMyCreatedService(servicoId: string): boolean {
  const ids = getMyCreatedServices();
  return ids.includes(servicoId);
}

export function addMyCreatedService(servicoId: string): void {
  if (typeof window === "undefined" || !servicoId) return;
  try {
    const current = getMyCreatedServices();
    if (!current.includes(servicoId)) {
      const updated = [...current, servicoId];
      localStorage.setItem(MY_SERVICES_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(
        new CustomEvent(MY_SERVICES_EVENT, { detail: { updated, servicoId } })
      );
    }
  } catch (err) {
    console.error("Erro ao salvar cadastro local:", err);
  }
}
