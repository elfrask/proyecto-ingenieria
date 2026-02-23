import { z } from "zod";

export type Path<T> = T extends object
  ? {
    [K in keyof T & string]:
    T[K] extends object
    ? `${K}` | `${K}.${Path<T[K]>}`
    : `${K}`;
  }[keyof T & string]
  : never;

export type PathBuilder<T> = {
  $: () => string;
  // toString: () => string;
  $interface: z.infer<_getEstructure<T>>;
  $name: () => string;
  $insert: () => string;
} & (
    T extends z.ZodObject<infer Shape> ? {
      [K in keyof Shape]: PathBuilder<Shape[K]>;
    } :
    T extends z.ZodArray<infer Item> ? {
      $index: (n?: number) => PathBuilder<Item>;
      $$: PathBuilder<Item>;
    } :
    {}
  );

export type BuilderKeys<T> =
  Exclude<keyof T, "$" | "$index" | "$$" | "$interface" | "$name" | "$insert" | "toString">;

export type useKeys<T extends PathBuilder<{}>> = (
  T extends PathBuilder<z.ZodArray<any>> ? (BuilderKeys<T["$$"]>)[]: (BuilderKeys<T>)[]
  // T extends PathBuilder<z.ZodObject<any>> ? (BuilderKeys<T>)[]: 
  // never
)

type _getEstructure<T> = (
   T extends z.ZodArray<infer Item> ? Item: T 
)

export function makeNameHelper<T extends z.ZodTypeAny>(
  schema: T,
  stack: string[] = []
): PathBuilder<T> {
  const name = stack[stack.length - 1] || "";

  const build = {
    $: () => stack.join("."),
    toString: () => stack.join("."),
    $name: () => name,
    $insert: (v: any) => [...stack, v].join(".")
  } as any;

  if ((schema instanceof z.ZodOptional) || (schema instanceof z.ZodNullable)) {
    schema = schema.unwrap() as T;
  }


  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;

    for (const key in shape) {
      build[key] = {
        ...makeNameHelper(shape[key], [...stack, key])
        // $key: (key: string)
      };
    }
  }

  if (schema instanceof z.ZodArray) {
    const item = schema.element;

    build.$index = (n?: number) =>
    {
      if (n === undefined) {
        return makeNameHelper(item as any, stack)
      }
      return makeNameHelper(item as any, [...stack, String(n)]);
    }

    build.$$ = makeNameHelper(item as any, stack);
  }

  return build;
};



export function optionalSchema<T extends z.ZodTypeAny>(schema: T) {
  let result = schema;
  result = schema.optional() as any;
  return result
}