import { z } from 'zod';
import * as Tone from '@src/tone';
import createConfig from '../createConfig';
import createFxClass from '../createFxClass';
import { zBaseSynthFx } from './shared';

export const limiterConfig = createConfig(
  createFxClass(Tone.Limiter),
  zBaseSynthFx.extend({
    threshold: z.number().min(-100).max(0),
  }),
);
