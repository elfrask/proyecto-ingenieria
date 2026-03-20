import { FunctionComponent } from "react";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { openAndPrint } from "@/lib/reportes";
import { ExternalLink } from "lucide-react";


interface AyudaProps {

}

const Ayuda: FunctionComponent<AyudaProps> = () => {
  return (
    <div>
      <Separator />
      <Tabs defaultValue="manual">
        <TabsList className="w-full">
          <TabsTrigger value="manual">
            Manual de usuario
          </TabsTrigger>
          <TabsTrigger value="mantenimiento">
            Plan de mantenimiento
          </TabsTrigger>
        </TabsList>
        <TabsContent value="manual">
          <iframe src="/docs/manual.pdf" className="w-full h-150 rounded-2xl" />
          <Button onClick={x => openAndPrint(`/docs/manual.pdf`)} className="float-right mt-4">
            <ExternalLink />
            Abrir en otra ventana
          </Button>
        </TabsContent>
        <TabsContent value="mantenimiento">
          <iframe src="/docs/mantenimiento.pdf" className="w-full h-150 rounded-2xl" />
          <Button onClick={x => openAndPrint(`/docs/mantenimiento.pdf`)} className="float-right mt-4">
            <ExternalLink />
            Abrir en otra ventana
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Ayuda;