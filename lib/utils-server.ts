


export function Class2Json_ServerImplementation<T=any>(Obj: any): T {
  return JSON.parse(JSON.stringify(Obj))
}

export const toJson = Class2Json_ServerImplementation;