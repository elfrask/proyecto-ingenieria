import { useState } from "react";

export interface UseStateObjectReturn<T> { 
  state: T
  set(v: Partial<T>): void
}

export function useStateObject<T extends Record<string, any>>(obj: T): UseStateObjectReturn<T> {
  
  const [state, so] = useState(obj || {})

  function set(value: Partial<T>) {
    so({
      ...state,
      ...value
    })
  }

  return {
    state,
    set,
  }
}