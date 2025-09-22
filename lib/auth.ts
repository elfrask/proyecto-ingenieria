"use server"
import { cookies } from "next/headers";
import { User } from "./db";
import bcrypt from "bcrypt";

const COOKIE_NAME = "session_token";



export interface Session {
  user: string;
  role: string;
}

export interface SessionCookie extends Session {
  pass: string;

}

export interface LoginResult<T> {
    success?: boolean,
    error?: number,
    msg?: string,
    isLogin?: T
}

// Iniciar sesión y guardar en cookie
export async function login(user: string, pass: string): Promise<LoginResult<boolean>> {

    let session: SessionCookie = {user:"", role:"", pass: ""};

    if (user === "admin") {
        if (pass !== process.env.ADMIN_PASS) return { success: false, isLogin: false, error:1, msg:"la contraseña es incorrecta" };
        session = {user: "admin", role: "admin", pass: bcrypt.hashSync(pass, 0)};
    } else {
        const found = await User.findOne({ user });
        if (!found) return { success: false, isLogin: false, error:1, msg:"el usuario no existe" };
        const valid = await bcrypt.compare(pass, found.pass);
        if (!valid) return { success: false, isLogin: false, error:2, msg:"la contraseña es incorrecta" };
        session = { user: found.user, role: found.role, pass: found.pass };

    }

  (await cookies()).set(COOKIE_NAME, JSON.stringify(session), { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 });
  return { success: true, isLogin: true, error:1, msg:"Haz iniciado session correctamente" };;
}

// Obtener sesión desde cookie
export async function getSession(): Promise<Session | null> {
  const cookie = (await cookies()).get(COOKIE_NAME)?.value;
  if (!cookie) return null;
  try {
    const session: SessionCookie = JSON.parse(cookie);
    const found = await User.findOne({ user: session.user });

    if (session.user !== "admin") {
      if (!found) return null;
      if (!(found.pass === session.pass)) return null;
      
    } else {
      if (!bcrypt.compareSync(process.env.ADMIN_PASS as string, session.pass)) return null
    }

    return {...session, pass: undefined} as Session;
  } catch {
    return null;
  }
}

// Cerrar sesión (elimina cookie)
export async function logout() {
  (await cookies()).set(COOKIE_NAME, "", { maxAge: 0 });
}
