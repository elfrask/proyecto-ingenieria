// "use server"
// import { FunctionComponent } from "react";
// import { TableComponentProps, ColumTable, RowDataElement, RenderTable, TypeCell, MapFunction, TableComponent } from "./table";
// import AGTableComponent, { AgGridReactTable, TableThemeWhite } from "../data-table/ag-grid-table";
// import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";
// import type { ColDef, ICellRendererParams,  } from "ag-grid-community";
// import type { CustomCellRendererProps } from "ag-grid-react";


// function columnConvert<ctx>(x: ColumTable, context: ctx): ColDef {
//   return {
//     headerName: (typeof x.label === "function" ? x.label(context) : x.label) as string,
//     field: x.key,
//     cellRenderer: x.render ? ((params: CustomCellRendererProps & ICellRendererParams) => {
//       if (x.render) {
//         return x.render(params.value, params.data, params.data.__id__ as number, context)
//       }
//     }) : undefined,
//     ...(!x.filterDisabled ? {} : { minWidth: 100, filter: false, hide: false, sortable: false }),
//     maxWidth: x.maxWidth,
//     minWidth: x.minWidth,
//     width: x.width
//   }
// }

// interface TableServerSideProps extends TableComponentProps {

// }

// const TableServerSide: FunctionComponent<TableServerSideProps> = ({
//   columns,
//   data,
//   context,
// }) => {


//   const columnas = columns.map(x => {
//     return columnConvert(x, context)
//   });

//   // return (
//   //   <AgGridReactTable 
//   //     rowData={data}
//   //     columnDefs={columnas}
//   //     theme={TableThemeWhite}
//   //     localeText={AG_GRID_LOCALE_ES}
//   //     domLayout="autoHeight"
//   //     paginationPageSizeSelector={[1000000]}
//   //     paginationPageSize={1000000}
//   //     context={context}
//   //   />
//   // );
//   return "tabla"
// }

// export default TableServerSide;


// components/StaticReportTable.tsx
import React from 'react';
import type { ColumTable } from './table';

interface Props<T, CTX> {
  data: T[];
  columns: ColumTable<T>[];
  context?: CTX
}

export default function StaticReportTable<T, C>({ data, columns, context }: Props<T, C>) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full text-sm text-left">
        <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
          <tr>
            {columns.map((col) => (
              <th 
                key={col.key} 
                style={{ width: col.width, minWidth: col.minWidth, maxWidth: col.maxWidth }}
                className="px-4 py-3"
              >
                {typeof col.label === 'function' ? col.label({} as any) : col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-muted/30 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-foreground">
                    {col.render 
                      ? col.render(row[col.key], row, rowIndex, context) 
                      : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                No se encontraron registros en este periodo.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}