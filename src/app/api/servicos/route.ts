import { NextResponse } from "next/server";
import { listarServicos, cadastrarServico } from "@/lib/supabase";

export async function GET() {
  try {
    const servicos = await listarServicos();
    return NextResponse.json({ sucesso: true, dados: servicos });
  } catch (error) {
    console.error("Erro na rota /api/servicos:", error);
    return NextResponse.json(
      { sucesso: false, erro: "Falha ao listar serviços" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, categoria, telefone, cidade_bairro, descricao, quem_indicou } = body;

    if (!nome || !telefone || !cidadeBairroVal(cidade_bairro)) {
      return NextResponse.json(
        { sucesso: false, erro: "Campos obrigatórios ausentes" },
        { status: 400 }
      );
    }

    const resultado = await cadastrarServico({
      nome,
      categoria: categoria || "Outros",
      telefone,
      telefone_numeros: telefone.replace(/\D/g, ""),
      cidade_bairro: cidade_bairro,
      descricao: descricao || "",
      quem_indicou: quem_indicou || "Comunidade",
    });

    if (!resultado.sucesso) {
      return NextResponse.json(
        { sucesso: false, erro: resultado.erro },
        { status: 409 }
      );
    }

    return NextResponse.json({ sucesso: true, dados: resultado.servico }, { status: 201 });
  } catch (error) {
    console.error("Erro no POST /api/servicos:", error);
    return NextResponse.json(
      { sucesso: false, erro: "Erro ao processar cadastro" },
      { status: 500 }
    );
  }
}

function cidadeBairroVal(val: unknown): boolean {
  return typeof val === "string" && val.trim().length > 0;
}
