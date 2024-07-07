import * as Tone from '@src/tone';
import { z } from 'zod';
import createConfig from '../createConfig';
import triggerSrcNode from '../triggerSrcNode';
import { zBaseSynthSrc, zFrequency } from './shared';

export const membraneSynthConfig = createConfig(
  Tone.MembraneSynth,
  zBaseSynthSrc.extend({
    frequency: zFrequency,
    octaves: z.number().min(0.5).max(8).catch(1),
    pitchDecay: z.number().min(0).max(0.5).catch(0.05),
  }),
  { trigger: triggerSrcNode },
);
