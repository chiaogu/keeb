import { SynthConfig } from '@src/synth';
import { zBaseSynthSrc } from '@src/synth/config/shared';
import { CONTROL_SHADOW } from '@src/utils/constants';
import { findEnvelope } from '@src/utils/utils';
import { useMemo } from 'react';
import Adsr from './Adsr';

type TimelineBlockProps = {
  synth: SynthConfig;
  maxDelayAndDuration: number;
  bgStyle?: React.CSSProperties;
};

export default function TimelineBlockEnvelope({
  synth,
  maxDelayAndDuration,
  bgStyle,
}: TimelineBlockProps) {
  const { duration, delay } = useMemo(
    () => zBaseSynthSrc.parse(synth.src.data),
    [synth.src.data],
  );
  const envelope = useMemo(() => findEnvelope(synth), [synth]);

  return (
    <>
      <div
        style={{
          width: `${Math.max(1, ((duration + delay) / maxDelayAndDuration) * 100)}%`,
          ...bgStyle,
        }}
        className='absolute bottom-0 size-full'
      ></div>
      <div
        style={{
          width: `${Math.max(1, (duration / maxDelayAndDuration) * 100)}%`,
          left: `${(delay / maxDelayAndDuration) * 100}%`,
        }}
        className='absolute  h-full overflow-hidden '
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
    </>
  );
}
