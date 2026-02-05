import { Edit } from "lucide-react";
import { GenerateActionButton } from "../columns";


export const ActionButtonEditar = GenerateActionButton({
  title: "Editar",
  icon: Edit,
  className: "text-indigo-500 hover:text-indigo-900"
})