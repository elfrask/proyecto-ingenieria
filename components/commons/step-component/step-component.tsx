"use client"

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, LucideDelete } from "lucide-react";
import { createContext, FunctionComponent, HTMLAttributes, useContext, useEffect, useState } from "react"
// import "./style.css";

export interface StepsElementsInterface {
    id: number,
    handlerUpdate: (value: number) => void
}

interface StepContextInterface {
    step: number
    stepsElements: StepsElementsInterface[];
    addStep: (step: StepsElementsInterface) => boolean
}

const StepContext = createContext<StepContextInterface|undefined>(undefined);


export interface StepFieldProps extends HTMLAttributes<HTMLDivElement> {
    step: number;
}

export const StepProvider: FunctionComponent<StepFieldProps> = ({
    children, step
}) => {
    const __step = step
    function addStep(step: StepsElementsInterface) {
        let isNew = true;
        const res = context.stepsElements.map(_step=>{
            
            if (step.id === _step.id) {
                isNew = false;
                return step
            }

            return _step
        })

        if (isNew) {
            res.push(step)
            
        }


        context.stepsElements = res as StepsElementsInterface[]
        setContext(context)
        handlerUpdateAllSteps(__step)
        return isNew


    }

    function handlerUpdateAllSteps(value: number) {
        
        context.stepsElements.forEach(x=> {
            x.handlerUpdate(value)
        })
    }

    const [context, setContext] = useState<StepContextInterface>({
        step: 0,
        stepsElements: [],
        addStep

    })

    useEffect(() => {
      
        setContext({...context, step})
        handlerUpdateAllSteps(step)

        
    }, [step])

    

    
    

    return (
        <StepContext.Provider value={context}>
            <div 
            className="
            flex justify-between w-full h-4 items-center border border-primary rounded-full 
            bg-background step-progress delay-300 transition-all
            " 
            style={{
                "--progress":`${((1/(context.stepsElements.length-1)) * (step)) * 100}%`
            } as any}>
                
                {children}
            </div>
        </StepContext.Provider>
    )
}

export function useStep() {
    const _context = useContext(StepContext)

    if (!_context) {
        throw "useStep solo se puede usar dentro de un StepProvider"
    }

    return _context
}


export interface StepElementProps extends HTMLAttributes<HTMLDivElement> {
    step: number;
    label?: string;
    icon: typeof LucideDelete
}

export const StepElements: FunctionComponent<StepElementProps> = ({
    step, className, children, icon, label
}) => {
    const Icon = icon

    const stepContext = useStep();
    const [active, setActive] = useState(false)


    useEffect(() => {
        
        stepContext.addStep({
            id: step,
            handlerUpdate(value) {
                setActive(value >= step)
            },
        })
    }, [])
    

    return (
        <div className={cn(`
        w-14 h-14 scale-105 rounded-full border-4 bg-background
        text-primary flex flex-row flex-wrap justify-center items-center
        ${active?
        "bg-primary border-white":"border-primary "}
        `, className)}>
            <div className="w-full h-full flex justify-center items-center">
                <Icon className={active?"text-white":""} />
            </div>
            <div className="w-full text-center flex justify-center">
                {label || ""}
            </div>
        </div>
    )
}

export interface StepNavigateProps extends HTMLAttributes<HTMLDivElement> {
    step: number;
    maxStep: number;
    setStep: (step: number) => void;
}

export const StepSimpleNavigate: FunctionComponent<StepNavigateProps> = ({
    step, setStep, maxStep, children
}) => {

    return (
        <div className="flex flex-row p-4 justify-between">
            <div>
                {
                    step > 0?
                    <Button onClick={x=> setStep(step - 1)} variant={"outline"}>
                        <ChevronLeft  />
                        Atras
                    </Button>:[]
                }

            </div>
            <div className="text-sm text-gray-600 text-center">
                (Controlador de navegación provisional) <br />
                Eliminar una vez acabado el testeo
            </div>
            <div>
                {
                    step < (maxStep||1)?    
                    <Button onClick={x=> setStep(step + 1)}>
                        Siguiente
                        <ChevronRight  />
                    </Button>
                    :
                    children
                }
                

            </div>
        </div>
    )
}

