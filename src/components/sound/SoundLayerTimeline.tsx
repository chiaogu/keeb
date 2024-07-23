import { SynthConfig } from '@src/synth';
import { zBaseSynthSrc } from '@src/synth/config/shared';
import { SoundConfig } from '@src/types';
import { getNumberDef, removeDefault } from '@src/utils/schema';
import { z } from 'zod';
import LabelField from '../shared/LabelField';
import SectionHeader from '../shared/SectionHeader';
import { findEnvelope } from '@src/utils/utils';
import Adsr from './Adsr';

type TimelineBlockProps = {
  synth: SynthConfig;
};

function TimelineBlock({ synth }: TimelineBlockProps) {
  const { duration, delay } = zBaseSynthSrc.parse(synth.src.data);
  const { max: maxDuration } = getNumberDef(
    removeDefault(zBaseSynthSrc.shape.duration) as z.ZodNumber,
  );
  const { max: maxDelay } = getNumberDef(
    removeDefault(zBaseSynthSrc.shape.delay) as z.ZodNumber,
  );
  const envelope = findEnvelope(synth);
  
  return (
    <div className='relative h-8 w-full'>
      <div className='absolute top-1/2 h-px w-full bg-black'></div>
      <div
        style={{
          width: `${Math.max(1, (duration / maxDuration / 2) * 100)}%`,
          left: `${(delay / maxDelay / 2) * 100}%`,
        }}
        className='absolute  h-full overflow-hidden bg-black'
      >
        {envelope && <Adsr envelope={envelope} maxDuration={maxDuration} />}
      </div>
    </div>
  );
}

type SoundLayerTimelineProps = {
  sound: SoundConfig;
};

export function SoundLayerTimeline({ sound }: SoundLayerTimelineProps) {
  return (
    <>
      <SectionHeader className='mt-4 font-bold' label='timeline' />
      {sound.synths.map((synth) => (
        <LabelField
          key={synth.id}
          label={synth.name}
          containerClassName='items-center mb-2'
        >
          <TimelineBlock synth={synth} />
        </LabelField>
      ))}
    </>
  );
}
