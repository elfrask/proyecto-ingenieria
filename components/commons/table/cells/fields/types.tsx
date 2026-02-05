

export type CellInputPropsTemplate<T = any, U = React.ComponentProps<"input">> = {
  onValueChange?: (v: T) => void;
  onSave?: (value: T) => undefined;

} & U;