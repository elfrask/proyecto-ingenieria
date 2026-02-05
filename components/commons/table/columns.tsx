import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { LucideIceCreamCone } from "lucide-react";
import SimpleDialog, { SimpleAlert } from "../fast-dialog";
import { useOpenState } from "@/hooks/states/openState";
import { FunctionComponent, MouseEventHandler, ReactNode } from "react";



export interface ActionsButtonConfigs {
  title: string;
  icon: typeof LucideIceCreamCone;
  onClick?: (v?: React.MouseEvent<HTMLDivElement> | undefined) => any;
  className?: string;
  isButton?: boolean;
  render?: (btn: ReactNode) => ReactNode;
}

export function GenerateActionButton({ ...pr }: ActionsButtonConfigs): FunctionComponent<Partial<ActionsButtonConfigs>> {
  return ({ ...p }) => { return <ActionButton {...pr}  {...p} /> }
}

export function ActionButton({ title, icon, className, onClick, render }: ActionsButtonConfigs) {
  const Icon = icon;
  const ren = render || ((c: ReactNode) => c);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {
          ren(
            <div className="flex justify-center items-center h-8 w-4 cursor-pointer" onClick={x => onClick?.(x)}>
              <Icon className={cn(" h-4 w-4 text-green-600 hover:text-green-900", className)} />
            </div>
          )
        }
      </TooltipTrigger>
      <TooltipContent>
        <p>{title}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export interface SwitchCommandProps {
  value: boolean,
  onValueChange: (v: boolean) => any;
  titleDisabled?: string;
  descriptionDisabled?: string;
  titleEnable?: string;
  descriptionEnable?: string;
  maxWidth?: number


}

export function SwitchCommand({ value, onValueChange, titleDisabled, descriptionDisabled, descriptionEnable, titleEnable, maxWidth }: SwitchCommandProps) {

  const openDisable = useOpenState();
  const openEnable = useOpenState();
  const _maxWidth = maxWidth || 600;
  // console.log(titleDisabled)

  return (
    <>

      {/* Para Desactivar */}
      <SimpleAlert
        title={titleDisabled || "¿Inactivar?"}
        description={descriptionDisabled || "Podrás activarlo en cualquier momento"}
        open={openDisable}
        maxWidth={_maxWidth}
        onCancel={() => {
          openDisable.set(false);
        }}
        // deleteTitle="Desactivar"
        deleteTitle="Inactivar"
        onDelete={() => {
          onValueChange(false)
        }}
      />

      {/* Para Activar */}
      <SimpleAlert
        title={titleEnable || "Activar?"}
        description={descriptionEnable || "Podrás inactivarlo en cualquier momento"}
        open={openEnable}
        maxWidth={_maxWidth}

        onCancel={() => {
          openEnable.set(false);
        }}
        okTitle="Activar"
        onOk={() => {
          onValueChange(true)
        }}
      />

      <Switch
        className=""
        checked={value}
        onCheckedChange={x => {
          if (x) {

            openEnable.set(true);

          } else {

            openDisable.set(true);
          }
        }}
      />
    </>
  )
};