import * as Tone from '@src/tone';
import { z } from 'zod';
import createConfig from '../createConfig';
import triggerSrcNode from '../triggerSrcNode';
import { zEnvelope } from './envelope';
import { zOmniOscillator } from './omniOscillator';
import { zBaseSynthSrc, zFrequency, zHarmonicity } from './shared';

export const fmSynthConfig = createConfig(
  Tone.FMSynth,
  zBaseSynthSrc.extend({
    frequency: zFrequency,
    harmonicity: zHarmonicity,
    oscillator: zOmniOscillator,
    envelope: zEnvelope,
    modulation: zOmniOscillator,
    modulationEnvelope: zEnvelope,
    modulationIndex: z.number().min(0.01).max(1000),
  }),
  { trigger: triggerSrcNode },
);
