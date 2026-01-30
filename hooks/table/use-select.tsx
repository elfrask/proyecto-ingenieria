import { useEffect, useState } from "react";

export interface useSelectListMethods<T> {
  handlerOnSelect(sel: number[]): void;
  add(sel: number[]): void;
  remove(sel: number[]): void;
  selectAll(): void;
  removeAll(): void;
  getSelected(): T[];
  selectList: number[];
  props: {
    selected: number[];
    onSelected: (v: number[]) => void;
  }
}

export interface useSelectListReturn<T> {
  controls: useSelectListMethods<T>,
  selected: number[],
}

export function useSelectList<T>(selectList: number[], list: T[], onSelectListChange?: (v: number[]) => void): useSelectListReturn<T> {

  const [selected, _set] = useState<number[]>(selectList);

  useEffect(() => {
    _set(selectList)
  }, [selectList])

  const controls: useSelectListMethods<T> = {
    handlerOnSelect(sel: number[]) {
      const l = sel.sort((a, b) => a - b)
      if (onSelectListChange) {
        onSelectListChange?.(l)
        return
      }
      _set(l)
    },
    add(sel: number[]) {
      const a = sel.filter(x => !selected.includes(x));
      const out = ([...selected, ...a])
      // console.log("debug:", a, sel, selected)

      controls.handlerOnSelect(out)
    },
    remove(sel: number[]) {
      const out = (selected.filter(x => !sel.includes(x)));
      controls.handlerOnSelect(out)
    },
    selectAll() {
      const out = ([...list.map((x, y) => y)])
      controls.handlerOnSelect(out)
    },
    removeAll() {
      controls.handlerOnSelect([])
    },
    getSelected() {
      return list.filter((x, y) => selected.includes(y))
    },
    selectList: selected,
    props: {
      selected,
      onSelected: (v: number[]) => controls.handlerOnSelect(v)
    }
  };

  return {
    selected,
    controls
  } as useSelectListReturn<T>
}