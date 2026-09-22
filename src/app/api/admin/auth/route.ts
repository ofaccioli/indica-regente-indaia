import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  validarSenhaAdmin,
  gerarTokenAdmin,
  isRequisicaoAdmin,
  ADMIN_COOKIE_NAME,
} from "@/lib/admin-auth";

export async function GET() {
  const autenticado = await isRequisicaoAdmin();
  return NextResponse.json({ autenticado });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { senha } = body;

    if (!validarSenhaAdmin(senha)) {
      return NextResponse.json(
        { sucesso: false, erro: "Senha de administrador incorreta" },
        { status: 401 }
      );
    }

    const token = gerarTokenAdmin();
    const cookieStore = await cookies();

    cookieStore.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return NextResponse.json({ sucesso: true, mensagem: "Autenticado com sucesso" });
  } catch (error) {
    console.error("Erro no login admin:", error);
    return NextResponse.json(
      { sucesso: false, erro: "Erro ao autenticar" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_COOKIE_NAME);
    return NextResponse.json({ sucesso: true, mensagem: "Sessão encerrada" });
  } catch (error) {
    console.error("Erro no logout admin:", error);
    return NextResponse.json(
      { sucesso: false, erro: "Erro ao encerrar sessão" },
      { status: 500 }
    );
  }
}
