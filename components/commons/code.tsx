import { cn } from "@/lib/utils";
import { FunctionComponent, HTMLAttributes } from "react";


interface CodeProps extends HTMLAttributes<HTMLDivElement> {
  
}
 
const Code: FunctionComponent<CodeProps> = ({
  ...p
}) => {
  return (
    <code {...p} className={cn(`
        bg-gray-200 p-2 rounded-lg text-pretty overflow-ellipsis
      `, p.className)} 
    />
  );
}
 
export default Code;