import { ModifierLayer, SoundConfig } from '@src/types';
import IconButton from '../../shared/IconButton';
import SectionHeader from '../../shared/SectionHeader';
import SynthModifierControl from './SynthModifier';

type KeyModifierProps = {
  selectedKey?: string;
  selectedLayer: ModifierLayer;
  sound: SoundConfig;
};

export default function KeyModifierControl({
  selectedKey,
  selectedLayer,
  sound,
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
                synths={sound.synths}
                nodes={nodes}
              />
            ),
          )}
          <SectionHeader className='mt-4' label='new'>
            <IconButton icon='add' onClick={() => {}} />
          </SectionHeader>
        </>
      )}
    </div>
  );
}
