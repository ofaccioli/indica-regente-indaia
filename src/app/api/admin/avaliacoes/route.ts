import { NextResponse } from "next/server";
import { isRequisicaoAdmin } from "@/lib/admin-auth";
import { listarTodasAvaliacoes, excluirAvaliacao } from "@/lib/supabase";

export async function GET() {
  const autorizado = await isRequisicaoAdmin();
  if (!autorizado) {
    return NextResponse.json(
      { sucesso: false, erro: "Acesso negado: faça login como administrador" },
      { status: 401 }
    );
  }

  try {
    const avaliacoes = await listarTodasAvaliacoes();
    return NextResponse.json({ sucesso: true, avaliacoes });
  } catch (error) {
    console.error("Erro no GET /api/admin/avaliacoes:", error);
    return NextResponse.json(
      { sucesso: false, erro: "Falha ao listar avaliações" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const autorizado = await isRequisicaoAdmin();
  if (!autorizado) {
    return NextResponse.json(
      { sucesso: false, erro: "Acesso negado: faça login como administrador" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const servicoId = searchParams.get("servico_id");

    if (!id || !servicoId) {
      return NextResponse.json(
        { sucesso: false, erro: "ID da avaliação e ID do serviço são obrigatórios" },
        { status: 400 }
      );
    }

    const res = await excluirAvaliacao(id, servicoId);
    return NextResponse.json(res);
  } catch (error) {
    console.error("Erro no DELETE /api/admin/avaliacoes:", error);
    return NextResponse.json(
      { sucesso: false, erro: "Falha ao excluir avaliação" },
      { status: 500 }
    );
  }
}
