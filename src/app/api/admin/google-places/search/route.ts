import { NextResponse } from "next/server";
import { isRequisicaoAdmin } from "@/lib/admin-auth";
import { buscarLugaresGoogle } from "@/lib/googlePlaces";
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
    const minRating = parseFloat(searchParams.get("minRating") || "4.5");

    const { lugares, isApiKeyAtiva } = await buscarLugaresGoogle(termo, categoria, minRating);

    // Carrega serviços já existentes para cruzar duplicidades por nome e telefone
    const servicosExistentes = await listarServicos();
    const telefonesCadastrados = new Set(
      servicosExistentes.map((s) => s.telefone_numeros || s.telefone.replace(/\D/g, ""))
    );
    const nomesCadastrados = new Set(
      servicosExistentes.map((s) => s.nome.toLowerCase().trim())
    );

    const lugaresComStatus = lugares.map((l) => {
      const telLimpo = l.telefone.replace(/\D/g, "");
      const jaExiste =
        (telLimpo && telefonesCadastrados.has(telLimpo)) ||
        nomesCadastrados.has(l.nome.toLowerCase().trim());

      return {
        ...l,
        ja_cadastrado: Boolean(jaExiste),
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
