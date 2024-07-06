import * as Tone from '@src/tone';
import { z } from 'zod';
import createConfig from '../createConfig';
import { zBaseSynthFx } from './shared';

export const tremoloConfig = createConfig(
  Tone.Tremolo,
  zBaseSynthFx.extend({
    depth: z.number().min(0).max(1),
    frequency: z.number().min(0).max(100),
    spread: z.number().min(0).max(180),
    type: z.enum(['sawtooth', 'sine', 'square', 'triangle']),
  }),
  {
    createNode() {
      return new Tone.Tremolo().start();
    },
  },
);
