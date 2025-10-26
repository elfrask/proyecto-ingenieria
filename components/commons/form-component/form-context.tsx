import { createContext, useContext } from "react";
import { _ZodType } from "zod";


export type OnValidateFunction = (value: any, model: any) => string | any | Promise<string> | Promise<any>

export interface fieldsContext {

    onValidate: OnValidateFunction;
    handlerUpdate: (context: FormContextInterface) => void;
    name: string;
    label: string;
    zodValidate?: _ZodType;
    defaultValueGenerate: (noUseDefault?: boolean) => any;
    

}

type ValidResult = { errors: Record<string, any>, ok: boolean };

export interface FormContextInterface {
    dataContext: Record<string, any>;
    defaultDataContext: Record<string, any>;
    errorsContext: Record<string, any>;
    // onUpdateContext: (newContext: FormContextInterface) => void;
    fieldsContext: fieldsContext[];
    handlerUpdateFields: (name?: string, context?: FormContextInterface) => void;
    validateFields: (name?: string) => Promise<ValidResult>;
    handlerValidateFieldsAndApply: (name?: string, context?: FormContextInterface) => Promise<ValidResult>;
    onSubmitHandler: () => void;
    handlerOnChange: (data: Record<string, any>) => void;
    setDataContext: (value: any) => void;
    addField: (field: fieldsContext) => void
    
}

export const FormContext = createContext<FormContextInterface|undefined>(undefined);


export function useForm() {
    const context = useContext(FormContext);

    if (!context) {
        throw "para usar useForm debe de estar envuelto por un <FormProvider>"
    };

    return context
}

