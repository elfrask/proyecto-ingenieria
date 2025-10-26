import { Field, FieldError, FieldLabel, FieldLegend } from "@/components/ui/field";
import { Dispatch, FunctionComponent, HTMLAttributes, ReactNode, useEffect, useState } from "react";
import { OnValidateFunction, useForm } from "./form-context";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import z, { string } from "zod";
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SelectItemProps } from "@radix-ui/react-select";
import { DatePicker } from "@/components/ui/date-picker";
import { formatBytes, getFile, ValidAcceptTypes } from "@/lib/client-utils";


export interface OptionsFormFieldsAlgorithm {

}

export type FormFieldsComponentsProps<
    value=any, CustomOptions=OptionsFormFieldsAlgorithm
> = (value: value, setValue: Dispatch<value>, item: any, options: CustomOptions) => ReactNode







interface FieldBoxProps extends HTMLAttributes<HTMLDivElement> {
    label: string;
    error?: string;
    legend?: string;


}
 
export const FieldBox: FunctionComponent<FieldBoxProps> = ({
    children,
    label,
    className,
    legend,
    error
    
}) => {
    

    return (
        <Field className={className}>
            <FieldLabel>
                {label}
            </FieldLabel>
            {children}
            {legend &&
                <FieldLegend>
                    {legend||""}
                </FieldLegend>
            }
            {
                error &&
                <FieldError>
                    {error||""}
                </FieldError>
            }
        </Field>
    );
}


export interface FieldComponent<type=string, optionsNames=string> extends Omit<HTMLAttributes<HTMLInputElement>, "defaultValue">  {
    name: optionsNames;
    label: string;
    legend?: string;
    onValidate?: OnValidateFunction;
    classNameField?: string;
    zodValidate?: z._ZodType
    value?: type;
    onChangeValue?: (value: type) => void,
    defaultValue?: type;

    required?: boolean;
    min?: number;
    max?: number;
    placeholder?: string;

};

export const FormTextInput: FunctionComponent<FieldComponent> = ({
    name,
    label,
    legend,
    defaultValue,
    onValidate,
    classNameField,
    className,
    zodValidate,
    onChangeValue,
    value,

    placeholder,

    ...props
}) => {
    function generateDefault(noUseDefault?: boolean) {

        if (noUseDefault) return ""
        
        return form.defaultDataContext[name]||defaultValue||"";
    };

    const form = useForm();
    const [_value, _setValue] = useState(generateDefault());
    const [error, setError] = useState<undefined|string>(undefined);



    useEffect(() => {

        form.addField({
            onValidate: onValidate || (() => undefined),
            label: label,
            name: name,
            zodValidate: zodValidate,
            handlerUpdate: (context) => {

                setError(context.errorsContext[name]);
                _setValue(context.dataContext[name]);

            },
            defaultValueGenerate: generateDefault,
        })

        
    }, [])

    
    useEffect(() => {
        
        if (form.dataContext[name] === undefined) {
            handlerUpdate(generateDefault())
        }
    
      
    }, [_value])
    


    function handlerUpdate(value: string) {
        form.dataContext[name] = value;

        form.handlerOnChange(form.dataContext);

        if (onChangeValue) {
            onChangeValue(value)
        }
        
        
        if (form.errorsContext[name]) {
            form.handlerValidateFieldsAndApply(name).then(x=> setError(x.errors[name]));
            
        }

        _setValue(value);



    };

    

    return (
        <FieldBox 
            label={label} 
            className={className}
            error={error}
            legend={legend}
        >
            <Input

                {...props}
                className={cn(
                    form.errorsContext[name]?
                    `text-red-800 border-red-800 bg-red-100 outline-red-800`:'',
                    classNameField
                )}
                placeholder={placeholder}
                value={_value}
                onChange={x=> handlerUpdate(x.target.value)}
            />
            
        </FieldBox>
    )
}

