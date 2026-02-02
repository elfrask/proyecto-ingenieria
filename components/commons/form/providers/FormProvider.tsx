import { Button } from "@/components/ui/button"
import { usePreserve } from "@/hooks/usePreserve"
import { zodResolver } from "@hookform/resolvers/zod"
import { createContext, ReactNode, useContext, useState } from "react"
import { FormProvider, useForm, UseFormReturn, Resolver } from "react-hook-form"
import z, { ZodObject, ZodType } from "zod"

export type BindFunction = (name: string, methods: UseFormReturn) => void

export type FormContextValue<T=any> = {
  methods: UseFormReturn<any>,
  /**
   * @description _values es un parámetro de uso para caches y contener estados temporales que no se mantendrán dentro del esquema
   * 
   */
  _values: Record<string, any>, // almacén de propiedades cache no propios del formulario
  context: T;
  bind: BindFunction;
  unBind: BindFunction;
  submitWithBindings: (cb?: (data: T) => void) => any;
  globalInitialDefaults?: any;
  disableInitialDefaults?: boolean
}

const FormContext = createContext<FormContextValue | null>(null)

export function useFormContextComponent<Context=any>() {
  const ctx = useContext(FormContext)
  if (!ctx) throw new Error("useFormContext debe usarse dentro de <FormComponent>")
  return ctx as FormContextValue<Context>
}

type FormComponentProps<T extends ZodType<any, any>> = {
  children: ReactNode
  schema: T
  onSubmit?: (data: z.infer<T>) => void
  defaultValues?: Partial<z.infer<T>>
  mode?: "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all", 
  shouldUnregister?: boolean;
  formLess?: boolean
  disableInitialDefaults?: boolean;
  globalInitialDefaults?: any;
  debug?: boolean;
  context?: any;
}


export default function FormComponent<T extends z.ZodObject<any, any>>({ 
  children,
  schema,
  onSubmit,
  defaultValues,
  mode = "all",
  shouldUnregister = false,
  formLess,
  disableInitialDefaults,
  globalInitialDefaults,
  context,
  debug
  }: FormComponentProps<T> ) {

  const methods = useForm<z.infer<T>>({
    resolver: zodResolver(schema) as Resolver<z.infer<T>, any>,
    defaultValues: defaultValues as any,
    mode,
    shouldUnregister,
  });

  

  const [_values, _] = useState({})
  const [bindList, setBindList] = useState<Record<string, UseFormReturn>>({})
  const __ = usePreserve<{t: Record<string, UseFormReturn>}>({t: {}});
  __.t = bindList

  const handleFormSubmit = onSubmit ? methods.handleSubmit(onSubmit) : methods.handleSubmit(() => {})
  const Comp = formLess ?"div": "form"

  const bind: BindFunction = (n, m) => {
    setBindList({
      ...bindList,
      [n]: m
    })
  }
  
  const unBind: BindFunction = (n, m) => {
    if (m === bindList[n]) {
      delete bindList[n]
    }
  }
  

  function submitWithBindings(cb?: ((data: T) => void)) {
    
    return async () => {
      // let success = true;

      const list = Object.entries(__.t).map(x => x[1]);

      for (let i = 0; i < list.length; i++) {
        const element = list[i];
        const isValid = await element.trigger();
        if (!isValid) {
          console.log("fallo:", element.formState.errors)
          return false
        }
      }

      methods.handleSubmit(cb as any)()
    }
  }

  return (
    <FormContext.Provider value={{ 
      methods, 
      _values, 
      context,
      bind,
      unBind,
      submitWithBindings,
      disableInitialDefaults,
      globalInitialDefaults
    }}>
      <FormProvider {...methods}>
        <Comp 
          onSubmit={handleFormSubmit} 
          className="h-full flex flex-col justify-between text-sm" 
          onError={x => {
            if (debug) {
              console.log("Depuración de formulario:", methods.formState.errors)
            }
          }}
          >
          {children}
        </Comp>
      </FormProvider>
    </FormContext.Provider>
  )
}

/** 
  @deprecated ahora se puede usar "makeNameHelper" para 'tipar' Schemas enteros  
*/
export const useName = (...names: string[]) => {

  return (...subNames: string[]) => ([
    ...names,
    ...subNames
  ]).join(".")
}