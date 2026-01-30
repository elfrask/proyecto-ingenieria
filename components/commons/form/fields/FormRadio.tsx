import { Field, FieldContent, FieldError, FieldLabel, FieldTitle } from "@/components/ui/field"
import { FormFieldProps, Items } from "@/types/form.types"
import { Controller } from "react-hook-form"
import { useFormContextComponent } from "../providers/FormProvider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FormFieldState } from "./FormField"
import { cn } from "@/lib/utils"

export default function FormRadio({
  name,
  label,
  className,
  options
}: FormFieldProps) {
  const { methods } = useFormContextComponent()

  return (
    <Controller
      key={name}
      name={name as any}
      control={methods.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={"gap-1"}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>

          <RadioGroup
            name={name}
            value={field.value}
            onValueChange={field.onChange}
            aria-invalid={fieldState.invalid}
            className={className}
          >
            {options?.map((option: any) => (
              <FieldLabel
                key={option.value}
              >
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldTitle>{option.label}</FieldTitle>
                  </FieldContent>
                  <RadioGroupItem
                    value={option.value}
                    aria-invalid={fieldState.invalid}
                  />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>

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


export interface FormRadioProps extends FormFieldProps<string> {
  options: readonly Items[] | Items[];
  "cls-group"?: string;
  orientation?: "horizontal" | "vertical"
  liteStyle?: boolean
}

export function FormRadioNew({
  options,
  "cls-group": clsGroup,
  orientation,
  liteStyle,
  ...p
}: FormRadioProps) {
  const { methods } = useFormContextComponent()
  const ori = orientation || "vertical"
  // console.log(options)
  return (
    <FormFieldState
      {...p}
      defaultValueInitial={""}
      methods={methods}
      render={({ field, fieldState, formState, props: { name } }) => (


        <RadioGroup
          name={name}
          value={field.value}
          onValueChange={field.onChange}
          aria-invalid={fieldState.invalid}
          className={cn("*:outline-0 *:border-0 flex", clsGroup, (
            ori === "horizontal"?(
              "flex-row"
            ): (
              "flex-col"
            )
          ))}
        >
          {options?.map((option: any) => {

            const _field = (
              <Field
                orientation={"horizontal"}
                data-invalid={fieldState.invalid}
                className={cn(liteStyle ? "outline-0 border-0 " : " ")}
              >
                <RadioGroupItem
                  value={option.value}
                  aria-invalid={fieldState.invalid}
                />
                <FieldContent>
                  <FieldTitle>{option.label}</FieldTitle>
                </FieldContent>
              </Field>
            )

            return (
              liteStyle?
              <div key={option.value}>
                {_field}

              </div>
              :
              <FieldLabel
                key={option.value}
              >
                {_field}
              </FieldLabel>
            )
          })}
        </RadioGroup>

      )}
    />
  )
}