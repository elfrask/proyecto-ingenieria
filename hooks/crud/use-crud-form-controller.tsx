"use client"

import { onItemAttribute } from "@/components/commons/crud-component/crud-component";
import { useFormControllerReturn } from "@/components/commons/react-hook-form-component/form-context"
import { onSubmitType } from "@/components/commons/react-hook-form-component/form-provider/form-component";
import { useState } from "react";
import { FieldValues } from "react-hook-form"


export interface useCrudFormControllerProps<
  Tf extends FieldValues = FieldValues
> {
  formState?: useFormControllerReturn<Tf>;
  data: Tf[];
  onChangeData?: (data: Tf[]) => void
};

export interface useCrudFormControllerReturn<
  Tf extends FieldValues = FieldValues
> {
  formState?: useFormControllerReturn<Tf>;
  data: crudItem<Tf>[];
  currentItem: crudItem<Tf> | undefined | null
  setData: (data: crudItem<Tf>[]) => void
  onItem: (cb?: onItemAttribute) => onItemAttribute;
  onSubmit: (cb?: onSubmitType<crudItem<Tf>>) => onSubmitType<crudItem<Tf>>;
  getData: () => Tf[];
  add: (item: Tf | crudItem<Tf>) => void;
  update: (_id: symbol, item: Tf | crudItem<Tf>) => void;
  delete: (_id: symbol, index: number) => void;
  indexItem: number;

};

export type crudItem<Tf extends FieldValues = FieldValues> = {
  _id?: symbol
} & Tf

export function assignId<Tf extends FieldValues = FieldValues>(data: (Tf[] | crudItem<Tf>)) {

  return data.map((x: { _id: any; }) => ({ ...x, _id: x._id || Symbol() }))
}

export function useCrudFormController<Tf extends FieldValues = FieldValues>({
  formState, data, onChangeData
}: useCrudFormControllerProps<Tf>): useCrudFormControllerReturn<Tf> {

  const onItem: (cb?: onItemAttribute) => onItemAttribute =
    (cb?: onItemAttribute) => (item: crudItem<Tf>, action, pre, index) => {
      pre();

      switch (action) {
        case "delete":
          set(({
            indexItem: -1,
            currentItem: null,
            data: _v.data.filter((x,y) => index !== y)
          }))
          _v.formState?.handlersForm?.handlerReset(true);
          break;
        case "create":

          break;
        case "edit":
          set({ currentItem: item, indexItem: index })
          break;
        default:
          break;
      }
      if (cb) {
        cb(item, action, pre, index)
      }
    }
  const onSubmit: (cb?: onSubmitType<crudItem<Tf>>) => onSubmitType<crudItem<Tf>> =
    (cb?: onSubmitType<crudItem<Tf>>) => (item, reset) => {
      // console.log(_v, item)

      if (cb) {
        cb(item, reset)
      }

      if (_v.currentItem) {
        set({
          currentItem: null,
          indexItem: -1,
          data: _v.data.map((x, y) => y === _v.indexItem ?
            { ..._v.currentItem, ...item } :
            x
          )
        })

      } else {
        set({
          data: [
            ..._v.data,
            { ...item, _id: Symbol() }
          ]
        })
      }
      _v.formState?.handlersForm?.handlerReset(true);




    }


  function setData(data: (crudItem<Tf> | Tf[])[]) {
    set({
      data: data.map(x => ({ ...x, _id: (x as any)._id || Symbol() })) as any
    })
  }

  function getData(): Tf[] {
    return _v.data.map(x => {
      x._id = undefined;
      return x
    })
  }

  function add(item: Tf | crudItem<Tf>) {

    set({
      data: [
        ..._v.data,
        { ...item, _id: Symbol() } as any
      ]
    })
  }

  function _update(_id: symbol, item: Tf | crudItem<Tf>) {

    set({
      indexItem: -1,
      currentItem: null,
      data: _v.data.map((x, y) => y === _v.indexItem ?
        { ..._v.currentItem, ...item } :
        x
      )
    })
  }


  function _delete(_id: symbol, index: number) {

    set(({
      currentItem: null,
      indexItem: -1,
      data: _v.data.filter((x, y) => index !== y)
    }))
  }

  function set(values: Partial<useCrudFormControllerReturn<Tf>>) {
    _sv(Object.assign(_v, {
      onItem,
      setData,
      getData,
      onSubmit,
      add,
      update: _update,
      delete: _delete,
      ...values,
    }));

    if (values.data) {
      if (onChangeData) {
        onChangeData(values.data)
      }
    }

    update(x => x + 1)
  }

  const [_, update] = useState(0);
  const [_v, _sv] = useState<useCrudFormControllerReturn<Tf>>({
    data: data.map(x => ({ ...x, _id: x._id || Symbol() })),
    formState,
    currentItem: undefined,
    indexItem: -1,
    onItem,
    setData,
    onSubmit,
    getData,
    add,
    update: _update,
    delete: _delete
  });

  return _v
}