"use client"
import { MapContainer, TileLayer, Popup, useMap } from "react-leaflet";
import React, { useEffect, useRef, useState } from "react";
import L, { LatLngExpression } from 'leaflet'; // ¡Importa Leaflet aquí!
import { ContextMenu, ContextMenuItem, ContextMenuTrigger, ContextMenuContent } from "./ui/context-menu";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { IMarker } from "@/lib/db-types";
import { createMarker, getAllMarkers, Marker as Mrk } from "@/lib/map-actions";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { getSession, logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import type { RootFilterQuery } from "mongoose";
import { InputCalendar } from "./input-calendar";
import { HTML, range } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import ConfigPage from "./config-page";
import ButtonFloat from "./button-float";
import { CustomMarker, MarkerData } from "./marker-components";
import Estadisticas from "./estadisticas/estadisticas";

// Opcional: Lógica para corregir los íconos predeterminados si aún los necesitas o para evitar conflictos
// (Si solo usas íconos personalizados, esta parte podría ser menos crítica,
// pero a menudo es buena tenerla para evitar problemas genéricos de Leaflet en Next.js)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'leaflet/dist/images/marker-icon-2x.png',
    iconUrl: 'leaflet/dist/images/marker-icon.png',
    shadowUrl: 'leaflet/dist/images/marker-shadow.png',
});



const position: LatLngExpression = [10.15114, -64.68162];




const yearRange = [2000, 2050]

export interface SearchParametersProps {
    initialFilterTime: Date;
    dueFilterTime: Date;
    title: string;
    description: string;

}

interface propsDialogSearchParameters extends HTML {
    onSearch: (SearchParameters: SearchParametersProps) => void;

}

export function DialogSearchParameters({ onSearch }: propsDialogSearchParameters) {

}





