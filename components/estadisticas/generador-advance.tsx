"use client"
import { generateGroup, nameForGroupFromSearch, sortDataList } from "@/hooks/estadisticas/generate-data-estadisc-from-search";
import { dataResultSearch } from "@/hooks/estadisticas/use-search";
import { useServerQuery } from "@/hooks/get-async";
import { EstadisticaResultado, getAdvanceEstadistica, IMinuteEstadistica } from "@/lib/estadisticas-actions";
import { FunctionComponent, useEffect, useMemo } from "react";
import { ChartConfig } from "../ui/chart";
import { ChartAreaKpi } from "../commons/kapis-elements/area-chart";
import { BarChart2, Divide, PieChart, Sigma } from "lucide-react";
import ChartPieKpi from "../commons/kapis-elements/chart-pie";
import { ListColors } from "@/lib/colors";
import { toWith } from "@/lib/utils";
import { TopCard } from "../commons/top-page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import { ColumTable, TableComponent } from "../commons/table/table";
import { renderTableDate } from "../commons/table/renders/render-date";
import { Separator } from "../ui/separator";
import StaticReportTable from "../commons/table/static-table";
import { refineColumn } from "../commons/table/lib";


interface GeneradorProps {
  search: dataResultSearch,
  tipo: string,
  field: string,
  mode: string,
  forPrint?: boolean;
}

// Actividad
const configEstadisticaActividad = {
  cantidad: { label: "Actividad", color: "var(--color-orange-600)" },
} satisfies ChartConfig;


// Numbers

const configNumberEstadisticaActividadPromedio = {
  promedio: { label: "Promedio", color: "var(--color-yellow-600)" },
} satisfies ChartConfig;

const configNumberEstadisticaActividadSumatoria = {
  sumatoria: { label: "Sumatoria", color: "var(--color-sky-600)" },
} satisfies ChartConfig;

const configNumberEstadisticaActividadSumatoriaYPromedio = {
  promedio: { label: "Promedio", color: "var(--color-yellow-600)" },
  sumatoria: { label: "Sumatoria", color: "var(--color-sky-600)" },
} satisfies ChartConfig;




interface calculosNumericos {
  key: string;
  sumatoria: number;
  promedio: number;
}

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

// TABLAS GENERALES

interface TablaGeneral {
  marker: string;
  report_date: Date;
  title: string;

}

const generalColumns: ColumTable<TablaGeneral>[] = [
  {
    key: "marker",
    label: "Titulo del punto",
  },
  {
    key: "report_date",
    label: "Fecha de registro",
    render: renderTableDate
  },
  {
    key: "title",
    label: "Titulo de la minuta",
  },

];


interface IGruposTabla {
  key: string;
  data: IMinuteEstadistica[];
  cantidad: number | undefined;
};

const generalTablaGrupos: ColumTable<IGruposTabla>[] = [
  {
    key: "key",
    label: "Fecha/Mes"
  },
  {
    key: "cantidad",
    label: "Minutas registradas en ese tiempo"
  }
]

// TABLAS PARA SELECT

interface TablaDistribucion {
  label: string;
  cantidad: number
};

const TablaDistribucionColumnas: ColumTable<TablaDistribucion>[] = [
  {
    key: "label",
    label: "Titulo"
  },
  {
    key: "cantidad",
    label: "Veces seleccionado"
  },
]

const TablaCalculoNumericoColums: ColumTable<calculosNumericos>[] = [
  {
    key: "key",
    label: "Fecha/Mes"
  },
  {
    key: "sumatoria",
    label: "Sumatoria"
  },
  {
    key: "promedio",
    label: "Promedio"
  },

]


interface ITablaMinutaEspecial {
  title: string;
  report_date: Date;
  field: string
}

const TablaColumsEspecial: ColumTable<ITablaMinutaEspecial>[] = [
  {
    key: "title",
    label: "Minuta"
  },
  {
    key: "report_date",
    label: "Fecha de registro",
    render: renderTableDate
  },
  {
    key: "field",
    label: "..."
  },

]

