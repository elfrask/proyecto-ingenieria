import { useState } from "react";




export function useInstanceID() {
  const [instanceID, setInstanceId] = useState(crypto.randomUUID());
  
  function newInstance() {
    setInstanceId(crypto.randomUUID())
  }

  return {
    instanceID,
    newInstance
  }
}