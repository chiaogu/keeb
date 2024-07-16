import ReadOnly from '@src/components/shared/ReadOnly';
import Slider from '@src/components/shared/Slider';
import { ModifierOp } from '@src/keyboard/keySoundModifier';
import { SynthNodeState } from '@src/synth';
import { nodeConfig } from '@src/synth/config';
import { removeDefault } from '@src/utils/schema';
import { formatModifierValue } from '@src/utils/utils';
import { z } from 'zod';

type FieldModifierProps = {
  field: string;
  modifier: ModifierOp;
  node?: SynthNodeState;
  onChange: (value: unknown) => void;
};

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
        key={field}
        label={`[invalid] ${field}`}
        value={formatModifierValue(value)}
      />
    );
  }

  const schema = removeDefault(
    nodeConfig[node.type].schema.shape[field as never],
  );

  if (schema instanceof z.ZodNumber) {
    return (
      <Slider
        label={field}
        value={value as number}
        onChange={onChange}
        min={-0.5}
        max={0.5}
        renderValue={formatModifierValue}
      />
    );
  }

  return null;
}
