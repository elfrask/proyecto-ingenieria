import SimpleDialog from "@/components/commons/fast-dialog"
import { useOpenState } from "../states/openState"
import { Eye, LucideIcon } from "lucide-react"
import { ReactNode } from "react"

interface Options {
  title?: string
  aboutTitle?: string,
  description?: string,
  Icon?: LucideIcon
}

export function useModalView<T>(list: T[], {aboutTitle, Icon, description, title, } : Options) {
  const openView = useOpenState(false, {initialContext: -1})

  return {
    openView,
    view: (index: number) => openView.open(index),
    ViewModalNode: (render: (value: T, index: number) => ReactNode) => (
      <SimpleDialog
        title={title||  "Información sobre " + (aboutTitle || "el elemento")}
        description={description || "Información detallada sobre " + (aboutTitle || "ël elemento")}
        separator
        icon={Icon||Eye}
        open={openView}
        onCancel={x => openView.close()}
      >
        {openView.ctx !== -1 && render(list[openView.ctx], openView.ctx)}
      </SimpleDialog>
    )
  }
}