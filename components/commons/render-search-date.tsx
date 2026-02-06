import { _Meses } from "@/hooks/estadisticas/generate-data-estadisc-from-search";
import { dataResultSearch } from "@/hooks/estadisticas/use-search";
import { format } from "date-fns";
import { FunctionComponent } from "react";


interface RenderSearchDateProps {
  data: dataResultSearch;
  placeholder?: string
}
 
const RenderSearchDate: FunctionComponent<RenderSearchDateProps> = ({
  data, placeholder
}) => {

  if (data.modo === "") {
    return placeholder || "Seleccionar"
  }

  if (data.modo === "todo") {
    return "Todo"
  }

  if (data.modo === "año") {
    return `todo ${format(data.init, "yyyy")}`
  }
  
  if (data.modo === "mes") {
    return `${_Meses[format(data.init, "M")]} del ${format(data.init, "yyyy")}`
  }
  
  if (data.modo === "fecha") {
    return `${format(data.init, "dd/MM/yyyy")}`
  }

  return ( `${format(data.init, "dd/MM/yyyy")} - ${format(data.end, "dd/MM/yyyy")}` );
}
 
export default RenderSearchDate;