import { useOpenState } from "@/hooks/states/openState";
import { FunctionComponent, ReactNode } from "react";
import SimpleDialog, { SimpleAlert } from "../../fast-dialog";
import { ActionButton } from "../columns";
import { Gavel } from "lucide-react";
import { Estatus } from "../renders/status-badge";

interface DecideCommand {
  onDecide: (decide: Estatus) => void;
  children?: ReactNode;
  title?: string;
  description?: string;
  isDialog?: boolean
}

export const DecideCommand: FunctionComponent<DecideCommand> = ({
  onDecide, children, isDialog, description, title
}) => {

  const open = useOpenState();
  const _title = title || "¿Deseas Aprobar o Rechazar?";
  const _description = description || "Una vez Aprobado o Rechazado la acción no se podrá deshacer";

  return (
    <>
      {
        isDialog ?(
          <SimpleDialog
            title={_title}
            description={_description}
            open={open}
            icon={Gavel}
            deleteTitle="Rechazar"
            okTitle="Aprobar"
            cancelTitle="Cancelar"
            onDelete={x => {onDecide?.("RECHAZADO"); open.close()}}
            onOk={x => {onDecide?.("APROBADO"); open.close()}}
            onCancel={x => {open.close()}}
            separator
          >
            
            {open.state && children}
          </SimpleDialog>

        ) :(
          <SimpleAlert
            title={_title}
            description={_description}
            open={open}
            deleteTitle="Rechazar"
            okTitle="Aprobar"
            cancelTitle="Cancelar"
            onDelete={x => {onDecide?.("RECHAZADO"); open.close()}}
            onOk={x => {onDecide?.("APROBADO"); open.close()}}
            onCancel={x => {open.close()}}
          />
        )
      }
      <ActionButton
        title="Decidir"
        icon={Gavel}
        className="text-orange-600 hover:text-orange-900"
        onClick={x => open.open()}
      />
    </>
  );
}