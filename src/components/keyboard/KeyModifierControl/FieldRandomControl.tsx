import ReadOnly from '@src/components/shared/ReadOnly';
import Slider from '@src/components/shared/Slider';
import { SynthNodeState } from '@src/synth';
import { nodeConfig } from '@src/synth/config';
import { FieldRandomConfig } from '@src/types';
import { removeDefault } from '@src/utils/schema';
import { formatModifierValue } from '@src/utils/utils';
import { z } from 'zod';
import InvalidFieldModifier from './InvalidFieldModifier';
import SectionHeader from '@src/components/shared/SectionHeader';
import IconButton from '@src/components/shared/IconButton';

type FieldRandomControlProps = {
  field: string;
  randomConfig: FieldRandomConfig;
  node?: SynthNodeState;
  onChange: (randomConfig: FieldRandomConfig) => void;
  onClickInvalidField: () => void;
  onClickRemove: () => void;
};

export default function FieldRandomControl({
  field,
  randomConfig,
  node,
  onChange,
  onClickInvalidField,
  onClickRemove,
}: FieldRandomControlProps) {
  const valid = node?.data?.[field] != undefined;

  if (!valid) {
    return <InvalidFieldModifier field={field} onClick={onClickInvalidField} />;
  }

  const schema = removeDefault(
    nodeConfig[node.type].schema.shape[field as never],
  );

  if (schema instanceof z.ZodNumber) {
    const min = randomConfig.min ?? -0.3;
    const max = randomConfig.max ?? 0.3;
    return (
      <>
        <SectionHeader label={field}>
          <IconButton icon="remove" onClick={onClickRemove} />
        </SectionHeader>
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
      </>
    );
  }

  return null;
}
