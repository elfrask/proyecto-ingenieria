"use client"
import { MapContainer, TileLayer, Marker, Popup, MapContainerProps, useMapEvents, useMap, MarkerProps } from "react-leaflet";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import L, { extend, LatLngExpression } from 'leaflet'; // ¡Importa Leaflet aquí!
import {
    ContextMenu,
    ContextMenuItem,
    ContextMenuTrigger,
    ContextMenuContent
} from "./ui/context-menu";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { IMarker, IMinuteType } from "@/lib/db-types";
import { createMarker, createMinute, deleteMarker, deleteMinute, getAllMarkers, getAllMinutes, getMarker, getMinute, Minute, Marker as Mrk, updateMarker, updateMinute } from "@/lib/map-actions";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ArrowDown, Info, LogOut, LucideChevronDown, Pencil, PlusCircle, Route, Save, Trash2 } from "lucide-react";
// import { useRouter } from "next/router";
import { getSession } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Form } from "./ui/form";
import z from "zod";
import { toast } from "sonner";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { getAllMinuteTypes } from "@/lib/minute-actions";
import { Textarea } from "./ui/textarea";

// Opcional: Lógica para corregir los íconos predeterminados si aún los necesitas o para evitar conflictos
// (Si solo usas íconos personalizados, esta parte podría ser menos crítica,
// pero a menudo es buena tenerla para evitar problemas genéricos de Leaflet en Next.js)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'leaflet/dist/images/marker-icon-2x.png',
    iconUrl: 'leaflet/dist/images/marker-icon.png',
    shadowUrl: 'leaflet/dist/images/marker-shadow.png',
});

