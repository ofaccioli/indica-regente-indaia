import { NextResponse } from "next/server";
import { isRequisicaoAdmin } from "@/lib/admin-auth";
import { atualizarServico, excluirServico } from "@/lib/supabase";

export async function PUT(request: Request) {
  const autorizado = await isRequisicaoAdmin();
  if (!autorizado) {
    return NextResponse.json(
      { sucesso: false, erro: "Acesso negado: faça login como administrador" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { id, dados } = body;

    if (!id || !dados) {
      return NextResponse.json(
        { sucesso: false, erro: "ID e dados são obrigatórios" },
        { status: 400 }
      );
    }

    const res = await atualizarServico(id, dados);
    if (!res.sucesso) {
      return NextResponse.json({ sucesso: false, erro: res.erro }, { status: 400 });
    }

    return NextResponse.json({ sucesso: true, servico: res.servico });
  } catch (error) {
    console.error("Erro no PUT /api/admin/servicos:", error);
    return NextResponse.json(
      { sucesso: false, erro: "Falha ao atualizar serviço" },
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

    if (!id) {
      return NextResponse.json(
        { sucesso: false, erro: "ID do serviço é obrigatório" },
        { status: 400 }
      );
    }

    const res = await excluirServico(id);
    return NextResponse.json(res);
  } catch (error) {
    console.error("Erro no DELETE /api/admin/servicos:", error);
    return NextResponse.json(
      { sucesso: false, erro: "Falha ao excluir serviço" },
      { status: 500 }
    );
  }
}
