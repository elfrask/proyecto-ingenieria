


export interface State<T = any, ctx= any> {
  state: T;
  set: (st: T, ctx?: ctx) => void;
  open: (ctx?: ctx) => void,
  close: () => void,
  clearCtx: () => void,
  ctx: ctx,
}

export type openState<ctx=any> = State<boolean, ctx>