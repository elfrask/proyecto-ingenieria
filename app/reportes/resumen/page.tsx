import { FunctionComponent } from "react";
import { FileTextIcon, MapPin } from "lucide-react";
import CardKpis from "@/components/commons/kapis-elements/top-card";
import PrintComponent from "../print";
import { paramsPeriodo } from "../types";
import { getAllMarkers, getAllMinutes } from "@/lib/map-actions";
import { convertDateToRequest } from "@/lib/search.lib";


 
const ResumenReport: FunctionComponent<paramsPeriodo> = async ({searchParams}) => {

  const d = await searchParams;

  // console.log(d.init)
  
  const Markers = await getAllMarkers(d.modo === "todo"? {} : {
    report_date: convertDateToRequest(d.init, d.end)
  });

  const Minutes = await getAllMinutes({
    marker_id: { $in: Markers.result?.map(x => x.id)}
  })
  
  return (
     <div className="w-full flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <CardKpis 
          icon={MapPin}
          titulo="Puntos de riesgos"
          bgColor="bg-orange-600"
          contenido={Markers.result?.length || 0}
          border
        />
        <CardKpis 
          icon={FileTextIcon}
          titulo="Minutas registradas"
          bgColor="bg-sky-600"
          contenido={Minutes.result?.length || 0}
          border
        />
      </div>

      <div className="w-full">

      </div>
      <PrintComponent />
    </div>
  );
}
 
export default ResumenReport;