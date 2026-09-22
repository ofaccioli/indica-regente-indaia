"use client";

import React, { useState, useEffect } from "react";
import { X, Check, ShieldCheck, Loader2 } from "lucide-react";
import { Servico, CATEGORIAS_DISPONIVEIS } from "@/types";
import { formatarTelefoneBR, limparTelefone } from "@/lib/utils";

interface AdminEditModalProps {
  servico: Servico | null;
  isOpen: boolean;
  onClose: () => void;
  onSalvo: () => void;
}

export function AdminEditModal({ servico, isOpen, onClose, onSalvo }: AdminEditModalProps) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidadeBairro, setCidadeBairro] = useState("");
  const [descricao, setDescricao] = useState("");
  const [quemIndicou, setQuemIndicou] = useState("");
  const [instagram, setInstagram] = useState("");
  const [atendeFimDeSemana, setAtendeFimDeSemana] = useState(false);
  const [verificadoAdmin, setVerificadoAdmin] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (servico) {
      setNome(servico.nome || "");
      setCategoria(servico.categoria || "Outros");
      setTelefone(servico.telefone || "");
      setCidadeBairro(servico.cidade_bairro || "");
      setDescricao(servico.descricao || "");
      setQuemIndicou(servico.quem_indicou || "");
      setInstagram(servico.instagram || "");
      setAtendeFimDeSemana(Boolean(servico.atende_fim_de_semana));
      setVerificadoAdmin(Boolean(servico.verificado_admin));
    }
  }, [servico]);

  if (!isOpen || !servico) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    try {
      const res = await fetch("/api/admin/servicos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: servico.id,
          dados: {
            nome: nome.trim(),
            categoria,
            telefone,
            telefone_numeros: limparTelefone(telefone),
            cidade_bairro: cidadeBairro.trim(),
            descricao: descricao.trim(),
            quem_indicou: quemIndicou.trim(),
            instagram: instagram.trim() || null,
            atende_fim_de_semana: atendeFimDeSemana,
            verificado_admin: verificadoAdmin,
          },
        }),
      });

      const data = await res.json();
      if (data.sucesso) {
        onSalvo();
        onClose();
      } else {
        alert(data.erro || "Falha ao salvar alterações");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão ao salvar");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">Editar Contato (Moderação)</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Categoria</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
              >
                {CATEGORIAS_DISPONIVEIS.filter((c) => c !== "Todos").map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Telefone / WhatsApp</label>
              <input
                type="text"
                required
                value={telefone}
                onChange={(e) => setTelefone(formatarTelefoneBR(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Cidade / Bairro</label>
            <input
              type="text"
              required
              value={cidadeBairro}
              onChange={(e) => setCidadeBairro(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Descrição</label>
            <textarea
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Quem indicou</label>
            <input
              type="text"
              value={quemIndicou}
              onChange={(e) => setQuemIndicou(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Instagram (@usuario)</label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="Ex: @carlos.eletrica"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Checkbox de Atende Fim de Semana */}
          <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 flex items-center gap-3">
            <input
              type="checkbox"
              id="atende_fds_admin"
              checked={atendeFimDeSemana}
              onChange={(e) => setAtendeFimDeSemana(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded cursor-pointer accent-amber-600"
            />
            <label htmlFor="atende_fds_admin" className="text-xs text-amber-950 font-semibold cursor-pointer">
              🚨 Atende emergências e finais de semana / plantão
            </label>
          </div>

          {/* Checkbox de Selo Verificado pelo Admin */}
          <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200 flex items-center gap-3">
            <input
              type="checkbox"
              id="verificado_admin"
              checked={verificadoAdmin}
              onChange={(e) => setVerificadoAdmin(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
            />
            <label htmlFor="verificado_admin" className="text-xs text-blue-950 font-semibold cursor-pointer">
              Selo &ldquo;Verificado pela Moderação&rdquo; (destaca o profissional com selo oficial)
            </label>
          </div>

          {/* Ações */}
          <div className="flex gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="w-1/2 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5"
            >
              {salvando ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Salvar Modificações</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
