"use client"
import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { DayPicker } from "react-day-picker"


export type Props = React.ComponentProps<typeof DayPicker> & {
    buttonVariant?: React.ComponentProps<typeof Button>["variant"]
} & {
    onChangeValue?: (x: Date) => void,
    defaultValue?: Date|string|number
}

export function InputCalendar({ onChangeValue, defaultValue, ...props }: Props) {

    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(defaultValue? new Date(defaultValue): undefined)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    id="date"
                    className="w-48 justify-between font-normal"
                >
                    {date ? date.toLocaleDateString() : "Select date"}
                    <ChevronDownIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                        setDate(date);
                        setOpen(false);

                        if (onChangeValue) {
                            onChangeValue(date as Date)
                        }
                    }}
                />
            </PopoverContent>
        </Popover>
    )
}