import { useSearch } from "@/hooks/estadisticas/use-search";
import { FunctionComponent } from "react";
import { Button } from "../ui/button";
import { Search } from "lucide-react";


interface TimeLineProps {
  
}
 
const TimeLine: FunctionComponent<TimeLineProps> = () => {

  const {
    call,
    search,
    SearchNode
  } = useSearch({
    onSearch(data) {
      console.log("inicio", data.init);
      console.log("Fin", data.end);
    },
  })

  return (
    <div className="w-full">
      <Button onClick={x => call()} variant={"outline"}>
        <Search />
        Aplicar Filtro
      </Button>


      {SearchNode}
    </div>
  );
}
 
export default TimeLine;