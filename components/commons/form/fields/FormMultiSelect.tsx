import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { MultiSelect, MultiSelectOption } from "@/components/ui/multi-select"
import { FormFieldProps } from "@/types/form.types"
import { Controller } from "react-hook-form"
import { useFormContextComponent } from "../providers/FormProvider"
import { cn } from "@/lib/utils"
import { FormFieldState } from "./FormField"

export default function FormMultiSelect({
  name,
  label,
  placeholder,
  options,
  className,
}: Omit<FormFieldProps, "options"> & { options: MultiSelectOption[] }) {
  const { methods } = useFormContextComponent()

  return (
    <Controller
      key={name}
      name={name as any}
      control={methods.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={cn("gap-1", className)}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>

          <MultiSelect
            variant="secondary"
            name={name}
            value={field.value}
            options={options}
            onValueChange={(e) => {
              // Call RHF onChange to update value and then clear errors for this field
              field.onChange(e)
              methods.clearErrors(name as any)
            }}
            defaultValue={field.value}
            placeholder={placeholder||"Seleccionar"}
            hideSelectAll
            searchable={false}
            autoSize={true}
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




export function FormMultiSelectNew({
  options, multiLine, ...p
}: Omit<FormFieldProps, "options"> & { options: MultiSelectOption[], multiLine?: boolean }) {
  const { methods } = useFormContextComponent()

  return (
    <FormFieldState
      defaultValueInitial={[]}
      methods={methods}
      {...p}
      render={({ field, props: {name, placeholder} }) => (
        <Field className="w-full *:w-full p-0 m-0 flex flex-col overflow-hidden">
          <MultiSelect
            variant="secondary"
            name={name}
            value={field.value}
            options={options}
            singleLine={!multiLine}
            onValueChange={(e) => {
              field.onChange(e)
            }}
            style={{
              width: "100%",
              maxWidth: "100%"
            }}
            defaultValue={field.value}
            placeholder={placeholder||"Seleccionar"}
            className="max-w-full *:*:overflow-hidden"
            hideSelectAll
            searchable={false}
          />
        </Field>

      )}
    />
  )
}