"use client"
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import { CustomCellRendererProps, } from 'ag-grid-react'
import React, { FunctionComponent, ReactNode, useEffect, useMemo, useState } from "react";
import AGTableComponent from '../data-table/ag-grid-table';
import { ActionButton, SwitchCommand } from './columns';
import { Edit, Trash2 } from 'lucide-react';
import { useOpenState } from '@/hooks/states/openState';
import { SimpleAlert } from '../fast-dialog';
import { ActionButtonVerDetalles } from './simpleActionsButtons/detalles-button';
import { Input } from '@/components/ui/input';
import { usePreserve } from '@/hooks/usePreserve';
import { range } from 'lodash';

export type TypeCell = ReactNode
export type RenderTable<T = any, U = any, ctx = any> = (value: T, row: U, index: number, ctx: ctx, ...p: any[]) => TypeCell

export function columnConvert<ctx>(x: ColumTable, context: ctx): ColDef {
  return {
    headerName: (typeof x.label === "function" ? x.label(context) : x.label) as string,
    field: x.key,
    cellRenderer: x.render ? ((params: CustomCellRendererProps & ICellRendererParams) => {
      if (x.render) {
        return x.render(params.value, params.data, params.data.__id__ as number, context)
      }
    }) : undefined,
    ...(!x.filterDisabled ? {} : { minWidth: 100, filter: false, hide: false, sortable: false }),
    maxWidth: x.maxWidth,
    minWidth: x.minWidth,
    width: x.width
  }
}




export interface ColumTable<U = any, CTX = any> {
  key: Extract<keyof U, string>;
  label: ReactNode | ((ctx: CTX) => ReactNode);
  render?: RenderTable<any, U, CTX>;
  orderDisabled?: boolean;
  filterDisabled?: boolean;
  width?: number
  maxWidth?: number
  minWidth?: number
};

interface MasterDetail {
  data: any
};

export type MapFunction<T, CTX, Return=void> = (row: T, index: number, ctx: CTX) => Return
// export type MapFunction<T, CTX> = (row: T, index: number, ctx: CTX) => void

export interface TableComponentProps<T = any, CTX = any> {
  data: T[];
  columns: ColumTable[];
  columnsVersion?: string | number;
  context?: CTX,
  onEdit?: (i: number) => void;
  onView?: (i: number) => void;
  onDelete?: (i: number) => void;
  
  onSelected?: (i: number[]) => void;
  selected?: number[];
  selectDisable?: MapFunction<T, CTX, boolean>;

  /**
   * Integracion para paginacion en desarrollo
   */
  currentPage?: number;
  totalElements?: number;
  onPageChange?(): void;
  maxPages?: number;

  
  /**
   * 
   * @param i Index
   * @param x nuevo Estado
   * @returns 
   * @implements Requiere que la lista posea un valor "status" en cada atributo o establecer la clave personalizada en "statusKey"
   */
  onSwitchStatus?: (i: number, status: boolean) => void;
  statusKey?: string;
  masterDetailRender?: FunctionComponent<MasterDetail>;
  customActions?: RenderTable;
  leftCustomActions?: RenderTable;
  sizesPages?: number[];
  filter?: MapFunction<T, CTX>;
  filterDepends?: any[];
  defaultSizePage?: number;
  forceRender?: boolean;
  titleAlertDelete?: string;
  descriptionAlertDelete?: string;


  titleEnableStatus?: string;
  descriptionEnableStatus?: string;

  titleDisableStatus?: string;
  descriptionDisableStatus?: string;
  whiteMode?: boolean



};

export type RowDataElement<T> = T & { __id__: number }

