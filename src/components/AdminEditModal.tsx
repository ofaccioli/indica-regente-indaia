"use client";

import React, { useState, useEffect } from "react";
import { X, Check, ShieldCheck, Loader2, Camera, Trash2 } from "lucide-react";
import { Servico, CATEGORIAS_DISPONIVEIS, BAIRROS_INDAIATUBA } from "@/types";
import { formatarTelefoneBR, limparTelefone, comprimirImagemArquivo } from "@/lib/utils";

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
  const [telefoneSecundario, setTelefoneSecundario] = useState("");
  const [cidadeBairro, setCidadeBairro] = useState("");
  const [descricao, setDescricao] = useState("");
  const [quemIndicou, setQuemIndicou] = useState("");
  const [instagram, setInstagram] = useState("");
  const [ofertaVizinho, setOfertaVizinho] = useState("");
  const [atendeFimDeSemana, setAtendeFimDeSemana] = useState(false);
  const [ehMorador, setEhMorador] = useState(false);
  const [tipoAtendimento, setTipoAtendimento] = useState<"domicilio" | "local" | "ambos">("ambos");
  const [horarioFuncionamento, setHorarioFuncionamento] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [fotosTrabalhos, setFotosTrabalhos] = useState<string[]>([]);
  const [carregandoFoto, setCarregandoFoto] = useState(false);
  const [verificadoAdmin, setVerificadoAdmin] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (servico) {
      setNome(servico.nome || "");
      setCategoria(servico.categoria || "Outros");
      setTelefone(servico.telefone || "");
      setTelefoneSecundario(servico.telefone_secundario || "");
      setCidadeBairro(servico.cidade_bairro || "");
      setDescricao(servico.descricao || "");
      setQuemIndicou(servico.quem_indicou || "");
      setInstagram(servico.instagram || "");
      setOfertaVizinho(servico.oferta_vizinho || "");
      setHorarioFuncionamento(servico.horario_funcionamento || "");
      setFotoUrl(servico.foto_url || "");
      setFotosTrabalhos(servico.fotos_trabalhos || []);
      setAtendeFimDeSemana(Boolean(servico.atende_fim_de_semana));
      setEhMorador(Boolean(servico.eh_morador));
      setTipoAtendimento(servico.tipo_atendimento || "ambos");
      setVerificadoAdmin(Boolean(servico.verificado_admin));
    }
  }, [servico]);

  if (!isOpen || !servico) return null;

  const handleUploadFotoPerfil = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setCarregandoFoto(true);
      const compressed = await comprimirImagemArquivo(file, 400, 0.8);
      setFotoUrl(compressed);
    } catch {
      alert("Erro ao comprimir imagem.");
    } finally {
      setCarregandoFoto(false);
    }
  };

  const handleAddFotoTrabalho = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (fotosTrabalhos.length >= 3) {
      alert("Máximo de 3 fotos.");
      return;
    }
    try {
      setCarregandoFoto(true);
      const compressed = await comprimirImagemArquivo(file, 800, 0.75);
      setFotosTrabalhos((prev) => [...prev, compressed]);
    } catch {
      alert("Erro ao comprimir imagem.");
    } finally {
      setCarregandoFoto(false);
    }
  };

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
            telefone_secundario: telefoneSecundario.trim() || null,
            telefone_secundario_numeros: telefoneSecundario.trim() ? limparTelefone(telefoneSecundario) : null,
            cidade_bairro: cidadeBairro.trim(),
            descricao: descricao.trim(),
            quem_indicou: quemIndicou.trim(),
            instagram: instagram.trim() || null,
            oferta_vizinho: ofertaVizinho.trim() || null,
            horario_funcionamento: horarioFuncionamento.trim() || null,
            foto_url: fotoUrl.trim() || null,
            fotos_trabalhos: fotosTrabalhos.length > 0 ? fotosTrabalhos : null,
            atende_fim_de_semana: atendeFimDeSemana,
            eh_morador: ehMorador,
            tipo_atendimento: tipoAtendimento,
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
              <label className="block text-xs font-bold text-gray-700 mb-1">Telefone Principal (WhatsApp)</label>
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
            <label className="block text-xs font-bold text-gray-700 mb-1">
              2º Telefone / Fixo / Outro WhatsApp <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              value={telefoneSecundario}
              onChange={(e) => setTelefoneSecundario(formatarTelefoneBR(e.target.value))}
              placeholder="(19) 3875-1234"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Cidade / Bairro</label>
            <input
              type="text"
              required
              list="admin-bairros-list"
              value={cidadeBairro}
              onChange={(e) => setCidadeBairro(e.target.value)}
              placeholder="Indaiatuba - Jd. Regente"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <datalist id="admin-bairros-list">
              {BAIRROS_INDAIATUBA.filter((b) => b !== "Todos os Bairros" && b !== "Outro Bairro").map((b) => (
                <option key={b} value={`Indaiatuba - ${b}`} />
              ))}
            </datalist>
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

          <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200">
            <label className="block text-xs font-bold text-amber-950 mb-1">
              🏷️ Oferta Especial para Vizinhos do Bairro (Opcional)
            </label>
            <input
              type="text"
              value={ofertaVizinho}
              onChange={(e) => setOfertaVizinho(e.target.value)}
              placeholder="Ex: 10% de desconto para moradores do Jd. Regente / Jd. Valença"
              className="w-full px-3 py-2 rounded-xl border border-amber-300 text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              🕐 Horário de Funcionamento (ex: Seg a Sex: 08h às 18h ou 24h)
            </label>
            <input
              type="text"
              value={horarioFuncionamento}
              onChange={(e) => setHorarioFuncionamento(e.target.value)}
              placeholder="Ex: Seg a Sex: 08h às 18h / 24h"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Fotos de Perfil e Trabalhos */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Foto de Perfil ou Logotipo (Avatar)
              </label>
              <div className="flex items-center gap-3">
                {fotoUrl ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={fotoUrl}
                      alt="Perfil"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-300 shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setFotoUrl("")}
                      className="absolute -top-1.5 -right-1.5 bg-rose-600 hover:bg-rose-700 text-white p-0.5 rounded-full"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-dashed border-slate-300 hover:border-emerald-500 rounded-lg text-xs font-bold text-slate-700 cursor-pointer transition">
                    <Camera className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{carregandoFoto ? "..." : "Enviar foto/logo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadFotoPerfil}
                      disabled={carregandoFoto}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Fotos de Trabalhos Realizados ({fotosTrabalhos.length}/3)
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {fotosTrabalhos.map((f, idx) => (
                  <div key={idx} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={f}
                      alt={`Trabalho ${idx + 1}`}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-300 shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setFotosTrabalhos((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute -top-1.5 -right-1.5 bg-rose-600 hover:bg-rose-700 text-white p-0.5 rounded-full"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {fotosTrabalhos.length < 3 && (
                  <label className="w-12 h-12 rounded-lg border border-dashed border-slate-300 hover:border-emerald-500 flex flex-col items-center justify-center gap-0.5 cursor-pointer text-slate-400 hover:text-emerald-700 bg-white">
                    <Camera className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-bold">+</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAddFotoTrabalho}
                      disabled={carregandoFoto}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Tipo de Atendimento */}
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Modalidade de Atendimento:
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setTipoAtendimento("domicilio")}
                className={`py-1.5 rounded-lg font-semibold border ${
                  tipoAtendimento === "domicilio"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                🛵 Domicílio
              </button>
              <button
                type="button"
                onClick={() => setTipoAtendimento("local")}
                className={`py-1.5 rounded-lg font-semibold border ${
                  tipoAtendimento === "local"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                🏢 No Local
              </button>
              <button
                type="button"
                onClick={() => setTipoAtendimento("ambos")}
                className={`py-1.5 rounded-lg font-semibold border ${
                  tipoAtendimento === "ambos"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                🛵 & 🏢 Ambos
              </button>
            </div>
          </div>

          {/* Checkbox de Morador do Bairro */}
          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 flex items-center gap-3">
            <input
              type="checkbox"
              id="eh_morador_admin"
              checked={ehMorador}
              onChange={(e) => setEhMorador(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded cursor-pointer accent-emerald-600"
            />
            <label htmlFor="eh_morador_admin" className="text-xs text-emerald-950 font-semibold cursor-pointer">
              🏡 É Morador do Bairro / Vizinho (exibe selo especial)
            </label>
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
