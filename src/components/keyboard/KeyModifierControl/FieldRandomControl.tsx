import IconButton from '@src/components/shared/IconButton';
import RadioGroup from '@src/components/shared/RadioGroup';
import SectionHeader from '@src/components/shared/SectionHeader';
import SliderRange from '@src/components/shared/SliderRange';
import { SynthNodeState } from '@src/synth';
import { nodeConfig } from '@src/synth/config';
import { FieldRandomConfig } from '@src/types';
import { getNestedFieldSchema } from '@src/utils/schema';
import { get } from 'lodash-es';
import { z } from 'zod';
import InvalidFieldModifier from './InvalidFieldModifier';
import { getValueBg } from '@src/utils/utils';
import { MAX_BRIGHTNESS } from '@src/utils/constants';

type FieldRandomControlProps = {
  fieldPath: string[];
  randomConfig: FieldRandomConfig;
  node?: SynthNodeState;
  onChange: (randomConfig: FieldRandomConfig) => void;
  onClickInvalidField: () => void;
  onClickRemove: () => void;
  showFixButton: boolean;
  highlighted: boolean;
};

export default function FieldRandomControl({
  fieldPath,
  randomConfig: { min = -0.3, max = 0.3, options },
  node,
  onChange,
  onClickInvalidField,
  onClickRemove,
  showFixButton,
  highlighted,
}: FieldRandomControlProps) {
  const field = fieldPath[fieldPath.length - 1];
  const valid = node && get(node?.data, fieldPath) != undefined;

  if (!valid) {
    return (
      <InvalidFieldModifier
        field={field}
        onClick={onClickInvalidField}
        onRemove={() => {}}
        showFixButton={showFixButton}
        highlighted={highlighted}
      />
    );
  }

  const schema = getNestedFieldSchema(nodeConfig[node.type].schema, fieldPath);

  return (
    <>
      {schema instanceof z.ZodNumber && (
        <div className='flex'>
          <SliderRange
            background={`linear-gradient(to right, ${getValueBg(MAX_BRIGHTNESS)}, black)`}
            label={field}
            min={-0.5}
            max={0.5}
            lower={min}
            upper={max}
            onLowerChange={(v) => onChange({ max, min: Math.min(v, max) })}
            onUpperChange={(v) => onChange({ min, max: Math.max(v, min) })}
          />
          <IconButton className='ml-2 shrink-0' icon='remove' onClick={onClickRemove} />
        </div>
      )}
      {schema instanceof z.ZodEnum && (
        <>
          <SectionHeader label={field}>
            <IconButton icon='remove' onClick={onClickRemove} />
          </SectionHeader>
          <div className='flex w-full border-l-2 border-dotted border-l-black pl-2'>
            <RadioGroup
              values={options}
              onChange={(selected) => onChange({ options: selected })}
              options={schema.options}
              multi
            />
          </div>
        </>
      )}
    </>
  );
}
