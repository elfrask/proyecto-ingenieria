import { FunctionComponent, ReactNode } from "react";
import { ActionButtonAyuda } from "../simpleActionsButtons/ayuda-button";
import { HelpCircle, LucideIcon } from "lucide-react";
import SimpleDialog from "../../fast-dialog";
import { useOpenState } from "@/hooks/states/openState";
import { Card, CardContent } from "@/components/ui/card";


interface HelpCommandProps {
  children?: ReactNode;
  title?: string;
  tooltipTitle?: string;
  description?: string;
  icon?: LucideIcon;

}

const HelpCommand: FunctionComponent<HelpCommandProps> = ({
  children, description, icon, title, tooltipTitle
}) => {
  const open = useOpenState()
  return (
    <>
      <SimpleDialog
        separator
        open={open}
        title={title || "Ayuda"}
        description={description}
        icon={icon || HelpCircle}
        onCancel={x => open.close()}

      >
        <Card>
          <CardContent>
            {children}
          </CardContent>
        </Card>
      </SimpleDialog>
      <ActionButtonAyuda
        title={tooltipTitle}
        onClick={x => open.open()}
      />
    </>
  );
}

export default HelpCommand;