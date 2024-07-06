import * as Tone from '@src/tone';
import { removeDefault } from '@src/utils/schema';
import { z } from 'zod';
import createConfig from '../createConfig';
import createFxClass from '../createFxClass';
import { zEnvelope } from './envelope';
import { zBaseSynthFx } from './shared';

export const amplitudeEnvelopeConfig = createConfig(
  createFxClass(Tone.AmplitudeEnvelope),
  zBaseSynthFx.merge(removeDefault(zEnvelope) as z.AnyZodObject),
  {
    trigger(node, _state, src) {
      node.triggerAttackRelease(src.duration, src.delay);
    },
  },
);
