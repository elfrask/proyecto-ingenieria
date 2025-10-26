import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dispatch, ReactNode } from "react";

export interface ItemProps {
    key: string;
    title: string;
}

export interface OptionAlgorithmParams<T = string> {
    placeholder?: string;
    selectOptions?: ItemProps[];
    className?: string;
    required?: boolean;
    min?: number;
    max?: number;
}



export type AlgorithmField<T = string, Options = OptionAlgorithmParams> = (
    value: T, 
    setValue: Dispatch<T>,
    item: unknown, 
    options: Options
) => ReactNode

export const TextInput: AlgorithmField<string> = (value, setValue, item, options) => (
    <Input
        value={value || ""}
        onChange={x => setValue(x.target.value)}
        placeholder={options.placeholder || ""}
        required={options.required || false}
    />
)

export function generateSelectAlgorithm(items: ItemProps[]) {
    const out: AlgorithmField<string> = (value, setValue, item, options) => (
        <Select value={value || ""} onValueChange={setValue}>
            <SelectTrigger>
                <SelectValue placeholder={options?.placeholder || "Seleccionar..."} />
            </SelectTrigger>
            <SelectContent>
                {
                    items.map(x => (
                        <SelectItem  className="focus:bg-background" key={x.key} value={x.key}>
                            {x.title}
                        </SelectItem>
                    ))

                }
            </SelectContent>
        </Select>
    );

    return out
}

export const SelectInput: AlgorithmField<string> = (value, setValue, item, options) => (
    <Select value={value || ""} onValueChange={setValue}>
        <SelectTrigger>
            <SelectValue placeholder={options?.placeholder || "Seleccionar..."} />
        </SelectTrigger>
        <SelectContent>
            {
                options?.selectOptions?.map(x => (
                    <SelectItem className="focus:bg-background" value={x.key}>
                        {x.title}
                    </SelectItem>
                ))

            }
        </SelectContent>
    </Select>
)