export function TableComponent<T, ctx = undefined>({
  columns,
  columnsVersion,
  data,

  sizesPages,
  defaultSizePage,

  currentPage,
  onPageChange,
  maxPages,
  totalElements,

  whiteMode,

  onDelete,
  onEdit,
  onSwitchStatus,
  onView,
  filter,
  filterDepends,

  onSelected,
  selected: __selected,
  selectDisable,

  context,
  forceRender,

  titleAlertDelete,
  descriptionAlertDelete,

  statusKey,
  titleEnableStatus,
  descriptionEnableStatus,

  titleDisableStatus,
  descriptionDisableStatus,

  customActions,
  leftCustomActions

}: TableComponentProps<T, ctx>) {

  let [_col, set_col] = useState([]);
  const [colVersion, setColVersion] = useState<string | number | undefined>(columnsVersion);
  const modalDeleteOpen = useOpenState();
  const [deleteIndex, setDI] = useState(-1);
  const [_selected, setSelect] = useState<number[]>([])

  const selected = __selected || _selected


  const constrolsSelectConst = {
    handlerOnSelect(sel: number[]) {
      const sel2 = sel.sort((a, b) => a - b)
      onSelected?.(sel2)
      setSelect(sel2)
    },
    add(sel: number[]) {
      const a = sel.filter(x => !selected.includes(x));
      const out = ([...selected, ...a])
      // console.log("debug:", a, sel, selected)

      constrolsSelect.handlerOnSelect(out)
    },
    remove(sel: number[]) {
      const out = (selected.filter(x => !sel.includes(x)));
      constrolsSelect.handlerOnSelect(out)
    },
    selectAll() {
      const out = ([...rowData.map(x => x.__id__)])
      constrolsSelect.handlerOnSelect(out)
    },
    removeAll() {
      constrolsSelect.handlerOnSelect([])
    },
    selectList: selected

  }

  const constrolsSelect = usePreserve(() => constrolsSelectConst)
  Object.assign(constrolsSelect, constrolsSelectConst);


  async function setCol(col: ColumTable[]) {
    const v1 = JSON.stringify(col);
    const v2 = JSON.stringify(_col);

    if (v1 !== v2 || colVersion !== columnsVersion) {
      set_col(col as any)
      setColVersion(columnsVersion);
    }
  }

  useEffect(() => {
    setCol(columns)
  }, [columns, columnsVersion])


  function handlerEdit(index: number) {
    if (onEdit) {
      onEdit(index)
    }
  }
  function handlerDelete(index: number) {
    if (onDelete) {
      onDelete(index)
    }
  }


  const ActionsButtons: RenderTable = (value, model, index) => {


    return (
      <div className='flex flex-row gap-3 items-center w-full h-full'>
        {
          leftCustomActions &&
          leftCustomActions(value, model, index, context) as ReactNode
        }
        {
          onView &&
          <ActionButtonVerDetalles
            onClick={x => onView(index)}
          />
        }
        {
          onEdit &&
          <ActionButton
            title='Editar'
            icon={Edit}
            className='text-indigo-600 hover:text-indigo-900'
            onClick={x => handlerEdit(index)}
          />
        }
        {
          onDelete &&
          <ActionButton
            title='Eliminar'
            icon={Trash2}
            className='text-red-500 hover:text-red-900'
            onClick={x => {
              modalDeleteOpen.set(true);
              setDI(index)
            }}
          />
        }
        {
          onSwitchStatus &&
          <SwitchCommand
            value={model[statusKey || "status"]}

            titleEnable={titleEnableStatus}
            descriptionEnable={descriptionEnableStatus}

            titleDisabled={titleDisableStatus}
            descriptionDisabled={descriptionDisableStatus}

            onValueChange={x => {
              onSwitchStatus(index, x)
            }}
          />
        }
        {
          customActions &&
          customActions(value, model, index, context) as ReactNode
        }
      </div>
    )
  }


  if (forceRender) {
    data = [...data];
    _col = [..._col];
  }

  function isSelectNotDisable(x: RowDataElement<T>, index?: number) {
    return !selectDisable?.(x, index || x.__id__, context as ctx)
  }

  const selectColumns: ColumTable = {
    key: "__Select/0\\__",
    label() {

      const seleccionados: number[] = _finallyRowData.filter(x => (
        isSelectNotDisable(x) && selected.includes(x.__id__)
      )).map(x => (x.__id__));

      return (
        <Input
          type='checkbox'
          className="w-4 h-4"
          checked={(seleccionados.length > 0)}
          onChange={(x) => {
            const e = x.target.checked
            const sel: number[] = _finallyRowData.filter(x => isSelectNotDisable(x)).map(x => x.__id__)


            if (e) {
              return constrolsSelect.add(sel)
            };

            return constrolsSelect.remove(sel)
          }}
        />
      )
    },
    maxWidth: 75,
    filterDisabled: true,
    orderDisabled: true,
    render(v, r, i) {

      const value = selected.includes(i);

      return (
        <Input
          type='checkbox'
          defaultChecked={value}
          disabled={!isSelectNotDisable(r)}
          className="w-4 h-4"
          onClick={x => {
            const _value = !value
            
            
            if (x.shiftKey) {
              const dta: number[] = _finallyRowData.map(x => x.__id__);
              let listMultiple = [] // elementos para seleccionar
              const selfIndex = i
              let neighborIndex = -1; // index identificador del objeto en la lista
              let IndexOfNeighborIndex = -1; // index de la lista filtrado

              for (let ii = 0; ii < selected.length; ii++) {
                const element = selected[ii];
                
                if (element > selfIndex) {
                  if (neighborIndex !== -1) {
                    break
                  };
                  neighborIndex = element;
                  break;
                }

                if (element < selfIndex) {
                  neighborIndex = element;
                };
              }

              if (neighborIndex === -1) {
                neighborIndex = 0;
              }

              let rango: number[] = [];

              if (neighborIndex < selfIndex) {
                rango = range(neighborIndex, selfIndex + 1);
              } else {
                rango = range(selfIndex, neighborIndex + 1);
              }

              rango = rango.filter(x => dta.includes(x));

              return constrolsSelect.add(rango)
            }

            if (_value) {
              return constrolsSelect.add([i])
            }

            return constrolsSelect.remove([i])


          }}
        />
      )
    }

  }




  let rowData: RowDataElement<T>[] = useMemo(() => data.map((x, y) => ({ ...x, __id__: y })), [data]);

  const _finallyRowData = useMemo(() =>
    filter ?

      rowData.filter((x, y) => {
        return filter(x, y, context as ctx)
      })
      :
      rowData

    , [data, ...(filterDepends || [])])

  // isChange(rowData, "lista");
  // isChange(columnas, "Columnas");

  let columnas: ColDef<any, any>[] = useMemo(() => {


    let col: ColumTable[] = [
      ...(onSelected ? [
        selectColumns
      ] : []),

      ...columns
    ];

    if (onEdit || onDelete || customActions || leftCustomActions || onSwitchStatus || onView) {
      col.push(({
        key: "____/-’0____",
        label: "Acciones",
        filterDisabled: true,
        render: ActionsButtons,
        width: 120,
        maxWidth: 160,
      }))
    };

    return col.map(x => columnConvert(x, context))
  }, [
    _col, String(onEdit), String(onDelete), String(onSelected),
    String(customActions), String(leftCustomActions),
    String(onSwitchStatus), String(onView), data, selected, 
    ...(filterDepends || [])
  ])

  return (
    <>
      <SimpleAlert
        title={titleAlertDelete || 'Estas a punto de eliminar un elemento'}
        description={descriptionAlertDelete || 'Este cambio no se podrá deshacer'}
        onCancel={x => modalDeleteOpen.set(false)}
        deleteTitle='Eliminar'
        cancelTitle='Cancelar'
        open={modalDeleteOpen}
        onDelete={x => {
          handlerDelete(deleteIndex)
          modalDeleteOpen.set(false)
        }}
      />
      <AGTableComponent
        colDef={columnas}
        rowData={_finallyRowData}
        defaultPaginationSize={defaultSizePage}
        maxPages={maxPages}
        totalElements={totalElements}
        context={context}
        currentPage={currentPage}
        onPageChange={onPageChange}
        whiteMode={whiteMode}
      />
    </>
  )
}




