import ReadOnly from '@src/components/shared/ReadOnly';
import Slider from '@src/components/shared/Slider';
import { SynthNodeState } from '@src/synth';
import { nodeConfig } from '@src/synth/config';
import { FieldRandomConfig } from '@src/types';
import { removeDefault } from '@src/utils/schema';
import { z } from 'zod';

type FieldRandomControlProps = {
  field: string;
  randomConfig: FieldRandomConfig;
  node: SynthNodeState;
  onChange: (randomConfig: FieldRandomConfig) => void;
};

export default function FieldRandomControl({
  field,
  randomConfig,
  node,
  onChange,
}: FieldRandomControlProps) {
  const valid = node?.data?.[field] != undefined;

  if (!valid) {
    return <ReadOnly key={field} label={`[invalid] ${field}`} value='' />;
  }

  const schema = removeDefault(
    nodeConfig[node.type].schema.shape[field as never],
  );

  if (schema instanceof z.ZodNumber) {
    return (
      <div className='flex w-full flex-col items-center'>
        <ReadOnly label={field} />
        <Slider
          label='min'
          value={randomConfig.min ?? -0.3}
          onChange={() => {}}
          min={-1}
          max={1}
        />
        <Slider
          label='max'
          value={randomConfig.max ?? 0.3}
          onChange={() => {}}
          min={-1}
          max={1}
        />
      </div>
    );
  }

  return null;
}
