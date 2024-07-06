import * as Tone from '@src/tone';
import { z } from 'zod';
import createConfig from '../createConfig';
import createFxClass from '../createFxClass';
import { zBaseSynthFx } from './shared';

export const zCompressorSchema = z.object({
  attack: z.number().min(0).max(1),
  knee: z.number().min(0).max(40),
  ratio: z.number().min(1).max(20),
  release: z.number().min(0).max(1),
  threshold: z.number().min(-100).max(0),
});

export const compressorConfig = createConfig(
  createFxClass(Tone.Compressor),
  zBaseSynthFx.merge(zCompressorSchema),
);
