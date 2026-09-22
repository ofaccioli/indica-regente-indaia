"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, ArrowLeft, Loader2, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senha }),
      });

      const data = await res.json();
      if (data.sucesso) {
        router.push("/admin");
      } else {
        setErro(data.erro || "Senha incorreta");
      }
    } catch {
      setErro("Falha ao comunicar com o servidor");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Botão voltar */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para o IndicaRegenteIndaia</span>
        </Link>

        {/* Card do Login */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200/80 p-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gray-900 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-lg font-black text-gray-900">Acesso Administrativo</h1>
            <p className="text-xs text-gray-500 mt-1">
              Painel de moderação e gerenciamento da comunidade
            </p>
          </div>

          {erro && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Senha de Administrador
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite a senha mestra"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-gray-900 outline-none font-medium"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Definida na variável <code>ADMIN_PASSWORD</code> na Vercel (padrão local: <code>admin123</code>).
              </p>
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {carregando ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Entrando...</span>
                </>
              ) : (
                <span>Entrar no Painel</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
