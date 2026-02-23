export function useRedefineIndex<T>(list: T[], idKey: keyof T) {
  return (preIndex: number) => {
    return list[preIndex][idKey] as number
  }
}