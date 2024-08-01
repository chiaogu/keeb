import { zBaseSynthSrc } from '@src/synth/config/shared';
import { SoundConfig } from '@src/types';
import { useMemo } from 'react';
import SectionHeader from '../shared/SectionHeader';
import TimelineBlock from './TimelineBlock';

type SoundLayerTimelineProps = {
  sound: SoundConfig;
  className?: string;
};

export function SoundLayerTimeline({
  sound,
  className,
}: SoundLayerTimelineProps) {
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
    <div className={className}>
      <SectionHeader className='mt-4' label='layers'>
        <div className='font-normal'>
          {Math.round(maxDelayAndDuration * 1000)}ms
        </div>
      </SectionHeader>
      {sound.synths.map((synth) => (
        <TimelineBlock
          key={synth.id}
          synth={synth}
          maxDelayAndDuration={maxDelayAndDuration}
        />
      ))}
    </div>
  );
}
