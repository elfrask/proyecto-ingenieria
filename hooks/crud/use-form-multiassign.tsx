import { Items, KeyItemTake, parseItemKey, SelectKeysForItems, toItems } from "@/types/form.types";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useSheetForm } from "./use-sheet-form";
import z from "zod";
import { AlertTriangle } from "lucide-react";
import { useListReturn } from "../table/use-list";
import { RecordType } from "zod/v3";
import { Card } from "@/components/ui/card";
import { IntanceControl, MultiInstancesControl, PassData, passDataSubmit } from "./use-form-multiassign-libs";
import { useInstanceID } from "../table/use-instance";
import { toast } from "sonner";
import { createVoidDefault } from "@/types/schemas";



export interface UseFormMultiAssignProps<U extends z.ZodObject, T = z.infer<U>> {
  // selectList: number[];
  // list: T[];
  selectMultipleItems: SelectKeysForItems<NoInfer<T>>;
  // Form: FunctionComponent<{codigo?: string}>;

  singleTitle?: string;
  /**
   * @description 'multiTitle' se usa con un formato especial donde '{n}' se remplaza por el numero de selección
   */
  multiTitle?: string;
  captureList: useListReturn<any>;
  Default: NoInfer<T>;
  title: string;
  schema: U;
  submit: (data: PassData<T>, handlerPush: () => void, multiData: DataInstances<T>) => void

};

export interface FMCallBack<T> {
  list: T[];
  selectList: number[];
  multiple: boolean;
  isEdit: boolean;
}

export type DataInstances<T> = RecordType<string, {
  data: Partial<T>,
  ids: string[]
}>
// type DataInstances<T> = RecordType<string, T>


export function useFormMultiAssign<U extends z.ZodObject, T = z.infer<U>>({

  selectMultipleItems,
  captureList,
  // Form,
  multiTitle,
  singleTitle,
  Default,
  schema,
  submit,
  title,
}: UseFormMultiAssignProps<U, T>) {


  // Parametros tomados de las capturas y controladores externos
  const VoidDefault = useMemo(() => createVoidDefault({...Default} as any, null), [schema])
  const { selected, list, tableController, instanceID, newInstance } = captureList;
  const subInstance = useInstanceID()
  const selectsControls = tableController.selects;
  const selectList = selectsControls.selectList;

  // Lógica y constantes
  const multiple = selectList.length > 1;


  // Configuración

  const { formNode, open } = useSheetForm<U, T>({
    titleForm: multiple ? (
      <span className="text-orange-800 flex flex-row gap-2">
        <AlertTriangle className="size-4" />
        {multiTitle ? multiTitle.replace("{n}", (selectList.length.toString())) : title}
      </span>
    ) : (singleTitle || title),
    instanceID: instanceID + subInstance.instanceID,
    globalDefault: null,
    schema,
    Default: Default as T,
    debug: true,
    ignoreValid: multiple,
    submit(data) {
      console.log(capaCurrent, multiData)

      multiData[capaCurrent].data = data;

      function handlerPush() {
        if (multiple) {
          const sel: T[] = selectsControls.getSelected() as T[]
          const multi = { ...multiData };
          delete multi["$all"];
          const $all = multiData["$all"]?.data || {}
          const instances = Object.entries(multiData).map(x => x[1])
          // console.log($all)
          const transform = sel.map((x: T) => {
            let out: Partial<T> = { ...$all };
            let id = parseItemKey(x, selectMultipleItems.value);

            for (let i of instances) {

              if (i.ids.includes(id)) {
                out = { ...out, ...i.data }
              }

            }
            console.log({ antes: x, despues: out })

            Object.keys(out).forEach((j: string) => {
              const tt: any = out
              if ((tt[j] === undefined) || tt[j] === null) {
                delete tt[j]
              }
            })

            return { ...x, ...out }
          });
          const _list = [...list]

          selectList.forEach((x, y) => {
            _list[x] = transform[y]
          })

          // console.log(_list)

          captureList.set(_list)

          return // en espera
        };

        captureList.push(data)
      }

      if (multiple) {
        const lista = Object.entries(multiData).map(x => ({ value: x[1], key: x[0] }))
        let idxFound = -1;

        lista.slice(1).find((x, y) => {
          const isVoid = x.value.ids.length === 0;
          if (isVoid && (idxFound === -1)) {
            idxFound = y
          }
          return
        }) // $all siempre sera el primero


        if (idxFound !== -1) {
          return toast.error(`Debes de asignar la selección a la Capa de Asignación ${idxFound + 1}`)
        }

        return submit(passDataSubmit(lista.map(x => x.value.data as T)), handlerPush, multiData)
      };

      return submit(passDataSubmit(data), handlerPush, multiData)
    },
  });
  const [multiData, setMultiData] = useState<DataInstances<T>>({});
  const [capaCurrent, _setCapaCurrent] = useState("$all");

  function setCapaCurrent(v: string) {

    _setCapaCurrent(v)
  }


  const CapasItems: Items[] = useMemo(() => {
    if (open.state) {

      const pList = selectsControls.getSelected()

      return [
        { value: "$all", label: "Todo" },
        ...toItems(pList, selectMultipleItems)
      ]
    };
    // newInstance()

    return [
      { value: "$all", label: "Todo" },
    ]
  }, [open.state])



  useEffect(() => {
    setMultiData({
      $all: {
        ids: [],
        data: {} as any
      }
    })
    setCapaCurrent("$all");
    subInstance.newInstance();
    // fieldInstance.newInstance();
  }, [instanceID])


  function singleSelect(i: number) {
    selectsControls.removeAll();
    captureList.select(i)
  };

  function multiSelect(sel?: number[]) {
    const s = sel || selectList;

    if (s.length === 1) {
      return captureList.select(s[0])
    };

    captureList.unSelect()
    newInstance()
  }


  return ({
    list,
    selectList,
    open,
    singleSelect,
    multiSelect,
    useList: captureList,
    renderNode: (cb: (ctx: FMCallBack<T>) => ReactNode) => {

      const params = {
        isEdit: Boolean(selected || selectList.length > 0),
        list,
        multiple: selectList.length > 1,
        selectList,
      }

      if (!multiple) {
        return formNode(captureList.selected || Default, () => cb(params))
      }

      return formNode(VoidDefault as T, () => (
        <div className="w-full flex flex-col gap-4">
          <div>
            <Card className="p-4 gap-2">
              <MultiInstancesControl
                voidDefault={VoidDefault}
                intancesItems={CapasItems}
                setInstance={setCapaCurrent}
                instance={capaCurrent}
                multiData={multiData}
                setMultiData={setMultiData}
              />
            </Card>
          </div>

          <IntanceControl
            Default={VoidDefault}
            key={capaCurrent}
            instanceCode={capaCurrent}
            dataInstances={multiData}
            multiple={multiple}
          >
            {
              cb(params)
            }
          </IntanceControl>
        </div>
      ))
    },

  })
}



