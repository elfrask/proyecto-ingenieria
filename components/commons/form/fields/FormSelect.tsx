import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormFieldProps, Items } from "@/types/form.types"
import { Controller } from "react-hook-form"
import { useFormContextComponent } from "../providers/FormProvider"
import { cn } from "@/lib/utils"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { FormFieldState } from "./FormField"
import {  useId, useMemo,  } from "react"

interface FormSelectProps<T = any> extends FormFieldProps<T> {
  useNative?: boolean,
  options: readonly Items[] | Items[]
}

export default function FormSelect({
  name,
  label,
  placeholder,
  className,
  disabled = false,
  required = false,
  options,
  useNative,
  onChange
}: FormSelectProps) {
  const { methods } = useFormContextComponent()

  // Provide a defaultValue so the Controller mounts as controlled from start.
  const current = methods.getValues(name as any)

  return (
    <Controller
      key={name}
      name={name as any}
      control={methods.control}
      defaultValue={current ?? ""}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={cn("gap-1", className)}>
          {
            label &&
            <FieldLabel htmlFor={name}>{label} <span className="text-red-500">{required ? "*" : ""}</span></FieldLabel>
          }

          {
            useNative ? [
              <NativeSelect
                key={"model-select-native"}
                name={name}
                value={field.value}
                onChange={(x) => {
                  field.onChange(x.target.value);
                  methods.clearErrors(name as any)
                  if (onChange) {
                    onChange(x.target.value)
                  }
                }}
              >
                {options?.map((option: any) => (
                  <NativeSelectOption key={option.value + "-native"} value={option.value} className="focus:bg-muted">
                    {option.label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            ] : [

              <Select
                disabled={disabled}
                key={"model-select"}
                name={name}
                value={field.value}
                onValueChange={(x) => {
                  field.onChange(x);
                  methods.clearErrors(name as any)
                  if (onChange) {
                    onChange(x)
                  }
                }}
              >
                <SelectTrigger
                  id={name}
                  aria-invalid={fieldState.invalid}
                  className={`w-full`}
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options?.map((option: any) => (
                    <SelectItem key={option.value + "-component"} value={option.value} className="focus:bg-muted">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ]
          }

          <div className="min-h-[20px]">
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </div>
        </Field>
      )}
    />
  )
}

/**
 * 
 * @param list Establece la lista de valores
 * @param title Sobrescribe los títulos y usa '{}' para diferenciarlos
 * @returns Items: objeto que contiene label y value
 */
export function listToItems(list: any[], title?: string): Items[] {
  return list.map(x => ({
    label: (!title) ? x : title.replace("{}", String(x)),
    value: String(x),
  }))
};



export function FormSelectNew({
  useNative, options, ...props
}: FormSelectProps) {
  const { methods } = useFormContextComponent()
  const id = useId()
  // const [elements, setElements] = useState<ReactNode[]>([]);

  const elements = useMemo(() => {
    return options?.map((option: Items) => {

      if (useNative) {
        return (
          <NativeSelectOption key={option.value + "-native" + id} disabled={option.disabled} value={`${option.value}`} className="focus:bg-muted">
            {option.label}
          </NativeSelectOption>
        )
      }

      return (
        <SelectItem key={option.value + "-component" + id} disabled={option.disabled} value={`${option.value}`} className="focus:bg-muted">
          {option.label}
        </SelectItem>
      )

    })
  }, [options, useNative])

  return (
    <FormFieldState
      {...props}
      methods={methods}
      defaultValueInitial={""}
      render={({ field, fieldState, props: _props }) => {
        const { name, onChange, placeholder } = _props
        // console.log("select:", [field.value, name])
        return (
          useNative ? [
            <NativeSelect
              {..._props}
              key={"model-select-native-" + id}
              name={name}
              value={field.value || "$none"}
              // placeholder={placeholder}

              onChange={(x) => {
                field.onChange(x.target.value);
                methods.clearErrors(name as any)
                if (onChange) {
                  onChange(x.target.value)
                }
              }}
            >
              {elements}
            </NativeSelect>
          ] : [

            <Select
              
              {..._props}
              key={"model-select" + id}
              name={name}
              value={field.value}
              onValueChange={(x) => {
                field.onChange(x);
                methods.clearErrors(name as any)
                if (onChange) {
                  onChange(x)
                }
              }}
            >
              <SelectTrigger
                key={"tigger-model-" + id}
                id={name}
                aria-invalid={fieldState.invalid}
                className={`w-full`}
              >
                <SelectValue placeholder={placeholder||"Seleccionar"} />
              </SelectTrigger>
              
              <SelectContent key={"tigger-model-content-" + id}>
                {elements}
              </SelectContent>
            </Select>
          ]
        )
      }}
    />
  )
}