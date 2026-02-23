export type SheetComponentProps = {
  codigo?: string
  item?: Record<string, any>
  open: boolean
  onClose: () => void
  title?: string,
  createTitle?: string
  editTitle?: string
  onSave?: (value: any) => void
}