import { SynthConfig } from '@src/synth';
import { zBaseSynthSrc } from '@src/synth/config/shared';
import { findEnvelope } from '@src/utils/utils';
import { useMemo } from 'react';
import IconButton from '../shared/IconButton';
import TimelineBlockEnvelope from './TimelineBlockEnvelope';
import { CONTROL_SHADOW } from '@src/utils/constants';

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
  return (
    <div className='mb-2 flex h-8 w-full items-center'>
      <div className='relative flex size-full cursor-pointer justify-end overflow-hidden' onClick={onClickWatch}>
        <div style={{ transform: 'translateY(-50%)' }} className='absolute top-1/2 z-10 max-w-full shrink-0 truncate whitespace-nowrap px-2 text-white mix-blend-difference'>
          {synth.name}
        </div>
        <TimelineBlockEnvelope
          synth={synth}
          maxDelayAndDuration={maxDelayAndDuration}
          bgStyle={{
            boxShadow: CONTROL_SHADOW,
            background: 'white',
          }}
        />
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
