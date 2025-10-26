import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import { fieldsContext, FormContext, FormContextInterface, useForm } from "./form-context";
import React from "react";
import { _ZodType, ZodError } from "zod";
import {  } from "react-hook-form";

export interface handlersForm {
 handlerSubmit: () => void;
 handlerReset: (x: boolean) => void;
 getData: () => any;
 formName: string | undefined
}

export interface FormComponentProps<model = any> {
    children: ReactNode;
    defaultData?: model;
    data?: model;
    estructure?: model;
    onSubmit?: (data: model, reset: (data?: boolean)=>void) => void;
    onReset?: (reset: (data?: boolean)=>void) => void;
    onChangeValue?: (data: model) => void;
    getHandlers?: (handlers: handlersForm) => void;
    name?: string
}

export const FormProvider: FunctionComponent<FormComponentProps> = ({
    children,
    defaultData,
    // estructure,
    getHandlers,
    onSubmit,
    data,
    onReset,
    onChangeValue,
    name
}) => {
    function handlerUpdateFields(name?: string) {
        
        value.fieldsContext.forEach(x=> {

            if (!x.handlerUpdate) {
                return
            }
    
            if (name) {
                if (name === x.name) {
                    x.handlerUpdate(value);
                }
    
                return
            }
    
            x.handlerUpdate(value);
    
            
        })
    };

    async function handlerValidateFields(name?: string, context?: FormContextInterface): Promise<{ errors: Record<string, any>, ok: boolean }> {
        const endValue = context || value;
        
        const errors: Record<string, any> = { ...endValue.errorsContext };
        let ok = true;

        // console.log(errors, "intro")

        async function pass(result: string|void|any|Promise<string|void|any>, idName: string) {
            
            if (result instanceof Promise) {
                result = await result
            }

            if (typeof result === "string") {
                errors[idName] = result
                ok = false
                
            } else if (typeof result === "object") {
                
                Object.assign(errors, result)
                ok = false

            } else {
                errors[idName] = undefined
            }

        }

        function ZodPass(zo: _ZodType, value: any, idName: string) {
            let _ok = true;
            let _msg = "";

            try {

                zo.parse(value)
                errors[idName] = undefined
                
            } catch (error) {

                const err = error as ZodError;
                ok = false;
                _ok = false;
                _msg = err?.message ? String(err.message) : JSON.stringify(err);
                _msg = (JSON.parse(_msg) as ZodError[]).map(x=> x.message).join("\n")

                errors[idName] = _msg;


            }
            

            return {ok: _ok, msg: _msg}
        }


        for (let i = 0; i < endValue.fieldsContext.length; i++) {
            const x = endValue.fieldsContext[i];

            if (name) {
                if (name !== x.name) {
                    continue
                }
            }

            // console.log("llego zod", [x.name, name, x]);
            
            if (x.zodValidate) {

                const result = ZodPass(x.zodValidate, endValue.dataContext[x.name], x.name);

                if (!result.ok) {
                    // errors[x.name] = result.msg
                    continue
                }
                
            }

            
            if (x.onValidate) {
                const result = x.onValidate(endValue.dataContext[x.name], endValue.dataContext);
                await pass(result, x.name)
            }
    

    
            

            if (name) {
                break
            }
        
        };

        // console.log(errors)


        return {errors, ok}
    };

    async function handlerValidateFieldsAndApply(name?: string, context?: FormContextInterface) {
        
        const endValue = context || value;

        const {errors, ok} = await handlerValidateFields(name, endValue);

        

        endValue.errorsContext = errors

        setValue(endValue)

        // console.log("estado: ", endValue)


        return {errors, ok}
    }

    async function onSubmitHandler() {

        const {errors, ok} = await handlerValidateFieldsAndApply();

        handlerUpdateFields();
        

        if (!ok) {
            return
        }
        
        
        if (onSubmit) {
            onSubmit(value.dataContext, (x) => reset(x))
        }
    };

    async function setDataContext(newValue: any) {
        
        setValue({
            ...value,
            dataContext: {
                ...value.dataContext,
                ...newValue
            }
        })
    }

    function reset(newModel?: boolean) {
        // console.log("RESET", value.dataContext, newModel)
        value.dataContext = {...generateDefault(newModel)};
        handlerUpdateFields()
    }

    function addField(field: fieldsContext) {
        
        for (let i = 0; i < value.fieldsContext.length; i++) {
            const element = value.fieldsContext[i];
            
            if (element.name === field.name) {
                value.fieldsContext[i] = element;
                return
            }
        };

        value.fieldsContext.push(field)
    }

    function generateDefault(noUseDefault?: boolean) {
        const out: any = {};

        value.fieldsContext.forEach(x=>{ out[x.name] = x.defaultValueGenerate(noUseDefault)});

        return out
    }

    function handlerOnChange(data: any) {
        if (onChangeValue) {
            onChangeValue(data||value.dataContext)
        }
    }

    const [value, setValue] = useState<FormContextInterface>({
        dataContext: (defaultData || {}),
        defaultDataContext: (defaultData || {}),
        errorsContext: {},
        fieldsContext: [] as fieldsContext[],
        handlerUpdateFields,
        validateFields: handlerValidateFields,
        onSubmitHandler,
        setDataContext,
        handlerValidateFieldsAndApply,
        addField,
        handlerOnChange

    });

    function giveHandlers() {
        if (getHandlers) {
            getHandlers({
                handlerReset: (x) => reset(x),
                handlerSubmit: () => onSubmitHandler(),
                getData: () => value.dataContext,
                formName: name
            })
        }
    }

    useEffect(() => {
        giveHandlers()
    }, [value])
    

    useEffect(() => {
        giveHandlers()
        if (defaultData) {
            value.dataContext = {...generateDefault(), ...defaultData};
            handlerUpdateFields()
        }

    }, [defaultData]);

    useEffect(() => {
        giveHandlers()

        if (data) {
            value.dataContext = {...generateDefault(), ...data};
            handlerUpdateFields()
            
        };

        
    }, [data]);

    

    

    return (
        <FormContext.Provider value={value}>
            <form 
            
            onSubmit={x=> {
                x.preventDefault();
                x.isPropagationStopped()
                onSubmitHandler();
            }}
            
            onReset={ 
            onReset?
            (x) => {
                x.preventDefault()
                onReset(reset)
            }
            :  
            x=> {
                x.preventDefault();
                reset()
            }}
            >
                {children}

            </form>
        </FormContext.Provider>
    );
}



interface FormSubmitTriggerProps {
    asChild?: boolean;
    children: ReactNode
}
 
export const FormSubmitTrigger: FunctionComponent<FormSubmitTriggerProps> = ({
    asChild, children
}) => {
    
    const context = useForm();
    const handlerSubmit = () => context.onSubmitHandler();


    if (asChild) {
        
        if (React.Children.count(children) > 1) {
            
            throw ("No se puede asignar las propiedades de CrudCreateTrigger a mas de un hijo")
        }

        const child = React.Children.only(children) as React.ReactElement<any>;

        return React.cloneElement(child, {
            onClick: (event: React.MouseEvent) => {
                // Ejecuta la lógica para abrir el formulario
                handlerSubmit(); 
                
                // Ejecuta el onClick original del hijo, si existe
                if (typeof child.props.onClick === 'function') {
                    child.props.onClick(event);
                }
            }
        })
    }
    
    
    return (
        <div onClick={handlerSubmit}>
            {children}
        </div>
    );
}



