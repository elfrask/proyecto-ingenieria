import * as FormComponents from "./form-components";
import { FunctionComponent } from "react";
import  * as fields from "./form-fields-components";




// profesion, nivel de estudio,
export function UseFormModel<model= any>() {
    
    const FormProvider: FunctionComponent<FormComponents.FormComponentProps<model>> = FormComponents.FormProvider;
    const FormTextInput: FunctionComponent<fields.FieldComponent<string, Extract<keyof model, string>>>  = fields.FormTextInput;
    const FormSelect: FunctionComponent<fields.FieldComponent<string, Extract<keyof model, string>>>  = fields.FormSelect;
    const FormNumberInput: FunctionComponent<fields.FieldComponent<number, Extract<keyof model, string>>>  = fields.FormNumberInput;


    return {
        FormProvider,
        FormSelect,
        FormTextInput,
        FormNumberInput,
        FormSelectOption: fields.FormSelectOption
    }
}