const Generador: FunctionComponent<GeneradorProps> = ({
  field,
  mode,
  search,
  tipo,
  forPrint,
}) => {

  let TTable = TableComponent;

  if (forPrint) {
    TTable = StaticReportTable;
  }

  // consulta informacion sobre el campo, las minutas y los puntos
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
  );

  let fieldTitle = req?.data?.campo?.caption;
  let fieldType = req?.data?.campo?.type;


  useEffect(() => {

    if (!field) return undefined
    if (!mode) return undefined
    if (!tipo) return undefined
    if (search.modo === "") return undefined

    req.reload()
  }, [field, mode, search, tipo])


  const {
    grupos, select, preGrupos
  } = useMemo(() => {

    let g = generateGroup(search)
    const _grupos = {
      ...g,
      ...Object.groupBy(req.data?.minutes || [], (value, i) => nameForGroupFromSearch(value, search.modo, "report_date").value)
    }
    // console.log("g", g)
    // console.log("grupos", _grupos)


    let gen = sortDataList(Object.entries(_grupos), search.modo)


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
      },
      preGrupos: _grupos,
    }
  }, [req.data?.minutes]);

  const { numGrupos } = useMemo(() => {
    type gg = typeof preGrupos;
    if (req.data?.campo?.type !== "number") {
      return {}
    };

    if (mode === "default") {
      return {}
    };

    if (!field) {
      return {}
    };

    let _numGrupos: Record<string, calculosNumericos> = {};


    Object.entries(preGrupos).map(x => {
      let [key, value] = x as [string, IMinuteEstadistica[]];

      let sumatoria = 0;

      value.forEach(x => {
        // console.log(x.fields, field, Number(x.fields[field]))
        let v = Number(x.fields[field])

        if (typeof v !== "number" || isNaN(v)) {
          v = 0
        };

        sumatoria = v + sumatoria;
      });

      let promedio = sumatoria === 0 ? 0 : sumatoria / value.length;


      _numGrupos[key] = {
        key,
        promedio,
        sumatoria
      }

    })


    return {
      numGrupos: sortDataList(Object.entries(_numGrupos), search.modo).map(x => ({
        ...x[1]
      })) as calculosNumericos[]
    }
  }, [preGrupos, mode])

  // console.log(numGrupos)



  // Tablas

  const { TablaMinutas, TablaEspecialMinuta } = useMemo(() => {
    const minutes = req?.data?.minutes
    const origins = req.data?.origins;
    const KeyOrigins: Record<string, string> = {};

    origins?.forEach(x => {
      KeyOrigins[x.value] = x.title;
    });


    return {
      TablaMinutas: minutes?.map(x => ({
        marker: x.title_marker,
        report_date: new Date(x.report_date),
        title: x.title as string
      }) as TablaGeneral),
      TablaEspecialMinuta: minutes?.map((x) => {
        let out_field = ""
        
        if (fieldType === "number") {
          const campo = Number(x.fields[field]);
          out_field = String(campo);
          if (isNaN(campo)) {
            out_field = "0"
          }
        }

        if (fieldType === "select") {
          const campo = String(x.fields[field]);
          out_field = KeyOrigins[campo] || "No Definido"
        }

        return {
          title: x.title,
          report_date: new Date(x.report_date),
          field: out_field,
        }
      }) as ITablaMinutaEspecial[]

    }
  }, [req.data?.minutes])



  function TablasGenerales() {


    return (
      <>

        <TopCard title="Actividad cronológica" variant="light" />
        {
          grupos &&
          <TableComponent
            columns={generalTablaGrupos}
            data={grupos}
          />
        }

        <Separator />
        <TopCard title="Tabla de las minutas operadas" variant="light" />
        {
          TablaMinutas &&
          <TableComponent
            columns={generalColumns}
            data={TablaMinutas}
          />
        }
      </>
    )
  }

  function TablasEspeciales({ fp }: { fp?: boolean }) {

    refineColumn(TablaColumsEspecial, "field", {
      label: fieldTitle
    })

    return (
      <>


        {
          req.data?.campo?.type === "select" &&
          <>
            <TopCard title={"Distribución de la selección en " + fieldTitle} variant="light" />
            <TableComponent
              columns={TablaDistribucionColumnas}
              data={select.distribucion.data}
            />
            <Separator />
          </>
        }

        {
          req.data?.campo?.type === "number" && numGrupos &&
          <>
            <TopCard title={"Sumatorias y promedios de " + fieldTitle} variant="light" />
            <TableComponent
              columns={TablaCalculoNumericoColums}
              data={numGrupos}
            />
            <Separator />
          </>
        }

        <TopCard title={"Tabla recopilatoria de minutas con el campo de " + fieldTitle} variant="light" />
        {
          TablaEspecialMinuta &&
          <TableComponent
            columns={TablaColumsEspecial}
            data={TablaEspecialMinuta}
          />
        }

      </>
    )
  }



  if (!field) return ""
  if (!mode) return ""
  if (!tipo) return ""
  if (search.modo === "") return ""


  return (
    <div className="w-full flex flex-col gap-4">

      {/* Kpis Estadisticas general (Actividad de minutas) */}
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

      {/* Kpis Estadisticas por tipo de campo (Operaciones especiales) */}
      <div className="w-full">
        {
          // Selected
          req.data?.campo?.type === "select" &&
          <ChartPieKpi
            config={select.distribucion.config}
            data={select.distribucion.data}
            datakey="cantidad"
            title={"Ranking de elementos mas seleccionados de " + fieldTitle}
            icon={PieChart}
            keyLabel="label"
          />
        }

        {
          // Numérico
          // promedio: promedios 
          // suma: sumatorias
          req.data?.campo?.type === "number" && mode !== "default" &&
          <>
            {
              toWith([], () => {

                function Promedio() {
                  return <ChartAreaKpi
                    title={"Promedio de " + fieldTitle}
                    data={numGrupos as calculosNumericos[]}
                    indexKey="key"
                    config={configNumberEstadisticaActividadPromedio}
                    categories={["promedio"]}
                    icon={BarChart2}

                  />
                }

                function Sumatoria() {

                  return <ChartAreaKpi
                    title={"Sumatoria de " + fieldTitle}
                    data={numGrupos as calculosNumericos[]}
                    indexKey="key"
                    config={configNumberEstadisticaActividadSumatoria}
                    categories={["sumatoria"]}
                    icon={Sigma}

                  />
                }

                function Ambos() {

                  return <ChartAreaKpi
                    title={"Sumatoria y promedio de " + fieldTitle}
                    data={numGrupos as calculosNumericos[]}
                    indexKey="key"
                    config={configNumberEstadisticaActividadSumatoriaYPromedio}
                    categories={["sumatoria", "promedio"]}
                    icon={Divide}

                  />
                }

                switch (mode) {
                  case "promedio":

                    return (
                      <Promedio />
                    )

                  case "suma":

                    return (
                      <Sumatoria />
                    )

                  case "ambos":

                    return (
                      <Ambos />
                    )
                  case "ambos2":

                    return (
                      <div className="grid grid-cols-2 *:col-span-1 ">
                        <Sumatoria />
                        <Promedio />
                      </div>
                    )

                  default:
                    break;
                }

              })
            }
          </>
        }
      </div>

      {/* Tablas  */}
      <div>
        <TopCard title="Tablas y resúmenes" variant="light" />

        {
          !forPrint &&
          <>
            <Tabs defaultValue="general">
              <TabsList className="w-full">
                <TabsTrigger value="general">
                  Actividad de registros de minutas
                </TabsTrigger>
                <TabsTrigger value="especial">
                  Resumen de Datos de los campos
                </TabsTrigger>
              </TabsList>
              <Card>
                <CardContent>



                  <TabsContent value="general" className="flex flex-col gap-4">

                    <TablasGenerales />
                  </TabsContent>
                  <TabsContent value="especial" className="flex flex-col gap-4">
                    <TablasEspeciales />
                  </TabsContent>

                </CardContent>
              </Card>
            </Tabs>
          </>
        }
      </div>
    </div>
  );
}

export default Generador;