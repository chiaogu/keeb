import * as Tone from '@src/tone';
import { SynthNodeConfig } from '.';
import withToneDefaults from '../withToneDefaults';
import { zEnvelope } from './envelope';
import { zFilter } from './filter';
import { zOmniOscillator } from './omniOscillator';
import { zBaseSynthSrc, zFrequency } from './shared';

const zMonoSynth = withToneDefaults(
  zBaseSynthSrc.extend({
    frequency: zFrequency,
    oscillator: zOmniOscillator,
    envelope: zEnvelope,
    filter: zFilter,
    filterEnvelope: zEnvelope,
  }),
  Tone.AMOscillator,
);

export const monoSynthConfig: SynthNodeConfig<
  Tone.MonoSynth,
  typeof zMonoSynth
> = {
  schema: zMonoSynth,
  createNode: () => new Tone.MonoSynth(),
  trigger(node, state) {
    let frequency = state.frequency;
    frequency += Math.random() * 100;
    node.triggerAttackRelease(frequency, state.duration, `+${state.delay}`);
  },
};
