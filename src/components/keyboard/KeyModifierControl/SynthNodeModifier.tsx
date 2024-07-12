import ReadOnly from '@src/components/shared/ReadOnly';
import { SynthNodeModifier } from '@src/keyboard/keySoundModifier';
import { SynthConfig } from '@src/synth';
import FieldModifier from './FieldModifer';

type SynthNodeModifierProps = {
  nodeId: string;
  synth?: SynthConfig;
  fields: SynthNodeModifier;
  onChange: (field: string, value: unknown) => void;
};

export default function SynthNodeModifierControl({
  nodeId,
  synth,
  fields,
  onChange,
}: SynthNodeModifierProps) {
  const synthNodes = !synth ? null : [synth.src, ...synth.fxs];
  const node = synthNodes?.find(({ id }) => id === nodeId);
  return (
    <div key={nodeId} className='border-l-2 border-dotted border-l-black'>
      <ReadOnly
        indent={2}
        label={node?.type ?? 'missing synth node'}
        value=''
      />
      {Object.entries(fields).map(([field, modifier]) => (
        <FieldModifier
          key={field}
          field={field}
          modifier={modifier}
          node={node}
          onChange={(value) => onChange(field, value)}
        />
      ))}
    </div>
  );
}
