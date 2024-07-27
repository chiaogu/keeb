import RadioGroup from '@src/components/shared/RadioGroup';
import Slider from '@src/components/shared/Slider';
import { NodeControlConfig } from '@src/synth/config';
import { Envelope, zEnvelope } from '@src/synth/config/envelope';
import {
  getEnumDef,
  getNumberDef,
  instanceOf,
  removeDefault,
} from '@src/utils/schema';
import { splitCamelCase } from '@src/utils/utils';
import { useMemo } from 'react';
import { z } from 'zod';
import ReadOnly from '../shared/ReadOnly';
import SectionHeader from '../shared/SectionHeader';
import Controls from './Controls';
import EnvelopeControl from './EnvelopeControl';

type ControlProps = {
  config?: NodeControlConfig;
  name: string;
  value: unknown;
  onChange: (v: unknown) => void;
  schema: z.ZodTypeAny;
  indent: number;
};

export default function Control({
  config,
  name,
  value,
  onChange,
  schema,
  indent,
}: ControlProps) {
  const label = useMemo(
    () => (config?.label == undefined ? splitCamelCase(name) : config?.label),
    [config, name],
  );
  const innerSchema = useMemo(() => removeDefault(schema), [schema]);

  if (innerSchema instanceof z.ZodNumber) {
    const { min, max, step } = getNumberDef(innerSchema);
    return (
      <Slider
        indent={indent}
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
        indent={indent}
        label={label}
        values={[`${value}` as string]}
        onChange={([v]) => onChange(v)}
        options={options}
      />
    );
  } else if (instanceOf(zEnvelope, schema)) {
    return (
      <EnvelopeControl
        indent={indent}
        label={label}
        envelope={value as Envelope}
        onChange={onChange}
      />
    );
  } else if (innerSchema instanceof z.ZodObject) {
    return (
      <>
        {label && <SectionHeader label={label} />}
        <Controls
          schema={innerSchema}
          value={value as Record<string, unknown>}
          onChange={onChange}
          indent={indent + 1}
        />
      </>
    );
  }

  return <ReadOnly label={label} value={`${value}`} />;
}
