"use client"
import { FunctionComponent, useEffect } from "react";

interface PrintComponentProps {
  delay?: number;
}
 
const PrintComponent: FunctionComponent<PrintComponentProps> = ({
  delay
}) => {

  useEffect(() => {
    setTimeout(() => {
      print();
      close()
    }, delay || 0)
  }, [])
  
  return ( 
    <div className="z-50 fixed left-0 top-0 w-screen h-screen cursor-none">

    </div>
   );
}
 
export default PrintComponent;