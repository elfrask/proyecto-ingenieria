import { AllVariants, DynamicFields, TypesFields, TypesSchemesDynamics } from "@/types/dynamic";
import z from "zod";




export function generateSchema(v: DynamicFields): z.ZodType {
  // console.log(v)
  let o = TypesSchemesDynamics[v.data_type as TypesFields](v.variant as unknown as any)

  // if (v?.visibleDependsValue?.length !== 0) {
  //   o.superRefine((value, ctx) => {

  //   })
  // }

  return applyProps(o, v.props)
}


export function applyProps(Schema: z.ZodType, props: DynamicFields["props"]): z.ZodType {
  

  if (props.min) {
    
  }


  return Schema
}