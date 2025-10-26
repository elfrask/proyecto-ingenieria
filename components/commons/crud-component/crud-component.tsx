"use client"
import React, { Dispatch, FormEventHandler, FunctionComponent, ReactElement, ReactNode, useContext, useEffect, useState } from 'react';
import { Button } from '../../ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../../ui/sheet';
import { Input } from '../../ui/input';
import { ArrowUpDown, CirclePlus, LucideMoreHorizontal, PencilLine, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { Card, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Field, FieldGroup, FieldLabel, FieldSet } from '../../ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Label } from '../../ui/label';
import { AlgorithmField, OptionAlgorithmParams, TextInput } from './fields-components';
import { CrudContext, useCrud } from './crud-context';
// Asegúrate de que estos componentes existan o ajusta las importaciones





export interface columnsInterface {
    key: string;
    label: string;
    tableRender?: (value: any) => string | ReactNode;
    fieldComponent?: AlgorithmField;
    fieldBoxClassName?: string;
    spaces?: 1 | 2 | 3 | 4 | 5;
    options?: OptionAlgorithmParams;
    hiddenTable?: boolean;
    hiddenForm?: boolean;
    onValidate?: (value: any) => void | string;

}


export interface HandlerCrud {
    openCreateForm: () => any;

}




interface CrudComponentProps {
    columns: columnsInterface[];
    data: Record<string, any>[];
    onCreate?: (item: any) => void;
    onUpdate?: (item: any) => void;
    onDelete?: (item: any) => void;
    createTitle?: string;
    editTitle?: string;
    createDescription?: string;
    editDescription?: string;

    title?: string;
    description?: string;

    createButtonCaption?: string;
    children: ReactNode
    // spaces?: 1 | 2 | 3 | 4 | 5
    defaultItem?: Record<string, any>;

    customSheet?: React.FC<Partial<CrudFormComponentProps>>;
    
    onItem?: (item: any, action: "create" | "delete" | "edit", preventDefault: () => void) => void

    // la funcion pasa los eventos para establecer a funciones externas 
    // y luego debes de devolver una funcion de acción para desmontar 
    // setHandler?: (Handlers: HandlerCrud) => (() => void) | void


}




const CrudComponent: React.FC<CrudComponentProps> = ({
    columns,
    data,
    onCreate,
    onUpdate,
    onDelete,

    onItem,

    createTitle, createDescription,
    editTitle, editDescription,
    title, description,
    createButtonCaption, children, defaultItem,
    customSheet
}) => {

    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState<Record<string, any> | null>(null);
    const [errors, setError] = useState<Record<string, any>>({});
    const [_data, _setData] = useState<Record<string, any>[]>([])
    const CRUD = useCrud();

    const CustomSheet: FunctionComponent<any> | undefined = customSheet



    const handleCreate = () => {

        let prevented = false;
        function pre() { prevented = true }
        if (onItem) onItem({}, "create", pre)
        if (prevented) return null


        setIsEditing(false);

        if (defaultItem) setCurrentItem(defaultItem);
        else setCurrentItem({});

        setIsSheetOpen(true);
        setError({})
    };

    const handleEdit = (item: Record<string, any>) => {

        let prevented = false;
        function pre() { prevented = true }
        if (onItem) onItem(item, "edit", pre)
        if (prevented) return null
        


        setIsEditing(true);
        setCurrentItem({ ...(defaultItem || {}), ...item });
        setIsSheetOpen(true);
        setError({})
    };

    const handleDelete = (item: any) => {

        let prevented = false;
        function pre() { prevented = true }
        if (onItem) onItem(item, "delete", pre)
        if (prevented) return null
        


        if (onDelete) onDelete(item);
    };

    useEffect(() => {
        CRUD.openCreateForm = handleCreate;
        CRUD.isEditing = isEditing;
        CRUD.closeForm = () => { setIsSheetOpen(false) }
    }, [CRUD]);

    useEffect(() => {

        if (data === undefined) {
            _setData([])
            return
        }
        _setData(data)

    }, [data])







    return (
        <Card className='space-y-0 gap-0'>
            <div className='
            
            flex flex-col gap-2 lg:flex-row
            justify-between border-b-primary border-b
            pb-4
            '>
                <CardHeader className='w-[500px] space-y-0 gap-0'>
                    <CardTitle className='font-light text-lg'>
                        {title || "Sin titulo"}
                    </CardTitle>
                    <CardDescription className='text-sm text-gray-500'>
                        {description || ""}

                    </CardDescription>
                </CardHeader>

            </div>
            <div className='space-y-3'>
                {/* Contenedor  */}
                <div className="p-6 flex mb-0 flex-row justify-between items-center space-x-2">

                    {children}
                </div>
                {/* Tabla */}
                <Table className='
                 overflow-hidden
                
                '>
                    {/* Encabezado de la tabla */}
                    <TableHeader className='bg-green-50'>
                        <TableRow className='*:px-4'>
                            <TableHead
                                className=' py-5 text-transparent'
                            >

                                Acciones
                            </TableHead>
                            {
                                columns
                                    .filter(x => !x.hiddenTable)
                                    .map((col) => (
                                        <TableHead
                                            className=' '
                                            key={col.key}
                                        >
                                            <span className='flex gap-2'>
                                                {col.label}
                                                <ArrowUpDown className='text-gray-500 size-4 mr-3' />
                                            </span>
                                        </TableHead>
                                    ))}
                        </TableRow>
                    </TableHeader>
                    {/* Cuerpo de la tabla */}
                    <TableBody>


                        {_data.map((item, y) => (
                            <TableRow key={y} className='*:px-4'>
                                <TableCell className='flex justify-center'>
                                    {/* Botón de acciones */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant={"ghost"} className='text-primary hover:bg-primary hover:text-white '>
                                                <CirclePlus className='' />
                                            </Button>

                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem
                                                    className="focus:bg-background"
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    <PencilLine />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="focus:bg-background"

                                                    onClick={() => handleDelete(item)}

                                                >
                                                    <Trash2 className='text-red-600' />
                                                    <span className='text-red-600'>
                                                        Eliminar

                                                    </span>
                                                </DropdownMenuItem>

                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>

                                {/* Celdas */}
                                {
                                    columns
                                        .filter(x => !x.hiddenTable)
                                        .map((col) => (
                                            <TableCell key={`${col.key}-${y}`}>
                                                {(col.tableRender || ((e) => e))(item[col.key])}
                                            </TableCell>
                                        ))
                                }
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {
                    CustomSheet ?

                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <SheetContent
                                onEscapeKeyDown={x => x.preventDefault()}
                                onInteractOutside={x => x.preventDefault()}
                                className='scroll-auto'
                                style={{
                                    "maxWidth": "600px",
                                    width: "100%"
                                }}
                            >
                                <CustomSheet

                                    columns={columns}
                                    isEditing={isEditing}
                                    item={currentItem}
                                    open={isSheetOpen} onOpenChange={setIsSheetOpen}
                                    createTitle={createTitle} createDescription={createDescription}
                                    editTitle={editTitle} editDescription={editDescription}
                                    onCreate={onCreate} onUpdate={onUpdate} defaultItem={defaultItem}

                                />

                            </SheetContent>
                        </Sheet>
                        :
                        <CrudFormComponent
                            columns={columns}
                            isEditing={isEditing}
                            item={currentItem}
                            open={isSheetOpen} onOpenChange={setIsSheetOpen}
                            createTitle={createTitle} createDescription={createDescription}
                            editTitle={editTitle} editDescription={editDescription}
                            onCreate={onCreate} onUpdate={onUpdate} defaultItem={defaultItem}
                        >

                        </CrudFormComponent>
                }
            </div>
        </Card>
    );
};


interface CrudFormComponentProps {
    // onSubmit: FormEventHandler<HTMLFormElement>;
    columns: columnsInterface[];
    open: boolean;
    onOpenChange: (v: boolean) => void;
    item?: any;
    onCreate?: (item: any) => void;
    onUpdate?: (item: any) => void;
    onDelete?: (id: string | number) => void;
    createTitle?: string;
    editTitle?: string;
    createDescription?: string;
    editDescription?: string;
    isEditing: boolean;
    defaultItem?: any;
}

const CrudFormComponent: React.FC<CrudFormComponentProps> = ({
    // onSubmit, 
    open, onOpenChange, item, columns,
    onCreate, onUpdate,
    createTitle, createDescription,
    editTitle, editDescription, isEditing, defaultItem
}) => {
    // const [isEditing, setIsEditing] = useState(false);
    const [errors, setError] = useState<Record<string, any>>({});
    const [currentItem, setCurrentItem] = useState<Record<string, any> | null>(item || defaultItem || null);



    useEffect(() => {

        setCurrentItem(item)


    }, [item]);




    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        let OK = true;
        let errorsTemp = { ...errors }

        for (let i = 0; i < columns.length; i++) {
            const col = columns[i];
            const itemValue = (currentItem || {})[col.key];
            if (col.onValidate) {
                const err = col.onValidate(itemValue)



                if (err) {
                    OK = false;
                    errorsTemp = { ...errorsTemp, [col.key]: err }

                } else {
                    errorsTemp = { ...errorsTemp, [col.key]: undefined }
                }
            }



        }

        setError(errorsTemp)

        if (!OK) {
            return
        }

        if (isEditing) {
            if (onUpdate) onUpdate(currentItem);
        } else {
            if (onCreate) onCreate(currentItem);
        }
        if (onOpenChange) onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                onEscapeKeyDown={x => x.preventDefault()}
                onInteractOutside={x => x.preventDefault()}
                className='scroll-auto'
                style={{
                    "maxWidth": "600px",
                    width: "100%"
                }}
            >
                <SheetHeader>
                    <SheetTitle>
                        {
                            isEditing ?
                                editTitle || "Editar" :
                                createTitle || "Crear"
                        }
                    </SheetTitle>
                    <SheetDescription>
                        {
                            isEditing ?
                                editDescription || "Editar dato" :
                                createDescription || "Crear dato"
                        }
                    </SheetDescription>
                </SheetHeader>
                <div className='h-auto w-full p-4 overflow-auto'>
                    <form
                        // initialValues={currentItem || {}}
                        onSubmit={handleSubmit}
                        className='flex flex-col gap-2'

                    >
                        <FieldSet className='flex flex-col gap-2'>
                            <FieldGroup className={`flex flex-wrap flex-row space-y-2 gap-0`}>

                                {
                                    columns
                                        .filter(x => !x.hiddenForm)
                                        .map((col) => {
                                            const Algoritmo = col.fieldComponent || TextInput;
                                            const err = errors[col.key];

                                            function setUpdate(value: any) {

                                                setCurrentItem({ ...currentItem, [col.key]: value });
                                            }

                                            const TemplateOption: OptionAlgorithmParams = {
                                                className: "",
                                                placeholder: "",
                                                selectOptions: [],
                                                ...(col.options || {})
                                            }

                                            return (
                                                <Field key={col.key}
                                                    className='pr-2 mt-2'
                                                    style={{
                                                        width: `calc( 100% / ${col.spaces || 1} )`,

                                                    }}
                                                >
                                                    <FieldLabel>{col.label}</FieldLabel>
                                                    {/* <Input name={col.key} defaultValue={currentItem?.[col.key] || ''}  /> */}
                                                    {Algoritmo(currentItem?.[col.key], setUpdate, currentItem, TemplateOption as OptionAlgorithmParams)}
                                                    <Label className="text-red-700">
                                                        {
                                                            err && err
                                                        }
                                                    </Label>
                                                </Field>
                                            )
                                        })}
                            </FieldGroup>
                        </FieldSet>
                        <Button type="submit" className='mt-2'>Guardar</Button>
                    </form>
                </div>
            </SheetContent>
        </Sheet>
    )
}

interface CrudContextProps {
    children: ReactNode
}

export const CrudProvider: FunctionComponent<CrudContextProps> = ({ children }) => {




    return (
        <CrudContext.Provider value={{
            closeForm() {

            },
            openCreateForm() {

            },
            isEditing: false
        }}>
            {children}
        </CrudContext.Provider>
    );
}


interface CreateRowCrudTriggerProps {
    asChild?: boolean;
    children: ReactNode
}

export const CrudCreateTrigger: FunctionComponent<CreateRowCrudTriggerProps> = ({
    asChild, children
}) => {

    const context = useCrud();
    const handlerOpenCreateForm = () => context.openCreateForm();


    if (asChild) {

        if (React.Children.count(children) > 1) {

            throw ("No se puede asignar las propiedades de CrudCreateTrigger a mas de un hijo")
        }

        const child = React.Children.only(children) as React.ReactElement<any>;

        return React.cloneElement(child, {
            onClick: (event: React.MouseEvent) => {
                // Ejecuta la lógica para abrir el formulario
                handlerOpenCreateForm();

                // Ejecuta el onClick original del hijo, si existe
                if (typeof child.props.onClick === 'function') {
                    child.props.onClick(event);
                }
            }
        })
    }


    return (
        <div onClick={handlerOpenCreateForm}>
            {children}
        </div>
    );
}

export default CrudComponent;

