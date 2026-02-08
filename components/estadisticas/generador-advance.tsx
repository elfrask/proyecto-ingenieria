import { generateGroup, nameForGroupFromSearch } from "@/hooks/estadisticas/generate-data-estadisc-from-search";
import { dataResultSearch } from "@/hooks/estadisticas/use-search";
import { useServerQuery } from "@/hooks/get-async";
import { EstadisticaResultado, getAdvanceEstadistica } from "@/lib/estadisticas-actions";
import { Notify } from "@/lib/utils";
import { FunctionComponent, useEffect, useMemo } from "react";
import { ChartConfig } from "../ui/chart";
import { ChartAreaKpi } from "../commons/kapis-elements/area-chart";
import { FileText, PieChart } from "lucide-react";
import ChartPieKpi from "../commons/kapis-elements/chart-pie";
import { ListColors } from "@/lib/colors";


interface GeneradorProps {
  search: dataResultSearch,
  tipo: string,
  field: string,
  mode: string,
}

// Actividad
const configEstadisticaActividad = {
  cantidad: { label: "Actividad", color: "var(--color-orange-600)" },
} satisfies ChartConfig;


// Selects

// const dataPrestamosPie = [
//   { tipo: "personal", monto: 45000, fill: "var(--color-personal)" },
//   { tipo: "vehiculo", monto: 25000, fill: "var(--color-vehiculo)" },
//   { tipo: "vivienda", monto: 80000, fill: "var(--color-vivienda)" },
//   { tipo: "emergencia", monto: 10000, fill: "var(--color-emergencia)" },
// ];

// const configPrestamosPie = {
//   personal: { label: "Personal", color: "var(--color-red-600)" },
//   vehiculo: { label: "Vehículo", color: "var(--color-blue-600)" },
//   vivienda: { label: "Vivienda", color: "var(--color-green-600)" },
//   emergencia: { label: "Emergencia", color: "var(--color-orange-600)" },
// };

const Generador: FunctionComponent<GeneradorProps> = ({
  field,
  mode,
  search,
  tipo,
}) => {



  const req = useServerQuery<EstadisticaResultado, any>(
    (ctx) => {

      const def: EstadisticaResultado = { markers: [], minutes: [], } as unknown as EstadisticaResultado

      if (!field) return def
      if (!mode) return def
      if (!tipo) return def
      if (search.modo === "") return def

      return getAdvanceEstadistica(search, tipo, field, mode)
    },
    {
      onError(err, msg, error) {
        // Notify.reject("Hubo un error al cargar la estadística", msg)
      },
      autoLoadDisable: true
    }
  )

  useEffect(() => {

    if (!field) return undefined
    if (!mode) return undefined
    if (!tipo) return undefined
    if (search.modo === "") return undefined

    req.reload()
  }, [field, mode, search, tipo])


  const {
    grupos, select
  } = useMemo(() => {

    let g = generateGroup(search)
    const _grupos = {
      ...g,
      ...Object.groupBy(req.data?.minutes || [], (value, i) => nameForGroupFromSearch(value, search.modo, "report_date").value)
    }
    // console.log("g", g)
    // console.log("grupos", _grupos)


    let gen = Object.entries(_grupos)

    if (search.modo === "mes") {
      gen = gen.sort()

    }

    let distribucion = {
      config: {} as ChartConfig,
      data: [] as ({
        label: string,
        cantidad: number,
        fill: string
      })[]
    }

    if (req.data?.campo?.type === "select") {


      let ss: Record<string, number> = {};
      req.data.origins.forEach((x, y) => {
        const color = `var(--color${ListColors[y] || "-black"})`

        distribucion.config[x.value] = {
          label: x.title,
          color: color
        };

        ss[x.value] = 0
        // console.log(x)
      })

      req.data.minutes.forEach(x => {
        ss[x.fields[field]]++;
      })
      // console.log(ss)
      Object.entries(ss).forEach((x, y) => {
        const color = `var(--color${ListColors[y] || "-black"})`;

        distribucion.data.push({
          fill: color,
          label: distribucion.config[x[0]]?.label as string,
          cantidad: x[1]
        })
      })


    }

    return {
      grupos: gen.map(x => ({
        key: x[0],
        data: x[1],
        cantidad: x[1]?.length,
      })),
      select: {
        distribucion
      }
    }
  }, [req.data?.minutes]);

  // console.log(grupos)

  if (!field) return ""
  if (!mode) return ""
  if (!tipo) return ""
  if (search.modo === "") return ""

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full">
        <ChartAreaKpi
          title="Actividad de minutas con el tiempo"
          data={grupos}
          indexKey="key"
          config={configEstadisticaActividad}
          categories={["cantidad"]}
          icon={"FileText"}

        />
      </div>
      {
        // Selected
        req.data?.campo?.type === "select" &&
        <ChartPieKpi
          config={select.distribucion.config}
          data={select.distribucion.data}
          datakey="cantidad"
          title="Ranking de elementos mas seleccionados"
          icon={PieChart}
          keyLabel="label"
        />
      }

      <div>
        
      </div>
    </div>
  );
}

export default Generador;