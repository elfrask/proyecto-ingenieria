import { openState } from "@/types/components/states";
import { FunctionComponent, ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogOverlay, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { LucidePlus } from "lucide-react";



interface SimpleDialogProps {
  open: openState | boolean;
  onOk?: (v?: any) => void;
  onCancel?: (v?: any) => void;
  onDelete?: (v?: any) => void;

  okTitle?: string;
  cancelTitle?: string;
  deleteTitle?: string;
  separator?: boolean;

  children?: ReactNode;
  title: string;
  description?: string;
  maxWidth?: number;
  icon?: typeof LucidePlus

}

const SimpleDialog: FunctionComponent<SimpleDialogProps> = ({
  onCancel, onOk, open, cancelTitle, okTitle, children, title, description, deleteTitle, onDelete, separator, maxWidth, icon
}) => {
  const Icon = icon as typeof LucidePlus;
  return (
    <Dialog
      open={typeof open === "boolean" ? open : open?.state}
      onOpenChange={typeof open !== "boolean" && open?.set || (x => x)}
    >
      <DialogContent
        onClick={x => {
          x.stopPropagation()
          x.preventDefault()
        }}
        className="sm:max-w-[320px] md:max-w-2xl"
        style={{
          maxWidth: `${maxWidth}px`
        }}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className={cn("w-full flex flex-col items-start justify-center pb-4", separator && "border-b")}>
          <DialogTitle className='flex justify-start flex-row flex-wrap items-center gap-2 line-clamp-2 w-full' style={{ display: "flex" }}>
            {Icon && <Icon className="text-primary w-4 h-4" />}
            {title}
          </DialogTitle>
          {
            description ?
              <DialogDescription className="">
                {description}
              </DialogDescription>
              :
              <DialogDescription className="hidden" />
          }
        </div>

        {children}

        <DialogFooter className='flex flex-row justify-between items-end gap-3'>
          {
            onCancel &&
            <Button
              type='button'
              variant="outline"
              className="min-w-40 border-green-600 hover:border-green-700 hover:bg-transparent hover:cursor-pointer"
              onClick={x => onCancel?.()}
            >
              {cancelTitle || "Cerrar"}
            </Button>
          }
          {
            onDelete &&
            <Button
              type='button'
              className="min-w-40 bg-red-600 hover:bg-red-700 hover:cursor-pointer"
              onClick={x => onDelete?.()}
            >
              {deleteTitle || "Eliminar"}
            </Button>
          }
          {
            onOk &&
            <Button
              type='button'
              className="min-w-40 bg-primary hover:bg-primary/80 hover:cursor-pointer"
              onClick={x => onOk?.()}
            >
              {okTitle || "Aceptar"}
            </Button>
          }

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}

export const SimpleAlert: FunctionComponent<SimpleDialogProps> = ({
  onCancel, onOk, open, cancelTitle, okTitle, children, title, description, deleteTitle, onDelete, separator, maxWidth
}) => {
  return (
    <AlertDialog
      open={typeof open === "boolean" ? open : open?.state}
      onOpenChange={typeof open !== "boolean" && open?.set || (x => x)}

    >
      <AlertDialogContent
      // onInteractOutside={(e) => e.preventDefault()}
      // onEscapeKeyDown={(e) => e.preventDefault()} 
      style={{ maxWidth: `${maxWidth||640}px`}}
      >
        <AlertDialogHeader className={cn(separator && "border-b")}>
          <AlertDialogTitle>
            {title}
          </AlertDialogTitle>
          {
            description ?
              <AlertDialogDescription>
                {description}
              </AlertDialogDescription>
              :
              <AlertDialogDescription className="hidden" />
          }
        </AlertDialogHeader>

        {children}

        <AlertDialogFooter className='flex flex-row justify-between items-end gap-3 '>
          {
            onCancel &&
            <AlertDialogCancel
              type='button'
              className="hover:bg-muted"
              // className="w-auto border-green-600 hover:border-green-700 hover:bg-transparent hover:cursor-pointer" 
              onClick={x => onCancel?.()}
            >
              {cancelTitle || "Cerrar"}
            </AlertDialogCancel>
          }
          {
            onDelete &&
            <AlertDialogAction
              type='button'
              className="w-auto bg-red-600 hover:bg-red-700 hover:cursor-pointer"
              onClick={x => onDelete?.()}
            >
              {deleteTitle || "Eliminar"}
            </AlertDialogAction>
          }
          {
            onOk &&
            <AlertDialogAction
              type='button'
              onClick={x => onOk?.()}
            >
              {okTitle || "Aceptar"}
            </AlertDialogAction>
          }

        </AlertDialogFooter>

      </AlertDialogContent>
    </AlertDialog>
  );
}

export default SimpleDialog;
