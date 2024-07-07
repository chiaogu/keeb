import * as Tone from '@src/tone';
import createConfig from '../createConfig';
import triggerSrcNode from '../triggerSrcNode';
import { zEnvelope } from './envelope';
import { zFilter } from './filter';
import { zOmniOscillator } from './omniOscillator';
import { zBaseSynthSrc, zFrequency } from './shared';

export const monoSynthConfig = createConfig(
  Tone.MonoSynth,
  zBaseSynthSrc.extend({
    frequency: zFrequency,
    oscillator: zOmniOscillator,
    envelope: zEnvelope,
    filter: zFilter,
    filterEnvelope: zEnvelope,
  }),
  {
    trigger: triggerSrcNode,
  },
);
