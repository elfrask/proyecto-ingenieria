import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { HTML } from "@/lib/utils";
import { Button } from "./ui/button";


export interface SheetSimpleProps extends HTML {
    asChild?: boolean,
    onShow?: () => void,
    onHide?: () => void,
    trigger: ReactNode,
    title: string,
    description?: string
}
/**
 * @deprecated Deprecado, usar el nuevo SimpleSheet
 */
const SheetSimple: FunctionComponent<SheetSimpleProps> = ({
    asChild,
    children,
    onShow,
    onHide,
    trigger,
    description,
    title
}) => {
    const [IsOpen, setIsOpen] = useState(false);

    useEffect(() => {
        
        if (IsOpen) {
            if (onShow) onShow()
        } else {
            if (onHide) onHide()
            
        }
    }, [IsOpen]);


    return ( 
        <Sheet open={IsOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild={asChild}>
                {trigger}
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>

                    <SheetTitle>
                        {title}
                    </SheetTitle>
                    <SheetDescription>
                        {description}
                    </SheetDescription>

                </SheetHeader>
                <div className="w-full p-4 overflow-auto h-auto">
                    {children}
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
    );
}


export default SheetSimple