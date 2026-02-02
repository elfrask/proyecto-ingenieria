import { FunctionComponent } from "react";
import { Button } from "../ui/button";
import {  ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { SimpleAlert } from "./fast-dialog";
import { useOpenState } from "@/hooks/states/openState";



interface ToBackProps {
  alert?: boolean
  alertTitle?: string
  alertDescription?: string
  label?: string;
}

const ToBack: FunctionComponent<ToBackProps> = ({
  alert, alertDescription, alertTitle, label
}) => {

  const route = useRouter();
  const open = useOpenState();
  return (
    <>
      <SimpleAlert 
        title={alertTitle||"¿Estas seguro de querer regresar?"}
        description={alertDescription || "Perderás toda la información que no hayas guardado"}
        open={open}
        cancelTitle="Cancelar"
        deleteTitle="Volver de todos modos"
        onDelete={x => {
          route.back();
        }}
        onCancel={x => {
          open.close()
        }}
      />
      <Button className="w-40" onClick={x => {

        if (!alert) {
          
          route.back();
          return
        }

        open.open()

      }}>
        <ChevronLeft />
        {label || "Regresar"}
      </Button>
    </>
  );
}

export default ToBack;