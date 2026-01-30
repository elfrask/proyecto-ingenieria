"use client"
import { openState } from "@/types/components/states";
import { ReactNode, useState } from "react";
import { useOpenState } from "./states/openState";
import { SimpleAlert } from "@/components/commons/fast-dialog";
import { LucideIcon } from "lucide-react";

export type ButtonsAlert = "Ok" | "Cancel" | "Destructive"

export type CallBackAlert = (methods: AlertMethods) => void

export interface AlertMethods {
  open: openState;
  AlertNode: ReactNode;
 callAlert: (_opt: AlertOptions) => void
}

export interface AlertOptions {
  title?: string;
  description?: string;
  okTitle?: string;
  cancelTitle?: string;
  deleteTitle?: string;
  icon?: LucideIcon;
  maxWidth?: number;
  // buttons?: ButtonsAlert[]
  onOk?: CallBackAlert;
  onCancel?: CallBackAlert;
  onDelete?: CallBackAlert;
}

export function useAlert(optionsDefaut: AlertOptions): AlertMethods {
  
  const [options, setOptions] = useState<AlertOptions>({})
  const open = useOpenState(false, {
    onChange(v) {
      if (!v) {
        setOptions({})
      }
    },
  });

  function callAlert(_opt: AlertOptions) {
    setOptions(_opt);
    open.open();
  }

  const me: AlertMethods = {
    open,
    callAlert,
    AlertNode: (
      <SimpleAlert
        {...optionsDefaut}
        {...options}
        open={open}
        title={options.title || optionsDefaut.title || "Sin Titulo"}
        onOk={(options.onOk || optionsDefaut.onOk)}
        onDelete={(options.onDelete || optionsDefaut.onDelete)}
        onCancel={x => (options.onCancel || optionsDefaut.onCancel)?.(me)}
        maxWidth={optionsDefaut.maxWidth}

      />
    )
  }

  return me
};



export function configsForSubmitAlert(title?: string) {
  
  return {
    title: title || "¿Estas seguro de guardar este elemento?",
    description: "Podrás modificarla en cualquier momentos",
    cancelTitle: "Cancelar",
    okTitle: "Guardar"
  }
}

export function configsForDelete(title?: string) {
  
  return {
    title: title || "¿Estas seguro de eliminar este elemento?",
    description: "Este cambio no se podrá deshacer",
    cancelTitle: "Cancelar",
    deleteTitle: "Eliminar"
  }
}

