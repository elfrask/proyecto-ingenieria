import { FunctionComponent } from "react";
import { Separator } from "../ui/separator";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Resumen from "./resumen";



interface EstadisticasProps {

}

const Estadisticas: FunctionComponent<EstadisticasProps> = () => {

  

  return (
    <div>
      <Separator />
      <Tabs defaultValue="resumen">
        <TabsList className="w-full">
          <TabsTrigger value="resumen" children="Resumen general" />
          <TabsTrigger value="historico" children="Histórico de actividad" />
          <TabsTrigger value="timeline" children="Resumen general" />
          <TabsTrigger value="avanzado" children="Estadísticas Avanzadas" />
        </TabsList>
        
        <Card className="w-full max-h-[80vh]">
          <CardContent className="overflow-y-auto">
            <TabsContent value="resumen">
              <Resumen/>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}

export default Estadisticas;