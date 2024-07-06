import * as Tone from '@src/tone';
import { z } from 'zod';
import { SynthNodeConfig } from '.';
import withToneDefaults from '../withToneDefaults';
import { zEnvelope } from './envelope';
import { zBaseSynthSrc, zFrequency, zHarmonicity } from './shared';

const zMetalSynth = withToneDefaults(
  zBaseSynthSrc.extend({
    frequency: zFrequency,
    harmonicity: zHarmonicity,
    modulationIndex: z.number().min(1).max(100),
    octaves: z.number().min(-10).max(10),
    resonance: z.number().min(0).max(7000),
    envelope: zEnvelope,
  }),
  Tone.MetalSynth,
);

export const metalSynthConfig: SynthNodeConfig<
  Tone.MetalSynth,
  typeof zMetalSynth
> = {
  schema: zMetalSynth,
  createNode: () => new Tone.MetalSynth(),
  trigger(node, state) {
    let frequency = state.frequency;
    frequency += Math.random() * 100;
    node.triggerAttackRelease(frequency, state.duration, `+${state.delay}`);
  },
};
