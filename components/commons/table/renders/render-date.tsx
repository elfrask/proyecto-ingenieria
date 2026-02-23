import { RenderTable } from "../table";
import { formatDate } from "@/lib/utils";


export const renderTableDate: RenderTable<Date, any> = (value, row, index, className?: string) => {
  

  return (
    formatDate(new Date(value))
  )
}