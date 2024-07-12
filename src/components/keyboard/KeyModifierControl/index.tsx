import { ModifierLayer, SoundConfig } from '@src/types';
import IconButton from '../../shared/IconButton';
import SectionHeader from '../../shared/SectionHeader';
import SynthModifierControl from './SynthModifier';
import { SynthConfig } from '@src/synth';

type KeyModifierProps = {
  selectedKey?: string;
  selectedLayer: ModifierLayer;
  synths: SynthConfig[];
  onChange: (args: {
    synthId: string;
    nodeId: string;
    field: string;
    value: unknown;
  }) => void;
};

export default function KeyModifierControl({
  selectedKey,
  selectedLayer,
  synths,
  onChange,
}: KeyModifierProps) {
  return (
    <div className='flex w-full max-w-[500px] flex-col items-center border-2 border-black p-8'>
      {!selectedKey && 'select a key'}
      {selectedKey && (
        <>
          <SectionHeader className='font-bold' label={selectedKey} />
          {Object.entries(selectedLayer.keys[selectedKey] ?? {}).map(
            ([synthId, nodes]) => (
              <SynthModifierControl
                key={synthId}
                synthId={synthId}
                synths={synths}
                nodes={nodes}
                onChange={(args) => onChange({ ...args, synthId })}
              />
            ),
          )}
          <SectionHeader className='mt-4' label='new'>
            <IconButton
              icon='add'
              onClick={() =>
                onChange({
                  synthId: synths[0].id,
                  nodeId: synths[0].src.id,
                  field: 'frequency',
                  value: 0,
                })
              }
            />
          </SectionHeader>
        </>
      )}
    </div>
  );
}
