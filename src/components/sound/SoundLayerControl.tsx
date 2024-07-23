import { Sound } from '@src/hooks/useSound';
import useUplodaFile from '@src/hooks/useUplodaFile';
import { SynthConfig } from '@src/synth';
import { SoundConfig } from '@src/types';
import { downloadSound } from '@src/utils/file';
import IconButton from '../shared/IconButton';
import SectionHeader from '../shared/SectionHeader';
import RadioGroup from '../shared/RadioGroup';
import { SoundLayerTimeline } from './SoundLayerTimeline';

type SoundLayerControlProps = {
  sound: SoundConfig;
  selectedSynth: SynthConfig;
  onAddLayer: Sound['addLayer'];
  onNameChange: Sound['setName'];
  onLoadSound: (sound: SoundConfig) => void;
  onSelectLayer: (index: number) => void;
};

export function SoundLayerControl({
  sound,
  selectedSynth,
  onAddLayer,
  onNameChange,
  onLoadSound,
  onSelectLayer,
}: SoundLayerControlProps) {
  // TODO: Validation
  const { load } = useUplodaFile(onLoadSound);

  return (
    <div className='flex w-full flex-col items-center border-2 border-black p-8'>
      <SectionHeader
        className='font-bold'
        label={sound.name}
        onLabelChange={onNameChange}
      >
        <IconButton icon='upload' onClick={load} />
        <IconButton icon='download' onClick={() => downloadSound(sound)} />
      </SectionHeader>
      <div className='flex w-full flex-col'>
        <RadioGroup
          label='layers'
          values={[selectedSynth.id]}
          onChange={([id]) =>
            onSelectLayer(sound.synths.findIndex((s) => s.id === id))
          }
          options={sound.synths.map(({ id, name }) => ({
            key: id,
            label: name,
          }))}
        />
        <SectionHeader label='new'>
          <IconButton
            icon='add'
            onClick={() => {
              onAddLayer();
              onSelectLayer(sound.synths.length);
            }}
          />
        </SectionHeader>
        <SoundLayerTimeline sound={sound}/>
      </div>
    </div>
  );
}
