import RenderSearchDate from "@/components/commons/render-search-date";
import Generador from "@/components/estadisticas/generador-advance";
import { dataResultSearch } from "@/hooks/estadisticas/use-search";
import { FunctionComponent } from "react";

interface Params extends dataResultSearch {
  modeProcess: string
  tipo: string;
  field: string;
}

interface AdvanceProps {
  searchParams: Promise<Params>;
  
}
 
const Advance: FunctionComponent<AdvanceProps> =async ({
  searchParams
}) => {
  
  const param = await searchParams;

  const search: dataResultSearch = {
    modo: param.modo as dataResultSearch["modo"],
    end: new Date(param.end),
    init: new Date(param.init),
  };


  
  return (
    <div className="w-full">
      <div className="px-4">
        {"Periodo de tiempo comprendido en: "}
        <RenderSearchDate data={search} placeholder="Periodo no seleccionado" />
      </div>
      <Generador 
        field={param.field as string}
        tipo={param.tipo as string}
        search={search}
        mode={param.modeProcess}
        forPrint
      />
    </div>
  );
}
 
export default Advance;