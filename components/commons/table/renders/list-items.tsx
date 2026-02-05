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
