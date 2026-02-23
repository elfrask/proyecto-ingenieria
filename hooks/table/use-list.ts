import { isArray } from "lodash";
import { useEffect, useState } from "react";
import { useSelectList, useSelectListMethods } from "./use-select";

export type queryList<T> = T[] | (() => T[]) | Promise<T[]> | (() => Promise<T[]>)

export interface useListReturn<T> {
  list: T[];
  update: (index: number, value: T) => void;
  /**
   * 
   * @param index El index del elemento que desea alterar
   * @param value El objeto que desea rescribir (esa función solo se usa cuando, posee elementos complejos) en caso de usar primitivos solo usar `update(index, value)`
   */
  insertAndUpdate: (index: number, value: Partial<T>) => void;
  remove: (index: number) => void;
  select: (index: number) => T | undefined;
  unSelect: () => void;
  get: (index: number, _default?: T) => T | undefined;
  push: (value: T) => void;
  add: (value: T) => void;
  set: (value: T[]) => void;
  newInstance: () => void;
  reload: () => void;
  selected: T | undefined;
  current: number;
  instanceID: string;
  tableController: {
    selects: useSelectListMethods<T>
  }
}

export interface OptionList<T = any> {
  handlerOpen?: (value: boolean) => void;
  onChange?: (value: T[]) => void;
  onSelect?: (value: number[]) => void;
  defaultSelect?: number[]
}

export function useList<T>(init: queryList<T>, options?: OptionList<T>): useListReturn<T> {

  const [current, setCurrent] = useState(-1);
  const [list, _setList] = useState<T[]>(isArray(init) ? init : []);
  const [instanceID, setInstanceId] = useState(crypto.randomUUID());
  const [__selected, __setSelect] = useState<number[]>(options?.defaultSelect || [])
  

  const {controls: selectControls} = useSelectList(__selected, list, (v) => {
    options?.onSelect?.(v)
    __setSelect(v)
  });

  function GenerateId() {
    setInstanceId(
      crypto.randomUUID()
    )
  }

  function handlerOpen(v: boolean) {
    options?.handlerOpen?.(v);
    GenerateId()

  }
  function setList(value: T[]) {
    options?.onChange?.(value);
    _setList(value)
  };

  function reset() {
    setCurrent(-1);
    handlerOpen(false);
    setCurrent(-1)
  }

  function loadDataQuery(query: queryList<T>) {
    if (typeof query === "function") {
      query = query();
    }

    if (isArray(query)) {
      if (query !== list) {
        _setList(query)
      }
      return
    };

    if (query instanceof Promise) {
      query.then(x => _setList(x));
      return
    }


  };


  useEffect(() => loadDataQuery(init), [])


  const me: useListReturn<T> = {
    current,
    list,
    selected: list[current] as T,
    instanceID,
    get(index, _default) {
      return list[index] || _default
    },
    remove(index) {
      setList(list.filter((x, y) => y !== index));
      handlerOpen(false)

    },
    insertAndUpdate(index, value) {
      const i = list[index] || {} as T;
      me.update(index, {
        ...i,
        ...value
      })
    },
    update(index, value) {
      setList(
        list.map((x, y) => y === index ? value : x)
      );
      handlerOpen(false)

    },
    add(value) {
      handlerOpen(false)

      setList([...list, value])
    },
    push(value) {
      handlerOpen(false)
      if (current === -1) {
        setList([...list, value])
        return
      };

      me.update(current, value);

      setCurrent(-1)
    },
    set(value) {
      setList(value)
      handlerOpen(false)
      setCurrent(-1)
    },
    select(index) {
      const sl = list[index] as T;
      if (sl === undefined) {
        return undefined
      };

      setCurrent(index);
      handlerOpen(true)
      return sl
    },
    unSelect() {
      setCurrent(-1)
    },
    newInstance() {
      setCurrent(-1);
      GenerateId();
      handlerOpen(true)
    },
    reload() {
      reset();
      loadDataQuery(init)
    },
    
    tableController: {
      selects: selectControls
    }
  };

  return me
}