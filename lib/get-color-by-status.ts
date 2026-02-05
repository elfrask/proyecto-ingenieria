


export const getColorByStatus = (estatus: string) => {
  switch (estatus) {
    case "INACTIVO":
    case "POSTULADO":
      return 'bg-gray-100 text-gray-800'
    case "PENDIENTE":
    case "EN REVISION":
    case "SOLICITADO":
      return "bg-yellow-100 text-yellow-800"
    case "POR ENTREVISTA":
      return 'bg-orange-100 text-orange-800'
    case "ENTREVISTA RRHH":
      return 'bg-blue-100 text-blue-800'
    case "ENTREVISTA TÉCNICA 1":
      return 'bg-purple-100 text-purple-800'
    case "ENTREVISTA TÉCNICA 2":
      return 'bg-indigo-100 text-indigo-800'
    case "POR VERIFICAR":
    case "PRESELECCIONADO":
      return 'bg-cyan-100 text-cyan-800'
    case "SELECCIONADO":
      return 'bg-teal-100 text-teal-800'
    case "PAGADO":
    case "ONBOARDING":
    case "APROBADO":
    case "BUSQUEDA ACTIVA":
    case "PUBLICADO":
    case "ACTIVO":
      return 'bg-green-100 text-green-800'
    case "RECHAZADO":
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
};


const VariantColorBadge = {
  INACTIVO: () => 'bg-gray-100 text-gray-800',
  POSTULADO: () => VariantColorBadge.INACTIVO(),

  EN_REVISION: () => 'bg-yellow-100 text-yellow-800',
  SOLICITADO: () => VariantColorBadge.EN_REVISION(),

  POR_ENTREVISTA: () => 'bg-orange-100 text-orange-800',
  PENDIENTE: () => 'bg-orange-100 text-orange-800',

  ENTREVISTA_RRHH: () => 'bg-blue-100 text-blue-800',

  ENTREVISTA_TÉCNICA_1: () => 'bg-purple-100 text-purple-800',

  ENTREVISTA_TÉCNICA_2: () => 'bg-indigo-100 text-indigo-800',

  POR_VERIFICAR: () => 'bg-cyan-100 text-cyan-800',
  PRESELECCIONADO: () => VariantColorBadge.POR_VERIFICAR(),

  SELECCIONADO: () => 'bg-teal-100 text-teal-800',

  ONBOARDING: () => VariantColorBadge.ACTIVO(),
  APROBADO: () => VariantColorBadge.ACTIVO(),
  BUSQUEDA_ACTIVA: () => VariantColorBadge.ACTIVO(),
  PUBLICADO: () => VariantColorBadge.ACTIVO(),
  ACTIVO: () => 'bg-green-100 text-green-800',

  RECHAZADO: () => 'bg-red-100 text-red-800',

  BAJO: () => VariantColorBadge.ENTREVISTA_RRHH(),
  MEDIO: "bg-amber-100 text-amber-800",
  ALTO: () => VariantColorBadge.RECHAZADO(),

  DEFAULT: "bg-gray-100 text-gray-800"
}

export type VariantsColorsStatus = keyof typeof VariantColorBadge

export function getColorByStatusFromVariant(params?: VariantsColorsStatus): String {
  let color = VariantColorBadge[params?.toUpperCase() as VariantsColorsStatus|| "DEFAULT"];

  if (typeof color === "function") {
    color = color()
  }

  return color
}