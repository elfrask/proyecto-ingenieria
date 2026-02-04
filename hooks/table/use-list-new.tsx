import { isArray } from "lodash";
import { useEffect, useState } from "react";
import { useSelectList, useSelectListMethods } from "./use-select";
import { useStateObject } from "../useStateObject";
import { usePagination } from "./use-pagination";
import { AxiosResponseServer } from "@/lib/utils";

export type queryList<T, CTX> = 
  T[] | // lista
  ((ctx: CTX) => T[]) | // funcion que devuelve lista 
  Promise<T[]> | // promesa que devuelve lista
  ((ctx: CTX) => Promise<T[]>) | // funcion que devuelve promesa que devuelve lista 
  ((ctx: CTX) => Promise<AxiosResponseServer<T[]>>) | // funcion que devuelve un axios response
  Promise<AxiosResponseServer<T[]>> // axios response

export interface useListReturn<T, CTX> {
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
  context: CTX;
  set: (value: T[]) => void;
  newInstance: () => void;
  reload: (ctx?: CTX) => void;
  selected: T | undefined;
  loading: boolean;
  current: number;
  instanceID: string;
  tableController: {
    selects: useSelectListMethods<T>
  }
}

export interface OptionList<T = any, CTX=any, Reload = useListReturn<T, CTX>["reload"]> {

  // Parámetros de control de tablas

  /**
   * @description Función para manejar la apertura o cierre de un componente asociado.
   * @param value Valor booleano que indica si el componente debe abrirse (true) o cerrarse (false).
   */
  handlerOpen?: (value: boolean) => void;

  /**
   * @description Función que se ejecuta cuando la lista cambia.
   * @param value Lista actualizada de elementos.
   */
  onChange?: (value: T[]) => void;

  /**
   * @description Función que se ejecuta cuando se seleccionan elementos de la lista.
   * @param value Arreglo de índices de los elementos seleccionados.
   */
  onSelectItems?: (value: number[]) => void;

  /**
   * @description Índices de los elementos seleccionados por defecto al inicializar la lista.
   */
  defaultSelectItems?: number[];

  /**
   * @description Contexto predeterminado que se utilizará en la lista.
   */
  defaultContext?: CTX;

  // Parámetros para integración

  /**
   * @description Función para cargar datos adicionales dinámicamente cuando se selecciona un elemento de la lista.
   * @param listFromData Elemento seleccionado de la lista, debe tener un identificador único.
   * @param index Índice del elemento en la lista.
   * @param pushSelect Función para cargar el elemento seleccionado dinámicamente.
   */
  onSelect?(listFromData: T, index: number, pushSelect: (res: T) => void): void; // integrado

  /**
   * @description Función que se ejecuta cuando un elemento de la lista se actualiza.
   * @param newData Nuevo dato que reemplazará al existente.
   * @param originalData Dato original que será reemplazado.
   * @param index Índice del elemento en la lista.
   * @param pushReload Función para emitir una recarga si es necesario.
   */
  onUpdate?(newData: T, originalData: T, index: number, pushReload: Reload): void; // integrado

  /**
   * @description Función para actualizar parcialmente un elemento de la lista.
   * @param newData Datos parciales que se actualizarán.
   * @param originalData Dato original que será actualizado.
   * @param index Índice del elemento en la lista.
   * @param pushReload Función para emitir una recarga si es necesario.
   */
  onPartialUpdate?(newData: Partial<T>, originalData: T, index: number, pushReload: Reload): void; // integrado

  /**
   * @description Función para actualizar completamente un elemento de la lista.
   * @param newData Nuevo dato que reemplazará al existente.
   * @param originalData Dato original que será reemplazado.
   * @param index Índice del elemento en la lista.
   * @param pushReload Función para emitir una recarga si es necesario.
   */
  onFullUpdate?(newData: T, originalData: T, index: number, pushReload: Reload): void; // integrado

  /**
   * @description Función que se ejecuta cuando se elimina un elemento de la lista.
   * @param originalData Dato que será eliminado.
   * @param index Índice del elemento en la lista.
   * @param pushReload Función para emitir una recarga si es necesario.
   */
  onDelete?(originalData: T, index: number, pushReload: Reload): void; // integrado

  /**
   * @description Función que se ejecuta cuando se crea un nuevo elemento en la lista.
   * @param newData Dato que será creado.
   * @param index Índice del nuevo elemento en la lista.
   * @param pushReload Función para emitir una recarga si es necesario.
   */
  onCreate?(newData: T, index: number, pushReload: Reload): void; // integrado

  /**
   * @description Función que se ejecuta cuando se cargan datos en la lista.
   * @param data Datos cargados en la lista.
   */
  onLoad?(data: T[]): void; // integrado

