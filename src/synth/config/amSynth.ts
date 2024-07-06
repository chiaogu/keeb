import * as Tone from '@src/tone';
import { SynthNodeConfig } from '.';
import withToneDefaults from '../withToneDefaults';
import { zEnvelope } from './envelope';
import { zOmniOscillator } from './omniOscillator';
import { zBaseSynthSrc, zFrequency, zHarmonicity } from './shared';

const zAmSynth = withToneDefaults(
  zBaseSynthSrc.extend({
    frequency: zFrequency,
    harmonicity: zHarmonicity,
    modulation: zOmniOscillator,
    modulationEnvelope: zEnvelope,
  }),
  Tone.AMOscillator,
);

export const amSynthConfig: SynthNodeConfig<Tone.AMSynth, typeof zAmSynth> = {
  schema: zAmSynth,
  createNode: () => new Tone.AMSynth(),
  trigger(node, state) {
    let frequency = state.frequency;
    frequency += Math.random() * 100;
    node.triggerAttackRelease(frequency, state.duration, `+${state.delay}`);
  },
};
