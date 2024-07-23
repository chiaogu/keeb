import { SynthConfig } from '@src/synth';
import { zBaseSynthSrc } from '@src/synth/config/shared';
import { SoundConfig } from '@src/types';
import { findEnvelope } from '@src/utils/utils';
import { useMemo, useState } from 'react';
import LabelField from '../shared/LabelField';
import SectionHeader from '../shared/SectionHeader';
import Adsr from './Adsr';

type TimelineBlockProps = {
  synth: SynthConfig;
  maxDuration: number;
  maxDelay: number;
};

function TimelineBlock({ synth, maxDuration, maxDelay }: TimelineBlockProps) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const { duration, delay } = zBaseSynthSrc.parse(synth.src.data);
  const envelope = findEnvelope(synth);

  return (
    <div className='relative h-8 w-full' ref={setContainer}>
      <div
        style={{ top: 'calc(50% - 0.5px)' }}
        className='absolute h-px w-full bg-black'
      ></div>
      <div
        style={{
          width: `${Math.max(1, (duration / (maxDuration + maxDelay)) * 100)}%`,
          left: `${(delay / (maxDuration + maxDelay)) * 100}%`,
        }}
        className='absolute  h-full overflow-hidden border-r border-black'
      >
        {envelope && (
          <div
            style={{ width: container?.clientWidth ?? 0 }}
            className='absolute flex h-full'
          >
            <Adsr envelope={envelope} maxDuration={maxDuration} />
          </div>
        )}
      </div>
    </div>
  );
}

type SoundLayerTimelineProps = {
  sound: SoundConfig;
};

export function SoundLayerTimeline({ sound }: SoundLayerTimelineProps) {
  const { maxDuration, maxDelay } = useMemo(
    () => ({
      maxDuration: Math.max(
        ...sound.synths.map(
          ({ src }) => zBaseSynthSrc.parse(src.data).duration,
        ),
      ),
      maxDelay: Math.max(
        ...sound.synths.map(({ src }) => zBaseSynthSrc.parse(src.data).delay),
      ),
    }),
    [sound.synths],
  );
  return (
    <>
      <SectionHeader className='mt-4 font-bold' label='timeline'>
        <div className='font-normal'>{(maxDuration + maxDelay).toFixed(2)}s</div>
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
            maxDelay={maxDelay}
          />
        </LabelField>
      ))}
    </>
  );
}
