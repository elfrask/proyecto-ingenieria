import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { FormFieldProps } from "@/types/form.types"
import { Controller } from "react-hook-form"
import { useFormContextComponent } from "../providers/FormProvider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { formatBytes, getFile, ValidAcceptTypes } from "@/lib/client-utils"
import { ErrorStyle, FormFieldState } from "./FormField"

export default function FormInputFile({
  name,
  label,
  placeholder,
  type,
  className,
  filter,
  required=false,
  ...props
}: FormFieldProps & {
  filter?: ValidAcceptTypes
}) {
  const { methods } = useFormContextComponent()

  return (
    <Controller
      key={name}
      name={name as any}
      control={methods.control}
      render={({ field, fieldState }) => {
        // console.log(field.value, "Archivo", name)
        return (
          <Field data-invalid={fieldState.invalid} className={cn("gap-1", className)}>
            <FieldLabel htmlFor={name}>{label} <span className="text-red-500">{required ? "*" : ""}</span></FieldLabel>
            <Button
              role="button"
              type="button"
              variant={"outline"}
              className={cn("hover:bg-muted",
                fieldState.error ? ErrorStyle : ""
              )}
              onClick={async () => {

                const _file = await getFile(filter);
                // console.log(_file, name)
                if (_file) {
                  field.onChange(_file)
                }

              }}>
              {
                field.value ?
                  `${field.value.name.slice(0, 25)}${field.value.name.length > 25 ? "..." : ""} (${formatBytes(field.value.size)})`
                  :
                  placeholder || "Selecciona un archivo"

              }
            </Button>

            <div className="min-h-[20px]">
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

export interface FormFileInputProps extends FormFieldProps {
  filter?: ValidAcceptTypes
}

export function FormInputFileNew({
  filter, ...props
}: FormFileInputProps) {
  const { methods } = useFormContextComponent()


  return (
    <FormFieldState
      {...props}
      methods={methods}
      defaultValueInitial={null}
      render={({ field, fieldState, formState, props: {
        placeholder, name,
      } }) => {

        const value: File | null = field.value || methods.getValues(name)

        return (
          <Button
            role="button"
            type="button"
            variant={"outline"}
            className={cn("hover:bg-muted",
              fieldState.error ? ErrorStyle : ""
            )}
            onClick={async () => {

              const _file = await getFile(filter);
              // console.log(_file, name)
              if (_file) {
                field.onChange(_file)
              }

            }}>
            {
              value ?
                `${value.name.slice(0, 25)}${value.name.length > 25 ? "..." : ""} (${formatBytes(value.size)})`
                :
                placeholder || "Selecciona un archivo"

            }
          </Button>
        )
      }

      }
    />
  )
}