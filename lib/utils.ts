import { clsx, type ClassValue } from "clsx"
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
