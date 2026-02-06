import { dataResultSearch } from "@/hooks/estadisticas/use-search";
import { ResponseRequest, Response } from "./utils";
import { getAllMinuteTypes } from "./minute-actions";
import { getAllMarkers, getAllMinutes } from "./map-actions";
import { ICustomField, IMarker, IMinute, IMinuteType, IOrigins, IOriginsElement } from "./db-types";
import { getAllOriginElements, getOriginById } from "./origins-actions";


export interface IMinuteEstadistica extends IMinute {
  report_date: Date
}




export interface EstadisticaResultado {

  minutes: IMinuteEstadistica[];
  markers: IMarker[];
  campo: ICustomField;
  origins: IOriginsElement[];
  tipoMinuta: IMinuteType
}


export async function getAdvanceEstadistica(
  search: dataResultSearch,
  tipo: string,
  field: string,
  mode: string = "default",

): Promise<ResponseRequest<EstadisticaResultado>> {

  try {

    const Tipo = ((await getAllMinuteTypes({ typeName: tipo }))?.result || [])[0];
    if (!Tipo) return Response(false, null, -2, "El Tipo de minuta seleccionado no existe");
    const Campo = Tipo.fields.find(x => x.name === field);
    if (!Campo) return Response(false, null, -3, "El Campo seleccionado del tipo de minuta seleccionado no existe");

    const Markers = (await getAllMarkers(search.modo === "todo" ? {} : {
      report_date: {
        $gte: new Date(search.init),
        $lte: new Date(search.end)
      },
    })).result;

    if (!Markers) return Response(false, null, -4, "Acceso denegado");

    const AllMinutes: IMinuteEstadistica[] = [];
    
    for (let i of Markers) {
      
      const Minutes = (await getAllMinutes({marker_id: i.id, type: tipo })).result;

      Minutes?.forEach(x => {
        AllMinutes.push({
          ...x,
          report_date: new Date(i.report_date)
        })
      })

    };

    let origins: IOriginsElement[] = [];
    let Seleccionados: Record<string, number> = {}

    if (Campo.type === "select") {
      let ori = (await getAllOriginElements(Campo.origin as string)).result;
      if (ori) {
        origins = ori;
        
        // for(let i of origins) {
        //   Seleccionados[i.]
        // }
      }
    }




    
    return Response(true, {
      minutes: AllMinutes,
      markers: Markers,
      campo: Campo,
      tipoMinuta: Tipo,
      origins,
    }, 0, "ok")
  } catch (error) {
    return Response(false, null, -1, "error al parseo")
    
  }
  
}