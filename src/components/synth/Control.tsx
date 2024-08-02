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
import SliderSelect from '../shared/SliderSelect';

type ControlProps = {
  config?: NodeControlConfig;
  name: string;
  value: unknown;
  onChange: (v: unknown) => void;
  schema: z.ZodTypeAny;
  indent: number;
  onDrag?: () => void;
  onRelease?: () => void;
};

export default function Control({
  config,
  name,
  value,
  onChange,
  schema,
  indent,
  onDrag,
  onRelease,
}: ControlProps) {
  const label = useMemo(
    () => (config?.label == undefined ? splitCamelCase(name) : config?.label),
    [config, name],
  );
  const innerSchema = useMemo(() => removeDefault(schema), [schema]);

  if (innerSchema instanceof z.ZodNumber) {
    const { min, max } = getNumberDef(innerSchema);
    return (
      <Slider
        indent={indent}
        label={label}
        value={value as number}
        onChange={onChange}
        min={min}
        max={max}
        onDrag={onDrag}
        onRelease={onRelease}
      />
    );
  } else if (innerSchema instanceof z.ZodEnum) {
    const options = getEnumDef(innerSchema);
    return (
      <SliderSelect 
        indent={indent}
        label={label}
        value={value as string}
        onChange={onChange}
        options={options}
        onDrag={onDrag}
        onRelease={onRelease}
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
          onDrag={onDrag}
          onRelease={onRelease}
        />
      </>
    );
  }

  return <ReadOnly label={label} value={`${value}`} />;
}
