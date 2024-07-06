import * as Tone from '@src/tone';
import { z } from 'zod';
import createConfig from '../createConfig';
import { zBaseSynthFx, zOversample } from './shared';

export const distortionConfig = createConfig(
  Tone.Distortion,
  zBaseSynthFx.extend({
    distortion: z.number().min(0).max(1),
    oversample: zOversample,
  }),
);
