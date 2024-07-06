import { z } from 'zod';
import * as Tone from '@src/tone';
import { SynthNodeConfig } from '.';
import { zBaseSynthSrc, zFrequency } from './shared';

const zMembraneSynth = zBaseSynthSrc.extend({
  frequency: zFrequency,
  octaves: z.number().min(0.5).max(8).catch(1),
  pitchDecay: z.number().min(0).max(0.5).catch(0.05),
});

export const membraneSynthConfig: SynthNodeConfig<
  Tone.MembraneSynth,
  typeof zMembraneSynth
> = {
  schema: zMembraneSynth,
  createNode: () => new Tone.MembraneSynth(),
  trigger(node, state) {
    let frequency = state.frequency;
    frequency += Math.random() * 100;
    node.triggerAttackRelease(frequency, state.duration, `+${state.delay}`);
  },
};
