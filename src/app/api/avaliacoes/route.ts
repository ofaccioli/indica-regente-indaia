import { NextResponse } from "next/server";
import { registrarAvaliacao } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { servico_id, nome_avaliador, nota, comentario } = body;

    if (!servico_id || typeof nota !== "number") {
      return NextResponse.json(
        { sucesso: false, erro: "servico_id e nota são obrigatórios" },
        { status: 400 }
      );
    }

    const resultado = await registrarAvaliacao(
      servico_id,
      nome_avaliador || "Membro da Comunidade",
      nota,
      comentario
    );

    return NextResponse.json(resultado);
  } catch (error) {
    console.error("Erro no POST /api/avaliacoes:", error);
    return NextResponse.json(
      { sucesso: false, erro: "Erro ao registrar avaliação" },
      { status: 500 }
    );
  }
}