  /**
   * @description Función que se ejecuta cuando ocurre un error al cargar datos en la lista.
   * @param errorCode Código de error.
   * @param errorMessage Mensaje descriptivo del error.
   * @param errorData Datos adicionales relacionados con el error.
   */
  onErrorLoad?(errorCode: number, errorMessage: string, errorData: any): void; // integrado
}

export interface PropsLoad<T, CTX> {
  context: NoInfer<CTX>;
  pagination: {
    page: number
  }
}

export function useListNew<T, CTX extends Record<string, any>>(init: queryList<T, PropsLoad<T, NoInfer<CTX>>>, options?: OptionList<T, CTX>): useListReturn<T, CTX> {

  const [current, setCurrent] = useState(-1);
  const [list, _setList] = useState<T[]>(isArray(init) ? init : []);
  const [instanceID, setInstanceId] = useState(crypto.randomUUID());
  const [loading, setLoading] = useState(false);
  const [selectedOverload, setSelectedOverload] = useState<T | undefined>();
  const [__selected, __setSelect] = useState<number[]>(options?.defaultSelectItems || [])
  const context = useStateObject(options?.defaultContext || {} as CTX);
  const pagination = usePagination({
    defaultPage: 0
  })
  
  useEffect(() => {
    if (current === -1) {
      setSelectedOverload(undefined)
    }
  }, [current])

  const {controls: selectControls} = useSelectList(__selected, list, (v) => {
    options?.onSelectItems?.(v)
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

  function loadDataQuery(query: queryList<T, PropsLoad<T, NoInfer<CTX>>>) {
    setLoading(true);
    if (typeof query === "function") {
      query = query({
        context: context.state,
        pagination: {
          page: 0
        }
      });
    }

    if (isArray(query)) {
      if (query !== list) {
        options?.onLoad?.(query)
        _setList(query);
      }
      setLoading(false)
      return
    };

    if (query instanceof Promise) {
      query.then(x => {

        if (Array.isArray(x)) {
          // setLoading(false)
          options?.onLoad?.(x)
          return _setList(x)
        }
        
        const ee = Array.isArray(x?.data?.data) ? x?.data?.data: []
        options?.onLoad?.(ee)
        _setList(ee)

        if (x.status !== 200) {
          options?.onErrorLoad?.(x.status, x.data.message, x);
        } else {
          pagination.setElementsNumber(x.data.meta.total)
        }
        // setLoading(false)

      }).catch(x => {
        options?.onErrorLoad?.(-1, String(x), x)
      }).finally(() => {
        setLoading(false)
      });
      return
    }


  };


  useEffect(() => loadDataQuery(init), [context.state])

  function pushUpdate(index: number, value: T) {
    
    options?.onUpdate?.(value, list[index], index, me.reload)

    setList(
        list.map((x, y) => y === index ? value : x)
      );
  }

  const me: useListReturn<T, CTX> = {
    current,
    context: context.state,
    list,
    loading,
    selected: current === -1? undefined: ( selectedOverload || list[current]) as T,
    instanceID,
    get(index, _default) {
      return list[index] || _default
    },
    remove(index) {
      options?.onDelete?.(list[index], index, me.reload)
      setList(list.filter((x, y) => y !== index));
      handlerOpen(false)

    },
    insertAndUpdate(index, value) {
      const i = list[index] || {} as T;
      options?.onPartialUpdate?.(value, list[index], index, me.reload)
      pushUpdate(index, {
        ...i,
        ...value
      })
    },
    update(index, value) {
      options?.onFullUpdate?.(value, list[index], index, me.reload)
      pushUpdate(index, value)
      handlerOpen(false)

    },
    add(value) {
      handlerOpen(false)
      options?.onCreate?.(value, list.length, me.reload)
      setList([...list, value])
    },
    push(value) {
      handlerOpen(false)
      if (current === -1) {
        me.add(value)
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
      function sll() {
        setCurrent(index);
        handlerOpen(true)
      };

      const sl = list[index] as T;
      if (sl === undefined) {
        return undefined
      };
      if (options?.onSelect) {
        options?.onSelect?.(sl, index, (value) => {
          setSelectedOverload(value)
          sll()
        })
      } else (
        sll()
      )

      return sl
    },
    unSelect() {
      setCurrent(-1)
    },
    newInstance() {
      setCurrent(-1);
      GenerateId();
      handlerOpen(true);
    },
    reload(ctx) {
      reset();
      context.set(ctx || {} as CTX );
      // loadDataQuery(init);
    },
    
    tableController: {
      selects: selectControls
    }
  };

  return me
}