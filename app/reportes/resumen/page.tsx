import { FunctionComponent } from "react";
import { FileTextIcon, MapPin } from "lucide-react";
import CardKpis from "@/components/commons/kapis-elements/top-card";
import PrintComponent from "../print";
import { paramsPeriodo } from "../types";
import { getAllMarkers, getAllMinutes } from "@/lib/map-actions";
import { convertDateToRequest } from "@/lib/search.lib";
import { formatDate, toWith } from "@/lib/utils";
import { IMarker } from "@/lib/db-types";
import { ChartAreaKpi } from "@/components/commons/kapis-elements/area-chart";
import { ColumTable, TableComponent } from "@/components/commons/table/table";
import { renderTableDate } from "@/components/commons/table/renders/render-date";
import { ChartConfig } from "@/components/ui/chart";

const columnResumen: ColumTable<IMarker>[] = [
  { key: "subject", label: "Titulo" },
  { key: "report_date", label: "Fecha de reporte", render: renderTableDate },
  { key: "reference", label: "Referencia" },

]

const configEstadistica = {
  cantidad: { label: "Actividad", color: "var(--color-orange-600)" },
} satisfies ChartConfig;

const ResumenReport: FunctionComponent<paramsPeriodo> = async ({ searchParams }) => {

  const d = await searchParams;

  // console.log(d.init)

  const Markers = await getAllMarkers(d.modo === "todo" ? {} : {
    report_date: convertDateToRequest(d.init, d.end)
  });

  const Minutes = await getAllMinutes({
    marker_id: { $in: Markers.result?.map(x => x.id) }
  });

  const { Estadistica } = toWith([], () => {
  
      const Historico = Object.groupBy((Markers?.result || []) as IMarker[], (k, i) => formatDate(k.report_date))
  
      return ({
        Estadistica: Object.entries(Historico).map(x => ({
          fecha: x[0],
          cantidad: x[1]?.length
        }))
      })
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

          <ChartAreaKpi
            title="Actividad de reportes con el tiempo"
            data={Estadistica}
            indexKey="fecha"
            config={configEstadistica}
            categories={["cantidad"]}
            icon={"MapPin"}

          />
        </div>

      {/* <div className="w-full">
        <TableComponent
          columns={columnResumen}
          data={Markers?.result || []}

        />
      </div> */}
      <PrintComponent delay={2000} />
    </div>
  );
}

export default ResumenReport;