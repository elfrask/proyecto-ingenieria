"use client"
import React, { useEffect, useRef, useState } from "react";
import type { LatLngExpression } from 'leaflet'; // ¡Importa Leaflet aquí!
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
import Estadisticas from "./estadisticas/estadisticas";
import dynamic from "next/dynamic";
import Loading from "./loading-page";
import { useSession } from "@/lib/auth-hook";
import usePlatform from "@/hooks/use-platform";

// Opcional: Lógica para corregir los íconos predeterminados si aún los necesitas o para evitar conflictos
// (Si solo usas íconos personalizados, esta parte podría ser menos crítica,
// pero a menudo es buena tenerla para evitar problemas genéricos de Leaflet en Next.js)




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



const MapComponent = dynamic(() => import("@/components/map-component"), {
    loading: () => <Loading />,
    ssr: false,
});






export function MainPage() {

    const UserSession = useSession();
    const platform = usePlatform();
    const [markers, setMarkers] = useState<Mrk[]>([]); // Estado para guardar las posiciones de los marcadores
    const [globalMap, setGlobalMap] = useState<L.Map | null>(null);

    // console.log(platform)

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
                <MapComponent
                    loadData={loadData}
                    markers={markers}
                    position={position}
                    setCreateMarkerDialogOpen={setCreateMarkerDialogOpen}
                    clickedLatLngRef={clickedLatLngRef}
                    globalMap={globalMap}
                    setGlobalMap={setGlobalMap}
                />

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
            {
                (!platform.isAndroid) && (platform.current !== "loading") &&
                <>
                    {
                        UserSession?.permission.GeneralConfigs === 2 &&
                        <ButtonFloat icon="Settings" className="" size={50} position={{ bottom: 100, right: 32 }} bgColor="#000">
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
                    }

                    <ButtonFloat icon="Activity" className="" size={50} bgColor="#000" maxWidthDialog={1000}>
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
                
                </>
            }
        </div>
    )
}






export default function MapDashboard() {
    return (
        <MainPage />
    )
}

