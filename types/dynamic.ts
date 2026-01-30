import z from "zod";
import { FormFieldProps } from "./form.types";
import { requires } from "./schemas";
import { FormFieldConstructor, PropsDynamics } from "./components/form-constructor";


// Interfaz de los campos dinámicos

export type AllVariants = VariantNumberTypes | VariantTextTypes | VariantBooleanTypes | VariantDateTypes | VariantFilesTypes | VariantSelectTypes

export interface DynamicFields extends FormFieldConstructor {
  // props: PropsDynamics;
  // // props: Omit<FormFieldProps, "name">;
  // name: string;
  // label: string;
  // data_type: TypesFields;
  // variant: AllVariants;
  // visibleDepends: string;
}


// Variantes del campo texto

export const VariantText = {
  text: () => z.string("Este campo debe ser de texto"),
  email: () => z.email("Este campo debe de ser un correo"),
  tlf: () => VariantText.text().min(11, "Este debe de ser un numero de teléfono"),

};

export type VariantTextTypes = keyof typeof VariantText; 



// Variantes de campos numéricos

export const VariantNumber = {
  entero: () => z.number("Este campo debe ser numérico").int("Debe de ser un entero"),
  decimal: () => z.number("Este campo debe ser numérico"),
  money: () => z.number("Este campo debe ser numérico"),
  percentage: () => z.number("Este campo debe ser numérico"),

};

export type VariantNumberTypes = keyof typeof VariantNumber; 


// Variantes de fechas

export const VariantDate = {
  date: () => z.date("Este campo requieres de colocar una fecha"),
  datetime: () => VariantDate.date(),
  time: () => z.string("Debes de colocar el tiempo"), 
};

export type VariantDateTypes = keyof typeof VariantDate; 


// Variantes Booleanas

export const VariantBolean = {
  check: () => requires.boolean(),
};

export type VariantBooleanTypes = keyof typeof VariantBolean; 

// Variantes Select

export const VariantSelect = {
  select: () => requires.string(),
  multiselect: () => z.array(requires.string()),
  radio: () => requires.string(),
};

export type VariantSelectTypes = keyof typeof VariantSelect; 

// Variantes Archivos

export const VariantFiles = {
  file: () => requires.file(),
  image: () => requires.file(),
};

export type VariantFilesTypes = keyof typeof VariantFiles; 



export const TypesSchemesDynamics = {
  text: (variant?: VariantTextTypes) => {
    return (VariantText[variant||"text"]||VariantText.text)()
  },
  number: (variant?: VariantNumberTypes) => {
    return (VariantNumber[variant||"decimal"]||VariantNumber.decimal)()
  },
  date: (variant?: VariantDateTypes) => {
    return (VariantDate[variant||"date"]||VariantDate.date)()
  },
  boolean: (variant?: VariantBooleanTypes) => {
    return (VariantBolean[variant||"check"]||VariantBolean.check)()
  },
  file: (variant?: VariantFilesTypes) => {
    return (VariantFiles[variant||"file"]||VariantFiles.file)()
  },
  select: (variant?: VariantSelectTypes) => {
    return (VariantSelect[variant||"select"]||VariantSelect.select)()
  },
  
}

export type TypesFields = keyof typeof TypesSchemesDynamics;


export const TypeList = Object.keys(TypesSchemesDynamics);

export const VariantsList: Record<TypesFields, string[]> = {
  text: Object.keys(VariantText),
  number: Object.keys(VariantNumber),
  boolean: Object.keys(VariantBolean),
  date: Object.keys(VariantDate),
  file: Object.keys(VariantFiles),
  select: Object.keys(VariantSelect)
};