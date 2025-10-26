import { useContext, createContext, FunctionComponent, ReactNode, useState } from "react";

export interface signalsContext {
    callSignal:(signal: string, params?: any) => void
}

const SignalConext = createContext<signalsContext|undefined>(undefined);

export const useSignal = () => {
    const context = useContext(SignalConext)

    if (!context) {
        throw "no puedes usar useSignal fuera del contexto de <SignalProvider>"
    }

    return context
}


interface SignalProviderProps {
    children?: ReactNode;
    onSignal: (signal: string, params: any) => void
}
 
const SignalProvider: FunctionComponent<SignalProviderProps> = ({
    children, onSignal
}) => {


    const [_value, _setValue] = useState<signalsContext>({
        callSignal(signal, params) {
            if (onSignal) {
                onSignal(signal, params)
            }
        }

    })

    return ( 
        <SignalConext.Provider value={_value} >
            {children}
        </SignalConext.Provider>
    );
}
 
export default SignalProvider;
