import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { FunctionComponent, ReactNode } from "react";



interface BoxChartProps {
  title: string
  icon: LucideIcon
  children?: ReactNode;
  className?: string;
}
 
const BoxChart: FunctionComponent<BoxChartProps> = ({
  icon: Icon, title, children, className
}) => {
  return (
    <Card className={cn('w-full col-span-2 lg:col-span-1 space-y-2 px-2 py-6 rounded-md shadow-sm bg-card transition-colors border-0', className)}>
      <CardHeader className='flex items-center'>
        <Icon className='text-primary' />
        <CardTitle>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
       {children}
      </CardContent>


    </Card>
  );
}
 
export default BoxChart;