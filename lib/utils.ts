import { clsx, type ClassValue } from "clsx"
import { ChangeEvent, Dispatch, HtmlHTMLAttributes } from "react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"
import { AxiosResponse } from "axios"
import { Decode, Encode } from "./local-storage/super-json";
import { format } from "date-fns";

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

export function caption2Name(captions: string): string {
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

// export const Notify = {
//   success: (title: string, description?: string, rich?: boolean) => { toast(title, { style: { color: "lime" }, richColors: rich, description }) },
//   reject: (title: string, description?: string, rich?: boolean) => { toast(title, { style: { color: "crimson" }, richColors: rich, description }) },
// };

export const Notify = {
  success: (title: string, description?: string, rich?: boolean) => { toast.success(title, { style: { color: "lime" }, richColors: rich, description }) },
  reject: (title: string, description?: string, rich?: boolean) => { toast.error(title, { style: { color: "#ffaaaa" }, richColors: rich, description }) },
}

export interface ResponseRequest<T> {
  msg: string,
  error: number,
  success: boolean,
  result: T | null,
}

export function Response<T>(success: boolean, result: NoInfer<T> | null, error: number = 0, msg: string = ""): ResponseRequest<T> {
  return {
    success,
    result: (result),
    error,
    msg
  }
}


export type HTML<T = HTMLDivElement> = HtmlHTMLAttributes<T>;
export type typeValues = "text" | "number" | "date";


export function StateInput<T = any>(value: T, setValue: Dispatch<T>) {

  return {
    useInput: (
      key: keyof T,
      typeValue: typeValues = "text",
      useOnChangeValue?: boolean,
    ) => {

      function setState(_value: any, element: ChangeEvent<HTMLInputElement> | null) {

        if (typeValue == "number") {
          if (element) _value = element?.target.valueAsNumber as number;
          else _value = Number(_value);
        } else if (typeValue == "date") {
          if (element) _value = element?.target.valueAsDate as Date;
          else _value = new Date(_value);
        }

        setValue({ ...value, [key]: _value })


      }

      if (useOnChangeValue) {
        return {
          value: value[key] || "",
          onChangeValue: (e: HTML<HTMLInputElement>) => { setState(e, null) }
        }
      } else {
        return {
          value: value[key] || "",
          onChange: (e: ChangeEvent<HTMLInputElement>) => { setState(e.target.value, e) }
        }
      }
    }
  }
}


export function Class2Json<T = any>(Obj: any): T {

  if (Array.isArray(Obj)) {
    return Obj.map(x => {

      const e = Decode(Encode(x));

      if (e._doc) {
        return e._doc;
      };

      return e

    }) as T
  };


  const e = Decode(Encode(Obj));

  if (e._doc) {
    return e._doc;
  };

  return e

  // return Decode(Encode(Obj))
  // return JSON.parse(JSON.stringify(Obj))
}






export function toWith<T>(params: T[], cb: (...pr: T[]) => any) {
  return cb(...params);
}


export function selectAttributes<T extends Record<string, any>, K extends keyof T>(
  data: T,
  keys: K[]
): Pick<T, K> {

  const res = {} as Pick<T, K>;
  for (const key of keys) {
    res[key] = data[key];
  }

  return res;
};

export function logValue(value: any): any {
  console.log(value);

  return value
}


export function isPlainObject(value: any): boolean {

  if (typeof value !== "object") {
    return false
  }

  return Object.getPrototypeOf(value) === Object.prototype;
};

export function getFromName<T = any>(obj: Record<string, any>, path: string) {
  const paths = path.split(".");
  let _obj: Record<string, any> = obj;

  paths.forEach(x => {
    _obj = (_obj || {})[x]
  });

  return _obj as T | undefined

};




const recursiveClearTempsForms = (object: any) => {
  const detect = ["data", "tempForm"].sort();

  const attribs = Object.keys(object).sort();

  if (attribs.toString() === detect.toString()) {
    delete object.tempForm
    return
  };

  Object.entries(object).forEach(x => {
    const item = object[x[0]];

    if (item === null) {
      return
    }

    if (!isPlainObject(item)) {
      return
    }

    recursiveClearTempsForms(item)
  })

}

export const clearTemporalsForms = (all: any) => {


  recursiveClearTempsForms(all)
}


export function generarCodigo<T extends { codigo?: string }>(obj: T, key?: keyof T) {

  const k = key || "codigo";

  obj[k] = (obj[k] || crypto.randomUUID()) as T[keyof T] & T["codigo"]

  return obj
}


export type AxiosResponseServer<T> = AxiosResponse<IDataResultServer<T>>


export interface IMeta {
  current_page: number;
  per_page: number;
  total: number;
}

export interface IDataResultServer<T> {
  data: T
  message: string;
  meta: IMeta
}

export function formatDate(date: Date | string | number): string {
  return format(new Date(date), "dd/MM/yyyy")
}