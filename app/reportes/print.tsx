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
  
  return ( undefined );
}
 
export default PrintComponent;