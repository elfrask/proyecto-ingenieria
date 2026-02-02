"use client";
import { optionalSchema } from "@/lib/makeNameHelper";
import { getFromName, logValue } from "@/lib/utils";
import z from "zod";
import { Items } from "./form.types";


export const SchemasForPersons = {

  DNI: () => z.string("Este campo es obligatorio")
    .min(7, "La cédula debe tener al menos 7 caracteres")
    .regex(/^[VJEG]\d{1,9}$/, "El número de identificación debe estar en un formato correcto, ej: V1234567 o J1234567"),
  nombre: () => z.string("Este campo debe tener al menos 2 caracteres")
    .min(2, "Este campo debe tener al menos 2 caracteres")
    .max(50, "Este campo no puede pasar de los 50 caracteres"),
  email: () => z.email("Esto no es un correo"),
  tlf: () => z.string("Este campo es obligatorio")
    .min(11, "Este campo debe tener 11 dígitos"),
  numSeguridadSocial: () => stringValidations.minMax(5, 100),
};


export const stringValidations = {
  minMax: (min: number, max: number) => z.string("Este campo es obligatorio")
    .min(min, `Este campo debe tener al menos ${min}`)
    .max(max, `Este campo debe tener como máximo ${max}`),
  nonVoid: (min: number, max: number) => stringValidations.minMax(min, max),
  required: (min?: number) => z.string("Este campo es obligatorio")
    .min(min || 1, "Este campo es obligatorio"),
  simple: () => stringValidations.minMax(5, Infinity),
  langIso: () => requires.string()
    .min(2, "El formato ISO debe de ser 'es' o 'es-VE'")
    .refine(x => {
      if (x.length === 2) {
        return x === x.toLowerCase()
      };

      const ISO = x.split("-");

      if (ISO.length !== 2) {
        return false
      }      
      
      if (x.length !== 5) {
        return false
      }

      return (ISO[0] === ISO[0].toLowerCase()) && (ISO[1] === ISO[1].toUpperCase())

    }, "El formato ISO debe de ser 'es' o 'es-VE'"),

}

export const numberValidations = {
  nonZero: () => z.number("Este campo debe ser un numero").min(1, "Este campo debe de ser mínimo 1"),
  nonZeroFloat: () => z.number("Este campo debe ser un numero").min(0.001, "Este campo no puede ser 0"),
  minMax: (min: number, max: number) => z.number("Este campo debe ser un numero")
    .min(min || 0, `Este campo debe ser mínimo ${min || 0}`)
    .max(max || 0, `Este campo debe ser máximo ${max || 0}`),
  range: (min: number, max: number) => z.object({
    min: numberValidations.minMax(min, max),
    max: numberValidations.minMax(min, max),
  }),
}

export const requires = {
  date: () => z.date("Este campo es obligatorio"),
  file: () => z.file("Este campo es obligatorio"),
  string: () => stringValidations.required(),
  number: () => numberValidations.nonZero(),
  float: () => numberValidations.nonZeroFloat(),
  boolean: () => z.boolean().optional(),
  enum: <T extends Items>(items: readonly T[], message?: string) => generateEnumFromItems(items, message)
}

const isVoidOrObject = (v: any, Class: any) => {

  if (v instanceof Class) {
    return true
  }
  return ["", NaN, 0, null, undefined].includes(v)
}

export const optional = {
  date: () => z.date().optional().nullable()
    .refine(x => isVoidOrObject(x, Date), { message: "Debe ser una fecha o vació" }),
  file: () => z.file().optional().nullable()
    .refine(x => isVoidOrObject(x, File), { message: "Debe ser un archivo o vació" }),
  string: () => z.string("Campo invalido").optional(),
  number: () => z.number("Campo invalido").optional(),
  boolean: () => z.boolean("Campo invalido").optional(),
  enum: <T extends Items>(items: readonly T[], message?: string) => generateEnumFromItems(items, message, true),
  any: () => z.any().optional(),
}

export const TemplatesSchemas = {
  nameDescription: {
    nombre: requires.string(),
    descripcion: optional.string(),
    codigo: optional.string(),
  },
  initialScheme: () => {
    return {
      nombre: requires.string(),
      codigo: optional.string(),
    };
  },
};


/**
 * 
 * @param Schema Schema del formulario que poseerá una tabla
 * @param min Cantidad minima de items que tendrá la tabla, en caso de ser opcional dejar vació
 * @param minMessage Mensaje personalizado de la cantidad minima
 * @description Esta función es una estandarización de schemas basadas en valores listados con 
 * compatibilidad con los Wizard, useTableController, etc
 */
export function withTable<T extends z.ZodType>(Schema: T, min?: number, minMessage?: string) {

  return z.object({
    tempForm: optionalSchema(Schema),
    data: min ?
      z.array(Schema).min(min, minMessage || `Debes de tener al menos ${min} elemento`)
      : z.array(Schema)
  })
}

export function getSchemaFromName<T extends z.ZodObject>(schema:T, path:string): z.ZodType {
  
  const _path = path.split(".");
  let current: z.ZodType = schema;
  _path.forEach(x => {

    while (current instanceof z.ZodOptional || current instanceof z.ZodNullable) {
      current = current.unwrap() as z.ZodType
    }

    if (current instanceof z.ZodObject) {
      current = current.shape[x];
    }
  })



  return current

}

export function generateEnumFromItems<T extends Items>(items: readonly T[], message?: string, _optional?: boolean) {
  const out = [...items.map(x => x.value), ""] as ("" | T["value"])[]

  const e = z.enum(out, { error: message || "Valor invalido" }).refine(x => {
    if (_optional) {
      return true
    }
    return x !== "" 
  }, "Este campo es obligatorio");

  if (_optional) {
    return optionalSchema(e)
  }

  return e
}

export function useSuperRefineTools<T extends z.ZodObject, U extends Record<string, any> = z.infer<T>>(mainSchema: T, values: U, ctx: z.core.$RefinementCtx<U>) {


  let out = {

    revalidate(name: string, schema: z.ZodType, value?: any) {
      const shm = schema || getSchemaFromName(mainSchema, name);
      const _value = value || getFromName(values, name);
      // console.log(shm)
      const valid = shm.safeParse(_value);

      if (!valid.success) {
        valid.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: [name],
          });
        });
      }
    }
  };

  return out
}

export function createVoidDefault<T extends Record<string, any>, U>(val: T, valueFill?: U): Record<string, U> {
  const out: Record<string, any> = {...val};

  Object.entries(out).forEach(x => {out[x[0]] = valueFill})

  return out
}