import type { dataResultSearch } from "@/hooks/estadisticas/use-search";


export function convertDateToRequest(init: Date | string | number, end: Date | string | number) {
  return {
    $gte: new Date(init),
    $lte: new Date(end)
  }
}

export function searchConvertToParams(search: dataResultSearch): string {
  return new URLSearchParams({
    end: search.end,
    init: search.init,
    modo: search.modo as string
  } as unknown as any).toString()
}