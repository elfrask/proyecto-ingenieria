import { Dispatch, HTMLAttributes, useEffect, useState } from "react";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { ArrowDown, ArrowUp, Pencil, PlusCircle, Save, Trash2 } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { ICustomField, IMinuteType, IOrigins, IOriginsElement, typesFields } from "@/lib/db-types";
import { caption2Name, cn, Notify } from "@/lib/utils";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent } from "./ui/tabs";
import { InputCalendar } from "./input-calendar";
import { updateMinuteType } from "@/lib/minute-actions";
import { toast } from "sonner";
import { getAllOriginElements, getAllOrigins } from "@/lib/origins-actions";
import { useSession } from "@/lib/auth-hook";

export interface MinuteTypeCardProps {
    minuteType: IMinuteType
}

export function MinuteTypeCard({ minuteType }: MinuteTypeCardProps) {
    const UserSession = useSession();

    const [Title, setTitle] = useState(minuteType.caption);
    const [fields, setFields] = useState<ICustomField[]>(minuteType.fields || [])
    const [loading, setLoading] = useState(false);

    async function save() {
        setLoading(true)

        const newMinuteType: Omit<IMinuteType, "id"> = {
            // ...minuteType,
            typeName: minuteType.typeName,
            caption: Title,
            fields,


        };

        const result = await updateMinuteType(minuteType.id, newMinuteType)

        if (result.success) {

            toast("La plantilla de minuta ha sido guardada exitosamente", { style: { color: "lime" } });
        } else {
            toast("Hubo un problema al actualizar la plantilla", { style: { color: "crimson" }, description: result.msg, richColors: true });

        }

        setLoading(false)
    }

    return (
        <Card key={minuteType.id} className="w-full">
            <CardHeader>
                <CardTitle>
                    {minuteType.caption}
                </CardTitle>
                <CardDescription>
                    codename: {minuteType.typeName} <br />
                    ID: {minuteType.id}
                </CardDescription>
            </CardHeader>
            <CardFooter className="space-x-2 flex justify-end">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button>
                            <Pencil />
                            Editar
                        </Button>

                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader className="">
                            <SheetTitle className="flex flex-row gap-2">
                                <Pencil />

                                Editor de plantilla de minuta
                            </SheetTitle>
                            <SheetDescription className="flex flex-row justify-between">
                                <span>{minuteType.typeName}</span>
                                <span>id: {minuteType.id}</span>
                            </SheetDescription>
                        </SheetHeader>
                        <div className="px-4 space-y-1">

                            <Label>Titulo</Label>
                            <Input
                                disabled={UserSession?.permission.MinuteType !== 2}
                                placeholder="Titulo"
                                value={Title}
                                onChange={y => setTitle(y.target.value)}

                            />

                        </div>
                        <hr />
                        <Card className="p-4 mx-4">
                            <Button
                                disabled={UserSession?.permission.MinuteType !== 2}
                                variant={"default"}
                                onClick={t => {
                                    setFields([...fields, {
                                        caption: "Campo sin titulo",
                                        type: "none",
                                        name: "field" + (fields.length + 1),
                                        placeholder: "",

                                    }])
                                }}>
                                <PlusCircle />
                                Crear
                            </Button>
                        </Card>
                        <div className="w-full h-auto overflow-auto">
                            {
                                fields.map((x, i) => {

                                    return (
                                        <CustomFieldMaker
                                            allFields={fields}
                                            field={x}
                                            index={i}
                                            key={x.name}
                                            setAllFields={ll => setFields(ll)}
                                            disabled={UserSession?.permission.MinuteType !== 2}


                                        />
                                    )
                                })
                            }
                        </div>
                        <SheetFooter className="w-full grid grid-cols-2 *:col-span-1">
                            <SheetClose asChild>
                                <Button variant={"outline"}>
                                    Cerrar
                                </Button>
                            </SheetClose>
                            <Button
                                disabled={loading || UserSession?.permission.MinuteType !== 2}
                                variant={"default"}
                                onClick={() => save()}>
                                <Save />
                                Guardar
                            </Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </CardFooter>

        </Card>
    )
}

export type CustomFieldValueType = Date | string | number;

export interface CustomFieldRenderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange"> {
    field: ICustomField;
    rowName: string;
    value: CustomFieldValueType;
    defaultValue: CustomFieldValueType;
    onChangeValue: (value: CustomFieldValueType, name: string) => void;
}

