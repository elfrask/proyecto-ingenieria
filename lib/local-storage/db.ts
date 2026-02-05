"use client"
import z from "zod";
import { Decode, Encode } from "./super-json";
import { Items, SelectKeysForItems, toItems } from "@/types/form.types";



export interface dbType<T> {
  find: (query?: Partial<T>) => T[],
  items: (query: SelectKeysForItems<T>) => Items[],
  findOne: (query: Partial<T>) => T | undefined,
  push: (value: T) => T,
  update: (query: Partial<T>, updates: Partial<T>) => T[],
  updateForIndex: (query: number, updates: Partial<T>) => T[],
  remove: (query: Partial<T>) => boolean,
  overWrite: (data: T[]) => void,
};


const LL = {
  getItem: (x: string) => "[]",
  setItem: (x:string, v: string) => undefined,
}


export function db<T extends z.ZodObject>(schema: T, name: string, initial?: z.infer<T>[]) {

  let localStorage: typeof LL
  // console.log(window)

  try {
    localStorage = window?.localStorage as unknown as typeof LL
    
  } catch (error) {
    
    localStorage = LL;
  }
  // if (typeof window === undefined) {
  // } else {

  // }

  // try {
    
  // } catch (error) {
  //   return {} as TT
  // }

  const isExist = localStorage.getItem(name)
  type Interfaz = z.infer<T>
  type TT = dbType<Interfaz>;

  if (!isExist) {
    localStorage.setItem(name, initial? Encode(initial): "[]")
  };

  function read(): Interfaz[] {
    return(
      Decode(
        localStorage.getItem(name) as string
      )
    )
  }

  function write(value: Interfaz[]) {
    localStorage.setItem(name, Encode(value));
  }

  
  const me: TT = {
    find(query) {
      const r = read();

      if (!query) {
        return r
      }

      return r.filter(x => {
        return containsSubset(query, x)
      })
    },
    findOne(query) {
      const r = read();


      for (let i = 0; i < r.length; i++) {
        const element = r[i];
        // console.log("encontrado", query, element)
        
        if (containsSubset(query, element)) {
          return element
        }
      }
    },
    push(value) {
      const r = read();

      schema.parse(value);
      r.push(value)
      write(r)
      
      return value
    },
    update(query, updates) {
      const r = read();
      const updatedRecords = r.map(record => {
        if (containsSubset(query, record)) {
          return { ...record, ...updates };
        }
        return record;
      });
      write(updatedRecords);
      return updatedRecords.filter(record => containsSubset(query, record));
    },
    remove(query) {
      const r = read();
      const filteredRecords = r.filter(record => !containsSubset(query, record));
      write(filteredRecords);
      return r.length !== filteredRecords.length;
    },
    updateForIndex(index, update) {
      const r = read();
      const updatedRecords = r.map((record, y) => {
        if (y === index) {
          return { ...record, ...update };
        }
        return record;
      });
      write(updatedRecords);
      return updatedRecords.filter((record, y) => y === index);
    },
    overWrite(data) {
      z.array(schema).parse(data);

      write(data)
    },
    items(keys) {
      const r = read();
      const i: Items[] = toItems(r, keys)

      return i
    },
  };

  return me as TT
}


/**
 * Compara si el objeto 'superset' (obj1) contiene todas las propiedades y valores
 * del objeto 'subset' (obj2).
 * * NOTA: Esta es una comparación superficial (solo primer nivel de propiedades).
 * Si los valores de las propiedades son objetos anidados, solo se comparará la referencia.
 *
 * @param superset El objeto principal (obj1)
 * @param subset El objeto que se debe validar como subconjunto (obj2)
 * @returns true si obj1 contiene todo lo que tiene obj2.
 */
function containsSubset(
  subset: Record<string, any>,
  superset: Record<string, any>, 
): boolean {
    
    // Obtenemos todas las claves del objeto 'subset' (obj2)
    const subsetKeys = Object.keys(subset);

    // Iteramos sobre cada clave de obj2
    for (const key of subsetKeys) {
        
        // 1. Verificar si la clave existe en obj1 (superset)
        if (!(key in superset)) {
            // Si la clave de obj2 no existe en obj1, NO es un subconjunto.
            return false;
        }

        // 2. Verificar si el valor de esa clave es estrictamente igual (===)
        // Esto verifica valores primitivos. Para objetos anidados, verifica referencia.
        if (superset[key] !== subset[key]) {
            // Si los valores no coinciden, NO es un subconjunto.
            return false;
        }
    }

    // Si todas las claves de obj2 existen en obj1 y sus valores coinciden,
    // entonces obj2 es un subconjunto de obj1.
    return true;
}