"use client"

import {
  ColumnDef,
  ColumnFilter,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { CustomColumnProps } from "@/types/table.types"

type IntersectedColumnDef<TData, TValue> = ColumnDef<TData, TValue> & CustomColumnProps
interface DataTableComponentProps<TData extends Record<string, any>, TValue> {
  columns: IntersectedColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTableComponent<TData extends Record<string, any>, TValue>({
  columns,
  data,
}: DataTableComponentProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // filtro global robusto (convierte objetos y nulos a texto)
    globalFilterFn: (row, columnId, filterValue) => {
      const rawValues = Object.values(row.original as Record<string, any>)
      const joined = rawValues
        .map((v) =>
          v === null || v === undefined
            ? ""
            : typeof v === "object"
              ? JSON.stringify(v)
              : String(v)
        )
        .join(" ")

      return joined.toLowerCase().includes(String(filterValue).toLowerCase())
    },
  })

  console.log(table.getState().columnFilters)

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-end px-4 pb-2">
        <Input
          placeholder="Buscar..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="overflow-x-auto max-w-full">
        <Table className="w-full min-w-max text-sm text-left">
          <TableHeader className="bg-green-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const colDef = header.column.columnDef as IntersectedColumnDef<TData, TValue>
                  const colClass = colDef.classNameHeader

                  return (
                    <TableHead key={header.id} className={`px-4 py-2 font-medium text-muted-foreground ${colClass || ''}`}>
                      <div className="flex gap-1 justify-center items-center">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        <Button
                          variant="ghost"
                          onClick={() => header.column.toggleSorting(header.column.getIsSorted() === "asc")}
                          className="hover:bg-muted"
                        >
                          {(header.id === 'actions' || header.id === 'img') ? "" : <ArrowUpDown className="h-2 w-2" />}
                        </Button>
                      </div>
                    </TableHead>
                  )
                }
                )}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="border-b hover:bg-muted/50">
                  {row.getVisibleCells().map((cell) => {
                    const colDef = cell.column.columnDef as IntersectedColumnDef<TData, TValue>
                    const cellClass = colDef.classNameCell || colDef.classNameHeader

                    return (
                      <TableCell key={cell.id} className={`px-4 py-2 whitespace-nowrap ${cellClass || ''}`}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end px-2">
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Registros por página</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 25, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Primero</span>
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Anterior</span>
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Siguiente</span>
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Último</span>
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}