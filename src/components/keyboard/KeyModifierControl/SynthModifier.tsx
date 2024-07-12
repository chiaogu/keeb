import SectionHeader from '@src/components/shared/SectionHeader';
import { SynthModifier } from '@src/keyboard/keySoundModifier';
import { SynthConfig } from '@src/synth';
import SynthNodeModifierControl from './SynthNodeModifier';

type SynthModifierControl = {
  synthId: string;
  synths: SynthConfig[];
  nodes: SynthModifier;
};

export default function SynthModifierControl({
  synthId,
  synths,
  nodes,
}: SynthModifierControl) {
  const synth = synths.find(({ id }) => id === synthId);
  return (
    <div key={synthId} className='w-full'>
      <SectionHeader
        key={synthId}
        label={synth?.name ?? 'missing sound layer'}
      />
      {Object.entries(nodes).map(([nodeId, fields]) => (
        <SynthNodeModifierControl
          key={nodeId}
          nodeId={nodeId}
          synth={synth}
          fields={fields}
        />
      ))}
    </div>
  );
}
