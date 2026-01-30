import { usePreserve } from "../usePreserve";

/**
 * @description isChange es un hook de rendimiento que te permite depurar las porciones de código que hacen cálculos innecesarios, re-declaraciones o mal uso de useMemo
 * @param value El valor a evaluar
 * @param flag Mensaje para mostrar al depurar
 * @param cb llamada a una funcion cada que se detecta un cambio
 * @returns devolverá el valor que le pases
 */
export function isChange<T>(value: T, flag?: string, cb?: (() => {})) {
  
  const before = usePreserve({d: undefined as any});

  if (value !== before.d) {
    console.log(`DEBUG: ${flag??""}:`, value, before)
    cb?.()
    before.d = value;
  }


  return value as T
}