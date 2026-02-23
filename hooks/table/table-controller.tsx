import { useFormContextComponent } from "@/components/commons/form/providers/FormProvider"
import { getFromName } from "@/lib/utils"
import { useEffect, useState } from "react"
import { FieldError, FieldValues, useFieldArray } from "react-hook-form"
import { toast } from "sonner"

export type Modes = "removeOnEdit" | "keepOnEdit"

export interface useTableController<T=any> {
  arrayPath: string,
  formPath: string,
  fieldNames: (Extract<keyof T, string> | "$all")[],
  // fieldNames: (Extract<BuilderKeys<T>, string> | "$all")[],
  defaultData: T;
  debug?: boolean;
  keepOnEdit?: boolean;
  onOpenChange?: (state: boolean) => void;
  validateList?: boolean;
}

export function useTableController<Interface extends FieldValues, fields = keyof {}>({
  arrayPath, formPath, fieldNames, defaultData, debug, keepOnEdit, onOpenChange, validateList
}: useTableController<Interface>) {
  const _deff = {...defaultData}

  type listValidate = (Extract<keyof Interface, string> | "$all")
  type callBackHandler = ((data: Interface, ) => void)

  const { methods, _values } = useFormContextComponent()
  const [currentId, _setCurrentId] = useState((_values[arrayPath] ?? -1) as number) ;
  const [isFormMode, _setFormMode] = useState(false);
  // console.log(currentId, _values[arrayPath], arrayPath)
  function setCurrentId(v: number) {
    _values[arrayPath] = v
    _setCurrentId(v)
  }
  
  const tempPath = formPath;


  function handlerOpen(s: boolean) {
    if (onOpenChange) {
      onOpenChange(s);
    }
  }


  const { fields, append, remove, ...fi } = useFieldArray({
    control: methods.control,
    name: arrayPath,
  })

  const temporal = methods.watch(tempPath) as Interface | undefined
  const data = methods.getValues(arrayPath)


  useEffect(() => {
    const temp = methods.getValues(tempPath)
    // console.log(temp)
    if (!temp) {
      resetFields()
    }
  }, [])


  const handleAdd = async (
    event?: any, 
    listValidates?: listValidate[],
    mutate?: callBackHandler, 
    success?: callBackHandler
  ) => {
    const isValid = await trigger(listValidates || fieldNames)
    
    if (!isValid) {
      if (debug) console.error("Depuración de campos:", tempPath, isValid, methods.formState.errors)
      return
    }

    const value: Interface = methods.getValues(tempPath) || ({} as Interface)

    if (mutate) {
      mutate(value)
    }

    if (!keepOnEdit || currentId === -1) {
      append(value)
      
    } else {
      fi.update(currentId, value)

    }


    resetFields()
    methods.clearErrors(Object.keys((methods.getValues(tempPath) || {})).map(k => `${tempPath}.${k}`))
    setCurrentId(-1)
    methods.clearErrors()
    handlerOpen(false)
    if (success) {
      success(value)
    }
    
  }

  async function trigger(string: (Extract<keyof Interface, string> | "$all")[]) {
    
    let requiredFields = string.map((f) => `${tempPath}.${f}`)

    if (string.includes("$all")) {
      requiredFields = [tempPath];
    }

    const isValid = await methods.trigger(requiredFields)

    return isValid
  }

  // Editar banco existente
  const handleEdit = (index: number, mutate?: callBackHandler) => {
    const row = methods.getValues(`${arrayPath}.${index}`) as Interface

    if (!keepOnEdit) {
      if (currentId !== -1) {
        toast("Debe guardar los cambios actuales", {
          richColors: true,
          style: {
            color: "crimson"
          }
        })
        return
      }
    } 

    if (mutate) {
      mutate(row)
    }

    methods.setValue(tempPath, row)
    if (!keepOnEdit) {
      remove(index)
    }
    setCurrentId(index)
    methods.clearErrors(Object.keys((methods.getValues(tempPath) || {})).map(k => `${tempPath}.${k}`))
    handlerOpen(true)

    // methods.clearErrors()
  }

  function resetFields(data?: Interface) {

    methods.resetField(tempPath, {
      defaultValue: data || defaultData,
    })
  }

  function getErrors() {
    // methods.formState.errors
    return getFromName<FieldError>(methods.formState.errors, formPath)
  }

  return {
    resetFields,
    handleEdit,
    handleAdd,
    methods,
    errors: getErrors(),
    getErrors,
    remove,
    data: data as unknown as Interface[],
    /**
     * @deprecated Fields ha sido deprecado, usa "data" en su lugar
     */
    fields: fields as unknown as Interface[],
    append,
    temporal,
    trigger,
    currentId,
    setCurrentId,

    ...fi,
  }
}