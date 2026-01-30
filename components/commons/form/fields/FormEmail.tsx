import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { FormFieldProps } from "@/types/form.types"
import { Controller } from "react-hook-form"
import { useFormContextComponent } from "../providers/FormProvider"
import { cn } from "@/lib/utils"

export default function FormEmail({
  name,
  label,
  placeholder,
  className,
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
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Input
            {...field}
            {...props}
            id={name}
            type="email"
            aria-invalid={fieldState.invalid}
            className={`placeholder:text-gray-400`}
            placeholder={placeholder ?? ""}
            onChange={(e) => {
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
