// "use client"
import { getSession } from "@/lib/auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  // Aquí puedes seguir usando lógica async de servidor si lo necesitas
  const user = await getSession();
  
  if (!user) redirect("/");

  console.log(user)

  return <DashboardClient />;
}