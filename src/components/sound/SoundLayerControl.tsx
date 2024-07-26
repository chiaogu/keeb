import { Sound } from '@src/hooks/useSound';
import useUplodaFile from '@src/hooks/useUplodaFile';
import { SynthConfig } from '@src/synth';
import * as Tone from '@src/tone';
import { SoundConfig } from '@src/types';
import { downloadSound } from '@src/utils/file';
import IconButton from '../shared/IconButton';
import RadioGroup from '../shared/RadioGroup';
import SectionHeader from '../shared/SectionHeader';
import FFT from './FFT';
import { SoundLayerTimeline } from './SoundLayerTimeline';
import Waveform from './Waveform';
import VolumeMeter from './VolumeMeter';

type SoundLayerControlProps = {
  sound: SoundConfig;
  selectedSynth: SynthConfig;
  channel: Tone.ToneAudioNode;
  onAddLayer: Sound['addLayer'];
  onNameChange: Sound['setName'];
  onLoadSound: (sound: SoundConfig) => void;
  onSelectLayer: (index: number) => void;
};

export function SoundLayerControl({
  sound,
  selectedSynth,
  channel,
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
        <SoundLayerTimeline sound={sound} className='mb-4' />
        <VolumeMeter channel={channel}/>
        <FFT channel={channel} />
        <div className='mt-3'>
        <Waveform channel={channel} />
        </div>
      </div>
    </div>
  );
}
