import { SynthConfig } from '@src/synth';
import { zBaseSynthSrc } from '@src/synth/config/shared';
import { findEnvelope } from '@src/utils/utils';
import IconButton from '../shared/IconButton';
import Adsr from './Adsr';

type TimelineBlockProps = {
  synth: SynthConfig;
  maxDelayAndDuration: number;
  selected: boolean;
  onRemove: () => void;
  onClickWatch: () => void;
  onClickListen: () => void;
  removable: boolean;
};

export default function TimelineBlock({
  synth,
  maxDelayAndDuration,
  selected,
  onRemove,
  onClickWatch,
  onClickListen,
  removable,
}: TimelineBlockProps) {
  const { duration, delay } = zBaseSynthSrc.parse(synth.src.data);
  const envelope = findEnvelope(synth);

  return (
    <div className='mb-2 flex h-8 w-full items-center'>
      <div className='relative size-full cursor-pointer' onClick={onClickWatch}>
        <div className='absolute top-0 z-10 flex size-full shrink-0 items-center justify-end truncate whitespace-nowrap px-2 text-white mix-blend-difference'>
          {synth.name}
        </div>
        <div
          style={{
            width: `${Math.max(1, ((duration + delay) / maxDelayAndDuration) * 100)}%`,
          }}
          className='absolute bottom-0 size-full bg-white '
        ></div>
        <div
          style={{
            width: `${Math.max(1, (duration / maxDelayAndDuration) * 100)}%`,
            left: `${(delay / maxDelayAndDuration) * 100}%`,
          }}
          className='absolute  h-full overflow-hidden bg-white '
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
      <IconButton
        className={`ml-2 shrink-0 ${selected ? 'bg-white invert' : ''}`}
        icon='visibility'
        onClick={onClickWatch}
      />
      <IconButton
        className='ml-2 shrink-0'
        icon='hearing'
        onClick={onClickListen}
      />
      <IconButton
        style={{
          opacity: removable ? 1 : 0.3,
          pointerEvents: removable ? undefined : 'none',
        }}
        className='ml-2 shrink-0'
        icon='remove'
        onClick={onRemove}
      />
    </div>
  );
}
