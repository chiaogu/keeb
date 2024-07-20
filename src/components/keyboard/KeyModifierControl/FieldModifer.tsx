import IconButton from '@src/components/shared/IconButton';
import RadioGroup from '@src/components/shared/RadioGroup';
import ReadOnly from '@src/components/shared/ReadOnly';
import SectionHeader from '@src/components/shared/SectionHeader';
import Slider from '@src/components/shared/Slider';
import { ModifierOp } from '@src/keyboard/keySoundModifier';
import { SynthNodeState } from '@src/synth';
import { nodeConfig } from '@src/synth/config';
import { getNestedFieldSchema } from '@src/utils/schema';
import { formatModifierValue } from '@src/utils/utils';
import { get } from 'lodash';
import { z } from 'zod';

type FieldModifierProps = {
  fieldPath: string[];
  modifier: ModifierOp;
  node?: SynthNodeState;
  onChange: (value: ModifierOp) => void;
};

export default function FieldModifier({
  fieldPath,
  modifier: [_operation, value],
  node,
  onChange,
}: FieldModifierProps) {
  const field = fieldPath[fieldPath.length - 1];
  const valid = node && get(node?.data, fieldPath) != undefined;

  if (!valid) {
    return (
      <ReadOnly
        key={field}
        label={`[invalid] ${field}`}
        value={formatModifierValue(value)}
      />
    );
  }

  const schema = getNestedFieldSchema(nodeConfig[node.type].schema, fieldPath);
  
  return (
    <>
      <div className='flex w-full items-start'>
        {schema instanceof z.ZodNumber && (
          <Slider
            label={field}
            value={value as number}
            onChange={(v) => onChange(['add', v])}
            min={-0.5}
            max={0.5}
            renderValue={formatModifierValue}
          />
        )}
        {schema instanceof z.ZodEnum && (
          <RadioGroup
            label={field}
            values={[value as string]}
            onChange={([o]) => onChange(['set', o])}
            options={schema.options}
          />
        )}
        <IconButton className="ml-4" icon='remove' />
      </div>
    </>
  );
}
