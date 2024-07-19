import IconButton from '@src/components/shared/IconButton';
import RadioGroup from '@src/components/shared/RadioGroup';
import SectionHeader from '@src/components/shared/SectionHeader';
import Slider from '@src/components/shared/Slider';
import { SynthNodeState } from '@src/synth';
import { nodeConfig } from '@src/synth/config';
import { FieldRandomConfig } from '@src/types';
import { getNestedFieldSchema } from '@src/utils/schema';
import { formatModifierValue } from '@src/utils/utils';
import { get } from 'lodash';
import { z } from 'zod';
import InvalidFieldModifier from './InvalidFieldModifier';

type FieldRandomControlProps = {
  fieldPath: string[];
  randomConfig: FieldRandomConfig;
  node?: SynthNodeState;
  onChange: (randomConfig: FieldRandomConfig) => void;
  onClickInvalidField: () => void;
  onClickRemove: () => void;
  showFixButton: boolean;
};

export default function FieldRandomControl({
  fieldPath,
  randomConfig: { min = -0.3, max = 0.3, options },
  node,
  onChange,
  onClickInvalidField,
  onClickRemove,
  showFixButton,
}: FieldRandomControlProps) {
  const field = fieldPath[fieldPath.length - 1];
  const valid = node && get(node?.data, fieldPath) != undefined;

  if (!valid) {
    return (
      <InvalidFieldModifier
        field={field}
        onClick={onClickInvalidField}
        showFixButton={showFixButton}
      />
    );
  }

  const schema = getNestedFieldSchema(nodeConfig[node.type].schema, fieldPath);

  return (
    <>
      <SectionHeader label={field}>
        <IconButton icon='remove' onClick={onClickRemove} />
      </SectionHeader>
      {schema instanceof z.ZodNumber && (
        <div className='flex w-full flex-col items-center border-l-2 border-dotted border-l-black pl-[16px]'>
          <Slider
            label='min'
            value={min}
            onChange={(v) => onChange({ max, min: Math.min(v, max) })}
            min={-0.5}
            max={0.5}
            renderValue={formatModifierValue}
          />
          <Slider
            label='max'
            value={max}
            onChange={(v) => onChange({ min, max: Math.max(v, min) })}
            min={-0.5}
            max={0.5}
            renderValue={formatModifierValue}
          />
        </div>
      )}
      {schema instanceof z.ZodEnum && (
        <RadioGroup
          label='options'
          values={options}
          onChange={(selected) => onChange({ options: selected })}
          options={schema.options}
          multi
        />
      )}
    </>
  );
}
