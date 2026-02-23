import { BadgeDollarSign, Eye, FileCheck, HandCoins, Landmark, Palmtree, PlusCircle, Stethoscope } from "lucide-react";
import { GenerateActionButton } from "../columns";


export const Salarial = GenerateActionButton({ icon: BadgeDollarSign, title: "Salarial", className: "cursor-default" })
export const SeguridadSocial = GenerateActionButton({ icon: Stethoscope, title: "Seguridad Social", className: "cursor-default text-red-600 hover:text-red-600" })
export const Impuestos = GenerateActionButton({ icon: Landmark, title: "Impuestos", className: "cursor-default text-purple-600 hover:text-purple-600" })
export const Liquidacion = GenerateActionButton({ icon: FileCheck, title: "Liquidacion", className: "cursor-default text-orange-600 hover:text-orange-600" })
export const Vacaciones = GenerateActionButton({ icon: Palmtree, title: "Vacaciones", className: "cursor-default text-yellow-600 hover:text-yellow-600" })
export const Utilidades = GenerateActionButton({ icon: PlusCircle, title: "Utilidades", className: "cursor-default text-green-600 hover:text-green-600" })
export const Prestacional = GenerateActionButton({ icon: HandCoins, title: "Prestacional", className: "cursor-default text-indigo-600 hover:text-indigo-600" })
