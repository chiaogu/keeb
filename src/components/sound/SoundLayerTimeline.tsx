import { SynthConfig } from '@src/synth';
import { zBaseSynthSrc } from '@src/synth/config/shared';
import { SoundConfig } from '@src/types';
import { findEnvelope } from '@src/utils/utils';
import { useMemo, useState } from 'react';
import LabelField from '../shared/LabelField';
import SectionHeader from '../shared/SectionHeader';
import Adsr from './Adsr';

function TimeCursor() {
  return null;
}

type TimelineBlockProps = {
  synth: SynthConfig;
  maxDuration: number;
  maxDelayAndDuration: number;
};

function TimelineBlock({
  synth,
  maxDuration,
  maxDelayAndDuration,
}: TimelineBlockProps) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const { duration, delay } = zBaseSynthSrc.parse(synth.src.data);
  const envelope = findEnvelope(synth);

  return (
    <div className='relative h-6 w-full' ref={setContainer}>
      <div
        style={{
          width: `${Math.max(1, ((duration + delay) / maxDelayAndDuration) * 100)}%`,
        }}
        className='absolute bottom-0 h-1/2 w-full border-b-2 border-dotted border-black'
      ></div>
      <div
        style={{
          width: `${Math.max(1, (duration / maxDelayAndDuration) * 100)}%`,
          left: `${(delay / maxDelayAndDuration) * 100}%`,
        }}
        className='absolute  h-full overflow-hidden'
      >
        <div
          style={{ width: container?.clientWidth ?? 0 }}
          className='absolute flex h-full'
        >
          {envelope && <Adsr envelope={envelope} maxDuration={maxDuration} />}
          {!envelope && (
            <div className='absolute flex size-full bg-black'></div>
          )}
        </div>
      </div>
    </div>
  );
}

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
        <div className='font-normal'>{maxDelayAndDuration.toFixed(2)}s</div>
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
