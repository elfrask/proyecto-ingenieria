import { useMemo } from "react";
import { ColumTable } from "./table";



export function refineColumn<T, C>(colums: ColumTable<T, C>[], key: Extract<keyof T, string>, overWrite: Partial<ColumTable<T, C>>) {
  
  const idx = useMemo(() => {
    for (let i = 0; i < colums.length; i++) {
      const element = colums[i];
      
      if (element.key === key) {
        return i 
      }
    }

    return -1
  }, [colums])

  Object.assign((colums[idx]||{}), overWrite)
}