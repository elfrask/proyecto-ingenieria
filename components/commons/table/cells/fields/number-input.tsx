import { cn } from "@/lib/utils";
import { FunctionComponent, useState } from "react";
import { CellInputPropsTemplate } from "./types";


interface CellNumberInputProps extends CellInputPropsTemplate<number> {

}
 
const CellNumberInput: FunctionComponent<CellNumberInputProps> = ({
  className, onValueChange, onChange, value: _va, onBlur, onSave, defaultValue,
  ...p
}) => {
  const [_v, _sv] = useState("")
  const [value, setValue] = useState<number>( defaultValue as number ||  "" as unknown as number)
  

  return (
    <input 
      {...p}
      type="number"
      value={
        // si es null solo lo vacía
        typeof value === null? "" :
        // si es texto intente parsearlo
        typeof value === "string"? _v :
        // si es numérico
        (typeof value === "number") && (!isNaN(value)) && value !== 0 ? (value): _v
      }
      className={cn(
        "border-0 outline-0 no-spinner w-full",
        className
      )}
      onChange={x => {
        onChange?.(x);
        let e = x.target.valueAsNumber;
        // console.log("celda:", x, e, value)
        _sv(x.target.value)
        setValue(e)
        if (!isNaN(e)) {
          onValueChange?.(e)
        }
      }}
      onBlur={x => {
        onBlur?.(x)
        if (value !== defaultValue) {
          
          onSave?.(value as number)
        }
      }}
    />
  );
}
 
export default CellNumberInput;