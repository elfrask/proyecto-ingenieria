import { DynamicFields } from "@/types/dynamic";
import { FormFieldProps } from "@/types/form.types";
import { FunctionComponent } from "react";
import { FormCheckbox, FormDatePicker, FormInput, FormInputFile, FormInputNumber, FormMultiSelect, FormRadio, FormSelect, FormTimeInput } from "../fields/_RedirectComponents";



export interface FormDynamicProps extends Omit<FormFieldProps, "name">  {
  data: DynamicFields;
  name?: string;
}
 
const FormDynamic: FunctionComponent<FormDynamicProps> = ({
  data, ...p
}) => {

  const handlers = {
    onChange: p.onChange,
    onValueChange: p.onValueChange,
  }
  
  switch (data.data_type) {
    case "text":
      return <FormInput {...data.props} {...handlers}  name={data.name} />
    case "number":
      if (data.variant === "percentage") {
        return <FormInputNumber {...data.props} {...handlers} name={data.name} min={0} max={100} />
      }
      return <FormInputNumber {...data.props} {...handlers} name={data.name} />
    case "boolean":
      return <FormCheckbox {...data.props} {...handlers} name={data.name} />
    case "date":
      if (data.variant === "time") {
        return <FormTimeInput
          {...data.props as any}
          {...handlers} 
          name={data.name}
        />
      }
      return <FormDatePicker 
        {...data.props as any} 
        {...handlers} 
        name={data.name}  
        />
    case "file":

      return <FormInputFile
          {...data.props} 
          {...handlers} 
          name={data.name}
        />
    case "select":

      if (data.variant === "radio") {
        return <FormRadio {...data.props} {...handlers} name={data.name} options={data.props.options || []} liteStyle/>
      }

      if (data.variant === "multiselect") {
        return <FormMultiSelect {...data.props} {...handlers} name={data.name} options={data.props.options || []} />
      }

      return <FormSelect {...data.props} {...handlers} name={data.name} options={data.props.options || []} />
    default:
      break;
  }
}
 
export default FormDynamic;