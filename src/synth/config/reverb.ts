import * as Tone from '@src/tone';
import { MAX_SOUND_DURATION } from '@src/utils/constants';
import { z } from 'zod';
import createConfig from '../createConfig';
import { zBaseSynthFx } from './shared';

export const reverbConfig = createConfig(
  Tone.Reverb,
  zBaseSynthFx.extend({
    decay: z
      .number()
      .min(0.001)
      .max(MAX_SOUND_DURATION)
      .catch(MAX_SOUND_DURATION / 2),
    preDelay: z.number().min(0).max(0.5).catch(0.05),
  }),
  {
    ready: (node) => node.ready,
  },
);
