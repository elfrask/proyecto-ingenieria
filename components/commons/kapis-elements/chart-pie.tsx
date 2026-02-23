
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { LucideIcon } from 'lucide-react'
import React, { ReactNode } from 'react'
import { Pie, PieChart } from 'recharts'
import BoxChart from './box-chart'

interface Props {
  title: string
  icon: LucideIcon
  config: ChartConfig;
  datakey: string;
  keyLabel: string;
  data: any[];
  className?: string;

}

function ChartPieKpi({
  config,
  datakey,
  keyLabel,
  data,
  ...p
}: Props) {

  return (
    <BoxChart {...p}>
      <ChartContainer config={config} className="min-h-[200px] w-full pt-4">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={data}
            dataKey={datakey}
            nameKey={keyLabel}
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            cornerRadius={5}
          />
          <ChartLegend
            content={<ChartLegendContent nameKey={keyLabel} />}
            className="mt-4 flex-wrap gap-2 justify-center"
          />
        </PieChart>
      </ChartContainer>
    </BoxChart>
  )
}

export default ChartPieKpi