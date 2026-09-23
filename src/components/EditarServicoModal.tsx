"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Loader2, Camera, Trash2, Clock, Phone, Tag, FileText, User } from "lucide-react";
import { Servico, CATEGORIAS_DISPONIVEIS, BAIRROS_INDAIATUBA, GRUPOS_BAIRROS } from "@/types";
import { formatarTelefoneBR, limparTelefone, isTelefoneValido, comprimirImagemArquivo } from "@/lib/utils";
import { atualizarServico } from "@/lib/supabase";

interface EditarServicoModalProps {
  servico: Servico | null;
  isOpen: boolean;
  onClose: () => void;
  onSalvo: () => void;
}

export function EditarServicoModal({
  servico,
  isOpen,
  onClose,
  onSalvo,
}: EditarServicoModalProps) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [telefone, setTelefone] = useState("");
  const [telefoneSecundario, setTelefoneSecundario] = useState("");
  const [cidadeBairro, setCidadeBairro] = useState("");
  const [descricao, setDescricao] = useState("");
  const [instagram, setInstagram] = useState("");
  const [ofertaVizinho, setOfertaVizinho] = useState("");
  const [horarioFuncionamento, setHorarioFuncionamento] = useState("");
  const [atendeFimDeSemana, setAtendeFimDeSemana] = useState(false);
  const [ehMorador, setEhMorador] = useState(false);
  const [tipoAtendimento, setTipoAtendimento] = useState<"domicilio" | "local" | "ambos">("ambos");
  const [fotoUrl, setFotoUrl] = useState("");
  const [fotosTrabalhos, setFotosTrabalhos] = useState<string[]>([]);
  const [carregandoFoto, setCarregandoFoto] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (servico) {
      setNome(servico.nome || "");
      setCategoria(servico.categoria || "Outros");
      setTelefone(servico.telefone || "");
      setTelefoneSecundario(servico.telefone_secundario || "");
      setCidadeBairro(servico.cidade_bairro || "");
      setDescricao(servico.descricao || "");
      setInstagram(servico.instagram || "");
      setOfertaVizinho(servico.oferta_vizinho || "");
      setHorarioFuncionamento(servico.horario_funcionamento || "");
      setAtendeFimDeSemana(Boolean(servico.atende_fim_de_semana));
      setEhMorador(Boolean(servico.eh_morador));
      setTipoAtendimento(servico.tipo_atendimento || "ambos");
      setFotoUrl(servico.foto_url || "");
      setFotosTrabalhos(servico.fotos_trabalhos || []);
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
      alert("Você pode adicionar no máximo 3 fotos de trabalhos.");
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

    if (!nome.trim()) {
      alert("Por favor, preencha o nome do profissional.");
      return;
    }

    if (!isTelefoneValido(telefone)) {
      alert("Por favor, informe um telefone/WhatsApp válido.");
      return;
    }

    setSalvando(true);
    try {
      const res = await atualizarServico(servico.id, {
        nome: nome.trim(),
        categoria,
        telefone,
        telefone_numeros: limparTelefone(telefone),
        telefone_secundario: telefoneSecundario.trim() || undefined,
        cidade_bairro: cidadeBairro.trim() || servico.cidade_bairro,
        descricao: descricao.trim(),
        instagram: instagram.trim() ? (instagram.startsWith("@") ? instagram : `@${instagram.trim()}`) : undefined,
        oferta_vizinho: ofertaVizinho.trim() || undefined,
        horario_funcionamento: horarioFuncionamento.trim() || undefined,
        atende_fim_de_semana: atendeFimDeSemana,
        eh_morador: ehMorador,
        tipo_atendimento: tipoAtendimento,
        foto_url: fotoUrl.trim() || undefined,
        fotos_trabalhos: fotosTrabalhos.length > 0 ? fotosTrabalhos : undefined,
      });

      if (res.sucesso) {
        onSalvo();
        onClose();
      } else {
        alert(res.erro || "Falha ao salvar alterações.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar alterações.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">Editar Meu Cadastro</h2>
              <p className="text-xs text-emerald-100">Atualize as informações do seu serviço</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs text-slate-800">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nome do Profissional / Empresa *</label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Categoria *</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium"
              >
                {CATEGORIAS_DISPONIVEIS.filter((c) => c !== "Todos").map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Telefone Principal (WhatsApp) *</label>
              <input
                type="text"
                required
                value={telefone}
                onChange={(e) => setTelefone(formatarTelefoneBR(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Telefone Secundário (opcional)</label>
              <input
                type="text"
                value={telefoneSecundario}
                onChange={(e) => setTelefoneSecundario(formatarTelefoneBR(e.target.value))}
                placeholder="(19) 3800-0000"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Instagram (opcional)</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@seu.negocio"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Horário de Funcionamento (opcional)</label>
            <input
              type="text"
              value={horarioFuncionamento}
              onChange={(e) => setHorarioFuncionamento(e.target.value)}
              placeholder="Ex: Seg a Sex: 08h às 18h ou 24h"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200">
            <label className="block font-bold text-amber-950 mb-1">
              🏷️ Oferta Especial para Vizinhos do Bairro (Opcional)
            </label>
            <input
              type="text"
              value={ofertaVizinho}
              onChange={(e) => setOfertaVizinho(e.target.value)}
              placeholder="Ex: 10% de desconto ou entrega grátis no Jd. Regente / Valença"
              className="w-full px-3 py-2 rounded-xl border border-amber-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none bg-white text-gray-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Descrição / Especialidades</label>
            <textarea
              rows={2}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva seus diferenciais, garantia e especialidades..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
            />
          </div>

          {/* Fotos: Perfil e Trabalhos */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Foto de Perfil ou Logotipo
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
              <label className="block font-bold text-slate-700 mb-1">
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

          {/* Opções de Atendimento & Morador */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={ehMorador}
                onChange={(e) => setEhMorador(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded accent-emerald-600 cursor-pointer"
              />
              <span className="font-semibold text-slate-700">🏡 Sou morador(a) do Jd. Regente ou bairros vizinhos</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={atendeFimDeSemana}
                onChange={(e) => setAtendeFimDeSemana(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded accent-amber-600 cursor-pointer"
              />
              <span className="font-semibold text-slate-700">🚨 Atendo chamados de emergência ou no fim de semana</span>
            </label>
          </div>

          {/* Footer com botões */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={salvando}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              {salvando ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
