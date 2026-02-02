import { FunctionComponent, HTMLAttributes, ReactNode } from "react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../ui/sheet";
import { openState } from "@/types/components/states";
import { clearTemporalsForms, cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { PlusCircle, XCircle } from "lucide-react";
import { useFormContextComponent } from "./form/providers/FormProvider";
import { UseFormReturn } from "react-hook-form";


interface SimpleScheetProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  openState: openState;
  title: string | ReactNode;
  description?: string;
  maxWidth?: number;
  formControls?: boolean;
  debug?: boolean;
  onSave?: (data: any, methods?: UseFormReturn<any>) => any;
  titleSave?: string;
  okIsSubmit?: boolean
  ignoreValid?: boolean
  titleCancel?: string;
  onCancel?: () => any;
}


export const SimpleSheet: FunctionComponent<SimpleScheetProps> = ({
  openState, children, title, description, className, 
  maxWidth, formControls, onSave, debug, onCancel, 
  okIsSubmit, titleCancel, titleSave, ignoreValid,
  ...p
}) => {

  return (
    <Sheet onOpenChange={x => openState.set(x)} open={openState.state} defaultOpen={openState.state}>
      <SheetContent
        
        onX={x => {
          x.preventDefault();
          openState.close();
          onCancel?.()
        }}
        {...p}
        
        onEscapeKeyDown={x => x.preventDefault()}
        onInteractOutside={x => x.preventDefault()}
        className={cn('scroll-auto gap-0', className)}
        style={{
          "maxWidth": (maxWidth || 600) + "px",
          width: "100%"
        }}
      >
        <SheetHeader className="gap-0 mb-0">
          <SheetTitle>
            {title}
          </SheetTitle>
          <SheetDescription>
            {description}
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="p-4 h-full overflow-auto">
          {children}
        </div>

        {
          formControls &&
          <SheetFooter className="grid grid-cols-2 border-t">
            <SheetClose asChild>
              <Button type="button" variant={"outline"} className="hover:bg-muted" onClick={x => onCancel?.()}>
                <XCircle />
                {titleCancel || "Cancelar"}
              </Button>
            </SheetClose>
            {
              !okIsSubmit?(
                <Button type={"button"} onClick={x => onSave?.(undefined)}>
                  <PlusCircle />
                  {titleSave || "Guardar"}
                </Button>

              ):(
                <SubmitButton
                  title={titleSave}
                  onSave={onSave}
                  debug={debug}
                  ignoreValid={ignoreValid}
                />
              )
            }

          </SheetFooter>
        }
      </SheetContent>
    </Sheet>
  );
}

interface SubmitButtonProps { 
  onSave?: (data: any, methods?: UseFormReturn<any>) => any; 
  title?: string; 
  debug?: boolean; 
  ignoreValid?: boolean;
}

function SubmitButton({
  onSave, title, debug, ignoreValid
}: SubmitButtonProps) {
  const {methods} = useFormContextComponent()

  return (
    <Button type="button" onClick={f => {
      const data = methods.getValues();
      if (ignoreValid) {
        return onSave?.(data, methods)
      }
      
      // console.log(data)
      clearTemporalsForms(data||{})


      methods.handleSubmit(x => onSave?.(x, methods), (x, e) => {
        if (debug) {
          console.log("fallo:", x, e)
        }
      })()
    }}>
      <PlusCircle />
      {title ||"Guardar"}
    </Button>
  )
}

/**
 * 
 * @deprecated Error Ortografico usar "SimpleSheet"
 */

export const SimpleScheet: FunctionComponent<SimpleScheetProps> = ({...p}) => <SimpleSheet {...p} />;

export default SimpleScheet;