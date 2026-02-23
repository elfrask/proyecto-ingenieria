import { FunctionComponent, useEffect, useState } from "react";
import { LinkElement, LinkSectionsItemElement, LinkSectionsItemProps } from "./config-page";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { IOrigins, IOriginsElement } from "@/lib/db-types";
import { caption2Name, Notify } from "@/lib/utils";
import { createOrigin, createOriginElement, getAllOriginElements, getAllOrigins, updateOrigin, updateOriginElement } from "@/lib/origins-actions";
import { Button } from "./ui/button";
import { Save, SaveAll } from "lucide-react";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";


export const OriginStringsOptions: LinkSectionsItemProps[] = [
    LinkSectionsItemElement(
        "Orígenes",
        "Aquí puedes crear los grupos de listas",
        ({ isOpen }) => {
            return <OriginsPages />
        }
    ),
    LinkSectionsItemElement(
        "Elementos y datos seleccionables",
        "Aquí puedes modificar las listas de estos grupos para su posterior uso",
        ({ isOpen }) => {

            const [originsNames, setOriginsNames] = useState<IOrigins[]>([])

            async function load() {
                setOriginsNames([])
                const result = await getAllOrigins();


                if (result.success) {

                    setOriginsNames(
                        result.result as IOrigins[]
                    );

                } else {
                    console.error(result.msg);
                    toast("Hubo un error al cargar los orígenes", {
                        style: {
                            color: "crimson"
                        },
                        description: result.msg,
                        richColors: true
                    })
                }
            }

            useEffect(() => {
                load()
            }, []);


            return (
                <div className="w-full">
                    <div className="
                    w-full h-max overflow-auto flex flex-col space-y-2
                    *:w-full *:flex *:justify-between *:border-b
                    *:hover:bg-accent *:text-white p-4
                    ">
                        {
                            originsNames.map(x => {

                                return (
                                    <LinkElement 
                                        title={x.title} 
                                        disabled={x.disabled} 
                                        description={""} 
                                        content={() => {
                                            return <ListOriginsPages origin={x} />
                                        }} 
                                    />
                                )
                            })
                        }
                    </div>
                </div>
            )
        }
    ),
];






export interface ListOriginsPagesProps {
    origin: IOrigins
}


const ListOriginsPages: FunctionComponent<ListOriginsPagesProps> = ({
    origin
}) => {

    const [newTitleName, setNewTitleName] = useState("");
    const [newValueName, setNewValueName] = useState("");
    const [newPeso, setNewPeso] = useState(0);

    const [originsElements, setOriginsElements] = useState<IOriginsElement[]>([])

    async function loadData() {
        setOriginsElements([])
        const result = await getAllOriginElements(origin.name);


        if (result.success) {

            setOriginsElements(
                result.result as IOriginsElement[]
            );

        } else {

            Notify.reject("Hubo un error al cargar esta lista", result.msg);
        }

    }

    async function createElement() {

        const title = newTitleName;
        const value = newValueName;
        const peso = newPeso;

        if (!title) {
            Notify.reject("Hubo un error al crear esta elemento.", "Debes de colocar un nombre para el elemento.")
            return null
        };
        
        if (!value) {
            Notify.reject("Hubo un error al crear esta elemento.", "Debes de colocar un nombre identificador para el elemento.")
            return null
        };
        
        if (isNaN(peso)) {
            Notify.reject("Hubo un error al crear esta elemento.", "El peso asignado no es valido")
            return null
        };

        if (originsElements.map(x=>x.value).includes(value)) {
            Notify.reject("Hubo un error al crear esta elemento.", "no puede haber nombres identificadores duplicados en esta lista.")
            return null
        }
        


        const result = await createOriginElement({
            disabled: false,
            title,
            peso,
            value,
            origins: origin.name
        })

        if (result.success) {

            Notify.success("El elemento ha sido creado correctamente");

            loadData();
            setNewTitleName("")
            setNewValueName("")
            setNewPeso(0);

        } else {
            Notify.success("Hubo un error al crear la lista.", result.msg, true);

        }


    }

    useEffect(() => {
        loadData()
    }, []);

    return (
        <div className="p-4 overflow-auto h-auto">
            <Card>
                <CardHeader>
                    <CardTitle>
                        Crear grupos de listas
                    </CardTitle>
                </CardHeader>
                <CardContent className="
                    flex flex-col gap-2 
                    *:flex *:flex-col *:gap-2
                ">
                    <div>
                        <Label>Titulo</Label>
                        <Input value={newTitleName} onChange={x => setNewTitleName(x.target.value)} />
                    </div>
                    <div>
                        <Label>Valor</Label>
                        <Input value={newValueName} onChange={x => setNewValueName(x.target.value)} />
                    </div>
                    <div>
                        <Label>Peso</Label>
                        <Input type="number" value={newPeso} onChange={x => setNewPeso(x.target.valueAsNumber)} />
                    </div>
                    
                </CardContent>
                <CardFooter>
                    <Button onClick={() => createElement()}>
                        <Save />
                        Crear
                    </Button>
                </CardFooter>
            </Card>
            <hr className="my-2" />
            <div className="w-full space-y-2">
                {
                    originsElements.map((x, i) => {

                        return <OriginElementCard
                            origin={origin} key={i}
                            onReload={loadData}
                            element={x} originsElements={originsElements}
                        />
                    })
                }
            </div>
        </div>
    );
}





