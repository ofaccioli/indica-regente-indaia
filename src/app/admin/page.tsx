"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  LogOut,
  Search,
  Edit2,
  Trash2,
  Star,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Users,
  MessageSquare,
  Loader2,
  Phone,
  Plus,
  Home,
  Tag,
  Award,
  Download,
  Sparkles,
} from "lucide-react";
import { Servico, Avaliacao } from "@/types";
import { listarServicos } from "@/lib/supabase";
import { AdminEditModal } from "@/components/AdminEditModal";
import { GooglePlacesImporter } from "@/components/admin/GooglePlacesImporter";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [autenticado, setAutenticado] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // Estados de dados
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [abaAtiva, setAbaAtiva] = useState<"servicos" | "avaliacoes" | "google">("servicos");
  const [busca, setBusca] = useState("");

  // Modal de edição
  const [servicoParaEditar, setServicoParaEditar] = useState<Servico | null>(null);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);

  // Checa autenticação inicial
  useEffect(() => {
    const verificar = async () => {
      try {
        const res = await fetch("/api/admin/auth");
        const data = await res.json();
        if (!data.autenticado) {
          router.push("/admin/login");
        } else {
          setAutenticado(true);
          carregarDados();
        }
      } catch {
        router.push("/admin/login");
      }
    };

    verificar();
  }, [router]);

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const listaServicos = await listarServicos();
      setServicos(listaServicos);

      const resAv = await fetch("/api/admin/avaliacoes");
      const dataAv = await resAv.json();
      if (dataAv.sucesso) {
        setAvaliacoes(dataAv.avaliacoes || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  const handleExportarCSV = () => {
    if (servicos.length === 0) {
      alert("Nenhum serviço cadastrado para exportar.");
      return;
    }

    const cabecalho = [
      "ID",
      "Nome",
      "Categoria",
      "Telefone",
      "Telefone Secundário",
      "Bairro",
      "Nota Média",
      "Total Avaliações",
      "Morador do Bairro",
      "Atende Fim de Semana",
      "Verificado Admin",
      "Oferta Vizinho",
      "Horário de Funcionamento",
      "Quem Indicou",
      "Instagram",
      "Data de Cadastro",
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const linhas = servicos.map((s) => [
      escapeCsv(s.id),
      escapeCsv(s.nome),
      escapeCsv(s.categoria),
      escapeCsv(s.telefone),
      escapeCsv(s.telefone_secundario || ""),
      escapeCsv(s.cidade_bairro),
      s.nota_media || 5,
      s.total_avaliacoes || 0,
      s.eh_morador ? "Sim" : "Não",
      s.atende_fim_de_semana ? "Sim" : "Não",
      s.verificado_admin ? "Sim" : "Não",
      escapeCsv(s.oferta_vizinho || ""),
      escapeCsv(s.horario_funcionamento || ""),
      escapeCsv(s.quem_indicou || ""),
      escapeCsv(s.instagram || ""),
      escapeCsv(s.created_at ? new Date(s.created_at).toLocaleDateString("pt-BR") : ""),
    ]);

    const csvContent =
      "\uFEFF" + [cabecalho.join(";"), ...linhas.map((l) => l.join(";"))].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `indica-regente-profissionais-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    }
  };

  const handleExcluirServico = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir o contato "${nome}"? Esta ação removerá o profissional e todas as avaliações dele.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/servicos?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.sucesso) {
        setServicos((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert(data.erro || "Falha ao excluir serviço");
      }
    } catch {
      alert("Erro ao tentar excluir serviço");
    }
  };

  const handleToggleVerificado = async (servico: Servico) => {
    const novoValor = !servico.verificado_admin;
    try {
      const res = await fetch("/api/admin/servicos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: servico.id,
          dados: { verificado_admin: novoValor },
        }),
      });

      const data = await res.json();
      if (data.sucesso) {
        setServicos((prev) =>
          prev.map((s) => (s.id === servico.id ? { ...s, verificado_admin: novoValor } : s))
        );
      }
    } catch {
      alert("Falha ao alterar status de verificado");
    }
  };

  const handleExcluirAvaliacao = async (avaliacaoId: string, servicoId: string) => {
    if (!confirm("Deseja excluir esta avaliação? A nota média do profissional será recalculada.")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/avaliacoes?id=${avaliacaoId}&servico_id=${servicoId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.sucesso) {
        setAvaliacoes((prev) => prev.filter((a) => a.id !== avaliacaoId));
        carregarDados();
      } else {
        alert(data.erro || "Falha ao excluir avaliação");
      }
    } catch {
      alert("Erro ao excluir avaliação");
    }
  };

  if (!autenticado && carregando) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
      </div>
    );
  }

  const servicosFiltrados = servicos.filter((s) => {
    const termo = busca.toLowerCase().trim();
    if (!termo) return true;
    return (
      s.nome.toLowerCase().includes(termo) ||
      s.categoria.toLowerCase().includes(termo) ||
      s.telefone.includes(termo) ||
      s.cidade_bairro.toLowerCase().includes(termo) ||
      (s.quem_indicou || "").toLowerCase().includes(termo)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {/* Topo da Administração */}
      <header className="bg-gray-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
              title="Voltar ao app público"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-xl overflow-hidden shadow-xs border border-amber-400/80 flex-shrink-0 bg-emerald-950">
                <Image
                  src="/logo.png"
                  alt="Logo Indica Jd.Regente"
                  fill
                  sizes="32px"
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <h1 className="text-base font-bold leading-tight">Painel de Moderação</h1>
                <p className="text-[11px] text-gray-400">Indica Jd. Regente • Indaiatuba</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportarCSV}
              className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              title="Baixar planilha Excel / CSV com todos os dados cadastrados"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exportar Excel</span>
            </button>

            <Link
              href="/cadastrar"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Novo Contato</span>
            </Link>

            <button
              onClick={handleLogout}
              className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-gray-700 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* Abas */}
        <div className="max-w-6xl mx-auto px-4 flex gap-4 border-t border-gray-800 text-xs">
          <button
            onClick={() => setAbaAtiva("servicos")}
            className={`py-2.5 font-bold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              abaAtiva === "servicos"
                ? "border-amber-400 text-amber-300"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Serviços Cadastrados</span>
            <span className="bg-gray-800 text-gray-300 px-1.5 py-0.2 rounded-full text-[10px]">
              {servicos.length}
            </span>
          </button>

          <button
            onClick={() => setAbaAtiva("avaliacoes")}
            className={`py-2.5 font-bold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              abaAtiva === "avaliacoes"
                ? "border-amber-400 text-amber-300"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Avaliações & Depoimentos</span>
            <span className="bg-gray-800 text-gray-300 px-1.5 py-0.2 rounded-full text-[10px]">
              {avaliacoes.length}
            </span>
          </button>

          <button
            onClick={() => setAbaAtiva("google")}
            className={`py-2.5 font-bold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              abaAtiva === "google"
                ? "border-amber-400 text-amber-300"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Importar do Google</span>
            <span className="bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold border border-amber-400/30">
              Novo
            </span>
          </button>
        </div>
      </header>

      {/* Barra de Status e Métricas da Comunidade (Admin) */}
      <div className="bg-gray-900 border-t border-gray-800 text-gray-300 py-2 px-4 text-xs shadow-inner">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-400">Comunidade Ativa</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-300">Jd. Regente - Indaiatuba</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-gray-400">
            <span>
              <strong className="text-white font-bold">{servicos.length}</strong> serviços recomendados
            </span>
            <span>•</span>
            <span>
              <strong className="text-amber-400 font-bold">{avaliacoes.length}</strong> avaliações
            </span>
            <span>•</span>
            <span>
              <strong className="text-blue-400 font-bold">
                {servicos.filter((s) => s.verificado_admin).length}
              </strong>{" "}
              verificados
            </span>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main className="max-w-6xl mx-auto px-4 pt-4">
        {/* Cards de Métricas / KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
          <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[11px] font-bold">Total Serviços</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-gray-900">{servicos.length}</div>
            <span className="text-[10px] text-emerald-700 font-semibold">Cadastrados no app</span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[11px] font-bold">Vizinhos Moradores</span>
              <Home className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-900">
              {servicos.filter((s) => s.eh_morador).length}
            </div>
            <span className="text-[10px] text-gray-500 font-medium">Moram no bairro</span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[11px] font-bold">Avaliações</span>
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-950">{avaliacoes.length}</div>
            <span className="text-[10px] text-amber-800 font-medium">Depoimentos reais</span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[11px] font-bold">Verificados</span>
              <ShieldCheck className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-blue-950">
              {servicos.filter((s) => s.verificado_admin).length}
            </div>
            <span className="text-[10px] text-blue-700 font-medium">Selo de moderação</span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-2xs col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[11px] font-bold">Com Ofertas</span>
              <Tag className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-orange-950">
              {servicos.filter((s) => s.oferta_vizinho).length}
            </div>
            <span className="text-[10px] text-orange-700 font-medium">Descontos ativos</span>
          </div>
        </div>

        {abaAtiva === "servicos" ? (
          <div>
            {/* Barra de pesquisa da lista de contatos */}
            <div className="mb-4 flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Pesquisar por nome, categoria, bairro ou telefone..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-gray-300 text-xs focus:ring-2 focus:ring-gray-900 outline-none"
                />
              </div>

              <div className="text-xs text-gray-500 font-medium self-end sm:self-center">
                Exibindo {servicosFiltrados.length} de {servicos.length} contatos
              </div>
            </div>

            {/* Tabela / Cards de Serviços */}
            {carregando ? (
              <div className="py-12 text-center text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-600" />
                <span className="text-xs">Carregando contatos...</span>
              </div>
            ) : servicosFiltrados.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-gray-500 border border-gray-200">
                Nenhum serviço encontrado.
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-700">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-semibold text-[10px]">
                      <tr>
                        <th className="px-4 py-3">Profissional / Serviço</th>
                        <th className="px-4 py-3">Categoria</th>
                        <th className="px-4 py-3">WhatsApp / Telefone</th>
                        <th className="px-4 py-3">Bairro / Cidade</th>
                        <th className="px-4 py-3">Avaliações</th>
                        <th className="px-4 py-3">Verificado</th>
                        <th className="px-4 py-3 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {servicosFiltrados.map((s) => (
                        <tr key={s.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-bold text-gray-900">{s.nome}</div>
                            {s.quem_indicou && (
                              <div className="text-[10px] text-emerald-700">
                                Indicado por: {s.quem_indicou}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-md font-medium text-[11px]">
                              {s.categoria}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-[11px] text-gray-900">
                            {s.telefone}
                          </td>
                          <td className="px-4 py-3 text-gray-600 truncate max-w-[150px]">
                            {s.cidade_bairro}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 font-bold text-gray-900">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                              <span>{s.nota_media.toFixed(1)}</span>
                              <span className="text-gray-400 font-normal text-[10px]">
                                ({s.total_avaliacoes})
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleToggleVerificado(s)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                                s.verificado_admin
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                  : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                              }`}
                            >
                              {s.verificado_admin ? "✓ Sim" : "Não"}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setServicoParaEditar(s);
                                  setModalEdicaoAberto(true);
                                }}
                                className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                title="Editar contato"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleExcluirServico(s.id, s.nome)}
                                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Excluir contato"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Aba de Avaliações */
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Todas as Avaliações ({avaliacoes.length})
            </h3>

            {avaliacoes.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-gray-500 border border-gray-200">
                Nenhuma avaliação registrada até o momento.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {avaliacoes.map((av) => {
                  const servicoRelacionado = servicos.find((s) => s.id === av.servico_id);

                  return (
                    <div
                      key={av.id}
                      className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div>
                            <span className="text-[10px] text-gray-400 block">
                              Profissional: <strong className="text-gray-800">{servicoRelacionado?.nome || "Não encontrado"}</strong>
                            </span>
                            <span className="font-bold text-xs text-gray-900">
                              {av.nome_avaliador}
                            </span>
                          </div>

                          <div className="flex items-center text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < av.nota ? "fill-amber-400 text-amber-400" : "text-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {av.comentario && (
                          <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100 my-2 leading-relaxed">
                            &ldquo;{av.comentario}&rdquo;
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2 text-[11px] text-gray-400">
                        <span>
                          {new Date(av.created_at).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>

                        <button
                          onClick={() => handleExcluirAvaliacao(av.id, av.servico_id)}
                          className="text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Excluir</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Aba: Importar do Google */}
        {abaAtiva === "google" && (
          <div className="space-y-4">
            <GooglePlacesImporter onImportado={carregarDados} />
          </div>
        )}
      </main>

      {/* Modal de Edição */}
      <AdminEditModal
        servico={servicoParaEditar}
        isOpen={modalEdicaoAberto}
        onClose={() => {
          setModalEdicaoAberto(false);
          setServicoParaEditar(null);
        }}
        onSalvo={carregarDados}
      />
    </div>
  );
}
