"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
  AlertCircle,
  Navigation,
  Clock,
  Camera,
  Trash2,
} from "lucide-react";
import confetti from "canvas-confetti";

function InstagramIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
import { CATEGORIAS_DISPONIVEIS, BAIRROS_INDAIATUBA, GRUPOS_BAIRROS, Servico } from "@/types";
import {
  formatarTelefoneBR,
  limparTelefone,
  isTelefoneValido,
  detectarBairroPorGPS,
  comprimirImagemArquivo,
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
  const [telefoneSecundario, setTelefoneSecundario] = useState("");
  const [bairroSelecionado, setBairroSelecionado] = useState<string>("Jd. Regente");
  const [outroBairroNome, setOutroBairroNome] = useState("");
  const [detectandoGps, setDetectandoGps] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [ofertaVizinho, setOfertaVizinho] = useState("");
  const [quemIndicou, setQuemIndicou] = useState("");
  const [instagram, setInstagram] = useState("");
  const [atendeFimDeSemana, setAtendeFimDeSemana] = useState(false);
  const [ehMorador, setEhMorador] = useState(false);
  const [tipoAtendimento, setTipoAtendimento] = useState<"domicilio" | "local" | "ambos">("ambos");
  const [horarioFuncionamento, setHorarioFuncionamento] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState("");
  const [carregandoFotoPerfil, setCarregandoFotoPerfil] = useState(false);
  const [fotosTrabalhos, setFotosTrabalhos] = useState<string[]>([]);
  const [carregandoFotosTrabalhos, setCarregandoFotosTrabalhos] = useState(false);

  const handleFotoPerfil = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setCarregandoFotoPerfil(true);
      const dataUrl = await comprimirImagemArquivo(file, 400, 0.8);
      setFotoPerfil(dataUrl);
    } catch {
      alert("Erro ao carregar a foto de perfil. Tente outro arquivo.");
    } finally {
      setCarregandoFotoPerfil(false);
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
      setCarregandoFotosTrabalhos(true);
      const dataUrl = await comprimirImagemArquivo(file, 800, 0.75);
      setFotosTrabalhos((prev) => [...prev, dataUrl]);
    } catch {
      alert("Erro ao carregar a foto do trabalho.");
    } finally {
      setCarregandoFotosTrabalhos(false);
    }
  };

  // Handler para detectar bairro via GPS
  const handleDetectarGps = async () => {
    setDetectandoGps(true);
    const res = await detectarBairroPorGPS(BAIRROS_INDAIATUBA);
    setDetectandoGps(false);
    if (res.bairro) {
      if (BAIRROS_INDAIATUBA.includes(res.bairro as any)) {
        setBairroSelecionado(res.bairro);
      } else {
        setBairroSelecionado("Outro Bairro");
        setOutroBairroNome(res.bairro);
      }
    } else if (res.erro) {
      alert(res.erro);
    }
  };

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

    if (bairroSelecionado === "Outro Bairro" && !outroBairroNome.trim()) {
      alert("Por favor, informe o nome do outro bairro.");
      return;
    }

    if (contatoDuplicado) {
      alert("Este telefone já está cadastrado no Indica Jd. Regente. Evite contatos duplicados!");
      return;
    }

    setSalvando(true);

    const bairroFinal =
      bairroSelecionado === "Outro Bairro" && outroBairroNome.trim()
        ? outroBairroNome.trim()
        : bairroSelecionado;
    const cidadeBairroFinal = `Indaiatuba - ${bairroFinal}`;

    try {
      const res = await cadastrarServico({
        nome: nome.trim(),
        categoria,
        telefone,
        telefone_numeros: limparTelefone(telefone),
        telefone_secundario: telefoneSecundario.trim() || undefined,
        cidade_bairro: cidadeBairroFinal,
        descricao: descricao.trim(),
        quem_indicou: quemIndicou.trim() || "Vizinho da Comunidade",
        instagram: instagram.trim() ? (instagram.startsWith("@") ? instagram : `@${instagram.trim()}`) : undefined,
        oferta_vizinho: ofertaVizinho.trim() || undefined,
        atende_fim_de_semana: atendeFimDeSemana,
        eh_morador: ehMorador,
        tipo_atendimento: tipoAtendimento,
        horario_funcionamento: horarioFuncionamento.trim() || undefined,
        foto_url: fotoPerfil || undefined,
        fotos_trabalhos: fotosTrabalhos.length > 0 ? fotosTrabalhos : undefined,
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
      {/* Header com Logo */}
      <header className="sticky top-0 z-20 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white px-4 py-3 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-1.5 rounded-full hover:bg-emerald-800/80 transition-colors"
            aria-label="Voltar para a página inicial"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-xs border-2 border-amber-300/80 flex-shrink-0 bg-emerald-950">
              <Image
                src="/logo.png"
                alt="Logo Indica Jd.Regente"
                fill
                sizes="36px"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black leading-tight">
                Indicar <span className="text-amber-400">Profissional / Serviço</span>
              </h1>
              <p className="text-[11px] text-emerald-200 font-medium">Indica Jd. Regente • Indaiatuba</p>
            </div>
          </Link>
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

            {/* Horário de Funcionamento */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
              <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Horário de Funcionamento <span className="text-gray-400 font-normal">(opcional)</span></span>
              </label>
              <input
                type="text"
                value={horarioFuncionamento}
                onChange={(e) => setHorarioFuncionamento(e.target.value)}
                placeholder="Ex: Seg a Sex: 08h às 18h ou Plantão 24h"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                💡 O aplicativo calcula automaticamente se o profissional está 🟢 Aberto Agora ou 🔴 Fechado.
              </p>
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

            {/* Telefone Secundário / Fixo / Outro WhatsApp */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
              <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>2º Telefone / Fixo / Outro WhatsApp <span className="text-gray-400 font-normal">(opcional)</span></span>
              </label>
              <input
                type="tel"
                value={telefoneSecundario}
                onChange={(e) => setTelefoneSecundario(formatarTelefoneBR(e.target.value))}
                placeholder="(19) 3875-1234 ou (19) 98888-7777"
                maxLength={15}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Útil para estabelecimentos com telefone fixo ou profissionais com mais de um número.
              </p>
            </div>

            {/* Bairro em Indaiatuba */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Bairro atendido em Indaiatuba *</span>
                </label>
                <button
                  type="button"
                  onClick={handleDetectarGps}
                  disabled={detectandoGps}
                  className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors disabled:opacity-50 cursor-pointer"
                  title="Detectar bairro automaticamente pelo GPS"
                >
                  {detectandoGps ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />
                      <span>Detectando...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-3 h-3 text-emerald-600" />
                      <span>Usar GPS</span>
                    </>
                  )}
                </button>
              </div>

              <select
                value={bairroSelecionado}
                onChange={(e) => setBairroSelecionado(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white font-medium"
              >
                {GRUPOS_BAIRROS.map((grupo) => (
                  <optgroup key={grupo.nome} label={grupo.nome}>
                    {grupo.bairros.map((b) => (
                      <option key={b} value={b}>
                        {b === "Jd. Regente" ? "⭐ Jd. Regente (Principal)" : b}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              {bairroSelecionado === "Outro Bairro" && (
                <div className="mt-2.5">
                  <input
                    type="text"
                    required
                    value={outroBairroNome}
                    onChange={(e) => setOutroBairroNome(e.target.value)}
                    placeholder="Digite o nome do bairro..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              )}

              <p className="text-[11px] text-gray-500 mt-1.5">
                Cidade: <span className="font-semibold text-gray-700">Indaiatuba - SP</span>. Selecione o bairro principal de atendimento na lista.
              </p>
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

            {/* Oferta / Desconto de Vizinhança */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-300 shadow-2xs">
              <label className="block text-xs font-bold text-amber-950 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-700" />
                <span>Oferta Especial para Vizinhos do Bairro <span className="text-amber-800 font-normal">(opcional)</span></span>
              </label>
              <input
                type="text"
                value={ofertaVizinho}
                onChange={(e) => setOfertaVizinho(e.target.value)}
                placeholder="Ex: 10% de desconto ou entrega grátis no Jd. Regente / Valença"
                className="w-full px-3 py-2.5 rounded-xl border border-amber-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white font-medium placeholder:font-normal placeholder:text-gray-400"
              />
              <p className="text-[11px] text-amber-900 mt-1">
                ⭐ Ganha destaque com selo dourado <strong>🏷️ Com Oferta</strong> e atrai mais clientes da vizinhança!
              </p>
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

            {/* Instagram / Redes Sociais */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
              <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center gap-1.5">
                <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />
                <span>Instagram do Profissional <span className="text-gray-400 font-normal">(opcional)</span></span>
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="Ex: @carlos.eletrica ou link do perfil"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Os moradores poderão ver fotos de serviços realizados diretamente no Instagram dele.
              </p>
            </div>

            {/* Fotos: Perfil/Logo e Fotos de Trabalhos Realizados */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
              {/* 1. Foto de Perfil / Logo */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Foto de Perfil ou Logotipo <span className="text-gray-400 font-normal">(opcional)</span></span>
                  </span>
                </label>

                {fotoPerfil ? (
                  <div className="flex items-center gap-3 mt-1">
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={fotoPerfil}
                        alt="Perfil ou Logotipo"
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-300 shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setFotoPerfil("")}
                        className="absolute -top-1.5 -right-1.5 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-full shadow-xs"
                        title="Remover foto"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-xs text-emerald-700 font-semibold">
                      ✓ Foto de perfil anexada
                    </span>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-50 border border-dashed border-slate-300 hover:border-emerald-500 rounded-xl cursor-pointer text-slate-700 hover:text-emerald-700 text-xs font-bold transition">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>{carregandoFotoPerfil ? "Comprimindo..." : "Escolher foto ou logotipo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFotoPerfil}
                      disabled={carregandoFotoPerfil}
                      className="hidden"
                    />
                  </label>
                )}
                <p className="text-[10px] text-gray-400 mt-1">
                  💡 Aparece dentro do avatar do profissional. Se não colocar, usamos a inicial estilizada.
                </p>
              </div>

              {/* 2. Fotos de Trabalhos Realizados (Até 3) */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Fotos de Trabalhos / Serviços <span className="text-gray-400 font-normal">(opcional - até 3 fotos)</span></span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">{fotosTrabalhos.length}/3</span>
                </label>

                <div className="flex items-center gap-2.5 flex-wrap mt-1">
                  {fotosTrabalhos.map((foto, index) => (
                    <div key={index} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={foto}
                        alt={`Trabalho ${index + 1}`}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-300 shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setFotosTrabalhos((prev) => prev.filter((_, i) => i !== index))}
                        className="absolute -top-1.5 -right-1.5 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-full shadow-xs"
                        title="Remover foto"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {fotosTrabalhos.length < 3 && (
                    <label className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 flex flex-col items-center justify-center gap-1 cursor-pointer transition text-slate-500 hover:text-emerald-700">
                      <Camera className="w-4 h-4" />
                      <span className="text-[9px] font-bold">
                        {carregandoFotosTrabalhos ? "..." : "+ Foto"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAddFotoTrabalho}
                        disabled={carregandoFotosTrabalhos}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  💡 Os moradores poderão clicar em um botão no card para ver essas fotos em tela cheia.
                </p>
              </div>
            </div>

            {/* Tipo de Atendimento */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
              <label className="block text-xs font-bold text-gray-800 mb-2">
                Como é realizado o atendimento?
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTipoAtendimento("domicilio")}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                    tipoAtendimento === "domicilio"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  🛵 Domicílio
                </button>
                <button
                  type="button"
                  onClick={() => setTipoAtendimento("local")}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                    tipoAtendimento === "local"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  🏢 No Local
                </button>
                <button
                  type="button"
                  onClick={() => setTipoAtendimento("ambos")}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                    tipoAtendimento === "ambos"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  🛵 & 🏢 Ambos
                </button>
              </div>
            </div>

            {/* Checkbox de Morador do Bairro / Vizinho */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 p-3.5 rounded-2xl flex items-center gap-3">
              <input
                type="checkbox"
                id="eh_morador"
                checked={ehMorador}
                onChange={(e) => setEhMorador(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer accent-emerald-600"
              />
              <label htmlFor="eh_morador" className="text-xs text-emerald-950 font-bold cursor-pointer">
                🏡 É morador do Jd. Regente ou bairros vizinhos (Prestigiar vizinho)
              </label>
            </div>

            {/* Checkbox de Atendimento em Fins de Semana / Plantão */}
            <div className="bg-amber-50/70 border border-amber-200/80 p-3.5 rounded-2xl flex items-center gap-3">
              <input
                type="checkbox"
                id="atende_fim_de_semana"
                checked={atendeFimDeSemana}
                onChange={(e) => setAtendeFimDeSemana(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded cursor-pointer accent-amber-600"
              />
              <label htmlFor="atende_fim_de_semana" className="text-xs text-amber-950 font-bold cursor-pointer">
                🚨 Atende emergências e finais de semana / plantão (sábado e domingo)
              </label>
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