interface OriginCardProps {
    origin: IOrigins;
    onReload: () => void;
}

interface OriginCardElementProps {
    origin: IOrigins;
    element: IOriginsElement;
    onReload: () => void;
    originsElements: IOriginsElement[];
}



export const OriginElementCard: FunctionComponent<OriginCardElementProps> = ({
    onReload, origin, element, originsElements
}) => {
    const [title, setTitle] = useState(element.title);
    const [value, setValue] = useState(element.value);
    const [peso, setPeso] = useState(element.peso);
    const [dis, setDis] = useState(element.disabled);
    const [isChanged, setIC] = useState(false);

    async function save() {


        if (!title) {
            Notify.reject("Hubo un error al guardar esta elemento.", "Debes de colocar un nombre para el elemento.")
            return null
        };
        
        if (!value) {
            Notify.reject("Hubo un error al guardar esta elemento.", "Debes de colocar un nombre identificador para el elemento.")
            return null
        };
        
        if (isNaN(peso)) {
            Notify.reject("Hubo un error al guardar esta elemento.", "El peso asignado no es valido")
            return null
        };

        const t = originsElements.map(x=>x.value);
        let a = -1;

        t.forEach(x=> { if (x === value) a = a + 1 })

        if (a > 0) {
            Notify.reject("Hubo un error al guardar esta elemento.", "no puede haber nombres identificadores duplicados en esta lista.")
            return null
        }

        const result = await updateOriginElement(element.id as number, {
            ...element,
            disabled: dis,
            title,
            value,
            peso,
            _id: undefined,

        } as any)

        if (result.success) {
            Notify.success("Se ha actualizado el elemento correctamente");
            onReload()
        } else {
            Notify.reject("Hubo un error al actualizar el elemento", result.msg, true);
        }
    }


    useEffect(() => {
        setIC(true)

        if (element.title !== title) return;
        if (element.disabled !== dis) return;
        if (element.peso !== peso) return;
        if (element.value !== value) return;

        setIC(false)
    }, [title, dis, peso, value]);

    return (
        <div className="
            w-full border-t grid
        ">
            <div className="w-full py-2 text-gray-500">
                id: {element.id}
            </div>
            <div className="
                w-full grid grid-cols-2 gap-2 
                *:flex *:flex-col *:gap-2
            ">
                <div className="col-span-2">
                    <Label>Titulo</Label>
                    <Input value={title} onChange={x => setTitle(x.target.value)} />
                </div>
                <div className="col-span-1">
                    <Label>Valor</Label>
                    <Input value={value} onChange={x => setValue(x.target.value)} />
                </div>
                <div className="col-span-1">
                    <Label>Peso</Label>
                    <Input type="number" value={peso} onChange={x => setPeso(x.target.valueAsNumber)} />
                </div>
                <div className="col-span-2">
                    <Label>Disponibilidad</Label>
                    <Select value={String(dis)} onValueChange={x => setDis(x === "true")}>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="false">Habilitado</SelectItem>
                                <SelectItem value="true">Deshabilitado</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

            </div>
            <div className="mt-2">
                {
                    isChanged &&
                    <Button onClick={save}>
                        <Save />
                        Guardar
                    </Button>
                }
            </div>
        </div>
    )
}







