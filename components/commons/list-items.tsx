import { cn } from "@/lib/utils";
import { Edit, Trash2 } from "lucide-react";
import { FunctionComponent, ReactNode, useMemo } from "react";
import { ActionButton } from "./table/columns";
import { SimpleAlert } from "./fast-dialog";
import { useOpenState } from "@/hooks/states/openState";


export interface Items {
  label: ReactNode;
}

interface ListItemsProps {
  data: Items[];
  className?: string,
  onDelete?: (i: number) => void;
  onEdit?: (i: number) => void;
  titleAlertDelete?: string;
  descriptionAlertDelete?: string;
}

const ListItems: FunctionComponent<ListItemsProps> = ({
  data, className, onDelete, descriptionAlertDelete, titleAlertDelete, onEdit
}) => {

  const _data = useMemo(() => {

    return data.map((x, y) => ({ ...x, __id__: y }));
  }, [data]);



  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {
        useMemo(() => {

          return (_data.map((x, y) =>
            <ItemElement 
              key={y}
              item={x} 
              index={y} 
              title={titleAlertDelete} 
              description={descriptionAlertDelete} 
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        }, [_data])
      }
    </div>
  );
}

interface ItemElementProps {
  title?: string;
  description?: string;
  item: Items & {__id__?: number};
  index: number;
  onDelete?: (i: number) => void;
  onEdit?: (i: number) => void;

}

function ItemElement({
  item, description, title, index, onDelete, onEdit
}: ItemElementProps) {

  const x = item;
  const y = index;
  const open =useOpenState();
  return (
    <div key={y} className="p-1 border bg-muted flex flex-row flex-wrap *:h-auto rounded-lg">
      <SimpleAlert
        title={title || "¿Estas seguro de que quieres eliminar este elemento?"}
        description={description || "Esta acción no se podrá deshacer"}
        open={open}
        onCancel={x =>{
          open.close()
        }}
        onDelete={t => {
          onDelete?.(x.__id__ as number)
        }}
      />
      <div className="flex-1 flex items-center justify-start px-2 text-pretty">
        {x.label}
      </div>
      <div className="w-16 px-2 gap-2 flex items-center justify-center">
        {/* <Trash2 className="cursor" onClick={}/> */}
        {
          onEdit &&
          <ActionButton
            icon={Edit}
            className="text-indigo-600 hover:text-indigo-900"
            onClick={t => {
              onEdit?.(x.__id__ as number)
            }}
            title="Editar"
            />
        }
        {
          onDelete && 
          <ActionButton
            icon={Trash2}
            className="text-red-600 hover:text-red-900"
            onClick={t => {
              open.open()
            }}
            title="Eliminar"
          />
        }
        
      </div>
    </div>
  )
}


export default ListItems;