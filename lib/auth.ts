
import { cookies } from "next/headers";
import { User } from "./db";
import bcrypt from "bcrypt";

const COOKIE_NAME = "session_token";

export interface Session {
  user: string;
  role: string;
}

// Iniciar sesión y guardar en cookie
export async function login(user: string, pass: string): Promise<Session | null> {
  const found = await User.findOne({ user });
  if (!found) return null;
  const valid = await bcrypt.compare(pass, found.pass);
  if (!valid) return null;
  const session: Session = { user: found.user, role: found.role };
  (await cookies()).set(COOKIE_NAME, JSON.stringify(session), { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 });
  return session;
}

// Obtener sesión desde cookie
export async function getSession(): Promise<Session | null> {
  const cookie = (await cookies()).get(COOKIE_NAME)?.value;
  if (!cookie) return null;
  try {
    const session = JSON.parse(cookie);
    return session;
  } catch {
    return null;
  }
}

// Cerrar sesión (elimina cookie)
export async function logout() {
  (await cookies()).set(COOKIE_NAME, "", { maxAge: 0 });
}
