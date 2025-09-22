import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import { LinkSectionsItemElement, LinkSectionsItemProps, functionLinkSectionInterface } from "./config-page";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Pencil, Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { caption2Name, HTML, Notify, StateInput } from "@/lib/utils";
import { createRole, getAllRoles, getRole, updateRole } from "@/lib/role-action";
import { IRole, IUser, PermissionInterface } from "@/lib/db-types";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "./ui/sheet";
import SheetSimple from "./sheet-simple";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { createUser, getAllUsers, getUser, updateUser } from "@/lib/user-actions";



interface SelectPermissionProps extends Omit<HTML<HTMLSelectElement>, "onChange"> {
    value?: number;
    onChangeValue?: (e: number) => void;
    typeSelect?: "disabledAvailable" | "ReadOnly|ReadAndWrite"
}

const SelectPermission: FunctionComponent<SelectPermissionProps> = ({
    onChangeValue,
    defaultValue,
    value,
    typeSelect,
    className
}) => {
    let Options = [
        "Por defecto",
        "Deshabilitado",
        "Solo lectura",
        "Lectura y escritura"
    ]

    typeSelect = typeSelect || "disabledAvailable";

    if (typeSelect === "ReadOnly|ReadAndWrite") {
        Options = [
            "Por defecto",
            // "Deshabilitado",
            "Solo lectura",
            "Lectura y escritura"
        ]
    }




    return (
        <Select defaultValue="0" value={String(value || 0)} onValueChange={x => {
            if (onChangeValue) {
                onChangeValue(Number(x))
            }
        }}>
            <SelectTrigger>
                <SelectValue placeholder={"..."} className={className} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {
                        Options.map((x, i) =>
                            <SelectItem value={i + ""} >{x}</SelectItem>
                        )
                    }
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}



interface RoleEditorProps extends HTML {
    asChild?: boolean,
    role: string,
}

const RoleEditor: FunctionComponent<RoleEditorProps> = ({
    asChild,
    children,
    role
}) => {
    const [Rol, setRol] = useState<IRole | null>(null);
    // const [Title, setTitle] = useState("");
    function setRolPass(key: keyof IRole, value: any) {
        if (!Rol) setRol(Rol);
        setRol({
            ...Rol,
            [key]: value
        } as IRole);
    }

    function setPermissionPass(key: keyof PermissionInterface, value: any) {
        if (!Rol) setRol(Rol);
        setRol({
            ...Rol,
            permission: {
                ...Rol?.permission,
                [key]: value
            }
        } as IRole);
    }




    return (
        <SheetSimple
            trigger={children}
            asChild={asChild}
            title="Editor de roles"
            description="Edita los roles del sistema"
            onShow={async () => {

                const result = await getRole(role);


                if (result.success) {

                    setRol(result.result);

                } else {
                    Notify.reject("Hubo un problema al cargar el rol")
                }
            }}

        >
            <Card>
                <CardHeader>
                    <CardDescription>
                        codename: {Rol?.name}
                    </CardDescription>
                    <CardTitle>
                        Titulo
                    </CardTitle>
                    <Input
                        value={Rol?.title}
                        onChange={x => { setRolPass("title", x.target.value) }}
                        className="w-full"
                    />
                    <br />
                    <Label>
                        Deshabilitado
                    </Label>
                    <Switch value={"Deshabilitado"} checked={Rol?.disabled} />

                </CardHeader>
                <CardFooter className="flex justify-end">
                    <Button
                        onClick={async () => {


                            const result = await updateRole(Rol?.name as string, Rol as IRole);

                            if (result.success) {

                                Notify.success("Se ha guardado los cambios para este rol");
                            } else {
                                Notify.reject("Hubo un problema la actualizar el rol", result.msg);

                            }
                        }}
                    >
                        <Save />
                        Guardar
                    </Button>
                </CardFooter>
            </Card>

            <br />

            <div className="h-auto overflow-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Permisos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="*:w-full">
                        <Label className="mb-2">
                            Configuraciones generales
                        </Label>
                        <SelectPermission
                            value={Rol?.permission.GeneralConfigs}
                            onChangeValue={x => setPermissionPass("GeneralConfigs", x)}
                            className="w-full"
                        />
                        <hr className="my-2" />


                        <Label className="mb-2">
                            Marcadores
                        </Label>
                        <SelectPermission
                            value={Rol?.permission.Markers}
                            onChangeValue={x => setPermissionPass("Markers", x)}
                            className="w-full"
                            typeSelect="ReadOnly|ReadAndWrite"
                        />
                        <hr className="my-2" />


                        <Label className="mb-2">
                            Minutas
                        </Label>
                        <SelectPermission
                            value={Rol?.permission.Minute}
                            onChangeValue={x => setPermissionPass("Minute", x)}
                            className="w-full"
                            typeSelect="ReadOnly|ReadAndWrite"
                        />
                        <hr className="my-2" />


                        <Label className="mb-2">
                            Tipos de minutas
                        </Label>
                        <SelectPermission
                            value={Rol?.permission.MinuteType}
                            onChangeValue={x => setPermissionPass("MinuteType", x)}
                            className="w-full"
                            typeSelect="ReadOnly|ReadAndWrite"
                        />
                        <hr className="my-2" />


                    </CardContent>
                </Card>

            </div>


        </SheetSimple>
    );
}



interface UserEditorProps extends HTML {
    asChild?: boolean,
    user: string,
}

const UserEditor: FunctionComponent<UserEditorProps> = ({
    asChild,
    children,
    user
}) => {
    const [UserData, setUserData] = useState<IUser | null>(null);
    const [rolesList, setRolesList] = useState<IRole[]>([])


    function setUserPass(key: keyof IUser, value: any) {
        if (!UserData) setUserData(UserData);
        setUserData({
            ...UserData,
            [key]: value
        } as IUser);
    }

    return (
        <SheetSimple
            trigger={children}
            asChild={asChild}
            title="Editor de usuario"
            description="Edita los datos del usuario"
            onShow={async () => {
                const result = await getUser(user);
                const roles = await getAllRoles();

                if (roles.success) {
                    setRolesList(roles.result as IRole[]);
                };

                if (result.success) {
                    setUserData(result.result);
                } else {
                    Notify.reject("Hubo un problema al cargar el usuario")
                }
            }}
        >
            <Card>
                <CardHeader className="*:w-full">
                    <CardDescription>
                        Usuario: {UserData?.user}
                    </CardDescription>
                    <CardTitle>
                        Contraseña
                    </CardTitle>
                    <Input
                        type="password"
                        value={UserData?.pass}
                        onChange={x => { setUserPass("pass", x.target.value) }}
                        className="w-full"
                    />
                    <br />
                    <Label>
                        Rol
                    </Label>

                    <Select
                        value={UserData?.role}
                        onValueChange={x => { setUserPass("role", x) }}

                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un rol" className="w-full" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {
                                    rolesList.map(x => (
                                        <SelectItem key={x.name} value={x.name}>{x.title}</SelectItem>
                                    ))
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardFooter className="flex justify-end">
                    <Button
                        onClick={async () => {
                            const result = await updateUser(UserData?.user as string, UserData as IUser);
                            if (result.success) {
                                Notify.success("Se ha guardado los cambios para este usuario");
                            } else {
                                Notify.reject("Hubo un problema la actualizar el usuario", result.msg);
                            }
                        }}
                    >
                        <Save />
                        Guardar
                    </Button>
                </CardFooter>
            </Card>
        </SheetSimple>
    );
}




const RolesPage: functionLinkSectionInterface = ({ isOpen }) => {

    const [newTitle, setNewTitle] = useState("")
    const [Roles, setRoles] = useState<IRole[]>([])

    async function LoadData() {

        const result = await getAllRoles();

        if (result.success) {
            setRoles(result.result as IRole[])
        }
    }

    useEffect(() => {
        LoadData();
    }, [isOpen])

    return (
        <div className="w-full p-4 overflow-auto h-auto">
            <Card>
                <CardHeader>
                    <CardTitle>
                        Crear rol
                    </CardTitle>
                    <Input
                        value={newTitle}
                        onChange={x => setNewTitle(x.target.value)}
                        className="w-full"
                    />
                    <CardDescription>
                        {caption2Name(newTitle)}
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end">
                    <Button onClick={async () => {

                        if (newTitle === "") {
                            Notify.reject(
                                "Debes de colocar un titulo para crear un rol",
                                ""
                            );
                            return null;
                        };

                        const Result = await createRole({
                            title: newTitle,
                            name: caption2Name(newTitle),
                            extends: "",
                            disabled: false,
                            permission: {
                                GeneralConfigs: 0,
                                Markers: 0,
                                Minute: 0,
                                MinuteType: 0
                            }
                        });

                        if (Result.success) {
                            Notify.success(`Se ha creador el role: '${newTitle}'`);
                            setNewTitle("")
                            LoadData();

                        } else {
                            Notify.reject("Hubo un error al intentar crear el rol")
                        }


                    }}>
                        <Plus />
                        Crear rol
                    </Button>
                </CardFooter>
            </Card>
            <hr className="my-2" />

            <div className="h-auto w-full overflow-auto">

                {
                    Roles.map((x, i) => {

                        return (
                            <Card key={x.name} className="w-full">
                                <CardHeader>
                                    <CardTitle>
                                        {x.title}

                                    </CardTitle>
                                    <CardDescription>
                                        {x.name}
                                    </CardDescription>
                                </CardHeader>
                                <CardFooter className="flex justify-end">
                                    <RoleEditor role={x.name} asChild>
                                        <Button>
                                            <Pencil />
                                            Modificar
                                        </Button>
                                    </RoleEditor>
                                </CardFooter>
                            </Card>
                        )
                    })
                }
            </div>


        </div>
    );
}

const UserPage: functionLinkSectionInterface = ({ isOpen }) => {

    const [newUser, setNewUser] = useState("")
    const [pass, setPass] = useState("")
    const [newRol, setNewRole] = useState("")
    const [Users, setUser] = useState<IUser[]>([])
    const [rolesList, setRolesList] = useState<IRole[]>([])

    async function LoadData() {

        const result = await getAllUsers();
        const roles = await getAllRoles();

        if (roles.success) {
            setRolesList(roles.result as IRole[]);
        };

        if (result.success) {
            setUser(result.result as IUser[])
        }
    }

    useEffect(() => {
        LoadData();
    }, [isOpen])

    return (
        <div className="w-full p-4 overflow-auto h-auto">
            <Card>
                <CardHeader className="*:w-full">
                    <CardTitle>
                        Crear usuario
                    </CardTitle>
                    <Input
                        value={newUser}
                        onChange={x => setNewUser(x.target.value)}
                        className="w-full"
                    />

                    <CardTitle>
                        Contraseña
                    </CardTitle>
                    <Input
                        type="password"
                        value={pass}
                        onChange={x => setPass(x.target.value)}
                        className="w-full"
                    />

                    <CardTitle>
                        Rol
                    </CardTitle>
                    <Select
                        value={newRol}
                        onValueChange={x => { setNewRole(x) }}

                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un rol" className="w-full" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {
                                    rolesList.map(x => (
                                        <SelectItem key={x.name} value={x.name}>{x.title}</SelectItem>
                                    ))
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>


                </CardHeader>
                <CardFooter className="flex justify-end">
                    <Button onClick={async () => {

                        if (newUser === "") {
                            Notify.reject(
                                "Debes de colocar un nombre de usuario",
                            );
                            return null;
                        };

                        if (pass === "") {
                            Notify.reject(
                                "Debes de colocar una contraseña al usuario",
                            );
                            return null;
                        };

                        if (newRol === "") {
                            Notify.reject(
                                "Debes de colocar un rol al usuario",
                            );
                            return null;
                        };



                        const Result = await createUser({
                            user: newUser,
                            pass: pass,
                            role: newRol
                        });

                        if (Result.success) {
                            Notify.success(`Se ha creador el usuario: '${newUser}'`);
                            setNewUser("")
                            setPass("")
                            setNewRole("")
                            LoadData();

                        } else {
                            Notify.reject("Hubo un error al intentar crear el usuario")
                        }

                    }}>
                        <Plus />
                        Crear rol
                    </Button>
                </CardFooter>
            </Card>
            <hr className="my-2" />

            <div className="h-auto w-full overflow-auto">

                {
                    Users.map((x, i) => {

                        return (
                            <Card key={x.user} className="w-full">
                                <CardHeader>
                                    <CardTitle>
                                        {x.user}

                                    </CardTitle>
                                    <CardDescription>
                                        rol: {
                                            (rolesList.filter(y => x.role === y.name)[0])?.title
                                        }
                                    </CardDescription>
                                </CardHeader>
                                <CardFooter className="flex justify-end">
                                    <UserEditor user={x.user} asChild>
                                        <Button>
                                            <Pencil />
                                            Modificar
                                        </Button>
                                    </UserEditor>
                                </CardFooter>
                            </Card>
                        )
                    })
                }
            </div>


        </div>
    );
}




export const UserPageConfigs: LinkSectionsItemProps[] = [
    LinkSectionsItemElement(
        "Roles de la plataforma",
        "Gestiona los roles de la plataforma y sus permisos",
        RolesPage
    ),
    LinkSectionsItemElement(
        "Usuarios de la plataforma",
        "Gestiona los usuarios de la plataforma y asigna los roles",
        UserPage
    ),

]