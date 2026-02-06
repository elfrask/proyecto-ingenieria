

export const COLORS = {
 
  // colores
  "red": "-red-600",
  "blue": "-blue-600",
  "green": "-emerald-600",
  "yellow": "-amber-500", // El ámbar-500 es más legible que el yellow puro
  "orange": "-orange-600",
  "purple": "-purple-600",
  "pink": "-pink-600",
  "slate": "-slate-600",
  "indigo": "-indigo-600",
  "teal": "-teal-600",
  "cyan": "-cyan-600",
  "sky": "-sky-600",
  "lime": "-lime-600",
  "rose": "-rose-600",
  "fuchsia": "-fuchsia-600",
  "violet": "-violet-600",
  "brown": "-brown-600",
  "gray": "-gray-600",


  // --- GRISES / NEUTROS (Fondos, bordes, textos) ---
  "slate-50": "-slate-50",
  "slate-100": "-slate-100",
  "slate-200": "-slate-200",
  "slate-300": "-slate-300",
  "slate-400": "-slate-400",
  "slate-500": "-slate-500",
  "slate-600": "-slate-600",
  "slate-700": "-slate-700",
  "slate-800": "-slate-800",
  "slate-900": "-slate-900",

  // --- ROJOS (Errores, Deducciones, Alertas Críticas) ---
  "red-50": "-red-50",
  "red-100": "-red-100",
  "red-200": "-red-200",
  "red-300": "-red-300",
  "red-400": "-red-400",
  "red-500": "-red-500",
  "red-600": "-red-600",
  "red-700": "-red-700",
  "red-800": "-red-800",
  "red-900": "-red-900",

  // --- AZULES (Marca, Información, Botones Primarios) ---
  "blue-50": "-blue-50",
  "blue-100": "-blue-100",
  "blue-200": "-blue-200",
  "blue-300": "-blue-300",
  "blue-400": "-blue-400",
  "blue-500": "-blue-500",
  "blue-600": "-blue-600",
  "blue-700": "-blue-700",
  "blue-800": "-blue-800",
  "blue-900": "-blue-900",

  // --- VERDES (Éxito, Devengados, Activos) ---
  "emerald-50": "-emerald-50",
  "emerald-100": "-emerald-100",
  "emerald-200": "-emerald-200",
  "emerald-300": "-emerald-300",
  "emerald-400": "-emerald-400",
  "emerald-500": "-emerald-500",
  "emerald-600": "-emerald-600",
  "emerald-700": "-emerald-700",

  // --- AMARILLO / ÁMBAR (Advertencias, Pendientes, Vacaciones) ---
  "amber-50": "-amber-50",
  "amber-100": "-amber-100",
  "amber-200": "-amber-200",
  "amber-300": "-amber-300",
  "amber-400": "-amber-400",
  "amber-500": "-amber-500",
  "amber-600": "-amber-600",
  "amber-700": "-amber-700",

  // --- VIOLETAS (Departamentos, Especiales) ---
  "violet-50": "-violet-50",
  "violet-100": "-violet-100",
  "violet-500": "-violet-500",
  "violet-600": "-violet-600",
  "violet-700": "-violet-700",

  // --- NARANJAS (Incapacidad, Variaciones inusuales) ---
  "orange-50": "-orange-50",
  "orange-100": "-orange-100",
  "orange-500": "-orange-500",
  "orange-600": "-orange-600",
  "orange-700": "-orange-700",

  // --- ROSAS / FUCSIA (Licencias, Informativo opcional) ---
  "pink-50": "-pink-50",
  "pink-100": "-pink-100",
  "pink-500": "-pink-500",
  "pink-600": "-pink-600",
  "pink-700": "-pink-700",

  // --- CIAN / TEAL (Contexto, UI Neutra) ---
  "cyan-50": "-cyan-50",
  "cyan-500": "-cyan-500",
  "cyan-700": "-cyan-700",

   // --- MARRONES (Tonos tierra, Naturaleza) ---
  "brown-50": "-brown-50",
  "brown-100": "-brown-100",
  "brown-200": "-brown-200",
  "brown-300": "-brown-300",
  "brown-400": "-brown-400",
  "brown-500": "-brown-500",
  "brown-600": "-brown-600",
  "brown-700": "-brown-700",
  "brown-800": "-brown-800",
  "brown-900": "-brown-900",

  // --- GRISES (Neutros adicionales) ---
  "gray-50": "-gray-50",
  "gray-100": "-gray-100",
  "gray-200": "-gray-200",
  "gray-300": "-gray-300",
  "gray-400": "-gray-400",
  "gray-500": "-gray-500",
  "gray-600": "-gray-600",
  "gray-700": "-gray-700",
  "gray-800": "-gray-800",
  "gray-900": "-gray-900",

  // --- NEGRO (Oscuro, Fondo principal) ---
  "black": "-black",

  // --- BLANCO (Claro, Fondo secundario) ---
  "white": "-white",
  

  // --- ALIAS SEMÁNTICOS DE NEGOCIO (Resumen) ---

  "primary": "-primary-500",
  "primary-soft": "-primary-50",
  
  "success": "-success-500",
  "success-dark": "-success-700",
  "success-light": "-success-50",
  
  "danger": "-danger-500",
  "danger-dark": "-danger-700",
  "danger-light": "-danger-50",
  
  "warning": "-warning-500",
  "warning-dark": "-warning-700",
  "warning-light": "-warning-50",

  "text-main": "-neutral-900",
  "border": "-neutral-200",
  "bg-main": "-neutral-50",
} as const;

export const ListColors = Object.entries(COLORS).map(x => x[1])

export type Colors = keyof typeof COLORS
type PrefixColor = "text" | "border" | "bg" 

export function Color(color: Colors | "" | undefined, prefix: PrefixColor) {
  
  if (!color) {
    return ""
  };

  return `${prefix}${COLORS[color]}`
}