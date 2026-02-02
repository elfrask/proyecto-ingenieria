"use client"

import * as React from "react"
import { format, intervalToDuration } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DayPickerProps } from "react-day-picker"

export type DatePicker = DayPickerProps & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
} & {
  value?: Date,
  onChangeValue?: (data: Date) => void,
  onBlur?: () => void,
  placeholder?: string,
  disabled?: boolean,
  fromDate?: Date;
  toDate?: Date;

  initDate?: Date;
  variant?: keyof typeof Variant
}

export type VariantDate = (date: Date, { placeholder }: DatePicker) => string | React.ReactNode;


export const Variant = {
  normal: ((date, { placeholder }) => {


    return date ? date.toLocaleString("es-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }) : <span>{placeholder || "DD/MM/AAAA"}</span>
  }) as VariantDate,
  transcurrido: ((date, { placeholder, fromDate }) => {

    if (!fromDate) {
      return "requiere establecer una fecha inicial"
    }

    if (!date) {
      return <span>{placeholder || `Fecha de inicio: ${format(fromDate, "dd/MM/yyyy")}`}</span>
    }

    const duration = intervalToDuration({
      start: fromDate,
      end: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
    })

    // console.log("inicio", initDate);
    // console.log("Final", date);


    let
      Dias = duration.days || 0,
      Meses = duration.months || 0,
      Años = duration.years || 0;

    // const relativeTimestamp = Math.floor((date.getTime() - initDate.getTime()) / 1000);

    // Dias = Math.floor(relativeTimestamp / (60*60*24))
    // Meses = Math.floor(Dias/30);
    // Años = Math.floor(Dias/365);

    return [
      `${Años} ${Años === 1 ? "Año" : "Años"}`,
      `${Meses} ${Meses === 1 ? "Mes" : "Meses"}`,
      `${Dias} ${Dias === 1 ? "Dia" : "Dias"}`,
    ].join(" ")

  }) as VariantDate,

}


export function DatePicker(Props: DatePicker) {

  const {
    value,
    onChangeValue,
    onBlur,
    placeholder,
    className,
    style,
    disabled,
    fromDate,
    toDate,
    initDate,
    variant,
  } = Props

  const [date, setDate] = React.useState<Date>()

  const _fromDate = fromDate || new Date(1800, 0, 1)
  const _toDate = toDate || new Date(2199, 11, 31)

  React.useEffect(() => {
    setDate(value)
  }, [value])

  return (
    <Popover
      onOpenChange={(isOpen) => {
        if (!isOpen && onBlur) {
          onBlur()
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className={cn("data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal hover:bg-muted", className)}
          style={style || {}}
          disabled={disabled as boolean}
        >
          <CalendarIcon />
          {Variant[variant || "normal"](date as Date, Props)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          captionLayout="dropdown"

          fromYear={1900}
          toYear={2099}
          disabled={{
            before: _fromDate,
            after: _toDate,

          }}

          onSelect={(_date) => {



            // console.log(_date)
            setDate(_date);
            if (onChangeValue) {
              onChangeValue(_date as Date)
              if (onBlur) onBlur()
            }
          }} />
      </PopoverContent>
    </Popover>
  )
}