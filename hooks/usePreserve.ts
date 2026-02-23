import { useState } from "react";


export function usePreserve<T extends Record<string, any>>(data: T | (() => T)) {
  let tt: T
  const [state, _] = useState<T | undefined>(undefined);
  
  if (typeof data === "function") {
    tt = data();
  } else {
    tt = data
  }

  if (!state) {
    _(tt)
  }

  return state || tt
}