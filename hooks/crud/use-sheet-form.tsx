import FormComponent from "@/components/commons/form/providers/FormProvider";
import { useOpenState } from "../states/openState"
import z from "zod";
import { SimpleSheet } from "@/components/commons/simple-sheet";
import { ReactNode } from "react";

export interface useSheetFormConfigs<Schema extends z.ZodObject, I = z.infer<Schema>> {
  schema: Schema;
  Default: I;
  instanceID: string;
  titleForm: string | ReactNode;
  titleSave?: string;
  titleCancel?: string;
  submit?: (data: I) => void;
  ignoreValid?: boolean;
  globalDefault?: any;
  // disableSchema?: boolean;
  maxWidth?: number;
  debug?: boolean;
}

export function useSheetForm<Schema extends z.ZodObject, I = z.infer<Schema>>({
  schema, Default, instanceID, titleForm, submit, maxWidth, titleCancel, titleSave, debug, ignoreValid, globalDefault
}: useSheetFormConfigs<Schema, I>) {
  const open = useOpenState();

  return {
    open,
    formNode: (selected: I | undefined, render: () => ReactNode) => (
      <FormComponent 
        schema={ignoreValid? z.any() :schema} 
        defaultValues={ignoreValid? {} : (selected || Default) as Partial<I>} 
        key={instanceID} 
        debug
        disableInitialDefaults={ignoreValid}
        globalInitialDefaults={globalDefault}

      >
        <SimpleSheet
          title={titleForm}
          openState={open}
          formControls
          okIsSubmit
          titleSave={titleSave}
          titleCancel={titleCancel}
          ignoreValid={ignoreValid}
          onSave={submit}
          maxWidth={maxWidth || 500}
          debug={debug}
        >
          {render()}
        </SimpleSheet>
      </FormComponent>
    )
  }
}