export interface IUser {
  user: string;
  pass: string;
  role: string;
}

export interface IMarker {
  id?: number;
  subject?: string;
  description?: string;
  reference?: string;
  report_date: Date;
  lng: number;
  lat: number;
}

export interface IMinute {
  id?: number;
  title?: string;
  description?: string;
  type?: string;
  marker_id?: number;
  fields?: any;
}

export interface ICustomField {
  name: string;           // Nombre interno del campo (clave)
  type: "text" | "number" | "date" | "select" | "checkbox" | "textarea"; // Tipo de campo
  caption: string;        // Etiqueta o título visible para el usuario
  required?: boolean;     // Si el campo es obligatorio
  options?: string[];     // Opciones para campos tipo select
  placeholder?: string;   // Texto de ayuda
  defaultValue?: any;     // Valor por defecto
  min?: number;           // Para number/date: mínimo
  max?: number;           // Para number/date: máximo
  step?: number;          // Para number: incremento
  [key: string]: any;     // Permite extensibilidad para otros props personalizados
}

export interface IMinuteType {
  id: number;
  caption: string;
  typeName: string;
  fields: ICustomField[];
}