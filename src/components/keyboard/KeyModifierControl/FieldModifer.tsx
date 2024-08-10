import IconButton from '@src/components/shared/IconButton';
import Slider from '@src/components/shared/Slider';
import { ControlSliderSelect } from '@src/components/shared/SliderSelect';
import { ModifierOp } from '@src/keyboard/keySoundModifier';
import { SynthNodeState } from '@src/synth';
import { nodeConfig } from '@src/synth/config';
import { getNestedFieldSchema } from '@src/utils/schema';
import { formatModifierValue } from '@src/utils/utils';
import { get } from 'lodash-es';
import { z } from 'zod';
import InvalidFieldModifier from './InvalidFieldModifier';

type FieldModifierProps = {
  fieldPath: string[];
  modifier: ModifierOp;
  node?: SynthNodeState;
  onChange: (value: ModifierOp) => void;
  onRemove: () => void;
  onClickInvalidField: () => void;
  showFixButton: boolean;
  highlighted: boolean;
};

export default function FieldModifier({
  fieldPath,
  modifier: [_operation, value],
  node,
  onChange,
  onRemove,
  onClickInvalidField,
  showFixButton,
  highlighted,
}: FieldModifierProps) {
  const field = fieldPath[fieldPath.length - 1];
  const valid = node && get(node?.data, fieldPath) != undefined;
  const schema =
    valid && getNestedFieldSchema(nodeConfig[node.type].schema, fieldPath);

  if (!valid || !schema) {
    return (
      <InvalidFieldModifier
        field={field}
        onClick={onClickInvalidField}
        onRemove={onRemove}
        showFixButton={showFixButton}
        highlighted={highlighted}
      />
    );
  }

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
          <ControlSliderSelect
            indent={0}
            label={field}
            value={value as string}
            onChange={(v) => onChange(['set', v])}
            options={schema.options}
          />
        )}
        <IconButton className='ml-2' icon='remove' onClick={onRemove} />
      </div>
    </>
  );
}
