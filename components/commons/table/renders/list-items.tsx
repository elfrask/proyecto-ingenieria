import { Items } from "@/types/form.types";
import { RenderTable } from "../table";



export function generateTableList(separator: string) {
  
  const renderTableList: RenderTable<string[]> = (value, row, index) => {
    
    if (value) {
      return value.join(separator)
    }

    return []
  };

  return renderTableList
}

export const renderTableList = generateTableList(", ") 


export function renderTableItems(items: Items[], placeholder?: string) {
  const renderTableList: RenderTable<string[]> = (value, row, index) => {
    

    return items.find(x => x.value === value)?.label ||  placeholder || ""
  };

  return renderTableList
}