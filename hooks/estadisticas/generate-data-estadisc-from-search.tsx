import { format } from "date-fns";
import { dataResultSearch } from "./use-search";
import { range } from "lodash";

type result = { value: string, label: string }

export const _Meses: Record<string, string> = {
  "1": "Enero",
  "2": "Febrero",
  "3": "Marzo",
  "4": "Abril",
  "5": "Mayo",
  "6": "Junio",
  "7": "Julio",
  "8": "Agosto",
  "9": "Septiembre",
  "10": "Octubre",
  "11": "Noviembre",
  "12": "Diciembre",
};


export function nameForGroupFromSearch<T>(obj: T, modo: dataResultSearch["modo"], key: keyof T): result {
  const value = new Date(obj[key] as Date);

  if ((modo === "todo") || (modo === "periodo")) {
    return {
      value: format(value, "dd/MM/yyyy") as string,
      label: format(value, "dd/MM/yyyy") as string,
    }
  }

  if (modo === "año") {
    // console.log(value, format(value, "MM"))
    return {
      value: _Meses[format(value, "M") as any] as string,
      label: _Meses[format(value, "M") as any] as string,
    }
  }

  if (modo === "fecha") {
    return {
      value: format(value, "h aaa") as string,
      label: format(value, "h aaa") as string,
    }
  }

  if (modo === "mes") {
    return {
      value: format(value, "dd") as string,
      label: format(value, "dd") as string,
    }
  }

  return {
    label: "",
    value: ""
  }
}


function getDaysInMonth(month: number, year: number) {
  // El día 0 del mes siguiente es el último día del mes actual
  const date = new Date(year, month, 0);
  const daysCount = date.getDate();

  // Creamos un array del 1 al N
  return Array.from({ length: daysCount }, (_, i) => i + 1);
}

function genInitToEnd(init: Date, end: Date) {

  const listaFechas: string[] = [];
  let fechaActual = new Date(init); // Clonamos para no mutar la original

  while (fechaActual <= end) {
    // Guardamos una copia de la fecha actual
    listaFechas.push(format(new Date(fechaActual), "dd/MM/yyyy"));

    // Paso clave: Incrementar un día
    fechaActual.setDate(fechaActual.getDate() + 1);
  };

  return listaFechas
}

export function generateGroup(search: dataResultSearch): Record<string, any[]> {

  const out: Record<string, any[]> = {};

  if (search.modo === "mes") {
    const e = getDaysInMonth(search.init.getFullYear(), search.init.getMonth()).map(x => {
      return x.toLocaleString("es", { minimumIntegerDigits: 2})
    }).sort();

    // console.log(e)
    e.forEach(x => {
      out[x] = [];
    })

  }

  if (search.modo === "año") {
    Object.entries(_Meses).forEach(x => {
      out[x[1]] = []
    });

  }

  if (search.modo === "fecha") {
    range(1, 13).forEach(x => { out[`${x} am`] = [] });
    range(1, 13).forEach(x => { out[`${x} pm`] = [] });
  };

  if (search.modo === "periodo") {
    const e = genInitToEnd(search.init, search.end);
    e.forEach(x => {out[x] = []})
  }

  if (search.modo === "todo") {
    
  }

  return out
};


export function sortDataList<T>(gen: [string, T][], mode: dataResultSearch["modo"]) {
  if (mode === "mes") {
    gen = gen.sort()
  };

  return gen
}