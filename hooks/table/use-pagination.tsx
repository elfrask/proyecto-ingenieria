import { useState } from "react";

export interface UsePaginationOptions {
  onPageChange?(page: number): void;
  onSizePageChange?(page: number): void;
  onElementsNumberIsChanged?(page: number): void;
  
  defaultPage?: number;
  defaultSizePage?: number;

}

export function usePagination(options: UsePaginationOptions) {

  const [page, _setPage] = useState(options.defaultPage||0);
  const [size, _setSize] = useState(options.defaultPage||10);
  const [elementsNumber, _setElementsNumber] = useState(0);
  const maxPages = Math.floor(elementsNumber / size);

  function setPage(v: number) {
    options.onPageChange?.(v)
    _setPage(v)
  }

  function setSize(v: number) {
    options.onSizePageChange?.(v);
    _setSize(v)
  }

  function setElementsNumber(v: number) {
    options.onElementsNumberIsChanged?.(v)
    _setElementsNumber(v)
  }

  
  return {
    page,
    size,
    elementsNumber,
    maxPages,
    setPage,
    setSize,
    setElementsNumber,
  }
}