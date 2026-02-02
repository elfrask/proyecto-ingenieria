import { TooltipProps } from "@radix-ui/react-tooltip";
import { FunctionComponent, ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";


interface SimpleTitleProps extends TooltipProps {
  asChild?: boolean;
  children?: ReactNode;
  title: ReactNode;
}
 
const SimpleFlyTitle: FunctionComponent<SimpleTitleProps> = ({
  asChild, title, children
}) => {
  return (
    <Tooltip>
        <TooltipTrigger asChild={asChild}>
          {children}
        </TooltipTrigger>
        <TooltipContent>
          {title}
        </TooltipContent>
      </Tooltip>
  );
}
 
export default SimpleFlyTitle;