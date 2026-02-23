import z from "zod";
import { optional, requires } from "../schemas";
import { makeNameHelper, optionalSchema } from "@/lib/makeNameHelper";


export const props = {
  name: optional.string(),
  label: optional.string(),
  placeholder: optional.string(),
  type: optional.string(),
  helperText: optional.string(),
  disabled: optional.boolean(),
  className: optional.string(),
  money: optional.string(),
  min: optional.number(),
  max: optional.number(),
  required: optional.boolean(),
  inputStyle: optional.string(),
  multiple: optional.boolean(),
  maxLength: optional.number(),

  toTime: optional.string(),
  fromDate: optional.date(),
  fromTime: optional.string(),
  toDate: optional.date(),
  options: optional.any(),
  filter: optional.string(),
  origin: optional.string(),
  defaultValue: optional.any(),
  defaultValue2: optional.any(),
  Switch: optional.boolean(),
};

const _pr = z.object(props);

export type PropsDynamics = z.infer<typeof _pr>

export const field = {
  data_type: requires.string(),
  variant: requires.string(),
  name: requires.string(),
  label: requires.string(),
  status: requires.boolean(),
  props: optionalSchema(z.object(props)),
};

export const formConstructor = z.object(field)

export const formConstructorHelper = makeNameHelper(formConstructor);
export type InterfazFormConstructorHelper = typeof formConstructorHelper.$interface;

export interface FormFieldConstructor extends Omit<InterfazFormConstructorHelper, "status"> {
  visibleDepends?: string;
  visibleDependsValue?: string[];
}


export function generateDefaultFormConstructor(): InterfazFormConstructorHelper {
  return {
    data_type: "",
    label: "",
    name: "",
    variant: "",
    status: true,
    props: {
      className: "",
      helperText: "",
      inputStyle: "",
      label: "",
      placeholder: "",
      name: "",
      type: "",
      disabled: undefined,
      max: undefined,
      min: undefined,
      multiple: undefined,
      maxLength: undefined,
      required: undefined,
      options: undefined

    }
  }
}