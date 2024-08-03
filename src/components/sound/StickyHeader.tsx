import { SynthConfig } from '@src/synth';
import { zBaseSynthSrc } from '@src/synth/config/shared';
import * as Tone from '@src/tone';
import { SoundConfig } from '@src/types';
import { useMemo } from 'react';
import { useMainContext } from '../shared/MainContext';
import FFT from './FFT';
import TimelineBlockEnvelope from './TimelineBlockEnvelope';
import VolumeMeter from './VolumeMeter';
import Waveform from './Waveform';

type StickyHeaderProps = {
  channel: Tone.ToneAudioNode;
  sound: SoundConfig;
  selectedSynth: SynthConfig;
};

export default function StickyHeader({
  channel,
  sound,
  selectedSynth,
}: StickyHeaderProps) {
  const { timelineVisible } = useMainContext();
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
      style={{
        marginTop: 0,
        width: 'calc(100% - 2rem)',
        background: 'rgba(0,0,0,0.6)',
        boxShadow: '0 5px 10px 0px rgba(0,0,0,0.3)',
      }}
      className='sticky top-2 z-20 mx-4 rounded-md backdrop-blur-md'
    >
      {!timelineVisible && (
        <div className='flex w-full items-center space-x-2 px-8 pb-6 pt-0 invert'>
          <div className='h-[28px] flex-1'>
            <FFT channel={channel} />
          </div>
          <div className='mt-3 h-[14px] flex-1'>
            <Waveform channel={channel} />
          </div>
          <div className='flex-1'>
            <VolumeMeter channel={channel} />
          </div>
        </div>
      )}
      {timelineVisible && (
        <div className='h-14 w-full px-8 py-3 invert'>
          <div className='relative size-full'>
            <TimelineBlockEnvelope
              synth={selectedSynth}
              maxDelayAndDuration={maxDelayAndDuration}
            />
          </div>
        </div>
      )}
    </div>
  );
}
