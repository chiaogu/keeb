import * as Tone from '@src/tone';
import createConfig from '../createConfig';
import triggerSrcNode from '../triggerSrcNode';
import { zEnvelope } from './envelope';
import { zOmniOscillator } from './omniOscillator';
import { zBaseSynthSrc, zFrequency } from './shared';

export const baseSynthConfig = createConfig(
  Tone.Synth,
  zBaseSynthSrc.extend({
    frequency: zFrequency,
    oscillator: zOmniOscillator,
    envelope: zEnvelope,
  }),
  {
    trigger: triggerSrcNode,
  },
);
