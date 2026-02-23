import { IMarker as Mrk } from "@/lib/db-types";
import { createMinute, deleteMarker, getAllMinutes, getMarker, Minute, updateMarker } from "@/lib/map-actions";
import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { UserSession } from "@/lib/session-user";
import { Button } from "./ui/button";
import { Info, LogOut, PlusCircle, Save, Trash2 } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { FormMinute, MinuteCard } from "./minute-components";
import { MapContainer, TileLayer, Marker, Popup, MapContainerProps, useMapEvents, useMap, MarkerProps } from "react-leaflet";
import L, { extend, LatLngExpression } from 'leaflet'; // ¡Importa Leaflet aquí!
import { toast } from "sonner";

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