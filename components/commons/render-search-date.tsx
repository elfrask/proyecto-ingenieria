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

  return ( `${format(data.init, "dd/MM/yyyy")} - ${format(data.end, "dd/MM/yyyy")}` );
}
 
export default RenderSearchDate;