interface OriginCardProps {
    origin: IOrigins
    onReload: () => void;
}

export const OriginCard: FunctionComponent<OriginCardProps> = ({
    onReload, origin
}) => {
    const [title, setTitle] = useState(origin.title);
    const [dis, setDis] = useState(origin.disabled);
    const [isChanged, setIC] = useState(false);

    async function save() {

        const result = await updateOrigin(origin.id as number, {
            ...origin,
            disabled: dis,
            title: title,
            _id: undefined,
        } as any)

        if (result.success) {
            Notify.success("Se ha actualizado el origen correctamente");
            onReload()
        } else {
            Notify.reject("Hubo un error al actualizar el origen", result.msg);
        }
    }


    useEffect(() => {
        setIC(true)

        if (origin.title !== title) return;
        if (origin.disabled !== dis) return;

        setIC(false)
    }, [title, dis]);

    return (
        <div className="
            w-full border-t grid
        ">
            <div className="w-full py-2 text-gray-500">
                id: {origin.name}
            </div>
            <div className="
                w-full grid grid-cols-2 gap-2 
                *:flex *:flex-col *:gap-2 *:col-span-1
            ">
                <div>
                    <Label>Titulo</Label>
                    <Input value={title} onChange={x => setTitle(x.target.value)} />
                </div>
                <div>
                    <Label>Disponibilidad</Label>
                    <Select value={String(dis)} onValueChange={x => setDis(x === "true")}>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="false">Habilitado</SelectItem>
                                <SelectItem value="true">Deshabilitado</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

            </div>
            <div className="mt-2">
                {
                    isChanged &&
                    <Button onClick={save}>
                        <Save />
                        Guardar
                    </Button>
                }
            </div>
        </div>
    )
}

const OriginsPages: FunctionComponent = () => {

    const [newTitleName, setNewTitleName] = useState("")
    const [originsNames, setOriginsNames] = useState<IOrigins[]>([])

    async function loadData() {
        setOriginsNames([])
        const result = await getAllOrigins();


        if (result.success) {

            setOriginsNames(
                result.result as IOrigins[]
            );

        } else {
            console.error(result.msg);
            toast("Hubo un error al cargar los orígenes", {
                style: {
                    color: "crimson"
                },
                description: result.msg,
                richColors: true
            })
        }

    }

    async function createOriginF() {

        const title = newTitleName;

        if (!title) {
            toast("Hubo un error al crear esta lista.", {
                style: {
                    color: "crimson"
                },
                description: "Debes de colocar un nombre a la lista.",
                richColors: true
            })
            return null
        };

        const result = await createOrigin({
            disabled: false,
            name: caption2Name(newTitleName),
            title: newTitleName,

        })

        if (result.success) {

            toast("Se pudo crear la lista con éxito", {
                style: {
                    color: "lime"
                }
            });

            loadData();
            setNewTitleName("")

        } else {
            toast("Hubo un error al crear la lista.", {
                style: {
                    color: "crimson"
                },
                description: result.msg,
                richColors: true
            })
        }


    }

    useEffect(() => {
        loadData()
    }, []);

    return (
        <div className="p-4 overflow-auto h-auto">
            <Card>
                <CardHeader>
                    <CardTitle>
                        Crear grupos de listas
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Input value={newTitleName} onChange={x => setNewTitleName(x.target.value)} />
                </CardContent>
                <CardFooter>
                    <Button onClick={() => createOriginF()}>
                        <Save />
                        Crear
                    </Button>
                </CardFooter>
            </Card>
            <hr className="my-2" />
            <div className="w-full space-y-2">
                {
                    originsNames.map((x, i) => {

                        return <OriginCard
                            origin={x} key={i}
                            onReload={loadData}
                        />
                    })
                }
            </div>
        </div>
    );
}

export default OriginsPages;