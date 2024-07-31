import { SynthConfig } from '@src/synth';
import { zBaseSynthSrc } from '@src/synth/config/shared';
import { COLOR } from '@src/utils/constants';
import { findEnvelope } from '@src/utils/utils';
import IconButton from '../shared/IconButton';
import Adsr from './Adsr';

type TimelineBlockProps = {
  synth: SynthConfig;
  maxDelayAndDuration: number;
};

export default function TimelineBlock({
  synth,
  maxDelayAndDuration,
}: TimelineBlockProps) {
  const { duration, delay } = zBaseSynthSrc.parse(synth.src.data);
  const envelope = findEnvelope(synth);

  return (
    <div
      // style={{ background: COLOR.BG }}
      className='mb-2 flex h-8 w-full items-center'
    >
      <div className='mr-4 flex h-full shrink-0 items-center bg-white px-1'>
        {synth.name}
      </div>
      <div className='relative size-full'>
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
      </div>
      <IconButton className='ml-4 shrink-0' icon='remove' />
    </div>
  );
}
