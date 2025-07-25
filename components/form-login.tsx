"use client"


import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";

import Image from "next/image";

import logoPC from "../public/logo.png";
import { login } from "@/lib/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function FormLogin() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false)
  const route = useRouter()

  return (
    <Card className="max-w-md mx-auto mt-10 p-6 flex flex-col gap-4 w-11/12">
      <div className="flex flex-col items-center mb-2">
        <Image
          src={logoPC}
          alt="Logo Protección Civil Anzoátegui"
          width={100}
          height={100}
          className="mb-2 rounded-full shadow-lg border-4 border-orange-500 bg-white"
          priority
        />
        <h2 className="text-xl font-bold text-center">Iniciar sesión</h2>
      </div>
      <form
        className="flex flex-col gap-4 space-y-1"
        autoComplete="off"
        onSubmit={async e => {
            setLoading(true)
          e.preventDefault();

          console.log(user, pass)

          try {
              const result = await login(user, pass)

              if (result.success) {
                toast("Haz iniciado session correctamente", {
                    description: result.msg,
                    className: "text-green-300"
                })

                setTimeout(() => {
                    route.push("/dashboard")
                }, 1000)
              } else {
                setLoading(false)
                toast("Hubo un problema al intentar iniciar session",{
                    description: result.msg,
                    className:"text-red-400",
                })
              }

          } catch (error) {
                setLoading(false)
                toast("Hubo un problema al intentar iniciar session",{
                    description: error as string,
                    className:"text-red-400",
                })
          }

          
          // Aquí procesarás los datos del formulario
        }}
      >
        <Label htmlFor="user">Usuario</Label>
        <Input
          id="user"
          name="user"
          value={user}
          onChange={e => setUser(e.target.value)}
          required
          autoFocus
          autoComplete="username"
        />
        <Label htmlFor="pass">Contraseña</Label>
        <Input
          id="pass"
          name="pass"
          type="password"
          value={pass}
          onChange={e => setPass(e.target.value)}
          required
          autoComplete="current-password"
        />
        <Button type="submit" disabled={loading} className="w-full mt-2">Entrar</Button>
      </form>
    </Card>
  );
}