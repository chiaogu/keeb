import { SynthConfig } from '@src/synth';
import { zBaseSynthSrc } from '@src/synth/config/shared';
import { findEnvelope } from '@src/utils/utils';
import { useState } from 'react';
import Adsr from './Adsr';

type TimelineBlockProps = {
  synth: SynthConfig;
  maxDuration: number;
  maxDelayAndDuration: number;
};

export default function TimelineBlock({
  synth,
  maxDuration,
  maxDelayAndDuration,
}: TimelineBlockProps) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const { duration, delay } = zBaseSynthSrc.parse(synth.src.data);
  const envelope = findEnvelope(synth);

  return (
    <div className='relative h-6 w-full bg-white' ref={setContainer}>
      <div
        style={{
          width: `${Math.max(1, ((duration + delay) / maxDelayAndDuration) * 100)}%`,
        }}
        className='absolute bottom-0 h-1/2 w-full border-b border-black'
      ></div>
      <div
        style={{
          width: `${Math.max(1, (duration / maxDelayAndDuration) * 100)}%`,
          left: `${(delay / maxDelayAndDuration) * 100}%`,
        }}
        className='absolute  h-full overflow-hidden'
      >
        <div className='absolute flex size-full'>
          {envelope && (
            <Adsr envelope={envelope} maxDuration={maxDelayAndDuration} />
          )}
          {!envelope && (
            <div className='absolute flex size-full bg-black'></div>
          )}
        </div>
      </div>
      {/* <TimeCursor
        width={container?.clientWidth ?? 0}
        maxDelayAndDuration={maxDelayAndDuration}
      /> */}
    </div>
  );
}
