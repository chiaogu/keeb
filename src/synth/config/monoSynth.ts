import * as Tone from '@src/tone';
import createConfig from '../createConfig';
import triggerSrcNode from '../triggerSrcNode';
import { zEnvelope } from './envelope';
import { zFilter } from './filter';
import { zOmniOscillator } from './omniOscillator';
import { zBaseSynthSrc, zFrequency } from './shared';
import { calculateEnvelope } from '@src/utils/utils';

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
    setState(node, state, { duration }) {
      node.set({
        ...state,
        envelope: calculateEnvelope(state.envelope, duration),
        filterEnvelope: calculateEnvelope(state.filterEnvelope, duration),
      });
    },
  },
);
