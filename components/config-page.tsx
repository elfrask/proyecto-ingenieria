"use client"
import { caption2Name, cn } from "@/lib/utils";
import { FC, HTMLAttributes, HtmlHTMLAttributes, ReactNode, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { ExternalLink, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { IMinuteType } from "@/lib/db-types";
import { createMinuteType, getAllMinuteTypes } from "@/lib/minute-actions";
import { toast } from "sonner";


export interface LinkSectionsItemProps {
    title: string | ReactNode;
    description: string | ReactNode;
    // content: FC<HtmlHTMLAttributes<HTMLDivElement>>;
    content: (props: { isOpen: boolean }) => ReactNode;
}

export function LinkSectionsItemElement(
    title: string | ReactNode,
    description: string | ReactNode,
    content: (props: { isOpen: boolean }) => ReactNode
): LinkSectionsItemProps {

    return {
        title,
        content,
        description
    }
}

export interface ConfigPageProps extends HTMLAttributes<HTMLDivElement> {

}

const GlobalConfigs: LinkSectionsItemProps[] = [
    LinkSectionsItemElement(
        "Configuraciones de minutas",
        "aquí puedes configurar las minutas, personalizar los campos y crear tipos de minutas",
        (isOpen) => {

            const [newTypeName, setNewTypeName] = useState("")
            const [typeMinutesList, setTypeMinutesList] = useState<IMinuteType[]>([])

            async function loadTypes() {

                const result = await getAllMinuteTypes({});

                if (result.success) {

                    setTypeMinutesList(
                        result.result as IMinuteType[]
                    );

                } else {
                    console.error(result.msg);
                    toast("Hubo un error al cargar los tipos de minutas", { 
                        style: { 
                            color: "crimson" 
                        }, 
                        description: result.msg, 
                        richColors: true 
                    })
                }

            }

            async function createMinuteAType() {
                
                const title = newTypeName;

                if (!title) {
                    toast("Hubo un error al crear el tipo de minuta.", { 
                        style: { 
                            color: "crimson" 
                        }, 
                        description: "Debes de colocar un nombre a el nuevo tipo.", 
                        richColors: true 
                    })
                    return null
                };

                const result = await createMinuteType({
                    caption: title,
                    typeName: caption2Name(title),
                    fields:[]
                })

                if (result.success) {

                    toast("Se pudo crear el tipo con éxito", { 
                        style: { 
                            color: "lime" 
                        }
                    });

                    loadTypes();
                    setNewTypeName("")
                    
                } else {
                    toast("Hubo un error al crear el tipo de minuta.", { 
                        style: { 
                            color: "crimson" 
                        }, 
                        description: result.msg, 
                        richColors: true 
                    })
                }


            }

            useEffect(() => {
                if (isOpen) {
                    loadTypes();

                }
            }, [isOpen])

            return (
                <div className="w-full p-4">
                    <Card className="flex flex-col p-4 gap-2 mb-4">
                        <Label className="font-bold">
                            Crear tipo de minuta
                        </Label>
                        <div className="flex flex-row space-x-2">
                            <Input value={newTypeName} placeholder="Titulo del nuevo tipo" onChange={x => setNewTypeName(x.target.value)} />
                            <Button onClick={createMinuteAType} >
                                <PlusCircle />
                                Agregar
                            </Button>

                        </div>
                    </Card>
                    <div className="h-auto overflow-auto space-y-2">
                        {
                            typeMinutesList.map(x=> {

                                return(
                                    <Card key={x.id} className="w-full">
                                        <CardHeader>
                                            <CardTitle>
                                                {x.caption}
                                            </CardTitle>
                                            <CardDescription>
                                                codename: {x.typeName} <br />
                                                ID: {x.id}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardFooter className="space-x-2 flex justify-end">
                                            <Button variant={"destructive"}>
                                                <Trash2 />
                                                Eliminar
                                            </Button>
                                            <Button>
                                                <Pencil />
                                                Editar
                                            </Button>
                                        </CardFooter>

                                    </Card>
                                )
                            })
                        }
                    </div>
                </div>
            )
        }
    )
]


export default function ConfigPage({ children, className }: ConfigPageProps) {


    return (
        <div className={cn(`
        
        `, className)}>
            <Tabs defaultValue="userConfig">
                <TabsList>
                    <TabsTrigger value="userConfig">
                        Conf. de usuario
                    </TabsTrigger>
                    <TabsTrigger value="globalConfig">
                        Conf. globales
                    </TabsTrigger>


                </TabsList>
                <TabsContent value="globalConfig">
                    <div className="
                    w-full h-max overflow-auto flex flex-col space-y-2
                    *:w-full *:flex *:justify-between *:border-b
                    *:hover:bg-accent *:text-white
                    ">
                        {
                            GlobalConfigs.map(x => {

                                const [open, setOpen] = useState(false)

                                return (
                                    <Sheet open={open} onOpenChange={setOpen}>
                                        <SheetTrigger asChild>
                                            <Button variant={"link"}>
                                                {x.title}
                                                <ExternalLink />

                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent className="w-full">
                                            <SheetHeader>
                                                <SheetTitle>
                                                    {x.title}
                                                </SheetTitle>
                                                <SheetDescription>
                                                    {x.description}
                                                </SheetDescription>
                                            </SheetHeader>
                                            <div className="h-auto w-full overflow-auto">
                                                <x.content isOpen={open} />
                                            </div>
                                            <SheetFooter>
                                                <SheetClose asChild>
                                                    <Button variant={"outline"}>
                                                        Cerrar
                                                    </Button>
                                                </SheetClose>
                                            </SheetFooter>
                                        </SheetContent>
                                    </Sheet>

                                )
                            })
                        }
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}