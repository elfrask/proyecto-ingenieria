"use client"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Controller } from "react-hook-form"
import { FormFieldProps } from "../../../../types/form.types"
import { Checkbox } from "@/components/ui/checkbox"
import { useFormContextComponent } from "../providers/FormProvider"
import { cn } from "@/lib/utils"
import { ErrorStyle, FormFieldState } from "./FormField"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

export default function FormCheckbox({
  name,
  label,
  placeholder,
  className,
  required = false,
  disabled = false,
}: FormFieldProps) {
  const { methods } = useFormContextComponent()

  return (
    <Controller
      key={name}
      name={name as any}
      control={methods.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={cn("gap-1", className)}>
          <div className="w-full flex flex-row justify-start items-center gap-x-2">
            <div className="m-w-10 flex justify-center items-end">
              <Checkbox
                disabled={disabled}
                name={field.name}
                aria-invalid={fieldState.invalid}
                checked={field.value ?? false}
                onCheckedChange={(e) => {
                  field.onChange(e)
                  methods.clearErrors(name as any)
                }}
                className="border border-primary"
              />
            </div>

            <div className="flex flex-col">
              <FieldLabel htmlFor={name}>{label} <span className="text-red-500">{required ? "*" : ""}</span></FieldLabel>
              <p className="text-muted-foreground text-sm">
                {placeholder}
              </p>
            </div>
          </div>

          <div className="min-h-5">
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </div>
        </Field>
      )}
    />
  )
}



export interface FormCheckBoxProps<T = any> extends FormFieldProps<boolean> {
  labelCheck?: {
    enable?: string,
    disabled?: string,
    forever?: string
  } | string;
  Switch?: boolean;
}

export function FormCheckBoxNew({ labelCheck, Switch: Sw, ...props }: FormCheckBoxProps) {
  const { methods } = useFormContextComponent()


  return (
    <FormFieldState
      {...props}
      methods={methods}
      defaultValueInitial={false}
      className={cn("ignore-reserve", props.className)}
      render={({ field, fieldState, formState, props: {
        ...props
      } }) => (
        <div className="w-full flex justify-center items-center h-9">
          <div className="p-2 w-9 h-9">

            {
              Sw ?
                <Switch
                  {...props as any}
                  className={cn(
                    fieldState.error ?
                      ErrorStyle : '',
                    // "w-full h-full",
                  )}
                  checked={field.value}
                  onCheckedChange={x => field.onChange(x, true)}
                />
                :
                <Input
                  {...props}
                  type="checkbox"
                  className={cn(
                    fieldState.error ?
                      ErrorStyle : '',
                    "w-full h-full",
                  )}
                  checked={field.value}
                  onChange={x => field.onChange(x.target.checked, true)}
                />
            }

          </div>
          <div className="flex-1 px-3 flex flex-col text-[14px] justify-center select-none">
            {
              typeof labelCheck === "string" ?
                labelCheck
                : (
                  field.value ?
                    labelCheck?.enable || "Activo"
                    :
                    labelCheck?.disabled || "Inactivo"
                )
            }
          </div>

        </div>
      )}
    />
  )
}