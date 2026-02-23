import { FieldError, UseFormReturn } from "react-hook-form"
import z from "zod"
import { requires } from "./schemas";
import { ReactNode } from "react";

// export interface Items {
//   label: string;
//   value: string;
//   disabled?: boolean;
// }

export const ItemsSchema = z.object({
  label: requires.string(),
  value: requires.string(),
  disabled: requires.boolean(),
})

type _Items = z.infer<typeof ItemsSchema>

export interface Items<T = any> {
  readonly value: T extends string ? T : Extract<keyof T, string>;
  readonly label: string;
  readonly disabled?: boolean;
}

export type KeyItemTake<T> =  keyof T | ((V: T) => string);

export interface SelectKeysForItems<T> {
  label: KeyItemTake<T>;
  value: KeyItemTake<T>;
  disabled?: KeyItemTake<T>;
}

export function parseItemKey<T>(obj: T, key: keyof T | ((V: T) => string)): string {
  
  
  if (typeof key === "function") {
    return key(obj)
  }
  return obj[key] as string
};

export function toItems<T>(list: T[], { label, value, disabled }: SelectKeysForItems<T>) {


  const i: Items[] = list.map(x => ({
    label: parseItemKey(x, label),
    value: parseItemKey(x, value),
    disabled: disabled && !parseItemKey(x, disabled) as boolean,
  }))

  return i
}


export function GenerateItem(): Items {
  return {
    label: "",
    value: "",
    disabled: false
  }
}

export type FormFieldProps<T = any> = {
  name: string
  step?: number
  label?: string
  placeholder?: string
  type?: string
  helperText?: string | ReactNode
  options?: any
  value?: any
  disabled?: boolean
  className?: string
  error?: FieldError
  rows?: number
  min?: number
  max?: number
  onChange?: (value: T) => void
  required?: boolean
  multiple?: boolean
  onValueChange?: (v: T) => void;
  inputStyle?: string
  maxLength?: number | undefined
}

export type FormData = {
  [key: string]: any
}

// D = Tipo de los Datos del Formulario (lo que z.infer<T> resultaría)
export type FormContextValue<D extends FormData = FormData, T extends z.ZodType = any> = {
  // El tipo D ya es el tipo inferido, no hay necesidad de z.infer<T>
  form: UseFormReturn<D>,
  schema: T
}
