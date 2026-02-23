import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LucideIcon } from "lucide-react";
import BoxChart from "./box-chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface EficienciaProps {
  title: string;
  icon: LucideIcon;
  config: ChartConfig;
  data: any[];
  indexKey: string; // Ej: "categoria"
    className?: string;

}

export function ChartBar({ config, data, indexKey, ...p}: EficienciaProps) {
  return (
    <BoxChart {...p}>
      <ChartContainer config={config} className="min-h-[250px] w-full pt-4">
        <BarChart data={data} margin={{ top: 20 }}>
          <CartesianGrid vertical={false} opacity={0.3} />
          <XAxis
            dataKey={indexKey}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip
            cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
            content={<ChartTooltipContent />}
          />
          {/* Barra de Solicitudes Totales */}
          <Bar 
            dataKey="solicitadas" 
            fill="var(--color-solicitadas)" 
            radius={[4, 4, 0, 0]} 
            barSize={30}
          />
          {/* Barra de Solicitudes Aprobadas */}
          <Bar 
            dataKey="aprobadas" 
            fill="var(--color-aprobadas)" 
            radius={[4, 4, 0, 0]} 
            barSize={30}
          />
          <ChartLegend content={<ChartLegendContent />} />
        </BarChart>
      </ChartContainer>
    </BoxChart>
  )
}