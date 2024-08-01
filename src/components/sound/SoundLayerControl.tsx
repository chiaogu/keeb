import { Sound } from '@src/hooks/useSound';
import useUplodaFile from '@src/hooks/useUplodaFile';
import { SynthConfig } from '@src/synth';
import * as Tone from '@src/tone';
import { SoundConfig } from '@src/types';
import { COLOR } from '@src/utils/constants';
import { downloadSound } from '@src/utils/file';
import IconButton from '../shared/IconButton';
import RadioGroup from '../shared/RadioGroup';
import SectionHeader from '../shared/SectionHeader';
import FFT from './FFT';
import { SoundLayerTimeline } from './SoundLayerTimeline';
import VolumeMeter from './VolumeMeter';
import Waveform from './Waveform';

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
    <div
      style={{ background: COLOR.BG }}
      className='flex w-full flex-col items-center p-8'
    >
      <SectionHeader
        className='font-bold'
        label={sound.name}
        onLabelChange={onNameChange}
      >
        <IconButton icon='upload' onClick={load} />
        <IconButton icon='download' onClick={() => downloadSound(sound)} />
      </SectionHeader>
      <div className='flex w-full flex-col mt-2'>
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
        
    {/* // <div className='fixed bottom-4 left-6 flex items-center rounded-md bg-[rgba(255,255,255,0.5)] px-2 pb-2 backdrop-blur-sm'>
    // </div> */}
        <SoundLayerTimeline sound={sound} />
        <VolumeMeter channel={channel} />
        <FFT channel={channel} />
        <div className='mt-3'>
          <Waveform channel={channel} />
        </div>
      </div>
    </div>
  );
}
