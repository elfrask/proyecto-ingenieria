


export type createModel<model=Record<string, any>, type=unknown> = {
  [K in keyof model]: type
}