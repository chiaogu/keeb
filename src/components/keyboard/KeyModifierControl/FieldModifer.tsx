import ReadOnly from '@src/components/shared/ReadOnly';
import Slider from '@src/components/shared/Slider';
import { ModifierOp } from '@src/keyboard/keySoundModifier';
import { SynthNodeState } from '@src/synth';
import { nodeConfig } from '@src/synth/config';
import { getNumberDef, removeDefault } from '@src/utils/schema';
import { z } from 'zod';

type FieldModifierProps = {
  field: string;
  modifier: ModifierOp;
  node?: SynthNodeState;
  onChange: (value: unknown) => void;
};

const INDENT = 3;

export default function FieldModifier({
  field,
  modifier: [operation, value],
  node,
  onChange,
}: FieldModifierProps) {
  const valid = node?.data?.[field] != undefined;

  if (!valid) {
    return (
      <ReadOnly
        className='border-l-2 border-dotted border-l-black'
        key={field}
        indent={INDENT}
        label={`[invalid] ${field}`}
        value={`${operation} ${value}`}
      />
    );
  }

  const schema = removeDefault(
    nodeConfig[node.type].schema.shape[field as never],
  );

  // TODO: Percentage instead of absolute value
  if (schema instanceof z.ZodNumber) {
    const { min, max, step } = getNumberDef(schema);
    const range = (max - min) / 2;
    return (
      <Slider
        className='border-l-2 border-dotted border-l-black'
        indent={INDENT}
        label={field}
        value={value as number}
        onChange={onChange}
        min={-range}
        max={range}
        step={step}
      />
    );
  }

  return null;
}
