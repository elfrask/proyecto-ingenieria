import { FunctionComponent, HTMLAttributes, useEffect, useMemo } from "react";
import FormComponent, { FormContextValue, useFormContextComponent } from "../providers/FormProvider";
import z from "zod";
import { generateSchema } from "./generate-schema";
import { DynamicFields } from "@/types/dynamic";
import FormDynamic from "./FormDynamic";
import useUpdate from "@/hooks/useUpdate";



export interface DynamicFormConfigs {
  fields: DynamicFields[];
}


interface FormDynamicComponentProps extends HTMLAttributes<HTMLDivElement> {
  configs: DynamicFormConfigs;
  bind?: boolean;
  name: string;
}

const FormDynamicComponent: FunctionComponent<FormDynamicComponentProps> = ({
  configs, className, bind, name
}) => {

  // methods.subscribe
  const parentForm = useFormContextComponent();

  const camposDependientes = useMemo(() => {
    return configs.fields.filter(x => {
      if (x?.visibleDependsValue?.length) {
        return x.visibleDepends !== "none"
      }
    })
  }, [configs])

  const camposDependientesNombres = useMemo(() => camposDependientes.map(x => x.name), [])

  const schema: z.ZodRecord = useMemo(() => {

    const object: Record<string, z.ZodType> = {};

    configs.fields.forEach(x => {

      object[x.name] = generateSchema(x);

    })

    


    return z.record(z.string(), z.any()).superRefine((values, ctx) => {
      
      Object.entries(object).forEach(([name, schema]) => {
        
        const value = values[name]
        const valid = schema.safeParse(value);
        function validar() {
          if (!valid.success) {
            valid.error.issues.forEach((issue) => {
              ctx.addIssue({
                ...issue,
                path: [name],
              });
            });
          }
        }

        if (camposDependientesNombres.includes(name)) {
          const config = camposDependientes.find(x => x.name === name);
          const valueDep = values[config?.visibleDepends as string];

          if (config?.visibleDependsValue?.includes(valueDep)) {
            validar()
          }

          return null
        }

        validar()
      })

    })


    // return result
  }, [configs])


  // const _methods = useForm({ resolver: zodResolver(schema)});




  return (
    <FormComponent schema={schema} key={"12"} formLess>
      {bind && <LogicForm m={parentForm} n={name} fields={configs.fields} />}
      <Render
        fields={configs.fields}
        name={name}
        fieldsDepends={camposDependientes}
        parent={parentForm}
        bind={bind}
      />

    </FormComponent>
  );
}

interface RenderProps {
  fields: DynamicFields[];
  parent: FormContextValue;
  fieldsDepends: DynamicFields[]
  bind?: boolean;
  name: string
}

function Render({
  fields, parent,fieldsDepends, bind, name
}: RenderProps) {

  const namesDepends = useMemo(() => fieldsDepends.map(x => x.name), [])


  const { methods } = useFormContextComponent();
  const update = useUpdate();

  function setHandler(targetConfig: DynamicFields) {


    if (bind) {
      setTimeout(() => {
        parent.methods.setValue(name, methods.getValues())
      }, 100)
    };

    if ((targetConfig.data_type === "select")) {
      update()
    }
  }

  return (
    fields.map((x, y) => {
      // let hidden = false
      if (namesDepends.includes(x.name)) {
        const valueDep = methods.getValues(x.visibleDepends as string) as string;
        if (!x.visibleDependsValue?.includes(valueDep)) {
          return []
        }
      }

      x.props.label = x.label


      return <FormDynamic 
          data={x} 
          key={y} 
          onValueChange={t => { setHandler(x) }} 
          onChange={t => { setHandler(x) }} 
        
        />
    })
  )
}


function LogicForm({ m: med, n, fields }: { m: FormContextValue<any>, n: string, fields: DynamicFields[] }) {

  const { methods } = useFormContextComponent();


  useEffect(() => {
    med.bind(n, methods)
    const pre_data = med.methods.getValues(n) ?? {}
    const keys = Object.keys(pre_data)

    const postData: Record<string, any> = {}

    fields.forEach(x => {
      if (keys.includes(x.name)) {
        postData[x.name] = pre_data[x.name]
      }


    })

    methods.reset(postData)


    return () => {
      med.unBind(n, methods)
    }
  }, [])

  useEffect(() => {
    med.methods.setValue(n, methods.getValues())
  }, [methods])

  return []
}


export default FormDynamicComponent;


