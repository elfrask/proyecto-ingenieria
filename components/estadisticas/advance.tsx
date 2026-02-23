import { FunctionComponent, useMemo } from "react";
import { Button } from "../ui/button";
import { useSearch } from "@/hooks/estadisticas/use-search";
import RenderSearchDate from "../commons/render-search-date";
import { Printer, Search } from "lucide-react";
import FormComponent, { useFormContextComponent } from "../commons/form/providers/FormProvider";
import z, { number } from "zod";
import { FormSelect } from "../commons/form/fields/_RedirectComponents";
import { useServerQuery } from "@/hooks/get-async";
import { getAllMinuteTypes } from "@/lib/minute-actions";
import { Items, SelectKeysForItems, toItems } from "@/types/form.types";
import useUpdate from "@/hooks/useUpdate";
import { ICustomField, ICustomFieldPre } from "@/lib/db-types";
import Generador from "./generador-advance";
import { openAndPrint } from "@/lib/reportes";
import { searchConvertToParams } from "@/lib/search.lib";

const DefSearch = {
  tipo: "",
  field: "",
  mode: "default",
}

type InterfazSearch = typeof DefSearch

interface EstadisticasAvanzadosProps {

}

const EstadisticasAvanzados: FunctionComponent<EstadisticasAvanzadosProps> = () => {

  const { methods } = useFormContextComponent();

  const searchConfigs = methods.getValues() as InterfazSearch;
  const update = useUpdate();

  const {
    SearchNode, call, search
  } = useSearch({
    onSearch(data) {

    },
  });

  const MinuteTypes = useServerQuery(
    (ctx) => getAllMinuteTypes({}),
    {
      onError(err, msg, error) {

      }
    }
  );

  const { MinuteTypesItems } = useMemo(() => {


    return {
      MinuteTypesItems: toItems(MinuteTypes.data || [], { value: "typeName", label: "caption" })
      // MinuteSelected: 
    }

  }, [MinuteTypes.data]);

  const { MinuteTypeSelected, fieldsItems } = useMemo(() => {

    const MinuteTypeSelected = MinuteTypes.data?.find(x => (x.typeName) === searchConfigs.tipo)

    const fields = (MinuteTypeSelected?.fields || []) as ICustomFieldPre[];

    const admitidos: ICustomField["type"][] = ["number", "select"];

    return {
      MinuteTypeSelected,
      fieldsItems: toItems(fields.filter(x => admitidos.includes(x.type)), { value: "name", label: (v) => `${v.caption} (${v.type})` })

    }
  }, [searchConfigs.tipo])

  const { FieldSelected, ModosItems } = useMemo(() => {

    const FieldSelected = MinuteTypeSelected?.fields.find(x => x.name === searchConfigs.field);
    let ModosItems: Items[] = [
      {value: "default", label: "Por defecto"},
    ];

    methods.setValue("mode", "default")

    if (FieldSelected?.type === "number") {
      ModosItems = [
        ...ModosItems,
        {value: "promedio", label: "Promedio"},
        {value: "suma", label: "Sumatoria"},
        {value: "ambos", label: "Ambos"},
        {value: "ambos2", label: "Ambos (Separados)"},
        // {value: "promedio", label: "Promedio"},
      ]
    }

    return {
      FieldSelected,
      ModosItems
    }
  }, [searchConfigs.field])

  // console.log(MinuteTypesItems)

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex flex-row justify-between gap-4">
        <Button variant={"outline"} onClick={x => call()}>
          <Search />
          <RenderSearchDate data={search} placeholder="Seleccionar Periodo" />
        </Button>

        <Button
          disabled={
            [
              FieldSelected?.name,
              MinuteTypeSelected?.typeName,
              search.modo,
              searchConfigs.mode
            ].some(x => !x)
          }
          onClick={x => openAndPrint(`/reportes/advance?${searchConvertToParams(search)}&${new URLSearchParams({
            modeProcess: searchConfigs.mode,
            tipo: MinuteTypeSelected?.typeName as string,
            field: FieldSelected?.name as string
          }).toString()}`)}
        >
          <Printer />
          Imprimir reporte con estas configuraciones
        </Button>
      </div>


      <div className="grid grid-cols-3 gap-4">
        <FormSelect
          name="tipo"
          label="Tipo de minuta a graficar"
          options={MinuteTypesItems}
          onValueChange={x => {
            methods.setValue("mode", "default")
            methods.setValue("field", "")
      
            update()
          }}
        />

        {
          MinuteTypeSelected &&
          <FormSelect
            name="field"
            label="Campo a operar"
            options={fieldsItems}
            onValueChange={update}
          />

        
        }

        {
          FieldSelected &&
          <FormSelect
            name="mode"
            label="Modo de operación"
            options={ModosItems}
            onValueChange={update}
          />
        }

      </div>

      <Generador 
        field={FieldSelected?.name as string}
        tipo={MinuteTypeSelected?.typeName as string}
        search={search}
        mode={searchConfigs.mode}
      />

      {SearchNode}
    </div>
  );
}


export default function () {


  return (
    <FormComponent formLess schema={z.any() as any} defaultValues={DefSearch}>
      <EstadisticasAvanzados />
    </FormComponent>
  )
};