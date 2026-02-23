// AGTableComponent.tsx

"use client"

import { AllCommunityModule, ColDef, ModuleRegistry, LocaleModule, themeQuartz } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { AG_GRID_LOCALE_ES } from '@ag-grid-community/locale'
import React, { useCallback, } from 'react'
import CustomHeader from './custom-header'

ModuleRegistry.registerModules([LocaleModule, AllCommunityModule])

export const AgGridReactTable = AgGridReact;

type AGTableComponentProps = {
  rowData: any[],
  colDef: ColDef<any, any>[],
  context?: any,
  defaultPaginationSize?: number;
  totalElements?: number;
  maxPages?: number;
  currentPage?: number;
  onPageChange?(): void;
  whiteMode?: boolean
}

const defaultColDef = {
  flex: 1,
  filter: true,
  suppressMovable: true,
  resizable: false,
  sortable: true,
  minWidth: 100,
  headerComponent: CustomHeader,
};

const myTheme = themeQuartz
  .withParams({
    accentColor: "var(--primary)",
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    browserColorScheme: "light",
    rowVerticalPaddingScale: 1.30,
    chromeBackgroundColor: {
      ref: "foregroundColor",
      mix: 0.07,
      onto: "backgroundColor"
    },
    fontFamily: "inherit",
    foregroundColor: "var(--foreground)",
    headerFontSize: 13,
    headerFontWeight: 700,
    headerBackgroundColor: "var(--muted)",
    wrapperBorderRadius: 10,
  });

const myDarkTheme = myTheme
  .withParams({
    // Cambiamos el esquema a oscuro
    browserColorScheme: "dark",
    
    // El fondo debe ser oscuro. Si usas variables CSS de Tailwind/Shadcn:
    backgroundColor: "#09090b", // O "var(--background)" si está definida
    foregroundColor: "#fafafa", // O "var(--foreground)"
    
    // Ajustamos los colores de la "interface" de la tabla
    chromeBackgroundColor: {
      ref: "foregroundColor",
      mix: 0.05, // Mezcla sutil para los bordes y paneles
      onto: "backgroundColor"
    },

    // El color de énfasis (selecciones, checkboxes)
    accentColor: "var(--primary)",
    
    // Fondo de la cabecera (usando tu variable de color suave)
    headerBackgroundColor: "var(--muted)",
    
    // Colores de las líneas divisorias
    borderColor: "var(--border)",
  });

export const TableThemeWhite = myTheme;
  
export default function AGTableComponent({ rowData, colDef, context, defaultPaginationSize, currentPage, onPageChange, totalElements, maxPages, whiteMode, ...props }: AGTableComponentProps) {
  // por integracion de paginacion con:
  // totalElements?: number;
  // maxPages?: number;
  // currentPage?: number;
  // onPageChange?(): void;

  return (
    <div style={{ height: '100%', width: '100%', }}>
      <AgGridReact
        localeText={AG_GRID_LOCALE_ES}
        theme={whiteMode? myTheme : myDarkTheme}
        rowModelType={maxPages? 'infinite' : "clientSide"}
        rowData={rowData}
        columnDefs={colDef}
        defaultColDef={defaultColDef}
        paginationPageSize={defaultPaginationSize}
        pagination={true}
        animateRows={false}
        paginationPageSizeSelector={[10]}
        onGridReady={x => {
          
        }}
        
        domLayout='autoHeight'

        
        onPaginationChanged={x => {
          // console.log(x.api.paginationGetCurrentPage())
        }}
        context={context}
        {...props}
      />
    </div>
  )
}