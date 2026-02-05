// "use-client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IconKey, parseLucide } from '@/lib/lucide'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import React from 'react'

type CardKapisProps = {
  key?: number,
  titulo: string
  contenido: string | number,
  border?: boolean,
  forPrint?: boolean;
  icon: IconKey
  bgColor?: string;
  className?: string;
}

function CardKpis({
  key,
  titulo,
  contenido,
  icon,
  border,
  bgColor = 'bg-primary',
  className,
  forPrint
}: CardKapisProps) {
  const Icon = parseLucide(icon)

  return (
    <Card className={cn('border-0 shadow-sm h-35 px-6 grid grid-cols-3', className, border && "border")}>
    {/* <Card className={cn('border-0 col-span-4 md:col-span-2 lg:col-span-2 xl:col-span-1 shadow-sm h-35 px-6 grid grid-cols-3', className)}> */}
      <div className={`${bgColor} col-span-1 self-center w-14 h-14 md:w-10 md:h-10 lg:w-16 lg:h-16 p-4 md:p-2 lg:p-4 rounded-sm`}>
        <Icon className={cn('h-6 w-6 lg:h-8 lg:w-8 ', forPrint? "text-black": ("text-white"))} />
      </div>
      <div className='col-span-2 self-center'>
        <CardContent className='text-foreground font-extrabold md:text-xl lg:text-2xl px-0'>
          {contenido}
        </CardContent>
        <CardHeader className='px-0'>
          <CardTitle className='font-semibold text-muted-foreground'>{titulo}</CardTitle>
        </CardHeader>
      </div>
    </Card>
  )
}

export default CardKpis