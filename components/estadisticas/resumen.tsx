import { dataResultSearch, useSearch } from "@/hooks/estadisticas/use-search";
import { FunctionComponent, useMemo } from "react";
import { Button } from "../ui/button";
import { Download, FileTextIcon, LucidePrinter, MapPin, Search } from "lucide-react";
import { useServerQuery } from "@/hooks/get-async";
import { getAllMarkers, getAllMinutes } from "@/lib/map-actions";
import CardKpis from "../commons/kapis-elements/top-card";
import RenderSearchDate from "../commons/render-search-date";
import { openAndPrint } from "@/lib/reportes";
import { searchConvertToParams } from "@/lib/search.lib";
import { ColumTable, TableComponent } from "../commons/table/table";
import { IMarker } from "@/lib/db-types";
import { renderTableDate } from "../commons/table/renders/render-date";
import { ChartAreaKpi } from "../commons/kapis-elements/area-chart";
import { formatDate } from "@/lib/utils";
import { ChartConfig } from "../ui/chart";
import { generateGroup, nameForGroupFromSearch } from "@/hooks/estadisticas/generate-data-estadisc-from-search";


const columnResumen: ColumTable<IMarker>[] = [
  { key: "subject", label: "Titulo" },
  { key: "report_date", label: "Fecha de reporte", render: renderTableDate },
  { key: "reference", label: "Referencia" },

]

const configEstadistica = {
  cantidad: { label: "Actividad", color: "var(--color-orange-600)" },
} satisfies ChartConfig;

const Resumen: FunctionComponent = () => {

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
      return getAllMarkers((ctx.modo === "todo") ? {} : {
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
        Minutes.reload({ ids })
      },
    }
  );

  // Minutes
  const Minutes = useServerQuery(
    // Query
    (ctx) => getAllMinutes({ marker_id: { $in: ctx.ids } }),

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


  const { Estadistica } = useMemo(() => {

    const Historico = Object.groupBy((Markers?.data || []) as IMarker[], (k, i) => nameForGroupFromSearch(k, search.modo, "report_date").value)


    const PreEstadistica = {
      ...generateGroup(search),
      ...Historico
    }
    console.log("llego", PreEstadistica)

    let preE = Object.entries(PreEstadistica);

    if (search.modo === "mes") {
      preE = preE.sort()
    }

    return ({
      Estadistica: preE.map(x => ({
        fecha: x[0],
        cantidad: x[1]?.length
      }))
    })
  }, [Markers.data])



  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <Button onClick={x => call()} variant={"outline"}>
          {/* Aplicar Filtro */}
          <Search />
          <RenderSearchDate data={search} placeholder="Seleccionar Periodo" />
        </Button>

        <Button onClick={x => openAndPrint(`/reportes/resumen?${searchConvertToParams(search)}`)} disabled={search.modo === ""}>
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

      {
        search.modo !== "" &&
        <div className="w-full">

          <ChartAreaKpi
            title="Actividad de reportes con el tiempo"
            data={Estadistica}
            indexKey="fecha"
            config={configEstadistica}
            categories={["cantidad"]}
            icon={MapPin}

          />
        </div>
      }

      <div className="w-full">
        <TableComponent
          columns={columnResumen}
          data={Markers?.data || []}

        />
      </div>

      {SearchNode}
    </div>
  );
}

export default Resumen;