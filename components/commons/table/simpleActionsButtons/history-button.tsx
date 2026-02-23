import { History } from "lucide-react";
import { GenerateActionButton } from "../columns";


export const ActionButtonHistory = GenerateActionButton({
  title: "Ver Histórico",
  icon: History,
  className: "text-gray-400 hover:text-gray-900"
})