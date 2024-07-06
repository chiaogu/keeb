import { z } from 'zod';
import * as Tone from '@src/tone';
import createConfig from '../createConfig';
import { zBaseSynthFx, zFrequency } from './shared';

export const phaserConfig = createConfig(
  Tone.Phaser,
  zBaseSynthFx.extend({
    Q: z.number().min(0).max(100),
    frequency: zFrequency,
    baseFrequency: zFrequency,
    octaves: z.number().min(0.5).max(8),
    stages: z.number().min(0).max(50),
  }),
);
