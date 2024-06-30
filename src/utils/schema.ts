import { isEqual } from "lodash-es";
import { z } from "zod";

export function removeDefault(schema: z.ZodTypeAny) {
  if (schema instanceof z.ZodDefault) {
    return removeDefault(schema.removeDefault());
  }

  if (schema instanceof z.ZodCatch) {
    return removeDefault(schema.removeCatch());
  }

  return schema;
}

export function getNumberDef(schema: z.ZodNumber) {
  if (schema.minValue == null) {
    throw new Error(`${schema} does not have min`);
  }

  if (schema.maxValue == null) {
    throw new Error(`${schema} does not have max`);
  }

  const { checks } = schema._def;
  type StepDef = z.ZodNumberCheck & { kind: "multipleOf" };
  const stepDef = checks.find(({ kind }) => kind === "multipleOf") as StepDef;

  return {
    min: schema.minValue,
    max: schema.maxValue,
    step: stepDef?.value,
  };
}

export function getEnumDef(schema: z.ZodEnum<[string, ...string[]]>) {
  return schema.options;
}

export function parse<T extends z.ZodTypeAny>(data: unknown, schema: T) {
  return schema.safeParse(data) as ReturnType<T["safeParse"]>;
}

export function instanceOf<S extends z.ZodTypeAny, T extends z.ZodTypeAny>(
  schema: S,
  targetSchema: T,
) {
  return isEqual(schema, targetSchema);
}
