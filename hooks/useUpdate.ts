import { useState } from "react";



interface useUpdateProps {
  
}
 
const useUpdate = () => {
  const [_, _u] = useState(0);

  function update() {
    _u(x => x + 1)
  }

  return update;
}
 
export default useUpdate;