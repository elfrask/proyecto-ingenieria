import { useStateObject, UseStateObjectReturn } from "../useStateObject"
import SimpleDialog from "@/components/commons/fast-dialog"
import { useOpenState } from "../states/openState"
import { Items } from "@/types/form.types";
import FormComponent, { useFormContextComponent } from "@/components/commons/form/providers/FormProvider";
import z from "zod";
import { optional, requires, useSuperRefineTools } from "@/types/schemas";
import { FormDatePicker, FormSelect, FormInputNumber } from "@/components/commons/form/fields/_RedirectComponents";
import useUpdate from "../useUpdate";
import { makeNameHelper } from "@/lib/makeNameHelper";
import { Clock, Search } from "lucide-react";
import { useInstanceID } from "../table/use-instance";
import { useEffect } from "react";
import { openState } from "@/types/components/states";
import { Card, CardContent } from "@/components/ui/card";

export interface SearchObject {

}




const _Mode = [
  { value: "todo", label: "Todo" },
  { value: "mes", label: "Mes y Año" },
  { value: "año", label: "Año" },
  { value: "fecha", label: "Fecha especifica" },
  { value: "periodo", label: "Periodo" },
] as const satisfies Items[];

const _Meses = [
  { value: "0", label: "Enero" },
  { value: "1", label: "Febrero" },
  { value: "2", label: "Marzo" },
  { value: "3", label: "Abril" },
  { value: "4", label: "Mayo" },
  { value: "5", label: "Junio" },
  { value: "6", label: "Julio" },
  { value: "7", label: "Agosto" },
  { value: "8", label: "Septiembre" },
  { value: "9", label: "Octubre" },
  { value: "10", label: "Noviembre" },
  { value: "11", label: "Diciembre" },
] as const satisfies Items[];


const PreSchema = z.object({
  modo: requires.enum(_Mode),

  // fecha
  fecha: optional.date(),

  // periodo
  inicio: optional.date(),
  final: optional.date(),

  // año y mes

  año: optional.number(),
  mes: optional.enum(_Meses),


})

const Schema = PreSchema.superRefine((values, ctx) => {
  const { revalidate } = useSuperRefineTools(PreSchema, values, ctx);
  const { modo } = values;

  if (modo === "fecha") {
    revalidate(helper.fecha.$(), requires.date());
  };
  if (modo === "mes") {
    revalidate(helper.mes.$(), requires.enum(_Meses));
    revalidate(helper.año.$(), requires.number());
  };
  if (modo === "periodo") {
    revalidate(helper.inicio.$(), requires.date());
    revalidate(helper.final.$(), requires.date());
  };
  if (modo === "año") {
    revalidate(helper.año.$(), requires.number());
  };

})


type InterfazSearch = z.infer<typeof Schema>;
const helper = makeNameHelper(Schema);
export type dataResultSearch = {
  modo: InterfazSearch["modo"],
  init: Date, 
  end: Date
};
type handlerOnSearch = (data: dataResultSearch) => void;

interface options {
  onSearch?: handlerOnSearch

};

interface ctxOpen {
  onSearch?: handlerOnSearch
}

export function useSearch({
  ...p
}: options) {
  const { onSearch } = p
  const instance = useInstanceID();
  const search = useStateObject<dataResultSearch>({
    modo: ""
  } as dataResultSearch)

  


  const open = useOpenState<ctxOpen>(false, {
    onChange(v) {
      if (!v) {
        open.clearCtx()
      }
    },
  });
  useEffect(() => {
    if (open.state) {
      instance.newInstance()
    }
  }, [open.state])

  return {
    open,
    call: (cb?: handlerOnSearch) => {
      open.open({
        onSearch: cb
      })
      
    },
    search: search.state,
    SearchNode: (
      <FormComponent debug key={instance.instanceID} schema={Schema} defaultValues={{
        modo: "todo"
      }}>
        <FormSearch open={open} search={search} onSearch={open?.ctx?.onSearch ?? onSearch} />
      </FormComponent>
    )
  }
}

interface FormSearchProps extends options {
  open: openState<ctxOpen>;
  search: UseStateObjectReturn<SearchObject>;

}

function FormSearch({
  onSearch: _oS, open, search
}: FormSearchProps) {
  const { methods } = useFormContextComponent()
  const data = methods.getValues() as InterfazSearch;
  const update = useUpdate();
  const modo = data.modo

  const onSearch: handlerOnSearch = (data) => {
    search.set(data)
    _oS?.(data)
  }

  return (
    <SimpleDialog
      open={open}
      title="Buscar por fecha y periodos de tiempos"
      description="Utiliza esto para buscar y filtrar por periodos de fechas"
      separator
      icon={Search}
      okTitle="Buscar"
      onCancel={x => open.close()}
      onOk={x => {
        
        const data = methods.getValues() as InterfazSearch;
        console.log("llego", data)
        methods.handleSubmit((data: InterfazSearch, e) => {
          
          const modo = data.modo;
          if (modo === "todo") {
            onSearch?.({
              modo,
            } as dataResultSearch)
          };
          
          if (modo === "año") {
            onSearch?.({
              modo,
              init: new Date(data.año as number, 0, 1),
              end: new Date((data.año as number) + 1, 0, 1)
            })
          };
  
          if (modo === "mes") {
            const mes = parseInt(data.mes)
            onSearch?.({
              modo,
              init: new Date(data.año as number, mes, 1),
              end: new Date((data.año as number), mes + 1, 1)
            })
          };
          
          if (modo === "fecha") {
            const fecha = data.fecha as Date
            onSearch?.({
              modo,
              init: fecha,
              end: new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() + 1)
            })
          };
          
          if (modo === "periodo") {
            const {inicio, final} = data 
            onSearch?.({
              modo,
              init: inicio as Date,
              end: final as Date
            })
          };
          
          open.close()
        }, () => {

        })()
        // methods.clearErrors();

        

      }}
    >
      <Card>
        <CardContent>
          <div className="w-full grid grid-cols-2 gap-4">
            <FormSelect
              name={helper.modo.$()}
              options={_Mode}
              label="Modo de búsqueda"
              onValueChange={update}
              className="col-span-2"
            />

            {
              modo === "periodo" &&
              <>
                <FormDatePicker
                  name={helper.inicio.$()}
                  label="Fecha de inicio"
                />
                <FormDatePicker
                  name={helper.inicio.$()}
                  label="Fecha de finalización"
                />
              </>
            }

            {
              modo === "fecha" &&
              <FormDatePicker
                name={helper.fecha.$()}
                label="Fecha"
              />
            }


            {
              modo === "mes" &&
              <FormSelect
                name={helper.mes.$()}
                options={_Meses}
                label="Mes"
                onValueChange={update}
              />
            }
            {
              ((modo === "año") || (modo === "mes")) &&
              <FormInputNumber
                name={helper.año.$()}
                label="Año"
              />
            }



          </div>
        </CardContent>
      </Card>
    </SimpleDialog>
  )
}