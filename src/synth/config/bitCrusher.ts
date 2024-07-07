import * as Tone from '@src/tone';
import { z } from 'zod';
import createConfig from '../createConfig';
import { zBaseSynthFx } from './shared';

export const bitCrusherConfig = createConfig(
  Tone.BitCrusher,
  zBaseSynthFx.extend({
    bits: z.number().min(1).max(16).catch(8),
  }),
);
