import { createContext, useContext } from "react";

interface CrudContextType {
  isEditing: boolean;
  openCreateForm: () => void;
  closeForm: () => void;
}

export const CrudContext = createContext<CrudContextType|undefined>(undefined);



export function useCrud() {
    const context = useContext(CrudContext)

    if (!context) {
        throw "Debes de establecer un <CrudProvider> para hacer uso de esta funcion"
    }

    return context
}

