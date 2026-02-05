import { FunctionComponent } from "react";
import { ActionButtonEliminar } from "../simpleActionsButtons/delete-button";
import { ActionsButtonConfigs } from "../columns";
import { configsForDelete, useAlert } from "@/hooks/use-alert";



interface DeleteCommandProps extends Partial<ActionsButtonConfigs> {
  titleDelete?: string
}
 
const DeleteCommand: FunctionComponent<DeleteCommandProps> = ({
  titleDelete,
  ...p
}) => {

  const {callAlert, AlertNode} = useAlert(configsForDelete( titleDelete ||  "¿Estas seguro de eliminar este elemento?"));
  return (
    <>
      {AlertNode}
      <ActionButtonEliminar 
        {...p}
        onClick={x => {
          callAlert({ onDelete() {
            p.onClick?.()
          }})
        }}
      />
    </>
  );
}
 
export default DeleteCommand;