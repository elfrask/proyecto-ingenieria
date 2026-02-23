"use client"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import BoxChart from "./box-chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import * as Lucide from "lucide-react";
import { icon } from "leaflet";
import { IconKey, parseLucide } from "@/lib/lucide";

interface AreaProps {
  title: string;
  icon: IconKey;
  config: ChartConfig;
  data: any[];
  categories: string[]; // Las llaves que se van a graficar (ej: ['uniformes', 'epps'])
  indexKey: string;     // La llave del eje X (ej: 'mes')
  className?: string;

}

export function ChartAreaKpi({
  
  config,
  data,
  categories,
  indexKey,
  ...p
}: AreaProps) {
  return (
    <BoxChart {...p} icon={parseLucide(p.icon)}>
      <ChartContainer config={config} className="min-h-[250px] w-full pt-4">
        <AreaChart
          data={data}
          margin={{ left: 12, right: 12, top: 10 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey={indexKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)} // Ene, Feb...
          />
          <ChartTooltip
            cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1 }}
            content={<ChartTooltipContent indicator="dot" />}
          />
          {categories.map((category) => (
            <Area
              key={category}
              dataKey={category}
              type="linear" // Línea suave
              fill={`var(--color-${category})`}
              // fillOpacity={0.2}
              stroke={`var(--color-${category})`}
              stackId="1" // Apila las áreas para ver el total acumulado
            />
          ))}
          <ChartLegend content={<ChartLegendContent />} className="mt-4" />
        </AreaChart>
      </ChartContainer>
    </BoxChart>
  )
}