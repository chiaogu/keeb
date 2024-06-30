import { z } from "zod";

export function removeDefault(schema: z.ZodTypeAny): unknown {
  if (schema instanceof z.ZodDefault) {
    return removeDefault(schema.removeDefault());
  }

  if (schema instanceof z.ZodCatch) {
    return removeDefault(schema.removeCatch());
  }

  return schema;
}

export function getNumberDef(schema: z.ZodTypeAny) {
  const numberSchema = removeDefault(schema);
  if (!(numberSchema instanceof z.ZodNumber)) {
    throw new Error(`${schema} is not a number`);
  }
  
  if (numberSchema.minValue == null) {
    throw new Error(`${schema} does not have min`);
  }
  
  if (numberSchema.maxValue == null) {
    throw new Error(`${schema} does not have max`);
  }

  const { checks } = numberSchema._def;
  type StepDef = z.ZodNumberCheck & { kind: 'multipleOf' }
  const stepDef = checks.find(({ kind }) => kind === 'multipleOf') as StepDef;
  
  
  return {
    min: numberSchema.minValue,
    max: numberSchema.maxValue,
    step: stepDef?.value
  };
}

export function getEnumDef(schema: z.ZodTypeAny) {
  const enumSchema = removeDefault(schema);
  if (!(enumSchema instanceof z.ZodEnum)) {
    throw new Error(`${schema} is not a enum`);
  }
  return enumSchema.options as string[];
}