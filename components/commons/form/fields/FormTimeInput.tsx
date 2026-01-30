import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { FormFieldProps } from "@/types/form.types"
import { Controller } from "react-hook-form"
import { useFormContextComponent } from "../providers/FormProvider"
import { cn } from "@/lib/utils"
import { FormFieldState } from "./FormField"

export default function FormTimeInput({
  name,
  label,
  placeholder,
  className,
  required = false,
  inputStyle,
  ...props
}: FormFieldProps) {
  const { methods } = useFormContextComponent()

  // Ensure Controller mounts with a default value so input remains controlled.
  const current = methods.getValues(name as any)

  return (
    <Controller
      key={name}
      name={name as any}
      control={methods.control}
      defaultValue={current ?? ""}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={cn("gap-1", className)}>
          <FieldLabel htmlFor={name}>{label} <span className="text-red-500">{required ? "*" : ""}</span></FieldLabel>
          <Input
            {...field}
            {...props}
            id={name}
            type="time"
            aria-invalid={fieldState.invalid}
            className={cn(`placeholder:text-gray-400`, inputStyle)}
            placeholder={placeholder ?? ""}
            onChange={(e) => {
              // Call RHF onChange to update value and then clear errors for this field
              field.onChange(e)
              methods.clearErrors(name as any)
            }}
          />
          <div className="min-h-[16px]">
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </div>
        </Field>
      )}
    />
  )
}


export function FormTimeInputNew({
  ...p
}: FormFieldProps) {

  const { methods } = useFormContextComponent()


  return (
    <FormFieldState
      defaultValueInitial={""}
      methods={methods}
      name={p.name}     
      render={({ field, fieldState, props }) => (
        <Input
          {...field}
          {...props}
          id={props.name}
          type="time"
          aria-invalid={fieldState.invalid}
          className={cn(`placeholder:text-gray-400`, props.inputStyle)}
          placeholder={props.placeholder ?? ""}
          onChange={(e) => {
            field.onChange(e)
          }}
        />
      )}
    />
  )
}