export function CustomFieldRender({
    field,
    onChangeValue,
    rowName,
    value,
    className,
    defaultValue,
    ...props
}: CustomFieldRenderProps) {

    value = value === undefined ? defaultValue : value;
    const [originListElements, setOriginListElements] = useState<IOriginsElement[]>([])


    async function loadListOrigins(name: string) {

        const result = await getAllOriginElements(name);

        if (result.success) {
            setOriginListElements(result.result as IOriginsElement[])
        } else {
            Notify.reject("Hubo un problema al cargar la lista", result.msg)
        }
    }

    useEffect(() => {

        if (field.origin) {
            loadListOrigins(field.origin)
        }

    }, []);

    switch (field.type) {
        case "none":

            return <></>
        case "text":

            return <Input
                className={className}
                placeholder={field.placeholder || ""}
                value={value as string}
                onChange={(x) => onChangeValue(x.target.value, field.name)}
            />
        case "number":

            return <Input
                className={className}
                placeholder={field.placeholder || ""}
                type="number"
                value={value as number}
                onChange={(x) => onChangeValue(x.target.value, field.name)}
                {
                ...(field.range !== 0 ? {
                    max: field.max,
                    min: field.min,
                } : {})
                }
            />
        case "date":

            return <InputCalendar
                className={className}
                // placeholder={field.placeholder||""} 
                // type="number"
                defaultValue={field.range === 0 ? new Date() : value as Date}
                onChangeValue={(x) => onChangeValue(x, field.name)}

            />
        case "select":

            // return <Select
            //     className={className}
            //     placeholder={field.placeholder || ""}
            //     value={value as string}
            //     onChange={(x) => onChangeValue(x.target.value, field.name)}
            // />
            return (
                <Select value={value as string} onValueChange={x => onChangeValue(x, field.name)}>
                    <SelectTrigger className={cn(className, "w-full")}>
                        <SelectValue placeholder={field.placeholder} className="w-full" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {
                                originListElements.map(t => (
                                    <SelectItem key={t.id} value={t.value}>{t.title}</SelectItem>
                                ))
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
            )

        default:
            return <>¿{field.type}?</>
    }
}


export interface CustomFieldMakerProps {
    field: ICustomField;
    allFields: ICustomField[];
    index: number;
    setAllFields: (set: ICustomField[]) => void;
    disabled?: boolean;

}

export function CustomFieldMaker(
    {
        field,
        allFields,
        index,
        setAllFields,
        disabled
    }: CustomFieldMakerProps
) {

    const i = index;
    const x = field;
    const fields = allFields;
    disabled = disabled || false;

    const isInit = i === 0;
    const isLast = fields.length === (i + 1);


    const [defaultValue, setDefaultValue] = useState(x.defaultValue);
    const [origin, setOrigin] = useState(x.origin);
    const [codeName, setCodeName] = useState(x.name);
    const [caption, setCaption] = useState(x.caption);
    const [type, setType] = useState(x.type);
    const [rangeValue, setRangeValue] = useState(x.range);

    const [min, setMin] = useState(x.min);
    const [max, setMax] = useState(x.max);

    const [originListElements, setOriginListElements] = useState<IOriginsElement[]>([])
    const [originList, setOriginList] = useState<IOrigins[]>([])

    async function loadOrigins() {

        const result = await getAllOrigins();

        if (result.success) {
            setOriginList(result.result as IOrigins[])
        } else {
            Notify.reject("Hubo un problema al cargar los orígenes", result.msg)
        }
    }

    async function loadListOrigins(name: string) {

        const result = await getAllOriginElements(name);

        if (result.success) {
            setOriginListElements(result.result as IOriginsElement[])
        } else {
            Notify.reject("Hubo un problema al cargar la lista", result.msg)
        }
    }




    useEffect(() => {

        if (origin) {
            loadListOrigins(origin)
        }

    }, [origin]);

    useEffect(() => {
        if (type === "select") {
            loadOrigins()

        }
    }, [type]);

    const RangeState = parseInt(rangeValue ? (rangeValue + "") : "0")


    return (
        <div className=" border-b-8 p-3 space-y-2">
            <div className="grid grid-cols-2 *:col-span-1 gap-2">
                <div className="flex flex-col gap-2">
                    <Label className="font-bold">
                        clave
                    </Label>
                    <Input disabled={disabled} value={codeName} onChange={(o) => {
                        x.name = caption2Name(o.target.value);

                        setCodeName(x.name);
                        // setFields(fields);
                    }} />
                </div>
                <div className="flex flex-col gap-2">
                    <Label className="font-bold">
                        Titulo
                    </Label>
                    <Input disabled={disabled} value={caption} onChange={(o) => {
                        x.caption = o.target.value;

                        setCaption(x.caption);
                        // setFields(fields);
                    }} />

                </div>
            </div>
            <div className="flex w-full">
                <Select value={type} disabled={disabled} onValueChange={o => {
                    x.type = o as any
                    x.defaultValue = undefined;
                    x.range = 0;

                    setType(x.type);
                    setDefaultValue(undefined);
                    setRangeValue(0);
                }}>
                    <SelectTrigger className="w-full">
                        <SelectValue className="w-full" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {
                                typesFields.map(k => {

                                    return (

                                        <SelectItem key={`${k.type}-${i}`} value={k.type}>
                                            {k.titleName}
                                        </SelectItem>
                                    )
                                })
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="w-full flex flex-col">
                <Label className="">
                    Propiedades:
                </Label>
                <hr className="my-4" />
                <Tabs value={x.type}>
                    <TabsContent value="text">
                        <Label className="mb-2">
                            Texto por defecto:
                        </Label>
                        <Input disabled={disabled} value={defaultValue || ""} onChange={(o) => {
                            x.defaultValue = (o.target.value);

                            setDefaultValue(x.defaultValue);
                            // setFields(fields);
                        }} />
                    </TabsContent>
                    <TabsContent value="number">
                        <Label className="mb-2">
                            Valor por defecto:
                        </Label>
                        <Input disabled={disabled} type="number" value={defaultValue || 0} onChange={(o) => {
                            x.defaultValue = (o.target.valueAsNumber);

                            // setFields([...fields]);
                            setDefaultValue(x.defaultValue);

                            // setFields(fields);
                        }} />
                        <Select disabled={disabled} value={(RangeState + "")} onValueChange={o => {
                            x.range = parseInt(o);

                            // setFields([...fields]);
                            setRangeValue(x.range);

                        }}>
                            <SelectTrigger className="my-2 w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="0">
                                        Sin limite
                                    </SelectItem>
                                    <SelectItem value="1">
                                        Rango
                                    </SelectItem>

                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div className={`
                        w-full grid grid-cols-2 *:col-span-1 *:flex *:flex-col
                        *:gap-2 gap-2 ${RangeState === 0 ? "hidden" : ""}
                        `}>
                            <div>
                                <Label className="font-bold">Min</Label>
                                <Input disabled={disabled} type="number" value={min || 0} onChange={(o) => {
                                    x.min = (o.target.valueAsNumber);

                                    setMin(x.min)
                                    // setFields(fields);
                                }} />
                            </div>
                            <div>
                                <Label className="font-bold">Max</Label>
                                <Input disabled={disabled} type="number" value={max || 0} onChange={(o) => {
                                    x.max = (o.target.valueAsNumber);

                                    setMax(x.max)
                                    // setFields([...fields]);
                                    // setFields(fields);
                                }} />
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="date">
                        <Label className="mb-2">
                            Fecha por defecto
                        </Label>
                        <Select disabled={disabled} value={(RangeState + "")} onValueChange={o => {
                            x.range = parseInt(o);

                            setRangeValue(x.range)
                        }}>
                            <SelectTrigger className="my-2 w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="0">
                                        Actual al momento de mostrar
                                    </SelectItem>
                                    <SelectItem value="1">
                                        Fecha especifica
                                    </SelectItem>

                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div className={`
                        w-full *:w-full flex flex-col gap-2   
                        ${RangeState === 0 ? "hidden" : ""}
                        `}>
                            <Label className="font-bold">Fecha por defecto:</Label>
                            <InputCalendar disabled={disabled} defaultValue={defaultValue || new Date()} onChangeValue={o => {
                                x.defaultValue = o || new Date();

                                setDefaultValue(x.defaultValue);
                            }} />
                        </div>
                    </TabsContent>
                    <TabsContent value="select">
                        <div className="
                            flex flex-col gap-2
                            *:flex *:flex-col *:gap-2
                        ">
                            <div>
                                <Label className="mb-2">
                                    Origen:
                                </Label>
                                <Select value={origin} onValueChange={(value) => {
                                    setOrigin(value);

                                    x.origin = value;
                                }}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="elije uno" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {
                                                originList.map(t => (
                                                    <SelectItem key={t.id} value={t.name}>{t.title}</SelectItem>
                                                ))
                                            }
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="mb-2">
                                    Valor por defecto:
                                </Label>
                                <Select value={defaultValue} onValueChange={(value) => {
                                    setDefaultValue(value);

                                    x.defaultValue = value;
                                }}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="elije uno" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {
                                                originListElements.map(t => (
                                                    <SelectItem key={t.id} value={t.value}>{t.title}</SelectItem>
                                                ))
                                            }
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>


                        </div>
                    </TabsContent>


                </Tabs>
            </div>
            <div className="flex flex-row w-full mt-2 justify-between">
                <div>
                    <Button disabled={disabled} className={isInit ? "hidden" : ""} variant={"outline"} onClick={() => {
                        const [n1, n2] = [allFields[i], allFields[i - 1]];

                        const newAllFields = allFields.map((l, lk) => {

                            if (lk === i) {
                                return n2
                            } else if (lk === (i - 1)) {
                                return n1
                            } else {
                                return l
                            }

                        });


                        setAllFields([...newAllFields])
                    }}>
                        <ArrowUp />
                    </Button>
                    <Button disabled={disabled} className={isLast ? "hidden" : ""} variant={"outline"} onClick={() => {
                        const [n1, n2] = [allFields[i], allFields[i + 1]];

                        const newAllFields = allFields.map((l, lk) => {

                            if (lk === i) {
                                return n2
                            } else if (lk === (i + 1)) {
                                return n1
                            } else {
                                return l
                            }

                        });


                        setAllFields([...newAllFields])

                    }}>
                        <ArrowDown />
                    </Button>


                </div>
                <div>
                    <Button disabled={disabled} variant={"destructive"} onClick={() => {
                        const newAllFields = allFields.filter((j, lk) => lk !== i);

                        setAllFields(newAllFields)

                    }}>
                        <Trash2 />
                    </Button>
                </div>
            </div>
        </div>
    )
}

