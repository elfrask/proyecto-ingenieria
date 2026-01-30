import z from "zod";
import { optional, requires } from "../schemas";
import { makeNameHelper } from "@/lib/makeNameHelper";




export const SchemaCardListElement = z.object({
  nombre: requires.string(),
  descripcion: optional.string(),
  codigo: optional.string()
});


export const CardListHelper = makeNameHelper(SchemaCardListElement);
export type CardListInterface = typeof CardListHelper.$interface;