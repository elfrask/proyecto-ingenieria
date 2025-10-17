"use client"
import { caption2Name, cn } from "@/lib/utils";
import { FC, HTMLAttributes, HtmlHTMLAttributes, ReactNode, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { ExternalLink, Pencil, PlusCircle, Save, Trash2 } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { IMinuteType } from "@/lib/db-types";
import { createMinuteType, getAllMinuteTypes } from "@/lib/minute-actions";
import { toast } from "sonner";
import { MinuteTypeCard } from "./custom-fields";
import { UserPageConfigs } from "./user-page-configs";
import { getSession } from "@/lib/auth";

const UserSession = await getSession();


export type functionLinkSectionInterface = (props: { isOpen: boolean }) => ReactNode

export interface LinkSectionsItemProps {
    title: string | ReactNode;
    description: string | ReactNode;
    // content: FC<HtmlHTMLAttributes<HTMLDivElement>>;
    content: functionLinkSectionInterface;
    disabled: boolean;
}

export function LinkSectionsItemElement(
    title: string | ReactNode,
    description: string | ReactNode,
    content: functionLinkSectionInterface,
    disabled: boolean = false
): LinkSectionsItemProps {

    return {
        title,
        content,
        description,
        disabled
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
                    fields: []
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
                            Crear plantilla de minuta
                        </Label>
                        <div className="flex flex-row space-x-2">
                            <Input
                                disabled={UserSession?.permission.MinuteType !== 2}
                                value={newTypeName}
                                placeholder="Titulo del nuevo tipo"
                                onChange={x => setNewTypeName(x.target.value)}
                            />
                            <Button
                            
                            disabled={UserSession?.permission.MinuteType !== 2}
                            onClick={createMinuteAType} >
                                <PlusCircle />
                                Agregar
                            </Button>

                        </div>
                    </Card>
                    <div className="h-auto overflow-auto space-y-2">
                        {
                            typeMinutesList.map(x => {

                                return <MinuteTypeCard minuteType={x} />
                            })
                        }
                    </div>
                </div>
            )
        }
    ),
    LinkSectionsItemElement(
        "Configuración de usuarios y roles",
        "Crea y gestiona los usuarios de la plataforma, roles, permisos y mas",
        ({ isOpen }) => {

            return (
                <div className="w-full p-4 space-y-2">
                    {
                        UserPageConfigs.map((x, i) => {
                            // console.log(x)
                            return <LinkElement key={i} {...x} />
                        })
                    }
                </div>
            )
        }
    )
]


export function LinkElement(
    {
        description,
        title,
        content,
        disabled
    }: Omit<LinkSectionsItemProps, "content"> & { content: (props: { isOpen: boolean }) => ReactNode }) {
    const [open, setOpen] = useState(false)
    const Content = content;

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button disabled={disabled} variant={"link"} className="
                text-white border-gray-500 border-b flex justify-between
                  rounded-none w-full hover:bg-accent
                ">
                    {title}
                    <ExternalLink />

                </Button>
            </SheetTrigger>
            <SheetContent className="w-full">
                <SheetHeader>
                    <SheetTitle>
                        {title}
                    </SheetTitle>
                    <SheetDescription>
                        {description}
                    </SheetDescription>
                </SheetHeader>
                <div className="h-auto w-full overflow-auto">
                    <Content isOpen={open} />
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
}


export default function ConfigPage({ children, className }: ConfigPageProps) {


    return (
        <div className={cn(`
        
        `, className)}>
            <Tabs defaultValue="userConfig">
                <TabsList>
                    <TabsTrigger value="userConfig">
                        Conf. de usuario
                    </TabsTrigger>
                    {
                        UserSession?.permission.GeneralConfigs === 2 
                        // true
                            ?
                            <TabsTrigger value="globalConfig">
                                Conf. globales
                            </TabsTrigger>
                            : []
                    }


                </TabsList>
                <TabsContent value="globalConfig">
                    <div className="
                    w-full h-max overflow-auto flex flex-col space-y-2
                    *:w-full *:flex *:justify-between *:border-b
                    *:hover:bg-accent *:text-white
                    ">
                        {
                            GlobalConfigs.map(x => {

                                return (
                                    <LinkElement title={x.title} disabled={x.disabled} description={x.description} content={x.content} />
                                )
                            })
                        }
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}


