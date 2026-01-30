import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { FormFieldProps } from "@/types/form.types"
import { Controller } from "react-hook-form"
import { useFormContextComponent } from "../providers/FormProvider"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { FormFieldState } from "./FormField"

export default function FormTextarea({
  name,
  label,
  placeholder,
  className,
  inputStyle,
  required=false,
  maxLength,
}: FormFieldProps) {
  const { methods } = useFormContextComponent()

  return (
    <Controller
      name={name}
      control={methods.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={cn("gap-1", className)}>
          <FieldLabel htmlFor={name}>{label} <span className="text-red-500">{required ? "*" : ""}</span></FieldLabel>
          <Textarea
            {...field}
            maxLength={maxLength}
            id={name}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder ?? ""}
            className={cn(`placeholder:text-gray-400`, inputStyle)}
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





export function FormTextareaNew({
  // name,
  // label,
  // placeholder,
  // className,
  // required=false,
  inputStyle,
  maxLength,
  ...p
}: FormFieldProps) {
  const { methods } = useFormContextComponent()

  return (
    <FormFieldState 
      {...p}  
      defaultValueInitial={""}
      methods={methods}
      render={({field, fieldState, formState, props: {
        name, placeholder, 
      }}) => {
        return(
          <Textarea
            // {...field}
            value={field.value}
            onChange={x => field.onChange(x.target.value)}
            maxLength={maxLength}
            id={name}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder ?? ""}
            className={cn(`placeholder:text-gray-400`, inputStyle)}
          />
        )
      }}
    />
  )
}