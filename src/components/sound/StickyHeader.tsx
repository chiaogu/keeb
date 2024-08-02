import { SynthConfig } from '@src/synth';
import { zBaseSynthSrc } from '@src/synth/config/shared';
import * as Tone from '@src/tone';
import { SoundConfig } from '@src/types';
import { COLOR } from '@src/utils/constants';
import { findEnvelope } from '@src/utils/utils';
import { useMemo } from 'react';
import TimelineBlockEnvelope from './TimelineBlockEnvelope';
import FFT from './FFT';
import Waveform from './Waveform';
import VolumeMeter from './VolumeMeter';

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
      style={{ marginTop: 0, background: COLOR.BG }}
      className='sticky top-0 z-10 w-full'
    >
      {/* <div className='flex w-full items-center space-x-2 px-8 pb-6 pt-0'>
        <div className='h-[28px] flex-1'>
          <FFT channel={channel} />
        </div>
        <div className='mt-3 h-[14px] flex-1'>
          <Waveform channel={channel} />
        </div>
        <div className='flex-1'>
          <VolumeMeter channel={channel} />
        </div>
      </div> */}
      <div className='h-14 w-full px-8 py-3'>
        <div className='relative size-full'>
        <TimelineBlockEnvelope
          synth={selectedSynth}
          maxDelayAndDuration={maxDelayAndDuration}
        />
        </div>
      </div>
    </div>
  );
}
