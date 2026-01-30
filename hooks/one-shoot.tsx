import { useEffect } from "react";


export function oneShot(cb: (...a: any[]) => (() => void) | void | undefined | any) {
  useEffect(() => {return cb()}, [])
}