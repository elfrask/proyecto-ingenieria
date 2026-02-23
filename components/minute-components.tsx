import { deleteMinute, Minute, updateMinute } from "@/lib/map-actions";
import { ReactNode, useEffect, useState } from "react";
import { UserSession } from "@/lib/session-user";
import { Info, LogOut, Pencil, PlusCircle, Save, Trash2 } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Input } from "./ui/input";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { IMinuteType, typesFields } from "@/lib/db-types";
import { getAllMinuteTypes } from "@/lib/minute-actions";
import { toast } from "sonner";
import { CustomFieldRender, CustomFieldValueType } from "./custom-fields";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";




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

