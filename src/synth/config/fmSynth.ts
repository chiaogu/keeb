import { z } from 'zod';
import * as Tone from '@src/tone';
import { SynthNodeConfig } from '.';
import withToneDefaults from '../withToneDefaults';
import { zEnvelope } from './envelope';
import { zOmniOscillator } from './omniOscillator';
import { zBaseSynthSrc, zFrequency, zHarmonicity } from './shared';

const zFmSynth = withToneDefaults(
  zBaseSynthSrc.extend({
    frequency: zFrequency,
    harmonicity: zHarmonicity,
    oscillator: zOmniOscillator,
    envelope: zEnvelope,
    modulation: zOmniOscillator,
    modulationEnvelope: zEnvelope,
    modulationIndex: z.number().min(0.01).max(1000),
  }),
  Tone.FMOscillator,
);

export const fmSynthConfig: SynthNodeConfig<Tone.FMSynth, typeof zFmSynth> = {
  schema: zFmSynth,
  createNode: () => new Tone.FMSynth(),
  trigger(node, state) {
    let frequency = state.frequency;
    frequency += Math.random() * 100;
    node.triggerAttackRelease(frequency, state.duration, `+${state.delay}`);
  },
};
