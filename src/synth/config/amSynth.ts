import * as Tone from '@src/tone';
import createConfig from '../createConfig';
import triggerSrcNode from '../triggerSrcNode';
import { zEnvelope } from './envelope';
import { zOmniOscillator } from './omniOscillator';
import { zBaseSynthSrc, zFrequency, zHarmonicity } from './shared';

export const amSynthConfig = createConfig(
  Tone.AMSynth,
  zBaseSynthSrc.extend({
    frequency: zFrequency,
    harmonicity: zHarmonicity,
    modulation: zOmniOscillator,
    modulationEnvelope: zEnvelope,
  }),
  { trigger: triggerSrcNode },
);
