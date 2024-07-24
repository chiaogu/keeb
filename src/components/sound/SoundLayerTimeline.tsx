import { zBaseSynthSrc } from '@src/synth/config/shared';
import { SoundConfig } from '@src/types';
import { useMemo } from 'react';
import LabelField from '../shared/LabelField';
import SectionHeader from '../shared/SectionHeader';
import TimelineBlock from './TimelineBlock';

type SoundLayerTimelineProps = {
  sound: SoundConfig;
};

export function SoundLayerTimeline({ sound }: SoundLayerTimelineProps) {
  const { maxDuration, maxDelayAndDuration } = useMemo(
    () => ({
      maxDuration: Math.max(
        ...sound.synths.map(
          ({ src }) => zBaseSynthSrc.parse(src.data).duration,
        ),
      ),
      maxDelayAndDuration: Math.max(
        ...sound.synths.map(
          ({ src }) =>
            zBaseSynthSrc.parse(src.data).delay +
            zBaseSynthSrc.parse(src.data).duration,
        ),
      ),
    }),
    [sound.synths],
  );
  return (
    <>
      <SectionHeader className='mt-4 font-bold' label='timeline'>
        <div className='font-normal'>
          {Math.round(maxDelayAndDuration * 1000)}ms
        </div>
      </SectionHeader>
      {sound.synths.map((synth) => (
        <LabelField
          key={synth.id}
          label={synth.name}
          containerClassName='items-center mb-2'
        >
          <TimelineBlock
            synth={synth}
            maxDuration={maxDuration}
            maxDelayAndDuration={maxDelayAndDuration}
          />
        </LabelField>
      ))}
    </>
  );
}