const IconMarker = L.icon({
    iconUrl: "/images/markers/marker-icon.png",
    shadowUrl: "leaflet/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})



const position: LatLngExpression = [10.15114, -64.68162];

export interface CustomMarkerProps extends Omit<MarkerProps, 'icon'> {
    icon?: string;
}

export function CustomMarker({ icon, ...props }: CustomMarkerProps) {


    return (
        <Marker
            icon={L.icon({
                iconUrl: `/images/markers/${icon || "marker-icon"}.png`,
                shadowUrl: "/images/marker-shadow.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
            })}
            {...props}
        >

        </Marker>
    )
}

export interface MinuteFormProps {
    minute: Minute;
    onSubmit?: (e: Minute) => void,
    children: ReactNode;
}

export function FormMinute({ minute, onSubmit, children }: MinuteFormProps) {

    const [minuteValue, setMinuteValue] = useState(minute);
    const [minuteTypes, setMinuteTypes] = useState<IMinuteType[]>([]);
    const [loadingTypes, setLoadingTypes] = useState(false);

    async function loadMinuteTypes() {
        setLoadingTypes(true);
        try {
            const result = await getAllMinuteTypes();
            if (result.success && result.result) {
                setMinuteTypes([...result.result, {
                    caption: "Simple",
                    id: 999,
                    fields: [],
                    typeName: "simple"
                }]);
            } else {
                toast("Error al cargar tipos de minutas", { description: result.msg, style: { color: "crimson" }, richColors: true });
            }
        } catch (e: any) {
            toast(e.message || "Error inesperado", {
                style: { color: "crimson" }, richColors: true,
                description: e.message || e
            });
        } finally {
            setLoadingTypes(false);
        }
    }

    useEffect(() => {
        loadMinuteTypes();
    }, []);

    return (
        <form
            className="w-full space-y-4 *:space-y-2"
            onSubmit={x => {
                x.preventDefault();

                if (onSubmit) {
                    onSubmit(minuteValue)
                }

            }}
        >

            <div>
                <Label>
                    Titulo
                </Label>
                <Input
                    required
                    placeholder="titulo" className="w-full"
                    value={minuteValue.title} onChange={x => setMinuteValue({ ...minuteValue, title: x.target.value })}
                />
            </div>
            <div>
                <Label>
                    Descripción
                </Label>
                <Textarea

                    placeholder="descripción" className="w-full resize-none h-48"
                    value={minuteValue.description} onChange={x => setMinuteValue({ ...minuteValue, description: x.target.value })}
                />
            </div>
            <div>
                <Label>
                    Tipo
                </Label>
                <Select required value={minuteValue.type} onValueChange={x => setMinuteValue({ ...minuteValue, type: x })}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="tipo de minuta" />

                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {
                                minuteTypes.map(x => {

                                    return (
                                        <SelectItem value={x.typeName} key={x.typeName}>
                                            {x.caption}
                                        </SelectItem>
                                    )
                                })
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <Label>
                Estructuras de formularios en desarrollo
            </Label>
            <div>
                {children}
            </div>
        </form>
    )
}

export interface MinuteCardProps {
    id: number;
    minute: Minute;
    onDelete?: (e: Minute) => void,
    onUpdate?: (e: Minute) => void,

}

export function MinuteCard({ id, minute, onDelete, onUpdate }: MinuteCardProps) {

    const [openSheet, setOpenSheet] = useState(false);

    return (
        <Card className="flex flex-row py-4">
            <CardHeader className="flex-1 block px-4">
                <CardTitle>
                    {minute.title}
                </CardTitle>
                <CardDescription>
                    {minute.description?.slice(0, 150)}{(minute.description?.length as number) > 150 && "..."}
                </CardDescription>
            </CardHeader>
            <div className="flex flex-col items-center p-2 space-y-2">
                <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                    <SheetTrigger asChild>
                        <Button variant={"outline"} className="w-full">
                            <Pencil />
                            Editar
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:w-[540px] flex flex-col">
                        <SheetHeader>
                            <SheetTitle>
                                Editar minuta
                            </SheetTitle>
                            <SheetDescription>
                                Aquí puedes editar el contenido de la minuta
                            </SheetDescription>

                        </SheetHeader>
                        <Card className="p-4 m-2">
                            <FormMinute minute={minute} onSubmit={async (result) => {

                                const resultado = await updateMinute(minute.id as number, {
                                    description: result.description,
                                    fields: result.fields,
                                    title: result.title,
                                    type: result.type
                                })

                                if (resultado.success) {
                                    toast("La minuta ha sido actualizada", {
                                        style: { color: "green" },
                                        richColors: true
                                    })
                                    setOpenSheet(false)
                                    if (onUpdate) {
                                        onUpdate(result)
                                    }
                                } else {
                                    toast("Hubo un problema al actualizar la minuta", {
                                        style: { color: "green" },
                                        richColors: true,
                                        description: resultado.msg
                                    })
                                }

                            }}>
                                <Button className="w-full">
                                    <Save />
                                    Guardar
                                </Button>
                            </FormMinute>

                        </Card>
                        <SheetFooter>
                            <SheetClose asChild>
                                <Button className="w-full" variant={"outline"}>
                                    <LogOut />
                                    Cancelar
                                </Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
                <Button variant={"destructive"} className="w-full" onClick={async () => {

                    const result = await deleteMinute(minute.id as number);

                    if (result.success) {
                        toast("La minuta ha sido eliminada", {
                            style: { color: "green" },
                            richColors: true
                        })
                        if (onDelete) {
                            onDelete(minute);
                        }
                    } else {
                        toast("Hubo un problema al eliminar al minuta", {
                            style: { color: "green" },
                            richColors: true,
                            description: result.msg
                        })
                    }
                }}>
                    <Trash2 />
                    Eliminar
                </Button>

            </div>
        </Card>
    )

}


export interface MkDProps extends Mrk {
    onDelete?: (e: Mrk) => void,
    onUpdate?: (e: Mrk) => void,
    // onUpdate: (e: Mrk) => void,
}

export function MarkerData({ lat, lng, report_date, description, id, reference, subject, onDelete, onUpdate }: MkDProps) {

    let DATE_REPORT: Date = new Date();

    const [openSheet, setOpenSheet] = useState(false);
    const [openSheetCreateMinute, setOpenSheetCreateMinute] = useState(false);

    const [ValueLat, setLat] = useState(lat);
    const [ValueLng, setLng] = useState(lng);
    const [ValueReportDate, setReportDate] = useState(report_date);
    const [ValueDescription, setDescription] = useState(description);
    const [ValueReference, setReference] = useState(reference);
    const [ValueSubject, setSubject] = useState(subject);

    const [Minutes, setMinutes] = useState<Minute[]>([]);
    // const [ValueId, setId] = useState(id);

    const dat: Mrk = {
        lat: ValueLat,
        lng: ValueLng,
        report_date: ValueReportDate,
        description: ValueDescription,
        id,
        reference: ValueReference,
        subject: ValueSubject
    }

    async function allLoadData() {

        const result = await getMarker(id as number);

        if (!result.success) {

            toast("No se pudo cargar la data del punto: " + subject, {
                richColors: true,
                description: result.msg,
                style: { color: "crimson" }
            });

            return null;
        }
        const marker = result.result as Mrk;

        setSubject(marker.subject);
        setDescription(marker.description);
        setReference(marker.reference);

        const MinutesResponse = await getAllMinutes({ marker_id: id });

        if (!MinutesResponse.success) {
            toast("No se pudo cargar las minutas de: " + subject, {
                richColors: true,
                description: result.msg,
                style: { color: "crimson" }
            });

            return null;
        }

        setMinutes(MinutesResponse.result as Minute[])

    }

    useEffect(() => {

        if (openSheet) {
            allLoadData();
        }

    }, [openSheet])

    if (ValueReportDate) {
        if (ValueReportDate instanceof Date) {
            DATE_REPORT = ValueReportDate;
        } else {
            DATE_REPORT = new Date(ValueReportDate)
        }
    }

    return (
        <div className="w-full flex flex-col space-x-2">
            <div className="w-full">
                <Label className="font-semibold text-lg">
                    {ValueSubject}
                </Label>
                <p className="text-gray-500 text-sm">
                    {ValueDescription}
                </p>
                <p className="text-gray-500 text-sm">
                    referencia: {ValueReference}
                </p>

                <div className="flex justify-between">
                    <Label className="font-extralight text-lg">
                        Lat: {ValueLat.toFixed(4)}
                    </Label>
                    <Label className="font-extralight text-lg ">
                        Lng: {ValueLng.toFixed(4)}
                    </Label>
                    <Label className="font-extralight text-lg">
                        {DATE_REPORT.toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                        })}
                    </Label>


                </div>
                <div className="flex flex-wrap flex-row space-x-2">
                    <Button variant={"destructive"} onClick={async () => {

                        deleteMarker(id as number)
                        if (onDelete) {
                            onDelete(dat)
                        }
                    }}>
                        <Trash2 />
                        Eliminar
                    </Button>
                    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                        <SheetTrigger asChild>
                            <Button variant={"secondary"}>
                                <Info />
                                Información
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-full sm:w-[540px] flex flex-col">
                            <SheetHeader>
                                <SheetTitle>Información detallada</SheetTitle>
                                <SheetDescription>
                                    Aquí puedes ver y gestionar el contenido de las minutas de un punto de riesgo
                                </SheetDescription>
                            </SheetHeader>
                            <div className="overflow-auto">
                                <div className="p-4">
                                    <form
                                        className="space-y-4 *:space-y-2 border-b pb-3 border-gray-500"
                                        onSubmit={x => {
                                            x.preventDefault();

                                        }}>
                                        <div>
                                            <Label>
                                                Asunto
                                            </Label>
                                            <Input
                                                placeholder="asunto" className="w-full"
                                                value={ValueSubject} onChange={x => setSubject(x.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label>
                                                Descripción
                                            </Label>
                                            <Input
                                                placeholder="descripción" className="w-full"
                                                value={ValueDescription} onChange={x => setDescription(x.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label>
                                                Punto de referencia
                                            </Label>
                                            <Input
                                                placeholder="punto de referencia" className="w-full"
                                                value={ValueReference} onChange={x => setReference(x.target.value)}
                                            />
                                        </div>

                                    </form>

                                </div>
                                <div className="p-4 h-auto overflow-hidden space-y-3">

                                    {/* <div className="w-full h-full overflow-auto flex flex-col"> */}

                                    <Sheet open={openSheetCreateMinute} onOpenChange={setOpenSheetCreateMinute}>
                                        <SheetTrigger asChild>
                                            <Button variant={"default"} className="w-full">
                                                <PlusCircle />
                                                Crear minuta
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent className="w-full sm:w-[540px] flex flex-col">
                                            <SheetHeader>
                                                <SheetTitle>
                                                    Crear minuta
                                                </SheetTitle>
                                                <SheetDescription>
                                                    Aquí puedes crear la minuta
                                                </SheetDescription>

                                            </SheetHeader>
                                            <Card className="p-4 m-2">
                                                <FormMinute minute={{}} onSubmit={async (result) => {


                                                    const resultado = await createMinute({
                                                        description: result.description,
                                                        fields: result.fields,
                                                        marker_id: id,
                                                        title: result.title,
                                                        type: result.type
                                                    });

                                                    if (resultado.success) {
                                                        allLoadData();
                                                        setOpenSheetCreateMinute(false);

                                                    } else {
                                                        toast("No se pudo crear la minuta:", {
                                                            richColors: true,
                                                            style: { color: "crimson" }
                                                        })
                                                    }


                                                }}>
                                                    <Button className="w-full">
                                                        <Save />
                                                        Guardar
                                                    </Button>
                                                </FormMinute>

                                            </Card>
                                            <SheetFooter>
                                                <SheetClose asChild>
                                                    <Button className="w-full" variant={"outline"}>
                                                        <LogOut />
                                                        Cancelar
                                                    </Button>
                                                </SheetClose>
                                            </SheetFooter>
                                        </SheetContent>
                                    </Sheet>
                                    {
                                        Minutes.map(x => {


                                            return (
                                                <MinuteCard
                                                    id={x.id as number} minute={x} key={x.id}
                                                    onDelete={(x) => allLoadData()}
                                                    onUpdate={(x) => allLoadData()}
                                                />
                                            )
                                        }).reverse()
                                    }
                                    {/* </div> */}

                                </div>
                            </div>
                            <SheetFooter>
                                <Button className="w-full" variant={"default"} onClick={async () => {

                                    const result = await updateMarker(id as number, {
                                        reference: ValueReference,
                                        description: ValueDescription,
                                        subject: ValueSubject
                                    })

                                    if (result.success) {
                                        toast("La marca ha sido actualizada", {
                                            style: { color: "green" },
                                            richColors: true
                                        })
                                        if (onUpdate) {
                                            onUpdate(dat);
                                        }
                                    } else {
                                        toast("Hubo un problema al actualizar la marca", {
                                            style: { color: "green" },
                                            richColors: true,
                                            description: result.msg
                                        })
                                    }
                                }}>
                                    <Save />
                                    Guardar cambios
                                </Button>
                                <SheetClose asChild>
                                    <Button className="w-full" variant={"outline"}>
                                        <LogOut />
                                        Cancelar
                                    </Button>
                                </SheetClose>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>

            </div>
        </div>
    )
}



export function MainPage() {
    const [markers, setMarkers] = useState<Mrk[]>([]); // Estado para guardar las posiciones de los marcadores
    const [globalMap, setGlobalMap] = useState<L.Map | null>(null);

    const clickedLatLngRef = useRef<L.LatLng | null>(null);
    const route = useRouter()

    const [createMarkerDialogOpen, setCreateMarkerDialogOpen] = useState(false)
    // Estado para la visibilidad del menú contextual

    async function loadData() {
        const user = await getSession();

        if (!user) {
            route.push("/")
        }

        const Markers = await getAllMarkers({});
        if (Markers.result) {
            setMarkers(Markers.result)

        }
    }

    useEffect(() => {
        loadData()
    }, [])

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


        // console.log("latlng", x, y, map)
        if (map) {
            // Convertir las coordenadas de píxel a coordenadas LatLng del mapa
            const latlng = map.containerPointToLatLng(pixelPoint);
            clickedLatLngRef.current = latlng;
            // console.log(latlng)
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
            // console.log('Nuevo marcador añadido en:', newPosition);
        }
        // El ContextMenu se cerrará automáticamente al hacer clic en un ContextMenuItem
    };

    return (
        <div className="w-screen h-screen">
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
                                // console.log(marker)


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
                        // console.log({subject, description, reference})
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

            <div className="fixed left-12 top-0 mt-2.5 h-16 border border-gray-500 z-10" style={{
                width: "calc(100vw - 3.5rem)"
            }}>

            </div>
        </div>
    )
}

export default function MapDashboard() {
    return (
        <MainPage />
    )
}

