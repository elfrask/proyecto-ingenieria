
import * as Lucide from "lucide-react";

export type IconKey = Lucide.LucideIcon | keyof typeof Lucide;

export function parseLucide(icon?: IconKey): Lucide.LucideIcon {
  if (!icon) {
    return undefined as unknown as Lucide.LucideIcon
  }
  return ((typeof icon === "string")? Lucide[icon as keyof typeof Lucide] as Lucide.LucideIcon :  icon) as Lucide.LucideIcon
}