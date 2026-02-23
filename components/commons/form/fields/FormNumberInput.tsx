import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { FormFieldProps } from "@/types/form.types"
import { Controller } from "react-hook-form"
import { useFormContextComponent } from "../providers/FormProvider"
import { FormFieldState } from "./FormField"
import { cn } from "@/lib/utils"
import { useState } from "react"

export default function FormNumberInput({
  name,
  label,
  placeholder,
  className,
  min,
  max,
  ...props
}: FormFieldProps) {
  const { methods } = useFormContextComponent()
  const current = methods.getValues(name as any)

  return (
    <Controller
      key={name}
      name={name as any}
      defaultValue={current ?? ""}
      control={methods.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={cn("gap-1", className)}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Input
            {...field}
            {...props}
            id={name}
            min={min}
            max={max}
            type="number"
            aria-invalid={fieldState.invalid}
            className={`placeholder:text-gray-400  appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none${className ?? ""}`}
            placeholder={placeholder ?? ""}
          />

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



export function FormInputNumberNew(props: FormFieldProps) {
  const { methods } = useFormContextComponent()
  const [_v, _sv] = useState("")


  return (
    <FormFieldState
      {...props}
      methods={methods}
      defaultValueInitial={0}
      render={({ field, fieldState, formState, props }) => (
        <Input
          // {...field}
          {...props}
          step={props.step}
          value={
            // si es null solo lo vacía
            typeof field.value === null? "" :
            // si es texto intente parsearlo
            typeof field.value === "string"? field.value :
            // si es numérico
            (typeof field.value === "number") && (!isNaN(field.value)) && field.value !== 0 ? (field.value): _v
          }
          id={props.name}
          type="number"
          min={props.min ?? 0}
          aria-invalid={fieldState.invalid}
          className={`placeholder:text-gray-400`}
          placeholder={props.placeholder ?? ""}
          onChange={(e) => {
            const v = e.target.valueAsNumber;
            const s = e.target.value
            _sv((s === "0") ? "":s)
            field.onChange(e.target.valueAsNumber);
            // if (!isNaN(v)) {
              
            // }

          }}
        />
      )}
    />
  )
}