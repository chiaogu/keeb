import { z } from 'zod';
import * as Tone from '@src/tone';
import createConfig from '../createConfig';
import { zBaseSynthFx } from './shared';

export const chorusConfig = createConfig(
  Tone.Chorus,
  zBaseSynthFx.extend({
    delayTime: z.number().min(0).max(1000),
    feedback: z.number().min(0).max(1),
    spread: z.number().min(0).max(180),
    depth: z.number().min(0).max(1),
    frequency: z.number().min(0).max(1000),
    type: z.enum(['sawtooth', 'sine', 'square', 'triangle']),
  }),
  {
    createNode() {
      return new Tone.Chorus().start();
    },
  },
);
