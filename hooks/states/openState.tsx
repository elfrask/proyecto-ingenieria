import { openState } from "@/types/components/states";
import { useState } from "react";

export interface handlers<ctx=any> {
  onChange?: (v: boolean) => void;
  initialContext?: ctx;
}

export function useOpenState<CTX=any>(_default?: boolean, options?: handlers<CTX>): openState<CTX> {
  
  const [s, ss] = useState(_default || false);
  const [ctx, sctx] = useState<null | CTX>(options?.initialContext || null);

  function onChange(state: boolean) {
    options?.onChange?.(state)
  }

  function setCTX(ctx?: CTX) {
    if (ctx !== undefined) {
      sctx(ctx)
    }
  }

  return {
    state: s,
    set(st, ctx?: CTX) {
      const i =(st ?? !st)
      onChange(i)
      ss(i)
      setCTX(ctx);
    },
    open(ctx?: CTX) {
      onChange(true)
      ss(true)
      setCTX(ctx);
      
    },
    close() {
      onChange(false)
      ss(false)
    },
    ctx: ctx as CTX,
    clearCtx() {
      sctx(null)
    },
  }
}