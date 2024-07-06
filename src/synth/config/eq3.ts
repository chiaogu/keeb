import * as Tone from '@src/tone';
import { z } from 'zod';
import createConfig from '../createConfig';
import createFxClass from '../createFxClass';
import { zBaseSynthFx, zFrequency } from './shared';

export const eq3Config = createConfig(
  createFxClass(Tone.EQ3),
  zBaseSynthFx.extend({
    low: z.number().min(-80).max(10),
    mid: z.number().min(-80).max(10),
    high: z.number().min(-80).max(10),
    lowFrequency: zFrequency,
    highFrequency: zFrequency,
  }),
);
