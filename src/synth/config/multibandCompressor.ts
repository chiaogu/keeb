import * as Tone from '@src/tone';
import createConfig from '../createConfig';
import createFxClass from '../createFxClass';
import { zCompressorSchema } from './compressor';
import { zBaseSynthFx, zFrequency } from './shared';

export const multibandCompressorConfig = createConfig(
  createFxClass(Tone.MultibandCompressor),
  zBaseSynthFx.extend({
    high: zCompressorSchema,
    low: zCompressorSchema,
    mid: zCompressorSchema,
    lowFrequency: zFrequency,
    highFrequency: zFrequency,
  }),
);
