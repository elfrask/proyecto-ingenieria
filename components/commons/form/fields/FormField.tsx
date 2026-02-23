import { Field, FieldError, FieldLabel, FieldLegend } from "@/components/ui/field";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, logValue } from "@/lib/utils";
import { FormFieldProps } from "@/types/form.types";
import { FunctionComponent, HTMLAttributes, ReactNode } from "react";
import { Controller, FieldError as _FError, UseControllerReturn, UseFormReturn } from "react-hook-form";
import { useFormContextComponent } from "../providers/FormProvider";

export const VoidSpace = <span className="text-transparent">000</span> as unknown as string
export const ErrorStyle = "bg-red-100 text-red-600 border-red-600";


interface FormFieldBoxProps {
  label?: string;
  legend?: string;
  error?: string;
  errorInstance?: _FError;
  invalid?: boolean;
  className?: string;
  name?: string;
  children?: ReactNode;
  helpText?: ReactNode;
}

export const FormFieldBox: FunctionComponent<FormFieldBoxProps> = ({
  className, invalid, label, name, error, children, legend, errorInstance, helpText
}) => {

  function Help(c: ReactNode) {
    
    if (!helpText) {
      return c
    };

    return(
      <Tooltip>
        <TooltipTrigger asChild>
          {c}
        </TooltipTrigger>
        <TooltipContent className="max-w-64">
          {helpText}
        </TooltipContent>
      </Tooltip>
    )
  }


  return (
    <Field className={(cn("gap-0 space-y-1", className))} data-invalid={invalid}>
      {
        label &&
        <FieldLabel htmlFor={name}>{label}</FieldLabel>
      }

      {
        Help(
          <div className="w-full *:w-full min-h-9">
            {children}
          </div>
        )
      }

      {
        legend &&
        <FieldLegend>{legend}</FieldLegend>
      }

     
      <FormErrorField error={errorInstance} invalid={invalid} />
    </Field>
  );
}

export interface FormErrorFieldProps extends HTMLAttributes<HTMLDivElement> {
  error?: _FError;
  invalid?: boolean;
  blockMode?: boolean;

}

export function FormErrorField({
  error, invalid, className, blockMode
}: FormErrorFieldProps) {

  const _invalid = invalid ?? Boolean(error)

  return (
    <div className={cn("error-field", !_invalid && "_hid", className)}
      style={_invalid && blockMode?{
        "display": "block"
      }:{}}
    >
      {
        _invalid && (
          <FieldError errors={[{ message: error?.message }]} />
        )
      }
    </div>
  )
}

export type NameToken = string | {$:() => string}

export function getName(str: NameToken) {
  
  if (typeof str === "string") {
    return str
  };
  
  if (str.$) {
    return str.$()
  };

  return ""
};

export interface FormFieldController<T = any> extends Omit<FormFieldProps, "name"> {
  methods: UseFormReturn<any>;
  name: string | {$:() => string};
  defaultValueInitial: T;
  render: (props: UseControllerReturn & { props: FormFieldProps }) => ReactNode;
  onValueChange?: (v: T) => void;
}


export const FormFieldState: FunctionComponent<FormFieldController> = ({
  name: _name, methods, render, className, label, onValueChange, defaultValueInitial, helperText, ...props
}) => {
  const {disableInitialDefaults, globalInitialDefaults} = useFormContextComponent();
  const name = getName(_name);
  const current = methods.getValues(name as any)
  return (
    <Controller
      key={name}
      name={name as any}
      control={methods.control}
      {...(disableInitialDefaults? (
        globalInitialDefaults === undefined?{}: {
          defaultValue: globalInitialDefaults
        } 
      ): {defaultValue: current ?? (defaultValueInitial)}) }
      // defaultValue={current ?? disableInitialDefaults? null:  (defaultValueInitial)}
      render={({ field, fieldState, formState }) => {

        function change(v: any) {

          if (onValueChange) {
            onValueChange(v)
          }
          field.onChange(v);
        }

        return (
          <FormFieldBox
            error={fieldState.error?.message}
            errorInstance={fieldState.error}
            name={name}
            className={(className)}
            invalid={fieldState.invalid}
            label={label}
            helpText={helperText}
          >

            {render({
              field: { ...field, onChange: change },
              fieldState,
              formState,
              props: { ...props, name }
            })}
          </FormFieldBox>
        )
      }}
    />
  )
}