export const FormNumberInput: FunctionComponent<FieldComponent<number>> = ({
    name,
    label,
    legend,
    defaultValue,
    onValidate,
    classNameField,
    className,
    zodValidate,
    onChangeValue,
    value,

    placeholder,

    ...props
}) => {
    function generateDefault(noUseDefault?: boolean) {

        if (noUseDefault) return 0

        return form.defaultDataContext[name]||defaultValue||0;
    }

    const form = useForm();
    const [_value, _setValue] = useState(generateDefault());
    const [error, setError] = useState<undefined|string>(undefined);



    useEffect(() => {

        form.addField({
            onValidate: onValidate || (() => undefined),
            label: label,
            name: name,
            zodValidate: zodValidate,
            handlerUpdate: (context) => {

                setError(context.errorsContext[name]);
                _setValue(context.dataContext[name]);

            },
            defaultValueGenerate: generateDefault,
        })

        
    }, [])

    
    useEffect(() => {
        
        if (form.dataContext[name] === undefined) {
            handlerUpdate(generateDefault())
        }
    
      
    }, [_value])
    


    function handlerUpdate(value: number) {

        
        form.dataContext[name] = !isNaN(value)?value:0;
        form.handlerOnChange(form.dataContext);

        if (onChangeValue) {
            onChangeValue(value)
        }
        
        
        if (form.errorsContext[name]) {
            form.handlerValidateFieldsAndApply(name).then(x=> setError(x.errors[name]));
            
        }

        // console.log(value)

        _setValue(value);



    };

    

    return (
        <FieldBox 
            label={label} 
            className={className}
            legend={legend}
            error={error}
        >
            <Input
                type="number"
                {...props}
                className={cn(
                    form.errorsContext[name]?
                    `text-red-800 border-red-800 bg-red-100 outline-red-800`:'',
                    classNameField
                )}
                placeholder={placeholder}
                value={!isNaN(_value)?_value:""}
                onChange={x=> handlerUpdate(x.target.valueAsNumber)}
            />
            
        </FieldBox>
    )
}

export const FormSelect: FunctionComponent<FieldComponent> = ({
    name,
    label,
    legend,
    defaultValue,
    onValidate,
    classNameField,
    className,
    zodValidate,
    onChangeValue,
    value,
    children,

    required,
    placeholder,
    

    ...props
}) => {

    function generateDefault(noUseDefault?: boolean) {

        if (noUseDefault) return required?undefined:"";
        
        return form.defaultDataContext[name]||defaultValue||(
            required?undefined:""
        );
    };


    const form = useForm();
    const [_value, _setValue] = useState(generateDefault());
    const [error, setError] = useState<undefined|string>(undefined);



    useEffect(() => {

        form.addField({
            onValidate: onValidate || (() => undefined),
            label: label,
            name: name,
            zodValidate: zodValidate,
            handlerUpdate: (context) => {

                setError(context.errorsContext[name]);
                setTimeout(() => {
                    _setValue(context.dataContext[name]);
                }, 50)

            },
            defaultValueGenerate: generateDefault,
        })

        
    }, [])

    
    useEffect(() => {
        
        if (form.dataContext[name] === undefined) {
            handlerUpdate(generateDefault())

            return
        }

    
      
    }, [_value])
    


    function handlerUpdate(value: string) {
        form.dataContext[name] = value;

        form.handlerOnChange(form.dataContext);

        if (onChangeValue) {
            onChangeValue(value)
        }
        
        
        if (form.errorsContext[name]) {
            form.handlerValidateFieldsAndApply(name).then(x=> setError(x.errors[name]));
            
        }

        _setValue(value);



    };

    

    return (
        <FieldBox 
            label={label} 
            className={className}
            legend={legend}
            error={error}
        >
            <Select
                value={_value}
                onValueChange={x=> handlerUpdate(x)}
                required={required}
            >
                <SelectTrigger
                    // {...props}
                    className={cn(
                        form.errorsContext[name]?
                        `text-red-800 border-red-800 bg-red-100 outline-red-800`:'',
                        classNameField
                    )}
                
                >
                    <SelectValue
                        placeholder={placeholder}
                        // className="border-input bg-input accent-input text-input fill-input"
                    />
                </SelectTrigger>
                <SelectContent>
                    {children}
                </SelectContent>
            </Select>
            
        </FieldBox>
    )
}

interface FormSelectOptionProps extends SelectItemProps {
    value: string;
}
 
export const FormSelectOption: FunctionComponent<FormSelectOptionProps> = ({
    children,
    value,
    className,
    ...props
}) => {
    return ( 
        <SelectItem {...props} value={value} className={cn("hover:bg-secondary focus:bg-secondary", className)} >
            {children}
        </SelectItem>
    );
}


