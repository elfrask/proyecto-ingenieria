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

export interface ICustomField { // esto no es una tabla, es una subInterfaz
  name: string;           // Nombre interno del campo (clave)
  type: "text" | "number" | "date" | "select" | "checkbox" | "textarea" | "map-polygon"; // Tipo de campo
  caption: string;        // Etiqueta o título visible para el usuario
  required?: boolean;     // Si el campo es obligatorio
  options?: string[];     // Opciones para campos tipo select
  origin?: string;                    // dirección del cual el select toma el origen de datos
  origin_caption_attribute?: string;  // atributo el cual es el nombre que se mostrara en el select
  origin_id_attribute?: string;       // atributo el cual se usara para asociar el dato seleccionado
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