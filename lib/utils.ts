import { clsx, type ClassValue } from "clsx"
import { ChangeEvent, Dispatch, HtmlHTMLAttributes } from "react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function range(start: number, stop?: number, step?: number): number[] {
  // Manejar el caso de un solo argumento: range(stop)
  if (stop === undefined) {
    stop = start;
    start = 0;
  }

  // Si el paso no está definido, por defecto es 1
  if (step === undefined) {
    step = 1;
  }

  // Manejar el paso de 0 o negativo
  if (step === 0) {
    throw new Error('El paso no puede ser 0.');
  }

  const result: number[] = [];

  // Recorrer y generar los números
  if (step > 0) {
    for (let i = start; i < stop; i += step) {
      result.push(i);
    }
  } else {
    for (let i = start; i > stop; i += step) {
      result.push(i);
    }
  }

  return result;
}

export function caption2Name(captions:string): string {
  return captions
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .map((word, idx) =>
      idx === 0
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join('');
};

var c2n = caption2Name

export const Notify = {
  success:(title: string, description?: string, rich?: boolean) => {toast(title, {style:{ color: "lime"}, richColors: rich, description})},
  reject:(title: string, description?: string, rich?: boolean) => {toast(title, {style:{ color: "crimson"}, richColors: rich, description})},
}

export interface ResponseRequest<T> {
    msg: string,
    error: number,
    success: boolean,
    result: T | null,
}

export function Response<T>(success: boolean, result: T | null, error: number = 0, msg: string = ""): ResponseRequest<T> {
    return {
        success,
        result,
        error,
        msg
    }
}


export type HTML<T=HTMLDivElement> = HtmlHTMLAttributes<T>;
export type typeValues = "text" | "number" | "date";


export function StateInput<T = any>(value: T, setValue: Dispatch<T>) {
  
  return {
    useInput: (
      key: keyof T, 
      typeValue: typeValues = "text",
      useOnChangeValue?: boolean, 
    ) => {

      function setState(_value: any, element: ChangeEvent<HTMLInputElement>|null) {

        if (typeValue == "number") {
          if (element) _value = element?.target.valueAsNumber as number;
          else _value = Number(_value);
        } else if (typeValue == "date") {
          if (element) _value = element?.target.valueAsDate as Date;
          else _value = new Date(_value);
        }

        setValue({...value, [key]: _value })

        
      }

      if (useOnChangeValue) {
        return {
          value: value[key]||"",
          onChangeValue: (e: HTML<HTMLInputElement>) => { setState(e, null) }
        }
      } else {
        return {
          value: value[key]||"",
          onChange: (e: ChangeEvent<HTMLInputElement>) => { setState(e.target.value, e) }
        }
      }
    } 
  }
}


export function Class2Json<T=any>(Obj: any): T {
  return JSON.parse(JSON.stringify(Obj))
}