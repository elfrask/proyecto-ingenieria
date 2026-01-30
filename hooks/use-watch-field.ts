import { useFormContextComponent } from "@/components/commons/form/providers/FormProvider";
import { getFromName } from "@/lib/utils";
import { useEffect } from "react";
import { FieldError } from "react-hook-form";


export interface useWatchFieldProps {
  onValidateError?: (v: FieldError) => void
}

export function useWatchField(name: string, options: useWatchFieldProps) {
  
  const {methods} = useFormContextComponent();

  const errors = getFromName<FieldError>(methods.formState.errors, name);

  useEffect(() => {
    if (errors) {
      options.onValidateError?.(errors)
    }
  }, [errors])

  return {
    errors
  }
}