export function MainPage() {
    const [markers, setMarkers] = useState<Mrk[]>([]); // Estado para guardar las posiciones de los marcadores
    const [globalMap, setGlobalMap] = useState<L.Map | null>(null);

    const [TypeFilterTime, setTypeFilterTime] = useState<"mouth" | "day" | "period" | "year" | "all">("day")
    const thisDate = new Date();
    const [initialFilterTime, setInitialFilterTime] = useState<Date>(new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate(), 0, 0, 0, 0));
    const [dueFilterTime, setDueFilterTime] = useState<Date>(new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate() + 1, 0, 0, 0, 0));

    const [mouthFilter, setMouthFilter] = useState(thisDate.getMonth());
    const [yearFilter, setYearFilter] = useState(thisDate.getFullYear());


    const clickedLatLngRef = useRef<L.LatLng | null>(null);
    const route = useRouter()

    const [createMarkerDialogOpen, setCreateMarkerDialogOpen] = useState(false);
    const [searchDialogOpen, setSearchDialogOpen] = useState(false);

    const [searchForTitle, setSearchForTitle] = useState("");
    // Estado para la visibilidad del menú contextual

    function setPeriodByMonthAndYear() {

        let start: Date, end: Date;

        if (TypeFilterTime === "mouth") {
            // Toma los valores actuales de mouthFilter y yearFilter del estado
            start = new Date(yearFilter, mouthFilter, 1, 0, 0, 0, 0);
            // El final es el último día del mes, a las 23:59:59.999
            end = new Date(yearFilter, mouthFilter + 1, 0, 23, 59, 59, 999);

            setInitialFilterTime(start);
            setDueFilterTime(end);
        } else if (TypeFilterTime === "year") {
            // Toma los valores actuales de mouthFilter y yearFilter del estado
            start = new Date(yearFilter, 0, 1, 0, 0, 0, 0);
            // El final es el último día del mes, a las 23:59:59.999
            end = new Date(yearFilter + 1, 0, 1, 0, 0, 0, 0);

            setInitialFilterTime(start);
            setDueFilterTime(end);
        }


        // loadData();
    }

    async function loadData() {
        const user = await getSession();

        if (!user) {
            route.push("/")
        }

        let filterMarker: RootFilterQuery<Mrk> = {};


        if (TypeFilterTime !== "all") {

            filterMarker = {
                ...filterMarker,
                report_date: {
                    $gte: initialFilterTime,
                    $lte: dueFilterTime
                }
            }
        }




        const Markers = await getAllMarkers(filterMarker);
        if (Markers.result) {
            setMarkers(Markers.result)

        }
    }

    useEffect(() => {
        loadData()
    }, [])

    // useEffect(() => {
    //     loadData()
    // }, [initialFilterTime, dueFilterTime, TypeFilterTime])

    useEffect(() => {
        setPeriodByMonthAndYear();
    }, [yearFilter, mouthFilter, TypeFilterTime])

    function HandlerMap() {
        const map = useMap(); // Obtiene la instancia de Leaflet Map
        // setGlobalMap(map)

        useEffect(() => {
            // Para cerrar el menú si el mapa se mueve o hace zoom
            const closeMenuOnMapInteraction = () => {

            };

            setGlobalMap(map)
            map.on('moveend', closeMenuOnMapInteraction);
            map.on('zoomend', closeMenuOnMapInteraction);

            return () => {
                map.off('moveend', closeMenuOnMapInteraction);
                map.off('zoomend', closeMenuOnMapInteraction);
            };
        }, [map]); // Dependencia: la instancia del mapa

        return null;
    }

    const handleContextMenu = (event: React.MouseEvent) => {

        // Es crucial que el MapContainer tenga un ID para que L.DomUtil.get funcione
        const mapContainer = L.DomUtil.get('map-container');
        if (!mapContainer) return;

        // Obtener las coordenadas del píxel del clic dentro del contenedor del mapa
        const mapBounds = mapContainer.getBoundingClientRect();
        const x = event.clientX - mapBounds.left;
        const y = event.clientY - mapBounds.top;

        // Crear un punto de píxel de Leaflet
        const pixelPoint = L.point(x, y);

        // Obtener la instancia del mapa usando useMap y un ref para asegurarse de que esté disponible
        const map = globalMap; // Acceso directo al objeto Leaflet Map
        // (Esto es un hack; la forma recomendada es useMap())


        if (map) {
            // Convertir las coordenadas de píxel a coordenadas LatLng del mapa
            const latlng = map.containerPointToLatLng(pixelPoint);
            clickedLatLngRef.current = latlng;
        }

        // El `onOpenChange` del ContextMenu raíz controlará el `setIsContextMenuOpen(true)`
        // aquí no es necesario llamarlo explícitamente.
    };

    const handleAddPoint = async (subject: string, description: string, reference: string) => {
        if (clickedLatLngRef.current) {
            const newPosition: IMarker = {
                lat: clickedLatLngRef.current.lat,
                lng: clickedLatLngRef.current.lng,
                report_date: new Date(),
                subject,
                description,
                reference
            };

            const result = await createMarker(newPosition);

            if (result.success) {

                await loadData()
                clickedLatLngRef.current = null; // Limpiar después de usar
            }


            // setMarkers((prevMarkers) => [...prevMarkers, newPosition]);
        }
        // El ContextMenu se cerrará automáticamente al hacer clic en un ContextMenuItem
    };

    return (
        <div className="w-screen h-screen ag-theme-quartz-dark">
            <div>
                <ContextMenu>
                    <ContextMenuTrigger onContextMenu={handleContextMenu}>
                        <MapContainer id="map-container" center={position} zoom={13} className="z-0 h-screen w-screen fixed left-0 top-0">
                            <TileLayer
                                // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                            // className="invert"

                            />

                            <HandlerMap />

                            {markers.map((marker, idx) => {


                                return (
                                    <CustomMarker key={idx} position={[marker.lat, marker.lng] as L.LatLngExpression}> {/* Usa tu icono personalizado o el predeterminado */}
                                        <Popup className="w-max">

                                            {/* Marcador en: <br /> Lat: {marker.lat.toFixed(4)}, Lng: {marker.lng.toFixed(4)} */}
                                            <MarkerData {...marker} onDelete={() => loadData()} onUpdate={() => loadData()} />
                                        </Popup>
                                    </CustomMarker>
                                )
                            }
                            )}

                        </MapContainer>
                    </ContextMenuTrigger>
                    <ContextMenuContent onContextMenu={x => x.preventDefault()}>
                        <ContextMenuItem
                            // onClick={handleAddPoint}
                            onClick={() => { setCreateMarkerDialogOpen(true) }}
                        >
                            Crear marca aquí
                        </ContextMenuItem>

                    </ContextMenuContent>
                </ContextMenu>
            </div>
            <Dialog onOpenChange={setCreateMarkerDialogOpen} open={createMarkerDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={async (e) => {
                        e.preventDefault();

                        const _FormData = new FormData(e.target as HTMLFormElement)

                        const subject = _FormData.get("subject") as string;
                        const description = _FormData.get("description") as string;
                        const reference = _FormData.get("reference") as string;
                        await handleAddPoint(subject, description, reference);
                        setCreateMarkerDialogOpen(false);

                    }}>
                        <DialogHeader>
                            <DialogTitle>Crea una marca</DialogTitle>
                            <DialogDescription>
                                crea una marca para colocar tus reportes de riesgos en este lugar
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="name-1">Asunto</Label>
                                <Input required id="subject" name="subject" defaultValue="Nueva marca" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="username-1">Descripción</Label>
                                <Input id="description" name="description" defaultValue="" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="username-1">Punto de referencia</Label>
                                <Input id="reference" name="reference" defaultValue="" />
                            </div>

                        </div>
                        <DialogFooter className="mt-7">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Guardar</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="
            fixed left-12 top-0 mt-2.5 min-h-16 border 
            bg-accent text-accent-foreground border-gray-500 
            z-10 flex flex-row flex-wrap justify-between rounded-2xl"
                style={{
                    width: "calc(100vw - 3.5rem)"
                }}>
                <div className="
                min-h-16 h-auto w-full lg:max-w-[480px] border flex flex-row 
                flex-wrap p-2 items-center
                ">
                    <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
                        <DialogTrigger asChild>
                            <Button >
                                <LucideIcons.Search />
                                Buscar...
                            </Button>

                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Buscar...
                                </DialogTitle>
                                <DialogDescription>
                                    Ajusta los parametros de búsqueda
                                </DialogDescription>
                            </DialogHeader>
                            <h1>
                                Tiempo
                            </h1>
                            <div className="w-full">
                                <Select value={TypeFilterTime} onValueChange={x => setTypeFilterTime(x as any)} >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Periodo no definido" className="w-auto" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Periodo</SelectLabel>
                                            <SelectItem value="day">Por Fecha</SelectItem>
                                            <SelectItem value="mouth">Por Mes</SelectItem>
                                            <SelectItem value="year">Por Año</SelectItem>
                                            <SelectItem value="period">Por Periodo</SelectItem>
                                            <SelectItem value="all">Todo</SelectItem>
                                            {/* <SelectItem value="period">Por Periodo</SelectItem> */}

                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <div className="flex w-full gap-2 my-2 *:space-y-2">
                                    {
                                        TypeFilterTime === "day" &&
                                        <>
                                            <div>
                                                <Label>
                                                    Fecha:
                                                </Label>
                                                <InputCalendar defaultValue={thisDate} onChangeValue={x => { //Busca el bug de la comparacion de fechas (-1 dia)

                                                    setInitialFilterTime(x);


                                                    // const final = new Date(
                                                    //     x.getFullYear(),
                                                    //     x.getMonth(),
                                                    //     x.getDate(),
                                                    //     23, 59, 59, 999
                                                    // )

                                                    const final = new Date(x);
                                                    final.setDate(final.getDate() + 1);



                                                    setDueFilterTime(
                                                        final
                                                    );

                                                    // loadData();
                                                }} />

                                            </div>
                                        </>
                                    }

                                    {
                                        TypeFilterTime === "mouth" &&
                                        <>
                                            <div>
                                                <Label>
                                                    Año:
                                                </Label>
                                                <Select defaultValue={yearFilter + ""} onValueChange={x => { setYearFilter(parseInt(x)) }}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Año" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>

                                                            {
                                                                range(yearRange[0], yearRange[1]).map(x => {


                                                                    return (
                                                                        <SelectItem key={x} value={x + ""}>{x}</SelectItem>
                                                                    )
                                                                })
                                                            }
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>

                                            </div>
                                            <div>
                                                <Label>
                                                    Mes:
                                                </Label>
                                                <Select defaultValue={mouthFilter + ""} onValueChange={x => { setMouthFilter(parseInt(x)) }}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Mes" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>

                                                            {
                                                                [
                                                                    "Enero",
                                                                    "Febrero",
                                                                    "Marzo",
                                                                    "Abril",
                                                                    "Mayo",
                                                                    "Junio",
                                                                    "Julio",
                                                                    "Agosto",
                                                                    "Septiembre",
                                                                    "Octubre",
                                                                    "Noviembre",
                                                                    "Diciembre"
                                                                ].map((x, i) => {


                                                                    return (
                                                                        <SelectItem key={x} value={i + ""}>{x}</SelectItem>
                                                                    )
                                                                })
                                                            }
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>

                                            </div>
                                        </>
                                    }

                                    {
                                        TypeFilterTime === "year" &&
                                        <>
                                            <div>
                                                <Label>
                                                    Año:
                                                </Label>
                                                <Select defaultValue={yearFilter + ""} onValueChange={x => { setYearFilter(parseInt(x)) }}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Año" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>

                                                            {
                                                                range(yearRange[0], yearRange[1]).map(x => {


                                                                    return (
                                                                        <SelectItem key={x} value={x + ""}>{x}</SelectItem>
                                                                    )
                                                                })
                                                            }
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>

                                            </div>
                                        </>
                                    }

                                    {
                                        TypeFilterTime === "period" &&
                                        <>
                                            <div>
                                                <Label>
                                                    Fecha de inicio:
                                                </Label>
                                                <InputCalendar defaultValue={initialFilterTime} onChangeValue={x => setInitialFilterTime(x)} />

                                            </div>

                                            <div>
                                                <Label>
                                                    Fecha final:
                                                </Label>
                                                <InputCalendar defaultValue={dueFilterTime} onChangeValue={x => setDueFilterTime(new Date(
                                                    x.getFullYear(),
                                                    x.getMonth(),
                                                    x.getDate(),
                                                    23, 59, 59, 999
                                                ))} />

                                            </div>
                                        </>
                                    }

                                </div>
                            </div>
                            <hr />
                            <h1>
                                Titulo o descripción
                            </h1>
                            <div className="w-full flex gap-2 my-2  *:space-y-2">
                                <Input value={searchForTitle} onChange={x => setSearchForTitle(x.target.value)} />
                            </div>
                            <DialogFooter>
                                <Button onClick={async x => {
                                    // setPeriodByMonthAndYear();
                                    await loadData()
                                    setSearchDialogOpen(false)

                                }}>
                                    <LucideIcons.Search />
                                    Buscar
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="
                min-h-16 h-auto w-full lg:max-w-[480px] border flex flex-row 
                flex-wrap p-2 items-center lg:justify-end
                ">
                    <Button onClick={async () => {

                        await logout();

                        // route.refresh();
                        window.location.href = "/";
                    }}>
                        <LogOut />
                        Cerrar sesión
                    </Button>

                </div>

            </div>

            <ButtonFloat icon="Settings" className="" size={50} bgColor="#000">
                <DialogHeader>
                    <DialogTitle>
                        Configuraciones
                    </DialogTitle>
                    <DialogDescription>
                        Panel de configuraciones, aquí puedes configurar todos los aspectos del sistema
                    </DialogDescription>
                </DialogHeader>
                <ConfigPage />
            </ButtonFloat>

            <ButtonFloat icon="Activity" className="" position={{ bottom: 100, right: 32 }} size={50} bgColor="#000" maxWidthDialog={1000}>
                <DialogHeader>
                    <DialogTitle>
                        Generador de estadísticas
                    </DialogTitle>
                    <DialogDescription>
                        Panel de generar las estadísticas y reportes del sistema
                    </DialogDescription>
                </DialogHeader>
                <Estadisticas />
            </ButtonFloat>
        </div>
    )
}






export default function MapDashboard() {
    return (
        <MainPage />
    )
}

