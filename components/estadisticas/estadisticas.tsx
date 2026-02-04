import { FunctionComponent } from "react";
import { Separator } from "../ui/separator";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Resumen from "./timeline";



interface EstadisticasProps {

}

const Estadisticas: FunctionComponent<EstadisticasProps> = () => {

  

  return (
    <div>
      <Separator />
      <Tabs defaultValue="timeline">
        <TabsList className="w-full">
          <TabsTrigger value="timeline" children="Resumen general" />
        </TabsList>
        <Card className="w-full">
          <CardContent>
            <TabsContent value="timeline">
              <Resumen/>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}

export default Estadisticas;