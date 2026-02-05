import { Trash2 } from "lucide-react";
import { GenerateActionButton } from "../columns";

export const ActionButtonEliminar = GenerateActionButton({
  title: "Eliminar",
  icon: Trash2,
  className: "text-red-500 hover:text-red-900"
})