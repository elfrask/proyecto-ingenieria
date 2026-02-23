import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import { FunctionComponent, ReactNode } from "react";


interface ButtonCreateProps {
  title?: ReactNode;
  children?: ReactNode;
  onClick: () => void
}
 
const ButtonCreate: FunctionComponent<ButtonCreateProps> = ({
  onClick, title, children
}) => {
  return (
    <Button onClick={onClick}>
      <PlusCircle />
      {title||children}
    </Button>
  );
}
 
export default ButtonCreate;