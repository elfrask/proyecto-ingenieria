import { ResponseRequest } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useStateObject } from "./useStateObject";

export interface useServerQueryOptions<T, CTX> {
  onError?(err: number, msg: string, error: any): void;
  onSuccess?(data: T, msg: string): void;
  defaultContext?: CTX;
  default?: NoInfer<T>;
  autoLoadDisable?: boolean;
  
}

export function useServerQuery<T, CTX extends Record<string, any>>(
  query: ((ctx: CTX) => Promise<ResponseRequest<T>> | T),
  options?: useServerQueryOptions<T, CTX>
) {
  
  const [data, setData] = useState<T | undefined>(options?.default as T);
  const [loading, setLoading] = useState(false);
  const [firstLoad, setFirstLoad] = useState(options?.autoLoadDisable);
  const {set: setContext, state: context} = useStateObject<CTX>((options?.defaultContext || {}) as unknown as CTX)

  async function load() {
    setLoading(true)
    try {

      const dd = query(context as CTX)

      if (!(dd instanceof Promise)) {
        return options?.onSuccess?.(dd, "Ok")
      }

      const data = await dd
      
      if (data.success) {
        options?.onSuccess?.(data.result as T, data.msg)
        setData(data.result as T)


      } else {
        options?.onError?.(data.error, data.msg, {})  
      }

      setLoading(false)

    } catch (error) {
      
      options?.onError?.(-1, String(error), error)  
      setLoading(false)
      
    }
  }

  useEffect(() => {
    if (!firstLoad) {
      load()
    } else {
      setFirstLoad(false)
    }
  }, [context])

  function reload(v?: Partial<CTX>) {
    
    return setContext(v || {})
  }

  return {
    data,
    context,
    loading,
    reload,
    refresh: () => setContext({})
  }
}