import { FunctionComponent, useMemo } from "react";
import { CellInputPropsTemplate } from "./types";
import { Items } from "@/types/form.types";


interface CellSelectInputProps extends CellInputPropsTemplate<string>  {
  items: Items[] | readonly Items[];
}
 
const CellSelectInput: FunctionComponent<CellSelectInputProps> = ({
  defaultValue, onSave, items, className, onChange
}) => {
  
  const eles = useMemo(() => {

    return items.map((x, y) => {
      return (
        <option key={y} value={x.value} >
          {x.label}
        </option>
      )
    })
  }, [items])


  return (
    <div className="p-0 w-full h-full">
      <select
        className="w-full h-full"
        defaultValue={defaultValue}
        onChange={x => {
          onChange?.(x as any)
          onSave?.(x.target.value)
        }}
      >
        {eles}
      </select>
    </div>
  );
}
 
export default CellSelectInput;