"use client"
import z from "zod";
import { optional, requires } from "../schemas";
import { makeNameHelper, optionalSchema } from "@/lib/makeNameHelper";
import { db } from "@/lib/local-storage/db";

export const grid = {
  sm: optional.number(),
  md: optional.number(),
  lg: optional.number(),
};

export const SchemaGrid = z.object(grid);
export type GridInterface = z.infer<typeof SchemaGrid>

export const ModalEditFieldScheme = z.object({
  depends: optional.string(),
  valueDepends: z.array(requires.string()).optional(),

  customLabel: optional.string(),
  customLabePlaceholder: optional.string(),
});


export const EditorFieldsScheme = z.object({
  id: requires.string(),
  basicos: optionalSchema(ModalEditFieldScheme),
  grid: optionalSchema(SchemaGrid),
})

const propiedades = z.object({
  title: requires.string(),
  description: requires.string(),
  fields: z.array(EditorFieldsScheme),
  code: optional.string(),
  grid: optionalSchema(SchemaGrid),
  status: requires.boolean(),
});



export const SchemaFormEditor = z.object({
  propiedades,
});


export const FormEditorHelper = makeNameHelper(SchemaFormEditor);

export function FormEditorDB() {
  return db(propiedades, "beneficios/categorías")
}





export type ModalEditInterface = z.infer<typeof ModalEditFieldScheme>
export const ModalEditHelper = makeNameHelper(ModalEditFieldScheme);

export type CustomConfigField = z.infer<typeof EditorFieldsScheme>
// export type CustomConfigField2 = Omit<z.infer<typeof EditorFieldsScheme>, "id">

