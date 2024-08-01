import { Sound } from '@src/hooks/useSound';
import useUplodaFile from '@src/hooks/useUplodaFile';
import { SynthConfig } from '@src/synth';
import { zBaseSynthSrc } from '@src/synth/config/shared';
import * as Tone from '@src/tone';
import { SoundConfig } from '@src/types';
import { COLOR } from '@src/utils/constants';
import { downloadSound } from '@src/utils/file';
import { useMemo } from 'react';
import IconButton from '../shared/IconButton';
import SectionHeader from '../shared/SectionHeader';
import FFT from './FFT';
import TimelineBlock from './TimelineBlock';
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
  onRemoveLayer: (index: number) => void;
};

export function SoundLayerControl({
  sound,
  selectedSynth,
  channel,
  onAddLayer,
  onNameChange,
  onLoadSound,
  onSelectLayer,
  onRemoveLayer,
}: SoundLayerControlProps) {
  // TODO: Validation
  const { load } = useUplodaFile(onLoadSound);

  const maxDelayAndDuration = useMemo(
    () =>
      Math.max(
        ...sound.synths.map(
          ({ src }) =>
            zBaseSynthSrc.parse(src.data).delay +
            zBaseSynthSrc.parse(src.data).duration,
        ),
      ),
    [sound.synths],
  );

  return (
    <div
      style={{ background: COLOR.BG }}
      className='flex w-full flex-col items-center p-8 pb-0'
    >
      <SectionHeader
        className='font-bold'
        label={sound.name}
        onLabelChange={onNameChange}
      >
        {/* <div className='font-normal'>{Math.round(maxDelayAndDuration * 1000)}ms</div> */}

        <IconButton icon='upload' onClick={load} />
        <IconButton icon='download' onClick={() => downloadSound(sound)} />
        <IconButton
          icon='add'
          onClick={() => {
            onAddLayer();
            onSelectLayer(sound.synths.length);
          }}
        />
      </SectionHeader>
      <div className='mt-2 flex w-full flex-col'>
        {/* // <div className='fixed bottom-4 left-6 flex items-center rounded-md bg-[rgba(255,255,255,0.5)] px-2 pb-2 backdrop-blur-sm'>
    // </div> */}
        {sound.synths.map((synth) => (
          <TimelineBlock
            key={synth.id}
            synth={synth}
            maxDelayAndDuration={maxDelayAndDuration}
            selected={synth.id === selectedSynth.id}
            onClickWatch={() =>
              onSelectLayer(sound.synths.findIndex((s) => s.id === synth.id))
            }
            onClickListen={() => {}}
            onRemove={() =>
              onRemoveLayer(sound.synths.findIndex((s) => s.id === synth.id))
            }
            removable={sound.synths.length > 1}
          />
        ))}
      </div>
    </div>
  );
}
