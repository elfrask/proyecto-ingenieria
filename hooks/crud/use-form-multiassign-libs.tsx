import { FormMultiSelect, FormSelect } from "@/components/commons/form/fields/_RedirectComponents";
import FormComponent, { useFormContextComponent } from "@/components/commons/form/providers/FormProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Items } from "@/types/form.types";
import { FunctionComponent, ReactNode, useEffect } from "react";
import z from "zod";
import { DataInstances } from "./use-form-multiassign";
import DeleteCommand from "@/components/commons/table/commands/delete-button";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useInstanceID } from "../table/use-instance";


interface MultiInstancesControlProps {
  intancesItems: Items[];
  setInstance: (ins: string) => void;
  instance: string;
  multiData: DataInstances<any>,
  setMultiData: (d: DataInstances<any>) => void,
  voidDefault: any
}

export const MultiInstancesControl: FunctionComponent<MultiInstancesControlProps> = (props) => {
  // const {  } = props;
  return (
    <FormComponent schema={z.any()} formLess defaultValues={{ instanceSelect: "$all", selects: [] }}>
      <MulIns
        {...props}
      />
    </FormComponent>
  )
}


const MulIns: FunctionComponent<MultiInstancesControlProps> = ({
  instance, intancesItems, setInstance, multiData, setMultiData, voidDefault
}) => {

  // const [tab, setTab] = useStat
  const {methods} = useFormContextComponent()
  useEffect(() => {
    const l = multiData[instance]?.ids || []
    // console.log("instancia cargada:", multiData[instance])
    methods.setValue("selects", l);
    setMultiData({...multiData})
  }, [instance])

  return (
    <Tabs defaultValue="capas">
      <TabsList className="w-full">
        <TabsTrigger value="capas" children="Capas" />
        <TabsTrigger value="sel" children="Selección" />
      </TabsList>
      <TabsContent value="capas" className="flex flex-col gap-2">

        <Tabs defaultValue="$all" value={instance} onValueChange={x => {


          
          setInstance(x);

        }}>
          <TabsList className="grid grid-cols-1 h-auto w-full *:h-8">
            <TabsTrigger value="$all" children="Capa de asignación general" />

            {
              Object.entries(multiData).map((x, y) => {

                if (x[0] === "$all") {
                  return []
                };

                return(
                  <TabsTrigger value={x[0]} key={y} className="*:w-full">
                    <span>
                      Capa de asignación {y}
                    </span>
                    <div className="flex flex-row gap-2 float-right w-0 max-w-0 justify-end">
                      {
                        instance === x[0] &&
                        <DeleteCommand 
                          // className=""
                          titleDelete="¿Estas seguro de eliminar esta capa de asignación?"
                          onClick={t => {
                            delete multiData[x[0]];
                            setMultiData({...multiData})
                            setInstance("$all")
                          }}
                        />
                      }
                    </div>

                  </TabsTrigger>
                )
              })
            }

          </TabsList>
        </Tabs>

        <Button className="w-full" variant={"outline"} onClick={x => {

          const nameInstance = crypto.randomUUID();

          setMultiData({
            ...multiData,
            [nameInstance]: {
              data: voidDefault,
              // data: {...multiData["$all"].data},
              ids: []
            }
          })
        }}>
          <PlusCircle />
          Agregar Capa de asignación
        </Button>
      </TabsContent>
      <TabsContent value="sel">

        {
          instance !== "$all"?
          <FormMultiSelect
            label="Seleccionar"
            name="selects"
            options={intancesItems.slice(1)}
            className="w-full"
            onValueChange={(x: string[]) => {
              multiData[instance].ids = x
            }}
          />
          :
          <span>
            Ya se están aplicando a Todos
          </span>
        }
      </TabsContent>
    </Tabs>
  );
}

export default MulIns;


export interface IntanceControlProps<T> {
  instanceCode:  string;
  children: ReactNode;
  dataInstances: DataInstances<T>;
  multiple: boolean;
  Default: T
}
 
export const IntanceControl: FunctionComponent<IntanceControlProps<any>> = ({
  children, instanceCode, dataInstances, Default, multiple
}) => {
  const fieldInstance = useInstanceID();

  const {methods} = useFormContextComponent();
  useEffect(() => {
    if (multiple) {
      const value = dataInstances[instanceCode]?.data || null
      const load = value
      // console.log("Cargar:", load)
      methods.setValue("", load)
      methods.reset(load, {
        keepDirty: false,
        keepDefaultValues: false,
        keepErrors: false,
      })
      // console.log("formulario Cargado:", methods.getValues())
      fieldInstance.newInstance()
      
      return () => {
        const value = methods.getValues();
        // console.log("formulario Descargado:", methods.getValues())
        if (dataInstances[instanceCode]) {
          dataInstances[instanceCode].data = value
        }
      }
    }
  }, [])
  
  return (
    <div className="w-full" key={fieldInstance.instanceID}>
      {children}
    </div>
  );
}

export type CB<T, U> = (cb: T) => PassData<U>;

export interface PassData<T> {
  single: CB<(data: T) => void, T>;
  multiple: CB<(data: T[]) => void, T>;
  both: CB<(data: T|T[]) => void, T>;
  isMultiple: boolean;
}

export function passDataSubmit<T>(data: T|T[]): PassData<T> {
  
  const me: PassData<T> = {
    single(cb) {
      if (!Array.isArray(data)) {
        cb(data)
      }
      return me
    },
    both(cb) {
      cb(data)
      return me
    },
    multiple(cb) {
      if (Array.isArray(data)) {
        cb(data)
      }
      return me
    },
    isMultiple: Array.isArray(data),
  }

  return me

}