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

export interface IMinuteField {
  [key: string]: any
}

export interface IMinute {
  id?: number;
  title?: string;
  description?: string;
  type?: string;
  marker_id?: number;
  fields: IMinuteField;
}

export const typesFields = [
  { type: "text", titleName: "Texto" },
  { type: "number", titleName: "Número" },
  { type: "date", titleName: "Fecha" },
  { type: "select", titleName: "Selección" },
  // { type: "checkbox", titleName: "Casilla de verificación" },
  // { type: "textarea", titleName: "Área de texto" },
  // { type: "map-polygon", titleName: "Polígono en mapa" },
  { type: "none", titleName: "Ninguno" }
] as const;



export interface ICustomFieldPre { // esto no es una tabla, es una subInterfaz
  name: string;           // Nombre interno del campo (clave)
  type: (typeof typesFields)[number]["type"]; // Tipo de campo basado en typesFields
  caption: string;        // Etiqueta o título visible para el usuario
  required?: boolean;     // Si el campo es obligatorio
  options?: string[];     // Opciones para campos tipo select
  origin?: string;                    // dirección del cual el select toma el origen de datos
  origin_caption_attribute?: string;  // atributo el cual es el nombre que se mostrara en el select
  origin_id_attribute?: string;       // atributo el cual se usara para asociar el dato seleccionado
  placeholder?: string;   // Texto de ayuda
  defaultValue?: any;     // Valor por defecto
  range?: number;           // Para number/date: mínimo
  min?: number;           // Para number/date: mínimo
  max?: number;           // Para number/date: máximo
  step?: number;          // Para number: incremento
}

export interface ICustomField extends ICustomFieldPre {
  [key: string]: any;     // Permite extensibilidad para otros props personalizados
}

export interface IMinuteType {
  id: number;
  caption: string;
  typeName: string;
  fields: ICustomField[];
}

export type None_ReadOnly_ReadAndWrite = 0 | 1 | 2 | 3; // Por Defecto | Desactivado | Solo lectura | Lectura y escritura 
export type ReadOnly_ReadAndWrite = 0 | 1 | 2; // Por Defecto | Solo lectura | Lectura y escritura
export type Enable_Disable = 0 | 1 | 2; // Por Defecto | Deshabilitado | Habilitado

export interface PermissionInterface {
  GeneralConfigs: Enable_Disable;
  Markers: ReadOnly_ReadAndWrite;
  Minute: ReadOnly_ReadAndWrite;
  MinuteType: ReadOnly_ReadAndWrite;
  roles: ReadOnly_ReadAndWrite;
  users: None_ReadOnly_ReadAndWrite;

}

export interface IOrigins {
  id?: number;
  name: string;
  title: string;
  disabled: boolean
}

export interface IOriginsElement {
  id?: number
  origins: string;
  title: string;
  value: string;
  peso: number;
  disabled: boolean;
}

export const PermissionDefault: PermissionInterface = {
 GeneralConfigs: 0,
 Markers: 0,
 Minute: 0,
 MinuteType: 0,
 roles: 0,
 users: 0
}


export const PermissionMaxAdmin: PermissionInterface = {
 GeneralConfigs: 2,
 Markers: 2,
 Minute: 2,
 MinuteType: 2,
 roles: 2,
 users: 3
}



export interface IRole {
  name: string;
  title: string;
  extends: string;
  disabled: boolean;

  permission: PermissionInterface
}