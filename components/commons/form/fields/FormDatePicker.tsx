import { DatePicker, Variant } from "@/components/ui/date-picker"
import { Field, FieldError, FieldLabel, FieldLegend } from "@/components/ui/field"
import { FormFieldProps } from "@/types/form.types"
import { Controller } from "react-hook-form"
import { useFormContextComponent } from "../providers/FormProvider"
import { cn, logValue } from "@/lib/utils"
import { FormFieldState } from "./FormField"

export default function FormDatePicker({
  name,
  label,
  placeholder,
  className,
  required=false,
  variant,
  fromDate,
  toDate,
  initDate,
  legend,
}: (FormFieldProps & {
  variant?: keyof typeof Variant,
  fromDate?: Date;
  toDate?: Date;
  initDate?: Date;
  legend?: string;
})) {
  const { methods } = useFormContextComponent()

  return (
    <Controller
      key={name}
      name={name as any}
      control={methods.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={cn("gap-1", className)}>
          <FieldLabel htmlFor={name}>{label} <span className="text-red-500">{required ? "*" : ""}</span></FieldLabel>

          <DatePicker
            value={field.value}
            onChangeValue={(e) => {
              // Call RHF onChange to update value and then clear errors for this field
              field.onChange(e)
              methods.clearErrors(name as any)
            }}
            placeholder={placeholder}
            className="hover:bg-muted"
            variant={variant}
            toDate={toDate}
            fromDate={fromDate}
            initDate={initDate}
            onBlur={field.onBlur}
          />
          {
            legend &&
            <FieldLegend className="text-gray-400 h-0 p-0 m-0">
              <span className="text-sm">
                {legend}

              </span>
            </FieldLegend>
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



export interface FormDateInputProps extends FormFieldProps<Date> {
    toDate?: Date | null;
    fromDate?: Date | null;

    initDate?: Date | null;
    variant?: keyof typeof Variant
}


export function FormDatePickerNew({
  ...props
}: FormDateInputProps) {
  const { methods } = useFormContextComponent()


  return (
    <FormFieldState
      {...props}
      defaultValueInitial={undefined}
      methods={methods}
      render={({ field, fieldState, formState, props: _props }) => (
        <DatePicker
          {..._props}
          value={field.value}
          onChangeValue={field.onChange}
          className="hover:bg-muted"
          mode="single" 
          selected={field.value} 
        />
      )}
    />
  )
}