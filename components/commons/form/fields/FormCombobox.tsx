import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Combobox } from "@/components/ui/combobox"
import { FormFieldProps } from "@/types/form.types"
import { Controller } from "react-hook-form"
import { useFormContextComponent } from "../providers/FormProvider"
import { cn } from "@/lib/utils"
import { FormFieldState } from "./FormField"

interface FormComboboxProps<T = any> extends FormFieldProps<T> {
  useNative?: boolean,
  items: string[]
}

export default function FormComboBox({
  name,
  label,
  placeholder,
  type,
  className,
  // items,
  ...props
}: FormComboboxProps) {
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
        <Field data-invalid={fieldState.invalid} className={cn("grid gap-3", className)}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Combobox
            {...field}
            {...props as any}
            id={name}
            Items={props.items}
            aria-invalid={fieldState.invalid}
            className={`placeholder:text-gray-400`}
            placeholder={placeholder ?? ""}
            onValueChange={(e) => {
              // Call RHF onChange to update value and then clear errors for this field
              field.onChange(e)
              methods.clearErrors(name as any)
            }}
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


export function FormComboBoxNew(props: FormFieldProps & { Items: string[] }) {
  const { methods } = useFormContextComponent()


  return (
    <FormFieldState
      {...props}
      methods={methods}
      defaultValueInitial={""}
      render={({ field, fieldState, formState, props }) => (
        <Combobox
          // {...field}
          value={field.value}
          {...props as any}
          id={props.name}
          placeholder={props.placeholder || "Seleccionar"}
          aria-invalid={fieldState.invalid}
          className={`placeholder:text-gray-400`}
          onValueChange={(e) => {
            // Call RHF onChange to update value and then clear errors for this field
            field.onChange(e)
          }}
        />
      )}
    />
  )
}