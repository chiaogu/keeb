import * as Tone from '@src/tone';
import { MAX_SOUND_DURATION } from '@src/utils/constants';
import { z } from 'zod';
import createConfig from '../createConfig';
import { zBaseSynthFx } from './shared';

export const vibratoConfig = createConfig(
  Tone.Vibrato,
  zBaseSynthFx.extend({
    depth: z.number().min(0).max(1),
    frequency: z.number().min(0).max(100),
    maxDelay: z.number().min(0).max(MAX_SOUND_DURATION),
    type: z.enum(['sawtooth', 'sine', 'square', 'triangle']),
  }),
);
