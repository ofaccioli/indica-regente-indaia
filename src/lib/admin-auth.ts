import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_COOKIE_NAME = "indica_admin_session";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const SECRET_SALT = process.env.ADMIN_SECRET || "indica-regente-indaia-secret-salt-2026";

/**
 * Gera o token de sessão a partir da senha configurada
 */
export function gerarTokenAdmin(): string {
  return crypto
    .createHmac("sha256", SECRET_SALT)
    .update(ADMIN_PASSWORD)
    .digest("hex");
}

/**
 * Valida se a senha digitada está correta
 */
export function validarSenhaAdmin(senha: string): boolean {
  if (!senha) return false;
  return senha.trim() === ADMIN_PASSWORD.trim();
}

/**
 * Valida se a requisição atual possui o cookie de administrador válido
 */
export async function isRequisicaoAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return false;

    const tokenEsperado = gerarTokenAdmin();
    return token === tokenEsperado;
  } catch {
    return false;
  }
}

export { ADMIN_COOKIE_NAME };
