import * as Tone from '@src/tone';
import { z } from 'zod';
import createConfig from '../createConfig';
import triggerSrcNode from '../triggerSrcNode';
import { zEnvelope } from './envelope';
import { zBaseSynthSrc, zFrequency, zHarmonicity } from './shared';

export const metalSynthConfig = createConfig(
  Tone.MetalSynth,
  zBaseSynthSrc.extend({
    frequency: zFrequency,
    harmonicity: zHarmonicity,
    modulationIndex: z.number().min(1).max(100),
    octaves: z.number().min(-10).max(10),
    resonance: z.number().min(0).max(7000),
    envelope: zEnvelope,
  }),
  { trigger: triggerSrcNode },
);
