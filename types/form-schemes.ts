import { db } from "@/lib/local-storage/db";
import { makeNameHelper } from "@/lib/makeNameHelper";
import z from "zod";


// export interface CreateFormSchemeToolReturn<T extends z.ZodObject> {
//   interface: z.infer<T>,
//   schema: T

// }

export function createFormSchemeTools<T extends z.ZodObject>(name: string, schema: T)  {
  type Interfaz = z.infer<T>;

  return {
    schema,
    $interface: undefined as unknown as z.infer<T>,
    helper: makeNameHelper(schema),
    DB: (initial?: Interfaz[]) => db(schema, name, initial)
  }
}