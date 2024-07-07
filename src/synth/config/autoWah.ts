import * as Tone from '@src/tone';
import { MAX_SOUND_DURATION } from '@src/utils/constants';
import { z } from 'zod';
import createConfig from '../createConfig';
import { zBaseSynthFx, zFrequency } from './shared';

export const autoWahConfig = createConfig(
  Tone.AutoWah,
  zBaseSynthFx.extend({
    Q: z.number().min(0).max(100),
    baseFrequency: zFrequency,
    follower: z.number().min(0).max(MAX_SOUND_DURATION),
    gain: z.number().min(-80).max(2),
    octaves: z.number().min(0.5).max(8).catch(1),
    sensitivity: z.number().min(-80).max(0),
  }),
);
