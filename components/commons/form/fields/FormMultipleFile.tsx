import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { FormFieldProps } from "@/types/form.types"
import { Controller } from "react-hook-form"
import { useFormContextComponent } from "../providers/FormProvider"
import { cn } from "@/lib/utils"

interface FormMultipleFileProps extends FormFieldProps {
  accept?: string 
}

export default function FormMultipleFile({
  name,
  label,
  placeholder,
  className,
  required = false,
  multiple = true,
  accept='image/png,image/jpeg,application/pdf',
  ...props
}: FormMultipleFileProps) {
  const { methods } = useFormContextComponent()

  return (
    <Controller
      key={name}
      name={name as any}
      control={methods.control}
      render={({ field, fieldState }) => {
        const { value, onChange, ...fieldRest } = field;
        return (
          <Field data-invalid={fieldState.invalid} className={cn("gap-1", className)}>
            <FieldLabel htmlFor={name}>{label} <span className="text-red-500">{required ? "*" : ""}</span></FieldLabel>
            {placeholder && <p className="text-sm text-gray-500 mb-1">{placeholder}</p>}
            <Input
              {...fieldRest}
              {...props}
              id={name}
              type="file"
              multiple={multiple}
              accept={accept}
              aria-invalid={fieldState.invalid}
              className={`placeholder:text-gray-400`}
              onChange={(e) => {
                // Call RHF onChange to update value and then clear errors for this field
                field.onChange(e.target.files)
                methods.clearErrors(name as any)
              }}
            />

            <div className="min-h-[16px]">
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </div>
          </Field>
        )
      }}
    />
  )
}
