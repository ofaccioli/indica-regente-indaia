import { NextResponse } from "next/server";
import { isRequisicaoAdmin } from "@/lib/admin-auth";
import { buscarLugaresGoogle, normalizarParaDeduplicacao } from "@/lib/googlePlaces";
import { listarServicos } from "@/lib/supabase";

export async function GET(request: Request) {
  const autenticado = await isRequisicaoAdmin();
  if (!autenticado) {
    return NextResponse.json({ sucesso: false, erro: "Não autorizado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const termo = searchParams.get("termo") || "";
    const categoria = searchParams.get("categoria") || "Todos";
    const minRating = parseFloat(searchParams.get("minRating") || "0");
    const proximidade = searchParams.get("proximidade") || "todas";

    const { lugares, isApiKeyAtiva } = await buscarLugaresGoogle(termo, categoria, minRating, proximidade);

    // Carrega serviços já existentes para cruzar duplicidades por nome e telefone
    const servicosExistentes = await listarServicos();
    const telefonesCadastrados = new Set(
      servicosExistentes
        .map((s) => (s.telefone_numeros || s.telefone || "").replace(/\D/g, ""))
        .filter((t) => t.length >= 8)
    );
    const nomesCadastradosNorm = servicosExistentes.map((s) => ({
      original: s.nome,
      norm: normalizarParaDeduplicacao(s.nome.replace(/indaiatuba/gi, "")),
      categoria: s.categoria,
    }));

    const lugaresComStatus = lugares.map((l) => {
      const telLimpo = (l.telefone || "").replace(/\D/g, "");
      const nomeNorm = normalizarParaDeduplicacao(l.nome.replace(/indaiatuba/gi, ""));

      let jaExiste = false;

      // 1. Checa por telefone cadastrado
      if (telLimpo && telLimpo.length >= 8 && telefonesCadastrados.has(telLimpo)) {
        jaExiste = true;
      }

      // 2. Checa por nome similar
      if (!jaExiste && nomeNorm.length >= 4) {
        jaExiste = nomesCadastradosNorm.some((exist) => {
          if (exist.norm === nomeNorm) return true;
          if (exist.norm.length >= 6 && nomeNorm.length >= 6) {
            if (exist.norm.includes(nomeNorm) || nomeNorm.includes(exist.norm)) {
              return true;
            }
          }
          return false;
        });
      }

      return {
        ...l,
        ja_cadastrado: jaExiste,
      };
    });

    return NextResponse.json({
      sucesso: true,
      lugares: lugaresComStatus,
      isApiKeyAtiva,
    });
  } catch (error) {
    console.error("Erro na busca de lugares:", error);
    return NextResponse.json(
      { sucesso: false, erro: "Erro ao buscar estabelecimentos no Google" },
      { status: 500 }
    );
  }
}
