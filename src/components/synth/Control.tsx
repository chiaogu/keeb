import { NodeControlConfig } from "@src/synth/config";
import Slider from "@src/components/shared/Slider";
import RadioGroup from "@src/components/shared/RadioGroup";
import { useMemo } from "react";
import { splitCamelCase } from "@src/utils/utils";
import EnvelopeControl from "./EnvelopeControl";
import { z } from "zod";
import {
  getEnumDef,
  getNumberDef,
  instanceOf,
  removeDefault,
} from "@src/utils/schema";
import { zEnvelope, Envelope } from "@src/synth/config/envelope";
import ReadOnly from "../shared/ReadOnly";
import Controls from "./Controls";

type ControlProps = {
  config?: NodeControlConfig;
  name: string;
  value: unknown;
  onChange: (v: unknown) => void;
  schema: z.ZodTypeAny;
};

export default function Control({
  config,
  name,
  value,
  onChange,
  schema,
}: ControlProps) {
  const label = useMemo(
    () => config?.label === undefined ? splitCamelCase(name) : config?.label,
    [config, name],
  );
  const innerSchema = useMemo(() => removeDefault(schema), [schema]);

  if (innerSchema instanceof z.ZodNumber) {
    const { min, max, step } = getNumberDef(innerSchema);
    return (
      <Slider
        label={label}
        value={value as number}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
      />
    );
  } else if (innerSchema instanceof z.ZodEnum) {
    const options = getEnumDef(innerSchema);
    return (
      <RadioGroup
        label={label ?? ''}
        value={value as string}
        onChange={onChange}
        options={options}
      />
    );
  } else if (instanceOf(zEnvelope, schema)) {
    return (
      <EnvelopeControl
        envelope={value as Envelope}
        label={label ?? ''}
        onChange={onChange}
      />
    );
  } else if (innerSchema instanceof z.ZodObject) {
    return (
      <Controls
        schema={innerSchema}
        value={value as Record<string, unknown>}
        label={label}
        onChange={onChange}
      />
    );
  }

  return <ReadOnly label={label ?? ''} value={`${value}`} />;
}
