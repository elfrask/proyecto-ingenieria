

import { RenderTable } from "../table";
import { Badge } from "@/components/ui/badge";
import { getColorByStatus, getColorByStatusFromVariant, VariantsColorsStatus } from "@/lib/get-color-by-status";
import { cn } from "@/lib/utils";

export type Estatus = VariantsColorsStatus; 

export const renderTableEstatusBadge: RenderTable<VariantsColorsStatus> = (value, row, index, className?: string) => {
  

  return (
    <Badge
      className={cn(`min-w-40 text-xs font-medium truncate max-w-xs ${value && getColorByStatusFromVariant(value)}`, className)}
    >
      {value.toUpperCase()}
    </Badge>
  )
}