export const FormDateInput: FunctionComponent<FieldComponent<Date>> = ({
    name,
    label,
    legend,
    defaultValue,
    onValidate,
    classNameField,
    className,
    zodValidate,
    onChangeValue,
    value,

    placeholder,

    ...props
}) => {
    function generateDefault(noUseDefault?: boolean) {

        if (noUseDefault) return "DD/MM/AAAA"
        
        return form.defaultDataContext[name]||defaultValue||"DD/MM/AAAA";
    };

    const form = useForm();
    const [_value, _setValue] = useState<undefined|Date>(generateDefault());
    const [error, setError] = useState<undefined|string>(undefined);



    useEffect(() => {

        form.addField({
            onValidate: onValidate || (() => undefined),
            label: label,
            name: name,
            zodValidate: zodValidate,
            handlerUpdate: (context) => {

                setError(context.errorsContext[name]);
                _setValue(context.dataContext[name]);

            },
            defaultValueGenerate: generateDefault,
        })

        
    }, [])

    
    useEffect(() => {
        
        if (form.dataContext[name] === undefined) {
            handlerUpdate(generateDefault())
        }
    
      
    }, [_value])
    


    function handlerUpdate(value: Date) {
        form.dataContext[name] = value;
        form.handlerOnChange(form.dataContext);


        if (onChangeValue) {
            onChangeValue(value)
        }
        
        
        if (form.errorsContext[name]) {
            form.handlerValidateFieldsAndApply(name).then(x=> setError(x.errors[name]));
            
        }

        _setValue(value);



    };

    

    return (
        <FieldBox 
            label={label} 
            className={className}
            error={error}
            legend={legend}
        >
            

            <DatePicker
                className={cn(
                    form.errorsContext[name]?
                    `text-red-800 border-red-800 bg-red-100 outline-red-800`:'',
                    "hover:bg-secondary bg-transparent",
                    classNameField
                )}
                placeholder={placeholder}
                value={_value}
                onChangeValue={x=> handlerUpdate(x as Date)}
            />
            
        </FieldBox>
    )
}


export interface FormFileInputProps extends FieldComponent<File> {
    filter?: ValidAcceptTypes
}

export const FormFileInput: FunctionComponent<FormFileInputProps> = ({
    name,
    label,
    legend,
    defaultValue,
    onValidate,
    classNameField,
    className,
    zodValidate,
    onChangeValue,
    value,
    filter,

    placeholder,

    ...props
}) => {
    function generateDefault(noUseDefault?: boolean) {

        if (noUseDefault) return undefined
        
        return form.defaultDataContext[name]||defaultValue||undefined;
    };

    const form = useForm();
    const [_value, _setValue] = useState<undefined|File>(generateDefault());
    const [error, setError] = useState<undefined|string>(undefined);



    useEffect(() => {

        form.addField({
            onValidate: onValidate || (() => undefined),
            label: label,
            name: name,
            zodValidate: zodValidate,
            handlerUpdate: (context) => {

                setError(context.errorsContext[name]);
                _setValue(context.dataContext[name]);

            },
            defaultValueGenerate: generateDefault,
        })

        
    }, [])

    
    useEffect(() => {
        
        if (form.dataContext[name] === undefined) {
            handlerUpdate(generateDefault())
        }
    
      
    }, [_value])
    


    function handlerUpdate(value: File) {
        form.dataContext[name] = value;
        form.handlerOnChange(form.dataContext);


        if (onChangeValue) {
            onChangeValue(value)
        }
        
        
        if (form.errorsContext[name]) {
            form.handlerValidateFieldsAndApply(name).then(x=> setError(x.errors[name]));
            
        }

        _setValue(value);



    };

    

    return (
        <FieldBox 
            label={label} 
            className={className}
            error={error}
            legend={legend}
        >
            

            <Button
                type="button"
                variant={"outline"}
                className={cn(
                    form.errorsContext[name]?
                    `text-red-800 border-red-800 bg-red-100 outline-red-800`:'',
                    "hover:bg-secondary bg-transparent",
                    classNameField
                )}
                // placeholder={placeholder}
                // value={_value}
                // onChangeValue={x=> handlerUpdate(x)}
                onClick={async() => {

                    const _File = await getFile(filter)

                    if (_File) {
                        handlerUpdate(_File)
                    }
                }}
            >
                {_value?`"${_value.name.slice(0, 25)}${_value.name.length>25?"...":""}" (${formatBytes(_value.size)})`:"Elige un archivo"}
            </Button>
            
        </FieldBox>
    )
}
