import { dataResultSearch, useSearch } from "@/hooks/estadisticas/use-search";
import { FunctionComponent } from "react";
import { Button } from "../ui/button";
import { Download, FileTextIcon, LucidePrinter, MapPin, Search } from "lucide-react";
import { useServerQuery } from "@/hooks/get-async";
import { getAllMarkers, getAllMinutes } from "@/lib/map-actions";
import CardKpis from "../commons/kapis-elements/top-card";
import RenderSearchDate from "../commons/render-search-date";
import { openAndPrint } from "@/lib/reportes";
import { searchConvertToParams } from "@/lib/search.lib";


interface ResumenProps {
  
}
 
const Resumen: FunctionComponent<ResumenProps> = () => {

  const {
    call,
    search,
    SearchNode
  } = useSearch({
    onSearch(data) {
      // console.log("inicio", data.init);
      // console.log("Fin", data.end);
      Markers.reload(data)
    },
  });


  // Markers
  const Markers = useServerQuery(
    // Query
    (ctx) => {

      // console.log("contexto", ctx, ctx.modo === "todo")
      if (ctx.modo === "") return []
      return getAllMarkers((ctx.modo === "todo")? {} : {
        report_date: {
          $gte: ctx.init,
          $lte: ctx.end
        },
      })
    },

    // Opciones
    {
      defaultContext: {
        modo: ""
      } as dataResultSearch,
      onError(err, msg, error) {
        // Notify.reject("Hubo un error", msg);
        console.log("error", err, msg, err)
      },
      onSuccess(data, msg) {
        const ids = data.map(x => x.id as number);
        Minutes.reload({ids})
      },
    }
  );

  // Minutes
  const Minutes = useServerQuery(
    // Query
    (ctx) => getAllMinutes({marker_id:  { $in: ctx.ids}}),

    // Opciones
    {
      defaultContext: {
        ids: [] as number[]
      },
      onError(err, msg, error) {
        // Notify.reject("Hubo un error", msg);
      },
    }
  );
  // console.log(search)

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <Button onClick={x => call()} variant={"outline"}>
          {/* Aplicar Filtro */}
          <Search />
          <RenderSearchDate data={search} placeholder="Seleccionar Periodo" />
        </Button>

        <Button onClick={x => openAndPrint(`/reportes/resumen?${searchConvertToParams(search)}`)}>
          <LucidePrinter />
          Imprimir reporte
        </Button>

      </div>

      <div className="grid grid-cols-2 gap-4">
        <CardKpis 
          icon={MapPin}
          titulo="Puntos de riesgos"
          bgColor="bg-orange-600"
          contenido={Markers.data?.length || 0}
          border
        />
        <CardKpis 
          icon={FileTextIcon}
          titulo="Minutas registradas"
          bgColor="bg-sky-600"
          contenido={Minutes.data?.length || 0}
          border
        />
      </div>

      <div className="w-full">

      </div>

      {SearchNode}
    </div>
  );
}
 
export default Resumen;