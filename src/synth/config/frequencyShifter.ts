import { z } from 'zod';
import * as Tone from '@src/tone';
import createConfig from '../createConfig';
import { zBaseSynthFx } from './shared';

export const frequencyShifterConfig = createConfig(
  Tone.FrequencyShifter,
  zBaseSynthFx.extend({
    frequency: z.number().min(-1000).max(1000),
  }),
);
