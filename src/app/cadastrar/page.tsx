"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Phone,
  User,
  MapPin,
  Tag,
  FileText,
  UserCheck,
  Sparkles,
  Loader2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { CATEGORIAS_DISPONIVEIS, Servico } from "@/types";
import {
  formatarTelefoneBR,
  limparTelefone,
  isTelefoneValido,
} from "@/lib/utils";
import {
  verificarTelefoneExistente,
  cadastrarServico,
} from "@/lib/supabase";
import { DuplicateWarning } from "@/components/DuplicateWarning";
import { RatingModal } from "@/components/RatingModal";

export default function CadastrarPage() {
  const router = useRouter();

  // Estados do formulário
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState<string>("Eletricista");
  const [telefone, setTelefone] = useState("");
  const [cidadeBairro, setCidadeBairro] = useState("");
  const [descricao, setDescricao] = useState("");
  const [quemIndicou, setQuemIndicou] = useState("");

  // Estados de validação e feedback
  const [verificandoTelefone, setVerificandoTelefone] = useState(false);
  const [contatoDuplicado, setContatoDuplicado] = useState<Servico | null>(null);
  const [modalAvaliarDuplicado, setModalAvaliarDuplicado] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState(false);

  // Monitora digitação do telefone para checagem assíncrona de duplicidade
  useEffect(() => {
    const digitos = limparTelefone(telefone);

    if (digitos.length >= 10) {
      setVerificandoTelefone(true);
      const timer = setTimeout(async () => {
        try {
          const existente = await verificarTelefoneExistente(digitos);
          setContatoDuplicado(existente);
        } catch (err) {
          console.error(err);
        } finally {
          setVerificandoTelefone(false);
        }
      }, 350);

      return () => clearTimeout(timer);
    } else {
      setContatoDuplicado(null);
      setVerificandoTelefone(false);
    }
  }, [telefone]);

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatado = formatarTelefoneBR(e.target.value);
    setTelefone(formatado);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim()) {
      alert("Por favor, preencha o nome do profissional ou estabelecimento.");
      return;
    }

    if (!isTelefoneValido(telefone)) {
      alert("Por favor, informe um telefone/WhatsApp válido com DDD (Ex: (18) 99712-4040).");
      return;
    }

    if (!cidadeBairro.trim()) {
      alert("Por favor, informe a cidade ou bairro atendido.");
      return;
    }

    if (contatoDuplicado) {
      alert("Este telefone já está cadastrado no IndicaRegenteIndaia. Evite contatos duplicados!");
      return;
    }

    setSalvando(true);

    try {
      const res = await cadastrarServico({
        nome: nome.trim(),
        categoria,
        telefone,
        telefone_numeros: limparTelefone(telefone),
        cidade_bairro: cidadeBairro.trim(),
        descricao: descricao.trim(),
        quem_indicou: quemIndicou.trim() || "Vizinho da Comunidade",
      });

      if (res.sucesso) {
        setMensagemSucesso(true);

        try {
          confetti({
            particleCount: 80,
            spread: 90,
            origin: { y: 0.5 },
          });
        } catch {}

        setTimeout(() => {
          router.push("/");
        }, 1800);
      } else {
        alert(res.erro || "Não foi possível cadastrar. Verifique os dados.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header simples */}
      <header className="sticky top-0 z-20 bg-emerald-700 text-white px-4 py-3 shadow-md flex items-center gap-3">
        <Link
          href="/"
          className="p-1 rounded-full hover:bg-emerald-800 transition-colors"
          aria-label="Voltar para a página inicial"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-base font-bold leading-tight">Indicar Profissional / Serviço</h1>
          <p className="text-[11px] text-emerald-200">IndicaRegenteIndaia</p>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pt-4">
        {mensagemSucesso ? (
          <div className="bg-white rounded-2xl p-8 border border-emerald-200 shadow-lg text-center mt-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-black text-gray-900">Indicação Cadastrada!</h2>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Obrigado por fortalecer nossa comunidade! O profissional já está disponível na lista com botão para WhatsApp.
            </p>
            <div className="mt-4 text-xs font-semibold text-emerald-700 flex items-center justify-center gap-1">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Redirecionando para a lista...</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Card de introdução */}
            <div className="bg-emerald-50 border border-emerald-200/70 rounded-2xl p-3.5 text-xs text-emerald-950 flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <p>
                Ajude a manter a comunidade organizada! Cadastre o contato de quem já prestou um bom serviço para você.
              </p>
            </div>

            {/* Nome */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
              <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nome do Profissional ou Empresa *</span>
              </label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: João Eletricista / Auto Elétrica do Silva"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>

            {/* Categoria */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
              <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                <span>Categoria do Serviço *</span>
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white font-medium"
              >
                {CATEGORIAS_DISPONIVEIS.filter((c) => c !== "Todos").map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Telefone / WhatsApp com Verificação em Tempo Real */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp / Telefone *</span>
                </label>
                {verificandoTelefone && (
                  <span className="text-[11px] text-emerald-600 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Checando duplicidade...
                  </span>
                )}
              </div>
              <input
                type="tel"
                required
                value={telefone}
                onChange={handleTelefoneChange}
                placeholder="(18) 99712-3456 ou (19) 98765-4321"
                maxLength={15}
                className={`w-full px-3 py-2.5 rounded-xl border text-sm font-medium focus:ring-2 outline-none ${
                  contatoDuplicado
                    ? "border-amber-400 bg-amber-50/50 focus:ring-amber-500"
                    : "border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                }`}
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Validação automática para evitar cadastros repetidos na comunidade.
              </p>

              {/* Alerta de Duplicidade se já existir */}
              {contatoDuplicado && (
                <div className="mt-3">
                  <DuplicateWarning
                    servicoExistente={contatoDuplicado}
                    onAvaliarExistente={() => setModalAvaliarDuplicado(true)}
                  />
                </div>
              )}
            </div>

            {/* Cidade / Bairro */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
              <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cidade e Bairro atendido *</span>
              </label>
              <input
                type="text"
                required
                value={cidadeBairro}
                onChange={(e) => setCidadeBairro(e.target.value)}
                placeholder="Ex: Regente Feijó - Centro ou Indaiatuba - Morada do Sol"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>

            {/* Descrição / O que ele faz de melhor */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
              <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>Descrição / Especialidades <span className="text-gray-400 font-normal">(opcional)</span></span>
              </label>
              <textarea
                rows={3}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: Atende chamados de emergência, instala disjuntores, chuveiro, preço acessível."
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
              />
            </div>

            {/* Quem está indicando */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
              <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Quem está indicando? <span className="text-gray-400 font-normal">(seu nome/apelido)</span></span>
              </label>
              <input
                type="text"
                value={quemIndicou}
                onChange={(e) => setQuemIndicou(e.target.value)}
                placeholder="Ex: Roberto (Grupo do WhatsApp) ou Mariana Ap 42"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Isso dá muita credibilidade para quem for contratar o serviço!
              </p>
            </div>

            {/* Botão de Envio */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={salvando || Boolean(contatoDuplicado)}
                className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  contatoDuplicado
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white active:scale-98"
                }`}
              >
                {salvando ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Cadastrando...</span>
                  </>
                ) : (
                  <span>Cadastrar Indicação</span>
                )}
              </button>
            </div>
          </form>
        )}
      </main>

      {/* Modal para avaliar o contato caso já exista na base */}
      {contatoDuplicado && (
        <RatingModal
          servico={contatoDuplicado}
          isOpen={modalAvaliarDuplicado}
          onClose={() => setModalAvaliarDuplicado(false)}
          onAvaliacaoSalva={() => {
            setModalAvaliarDuplicado(false);
            router.push("/");
          }}
        />
      )}
    </div>
  );
}
