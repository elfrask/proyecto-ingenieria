"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group"
import { usePreserve } from "@/hooks/usePreserve"



interface ItemProps {
    value: string;
    label: string;
}

export interface propsComboBox extends React.HtmlHTMLAttributes<HTMLInputElement> {
    className?: string;
    style?: React.StyleHTMLAttributes<"div">
    value?: string;
    onValueChange?: (data: string) => void;
    Items: string[];
    placeholder?: string;
    disabled?: boolean
}

export function Combobox({
    className, style, children, Items, value, onValueChange, placeholder, disabled
}: propsComboBox) {
    const [open, setOpen] = React.useState(false)
    const [_value, _set_value] = React.useState("")
    const [_items, _setItems] = React.useState<React.ReactNode[]>([])
    const tt = usePreserve({t: ""})

    tt.t = _value


    React.useEffect(() => {

        _set_value(value || "");


    }, [value])

    React.useEffect(() => {

        if (Items) {
            _setItems(
                Items.map((framework) => (
                    <CommandItem
                        key={framework}
                        value={framework}
                        onSelect={(current_value) => {

                            // console.log([current_value, _value, tt.t])
                            const dat = current_value === tt.t ? "" : current_value
                            if (onValueChange) {
                                onValueChange(dat)
                            }
                            _set_value(dat)
                            setOpen(false)
                        }}
                    >
                        {framework}
                        <Check
                            className={cn(
                                "ml-auto",
                                _value === framework ? "opacity-100" : "opacity-0"
                            )}
                        />
                    </CommandItem>
                ))
            )
        }

    }, [Items])



    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>

                <InputGroup
                    //   variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-[200px] justify-between", className)}
                    style={style}

                >

                    <InputGroupInput disabled={disabled} placeholder={placeholder} value={_value} onChange={x => {
                        _set_value(x.target.value)
                        if (onValueChange) {
                            onValueChange(x.target.value)
                        }
                    }} />
                    <InputGroupAddon align={"inline-end"}>
                        <ChevronsUpDown className="opacity-50" />
                    </InputGroupAddon>
                </InputGroup>

            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <div className="hidden">
                        <CommandInput className="h-9" value={_value} />

                    </div>
                    <CommandList>
                        <CommandEmpty>No elements found.</CommandEmpty>
                        <CommandGroup>
                            {/* {children} */}
                            {_items}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
