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
import { IMarker, IMinuteType, typesFields } from "@/lib/db-types";
import { createMarker, createMinute, deleteMarker, deleteMinute, getAllMarkers, getAllMinutes, getMarker, getMinute, Minute, Marker as Mrk, updateMarker, updateMinute } from "@/lib/map-actions";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ArrowDown, Info, LogOut, LucideChevronDown, Pencil, PlusCircle, Route, Save, Trash2 } from "lucide-react";
// import { useRouter } from "next/router";
import { getSession, logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Form } from "./ui/form";
import z from "zod";
import { toast } from "sonner";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { getAllMinuteTypes } from "@/lib/minute-actions";
import { Textarea } from "./ui/textarea";
import type { RootFilterQuery } from "mongoose";
import { Calendar } from "./ui/calendar";
import { InputCalendar } from "./input-calendar";
import { HTML, range } from "@/lib/utils";
// import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
// import { Button } from "./ui/button";
// import React, { ReactNode, useState } from "react";
import * as LucideIcons from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import ConfigPage from "./config-page";
import ButtonFloat from "./button-float";
import { CustomFieldRender, CustomFieldValueType } from "./custom-fields";

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

const UserSession = await getSession();

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
    const [TypeInstance, setTypeInstance] = useState<IMinuteType | null>(null)

    // const TypeInstance = minuteValue.type

    useEffect(() => {
        minuteTypes.forEach(x => {
            if (x.typeName === minuteValue.type) {
                setTypeInstance(x)
            };
        });
    }, [minuteValue.type, minuteTypes])

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

    function setFieldData(value: CustomFieldValueType, NAME: string, type: (typeof typesFields)[number]["type"]) {

        setMinuteValue({
            ...minuteValue,
            fields: {
                ...minuteValue.fields,
                [NAME]: value,
            }
        })
    }

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
                    disabled={UserSession?.permission.Minute !== 2}
                    placeholder="titulo" className="w-full"
                    value={minuteValue.title} onChange={x => setMinuteValue({ ...minuteValue, title: x.target.value })}
                />
            </div>
            <div>
                <Label>
                    Descripción
                </Label>
                <Textarea
                    disabled={UserSession?.permission.Minute !== 2}

                    placeholder="descripción" className="w-full resize-none h-48"
                    value={minuteValue.description} onChange={x => setMinuteValue({ ...minuteValue, description: x.target.value })}
                />
            </div>
            <div>
                <Label>
                    Tipo
                </Label>
                <Select
                    disabled={UserSession?.permission.Minute !== 2}
                    required
                    value={minuteValue.type}
                    onValueChange={x => setMinuteValue({ ...minuteValue, type: x })}
                >
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
            <div>
                {
                    TypeInstance?.fields.map((x, i) => {

                        const value = (minuteValue?.fields || {})[x.name];

                        return (
                            <div className="space-y-2">
                                <Label className="font-bold">
                                    {x.caption}
                                </Label>
                                <CustomFieldRender
                                    field={x}
                                    rowName={x.name}
                                    value={value}
                                    onChangeValue={(val, NAME) => {
                                        setFieldData(val, NAME, x.type)
                                    }}
                                    defaultValue={x.defaultValue}


                                />
                            </div>
                        )
                    })
                }
            </div>
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
                        <div className="w-full h-auto overflow-auto">

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
                                    <Button 
                                    disabled={UserSession?.permission.Minute !== 2}
                                    className="w-full">
                                        <Save />
                                        Guardar
                                    </Button>
                                </FormMinute>

                            </Card>
                        </div>
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

                <Button
                    disabled={UserSession?.permission.Minute !== 2}
                    variant={"destructive"}
                    className="w-full"
                    onClick={async () => {

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

        const MinutesResponse = await getAllMinutes({ marker_id: id }, {});

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
                    {
                        UserSession?.permission.Markers === 2 ?
                            <Button variant={"destructive"} onClick={async () => {

                                deleteMarker(id as number)
                                if (onDelete) {
                                    onDelete(dat)
                                }
                            }}>
                                <Trash2 />
                                Eliminar
                            </Button>
                            : []
                    }

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
                                                disabled={UserSession?.permission.Markers !== 2}
                                                placeholder="asunto" className="w-full"
                                                value={ValueSubject} onChange={x => setSubject(x.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label>
                                                Descripción
                                            </Label>
                                            <Input
                                                disabled={UserSession?.permission.Markers !== 2}
                                                placeholder="descripción" className="w-full"
                                                value={ValueDescription} onChange={x => setDescription(x.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label>
                                                Punto de referencia
                                            </Label>
                                            <Input
                                                disabled={UserSession?.permission.Markers !== 2}
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
                                            <Button
                                                disabled={UserSession?.permission.Minute !== 2}

                                                variant={"default"}
                                                className="w-full">
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
                                            <div className="w-full overflow-auto h-auto">
                                                <Card className="p-4 m-2">
                                                    <FormMinute minute={{ fields: {} }} onSubmit={async (result) => {


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
                                            </div>
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
                                <Button 
                                disabled={UserSession?.permission.Markers !== 2}
                                className="w-full" variant={"default"} onClick={async () => {

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

export function DialogSearchParameters({onSearch}: propsDialogSearchParameters) {
    
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

    const [createMarkerDialogOpen, setCreateMarkerDialogOpen] = useState(false)
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

    useEffect(() => {
        loadData()
    }, [initialFilterTime, dueFilterTime, TypeFilterTime])

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
                    <Dialog >
                        <DialogTrigger>
                            <Button >
                                <LucideIcons.Search />
                                Buscar...
                            </Button>

                        </DialogTrigger>
                    </Dialog>
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
                    <div className="flex h-auto w-auto pl-3 flex-row space-x-2 *:space-y-1">
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
                <div className="
                min-h-16 h-auto w-full lg:max-w-[480px] border flex flex-row 
                flex-wrap p-2 items-center lg:justify-end
                ">
                    <Button onClick={async () =>  {

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
                <ConfigPage>

                </ConfigPage>
            </ButtonFloat>
        </div>
    )
}






export default function MapDashboard() {
    return (
        <MainPage />
    )
}

